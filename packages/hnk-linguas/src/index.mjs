import { HNK40_STATUS, getGlyph, transliterationToGlyphIds } from '@hnk/glyphs';

export const HNK_MASTER_LEXICON_VERSION='1.0.0-preproduction';
export const HNK_MASTER_LEXICON_STATUS='RECOVERED_BETA_REGISTRY';
export const HNK_MASTER_LEXICON_SOURCE='PROJECT_RECOVERY_2026-09-08';
export const HNK_MASTER_LEXICON_GOVERNANCE=Object.freeze({glyphAuthority:'G-ID',visualState:HNK40_STATUS,visualPromotion:'HUMAN_GATE_REQUIRED',policy:'FROZEN, WATCH, CANDIDATE, GATE, BRIDGE and REFERENCE must remain distinct.'});

const RAW_LEXEMES=[
['LEX-001','VAMAKALA',{pt:'apelido / nome familiar',en:'nickname / familiar name'},'FROZEN','BETA-FROZEN',['L01'],'RECOVERED'],
['LEX-002','SARADAYA',{pt:'origem / local de nascimento',en:'origin / birthplace'},'FROZEN','BETA-FROZEN',['L01'],'RECOVERED'],
['LEX-003','VALIVAN',{pt:'escritório',en:'office'},'FROZEN','INHERITED-BETA-FROZEN',['L01','L03'],'RECOVERED'],
['LEX-004','PARAZAMO',{pt:'escola / domínio de estudo',en:'school / study domain'},'FROZEN','BETA-FROZEN',['L01','L03'],'RECOVERED'],
['LEX-005','VAMUSARO',{pt:'descanso / período de lazer',en:'rest / leisure period'},'FROZEN','BETA-FROZEN',['L01'],'RECOVERED'],
['LEX-006','SARASALA',{pt:'tempo / duração',en:'time / duration'},'WATCH','BETA-FROZEN-WATCH',['L01'],'RECOVERED'],
['LEX-007','VAMAVALA',{pt:'hobby / atividade de prazer',en:'hobby / pleasure activity'},'WATCH','BETA-FROZEN-WATCH',['L01'],'RECOVERED'],
['LEX-008','VAMAZAMU',{pt:'canto / expressão harmônica',en:'singing / harmonic expression'},'WATCH','BETA-FROZEN-WATCH',['L01'],'RECOVERED'],
['LEX-009','TAYOVAN',{pt:'cidade',en:'city'},'FROZEN','FROZEN-L02-H10.1',['L02'],'RECOVERED'],
['LEX-010','KALOVALA',{pt:'edifício / prédio',en:'building'},'FROZEN','FROZEN-L02-H10.1',['L02'],'RECOVERED'],
['LEX-011','PAROVAN',{pt:'biblioteca',en:'library'},'FROZEN','BETA-FROZEN',['L02'],'RECOVERED'],
['LEX-012','PARAZAMI',{pt:'estudo / estudar',en:'study'},'WATCH','BETA-FROZEN-WATCH',['L02','L03'],'RECOVERED'],
['LEX-013','VALI',{pt:'trabalho / trabalhar',en:'work'},'FROZEN','INHERITED-BETA-FROZEN',['L02','L03'],'RECOVERED'],
['LEX-014','SAROSARI',{pt:'viagem / viajar',en:'travel'},'WATCH','INHERITED-BETA-FROZEN-WATCH',['L02','L04'],'RECOVERED'],
['LEX-015','PARI',{pt:'ver',en:'see'},'WATCH','INHERITED-FUNCTIONAL-WATCH',['L02'],'RECOVERED'],
['LEX-016','DAYI',{pt:'querer / intenção',en:'want / intention'},'CANDIDATE','L03-CANDIDATE',['L03'],'PARTIAL'],
['LEX-017','SALI',{pt:'precisar',en:'need'},'WATCH','L03-WATCH',['L03'],'RECOVERED'],
['LEX-018','SARU',{pt:'todos os dias / habitualidade',en:'every day / habituality'},'WATCH','L03-WATCH',['L03'],'RECOVERED'],
['LEX-019','TA',{pt:'destino / propósito',en:'destination / purpose'},'CANDIDATE','L03-CANDIDATE',['L03'],'PARTIAL'],
['LEX-020','PA',{pt:'ontem',en:'yesterday'},'WATCH','L02-WATCH',['L02'],'RECOVERED'],
['LEX-021','PAPA',{pt:'termo parental PAPA (uso informal em teste)',en:'PAPA parental term (informal-only gate)'},'GATE','L04-INFORMAL-ONLY',['L04'],'PARTIAL'],
['LEX-022','MAMA',{pt:'termo parental MAMA (uso informal em teste)',en:'MAMA parental term (informal-only gate)'},'GATE','L04-INFORMAL-ONLY',['L04'],'PARTIAL'],
['LEX-023','VAMATAYA',{pt:'festa (candidato)',en:'party (candidate)'},'CANDIDATE','CANDIDATE',[],'PARTIAL'],
['LEX-024','KALIFORNIA',{pt:'Califórnia — ponte de nome próprio',en:'California — proper-name bridge'},'BRIDGE','PROPER-NAME-BRIDGE',[],'RECOVERED'],
['LEX-025','VAME',{pt:'gostar / like em leitura literal',en:'literal like'},'GATE','L04-GATE',['L04'],'PARTIAL'],
['LEX-026','ON',{pt:'pronome / referente em teste',en:'pronoun / referent under test'},'GATE','L04-GATE',['L04'],'PARTIAL'],
['LEX-027','BANKA',null,'GATE','L04-SCOPE-GATE',['L04'],'UNRECOVERED'],
['LEX-028','VANUVALAKALU',null,'GATE','L04-LENGTH-FAILURE',['L04'],'UNRECOVERED'],
['LEX-029','SAROSAL',null,'GATE','OBSERVED-CONFUSION-FORM',['L04'],'UNRECOVERED'],
['LEX-030','VANUVALI',null,'GATE','OBSERVED-WATCH-FORM',['L02','L04'],'UNRECOVERED'],
['LEX-031','VANI',null,'WATCH','L02-WATCH-FORM',['L02'],'UNRECOVERED'],
['LEX-032','PITSA',{pt:'pizza',en:'pizza'},'FROZEN','LOAN-FROZEN',['L02'],'RECOVERED'],
['LEX-033','HENUVOKODAN',{pt:'nome do idioma / sistema HNK',en:'name of the HNK language / system'},'REFERENCE','SYSTEM-NAME',['L01'],'RECOVERED']
].map(([id,transliteration,meaning,authority,legacyStatus,lessons,certainty])=>({id,transliteration,meaning,authority,legacyStatus,lessons,certainty,notes:[]}));
RAW_LEXEMES.find(x=>x.id==='LEX-024').glyphIdsOverride=['G23','G01','G14','G03','G25','G04','G15','G12','G03','G01'];

