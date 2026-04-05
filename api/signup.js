// Vercel Serverless Function — /api/signup.js
// Saves player sign-up form submissions to Firebase "signups" collection

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
    if (typeof v === 'number') return { doubleValue: v };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (v === null || v === undefined) return { nullValue: null };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(toFsValue) } };
    return { stringValue: String(v) };
  }
  function toFirestore(obj) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = toFsValue(v);
    return out;
  }

  try {
    const { name, team, email, phone, preferences, notes } = req.body;

    if (!name || !team || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const r = await fetch(`${FB_BASE}/signups?key=${FB_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: toFirestore({
          name: name.trim(),
          team: team.trim(),
          email: email.trim(),
          phone: phone.trim(),
          preferences: preferences || [],
          notes: (notes || '').trim(),
          created_at: new Date().toISOString(),
        })
      })
    });

    if (!r.ok) {
      const err = await r.text();
      throw new Error(err);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('signup error:', err);
    return res.status(500).json({ error: err.message });
  }
}
