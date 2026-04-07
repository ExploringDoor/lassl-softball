// Vercel Serverless Function — /api/delete-signup.js
// Deletes a sign-up from Firebase

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const FB_KEY = process.env.FIREBASE_API_KEY;
  const FB_PROJECT = 'la-softball';
  const FB_BASE = `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents`;

  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const r = await fetch(`${FB_BASE}/signups/${id}?key=${FB_KEY}`, { method: 'DELETE' });
    if (!r.ok) throw new Error('Failed to delete');

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('delete-signup error:', err);
    return res.status(500).json({ error: err.message });
  }
}
