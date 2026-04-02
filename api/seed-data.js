// Vercel Serverless Function — /api/seed-data.js
// Seeds the la-softball Firebase project with all LASSL teams and games

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const FB_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyA5ArGAOv6U2IRit574Qc4hTtvcJCwHOtE';
  const FB_PROJECT = 'la-softball';
  const FB_BASE = `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents`;

  const results = [];
  const log = (msg) => results.push(msg);

  function toFirestore(obj) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === null || v === undefined) out[k] = { nullValue: null };
      else if (typeof v === 'boolean') out[k] = { booleanValue: v };
      else if (typeof v === 'number') out[k] = Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
      else if (typeof v === 'string') out[k] = { stringValue: v };
      else out[k] = { stringValue: String(v) };
    }
    return out;
  }

  async function fsPatch(path, fields) {
    const body = { fields: toFirestore(fields) };
    const r = await fetch(`${FB_BASE}/${path}?key=${FB_KEY}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!r.ok) {
      const err = await r.text();
      throw new Error(`PATCH ${path} failed: ${r.status} ${err}`);
    }
    return r.json();
  }

  try {
    // ── TEAMS ─────────────────────────────────────────────
    const teams = [
      // Division A
      { id: 'vbs', name: 'VBS', div: 'A', w: 5, l: 1, t: 0, rs: 83, ra: 23 },
      { id: 'aae-as', name: "AAE A's", div: 'A', w: 4, l: 2, t: 0, rs: 71, ra: 51 },
      { id: 'emmanuel', name: 'Emmanuel', div: 'A', w: 1, l: 5, t: 0, rs: 60, ra: 77 },
      { id: 'isaiah-nouveau', name: 'Isaiah-Nouveau', div: 'A', w: 1, l: 5, t: 0, rs: 58, ra: 97 },
      // Division B
      { id: 'akiba-blue', name: 'Akiba-Blue', div: 'B', w: 5, l: 1, t: 0, rs: 83, ra: 62 },
      { id: 'uni-beth-hillel', name: 'Uni/Beth Hillel', div: 'B', w: 4, l: 2, t: 0, rs: 63, ra: 68 },
      { id: 'bagel-dawgs', name: 'Bagel Dawgs', div: 'B', w: 4, l: 2, t: 0, rs: 66, ra: 50 },
      { id: 'hamakom-epstein', name: 'Hamakom-Epstein', div: 'B', w: 0, l: 6, t: 0, rs: 34, ra: 90 },
      // Division C
      { id: 'lbt', name: 'LBT', div: 'C', w: 4, l: 0, t: 1, rs: 84, ra: 41 },
      { id: 'tioh', name: 'TIOH', div: 'C', w: 3, l: 1, t: 2, rs: 103, ra: 86 },
      { id: 'or-ami', name: 'Or Ami', div: 'C', w: 1, l: 4, t: 1, rs: 52, ra: 105 },
      { id: 'judea', name: 'Judea', div: 'C', w: 1, l: 4, t: 0, rs: 78, ra: 85 },
      // Division D
      { id: 'hamakom-miller', name: 'Hamakom-Miller', div: 'D', w: 3, l: 2, t: 0, rs: 81, ra: 70 },
      { id: 'akiba-red', name: 'Akiba-Red', div: 'D', w: 3, l: 2, t: 0, rs: 54, ra: 58 },
      { id: 'beth-am', name: 'Beth Am', div: 'D', w: 3, l: 3, t: 0, rs: 75, ra: 75 },
      { id: 'santa-monica', name: 'Santa Monica', div: 'D', w: 3, l: 3, t: 0, rs: 114, ra: 85 },
      { id: 'kehillat-israel', name: 'Kehillat Israel', div: 'D', w: 3, l: 3, t: 0, rs: 69, ra: 92 },
      { id: 'isaiah-ogs', name: "Isaiah OG's", div: 'D', w: 2, l: 4, t: 0, rs: 79, ra: 92 },
      // Division E
      { id: 'aae-menchwarmers', name: 'AAE Menchwarmers', div: 'E', w: 6, l: 0, t: 0, rs: 80, ra: 43 },
      { id: 'beth-am-sinai-ikar', name: 'Beth Am/Sinai/Ikar', div: 'E', w: 4, l: 2, t: 0, rs: 74, ra: 31 },
      { id: 'sinai-swingers', name: 'Sinai Swingers', div: 'E', w: 2, l: 4, t: 0, rs: 81, ra: 81 },
      { id: 'beth-shir-shalom', name: 'Beth Shir Shalom', div: 'E', w: 0, l: 6, t: 0, rs: 11, ra: 91 },
    ];

    // Create all teams
    log('--- Creating teams ---');
    for (const team of teams) {
      const { id, ...data } = team;
      const gp = data.w + data.l + data.t;
      const totalGames = data.w + data.l;
      const pct = totalGames > 0 ? Math.round((data.w / totalGames) * 1000) / 1000 : 0;
      // Determine streak from most recent results — use a simple default
      let streak = '';
      if (data.w > data.l) streak = 'W1';
      else if (data.l > data.w) streak = 'L1';
      else streak = 'T1';

      await fsPatch(`teams/${id}`, {
        name: data.name,
        div: data.div,
        w: data.w,
        l: data.l,
        t: data.t,
        pct,
        gp,
        rs: data.rs,
        ra: data.ra,
        streak
      });
      log(`Team: ${data.name} (${id}) — ${data.w}-${data.l}-${data.t}`);
    }

    // ── GAMES ─────────────────────────────────────────────
    log('--- Creating completed games ---');

    const completedGames = [
      // Week 1 — Jan 18
      { wk: 1, date: 'Jan 18', away: 'aae-as', home: 'emmanuel', away_score: 8, home_score: 5 },
      { wk: 1, date: 'Jan 18', away: 'vbs', home: 'isaiah-nouveau', away_score: 16, home_score: 3 },
      { wk: 1, date: 'Jan 18', away: 'bagel-dawgs', home: 'akiba-blue', away_score: 14, home_score: 1 },
      { wk: 1, date: 'Jan 18', away: 'tioh', home: 'or-ami', away_score: 18, home_score: 4 },
      { wk: 1, date: 'Jan 18', away: 'lbt', home: 'judea', away_score: 18, home_score: 4 },
      { wk: 1, date: 'Jan 18', away: 'hamakom-miller', home: 'santa-monica', away_score: 14, home_score: 12 },
      { wk: 1, date: 'Jan 18', away: 'akiba-red', home: 'beth-am', away_score: 11, home_score: 2 },
      { wk: 1, date: 'Jan 18', away: 'aae-menchwarmers', home: 'beth-am-sinai-ikar', away_score: 8, home_score: 2 },

      // Week 2 — Jan 25
      { wk: 2, date: 'Jan 25', away: 'vbs', home: 'aae-as', away_score: 10, home_score: 3 },
      { wk: 2, date: 'Jan 25', away: 'emmanuel', home: 'isaiah-nouveau', away_score: 18, home_score: 14 },
      { wk: 2, date: 'Jan 25', away: 'bagel-dawgs', home: 'hamakom-epstein', away_score: 22, home_score: 2 },
      { wk: 2, date: 'Jan 25', away: 'akiba-blue', home: 'uni-beth-hillel', away_score: 21, home_score: 16 },
      { wk: 2, date: 'Jan 25', away: 'tioh', home: 'judea', away_score: 23, home_score: 18 },
      { wk: 2, date: 'Jan 25', away: 'lbt', home: 'or-ami', away_score: 10, home_score: 7 },
      { wk: 2, date: 'Jan 25', away: 'santa-monica', home: 'akiba-red', away_score: 23, home_score: 5 },

      // Week 3 — Feb 1
      { wk: 3, date: 'Feb 1', away: 'vbs', home: 'emmanuel', away_score: 13, home_score: 3 },
      { wk: 3, date: 'Feb 1', away: 'aae-as', home: 'isaiah-nouveau', away_score: 27, home_score: 10 },
      { wk: 3, date: 'Feb 1', away: 'uni-beth-hillel', home: 'bagel-dawgs', away_score: 8, home_score: 4 },
      { wk: 3, date: 'Feb 1', away: 'akiba-blue', home: 'hamakom-epstein', away_score: 18, home_score: 5 },
      { wk: 3, date: 'Feb 1', away: 'lbt', home: 'tioh', away_score: 18, home_score: 18 },
      { wk: 3, date: 'Feb 1', away: 'beth-am', home: 'hamakom-miller', away_score: 18, home_score: 17 },

      // Week 4 — Feb 8
      { wk: 4, date: 'Feb 8', away: 'aae-as', home: 'uni-beth-hillel', away_score: 21, home_score: 8 },
      { wk: 4, date: 'Feb 8', away: 'vbs', home: 'hamakom-epstein', away_score: 19, home_score: 0 },
      { wk: 4, date: 'Feb 8', away: 'bagel-dawgs', home: 'isaiah-nouveau', away_score: 11, home_score: 10 },
      { wk: 4, date: 'Feb 8', away: 'akiba-blue', home: 'emmanuel', away_score: 19, home_score: 16 },
      { wk: 4, date: 'Feb 8', away: 'lbt', home: 'judea', away_score: 17, home_score: 11 },
      { wk: 4, date: 'Feb 8', away: 'beth-am', home: 'santa-monica', away_score: 23, home_score: 13 },
      { wk: 4, date: 'Feb 8', away: 'aae-menchwarmers', home: 'beth-am-sinai-ikar', away_score: 16, home_score: 10 },
      { wk: 4, date: 'Feb 8', away: 'sinai-swingers', home: 'beth-shir-shalom', away_score: 24, home_score: 3 },

      // Week 5 — Feb 15
      { wk: 5, date: 'Feb 15', away: 'aae-as', home: 'hamakom-epstein', away_score: 12, home_score: 11 },
      { wk: 5, date: 'Feb 15', away: 'uni-beth-hillel', home: 'emmanuel', away_score: 12, home_score: 9 },
      { wk: 5, date: 'Feb 15', away: 'vbs', home: 'bagel-dawgs', away_score: 20, home_score: 4 },
      { wk: 5, date: 'Feb 15', away: 'akiba-blue', home: 'isaiah-nouveau', away_score: 16, home_score: 11 },
      { wk: 5, date: 'Feb 15', away: 'lbt', home: 'or-ami', away_score: 21, home_score: 1 },
      { wk: 5, date: 'Feb 15', away: 'tioh', home: 'judea', away_score: 17, home_score: 16 },
      { wk: 5, date: 'Feb 15', away: 'santa-monica', home: 'kehillat-israel', away_score: 28, home_score: 18 },
      { wk: 5, date: 'Feb 15', away: 'beth-am', home: 'santa-monica', away_score: 23, home_score: 13 },
      { wk: 5, date: 'Feb 15', away: 'aae-menchwarmers', home: 'sinai-swingers', away_score: 16, home_score: 11 },
      { wk: 5, date: 'Feb 15', away: 'beth-am-sinai-ikar', home: 'beth-shir-shalom', away_score: 7, home_score: 0 },

      // Week 6 — Mar 1
      { wk: 6, date: 'Mar 1', away: 'bagel-dawgs', home: 'emmanuel', away_score: 11, home_score: 9 },
      { wk: 6, date: 'Mar 1', away: 'akiba-blue', home: 'aae-as', away_score: 7, home_score: 0 },
      { wk: 6, date: 'Mar 1', away: 'uni-beth-hillel', home: 'vbs', away_score: 10, home_score: 5 },
      { wk: 6, date: 'Mar 1', away: 'isaiah-nouveau', home: 'hamakom-epstein', away_score: 10, home_score: 9 },
      { wk: 6, date: 'Mar 1', away: 'or-ami', home: 'tioh', away_score: 15, home_score: 15 },
      { wk: 6, date: 'Mar 1', away: 'hamakom-miller', home: 'isaiah-ogs', away_score: 20, home_score: 11 },
      { wk: 6, date: 'Mar 1', away: 'akiba-red', home: 'santa-monica', away_score: 22, home_score: 16 },
      { wk: 6, date: 'Mar 1', away: 'beth-am', home: 'kehillat-israel', away_score: 8, home_score: 4 },
      { wk: 6, date: 'Mar 1', away: 'aae-menchwarmers', home: 'sinai-swingers', away_score: 16, home_score: 5 },
      { wk: 6, date: 'Mar 1', away: 'beth-am-sinai-ikar', home: 'beth-shir-shalom', away_score: 7, home_score: 0 },
    ];

    let gameCount = 0;
    for (const game of completedGames) {
      gameCount++;
      const gameId = `g-w${game.wk}-${gameCount}`;
      await fsPatch(`games/${gameId}`, {
        wk: game.wk,
        date: game.date,
        away: game.away,
        home: game.home,
        away_score: game.away_score,
        home_score: game.home_score,
        done: true,
        time: '',
        field: '',
        season: 2026
      });
      log(`Game ${gameId}: ${game.away} ${game.away_score} - ${game.home} ${game.home_score}`);
    }

    // ── SCHEDULED GAMES (done: false) ────────────────────
    log('--- Creating scheduled games ---');

    const scheduledGames = [
      // Week 10 — Mar 22
      // Cheviot Hills #1
      { wk: 10, date: 'Mar 22', time: '9:00 AM', field: 'Cheviot Hills #1', away: 'sinai-swingers', home: 'beth-shir-shalom' },
      { wk: 10, date: 'Mar 22', time: '11:00 AM', field: 'Cheviot Hills #1', away: 'santa-monica', home: 'kehillat-israel' },
      // Cheviot Hills #3
      { wk: 10, date: 'Mar 22', time: '9:00 AM', field: 'Cheviot Hills #3', away: 'beth-am', home: 'isaiah-ogs' },
      { wk: 10, date: 'Mar 22', time: '11:00 AM', field: 'Cheviot Hills #3', away: 'aae-as', home: 'isaiah-nouveau' },
      // Sepulveda Basin #2
      { wk: 10, date: 'Mar 22', time: '9:00 AM', field: 'Sepulveda Basin #2', away: 'uni-beth-hillel', home: 'bagel-dawgs' },
      { wk: 10, date: 'Mar 22', time: '11:00 AM', field: 'Sepulveda Basin #2', away: 'beth-am-sinai-ikar', home: 'aae-menchwarmers' },
      // Sepulveda Basin #3
      { wk: 10, date: 'Mar 22', time: '9:00 AM', field: 'Sepulveda Basin #3', away: 'tioh', home: 'or-ami' },
      { wk: 10, date: 'Mar 22', time: '11:00 AM', field: 'Sepulveda Basin #3', away: 'lbt', home: 'judea' },
      // Sepulveda Basin #4
      { wk: 10, date: 'Mar 22', time: '9:00 AM', field: 'Sepulveda Basin #4', away: 'vbs', home: 'emmanuel' },
      { wk: 10, date: 'Mar 22', time: '11:00 AM', field: 'Sepulveda Basin #4', away: 'hamakom-miller', home: 'akiba-red' },
      { wk: 10, date: 'Mar 22', time: '1:00 PM', field: 'Sepulveda Basin #4', away: 'akiba-blue', home: 'hamakom-epstein' },

      // Week 11 — Mar 29
      // Cheviot Hills #1
      { wk: 11, date: 'Mar 29', time: '9:00 AM', field: 'Cheviot Hills #1', away: 'isaiah-ogs', home: 'kehillat-israel' },
      { wk: 11, date: 'Mar 29', time: '11:00 AM', field: 'Cheviot Hills #1', away: 'isaiah-nouveau', home: 'vbs' },
      // Cheviot Hills #3
      { wk: 11, date: 'Mar 29', time: '9:00 AM', field: 'Cheviot Hills #3', away: 'beth-shir-shalom', home: 'beth-am-sinai-ikar' },
      { wk: 11, date: 'Mar 29', time: '11:00 AM', field: 'Cheviot Hills #3', away: 'beth-am', home: 'akiba-red' },
      // Sepulveda Basin #2
      { wk: 11, date: 'Mar 29', time: '9:00 AM', field: 'Sepulveda Basin #2', away: 'or-ami', home: 'lbt' },
      { wk: 11, date: 'Mar 29', time: '11:00 AM', field: 'Sepulveda Basin #2', away: 'judea', home: 'tioh' },
      // Sepulveda Basin #3
      { wk: 11, date: 'Mar 29', time: '9:00 AM', field: 'Sepulveda Basin #3', away: 'aae-menchwarmers', home: 'sinai-swingers' },
      { wk: 11, date: 'Mar 29', time: '11:00 AM', field: 'Sepulveda Basin #3', away: 'aae-as', home: 'emmanuel' },
      // Sepulveda Basin #4
      { wk: 11, date: 'Mar 29', time: '9:00 AM', field: 'Sepulveda Basin #4', away: 'akiba-blue', home: 'bagel-dawgs' },
      { wk: 11, date: 'Mar 29', time: '11:00 AM', field: 'Sepulveda Basin #4', away: 'hamakom-miller', home: 'santa-monica' },
      { wk: 11, date: 'Mar 29', time: '1:00 PM', field: 'Sepulveda Basin #4', away: 'hamakom-epstein', home: 'uni-beth-hillel' },
    ];

    for (const game of scheduledGames) {
      gameCount++;
      const gameId = `g-w${game.wk}-${gameCount}`;
      await fsPatch(`games/${gameId}`, {
        wk: game.wk,
        date: game.date,
        away: game.away,
        home: game.home,
        away_score: 0,
        home_score: 0,
        done: false,
        time: game.time,
        field: game.field,
        season: 2026
      });
      log(`Scheduled ${gameId}: ${game.away} vs ${game.home} @ ${game.field} ${game.time}`);
    }

    log(`--- DONE: ${teams.length} teams, ${completedGames.length} completed games, ${scheduledGames.length} scheduled games ---`);

    return res.status(200).json({ success: true, results, summary: { teams: teams.length, completedGames: completedGames.length, scheduledGames: scheduledGames.length } });

  } catch (err) {
    console.error('seed-data error:', err);
    return res.status(500).json({ error: err.message, results });
  }
}
