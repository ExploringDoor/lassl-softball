// Vercel Serverless Function — /api/clear-score.js
// Resets a game back to pending (undoes a submitted score)

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
    return { stringValue: String(v) };
  }
  function toFirestore(obj) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = toFsValue(v);
    return out;
  }
  function fromFirestore(fields) {
    const out = {};
    for (const [k, v] of Object.entries(fields || {})) {
      if (v.stringValue !== undefined) out[k] = v.stringValue;
      else if (v.doubleValue !== undefined) out[k] = v.doubleValue;
      else if (v.integerValue !== undefined) out[k] = parseInt(v.integerValue);
      else if (v.booleanValue !== undefined) out[k] = v.booleanValue;
      else out[k] = null;
    }
    return out;
  }

  try {
    const { gameId } = req.body;
    if (!gameId) return res.status(400).json({ error: 'Missing gameId' });

    // 1. Get the game to find the old scores and team IDs
    const gameRes = await fetch(`${FB_BASE}/games/${gameId}?key=${FB_KEY}`);
    if (!gameRes.ok) throw new Error('Game not found');
    const gameDoc = await gameRes.json();
    const game = fromFirestore(gameDoc.fields);

    if (!game.done) return res.status(200).json({ success: true, message: 'Game already pending' });

    const awayScore = game.away_score || 0;
    const homeScore = game.home_score || 0;
    const awayWon = awayScore > homeScore;

    // 2. Reset game to pending
    const resetFields = { done: false, away_score: 0, home_score: 0, live: false };
    const fieldPaths = Object.keys(resetFields).map(k => `updateMask.fieldPaths=${k}`).join('&');
    await fetch(`${FB_BASE}/games/${gameId}?${fieldPaths}&key=${FB_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestore(resetFields) })
    });

    // 3. Reverse team standings
    for (const [tid, isAway] of [[game.away, true], [game.home, false]]) {
      if (!tid) continue;
      const tRes = await fetch(`${FB_BASE}/teams/${tid}?key=${FB_KEY}`);
      if (!tRes.ok) continue;
      const tDoc = await tRes.json();
      const t = fromFirestore(tDoc.fields);

      const won = isAway ? awayWon : !awayWon;
      const scored = isAway ? awayScore : homeScore;
      const conceded = isAway ? homeScore : awayScore;

      const newW = Math.max(0, (t.w || 0) - (won ? 1 : 0));
      const newL = Math.max(0, (t.l || 0) - (won ? 0 : 1));
      const newRS = Math.max(0, (t.rs || 0) - scored);
      const newRA = Math.max(0, (t.ra || 0) - conceded);

      const teamFields = {
        w: newW, l: newL,
        rs: newRS, ra: newRA,
        pct: (newW + newL) > 0 ? Math.round((newW / (newW + newL)) * 1000) / 1000 : 0,
      };
      const tFieldPaths = Object.keys(teamFields).map(k => `updateMask.fieldPaths=${k}`).join('&');
      await fetch(`${FB_BASE}/teams/${tid}?${tFieldPaths}&key=${FB_KEY}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: toFirestore(teamFields) })
      });
    }

    return res.status(200).json({ success: true, message: 'Score cleared, standings reversed' });
  } catch (err) {
    console.error('clear-score error:', err);
    return res.status(500).json({ error: err.message });
  }
}