const RAW_PHRASES=[
['PHR-001','KALA YA EN ES KU KE',{pt:'Qual é o seu nome?',en:'What is your name?'},'APPROXIMATE'],
['PHR-002','AN ZAMI ZAMO',{pt:'Eu falo / uso linguagem.',en:'I speak / use language.'},'APPROXIMATE'],
['PHR-003','EN ZAMI HENUVOKODAN KE',{pt:'Você fala HENUVOKODAN?',en:'Do you speak HENUVOKODAN?'},'APPROXIMATE'],
['PHR-004','EN SARI LO KU KE',null,'UNRECOVERED'],['PHR-005','EN DA KU KE',null,'UNRECOVERED'],['PHR-006','EN ZAMI KU ZAMO KE',null,'UNRECOVERED'],['PHR-007','AN ZAMI HENUVOKODAN',null,'UNRECOVERED']
].map(([id,transliteration,meaning,certainty])=>({id,transliteration,meaning,certainty,status:'RECOVERED',lessons:['L01'],notes:[]}));
function freezeMeaning(value){return value?Object.freeze({...value}):null}
function compileLexeme(raw){const {glyphIdsOverride,...publicRaw}=raw;let glyphIds,encodingMode='SAFE_TRANSLITERATION';if(glyphIdsOverride){glyphIds=glyphIdsOverride.map(g=>getGlyph(g).glyphId);encodingMode='EXPLICIT_BRIDGE'}else glyphIds=transliterationToGlyphIds(raw.transliteration,{strict:true}).glyphIds.filter(g=>g!=='SPACE');const ipaSegments=glyphIds.map(g=>getGlyph(g).phonemeIpa);return Object.freeze({...publicRaw,meaning:freezeMeaning(raw.meaning),lessons:Object.freeze([...raw.lessons]),notes:Object.freeze([...raw.notes]),glyphIds:Object.freeze(glyphIds),encodingMode,ipaSegments:Object.freeze(ipaSegments),ipa:ipaSegments.join('')})}
function compilePhrase(raw){const glyphIds=Object.freeze([...transliterationToGlyphIds(raw.transliteration,{includeSpaces:true,strict:true}).glyphIds]);const ipa=glyphIds.map(g=>g==='SPACE'?' ':getGlyph(g).phonemeIpa).join('');return Object.freeze({...raw,meaning:freezeMeaning(raw.meaning),lessons:Object.freeze([...raw.lessons]),notes:Object.freeze([...raw.notes]),glyphIds,ipa})}
export const HNK_MASTER_LEXICON=Object.freeze(RAW_LEXEMES.map(compileLexeme));
export const HNK_MASTER_PHRASES=Object.freeze(RAW_PHRASES.map(compilePhrase));
export const HNK_MASTER_LEXICON_BY_FORM=Object.freeze(Object.fromEntries(HNK_MASTER_LEXICON.map(e=>[e.transliteration,e])));
export const HNK_MASTER_PHRASES_BY_ID=Object.freeze(Object.fromEntries(HNK_MASTER_PHRASES.map(e=>[e.id,e])));
export const HNK_MASTER_LEXICON_STATS=Object.freeze({lexemes:HNK_MASTER_LEXICON.length,phrases:HNK_MASTER_PHRASES.length,byAuthority:Object.freeze(HNK_MASTER_LEXICON.reduce((a,e)=>{a[e.authority]=(a[e.authority]??0)+1;return a},{})),withRecoveredMeaning:HNK_MASTER_LEXICON.filter(e=>e.meaning!==null).length,withoutRecoveredMeaning:HNK_MASTER_LEXICON.filter(e=>e.meaning===null).length});
export function getLexeme(value){return typeof value==='string'?HNK_MASTER_LEXICON_BY_FORM[value.trim().toUpperCase()]:undefined}
export function getPhrase(id){return HNK_MASTER_PHRASES_BY_ID[id]}
export function filterLexemes({authority,lesson,hasMeaning}={}){return HNK_MASTER_LEXICON.filter(e=>!(authority&&e.authority!==authority)&&!(lesson&&!e.lessons.includes(lesson))&&!(hasMeaning===true&&e.meaning===null)&&!(hasMeaning===false&&e.meaning!==null))}
export function validateHnkMasterLexicon(){const errors=[],forms=new Set(),ids=new Set();if(HNK40_STATUS!=='PREPRODUCTION_NOT_OFFICIAL')errors.push(`Unexpected HNK40 visual state: ${HNK40_STATUS}`);for(const e of HNK_MASTER_LEXICON){if(ids.has(e.id))errors.push(`Duplicate lexeme id: ${e.id}`);ids.add(e.id);if(forms.has(e.transliteration))errors.push(`Duplicate lexeme form: ${e.transliteration}`);forms.add(e.transliteration);if(e.authority==='BRIDGE'&&e.encodingMode!=='EXPLICIT_BRIDGE')errors.push(`Bridge encoding missing: ${e.transliteration}`)}return {ok:errors.length===0,errors}}
