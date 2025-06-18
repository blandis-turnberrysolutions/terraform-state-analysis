import { getCombinedTerraformData } from "./getCombinedTerraformData.ts";

const combinedData = getCombinedTerraformData().flatMap(r => r.instances.map(i => ({
    id: i.attributes.id,
    type: r.type,
    provider: r.provider,
    arn: i.attributes.arn
})));

combinedData.sort((a, b) => {
    if(a.type < b.type) return -1;
    if(a.type > b.type) return 1;
    return 0;
}).map(r => console.log(r.type + " " + r.id));