import {
  ECSClient,
  ListClustersCommand,
} from "@aws-sdk/client-ecs";
import { getCombinedTerraformData } from "./getCombinedTerraformData.ts";

const combinedData = getCombinedTerraformData().flatMap(r => r.instances.map(i => ({
    id: i.attributes.id,
    type: r.type,
    provider: r.provider,
    arn: i.attributes.arn
})));

const ecsClient = new ECSClient({});
const awsResponse = await ecsClient.send(new ListClustersCommand());

const ecsClustersFromAws = awsResponse.clusterArns ?? [];
const ecsClustersFromTerraform = combinedData.filter(r => r.type === "aws_ecs_cluster");

var ecsClusterArnsFromAws = new Set(ecsClustersFromAws);
const ecsClusterArnsFromTerraform = new Set(ecsClustersFromTerraform.map(r => r.id));

console.log(ecsClusterArnsFromAws.difference(ecsClusterArnsFromTerraform));
console.log(ecsClusterArnsFromTerraform.difference(ecsClusterArnsFromAws));