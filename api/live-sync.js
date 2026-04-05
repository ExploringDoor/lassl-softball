// Vercel Serverless Function — /api/live-sync.js
// Syncs live game state to Firebase during active scoring

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
    const { gameId, gameState } = req.body;
    if (!gameId || !gameState) return res.status(400).json({ error: 'Missing gameId or gameState' });

    // 1. Write full state to live_games/{gameId}
    const liveRes = await fetch(`${FB_BASE}/live_games/${gameId}?key=${FB_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestore(gameState) })
    });
    if (!liveRes.ok) {
      const err = await liveRes.text();
      throw new Error('live_games write failed: ' + err);
    }

    // 2. Update game summary in games/{gameId}
    const summaryFields = {
      away_score: gameState.awayRuns ?? 0,
      home_score: gameState.homeRuns ?? 0,
      live: true
    };
    const fieldPaths = Object.keys(summaryFields).map(k => `updateMask.fieldPaths=${k}`).join('&');
    const gameRes = await fetch(`${FB_BASE}/games/${gameId}?${fieldPaths}&key=${FB_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestore(summaryFields) })
    });
    if (!gameRes.ok) {
      const err = await gameRes.text();
      throw new Error('games update failed: ' + err);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('live-sync error:', err);
    return res.status(500).json({ error: err.message });
  }
}
