import fs from 'node:fs';
import { runFamilyCensusShard, mergeFamilyCensusShards } from '../packages/kodescript/src/family-census-core.mjs';

const argv=process.argv.slice(2);
const value=(flag,fallback=null)=>{
  const i=argv.indexOf(flag);
  return i>=0 && argv[i+1]!==undefined ? argv[i+1] : fallback;
};
const outPath=value('--out');

if (argv.includes('--merge')) {
  const i=argv.indexOf('--merge');
  const files=[];
  for (let j=i+1;j<argv.length && !argv[j].startsWith('--');j++) files.push(argv[j]);
  if (!files.length) throw new Error('--merge requires shard JSON files');
  const shards=files.map(file=>JSON.parse(fs.readFileSync(file,'utf8')));
  const result=mergeFamilyCensusShards(shards);
  const json=JSON.stringify(result,null,2)+'\n';
  if (outPath) fs.writeFileSync(outPath,json); else process.stdout.write(json);
} else {
  const shardIndex=Number(value('--shard-index',process.env.HNK_SHARD_INDEX??'0'));
  const shardCount=Number(value('--shard-count',process.env.HNK_SHARD_COUNT??'1'));
  const result=runFamilyCensusShard({shardIndex,shardCount});
  const json=JSON.stringify(result)+'\n';
  if (outPath) fs.writeFileSync(outPath,json); else process.stdout.write(json);
}
