import { getCombinedTerraformData } from "./getCombinedTerraformData.ts";

const combinedData = getCombinedTerraformData().flatMap(r => r.instances.map(i => ({
    name: i.attributes.id,
    type: r.type,
    provider: r.provider,
    arn: i.attributes.arn
})));

[...new Set(combinedData.map(r => r.type))].map(r => console.log(r));