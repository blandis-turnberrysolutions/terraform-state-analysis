import {
  LambdaClient,
  ListFunctionsCommand,
} from "@aws-sdk/client-lambda";
import { getCombinedTerraformData } from "./getCombinedTerraformData.ts";

const combinedData = getCombinedTerraformData().flatMap(r => r.instances.map(i => ({
    id: i.attributes.id,
    type: r.type,
    provider: r.provider,
    arn: i.attributes.arn
})));

const lambdaClient = new LambdaClient({});
const awsResponse = await lambdaClient.send(new ListFunctionsCommand());
const functionsFromAws = awsResponse.Functions ?? [];
const functionsFromTerraform = combinedData.filter(r => r.type === "aws_lambda_function");

const functionNamesFromAws = new Set(functionsFromAws.map(b => b.FunctionName ?? "") ?? []);
const functionNamesFromTerraform = new Set(functionsFromTerraform.map(r => r.id));

console.log(functionNamesFromAws.difference(functionNamesFromTerraform));
console.log(functionNamesFromTerraform.difference(functionNamesFromAws));