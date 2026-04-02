// Vercel Serverless Function — /api/get-data.js
// Reads teams, games, and players from Firebase and returns them for the frontend

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
      else if (v.nullValue !== undefined) out[k] = null;
      else if (v.arrayValue) out[k] = (v.arrayValue.values || []).map(x =>
        x.stringValue ?? x.doubleValue ?? x.integerValue ?? x.booleanValue ?? null
      );
      else out[k] = null;
    }
    return out;
  }

  async function fetchCollection(name, pageSize = 500) {
    const docs = [];
    let pageToken = '';
    do {
      const url = `${FB_BASE}/${name}?key=${FB_KEY}&pageSize=${pageSize}${pageToken ? `&pageToken=${pageToken}` : ''}`;
      const r = await fetch(url);
      if (!r.ok) break;
      const data = await r.json();
      if (data.documents) {
        for (const doc of data.documents) {
          docs.push({ id: doc.name.split('/').pop(), ...fromFirestore(doc.fields) });
        }
      }
      pageToken = data.nextPageToken || '';
    } while (pageToken);
    return docs;
  }

  try {
    const [teams, games, players] = await Promise.all([
      fetchCollection('teams'),
      fetchCollection('games'),
      fetchCollection('players'),
    ]);

    // Cache for 60 seconds on Vercel edge
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    return res.status(200).json({ teams, games, players });
  } catch (err) {
    console.error('get-data error:', err);
    return res.status(500).json({ error: err.message });
  }
}
