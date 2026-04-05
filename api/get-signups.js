// Vercel Serverless Function — /api/get-signups.js
// Reads sign-ups from Firebase "signups" collection

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const FB_KEY = process.env.FIREBASE_API_KEY;
  const FB_PROJECT = 'la-softball';
  const FB_BASE = `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents`;

  function fromFirestore(fields) {
    const out = {};
    for (const [k, v] of Object.entries(fields || {})) {
      if (v.stringValue !== undefined) out[k] = v.stringValue;
      else if (v.doubleValue !== undefined) out[k] = v.doubleValue;
      else if (v.integerValue !== undefined) out[k] = parseInt(v.integerValue);
      else if (v.booleanValue !== undefined) out[k] = v.booleanValue;
      else if (v.arrayValue) out[k] = (v.arrayValue.values || []).map(x =>
        x.stringValue ?? x.doubleValue ?? x.integerValue ?? x.booleanValue ?? null
      );
      else out[k] = null;
    }
    return out;
  }

  try {
    const url = `${FB_BASE}/signups?key=${FB_KEY}&pageSize=500`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('Failed to fetch signups');
    const data = await r.json();
    const signups = (data.documents || []).map(doc => ({
      id: doc.name.split('/').pop(),
      ...fromFirestore(doc.fields)
    })).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

    return res.status(200).json({ signups });
  } catch (err) {
    console.error('get-signups error:', err);
    return res.status(500).json({ error: err.message });
  }
}
