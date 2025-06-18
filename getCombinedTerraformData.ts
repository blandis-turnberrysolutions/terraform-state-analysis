import * as accuterraformCrossEnvNonProd from './terraform-state/accu-terraform-cross-env-non-prod.json' with {type: 'json'};
import * as accuterraformPerEnvDev from './terraform-state/accu-terraform-per-env-dev.json' with {type: 'json'};
import * as accuterraformPerEnvQa from './terraform-state/accu-terraform-per-env-qa.json' with {type: 'json'};
import * as accuterraformPerEnvUat from './terraform-state/accu-terraform-per-env-uat.json' with {type: 'json'};
import * as servercoreBaseInfraDev from './terraform-state/server-core-base-infra-dev.json' with {type: 'json'};
import * as servercoreBaseInfraQa from './terraform-state/server-core-base-infra-qa.json' with {type: 'json'};
import * as servercoreBaseInfraUat from './terraform-state/server-core-base-infra-uat.json' with {type: 'json'};
import * as servercoreCrossAccountNonProd from './terraform-state/server-core-cross-account-non-prod.json' with {type: 'json'};
import * as customerPortalDev from './terraform-state/customer-portal-dev.json' with {type: 'json'};
import * as customerPortalQa from './terraform-state/customer-portal-qa.json' with {type: 'json'};
import * as customerPortalUat from './terraform-state/customer-portal-uat.json' with {type: 'json'};

import * as z from 'zod';

export function getCombinedTerraformData(){
const resourceSchema = z.object({
    name: z.string(),
    type: z.string(),
    provider: z.string(),
    instances: z.array(z.object({
        attributes: z.object({
            arn: z.string().optional(),
            id: z.string().optional(),
            name: z.string().optional(),
        })
    }))
});

const schema = z.object({
  default: z.object({resources: z.array(
    resourceSchema
  ),
})});

const accuterraformCrossEnvNonProdData = schema.parse(accuterraformCrossEnvNonProd);
const accuterraformPerEnvDevData = schema.parse(accuterraformPerEnvDev);
const accuterraformPerEnvQaData = schema.parse(accuterraformPerEnvQa);
const accuterraformPerEnvUatData = schema.parse(accuterraformPerEnvUat);
const servercoreBaseInfraDevData = schema.parse(servercoreBaseInfraDev);
const servercoreBaseInfraQaData = schema.parse(servercoreBaseInfraQa);
const servercoreBaseInfraUatData = schema.parse(servercoreBaseInfraUat);
const servercoreCrossAccountNonProdData = schema.parse(servercoreCrossAccountNonProd);
const customerPortalDevData = schema.parse(customerPortalDev);
const customerPortalQaData = schema.parse(customerPortalQa);
const customerPortalUatData = schema.parse(customerPortalUat);

return accuterraformCrossEnvNonProdData.default.resources
.concat(accuterraformPerEnvDevData.default.resources)
.concat(accuterraformPerEnvQaData.default.resources)
.concat(accuterraformPerEnvUatData.default.resources)
.concat(servercoreBaseInfraDevData.default.resources)
.concat(servercoreBaseInfraQaData.default.resources)
.concat(servercoreBaseInfraUatData.default.resources)
.concat(servercoreCrossAccountNonProdData.default.resources)
.concat(customerPortalDevData.default.resources)
.concat(customerPortalQaData.default.resources)
.concat(customerPortalUatData.default.resources)
.flat();
}