// Vercel Serverless Function — /api/live-final.js
// Marks a live game as final: saves box score, updates game & live_games

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const FB_KEY = process.env.FIREBASE_API_KEY;
  const FB_PROJECT = 'la-softball';
  const FB_BASE = `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents`;

  function toFsValue(v) {
    if (typeof v === 'string') return { stringValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (v === null || v === undefined) return { nullValue: null };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(toFsValue) } };
    if (typeof v === 'object') return { mapValue: { fields: toFirestore(v) } };
    return { stringValue: String(v) };
  }

  function toFirestore(obj) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined) continue;
      out[k] = toFsValue(v);
    }
    return out;
  }

  try {
    const { gameId, boxScore, finalState } = req.body;
    if (!gameId || !boxScore) return res.status(400).json({ error: 'Missing gameId or boxScore' });

    const results = [];

    // 1. Save box score to box_scores/{gameId}
    const bsRes = await fetch(`${FB_BASE}/box_scores/${gameId}?key=${FB_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestore(boxScore) })
    });
    if (!bsRes.ok) throw new Error('box_scores write failed');
    results.push('Box score saved');

    // 2. Update games/{gameId} with final scores
    const gameFields = {
      away_score: boxScore.awayRuns ?? 0,
      home_score: boxScore.homeRuns ?? 0,
      done: true,
      live: false
    };
    const fieldPaths = Object.keys(gameFields).map(k => `updateMask.fieldPaths=${k}`).join('&');
    const gameRes = await fetch(`${FB_BASE}/games/${gameId}?${fieldPaths}&key=${FB_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestore(gameFields) })
    });
    if (!gameRes.ok) throw new Error('games update failed');
    results.push('Game marked final');

    // 3. Update live_games/{gameId} with final status
    if (finalState) {
      const liveRes = await fetch(`${FB_BASE}/live_games/${gameId}?key=${FB_KEY}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: toFirestore({ ...finalState, status: 'final' }) })
      });
      if (!liveRes.ok) throw new Error('live_games final update failed');
      results.push('Live game marked final');
    }

    return res.status(200).json({ success: true, results });
  } catch (err) {
    console.error('live-final error:', err);
    return res.status(500).json({ error: err.message });
  }
}
