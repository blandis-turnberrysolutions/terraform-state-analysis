import {
  S3Client,
  ListBucketsCommand,
} from "@aws-sdk/client-s3";
import { getCombinedTerraformData } from "./getCombinedTerraformData.ts";

const combinedData = getCombinedTerraformData().flatMap(r => r.instances.map(i => ({
    id: i.attributes.id,
    type: r.type,
    provider: r.provider,
    arn: i.attributes.arn
})));

const s3Client = new S3Client({});
const awsResponse = await s3Client.send(new ListBucketsCommand());
const bucketsFromAws = awsResponse.Buckets ?? [];
const bucketsFromTerraform = combinedData.filter(r => r.type === "aws_s3_bucket");

const bucketNamesFromAws = new Set(bucketsFromAws.map(b => b.Name ?? "") ?? []);
const bucketNamesFromTerraform = new Set(bucketsFromTerraform.map(r => r.id));

console.log(bucketNamesFromAws.difference(bucketNamesFromTerraform));
console.log(bucketNamesFromTerraform.difference(bucketNamesFromAws));