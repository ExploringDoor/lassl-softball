// Vercel Serverless Function — /api/sub-board.js
// CRUD for sub board and season sub list

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

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

  // GET — fetch all subs
  if (req.method === 'GET') {
    try {
      const [dayRes, seasonRes] = await Promise.all([
        fetch(`${FB_BASE}/sub_board?key=${FB_KEY}&pageSize=200`),
        fetch(`${FB_BASE}/sub_season?key=${FB_KEY}&pageSize=200`)
      ]);
      const dayData = await dayRes.json();
      const seasonData = await seasonRes.json();
      const daySubs = (dayData.documents || []).map(d => ({ id: d.name.split('/').pop(), ...fromFirestore(d.fields) }));
      const seasonSubs = (seasonData.documents || []).map(d => ({ id: d.name.split('/').pop(), ...fromFirestore(d.fields) }));
      return res.status(200).json({ daySubs, seasonSubs });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST — add a sub
  if (req.method === 'POST') {
    try {
      const { type, data } = req.body;
      const collection = type === 'season' ? 'sub_season' : 'sub_board';
      const r = await fetch(`${FB_BASE}/${collection}?key=${FB_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: toFirestore({ ...data, created_at: new Date().toISOString() }) })
      });
      if (!r.ok) throw new Error('Failed to save');
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // DELETE — remove a sub
  if (req.method === 'DELETE') {
    try {
      const { type, id } = req.body;
      const collection = type === 'season' ? 'sub_season' : 'sub_board';
      const r = await fetch(`${FB_BASE}/${collection}/${id}?key=${FB_KEY}`, { method: 'DELETE' });
      if (!r.ok) throw new Error('Failed to delete');
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
