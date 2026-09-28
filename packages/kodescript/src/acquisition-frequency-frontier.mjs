// Exact multi-corpus glyph coverage frontier.
// Pure analytical acquisition support; frequency never grants linguistic authority.

function normalizeCorpus(section) {
  if (!section || !Array.isArray(section.glyphUsage) || !Number.isInteger(section.glyphTokens)) {
    throw new Error('coverage corpus requires glyphUsage and glyphTokens');
  }
  return {
    total: section.glyphTokens,
    counts: Object.fromEntries(section.glyphUsage.map(x => [x.glyphId, x.count]))
  };
}

function popcount(x) {
  let n=0;
  while (x) { x &= x-1; n++; }
  return n;
}

export function exactSharedCoverageFrontier(corpusA, corpusB, thresholds=[0.8,0.9,0.95]) {
  const a=normalizeCorpus(corpusA), b=normalizeCorpus(corpusB);
  const ids=[...new Set([...Object.keys(a.counts),...Object.keys(b.counts)])].sort();
  if (ids.length>30) throw new Error('exact bitmask solver supports at most 30 glyph identities');

  const targets=thresholds.map(t => ({
    threshold:t,
    aTarget:Math.ceil(a.total*t),
    bTarget:Math.ceil(b.total*t),
    minGlyphCount:null,
    solutions:[],
  }));

  const limit=2**ids.length;
  for (let mask=1; mask<limit; mask++) {
    const k=popcount(mask);
    if (targets.every(t => t.minGlyphCount!==null && k>t.minGlyphCount)) continue;

    let ca=0,cb=0;
    for (let i=0;i<ids.length;i++) if (mask & (2**i)) {
      ca+=a.counts[ids[i]]??0;
      cb+=b.counts[ids[i]]??0;
    }

    for (const t of targets) {
      if (ca<t.aTarget || cb<t.bTarget) continue;
      if (t.minGlyphCount===null || k<t.minGlyphCount) {
        t.minGlyphCount=k;
        t.solutions=[];
      }
      if (k===t.minGlyphCount) {
        t.solutions.push({
          glyphIds:ids.filter((_,i)=>Boolean(mask & (2**i))),
          corpusACoveredTokens:ca,
          corpusBCoveredTokens:cb,
          corpusACoverage:ca/a.total,
          corpusBCoverage:cb/b.total,
        });
      }
    }
  }

  return targets.map(t => {
    t.solutions.sort((x,y) =>
      (y.corpusACoverage+y.corpusBCoverage)-(x.corpusACoverage+x.corpusBCoverage) ||
      x.glyphIds.join('|').localeCompare(y.glyphIds.join('|'))
    );
    return {
      threshold:t.threshold,
      minGlyphCount:t.minGlyphCount,
      solutionCount:t.solutions.length,
      uniqueMinimal:t.solutions.length===1,
      representative:t.solutions[0]??null,
    };
  });
}
