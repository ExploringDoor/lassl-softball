// Vercel Serverless Function — /api/mailerlite.js
// Handles MailerLite subscriber adds, campaign creation, and group stats

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMzgzYzc0NGFlYzJkYWFjOTA3NDgzY2YzOGFhNzQ1ZDIxNzlkMWIzZDY0YmIwNmM1ZjM1ZGU1YmNlYjc5ODY4OTI3NjEwNmE2YWMxMzYxMTIiLCJpYXQiOjE3NzU2MTA5NzUuMTM2MDAxLCJuYmYiOjE3NzU2MTA5NzUuMTM2MDAzLCJleHAiOjQ5MzEyODQ1NzUuMTI5MTQ3LCJzdWIiOiIyMjcyMTc5Iiwic2NvcGVzIjpbXX0.ai_zNxrFdGYWYrZOI8k6nEPPGzukERNWtMpXvDmv9fARDTR9rw66mSPZo';
  const GROUP_ID = '184141789042575142';
  const BASE = 'https://connect.mailerlite.com/api';
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` };


  const { action } = req.query;

  try {
    // ADD SUBSCRIBER
    if (action === 'subscribe' && req.method === 'POST') {
      const { email, name } = req.body;
      if (!email) return res.status(400).json({ error: 'Email required' });

      const r = await fetch(`${BASE}/subscribers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          fields: { name: name || '' },
          groups: [GROUP_ID],
        }),
      });
      const data = await r.json();
      return res.status(r.ok ? 200 : 400).json(data);
    }

    // GET GROUP STATS (subscriber count)
    if (action === 'stats' && req.method === 'GET') {
      const r = await fetch(`${BASE}/groups/${GROUP_ID}`, { headers });
      const data = await r.json();
      return res.status(200).json({
        name: data.data?.name || 'Unknown',
        count: data.data?.active_count || data.data?.total || 0,
      });
    }

    // CREATE + SEND CAMPAIGN
    if (action === 'send' && req.method === 'POST') {
      const { subject, body: htmlBody } = req.body;
      if (!subject || !htmlBody) return res.status(400).json({ error: 'Subject and body required' });

      // 1. Create campaign
      const createRes = await fetch(`${BASE}/campaigns`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: subject,
          type: 'regular',
          emails: [{
            subject,
            from_name: 'Synagogue Softball',
            from: 'toddharris1222@gmail.com',
            content: htmlBody,
          }],
          groups: [GROUP_ID],
        }),
      });
      const campaign = await createRes.json();
      if (!createRes.ok) return res.status(400).json({ error: 'Failed to create campaign', details: campaign });

      const campaignId = campaign.data?.id;
      if (!campaignId) return res.status(400).json({ error: 'No campaign ID returned', details: campaign });

      // 2. Send immediately
      const sendRes = await fetch(`${BASE}/campaigns/${campaignId}/schedule`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ delivery: 'instant' }),
      });
      const sendData = await sendRes.json();
      if (!sendRes.ok) return res.status(400).json({ error: 'Failed to send campaign', details: sendData });

      return res.status(200).json({ success: true, campaignId });
    }

    return res.status(400).json({ error: 'Invalid action. Use ?action=subscribe, stats, or send' });
  } catch (err) {
    console.error('mailerlite error:', err);
    return res.status(500).json({ error: err.message });
  }
}
