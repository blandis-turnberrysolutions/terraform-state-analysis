import { getCombinedTerraformData } from "./getCombinedTerraformData.ts";

const combinedData = getCombinedTerraformData().flatMap(r => r.instances.map(i => ({
    name: i.attributes.id,
    type: r.type,
    provider: r.provider,
    arn: i.attributes.arn
})));

[...new Set(combinedData.map(r => r.type))].sort((a,b) => {
    if(a < b) return -1;
    if(a > b) return 1;
    return 0;
}).map(r => console.log(r));