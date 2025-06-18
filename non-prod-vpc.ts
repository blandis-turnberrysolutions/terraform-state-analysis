import {
  DescribeVpcsCommand,
  EC2Client,
} from "@aws-sdk/client-ec2";
import { getCombinedTerraformData } from "./getCombinedTerraformData.ts";

const ec2Client = new EC2Client({});

const combinedData = getCombinedTerraformData().flatMap(r => r.instances.map(i => ({
    name: i.attributes.id,
    type: r.type,
    provider: r.provider,
    arn: i.attributes.arn
})));

const awsResponse = await ec2Client.send(new DescribeVpcsCommand());

const vpcsFromAws = awsResponse.Vpcs ?? [];
const vpcsFromTerraform = combinedData.filter(r => r.type === "aws_vpc");

const vpcNamesFromAws = new Set(vpcsFromAws.map(b => b.VpcId ?? "") ?? []);
const vpcNamesFromTerraform = new Set(vpcsFromTerraform.map(r => r.name));

console.log(vpcNamesFromAws.difference(vpcNamesFromTerraform));
console.log(vpcNamesFromTerraform.difference(vpcNamesFromAws));