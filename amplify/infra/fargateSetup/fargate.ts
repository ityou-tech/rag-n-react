import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsp from "aws-cdk-lib/aws-ecs-patterns";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { DockerImageAsset, Platform } from "aws-cdk-lib/aws-ecr-assets";
import * as logs from "aws-cdk-lib/aws-logs";
import * as path from "path";

export class OrchestratorStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* 1 – VPC: public + isolated, no NAT */
    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        { name: "Public", subnetType: ec2.SubnetType.PUBLIC }, // ALB
        { name: "Isolated", subnetType: ec2.SubnetType.PRIVATE_ISOLATED }, // Fargate
      ],
    });

    /* 2 – Private connectivity: interface + gateway endpoints */
    [
      ec2.InterfaceVpcEndpointAwsService.ECR, // auth API
      ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER, // registry
      ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    ].forEach((svc, i) =>
      vpc.addInterfaceEndpoint(`VPCE${i}`, { service: svc })
    );

    vpc.addGatewayEndpoint("S3Endpoint", {
      // ECR layer blobs
      service: ec2.GatewayVpcEndpointAwsService.S3,
      // default route tables = all subnets
    });

    /* 3 – Docker image built at deploy */
    const asset = new DockerImageAsset(this, "Image", {
      directory: path.join(__dirname, "docker/docker-image-source"),
      platform: Platform.LINUX_AMD64,
    });

    /* 4 – One-liner Fargate service + ALB */
    const albSvc = new ecsp.ApplicationLoadBalancedFargateService(this, "Svc", {
      vpc,
      cpu: 512,
      memoryLimitMiB: 1024,
      desiredCount: 2,
      publicLoadBalancer: true,

      /** Tasks live in *isolated* subnets – no public IP, no NAT */
      taskSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },

      taskImageOptions: {
        image: ecs.ContainerImage.fromDockerImageAsset(asset),
        containerPort: 8080,

        /* Structured AWS Logs output */
        logDriver: ecs.LogDriver.awsLogs({
          streamPrefix: "orchestrator-agent",
          logRetention: logs.RetentionDays.ONE_WEEK,
        }),

        environment: { PYTHONPATH: "/app", PYTHONUNBUFFERED: "1" },
      },
    });

    /* Add health check to the container after service creation */
    const containerDef = albSvc.taskDefinition.defaultContainer;
    if (containerDef) {
      containerDef.addHealthCheck({
        command: [
          "CMD-SHELL",
          "python3 -c \"import urllib.request,sys; urllib.request.urlopen('http://localhost:8080/health')\"",
        ],
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(10),
        retries: 3,
        startPeriod: cdk.Duration.seconds(60),
      });
    }

    /* 5 – Target-group health check */
    albSvc.targetGroup.configureHealthCheck({
      path: "/health",
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3,
      timeout: cdk.Duration.seconds(10),
      interval: cdk.Duration.seconds(30),
    });

    /* 6 – Auto-scaling */
    const scaling = albSvc.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 10,
    });
    scaling.scaleOnCpuUtilization("Cpu70", { targetUtilizationPercent: 70 });
    scaling.scaleOnMemoryUtilization("Mem80", { targetUtilizationPercent: 80 });
  }
}
