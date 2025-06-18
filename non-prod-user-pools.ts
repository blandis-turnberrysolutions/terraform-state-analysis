import {
CognitoIdentityProviderClient,
paginateListUserPools
} from "@aws-sdk/client-cognito-identity-provider";
import { getCombinedTerraformData } from "./getCombinedTerraformData.ts";

const combinedData = getCombinedTerraformData().flatMap(r => r.instances.map(i => ({
    name: i.attributes.name,
    type: r.type,
    provider: r.provider,
    arn: i.attributes.arn
})));

const cognitoClient = new CognitoIdentityProviderClient({});

const paginator = paginateListUserPools({ client: cognitoClient }, {MaxResults: 60});

const userPoolNames = [];

for await (const page of paginator) {
    const names = (page.UserPools ?? []).map((pool) => pool.Name);
    userPoolNames.push(...names);
}

const userPoolsFromTerraform = combinedData.filter(r => r.type === "aws_cognito_user_pool");

var userPoolNamesFromAws = new Set(userPoolNames);
const userPoolNamesFromTerraform = new Set(userPoolsFromTerraform.map(r => r.name));

console.log(userPoolNamesFromAws.difference(userPoolNamesFromTerraform));
console.log(userPoolNamesFromTerraform.difference(userPoolNamesFromAws));