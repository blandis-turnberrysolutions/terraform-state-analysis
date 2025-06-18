import {
  paginateListQueues,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { getCombinedTerraformData } from "./getCombinedTerraformData.ts";

const combinedData = getCombinedTerraformData().flatMap(r => r.instances.map(i => ({
    id: i.attributes.id,
    type: r.type,
    provider: r.provider,
    arn: i.attributes.arn
})));

const sqsClient = new SQSClient({});
const paginatedListQueues = paginateListQueues({ client: sqsClient }, {});

const urls: string[] = [];
for await (const page of paginatedListQueues) {
  const nextUrls = page.QueueUrls?.filter((qurl) => !!qurl) || [];
  urls.push(...nextUrls);
}

const sqsQueuesFromTerraform = combinedData.filter(r => r.type === "aws_sqs_queue");

var sqsQueueUrlsFromAws = new Set(urls);
const sqsQueueUrlsFromTerraform = new Set(sqsQueuesFromTerraform.map(r => r.id));

console.log(sqsQueueUrlsFromAws.difference(sqsQueueUrlsFromTerraform));
console.log(sqsQueueUrlsFromTerraform.difference(sqsQueueUrlsFromAws));