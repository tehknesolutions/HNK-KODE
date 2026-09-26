export const HNK40_STATUS = 'PREPRODUCTION_NOT_OFFICIAL';
export const HNK40_CANDIDATE_PUA_RANGE = Object.freeze({ start:0xE100, end:0xE127, count:40 });
export const HNK40_IPA = Object.freeze(["/a/", "/e/", "/i/", "/o/", "/u/", "/ə/", "/h/", "/ʔ/", "/ʕ/", "/ħ/", "/m/", "/n/", "/ŋ/", "/l/", "/r/", "/j/", "/w/", "/b/", "/d/", "/g/", "/p/", "/t/", "/k/", "/q/", "/f/", "/s/", "/ʃ/", "/x/", "/θ/", "/ts/", "/v/", "/z/", "/ʒ/", "/ð/", "/tʃ/", "/dʒ/", "/sˤ/", "/tˤ/", "/ɣ/", "/y/"]);
export const HNK40_SAFE_TRANSLITERATION_MAP = Object.freeze({"A":"G01","E":"G02","I":"G03","O":"G04","U":"G05","H":"G07","M":"G11","N":"G12","L":"G14","R":"G15","B":"G18","D":"G19","P":"G21","T":"G22","K":"G23","S":"G26","TS":"G30","V":"G31","Z":"G32","Y":"G40"});

const GID_RE = /^G(?:0[1-9]|[1-3][0-9]|40)$/;

export const HNK40_ENTRIES = Object.freeze(HNK40_IPA.map((phonemeIpa,index)=>{
  const n=index+1;
  const glyphId=`G${String(n).padStart(2,'0')}`;
  return Object.freeze({
    glyphId,
    phonemeIpa,
    worldId:`W${Math.floor(index/10)+1}`,
    protoglyphColumn:(index%10)+1,
    candidatePua:`U+${(0xE100+index).toString(16).toUpperCase()}`,
    candidatePuaDecimal:0xE100+index,
    key:Object.freeze({row:Math.floor(index/10)+1,column:(index%10)+1,keyId:`R${Math.floor(index/10)+1}C${String((index%10)+1).padStart(2,'0')}`}),
    visualState:'VISUAL_FROZEN_CANDIDATE',
  });
}));
export const HNK40_GLYPH_IDS = Object.freeze(HNK40_ENTRIES.map(entry=>entry.glyphId));
export const HNK40_BY_ID = Object.freeze(Object.fromEntries(HNK40_ENTRIES.map(entry=>[entry.glyphId,entry])));
export const HNK40_BY_PUA = Object.freeze(Object.fromEntries(HNK40_ENTRIES.map(entry=>[entry.candidatePuaDecimal,entry])));
export const HNK40_SACRED_10X4 = Object.freeze(Array.from({length:4},(_,row)=>Object.freeze(HNK40_ENTRIES.slice(row*10,row*10+10))));

export function isGlyphId(value){return typeof value==='string'&&GID_RE.test(value)}
export function assertGlyphId(value){if(!isGlyphId(value))throw new RangeError(`Invalid HNK40 glyph id: ${String(value)}`);return value}
export function glyphIdFromNumber(value){if(!Number.isInteger(value)||value<1||value>40)throw new RangeError(`HNK40 glyph number must be 1..40: ${value}`);return `G${String(value).padStart(2,'0')}`}
export function getGlyph(value){return HNK40_BY_ID[assertGlyphId(value)]}
export function candidatePuaForGlyph(value){return getGlyph(value).candidatePuaDecimal}
export function candidatePuaStringForGlyph(value){return String.fromCodePoint(candidatePuaForGlyph(value))}
export function glyphFromCandidatePua(value){const cp=typeof value==='number'?value:(typeof value==='string'&&value?value.codePointAt(0):undefined);return cp==null?undefined:HNK40_BY_PUA[cp]}
export function glyphIdsToCandidatePuaText(ids){return ids.map(candidatePuaStringForGlyph).join('')}
export function candidatePuaTextToGlyphIds(text){const glyphIds=[],unresolved=[];for(const char of String(text??'')){if(/\s/u.test(char)){glyphIds.push('SPACE');continue}const entry=glyphFromCandidatePua(char);if(entry)glyphIds.push(entry.glyphId);else unresolved.push(char)}return {glyphIds,unresolved}}
export function tokenizeTransliteration(input){const source=String(input??'').toUpperCase(),tokens=[],unresolved=[];for(let i=0;i<source.length;){const ch=source[i];if(/\s/u.test(ch)){tokens.push({type:'space',source:ch});i++;continue}if(source.slice(i,i+2)==='TS'){tokens.push({type:'glyph',source:'TS',glyphId:'G30'});i+=2;continue}const glyphId=HNK40_SAFE_TRANSLITERATION_MAP[ch];if(glyphId)tokens.push({type:'glyph',source:ch,glyphId});else{const token={type:'unresolved',source:ch,index:i};tokens.push(token);unresolved.push(token)}i++}return {source,tokens,unresolved}}
export function transliterationToGlyphIds(input,{includeSpaces=false,strict=false}={}){const parsed=tokenizeTransliteration(input);if(strict&&parsed.unresolved.length)throw new Error(`Unresolved HNK transliteration unit(s): ${[...new Set(parsed.unresolved.map(token=>token.source))].join(', ')}`);const glyphIds=parsed.tokens.flatMap(token=>token.type==='glyph'?[token.glyphId]:(token.type==='space'&&includeSpaces?['SPACE']:[]));return {glyphIds,unresolved:parsed.unresolved}}
export function transliterationToCandidatePuaText(input,{strict=true}={}){const {glyphIds,unresolved}=transliterationToGlyphIds(input,{strict});return {text:glyphIdsToCandidatePuaText(glyphIds),glyphIds,unresolved}}
export function getSacredKey(row,column){if(!Number.isInteger(row)||row<1||row>4||!Number.isInteger(column)||column<1||column>10)throw new RangeError(`Sacred key must be row 1..4 and column 1..10: ${row},${column}`);return HNK40_SACRED_10X4[row-1][column-1]}
export function validateHnk40Runtime(){const errors=[];if(HNK40_ENTRIES.length!==40)errors.push(`Expected 40 glyph entries, got ${HNK40_ENTRIES.length}`);if(new Set(HNK40_GLYPH_IDS).size!==40)errors.push('Glyph IDs are not unique');if(HNK40_IPA.length!==40)errors.push(`Expected 40 IPA bindings, got ${HNK40_IPA.length}`);return {ok:errors.length===0,errors}}
