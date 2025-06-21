import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import * as path from "path";
import { Construct } from "constructs";

export function createStrandOrchestratorAgentDockerAsset(
  scope: Construct
): DockerImageAsset {
  return new DockerImageAsset(scope, "strand-orchestrator-agent", {
    directory: path.join(__dirname, "../docker-image-source"),
  });
}
