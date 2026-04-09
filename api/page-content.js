// Vercel Serverless Function — /api/page-content.js
// GET/POST page content to Firebase "page_content" collection
// Each document is a page (id = page slug), fields = content

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
  function fromFsValue(v) {
    if (v.stringValue !== undefined) return v.stringValue;
    if (v.doubleValue !== undefined) return v.doubleValue;
    if (v.integerValue !== undefined) return parseInt(v.integerValue);
    if (v.booleanValue !== undefined) return v.booleanValue;
    if (v.nullValue !== undefined) return null;
    if (v.arrayValue) return (v.arrayValue.values || []).map(fromFsValue);
    if (v.mapValue) return fromFirestore(v.mapValue.fields);
    return null;
  }
  function fromFirestore(fields) {
    const out = {};
    for (const [k, v] of Object.entries(fields || {})) out[k] = fromFsValue(v);
    return out;
  }

  // GET all page content (or single page with ?page=slug)
  if (req.method === 'GET') {
    try {
      const { page } = req.query;
      if (page) {
        const r = await fetch(`${FB_BASE}/page_content/${page}?key=${FB_KEY}`);
        if (!r.ok) return res.status(200).json({ content: null });
        const doc = await r.json();
        return res.status(200).json({ content: fromFirestore(doc.fields) });
      } else {
        const r = await fetch(`${FB_BASE}/page_content?key=${FB_KEY}&pageSize=50`);
        if (!r.ok) return res.status(200).json({ pages: {} });
        const data = await r.json();
        const pages = {};
        (data.documents || []).forEach(doc => {
          const slug = doc.name.split('/').pop();
          pages[slug] = fromFirestore(doc.fields);
        });
        return res.status(200).json({ pages });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST — update page content
  if (req.method === 'POST') {
    try {
      const { page, content } = req.body;
      if (!page || !content) return res.status(400).json({ error: 'page and content required' });

      const fieldPaths = Object.keys(content).map(k => `updateMask.fieldPaths=${k}`).join('&');
      const r = await fetch(`${FB_BASE}/page_content/${page}?${fieldPaths}&key=${FB_KEY}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: toFirestore(content) })
      });
      if (!r.ok) {
        const err = await r.text();
        throw new Error(err);
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
