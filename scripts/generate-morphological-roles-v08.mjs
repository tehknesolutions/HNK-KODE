import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const src = JSON.parse(fs.readFileSync(new URL('data/lexicon/haKodan-mora-kodin-phonological-v0.7.json', root)));
const roles = ['ACTION','ENTITY','STATE','DATA','AGENT','OPERATOR','COLLECTION','TARGET'];
const action = new Set('CREATE DEFINE ALTER REMOVE TRANSFORM CONNECT ASSOCIATE ACTIVATE DEACTIVATE EXECUTE RETURN MANIFEST VALIDATE IMPORT EXPORT LOAD SAVE REGISTER OBSERVE EMIT READ WRITE EDIT START END'.split(' '));
const state = new Set('STATE CONDITION LOCAL EXTERNAL PRIVATE PUBLIC SECURE'.split(' '));
const data = new Set('NAME IDENTIFIER VALUE PROPERTY ATTRIBUTE PARAMETER ARGUMENT SOURCE CONTEXT VERSION PROFILE META DATA MEMORY FILE DOCUMENT RECORD CACHE HISTORY PROVENANCE PROMPT INTENT GOAL PLAN TASK RULE POLICY INSTRUCTION DESIGN VISUAL LAYOUT STYLE COLOR FORM IMAGE VIDEO AUDIO TEXT'.split(' '));
const agent = new Set('AGENT AI SPECIALIST MASTER ROLE'.split(' '));
const operator = new Set('WHEN IF ELSE FOR EACH WHILE THEN ALLOW DENY ACCESS PERMISSION'.split(' '));
const collection = new Set('COLLECTION LIST MAP DATABASE'.split(' '));
const target = new Set('TARGET CAPABILITY'.split(' '));
function role(id){ if(action.has(id))return 'ACTION'; if(state.has(id))return 'STATE'; if(data.has(id))return 'DATA'; if(agent.has(id))return 'AGENT'; if(operator.has(id))return 'OPERATOR'; if(collection.has(id))return 'COLLECTION'; if(target.has(id))return 'TARGET'; return 'ENTITY'; }
const assignments=src.selected.map(x=>({semanticId:x.semanticId,role:role(x.semanticId),familyId:x.familyId,familyRoot:x.familyRoot,selected:x.selected,status:'DISCOVERY_NON_CANONICAL',canon:false}));
const out={schemaVersion:'HAKODAN-MORPHOLOGICAL-ROLES/V0.8',status:'DISCOVERY_NON_CANONICAL',source:'haKodan-mora-kodin-phonological-v0.7.json',roles,concepts:assignments.length,canonPromotions:0,assignments};
fs.writeFileSync(new URL('data/lexicon/haKodan-morphological-roles-v0.8.json',root),JSON.stringify(out,null,2)+'\n');