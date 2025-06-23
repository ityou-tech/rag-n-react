import * as path from "path";
import { Construct } from "constructs";
import { Stack, StackProps, Duration, RemovalPolicy } from "aws-cdk-lib";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { Vpc, SecurityGroup, Port, SubnetType } from "aws-cdk-lib/aws-ec2";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import {
  ApplicationLoadBalancer,
  ApplicationTargetGroup,
  TargetType,
  ApplicationProtocol,
  ListenerAction,
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";

export class OrchestratorAgentFargateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create Docker image asset
    const dockerImageAsset = new DockerImageAsset(
      this,
      "OrchestratorAgentDocker",
      {
        directory: path.join(__dirname, "docker/docker-image-source"),
        platform: Platform.LINUX_AMD64,
      }
    );

    // Create VPC
    const vpc = new Vpc(this, "OrchestratorVpc", {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "Public",
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "Private",
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    // Create ECS Cluster
    const cluster = new ecs.Cluster(this, "OrchestratorCluster", {
      vpc,
      clusterName: "orchestrator-agent-cluster",
    });

    // Create CloudWatch Log Group
    const logGroup = new LogGroup(this, "OrchestratorLogGroup", {
      logGroupName: "/ecs/orchestrator-agent",
      retention: RetentionDays.ONE_WEEK,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create container image from Docker asset
    const image = ecs.ContainerImage.fromDockerImageAsset(dockerImageAsset);

    // Create Fargate Task Definition
    const taskDef = new ecs.FargateTaskDefinition(this, "TaskDef", {
      cpu: 512,
      memoryLimitMiB: 1024,
    });

    // Add container to task definition
    const container = taskDef.addContainer("web", {
      image,
      logging: ecs.LogDriver.awsLogs({
        logGroup,
        streamPrefix: "orchestrator",
      }),
      environment: {
        PYTHONPATH: "/app",
        PYTHONUNBUFFERED: "1",
      },
      healthCheck: {
        command: [
          "CMD-SHELL",
          "curl -f http://localhost:8080/health || exit 1",
        ],
        interval: Duration.seconds(30),
        timeout: Duration.seconds(5),
        retries: 3,
      },
    });

    // Add port mapping
    container.addPortMappings({
      containerPort: 8080,
      protocol: ecs.Protocol.TCP,
    });

    // Create Security Group for the service
    const serviceSecurityGroup = new SecurityGroup(
      this,
      "OrchestratorServiceSG",
      {
        vpc,
        description: "Security group for Orchestrator Agent service",
        allowAllOutbound: true,
      }
    );

    // Create Security Group for the load balancer
    const albSecurityGroup = new SecurityGroup(this, "OrchestratorALBSG", {
      vpc,
      description: "Security group for Orchestrator Agent ALB",
      allowAllOutbound: true,
    });

    // Allow HTTP traffic to ALB from anywhere
    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP traffic"
    );

    // Allow traffic from ALB to service
    serviceSecurityGroup.addIngressRule(
      albSecurityGroup,
      Port.tcp(8080),
      "Allow traffic from ALB"
    );

    // Create Application Load Balancer
    const alb = new ApplicationLoadBalancer(this, "OrchestratorALB", {
      vpc,
      internetFacing: true,
      securityGroup: albSecurityGroup,
      loadBalancerName: "orchestrator-agent-alb",
    });

    // Create Target Group
    const targetGroup = new ApplicationTargetGroup(
      this,
      "OrchestratorTargetGroup",
      {
        vpc,
        port: 8080,
        protocol: ApplicationProtocol.HTTP,
        targetType: TargetType.IP,
        healthCheck: {
          enabled: true,
          healthyHttpCodes: "200",
          interval: Duration.seconds(30),
          timeout: Duration.seconds(5),
          healthyThresholdCount: 2,
          unhealthyThresholdCount: 3,
          path: "/health",
        },
      }
    );

    // Add listener to ALB
    alb.addListener("OrchestratorListener", {
      port: 80,
      protocol: ApplicationProtocol.HTTP,
      defaultAction: ListenerAction.forward([targetGroup]),
    });

    // Create Fargate Service
    const service = new ecs.FargateService(this, "Service", {
      cluster,
      taskDefinition: taskDef,
      desiredCount: 2,
      assignPublicIp: false,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [serviceSecurityGroup],
      enableExecuteCommand: true,
    });

    // Attach the service to the target group
    service.attachToApplicationTargetGroup(targetGroup);

    // Auto Scaling
    const scaling = service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 10,
    });

    // Scale based on CPU utilization
    scaling.scaleOnCpuUtilization("CpuScaling", {
      targetUtilizationPercent: 70,
      scaleInCooldown: Duration.minutes(5),
      scaleOutCooldown: Duration.minutes(2),
    });

    // Scale based on memory utilization
    scaling.scaleOnMemoryUtilization("MemoryScaling", {
      targetUtilizationPercent: 80,
      scaleInCooldown: Duration.minutes(5),
      scaleOutCooldown: Duration.minutes(2),
    });
  }
}
