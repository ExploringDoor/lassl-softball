import { useState, useEffect } from "react";

const L_LEAGUE = "/league2.png";
const L_AAE    = "/2.png";
const L_EMAN   = "/3.png";
const L_ISAIAH = "/4.png";
const L_VBS    = "/5.png";

const TEAM_LOGOS = {
  "VBS": L_VBS, "AAE A's": L_AAE, "AAE Menchwarmers": L_AAE,
  "AAE Mensch Warmers": L_AAE, "Emmanuel": L_EMAN,
  "Emanuel": L_EMAN, "Isaiah-Nouveau": L_ISAIAH, "Isaiah Nouveau": L_ISAIAH,
  "Isaiah OG's": L_ISAIAH,
  "Bagel Dawgs": "/logo/1.png",
  "Akiba-Red": "/logo/2.png",
  "Akiba-Blue": "/logo/3.png",
  "Hamakom-Miller": "/logo/4.png",
  "Beth Am": "/logo/5.png",
  "Or Ami": "/logo/6.png",
  "Santa Monica": "/logo/7.png",
  "Sinai Swingers": "/logo/8.png",
  "Sinai Swingers/Beth Shir Shalom": "/logo/8.png",
  "Judea": "/logo/9.png",
  "Kehillat Israel": "/logo/10.png",
  "Beth Am/Sinai/Ikar": "/logo/11.png",
  "Beth Shir Shalom": "/logo/12.png",
  "Hamakom-Epstein": "/logo/13.png",
  "TIOH": "/logo/14.png",
  "Uni/Beth Hillel": "/logo/15.png",
  "LBT": "/logo/16.png",
};

const DIV = {
  A:{ name:"Division A", accent:"#1d4ed8",
    teams:[
      {seed:1,name:"VBS",full:"Valley Beth Shalom",w:7,l:2,t:0,pct:".778",gp:9,rs:117,ra:39,diff:"+78"},
      {seed:2,name:"AAE A's",full:"Anshei Am Echad A's",w:6,l:3,t:0,pct:".667",gp:9,rs:110,ra:88,diff:"+22"},
      {seed:3,name:"Emmanuel",full:"Emmanuel",w:2,l:7,t:0,pct:".222",gp:9,rs:92,ra:108,diff:"-16"},
      {seed:4,name:"Isaiah-Nouveau",full:"Isaiah Nouveau",w:2,l:7,t:0,pct:".222",gp:9,rs:88,ra:148,diff:"-60"},
    ]},
  B:{ name:"Division B", accent:"#15803d",
    teams:[
      {seed:1,name:"Bagel Dawgs",full:"Bagel Dawgs",w:7,l:2,t:0,pct:".778",gp:9,rs:115,ra:79,diff:"+36"},
      {seed:2,name:"Akiba-Blue",full:"Akiba-Blue",w:5,l:3,t:0,pct:".625",gp:8,rs:92,ra:84,diff:"+8"},
      {seed:3,name:"Uni/Beth Hillel",full:"Uni/Beth Hillel",w:5,l:3,t:0,pct:".625",gp:8,rs:81,ra:82,diff:"-1"},
      {seed:4,name:"Hamakom-Epstein",full:"Hamakom-Epstein",w:0,l:7,t:0,pct:".000",gp:7,rs:42,ra:109,diff:"-67"},
    ]},
  C:{ name:"Division C", accent:"#b45309",
    teams:[
      {seed:1,name:"LBT",full:"LBT",w:5,l:2,t:1,pct:".714",gp:8,rs:127,ra:72,diff:"+55"},
      {seed:2,name:"TIOH",full:"TIOH",w:4,l:3,t:2,pct:".571",gp:9,rs:133,ra:128,diff:"+5"},
      {seed:3,name:"Judea",full:"Judea",w:3,l:5,t:0,pct:".375",gp:8,rs:113,ra:118,diff:"-5"},
      {seed:4,name:"Or Ami",full:"Or Ami",w:3,l:5,t:1,pct:".375",gp:9,rs:93,ra:148,diff:"-55"},
    ]},
  D:{ name:"Division D", accent:"#6d28d9",
    teams:[
      {seed:1,name:"Santa Monica",full:"Santa Monica",w:6,l:4,t:0,pct:".600",gp:10,rs:185,ra:163,diff:"+22"},
      {seed:2,name:"Akiba-Red",full:"Akiba-Red",w:5,l:2,t:1,pct:".714",gp:8,rs:118,ra:106,diff:"+12"},
      {seed:3,name:"Beth Am",full:"Beth Am",w:5,l:5,t:0,pct:".500",gp:10,rs:146,ra:131,diff:"+15"},
      {seed:4,name:"Hamakom-Miller",full:"Hamakom-Miller",w:4,l:4,t:0,pct:".500",gp:8,rs:128,ra:135,diff:"-7"},
      {seed:5,name:"Kehillat Israel",full:"Kehillat Israel",w:4,l:4,t:1,pct:".500",gp:9,rs:116,ra:125,diff:"-9"},
      {seed:6,name:"Isaiah OG's",full:"Isaiah OG's",w:2,l:7,t:0,pct:".222",gp:9,rs:117,ra:150,diff:"-33"},
    ]},
  E:{ name:"Division E", accent:"#be123c",
    teams:[
      {seed:1,name:"AAE Menchwarmers",full:"AAE Menchwarmers",w:8,l:1,t:0,pct:".889",gp:9,rs:132,ra:72,diff:"+60"},
      {seed:2,name:"Beth Am/Sinai/Ikar",full:"Beth Am/Sinai/Ikar",w:6,l:2,t:0,pct:".750",gp:8,rs:92,ra:38,diff:"+54"},
      {seed:3,name:"Sinai Swingers",full:"Sinai Swingers",w:2,l:6,t:0,pct:".250",gp:8,rs:99,ra:126,diff:"-27"},
      {seed:4,name:"Beth Shir Shalom",full:"Beth Shir Shalom",w:0,l:7,t:0,pct:".000",gp:7,rs:11,ra:98,diff:"-87"},
    ]},
};

const ALL_TEAMS_STATIC = Object.entries(DIV).flatMap(([dk,div]) =>
  div.teams.map(t => ({...t, divKey:dk, divName:div.name, divAccent:div.accent}))
);

/* ─── DIVISION MAPPING (team name → division key) ─────────────────────── */
const TEAM_DIV_MAP = {};
Object.entries(DIV).forEach(([dk, div]) => {
  div.teams.forEach(t => { TEAM_DIV_MAP[t.name] = dk; });
});

/* ─── FIREBASE DATA TRANSFORMER ───────────────────────────────────────── */
function buildLiveData(fbTeams, fbGames) {
  const liveDIV = JSON.parse(JSON.stringify(DIV));

  for (const fbT of fbTeams) {
    const teamName = fbT.name;
    const divKey = fbT.div || TEAM_DIV_MAP[teamName];
    if (!divKey || !liveDIV[divKey]) continue;
    const slot = liveDIV[divKey].teams.find(t => t.name === teamName || t.full === teamName);
    if (!slot) continue;
    slot.w = fbT.w ?? slot.w;
    slot.l = fbT.l ?? slot.l;
    slot.t = fbT.t ?? slot.t ?? 0;
    const w = slot.w, l = slot.l;
    slot.pct = (w + l) > 0 ? (w / (w + l)).toFixed(3).replace(/^0/, '') : ".000";
    slot.gp = (fbT.gp ?? (w + l + (slot.t || 0)));
    slot.rs = fbT.rs ?? slot.rs;
    slot.ra = fbT.ra ?? slot.ra;
    const d = slot.rs - slot.ra;
    slot.diff = d > 0 ? `+${d}` : d === 0 ? "0" : `${d}`;
    slot.fbId = fbT.id;
  }

  Object.values(liveDIV).forEach(div => {
    div.teams.sort((a, b) => parseFloat(b.pct) - parseFloat(a.pct));
    div.teams.forEach((t, i) => { t.seed = i + 1; });
  });

  const idToName = {};
  for (const t of fbTeams) { idToName[t.id] = t.name; }

  const doneGames = fbGames.filter(g => g.done);
  const weekMap = {};
  for (const g of doneGames) {
    const wk = g.wk || 0;
    if (!weekMap[wk]) weekMap[wk] = { week: g.date ? `Week ${wk} – ${g.date}` : `Week ${wk}`, games: [] };
    const awayName = idToName[g.away] || g.away;
    const homeName = idToName[g.home] || g.home;
    weekMap[wk].games.push({
      away: awayName, aScore: g.away_score ?? 0,
      home: homeName, hScore: g.home_score ?? 0,
      div: findDivLabel(awayName, homeName),
      note: g.note || undefined,
    });
  }
  const liveScores = Object.entries(weekMap)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([, v]) => v);

  const upGames = fbGames.filter(g => !g.done);
  const schedMap = {};
  for (const g of upGames) {
    const wk = g.wk || 0;
    if (!schedMap[wk]) schedMap[wk] = { label: g.date ? `Week ${wk} – ${g.date}` : `Week ${wk}`, fieldMap: {} };
    const fieldName = g.field || "TBD";
    if (!schedMap[wk].fieldMap[fieldName]) schedMap[wk].fieldMap[fieldName] = [];
    schedMap[wk].fieldMap[fieldName].push({
      time: g.time || "TBD",
      away: idToName[g.away] || g.away,
      home: idToName[g.home] || g.home,
    });
  }
  const liveSched = Object.entries(schedMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([, v]) => ({
      label: v.label,
      fields: Object.entries(v.fieldMap).map(([name, games]) => ({ name, games })),
    }));

  return { liveDIV, liveScores, liveSched };
}

function findDivLabel(away, home) {
  const dA = TEAM_DIV_MAP[away], dB = TEAM_DIV_MAP[home];
  if (dA && dB && dA === dB) return dA;
  if (dA && dB) return `${dA}/${dB}`;
  return dA || dB || "";
}

/* ─── DATA HOOK ────────────────────────────────────────────────────────── */
function useLiveData() {
  const [data, setData] = useState({ div: DIV, scores: SCORES, sched: SCHED, rosters: TEAM_ROSTERS, loading: true, live: false });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/get-data')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(({ teams, games, players }) => {
        if (cancelled) return;
        const { liveDIV, liveScores, liveSched } = buildLiveData(teams, games);

        const liveRosters = { ...TEAM_ROSTERS };
        const idToName = {};
        for (const t of teams) idToName[t.id] = t.name;
        const teamPlayers = {};
        for (const p of players) {
          const tName = idToName[p.team] || p.team;
          if (!teamPlayers[tName]) teamPlayers[tName] = [];
          teamPlayers[tName].push(p.name);
        }
        Object.entries(teamPlayers).forEach(([name, roster]) => {
          if (roster.length > 0) liveRosters[name] = roster;
        });

        setData({
          div: liveDIV,
          scores: liveScores.length > 0 ? liveScores : SCORES,
          sched: SCHED,
          rosters: liveRosters,
          loading: false,
          live: true,
        });
      })
      .catch(() => {
        if (!cancelled) setData(d => ({ ...d, loading: false, live: false }));
      });
    return () => { cancelled = true; };
  }, []);

  return data;
}

const TEAM_COLORS = {
  "VBS":"#1d4ed8","AAE A's":"#b45309","AAE Menchwarmers":"#b45309",
  "Emmanuel":"#15803d","Emanuel":"#15803d","Isaiah-Nouveau":"#ea580c","Isaiah Nouveau":"#ea580c",
  "Akiba-Blue":"#0369a1","Uni/Beth Hillel":"#7c3aed","Bagel Dawgs":"#b91c1c","Hamakom-Epstein":"#64748b",
  "LBT":"#0f766e","TIOH":"#0284c7","Or Ami":"#d97706","Judea":"#16a34a",
  "Hamakom-Miller":"#7c3aed","Akiba-Red":"#dc2626","Beth Am":"#2563eb","Santa Monica":"#0891b2",
  "Kehillat Israel":"#059669","Isaiah OG's":"#9333ea",
  "Beth Am/Sinai/Ikar":"#2563eb","Sinai Swingers":"#b45309","Beth Shir Shalom":"#64748b",
};

const TEAM_ROSTERS = {};

const SCORES = [
  {week:"Week 9 – March 22",games:[
    {away:"AAE A's",aScore:19,home:"Isaiah Nouveau",hScore:10,div:"A"},
    {away:"VBS",aScore:7,home:"Emanuel",hScore:0,div:"A",note:"Forfeit"},
    {away:"Bagel Dawgs",aScore:15,home:"Uni/Beth Hillel",hScore:11,div:"B"},
    {away:"Or Ami",aScore:16,home:"TIOH",hScore:12,div:"C"},
    {away:"LBT",aScore:18,home:"Judea",hScore:3,div:"C"},
    {away:"Beth Am",aScore:13,home:"Isaiah OG's",hScore:3,div:"D"},
    {away:"Santa Monica",aScore:14,home:"Kehillat Israel",hScore:8,div:"D"},
    {away:"Akiba-Red",aScore:30,home:"Hamakom-Miller",hScore:21,div:"D"},
    {away:"AAE Mensch Warmers",aScore:23,home:"Sinai Swingers/Beth Shir Shalom",hScore:3,div:"E"},
  ]},
  {week:"Week 8 – March 15",games:[
    {away:"AAE A's",aScore:9,home:"VBS",hScore:7,div:"A"},
    {away:"Isaiah Nouveau",aScore:13,home:"Emanuel",hScore:12,div:"A"},
    {away:"Bagel Dawgs",aScore:19,home:"Hamakom-Epstein",hScore:8,div:"B"},
    {away:"Uni/Beth Hillel",aScore:7,home:"Akiba-Blue",hScore:0,div:"B",note:"Forfeit"},
    {away:"TIOH",aScore:11,home:"LBT",hScore:10,div:"C"},
    {away:"Judea",aScore:16,home:"Or Ami",hScore:8,div:"C"},
    {away:"Santa Monica",aScore:22,home:"Beth Am",hScore:20,div:"D"},
    {away:"Kehillat Israel",aScore:18,home:"Hamakom-Miller",hScore:8,div:"D"},
    {away:"Akiba-Red",aScore:23,home:"Isaiah OG's",hScore:16,div:"D"},
    {away:"Beth Am/Sinai/Ikar",aScore:11,home:"AAE Mensch Warmers",hScore:7,div:"E"},
  ]},
  {week:"Week 7 – March 8",games:[
    {away:"VBS",aScore:20,home:"Isaiah Nouveau",hScore:7,div:"A"},
    {away:"Emanuel",aScore:20,home:"AAE A's",hScore:11,div:"A"},
    {away:"Bagel Dawgs",aScore:15,home:"Akiba-Blue",hScore:10,div:"B"},
    {away:"Judea",aScore:16,home:"TIOH",hScore:7,div:"C"},
    {away:"Or Ami",aScore:17,home:"LBT",hScore:15,div:"C"},
    {away:"Santa Monica",aScore:22,home:"Isaiah OG's",hScore:19,div:"D"},
    {away:"Kehillat Israel",aScore:11,home:"Akiba-Red",hScore:11,div:"D"},
    {away:"Hamakom-Miller",aScore:18,home:"Beth Am",hScore:17,div:"D"},
    {away:"AAE Mensch Warmers",aScore:22,home:"Sinai Swingers",hScore:15,div:"E"},
    {away:"Beth Am/Sinai/Ikar",aScore:7,home:"Beth Shir Shalom",hScore:0,div:"E",note:"Forfeit"},
  ]},
  {week:"Week 6 – March 1",games:[
    {away:"Bagel Dawgs",aScore:11,home:"Emanuel",hScore:9,div:"A/B"},
    {away:"Akiba-Blue",aScore:7,home:"AAE A's",hScore:0,div:"A/B",note:"Forfeit"},
    {away:"Uni/Beth Hillel",aScore:10,home:"VBS",hScore:5,div:"A/B"},
    {away:"Isaiah Nouveau",aScore:10,home:"Hamakom-Epstein",hScore:9,div:"A/B"},
    {away:"Or Ami",aScore:15,home:"TIOH",hScore:15,div:"C"},
    {away:"Hamakom-Miller",aScore:20,home:"Isaiah OG's",hScore:11,div:"D"},
    {away:"Akiba-Red",aScore:22,home:"SMS",hScore:16,div:"D"},
    {away:"Beth Am",aScore:8,home:"Kehillat Israel",hScore:4,div:"D"},
    {away:"AAE Mensch Warmers",aScore:16,home:"Sinai Swingers",hScore:5,div:"E"},
    {away:"Beth Am/Sinai/Ikar",aScore:7,home:"Beth Shir Shalom",hScore:0,div:"E",note:"Forfeit"},
  ]},
  {week:"Week 5 – Feb 15",games:[
    {away:"AAE A's",aScore:12,home:"Hamakom-Epstein",hScore:11,div:"A/B"},
    {away:"Uni/Beth Hillel",aScore:12,home:"Emanuel",hScore:9,div:"A/B"},
    {away:"VBS",aScore:20,home:"Bagel Dawgs",hScore:4,div:"A/B"},
    {away:"Akiba-Blue",aScore:16,home:"Isaiah Nouveau",hScore:11,div:"A/B"},
    {away:"LBT",aScore:21,home:"Or Ami",hScore:1,div:"C"},
    {away:"TIOH",aScore:17,home:"Judea",hScore:16,div:"C"},
    {away:"Santa Monica",aScore:28,home:"Kehillat Israel",hScore:18,div:"D"},
    {away:"Beth Am",aScore:23,home:"Santa Monica",hScore:13,div:"D"},
    {away:"Isaiah OG's",aScore:18,home:"Beth Am",hScore:13,div:"D"},
    {away:"AAE Mensch Warmers",aScore:16,home:"Sinai Swingers",hScore:11,div:"E"},
    {away:"Beth Am/Sinai/Ikar",aScore:7,home:"Beth Shir Shalom",hScore:0,div:"E",note:"Forfeit"},
  ]},
  {week:"Week 4 – Feb 8",games:[
    {away:"AAE A's",aScore:21,home:"Uni/Beth Hillel",hScore:8,div:"A/B"},
    {away:"VBS",aScore:19,home:"Hamakom-Epstein",hScore:0,div:"A/B"},
    {away:"Bagel Dawgs",aScore:11,home:"Isaiah Nouveau",hScore:10,div:"A/B"},
    {away:"Akiba-Blue",aScore:19,home:"Emmanuel",hScore:16,div:"A/B"},
    {away:"LBT",aScore:17,home:"Judea",hScore:11,div:"C"},
    {away:"Or Ami",aScore:15,home:"TIOH",hScore:12,div:"C"},
    {away:"Kehillat Israel",aScore:15,home:"Hamakom-Miller",hScore:13,div:"D"},
    {away:"Beth Am",aScore:23,home:"Santa Monica",hScore:13,div:"D"},
    {away:"Isaiah OG's",aScore:7,home:"Akiba-Red",hScore:0,div:"D",note:"Forfeit"},
    {away:"AAE Mensch Warmers",aScore:16,home:"Beth Am/Sinai/Ikar",hScore:10,div:"E"},
    {away:"Sinai Swingers",aScore:24,home:"Beth Shir Shalom",hScore:3,div:"E"},
  ]},
  {week:"Week 3 – Feb 1",games:[
    {away:"VBS",aScore:13,home:"Emmanuel",hScore:3,div:"A"},
    {away:"AAE A's",aScore:27,home:"Isaiah Nouveau",hScore:10,div:"A"},
    {away:"Uni/Beth Hillel",aScore:8,home:"Bagel Dawgs",hScore:4,div:"B"},
    {away:"Akiba-Blue",aScore:18,home:"Hamakom-Epstein",hScore:5,div:"B"},
    {away:"LBT",aScore:18,home:"TIOH",hScore:18,div:"C"},
    {away:"Judea",aScore:29,home:"Or Ami",hScore:10,div:"C"},
    {away:"Santa Monica",aScore:22,home:"Isaiah OG's",hScore:11,div:"D"},
    {away:"Beth Am",aScore:18,home:"Hamakom-Miller",hScore:17,div:"D"},
    {away:"Akiba-Red",aScore:16,home:"Kehillat Israel",hScore:10,div:"D"},
    {away:"Beth Am/Sinai/Ikar",aScore:24,home:"Sinai Swingers",hScore:4,div:"E"},
    {away:"AAE Mensch Warmers",aScore:7,home:"Beth Shir Shalom",hScore:0,div:"E",note:"Forfeit"},
  ]},
  {week:"Week 2 – Jan 25",games:[
    {away:"VBS",aScore:10,home:"AAE A's",hScore:3,div:"A"},
    {away:"Emmanuel",aScore:18,home:"Isaiah Nouveau",hScore:14,div:"A"},
    {away:"Bagel Dawgs",aScore:22,home:"Hamakom-Epstein",hScore:2,div:"B"},
    {away:"Akiba-Blue",aScore:21,home:"Uni/Beth Hillel",hScore:16,div:"B"},
    {away:"TIOH",aScore:23,home:"Judea",hScore:18,div:"C"},
    {away:"LBT",aScore:10,home:"Or Ami",hScore:7,div:"C"},
    {away:"Santa Monica",aScore:23,home:"Akiba-Red",hScore:5,div:"D"},
    {away:"Kehillat Israel",aScore:12,home:"Beth Am",hScore:9,div:"D"},
    {away:"Hamakom-Miller",aScore:17,home:"Isaiah OG's",hScore:14,div:"D"},
    {away:"AAE Mensch Warmers",aScore:17,home:"Sinai Swingers",hScore:15,div:"E"},
    {away:"Beth Am/Sinai/Ikar",aScore:24,home:"Beth Shir Shalom",hScore:3,div:"E"},
  ]},
  {week:"Week 1 – Jan 18",games:[
    {away:"AAE A's",aScore:8,home:"Emanuel",hScore:5,div:"A"},
    {away:"VBS",aScore:16,home:"Isaiah Nouveau",hScore:3,div:"A"},
    {away:"Bagel Dawgs",aScore:14,home:"Akiba-Blue",hScore:1,div:"B"},
    {away:"Uni/Beth Hillel",aScore:9,home:"Hamakom-Epstein",hScore:7,div:"B"},
    {away:"TIOH",aScore:18,home:"Or Ami",hScore:4,div:"C"},
    {away:"LBT",aScore:18,home:"Judea",hScore:4,div:"C"},
    {away:"Hamakom-Miller",aScore:14,home:"Santa Monica",hScore:12,div:"D"},
    {away:"Kehillat Israel",aScore:20,home:"Isaiah OG's",hScore:18,div:"D"},
    {away:"Akiba-Red",aScore:11,home:"Beth Am",hScore:2,div:"D"},
    {away:"AAE Mensch Warmers",aScore:8,home:"Beth Am/Sinai/Ikar",hScore:2,div:"E"},
    {away:"Sinai Swingers",aScore:22,home:"Beth Shir Shalom",hScore:5,div:"E"},
  ]},
];

const SCHED = [
  { label:"Week 10 – Mar 29 (Scores Pending)", fields:[
    {name:"Cheviot Hills #1",games:[{time:"9:00 AM",away:"Kehillat Israel",home:"AAE Mensch Warmers"},{time:"11:00 AM",away:"Isaiah Nouveau",home:"VBS"}]},
    {name:"Cheviot Hills #3",games:[{time:"9:00 AM",away:"Sinai Swingers",home:"Beth Am/Sinai/Ikar"},{time:"11:00 AM",away:"Akiba-Red",home:"Beth Am"}]},
    {name:"Sepulveda Basin #2",games:[{time:"9:00 AM",away:"Or Ami",home:"LBT"},{time:"11:00 AM",away:"Judea",home:"TIOH"}]},
    {name:"Sepulveda Basin #3",games:[{time:"11:00 AM",away:"AAE A's",home:"Emanuel"}]},
    {name:"Sepulveda Basin #4",games:[{time:"9:00 AM",away:"Akiba-Blue",home:"Bagel Dawgs"},{time:"11:00 AM",away:"Hamakom-Miller",home:"Santa Monica"},{time:"1:00 PM",away:"Hamakom-Epstein",home:"Uni/Beth Hillel"}]},
  ]},
  { label:"Make-Ups – Apr 5", fields:[
    {name:"Cheviot Hills #1",games:[{time:"9:00 AM",away:"Judea",home:"LBT"},{time:"11:00 AM",away:"AAE Mensch Warmers",home:"Beth Am/Sinai/Ikar"}]},
    {name:"Mar Vista #3",games:[{time:"9:00 AM",away:"Uni/Beth Hillel",home:"Hamakom-Epstein"},{time:"11:00 AM",away:"Akiba-Blue",home:"Hamakom-Epstein"}]},
    {name:"Mar Vista #1",games:[{time:"9:00 AM",away:"Akiba-Red",home:"Hamakom-Miller"}]},
  ]},
  { label:"Week 11 – Apr 12", fields:[
    {name:"Cheviot Hills #1",games:[{time:"9:00 AM",away:"Kehillat Israel",home:"Isaiah OG's"},{time:"11:00 AM",away:"Isaiah Nouveau",home:"Uni/Beth Hillel"}]},
    {name:"Cheviot Hills #2",games:[{time:"11:00 AM",away:"Akiba-Red",home:"Beth Am"}]},
    {name:"Cheviot Hills #3",games:[{time:"1:00 PM",away:"Beth Am/Sinai/Ikar",home:"Sinai Swingers"}]},
    {name:"Mar Vista #3",games:[{time:"9:00 AM",away:"LBT",home:"TIOH"},{time:"11:00 AM",away:"VBS",home:"Akiba-Blue"}]},
    {name:"Hjelte #3",games:[{time:"9:00 AM",away:"Or Ami",home:"Judea"},{time:"11:00 AM",away:"Emmanuel",home:"Hamakom-Epstein"},{time:"1:00 PM",away:"AAE Mensch Warmers",home:"Hamakom-Miller"}]},
    {name:"Hjelte #2",games:[{time:"9:00 AM",away:"AAE A's",home:"Bagel Dawgs"}]},
  ]},
];

const RULES_DATA = [
  {section:"General Rules",icon:"📋",items:[
    "All games are governed by ASA/USA Softball rules, except as modified below.",
    "Games are 7 innings or 65 minutes, whichever comes first. No new inning starts after 60 minutes.",
    "A game is official after 4 full innings (3½ if the home team is ahead).",
    "Mercy rule: 15 runs after 3 innings, 10 runs after 5 innings.",
    "Teams must field a minimum of 8 players to avoid forfeit. Missing batting spots are automatic outs.",
    "Managers must exchange lineup cards with the plate umpire before the game.",
  ]},
  {section:"Batting & Hitting",icon:"🥎",items:[
    "A 12-inch slow-pitch softball is used.",
    "Strike zone mat is used — any pitch landing on the mat is a strike regardless of batter action.",
    "Each batter starts with a 1-1 count.",
    "A foul ball on a 2-strike count is an out.",
    "Home runs over the fence are allowed; unlimited HR rule applies in regular season only.",
    "Batting helmets are mandatory for all batters and base runners.",
  ]},
  {section:"Baserunning",icon:"🏃",items:[
    "Leading off and stealing bases are not permitted.",
    "Bunting and slap hitting are prohibited.",
    "A runner may not advance on a dropped third strike.",
    "Courtesy runners are permitted once per inning per team — the runner must be the last recorded out.",
    "Double bag (orange) is in use at first base — batters use the orange bag, fielders use the white bag.",
  ]},
  {section:"Pitching",icon:"🤾",items:[
    "All pitching is slow-pitch. The ball must arc between 6 and 12 feet above the ground.",
    "Pitchers must keep one foot on the rubber until the ball is released.",
    "There is no limit on pitches per game or inning.",
    "Intentional walks: the pitcher may announce an intentional walk without throwing pitches.",
  ]},
  {section:"Lineup & Substitutions",icon:"📝",items:[
    "Teams may bat up to 12 players with free defensive substitution.",
    "Once a player is removed from the batting order, they may not re-enter.",
    "Injured player: if no substitute is available, that spot is skipped (no automatic out).",
    "Teams may play with a continuous batting order — all present players bat.",
  ]},
  {section:"Sportsmanship",icon:"🤝",items:[
    "Umpire decisions are final. Arguing balls and strikes results in a warning, then ejection.",
    "Verbal abuse of umpires, opposing players, or spectators results in immediate ejection.",
    "Ejected players must leave the field and surrounding area.",
    "Alcohol is not permitted on or near the playing field.",
    "LASSL emphasizes sportsmanship, community, and fun. Treat all opponents with respect.",
  ]},
  {section:"Fields & Scheduling",icon:"🏟️",items:[
    "All games are played on Sundays starting the second week in January at 9:00 AM, 11:00 AM, or 1:00 PM.",
    "Regular season is 11–14 weeks depending on rainouts.",
    "5 fields are used each Sunday for 12 games: 3 fields have games at 9 AM and 11 AM, 2 fields have games at 9 AM, 11 AM, and 1 PM.",
    "Home team is responsible for field preparation (raking bases, lining if needed).",
    "In case of rain, the league coordinator will notify managers by 8:00 AM on game day.",
    "Rainouts will be rescheduled at the discretion of the league coordinator.",
    "Games cannot be rescheduled by teams unilaterally — contact the league coordinator.",
    "LASSL fields: Cheviot Hills Park, Sepulveda Basin.",
  ]},
  {section:"Divisions & Movement",icon:"🔄",items:[
    "During the regular season, some divisions play other divisions.",
    "Teams may be moved up or down between divisions. Changes typically take place within the first 5 games of the season.",
  ]},
  {section:"Playoffs",icon:"🏆",items:[
    "All teams make the playoffs.",
    "The format is set by the Board prior to the end of the regular season.",
    "Most years, the format is single elimination.",
    "For divisions with 4 teams: standard single-elimination bracket.",
    "For divisions with 6 teams: #6 at #3 and #5 at #4 in quarterfinals; #2 at #1 determines seeding for semis; semifinal winners play for the championship.",
    "To be eligible for playoffs, a player must have played in or attended at least 3 regular season games.",
    "All playoff games are a minimum of 7 innings with no time limit. If tied after 7, extra innings are played.",
    "Tiebreakers: (1) head-to-head record, (2) head-to-head margin of victory, (3) total run differential, (4) total runs scored, (5) coin toss.",
  ]},
];

/* ─── SHARED COMPONENTS ─────────────────────────────────────────────────── */
function TLogo({ name, size=80 }) {
  const src = TEAM_LOGOS[name];
  if (src) return (
    <div style={{width:size,height:size,flexShrink:0}}>
      <img src={src} alt={name} style={{width:size,height:size,objectFit:"contain",display:"block"}} />
    </div>
  );
  const color = TEAM_COLORS[name] || "#0057FF";
  const boxSize = size * 0.75;
  return (
    <div style={{width:size,height:size,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:boxSize,height:boxSize,borderRadius:8,background:`${color}18`,border:`2px solid ${color}50`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:boxSize*0.28,color,textTransform:"uppercase"}}>{name.slice(0,4)}</span>
      </div>
    </div>
  );
}

function PageHero({ label, title, subtitle, children }) {
  return (
    <div style={{background:"#fff",borderBottom:"3px solid #0057FF",padding:"28px clamp(12px,3vw,40px) 0",overflow:"hidden",width:"100%"}}>
      <div style={{maxWidth:1400,margin:"0 auto",overflow:"hidden"}}>
        {label && <div style={{fontSize:14,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0057FF",marginBottom:4}}>{label}</div>}
        <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(40px,7vw,80px)",textTransform:"uppercase",color:"#111",lineHeight:1}}>{title}</h1>
        {subtitle && <div style={{fontSize:14,color:"rgba(0,0,0,0.38)",marginTop:4}}>{subtitle}</div>}
        {children}
      </div>
    </div>
  );
}

function TabBar({ items, active, onChange }) {
  return (
    <div style={{display:"flex",gap:0,marginTop:14,borderTop:"1px solid rgba(0,0,0,0.07)",overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
      {items.map((item,i) => (
        <button key={i} onClick={() => onChange(i)} style={{
          fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,
          textTransform:"uppercase",color:active===i?"#111":"rgba(0,0,0,0.38)",
          padding:"14px 0",marginRight:24,background:"none",border:"none",
          borderBottom:active===i?"3px solid #111":"3px solid transparent",
          cursor:"pointer",whiteSpace:"nowrap",transition:"color .15s, border-color .15s",flexShrink:0,
        }}>{item}</button>
      ))}
    </div>
  );
}

function Card({ children, style={}, topBlue=true }) {
  return (
    <div style={{background:"#fff",border:"1px solid rgba(0,0,0,0.09)",borderTop:topBlue?"3px solid #0057FF":"1px solid rgba(0,0,0,0.09)",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",...style}}>
      {children}
    </div>
  );
}

function buildRecap(g, allTeams, scores) {
  const away = g.away, home = g.home;
  const aScore = g.aScore, hScore = g.hScore;
  const isTie = aScore === hScore;
  const winner = aScore > hScore ? away : home;
  const loser = aScore > hScore ? home : away;
  const winScore = Math.max(aScore, hScore);
  const loseScore = Math.min(aScore, hScore);
  const margin = winScore - loseScore;

  // Get team records
  const wTeam = allTeams.find(t => t.name === winner);
  const lTeam = allTeams.find(t => t.name === loser);

  // Head-to-head history
  const h2h = scores.flatMap(w => w.games).filter(x =>
    (x.away === away && x.home === home) || (x.away === home && x.home === away)
  );
  const h2hWins = (team) => h2h.filter(x =>
    (x.away === team && x.aScore > x.hScore) || (x.home === team && x.hScore > x.aScore)
  ).length;

  const parts = [];

  if (isTie) {
    parts.push(`${away} and ${home} battled to a ${aScore}–${hScore} tie.`);
  } else if (margin >= 10) {
    parts.push(`${winner} dominated ${loser} with a convincing ${winScore}–${loseScore} victory.`);
  } else if (margin <= 2) {
    parts.push(`${winner} edged out ${loser} in a close one, ${winScore}–${loseScore}.`);
  } else {
    parts.push(`${winner} defeated ${loser} ${winScore}–${loseScore}.`);
  }

  if (g.note && g.note.toLowerCase().includes("forfeit")) {
    parts[0] = `${winner} wins by forfeit over ${loser}, ${winScore}–${loseScore}.`;
  }

  // Records
  if (wTeam && lTeam && !isTie) {
    parts.push(`${winner} moves to ${wTeam.w}-${wTeam.l}${wTeam.t ? `-${wTeam.t}` : ""} on the season, while ${loser} falls to ${lTeam.w}-${lTeam.l}${lTeam.t ? `-${lTeam.t}` : ""}.`);
  } else if (isTie && wTeam && lTeam) {
    const aTeam = allTeams.find(t => t.name === away);
    const hTeam = allTeams.find(t => t.name === home);
    if (aTeam && hTeam) parts.push(`${away} sits at ${aTeam.w}-${aTeam.l}-${(aTeam.t||0)} and ${home} at ${hTeam.w}-${hTeam.l}-${(hTeam.t||0)}.`);
  }

  // Head-to-head
  if (h2h.length > 1 && !isTie) {
    const wH2H = h2hWins(winner);
    const lH2H = h2hWins(loser);
    if (wH2H > lH2H) parts.push(`${winner} leads the season series ${wH2H}-${lH2H} against ${loser}.`);
    else if (lH2H > wH2H) parts.push(`Despite the loss, ${loser} still leads the season series ${lH2H}-${wH2H}.`);
    else parts.push(`The season series is tied ${wH2H}-${lH2H}.`);
  }

  return parts.join(" ");
}

function FinalCard({ g, onTeamClick, allTeams=[], scores=[] }) {
  const [showRecap, setShowRecap] = useState(false);
  const aWin = g.aScore > g.hScore, hWin = g.hScore > g.aScore;
  const recap = buildRecap(g, allTeams, scores);
  const getRecord = (name) => { const t = allTeams.find(x => x.name === name || x.name.startsWith(name.split(" ")[0])); return t ? `${t.w}-${t.l}` : ""; };
  return (
    <>
      {showRecap && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}} onClick={() => setShowRecap(false)}>
          <div style={{background:"#fff",borderRadius:12,maxWidth:500,width:"100%",overflow:"hidden"}} onClick={e => e.stopPropagation()}>
            <div style={{background:"#001a6e",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{minWidth:0,flex:1}}>
                <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",marginBottom:2}}>RECAP · {g.div}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:"#fff",textTransform:"uppercase",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.away} vs {g.home}</div>
              </div>
              <button onClick={() => setShowRecap(false)} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",borderRadius:6,width:28,height:28,cursor:"pointer",flexShrink:0,marginLeft:8}}>✕</button>
            </div>
            <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
              {[{name:g.away,score:g.aScore,won:aWin},{name:g.home,score:g.hScore,won:hWin}].map((side,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:i===0?8:0}}>
                  <TLogo name={side.name} size={140} />
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:side.won?900:600,fontSize:18,textTransform:"uppercase",color:side.won?"#111":"rgba(0,0,0,0.35)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{side.name}</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:side.won?900:400,fontSize:36,color:side.won?"#111":"rgba(0,0,0,0.22)",flexShrink:0}}>{side.score}</span>
                </div>
              ))}
            </div>
            <div style={{padding:"14px 16px"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#0057FF",marginBottom:6,textTransform:"uppercase"}}>📰 Game Recap</div>
              <p style={{fontSize:13,color:"rgba(0,0,0,0.65)",lineHeight:1.6}}>{recap}</p>
            </div>
          </div>
        </div>
      )}
      <div style={{background:"#fff",border:"1px solid rgba(0,0,0,0.09)",borderTop:"3px solid #0057FF",borderRadius:10,overflow:"hidden",display:"flex",flexDirection:"column",width:"100%",transition:"transform .15s,box-shadow .15s",cursor:"pointer"}}
        onMouseEnter={e => {e.currentTarget.style.transform="scale(1.03)";e.currentTarget.style.boxShadow="0 8px 30px rgba(0,87,255,0.15)";}}
        onMouseLeave={e => {e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none";}}>
        <div style={{padding:"10px 14px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(0,0,0,0.25)"}}>FINAL</span>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {g.note && <span style={{fontSize:12,fontWeight:700,color:"#dc2626",textTransform:"uppercase"}}>{g.note}</span>}
            <span style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.2)",textTransform:"uppercase"}}>{g.div}</span>
          </div>
        </div>
        <div style={{padding:"6px 14px 8px"}}>
          {[{name:g.away,score:g.aScore,won:aWin},{name:g.home,score:g.hScore,won:hWin}].map((side,i) => (
            <div key={i} onClick={() => onTeamClick?.(side.name)} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i===0?2:0,cursor:onTeamClick?"pointer":"default",width:"100%"}}>
              <TLogo name={side.name} size={60} />
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:side.won?900:600,fontSize:22,textTransform:"uppercase",color:side.won?"#111":"rgba(0,0,0,0.28)",lineHeight:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,minWidth:0}}>
                {side.name} <span style={{fontSize:12,fontWeight:600,color:"rgba(0,0,0,0.25)"}}>{getRecord(side.name)}</span>
              </div>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:side.won?900:400,fontSize:40,lineHeight:1,color:side.won?"#111":"rgba(0,0,0,0.22)",flexShrink:0,minWidth:36,textAlign:"right"}}>{side.score}</span>
            </div>
          ))}
        </div>
        <div style={{height:1,background:"rgba(0,0,0,0.05)"}} />
        <div onClick={() => setShowRecap(true)} style={{padding:"12px",background:"#0057FF",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16,letterSpacing:".06em",textTransform:"uppercase",color:"#fff",textAlign:"center",cursor:"pointer"}}>📰 RECAP</div>
      </div>
    </>
  );
}

function UpcomingCard({ away, home, time, date, field, isNext, onTeamClick, allTeams, logoSize=170 }) {
  const getRecord = (name) => { const t = (allTeams||[]).find(x => x.name === name || x.full === name || x.name.startsWith(name.split(" ")[0])); return t ? `(${t.w}-${t.l})` : ""; };
  return (
    <div style={{background:"#fff",border:"1px solid rgba(0,0,0,0.09)",borderTop:"3px solid #0057FF",borderLeft:isNext?"4px solid #0057FF":"1px solid rgba(0,0,0,0.09)",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.04)",maxWidth:700}}>
      {isNext && <div style={{padding:"6px 14px 0",fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#0057FF"}}>▶ NEXT GAME</div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center",padding:"0 10px",gap:8}}>
        <div>
          {[away,home].map((t,i) => (
            <div key={i} onClick={() => onTeamClick?.(t)} style={{display:"flex",alignItems:"center",gap:10,cursor:onTeamClick?"pointer":"default",height:80}}>
              <TLogo name={t} size={logoSize} />
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111",lineHeight:1}}>{t} <span style={{fontSize:13,fontWeight:600,color:"rgba(0,0,0,0.3)"}}>{getRecord(t)}</span></span>
            </div>
          ))}
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:28,color:"#0057FF",lineHeight:1}}>{time}</div>
          <div style={{fontSize:13,color:"rgba(0,0,0,0.4)",marginTop:3}}>{date}</div>
          <div style={{fontSize:13,color:"rgba(0,0,0,0.3)"}}>{field}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── TICKER ─────────────────────────────────────────────────────────────── */
function Ticker({ setTab, sched, allTeams, scores }) {
  const [previewGame, setPreviewGame] = useState(null);
  const fields = sched[0]?.fields || [];
  const games = fields.flatMap(f => f.games.map(g => ({...g, field:f.name})));
  const dateStr = sched[0]?.label?.split("–")[1]?.trim() || "";

  const getTeam = (name) => (allTeams||[]).find(t => t.name === name || t.name.toLowerCase().startsWith(name.toLowerCase().substring(0,5))) || {};
  const getH2H = (a, b) => {
    let aWins = 0, bWins = 0;
    (scores||[]).forEach(wk => (wk.games||[]).forEach(g => {
      if ((g.away===a && g.home===b) || (g.away===b && g.home===a)) {
        const aScore = g.away===a ? g.aScore : g.hScore;
        const bScore = g.away===a ? g.hScore : g.aScore;
        if (aScore > bScore) aWins++; else if (bScore > aScore) bWins++;
      }
    }));
    return { aWins, bWins };
  };
  const getStreak = (name) => {
    const results = [];
    (scores||[]).forEach(wk => (wk.games||[]).forEach(g => {
      if (g.away===name || g.home===name) {
        const myScore = g.away===name ? g.aScore : g.hScore;
        const oppScore = g.away===name ? g.hScore : g.aScore;
        results.push(myScore > oppScore ? "W" : "L");
      }
    }));
    if (results.length === 0) return "—";
    const last = results[results.length-1];
    let count = 0;
    for (let i = results.length-1; i >= 0; i--) { if (results[i] === last) count++; else break; }
    return `${last}${count}`;
  };

  return (
    <>
    {previewGame && (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={() => setPreviewGame(null)}>
        <div style={{background:"#fff",borderRadius:16,maxWidth:500,width:"100%",overflow:"hidden"}} onClick={e => e.stopPropagation()}>
          <div style={{background:"#001a6e",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:"#FFD700",textTransform:"uppercase",letterSpacing:".06em"}}>Game Preview</span>
            <button onClick={() => setPreviewGame(null)} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:16}}>✕</button>
          </div>
          <div style={{padding:"20px",textAlign:"center"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:24,marginBottom:16}}>
              <div style={{textAlign:"center"}}>
                <TLogo name={previewGame.away} size={80} />
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,textTransform:"uppercase",color:"#111",marginTop:4}}>{previewGame.away}</div>
                <div style={{fontSize:13,color:"rgba(0,0,0,0.4)"}}>{getTeam(previewGame.away).w||0}-{getTeam(previewGame.away).l||0} · {getTeam(previewGame.away).divName||""}</div>
                <div style={{fontSize:12,color:"rgba(0,0,0,0.35)",marginTop:2}}>Streak: {getStreak(previewGame.away)}</div>
              </div>
              <div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,color:"#0057FF"}}>{previewGame.time}</div>
                <div style={{fontSize:13,color:"rgba(0,0,0,0.4)",marginTop:2}}>{dateStr}</div>
                <div style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.25)",marginTop:4,textTransform:"uppercase"}}>Upcoming</div>
              </div>
              <div style={{textAlign:"center"}}>
                <TLogo name={previewGame.home} size={80} />
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,textTransform:"uppercase",color:"#111",marginTop:4}}>{previewGame.home}</div>
                <div style={{fontSize:13,color:"rgba(0,0,0,0.4)"}}>{getTeam(previewGame.home).w||0}-{getTeam(previewGame.home).l||0} · {getTeam(previewGame.home).divName||""}</div>
                <div style={{fontSize:12,color:"rgba(0,0,0,0.35)",marginTop:2}}>Streak: {getStreak(previewGame.home)}</div>
              </div>
            </div>
            {(() => { const h2h = getH2H(previewGame.away, previewGame.home); return h2h.aWins + h2h.bWins > 0 ? (
              <div style={{background:"#f8f9fb",borderRadius:10,padding:"12px 16px",marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Head-to-Head This Season</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#111"}}>{previewGame.away} {h2h.aWins} — {h2h.bWins} {previewGame.home}</div>
              </div>
            ) : null; })()}
            <div style={{fontSize:14,color:"rgba(0,0,0,0.4)"}}>📍 {previewGame.field}</div>
          </div>
        </div>
      </div>
    )}
    <div style={{background:"#001a6e",borderBottom:"2px solid #0057FF",display:"flex",alignItems:"stretch",overflow:"hidden",width:"100%",position:"relative"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"0 12px",borderRight:"1px solid rgba(255,255,255,0.15)",flexShrink:0}}>
        <img src={L_LEAGUE} alt="LASSL" style={{height:28,width:28,objectFit:"cover",borderRadius:"50%"}} />
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,letterSpacing:".1em",textTransform:"uppercase",color:"#FFD700"}}>LASSL</span>
      </div>
      <div style={{display:"flex",alignItems:"stretch",overflowX:"auto",overflowY:"hidden",scrollbarWidth:"none",msOverflowStyle:"none",flex:"1 1 0",minWidth:0,WebkitOverflowScrolling:"touch"}}>
        {games.map((g,i) => (
          <div key={i} onClick={() => setPreviewGame(g)} style={{display:"flex",flexDirection:"column",justifyContent:"center",padding:"5px 12px",borderRight:"1px solid rgba(255,255,255,0.1)",flexShrink:0,gap:2,cursor:"pointer",transition:"transform .15s,background .15s"}}
            onMouseEnter={e => {e.currentTarget.style.transform="scale(1.08)";e.currentTarget.style.background="rgba(255,255,255,0.08)";}}
            onMouseLeave={e => {e.currentTarget.style.transform="scale(1)";e.currentTarget.style.background="transparent";}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:".08em",color:"#ff6b6b",textTransform:"uppercase",whiteSpace:"nowrap"}}>{g.time}</div>
            {[g.away,g.home].map((t,j) => (
              <div key={j} style={{display:"flex",alignItems:"center",gap:5}}>
                <TLogo name={t} size={16} />
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,color:"#fff",letterSpacing:".02em",whiteSpace:"nowrap"}}>{t}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",padding:"0 12px",flexShrink:0,borderLeft:"1px solid rgba(255,255,255,0.1)",cursor:"pointer"}} onClick={() => setTab("schedule")}>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#FFD700",whiteSpace:"nowrap"}}>Schedule »</span>
      </div>
    </div>
    </>
  );
}

/* ─── NAVBAR ─────────────────────────────────────────────────────────────── */
function Navbar({ tab, setTab }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const links = [["home","Home"],["scores","Scores"],["schedule","Schedule"],["standings","Standings"],["teams","Teams"],["signup","Sign Up"]];
  const redLinks = [["captain","Captain"],["admin","Admin"]];
  const moreLinks = [["gallery","Gallery"],["subs","Sub Board"],["umpires","Umpires"],["registration","Registration"],["rules","Rules"],["waiver","Waiver Form"],["board","Board"]];
  const handleNav = (id) => { setTab(id); setMenuOpen(false); setMoreOpen(false); window.scrollTo(0,0); };
  return (
    <>
      <nav style={{background:"#fff",borderBottom:"3px solid #0057FF",boxShadow:"0 1px 6px rgba(0,0,0,0.07)",height:62,display:"flex",alignItems:"center",padding:"0 clamp(12px,3vw,32px)",position:"relative",zIndex:400}}>
        <div style={{maxWidth:1400,margin:"0 auto",width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          {/* Desktop links */}
          <ul style={{display:"flex",gap:0,listStyle:"none",margin:"0 auto",padding:0,flexShrink:1,minWidth:0}} className="desktop-nav">
            {links.map(([id,label]) => (
              <li key={id}>
                <button onClick={() => handleNav(id)} style={{
                  fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,
                  letterSpacing:".06em",textTransform:"uppercase",
                  color:tab===id?"#0057FF":"#555",background:"none",border:"none",
                  cursor:"pointer",padding:"7px 12px",borderRadius:6,
                  borderBottom:tab===id?"2px solid #0057FF":"2px solid transparent",
                  transition:"all .15s",whiteSpace:"nowrap",
                }}
                onMouseEnter={e => {e.currentTarget.style.color="#0057FF";e.currentTarget.style.borderBottom="2px solid #0057FF";}}
                onMouseLeave={e => {e.currentTarget.style.color=tab===id?"#0057FF":"#555";e.currentTarget.style.borderBottom=tab===id?"2px solid #0057FF":"2px solid transparent";}}
                >{label}</button>
              </li>
            ))}
            <li style={{position:"relative"}}>
              <button onClick={() => setMoreOpen(!moreOpen)} style={{
                fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,
                letterSpacing:".06em",textTransform:"uppercase",
                color:moreOpen||moreLinks.some(([id])=>tab===id)?"#0057FF":"#555",
                background:"none",border:"none",cursor:"pointer",padding:"7px 12px",borderRadius:6,
                borderBottom:moreLinks.some(([id])=>tab===id)?"2px solid #0057FF":"2px solid transparent",
                transition:"color .15s",whiteSpace:"nowrap",
              }}>More ▾</button>
              {moreOpen && (
                <div style={{position:"absolute",top:"100%",right:0,background:"#fff",border:"1px solid rgba(0,0,0,0.1)",borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,0.12)",minWidth:150,zIndex:500,overflow:"hidden",marginTop:4}}>
                  {moreLinks.map(([id,label]) => (
                    <button key={id} onClick={() => handleNav(id)} style={{
                      display:"block",width:"100%",textAlign:"left",padding:"10px 16px",
                      fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,
                      letterSpacing:".04em",textTransform:"uppercase",
                      color:tab===id?"#0057FF":"#333",background:tab===id?"rgba(0,87,255,0.05)":"transparent",
                      border:"none",borderBottom:"1px solid rgba(0,0,0,0.05)",cursor:"pointer",
                    }}>{label}</button>
                  ))}
                </div>
              )}
            </li>
            {redLinks.map(([id,label]) => (
              <li key={id}>
                <button onClick={() => handleNav(id)} style={{
                  fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,
                  letterSpacing:".06em",textTransform:"uppercase",
                  color:tab===id?"#dc2626":"rgba(0,0,0,0.3)",background:"none",border:"none",
                  cursor:"pointer",padding:"7px 8px",borderRadius:6,
                  borderBottom:tab===id?"2px solid #dc2626":"2px solid transparent",
                  transition:"color .15s",whiteSpace:"nowrap",
                }}>{label}</button>
              </li>
            ))}
          </ul>
          {/* Hamburger button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" style={{
            display:"none",background:"none",border:"none",cursor:"pointer",
            padding:"8px",flexDirection:"column",gap:5,alignItems:"center",justifyContent:"center",
          }}>
            <span style={{display:"block",width:24,height:2,background:menuOpen?"#0057FF":"#111",borderRadius:2,transition:"all .2s",transform:menuOpen?"rotate(45deg) translate(5px,5px)":"none"}} />
            <span style={{display:"block",width:24,height:2,background:"#111",borderRadius:2,transition:"all .2s",opacity:menuOpen?0:1}} />
            <span style={{display:"block",width:24,height:2,background:menuOpen?"#0057FF":"#111",borderRadius:2,transition:"all .2s",transform:menuOpen?"rotate(-45deg) translate(5px,-5px)":"none"}} />
          </button>
        </div>
      </nav>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{position:"fixed",top:62,left:0,right:0,bottom:0,zIndex:9999,display:"flex",flexDirection:"column"}}>
          <div style={{background:"#fff",borderBottom:"3px solid #0057FF",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>
          <button onClick={() => handleNav("home")} style={{
            display:"flex",alignItems:"center",gap:12,width:"100%",textAlign:"left",
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,
            letterSpacing:".06em",textTransform:"uppercase",
            color:"#0057FF",background:"rgba(0,87,255,0.06)",
            border:"none",borderBottom:"2px solid #0057FF",
            cursor:"pointer",padding:"18px 20px",
          }}>🏠 Home</button>
          {links.filter(([id])=>id!=="home").map(([id,label]) => (
            <button key={id} onClick={() => handleNav(id)} style={{
              display:"block",width:"100%",textAlign:"left",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:22,
              letterSpacing:".06em",textTransform:"uppercase",
              color:tab===id?"#0057FF":"#111",background:tab===id?"rgba(0,87,255,0.04)":"none",
              border:"none",borderBottom:"1px solid rgba(0,0,0,0.06)",
              cursor:"pointer",padding:"18px 20px",
            }}>{label}</button>
          ))}
          <button onClick={() => setMoreOpen(!moreOpen)} style={{
            display:"block",width:"100%",textAlign:"left",
            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:22,
            letterSpacing:".06em",textTransform:"uppercase",
            color:"#111",background:"none",
            border:"none",borderBottom:"1px solid rgba(0,0,0,0.06)",
            cursor:"pointer",padding:"18px 20px",
          }}>More {moreOpen?"▲":"▼"}</button>
          {moreOpen && moreLinks.map(([id,label]) => (
            <button key={id} onClick={() => handleNav(id)} style={{
              display:"block",width:"100%",textAlign:"left",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:20,
              letterSpacing:".06em",textTransform:"uppercase",
              color:tab===id?"#0057FF":"rgba(0,0,0,0.5)",background:tab===id?"rgba(0,87,255,0.04)":"rgba(0,0,0,0.02)",
              border:"none",borderBottom:"1px solid rgba(0,0,0,0.06)",
              cursor:"pointer",padding:"14px 20px 14px 36px",
            }}>{label}</button>
          ))}
          {redLinks.map(([id,label]) => (
            <button key={id} onClick={() => handleNav(id)} style={{
              display:"block",width:"100%",textAlign:"left",
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:20,
              letterSpacing:".06em",textTransform:"uppercase",
              color:"#dc2626",background:"none",
              border:"none",borderBottom:"1px solid rgba(0,0,0,0.06)",
              cursor:"pointer",padding:"14px 20px",
            }}>{label}</button>
          ))}
          </div>
          <div style={{flex:1,background:"rgba(0,0,0,0.3)"}} onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </>
  );
}

/* ─── HOME PAGE ──────────────────────────────────────────────────────────── */
function HomePage({ setTab, setTeamDetail, allTeams, scores, sched, div }) {
  const [sidebarDiv, setSidebarDiv] = useState("A");
  const topTeams = [...allTeams].sort((a,b) => parseFloat(b.pct) - parseFloat(a.pct)).slice(0,8);
  const fields = sched[0]?.fields || [];
  const nextGames = fields.flatMap(f => f.games.map(g => ({...g,field:f.name}))).slice(0,5);
  const recent = scores[0]?.games || [];
  const goTeam = (name) => { setTeamDetail(name); setTab("teams"); window.scrollTo(0,0); };
  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      {/* HERO */}
      <div style={{width:"100%",background:"linear-gradient(135deg, #001129 0%, #001a6e 40%, #002D72 100%)",borderBottom:"4px solid #FFD700",position:"relative",overflow:"hidden"}}>
        {/* Animated background elements */}
        <div style={{position:"absolute",top:-80,right:-80,width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,87,255,0.25) 0%,transparent 70%)",pointerEvents:"none",animation:"rotate 25s linear infinite"}} />
        <div style={{position:"absolute",bottom:-60,left:-40,width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,215,0,0.1) 0%,transparent 70%)",pointerEvents:"none",animation:"rotate 35s linear infinite reverse"}} />

        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"32px 20px 24px",position:"relative"}}>
          <img src="/header.png" alt="Synagogue Softball" style={{width:"min(480px,75vw)",objectFit:"contain",filter:"drop-shadow(0 4px 30px rgba(0,87,255,0.3))"}} />
          <div style={{display:"flex",alignItems:"center",gap:16,marginTop:12}}>
            <div style={{height:1,width:60,background:"linear-gradient(90deg,transparent,rgba(255,215,0,0.5))"}} />
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"rgba(255,255,255,0.4)",letterSpacing:".2em",textTransform:"uppercase"}}>Est. 5755 · Celebrating 30 Years</span>
            <div style={{height:1,width:60,background:"linear-gradient(90deg,rgba(255,215,0,0.5),transparent)"}} />
          </div>
        </div>
      </div>

      <div style={{maxWidth:1400,margin:"0 auto",padding:"28px clamp(12px,3vw,40px) 60px"}}>
        <div className="home-two-col" style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:32,alignItems:"start"}}>
          <div>
            <div style={{marginBottom:32}}>
              <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{fontSize:14,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0057FF",marginBottom:4}}>2026 Season</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:40,textTransform:"uppercase",color:"#111",lineHeight:1}}>Recent Results</h2>
                </div>
                <span onClick={() => setTab("scores")} style={{color:"#0057FF",fontWeight:700,fontSize:16,cursor:"pointer",textDecoration:"none"}}>All Scores →</span>
              </div>
              <div className="scores-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10,gridAutoRows:"1fr"}}>
                {recent.slice(0,6).map((g,i) => <FinalCard key={i} g={g} onTeamClick={goTeam} allTeams={allTeams} scores={scores} />)}
              </div>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{fontSize:14,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0057FF",marginBottom:4}}>On Deck</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:40,textTransform:"uppercase",color:"#111",lineHeight:1}}>Upcoming</h2>
                </div>
                <span onClick={() => setTab("schedule")} style={{color:"#0057FF",fontWeight:700,fontSize:16,cursor:"pointer"}}>Full Schedule →</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {nextGames.map((g,i) => <UpcomingCard key={i} away={g.away} home={g.home} time={g.time} date={sched[0]?.label?.split("–")[1]?.trim()||""} onTeamClick={goTeam} field={g.field} isNext={i===0} allTeams={allTeams} logoSize={85} />)}
              </div>
            </div>
          </div>

          {/* Standings sidebar - hidden on mobile */}
          <div style={{position:"sticky",top:72}} className="sidebar-standings">
            <Card style={{boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,textTransform:"uppercase",color:"#111"}}>Standings</span>
                <span onClick={() => setTab("standings")} style={{color:"#0057FF",fontSize:12,fontWeight:700,cursor:"pointer"}}>Full →</span>
              </div>
              <div style={{display:"flex",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
                {Object.keys(div).map(d => (
                  <button key={d} onClick={() => setSidebarDiv(d)} style={{
                    flex:1,padding:"8px 0",border:"none",background:sidebarDiv===d?"rgba(0,87,255,0.08)":"transparent",
                    fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,color:sidebarDiv===d?"#0057FF":"rgba(0,0,0,0.3)",
                    cursor:"pointer",borderBottom:sidebarDiv===d?"2px solid #0057FF":"2px solid transparent",textTransform:"uppercase",
                  }}>{d}</button>
                ))}
              </div>
              {(div[sidebarDiv]?.teams || []).map((t,i) => (
                <div key={t.name} onClick={() => { setTeamDetail(t.name); setTab("teams"); }} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",borderBottom:"1px solid rgba(0,0,0,0.04)",cursor:"pointer",transition:"background .15s"}}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(0,87,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,color:i===0?"#0057FF":"rgba(0,0,0,0.2)",width:18,flexShrink:0,textAlign:"center"}}>{t.seed}</span>
                  <TLogo name={t.name} size={36} />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:15,color:"#111",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase"}}>{t.name}</div>
                  </div>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:"#111",flexShrink:0}}>{t.w}-{t.l}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SCORES PAGE ─────────────────────────────────────────────────────────  */
function ScoresPage({ setTab, setTeamDetail, scores, allTeams, sched }) {
  const upcomingWeeks = (sched||[]).map(s => ({ week: s.label, games: [], upcoming: true }));
  const allWeeks = [...scores, ...upcomingWeeks];
  const [wk,setWk] = useState(0);
  const goTeam = (name) => { setTeamDetail(name); setTab("teams"); window.scrollTo(0,0); };
  const current = allWeeks[wk];
  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      <PageHero label="2026 Season" title="Scores">
        <TabBar items={allWeeks.map(s=>s.week)} active={wk} onChange={setWk} />
      </PageHero>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"24px clamp(12px,3vw,40px) 60px"}}>
        {current?.upcoming ? (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:48,marginBottom:12}}>⏳</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:24,textTransform:"uppercase",color:"rgba(0,0,0,0.2)"}}>No Scores Posted Yet</div>
            <div style={{fontSize:14,color:"rgba(0,0,0,0.35)",marginTop:8}}>Check back after games are played</div>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(300px,100%),1fr))",gap:12}}>
            {(current?.games || []).map((g,i) => <FinalCard key={i} g={g} onTeamClick={goTeam} allTeams={allTeams} scores={scores} />)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── SCHEDULE PAGE ───────────────────────────────────────────────────────── */
/* ─── PLAYOFF BRACKET ────────────────────────────────────────────────────── */
function PlayoffBracket({ allTeams, divData }) {

  const font = "'Barlow Condensed',sans-serif";

  /* ── Team Slot ── */
  const TeamSlot = ({ team, seed, small }) => {
    const h = small ? 30 : 38;
    const logo = small ? 24 : 32;
    const nameSize = small ? 12 : 15;
    const recSize = small ? 10 : 12;
    const seedSize = small ? 10 : 12;
    return (
    <div style={{
      display:"flex",alignItems:"center",gap:6,height:h,
      background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",
      borderRadius:6,padding:small?"4px 8px":"6px 12px",boxSizing:"border-box",minWidth:0,
    }}>
      {seed != null && (
        <span style={{fontFamily:font,fontWeight:900,fontSize:seedSize,color:"#FFD700",width:14,textAlign:"center",flexShrink:0}}>
          {seed}
        </span>
      )}
      {team ? <TLogo name={team.name} size={logo} /> : <div style={{width:logo,height:logo,borderRadius:4,background:"rgba(255,255,255,0.06)",flexShrink:0}} />}
      <span style={{fontFamily:font,fontWeight:800,fontSize:nameSize,color:team?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.25)",textTransform:"uppercase",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1,minWidth:0}}>
        {team?.name || "TBD"}
      </span>
      {team && <span style={{fontSize:recSize,color:"rgba(255,255,255,0.4)",flexShrink:0}}>{team.w}-{team.l}</span>}
    </div>
    );
  };

  /* ── Matchup: two team slots stacked with label ── */
  const Matchup = ({ label, team1, seed1, team2, seed2, small }) => (
    <div style={{display:"flex",flexDirection:"column",gap:2}}>
      <div style={{fontFamily:font,fontSize:small?9:11,fontWeight:700,color:"rgba(255,215,0,0.7)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:2,textAlign:"center"}}>
        {label}
      </div>
      <TeamSlot team={team1} seed={seed1} small={small} />
      <TeamSlot team={team2} seed={seed2} small={small} />
    </div>
  );

  /* ── Horizontal connector line ── */
  const HLine = ({ small }) => (
    <div style={{width:small?14:24,height:2,background:"linear-gradient(90deg,rgba(255,215,0,0.3),rgba(255,215,0,0.1))",flexShrink:0,alignSelf:"center",borderRadius:1}} />
  );

  /* ── Champion badge ── */
  const WinnerBadge = () => (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}>
      <div style={{fontSize:18,lineHeight:1}}>🥇</div>
      <div style={{fontFamily:font,fontWeight:900,fontSize:10,color:"#FFD700",textTransform:"uppercase",letterSpacing:".06em"}}>Winner</div>
    </div>
  );

  /* ── 4-Team Horizontal Bracket (A, B, C, E) ── */
  const FourTeamBracket = ({ teams }) => {
    const t = teams || [];
    return (
      <div style={{display:"flex",alignItems:"center",gap:0}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Matchup label="Semi 1" team1={t[0]} seed1={1} team2={t[3]} seed2={4} />
          <Matchup label="Semi 2" team1={t[1]} seed1={2} team2={t[2]} seed2={3} />
        </div>
        <HLine />
        <Matchup label="Final" team1={null} seed1={null} team2={null} seed2={null} />
        <HLine />
        <WinnerBadge />
      </div>
    );
  };

  /* ── 6-Team Horizontal Bracket (Division D) ── */
  const SixTeamBracket = ({ teams }) => {
    const t = teams || [];
    return (
      <div style={{display:"flex",alignItems:"center",gap:0}}>
        {/* Round 1: QFs + Seeding */}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <Matchup label="QF 1" team1={t[2]} seed1={3} team2={t[5]} seed2={6} />
          <Matchup label="QF 2" team1={t[3]} seed1={4} team2={t[4]} seed2={5} />
          <Matchup label="Seeding" team1={t[0]} seed1={1} team2={t[1]} seed2={2} />
        </div>
        <HLine />
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Matchup label="Semi 1" team1={null} seed1={null} team2={null} seed2={null} />
          <Matchup label="Semi 2" team1={null} seed1={null} team2={null} seed2={null} />
        </div>
        <HLine />
        <Matchup label="Final" team1={null} seed1={null} team2={null} seed2={null} />
        <HLine />
        <WinnerBadge />
      </div>
    );
  };

  /* ── Division Card ── */
  const DivisionCard = ({ divKey, data }) => {
    const teamCount = data?.teams?.length || 0;
    const accent = data?.accent || "#FFD700";
    const isSix = divKey === "D" && teamCount >= 6;
    return (
      <div style={{
        background:"rgba(255,255,255,0.04)",border:"none",
        borderRadius:12,padding:"10px 14px 14px",position:"relative",overflow:"hidden",
      }}>
        {/* Accent bar */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:accent,borderRadius:"12px 12px 0 0"}} />
        {/* Division header */}
        <div style={{marginBottom:8,marginTop:2}}>
          <div style={{fontFamily:font,fontWeight:800,fontSize:16,color:accent,textTransform:"uppercase",letterSpacing:".08em"}}>
            {data?.name || `Division ${divKey}`}
          </div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.2)",marginTop:1}}>{teamCount} teams</div>
        </div>
        {/* Bracket */}
        <div style={{overflowX:"hidden"}}>
          {isSix ? <SixTeamBracket teams={data?.teams} /> : <FourTeamBracket teams={data?.teams} />}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background:"#0a0a1a",
      borderRadius:20,padding:"clamp(16px,4vw,40px)",position:"relative",overflow:"hidden",
    }}>

      {/* Title */}
      <div style={{textAlign:"center",marginBottom:24,position:"relative"}}>
        <h2 style={{
          fontFamily:font,fontWeight:900,
          fontSize:36,textTransform:"uppercase",
          lineHeight:1,letterSpacing:".08em",margin:0,
          background:"linear-gradient(90deg,#FFD700,#fff,#FFD700)",
          backgroundSize:"200% auto",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          animation:"shimmer 3s linear infinite",
        }}>2026 Postseason</h2>
        <div style={{
          width:320,height:3,margin:"8px auto 0",borderRadius:1,
          background:"linear-gradient(90deg,transparent,#FFD700,transparent)",
          animation:"shimmer 2s linear infinite",backgroundSize:"200% auto",
        }} />
      </div>

      {/* Grid: Top row = A, B, C | Bottom row = D (wider), E */}
      <div style={{position:"relative"}}>
        {/* Top row: 3 columns */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:14,marginBottom:14}}>
          {["A","B","C"].filter(k => divData?.[k]).map(k => (
            <DivisionCard key={k} divKey={k} data={divData[k]} />
          ))}
        </div>
        {/* Bottom row: D wider, E */}
        <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:14}}>
          {["D","E"].filter(k => divData?.[k]).map(k => (
            <DivisionCard key={k} divKey={k} data={divData[k]} />
          ))}
        </div>
      </div>

      {/* League Championship Bracket */}
      <div style={{marginTop:24,background:"linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,215,0,0.02))",border:"2px solid rgba(255,215,0,0.2)",borderRadius:16,padding:"20px clamp(12px,2vw,24px)"}}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:32,marginBottom:4}}>🏆</div>
          <div style={{fontFamily:font,fontWeight:900,fontSize:24,color:"#FFD700",textTransform:"uppercase",letterSpacing:".08em"}}>League Championship</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:4}}>5 Division Winners compete for the title</div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0,flexWrap:"wrap"}}>
          {/* Round 1: 4 teams play, 1 gets bye */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Matchup label="Round 1" team1={null} seed1={"A"} team2={null} seed2={"D"} />
            <Matchup label="Round 1" team1={null} seed1={"B"} team2={null} seed2={"E"} />
            <div style={{textAlign:"center",padding:"6px 10px",background:"rgba(255,215,0,0.1)",borderRadius:6,border:"1px solid rgba(255,215,0,0.15)"}}>
              <div style={{fontSize:9,fontWeight:700,color:"rgba(255,215,0,0.5)",textTransform:"uppercase",letterSpacing:".08em"}}>Bye</div>
              <div style={{fontFamily:font,fontWeight:800,fontSize:13,color:"rgba(255,255,255,0.6)",marginTop:2}}>Div C Winner</div>
            </div>
          </div>
          <HLine />
          {/* Semis */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Matchup label="Semi 1" team1={null} seed1={null} team2={null} seed2={null} />
            <Matchup label="Semi 2" team1={null} seed1={null} team2={null} seed2={null} />
          </div>
          <HLine />
          {/* Final */}
          <Matchup label="Championship" team1={null} seed1={null} team2={null} seed2={null} />
          <HLine />
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{fontSize:36,filter:"drop-shadow(0 0 12px rgba(255,215,0,0.6))"}}>🏆</div>
            <div style={{fontFamily:font,fontWeight:900,fontSize:14,color:"#FFD700",textTransform:"uppercase",letterSpacing:".1em"}}>Champion</div>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"rgba(255,255,255,0.2)"}}>Seeding and bye determined by regular season record · Format may be adjusted by the Board</div>
      </div>

      {/* Footer */}
      <div style={{textAlign:"center",marginTop:20,fontSize:11,color:"rgba(255,255,255,0.15)",position:"relative"}}>
        All teams qualify &middot; Single elimination &middot; 7 innings minimum &middot; Division winners advance to League Championship
      </div>
    </div>
  );
}

function SchedulePage({ setTab, setTeamDetail, sched, allTeams, scores, divData }) {
  const allTabs = [...sched.map(s=>s.label), "Playoffs"];
  const [wk,setWk] = useState(0);
  const [previewGame, setPreviewGame] = useState(null);
  const isPlayoffs = wk === sched.length;
  const week = !isPlayoffs ? (sched[wk] || { label: "", fields: [] }) : null;
  const games = !isPlayoffs ? (week.fields || []).flatMap(f => f.games.map(g => ({...g,field:f.name}))) : [];
  const dateStr = !isPlayoffs ? (week.label.split("–")[1]?.trim()||"") : "";
  const goTeam = (name) => { setTeamDetail(name); setTab("teams"); window.scrollTo(0,0); };

  const getTeam = (name) => (allTeams||[]).find(t => t.name === name || t.name.toLowerCase().startsWith(name.toLowerCase().substring(0,5))) || {};
  const getStreak = (name) => {
    const results = [];
    (scores||[]).forEach(wk => (wk.games||[]).forEach(g => {
      if (g.away===name || g.home===name) {
        const myScore = g.away===name ? g.aScore : g.hScore;
        const oppScore = g.away===name ? g.hScore : g.aScore;
        results.push(myScore > oppScore ? "W" : "L");
      }
    }));
    if (results.length === 0) return "—";
    const last = results[results.length-1];
    let count = 0;
    for (let i = results.length-1; i >= 0; i--) { if (results[i] === last) count++; else break; }
    return `${last}${count}`;
  };
  const getH2H = (a, b) => {
    let aWins = 0, bWins = 0;
    (scores||[]).forEach(wk => (wk.games||[]).forEach(g => {
      if ((g.away===a && g.home===b) || (g.away===b && g.home===a)) {
        const aScore = g.away===a ? g.aScore : g.hScore;
        const bScore = g.away===a ? g.hScore : g.aScore;
        if (aScore > bScore) aWins++; else if (bScore > aScore) bWins++;
      }
    }));
    return { aWins, bWins };
  };

  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      {previewGame && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={() => setPreviewGame(null)}>
          <div style={{background:"#fff",borderRadius:16,maxWidth:500,width:"100%",overflow:"hidden"}} onClick={e => e.stopPropagation()}>
            <div style={{background:"#001a6e",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:"#FFD700",textTransform:"uppercase"}}>Game Preview</span>
              <button onClick={() => setPreviewGame(null)} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:16}}>✕</button>
            </div>
            <div style={{padding:"20px",textAlign:"center"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:24,marginBottom:16}}>
                <div style={{textAlign:"center"}}>
                  <TLogo name={previewGame.away} size={80} />
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,textTransform:"uppercase",color:"#111",marginTop:4}}>{previewGame.away}</div>
                  <div style={{fontSize:13,color:"rgba(0,0,0,0.4)"}}>{getTeam(previewGame.away).w||0}-{getTeam(previewGame.away).l||0}</div>
                  <div style={{fontSize:12,color:"rgba(0,0,0,0.35)",marginTop:2}}>Streak: {getStreak(previewGame.away)}</div>
                </div>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,color:"#0057FF"}}>{previewGame.time}</div>
                  <div style={{fontSize:13,color:"rgba(0,0,0,0.4)",marginTop:2}}>{dateStr}</div>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.25)",marginTop:4,textTransform:"uppercase"}}>Upcoming</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <TLogo name={previewGame.home} size={80} />
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,textTransform:"uppercase",color:"#111",marginTop:4}}>{previewGame.home}</div>
                  <div style={{fontSize:13,color:"rgba(0,0,0,0.4)"}}>{getTeam(previewGame.home).w||0}-{getTeam(previewGame.home).l||0}</div>
                  <div style={{fontSize:12,color:"rgba(0,0,0,0.35)",marginTop:2}}>Streak: {getStreak(previewGame.home)}</div>
                </div>
              </div>
              {(() => { const h2h = getH2H(previewGame.away, previewGame.home); return h2h.aWins + h2h.bWins > 0 ? (
                <div style={{background:"#f8f9fb",borderRadius:10,padding:"12px 16px",marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Head-to-Head This Season</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#111"}}>{previewGame.away} {h2h.aWins} — {h2h.bWins} {previewGame.home}</div>
                </div>
              ) : null; })()}
              <div style={{fontSize:14,color:"rgba(0,0,0,0.4)"}}>📍 {previewGame.field}</div>
            </div>
          </div>
        </div>
      )}
      <PageHero label="2026 Season" title="Schedule" subtitle="Away team first (1B dugout) · Home team second (3B dugout)">
        <TabBar items={allTabs} active={wk} onChange={setWk} />
      </PageHero>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"24px clamp(12px,3vw,40px) 60px"}}>
        {isPlayoffs ? (
          <PlayoffBracket allTeams={allTeams} divData={divData} />
        ) : (
          <div className="schedule-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
            {games.map((g,i) => <div key={i} onClick={() => setPreviewGame(g)} style={{cursor:"pointer"}}><UpcomingCard away={g.away} home={g.home} time={g.time} date={dateStr} onTeamClick={goTeam} field={g.field} isNext={i===0} allTeams={allTeams} logoSize={85} /></div>)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── STANDINGS PAGE ──────────────────────────────────────────────────────── */
function StandingsPage({ setTab, setTeamDetail, div: divData }) {
  const [dk,setDk] = useState("A");
  const div = divData[dk];
  const goTeam = (name) => { if(setTeamDetail){ setTeamDetail(name); setTab("teams"); } };
  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      <PageHero label="2026 Season" title="Standings">
        <TabBar items={Object.keys(divData).map(d=>`Div ${d}`)} active={Object.keys(divData).indexOf(dk)} onChange={i => setDk(Object.keys(divData)[i])} />
      </PageHero>
      {/* MOBILE standings */}
      <div className="mobile-standings" style={{display:"none",padding:"16px 12px 60px"}}>
        {div.teams.map((t,i) => (
          <div key={t.name} onClick={() => goTeam(t.name)} style={{background:"#fff",borderRadius:10,marginBottom:8,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,border:"1px solid rgba(0,0,0,0.08)",borderLeft:`3px solid ${i===0?"#0057FF":div.accent}`,cursor:"pointer"}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:i===0?"#0057FF":"rgba(0,0,0,0.25)",width:24,flexShrink:0}}>{t.seed}</span>
            <TLogo name={t.name} size={50} />
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,textTransform:"uppercase",color:"#111",lineHeight:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</div>
              <div style={{fontSize:11,color:"rgba(0,0,0,0.4)",marginTop:2}}>{t.pct} PCT · {t.gp} GP</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:28,color:"#111",lineHeight:1}}>{t.w}-{t.l}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:t.diff.startsWith("+")?div.accent:t.diff==="0"?"rgba(0,0,0,0.3)":"#dc2626"}}>{t.diff}</div>
            </div>
          </div>
        ))}
      </div>
      {/* DESKTOP standings table */}
      <div className="desktop-standings" style={{maxWidth:1400,margin:"0 auto",padding:"28px clamp(12px,3vw,40px) 60px"}}>
        <div className="standings-table">
        <Card style={{boxShadow:"0 2px 8px rgba(0,0,0,0.05)",minWidth:"unset",width:"fit-content"}}>
          <div style={{display:"grid",gridTemplateColumns:"30px 250px 58px 58px 58px 72px 58px 58px 58px 68px",width:"fit-content",marginLeft:0,padding:"10px 20px",background:"#f8f9fb",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
            {["#","Team","W","L","T","PCT","GP","RS","RA","DIFF"].map((h,i) => (
              <span key={h} style={{fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(0,0,0,0.3)",textAlign:i>1?"center":"left"}}>{h}</span>
            ))}
          </div>
          {div.teams.map((t,i) => (
            <div key={t.name} onClick={() => goTeam(t.name)} style={{display:"grid",gridTemplateColumns:"30px 250px 58px 58px 58px 72px 58px 58px 58px 68px",width:"fit-content",marginLeft:0,padding:"0 20px",height:90,borderBottom:"1px solid rgba(0,0,0,0.06)",alignItems:"center",transition:"all .15s",cursor:"pointer",borderRadius:6}}
              onMouseEnter={e => {e.currentTarget.style.background="rgba(0,87,255,0.08)";e.currentTarget.style.transform="scale(1.01)";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,87,255,0.12)";}}
              onMouseLeave={e => {e.currentTarget.style.background="transparent";e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none";}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:26,color:i===0?"#0057FF":"rgba(0,0,0,0.22)"}}>{t.seed}</span>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <TLogo name={t.name} size={70} />
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:28,textTransform:"uppercase",color:"#111",lineHeight:1}}>{t.name}</div>
                </div>
              </div>
              {[t.w,t.l,t.t,t.pct,t.gp,t.rs,t.ra].map((v,vi) => (
                <span key={vi} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:vi===3?20:26,fontWeight:vi===0?900:vi===3?700:400,color:vi===0?"#111":vi===3?"#0057FF":"rgba(0,0,0,0.55)",textAlign:"center",display:"block"}}>{v}</span>
              ))}
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,textAlign:"center",display:"block",color:t.diff.startsWith("+")?div.accent:t.diff==="0"?"rgba(0,0,0,0.3)":"#dc2626"}}>{t.diff}</span>
            </div>
          ))}
        </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── TEAM DETAIL PAGE ────────────────────────────────────────────────────── */
function TeamDetailPage({ teamName, onBack, setTab, setTeamDetail, div, allTeams, scores, sched, rosters }) {
  const team = allTeams.find(t => t.name === teamName);
  const roster = rosters[teamName] || [];
  if (!team) return null;
  const color = TEAM_COLORS[teamName] || "#0057FF";
  const teamGames = scores.flatMap(w => w.games.filter(g => g.away===teamName||g.home===teamName)).slice(0,5);
  const fields = sched[0]?.fields || [];
  const upcoming = fields.flatMap(f => f.games.map(g=>({...g,field:f.name}))).filter(g=>g.away===teamName||g.home===teamName);
  const goTeam = (name) => { if(setTeamDetail){ setTeamDetail(name); setTab("teams"); window.scrollTo(0,0); } };
  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      <div style={{background:`linear-gradient(135deg, ${color}15 0%, #fff 60%)`,borderBottom:"3px solid #0057FF",padding:"12px clamp(12px,3vw,40px)"}}>
        <div style={{maxWidth:1400,margin:"0 auto"}}>
          <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(0,0,0,0.4)",fontSize:13,fontWeight:600,marginBottom:8,padding:0,display:"flex",alignItems:"center",gap:6}}>← All Teams</button>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <TLogo name={teamName} size={70} />
              <div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color,marginBottom:2}}>{team.divName}</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(28px,4vw,44px)",textTransform:"uppercase",color:"#111",lineHeight:1}}>{teamName}</h1>
                <div style={{fontSize:12,color:"rgba(0,0,0,0.45)",marginTop:2}}>#{team.seed} seed</div>
              </div>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:36,color,lineHeight:1}}>{team.w}-{team.l}</div>
              <div style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontFamily:"'Barlow Condensed',sans-serif"}}>
                <div>{team.pct} PCT</div>
                <div>{team.rs} RF · {team.ra} RA</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="team-detail-grid" style={{maxWidth:1400,margin:"0 auto",padding:"28px clamp(12px,3vw,40px) 60px",display:"grid",gridTemplateColumns:"1fr 300px",gap:28,alignItems:"start"}}>
        <div>
          {/* Roster */}
          <div style={{marginBottom:28}}>
            <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:26,textTransform:"uppercase",color:"#111",marginBottom:14}}>Roster</h2>
            {roster.length > 0 ? (
              <Card>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))"}}>
                  {roster.map((player,i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:"1px solid rgba(0,0,0,0.04)",borderRight:"1px solid rgba(0,0,0,0.04)"}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:`${color}18`,border:`2px solid ${color}50`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:10,color}}>{i+1}</span>
                      </div>
                      <span style={{fontSize:14,fontWeight:500,color:"#111"}}>{player}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <div style={{fontSize:15,color:"rgba(0,0,0,0.35)",fontStyle:"italic"}}>No rosters entered</div>
            )}
          </div>

          {/* Recent results */}
          {teamGames.length > 0 && (
            <div>
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:26,textTransform:"uppercase",color:"#111",marginBottom:14}}>Recent Results</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
                {teamGames.map((g,i) => <FinalCard key={i} g={g} onTeamClick={goTeam} allTeams={allTeams} scores={scores} />)}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{display:"flex",flexDirection:"column",gap:16,position:"sticky",top:72}}>
          <Card>
            <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111"}}>Upcoming Games</span>
            </div>
            {upcoming.length===0 ? (
              <div style={{padding:"16px",fontSize:13,color:"rgba(0,0,0,0.4)"}}>No upcoming games scheduled.</div>
            ) : upcoming.map((g,i) => {
              const isHome = g.home===teamName;
              const opp = isHome ? g.away : g.home;
              return (
                <div key={i} style={{padding:"12px 16px",borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <TLogo name={opp} size={35} />
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111"}}>{isHome?"vs":"@"} {opp}</span>
                  </div>
                  <div style={{fontSize:12,color:"rgba(0,0,0,0.4)"}}>{g.time} · {g.field}</div>
                </div>
              );
            })}
          </Card>

          {/* Division standing */}
          <Card>
            <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111"}}>{team.divName}</span>
            </div>
            {(div[team.divKey]?.teams || []).map((t,i) => (
              <div key={t.name} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:"1px solid rgba(0,0,0,0.04)",background:t.name===teamName?"rgba(0,87,255,0.04)":"transparent"}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,color:i===0?"#0057FF":"rgba(0,0,0,0.25)",width:20,textAlign:"center"}}>{t.seed}</span>
                <TLogo name={t.name} size={45} />
                <span style={{flex:1,fontSize:13,fontWeight:t.name===teamName?700:500,color:t.name===teamName?color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:"#111",flexShrink:0}}>{t.w}-{t.l}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── TEAMS PAGE ─────────────────────────────────────────────────────────── */
function TeamsPage({ setTab, setTeamDetail, div: divData, allTeams }) {
  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      <div style={{background:"#fff",borderBottom:"3px solid #0057FF",padding:"28px clamp(12px,3vw,40px) 24px"}}>
        <div style={{maxWidth:1400,margin:"0 auto"}}>
          <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(40px,7vw,70px)",textTransform:"uppercase",color:"#0057FF",lineHeight:1}}>Teams</h1>
        </div>
      </div>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"28px clamp(12px,3vw,40px) 60px"}}>
        {Object.entries(divData).map(([dk, div]) => (
          <div key={dk} style={{marginBottom:8}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:24,textTransform:"uppercase",color:div.accent,marginBottom:0}}>Division {dk}</div>
            <div style={{display:"flex",justifyContent:"flex-start",gap:0,flexWrap:"wrap"}}>
              {div.teams.map(t => (
                <div key={t.name} onClick={() => setTeamDetail(t.name)} style={{
                  flex:"1 1 0",minWidth:0,maxWidth:200,display:"flex",flexDirection:"column",alignItems:"center",
                  padding:"4px 2px",cursor:"pointer",transition:"background .12s",textAlign:"center",
                }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(0,87,255,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <TLogo name={t.name} size={100} />
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,color:"#111",marginTop:2,textTransform:"uppercase",lineHeight:1.1}}>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── GALLERY PAGE ───────────────────────────────────────────────────────── */
const GALLERY_PHOTOS = [
  { src:"/gallery/DSC_0889-1-1024x680.jpg", caption:"Shomrei Torah — 2022" },
  { src:"/gallery/IMG_2613-1-1024x768.jpg", caption:"Santa Monica Synagogue — 2022" },
  { src:"/gallery/IMG_2614-1-1024x768.jpg", caption:"Leo Baeck — 2022" },
  { src:"/gallery/IMG_2610-1024x768.jpg", caption:"Ron and Avery — Commissioners" },
];

function GalleryPage() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"clamp(16px,4vw,48px) clamp(12px,3vw,32px)"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(28px,5vw,44px)",letterSpacing:".04em",textTransform:"uppercase",color:"#001a6e",margin:0}}>Gallery</h1>
        <p style={{fontFamily:"'Barlow',sans-serif",color:"#777",fontSize:14,marginTop:6}}>Highlights from LASSL seasons</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {GALLERY_PHOTOS.map((p,i) => (
          <div key={i} onClick={() => setSelected(i)} style={{cursor:"pointer",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.10)",background:"#fff",transition:"transform .15s,box-shadow .15s"}}
            onMouseEnter={e => { e.currentTarget.style.transform="scale(1.02)"; e.currentTarget.style.boxShadow="0 6px 24px rgba(0,0,0,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.10)"; }}>
            <img src={p.src} alt={p.caption} style={{width:"100%",height:220,objectFit:"cover",display:"block"}} />
            <div style={{padding:"10px 14px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,letterSpacing:".03em",color:"#333"}}>{p.caption}</div>
          </div>
        ))}
      </div>
      {selected !== null && (
        <div onClick={() => setSelected(null)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:20}}>
          <div style={{position:"relative",maxWidth:"90vw",maxHeight:"90vh"}}>
            <img src={GALLERY_PHOTOS[selected].src} alt={GALLERY_PHOTOS[selected].caption} style={{maxWidth:"90vw",maxHeight:"85vh",objectFit:"contain",borderRadius:8}} />
            <div style={{textAlign:"center",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16,marginTop:12}}>{GALLERY_PHOTOS[selected].caption}</div>
            <button onClick={() => setSelected(null)} style={{position:"absolute",top:-12,right:-12,background:"#fff",border:"none",borderRadius:"50%",width:32,height:32,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>✕</button>
            {selected > 0 && <button onClick={e => { e.stopPropagation(); setSelected(selected-1); }} style={{position:"absolute",left:-16,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:40,height:40,fontSize:20,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>‹</button>}
            {selected < GALLERY_PHOTOS.length-1 && <button onClick={e => { e.stopPropagation(); setSelected(selected+1); }} style={{position:"absolute",right:-16,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",width:40,height:40,fontSize:20,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>›</button>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── RULES PAGE ─────────────────────────────────────────────────────────── */
function RulesPage() {
  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      <PageHero label="LASSL Softball" title="Field Guide" subtitle="Official rules and guidelines for the 2026 season" />
      <div style={{maxWidth:900,margin:"0 auto",padding:"28px clamp(12px,3vw,40px) 60px"}}>
        {/* Jump nav */}
        <Card style={{marginBottom:24}}>
          <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(0,0,0,0.4)"}}>Jump To</span>
          </div>
          <div style={{padding:"14px 20px",display:"flex",flexWrap:"wrap",gap:8}}>
            {RULES_DATA.map(r => (
              <a key={r.section} href={`#rule-${r.section.replace(/\s+/g,"-").toLowerCase()}`} style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(0,87,255,0.06)",border:"1px solid rgba(0,87,255,0.15)",borderRadius:20,padding:"5px 14px",textDecoration:"none",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#0057FF",letterSpacing:".04em",transition:"all .15s"}}
                onMouseEnter={e => e.currentTarget.style.background="rgba(0,87,255,0.12)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(0,87,255,0.06)"}>
                {r.icon} {r.section}
              </a>
            ))}
          </div>
        </Card>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {RULES_DATA.map(r => (
            <Card key={r.section} style={{padding:0}} id={`rule-${r.section.replace(/\s+/g,"-").toLowerCase()}`}>
              <div style={{padding:"16px 24px",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:22}}>{r.icon}</span>
                <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:24,color:"#111",textTransform:"uppercase"}}>{r.section}</h2>
              </div>
              <div style={{padding:"16px 24px"}}>
                <ol style={{listStyle:"none",display:"flex",flexDirection:"column",gap:10}}>
                  {r.items.map((item,i) => (
                    <li key={i} style={{display:"flex",gap:14}}>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:"#0057FF",minWidth:24,paddingTop:1,flexShrink:0}}>{String(i+1).padStart(2,"0")}</span>
                      <span style={{fontSize:14,color:"rgba(0,0,0,0.65)",lineHeight:1.6}}>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Card>
          ))}
        </div>

        <div style={{marginTop:20,background:"#fff",border:"1px solid rgba(0,0,0,0.09)",borderRadius:10,padding:"14px 20px",textAlign:"center",fontSize:13,color:"rgba(0,0,0,0.4)"}}>
          Questions? Contact the league coordinator at <a href="https://www.synagoguesoftball.com/contact/" target="_blank" rel="noopener noreferrer" style={{color:"#0057FF",fontWeight:700}}>synagoguesoftball.com/contact</a> · Rules subject to change by league vote.
        </div>
      </div>
    </div>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
function Footer({ setTab }) {
  const links = [["home","Home"],["scores","Scores"],["schedule","Schedule"],["standings","Standings"],["teams","Teams"],["subs","Sub Board"],["signup","Sign Up"],["rules","Rules"]];
  return (
    <div style={{background:"#001a6e",borderTop:"3px solid #0057FF",padding:"32px clamp(12px,3vw,40px)"}}>
      <div style={{maxWidth:1400,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <img src={L_LEAGUE} alt="LASSL" style={{width:44,height:44,objectFit:"cover",borderRadius:"50%",border:"2px solid rgba(0,87,255,0.5)"}} />
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:"#FFD700",letterSpacing:".06em",textTransform:"uppercase"}}>Los Angeles Synagogue Softball League</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:"rgba(255,255,255,0.4)"}}>Celebrating 30 Years · 1995–2026 · est. 5755</div>
          </div>
        </div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          {links.map(([id,label]) => (
            <span key={id} onClick={() => setTab(id)} style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,color:"rgba(255,255,255,0.45)",cursor:"pointer",textTransform:"uppercase",letterSpacing:".06em"}}
              onMouseEnter={e => e.currentTarget.style.color="#fff"}
              onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.45)"}>
              {label}
            </span>
          ))}
        </div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:"rgba(255,255,255,0.25)"}}>© 2026 LASSL</div>
      </div>
    </div>
  );
}

/* ─── SUB BOARD PAGE ─────────────────────────────────────────────────────── */
function SubBoardPage() {
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("board"); // "board" | "season"
  const [posted, setPosted] = useState(false);
  const [form, setForm] = useState({name:"",team:"",playing:"9:00 AM",available:"11:00 AM",field:"Cheviot Hills #1",contact:""});

  const sampleAvail = [];
  const sampleSubs = [];

  const fields = ["Cheviot Hills #1","Cheviot Hills #3","Sepulveda Basin #2","Sepulveda Basin #3","Sepulveda Basin #4"];
  const times = ["9:00 AM","11:00 AM","1:00 PM"];

  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      <PageHero label="LASSL 2026" title="Sub Board" subtitle="Find a player · Play a double · No need to go through the league">
        <TabBar items={["Game Day Board","Season Sub List"]} active={view==="board"?0:1} onChange={i => setView(i===0?"board":"season")} />
      </PageHero>

      <div style={{maxWidth:900,margin:"0 auto",padding:"24px clamp(12px,3vw,40px) 60px"}}>

        {view==="board" && <>
          {/* Post form */}
          <Card style={{marginBottom:20}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>List yourself as available today</div>
              <div style={{fontSize:13,color:"rgba(0,0,0,0.45)",marginTop:2}}>Playing this morning and want a second game? Post yourself here.</div>
            </div>
            {posted ? (
              <div style={{padding:"24px 20px",textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:8}}>✅</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#111"}}>You're on the board!</div>
                <div style={{fontSize:13,color:"rgba(0,0,0,0.45)",marginTop:4}}>Managers can see you and will contact you directly.</div>
                <button onClick={() => setPosted(false)} style={{marginTop:16,padding:"8px 20px",background:"none",border:"1px solid rgba(0,0,0,0.2)",borderRadius:8,cursor:"pointer",fontSize:13,color:"rgba(0,0,0,0.5)"}}>Post again</button>
              </div>
            ) : (
              <div style={{padding:"16px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontWeight:600}}>Your name</label>
                  <input placeholder="e.g. David Cohen" value={form.name} onChange={e => setForm({...form,name:e.target.value})} style={{padding:"9px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14,background:"#f8f9fb"}} />
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontWeight:600}}>Your team</label>
                  <select value={form.team||""} onChange={e => setForm({...form,team:e.target.value})} style={{padding:"9px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14,background:"#f8f9fb"}}>
                    <option value="">Select your team</option>
                    {ALL_TEAMS_STATIC.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4,gridColumn:"1 / -1"}}>
                  <label style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontWeight:600}}>Phone or email</label>
                  <input placeholder="e.g. 310-555-1234" value={form.contact} onChange={e => setForm({...form,contact:e.target.value})} style={{padding:"9px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14,background:"#f8f9fb"}} />
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontWeight:600}}>Already playing at</label>
                  <select value={form.playing} onChange={e => setForm({...form,playing:e.target.value})} style={{padding:"9px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14,background:"#f8f9fb"}}>
                    {times.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontWeight:600}}>Available for</label>
                  <select value={form.available} onChange={e => setForm({...form,available:e.target.value})} style={{padding:"9px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14,background:"#f8f9fb"}}>
                    <option>11:00 AM</option><option>1:00 PM</option><option>Any game</option>
                  </select>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4,gridColumn:"1 / -1"}}>
                  <label style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontWeight:600}}>Field</label>
                  <select value={form.field} onChange={e => setForm({...form,field:e.target.value})} style={{padding:"9px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14,background:"#f8f9fb"}}>
                    {fields.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div style={{gridColumn:"1 / -1"}}>
                  <button onClick={async () => { try { await fetch('/api/sub-board', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({type:'day',data:form}) }); setPosted(true); } catch(e) { alert('Failed to post'); } }} style={{width:"100%",padding:"12px",background:"#0057FF",border:"none",borderRadius:8,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16,textTransform:"uppercase",cursor:"pointer",letterSpacing:".06em"}}>Post my availability</button>
                </div>
              </div>
            )}
          </Card>

          {/* Available players */}
          <div style={{marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>Available this Sunday</div>
            <span style={{fontSize:13,color:"rgba(0,0,0,0.4)"}}>{sampleAvail.length} players</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {sampleAvail.map((p,i) => (
              <Card key={i} style={{padding:0}}>
                <div style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:`${p.color}18`,border:`2px solid ${p.color}50`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,color:p.color}}>{p.initials}</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:"#111"}}>{p.name} <span style={{fontWeight:500,fontSize:15,color:"rgba(0,0,0,0.4)"}}>· {p.team}</span></div>
                    <div style={{fontSize:13,color:"rgba(0,0,0,0.45)",marginTop:2}}>Playing {p.playing} · Available {p.available} · {p.field}</div>
                  </div>
                  <a href={`tel:${p.contact}`} style={{padding:"8px 16px",background:"#0057FF",borderRadius:8,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,textDecoration:"none",flexShrink:0}}>{p.contact}</a>
                </div>
              </Card>
            ))}
            <div style={{fontSize:12,color:"rgba(0,0,0,0.35)",textAlign:"center",marginTop:4}}>Board clears automatically every Sunday night · Contact players directly</div>
          </div>
        </>}

        {view==="season" && <>
          {/* Filter */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
            <span style={{fontSize:13,color:"rgba(0,0,0,0.4)",alignSelf:"center"}}>Filter:</span>
            {["all","cheviot","sepulveda","morning"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{padding:"5px 14px",borderRadius:20,border:`1px solid ${filter===f?"#0057FF":"rgba(0,0,0,0.15)"}`,background:filter===f?"#0057FF":"#fff",color:filter===f?"#fff":"rgba(0,0,0,0.6)",fontSize:13,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textTransform:"uppercase"}}>
                {f==="all"?"All fields":f==="cheviot"?"Cheviot Hills":f==="sepulveda"?"Sepulveda Basin":"Morning only"}
              </button>
            ))}
          </div>

          <div style={{marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>2026 Season subs</div>
            <span style={{fontSize:13,color:"rgba(0,0,0,0.4)"}}>{sampleSubs.length} players registered</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
            {sampleSubs.map((p,i) => (
              <Card key={i} style={{padding:0}}>
                <div style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:14,borderLeft:`3px solid ${p.color}`}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:`${p.color}18`,border:`2px solid ${p.color}50`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,color:p.color}}>{p.initials}</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:"#111"}}>{p.name} <span style={{fontWeight:500,fontSize:15,color:"rgba(0,0,0,0.4)"}}>· {p.team}</span></div>
                    <div style={{fontSize:13,color:"rgba(0,0,0,0.45)",marginTop:2}}>{p.field} · {p.times} · {p.div}</div>
                  </div>
                  <a href={`tel:${p.contact}`} style={{padding:"8px 16px",background:"#0057FF",borderRadius:8,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:14,textDecoration:"none",flexShrink:0}}>{p.contact}</a>
                </div>
              </Card>
            ))}
            <div style={{fontSize:12,color:"rgba(0,0,0,0.35)",textAlign:"center",marginTop:4}}>Contact players directly · List resets each season · League not involved</div>
          </div>

          {/* Add to season list form */}
          <Card>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>Add yourself to the season sub list</div>
              <div style={{fontSize:13,color:"rgba(0,0,0,0.45)",marginTop:2}}>Set it once. Stays all season.</div>
            </div>
            <div style={{padding:"16px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontWeight:600}}>Your name</label>
                <input placeholder="e.g. Gary Lerner" style={{padding:"9px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14,background:"#f8f9fb"}} />
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontWeight:600}}>Your team</label>
                <select style={{padding:"9px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14,background:"#f8f9fb"}}>
                  <option value="">Select your team</option>
                  {ALL_TEAMS_STATIC.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4,gridColumn:"1 / -1"}}>
                <label style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontWeight:600}}>Phone or email</label>
                <input placeholder="e.g. 310-555-1234" style={{padding:"9px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14,background:"#f8f9fb"}} />
              </div>
              {[["field","Preferred fields",["Any field","Cheviot Hills only","Sepulveda Basin only"]],["times","Preferred times",["Any time","9:00 AM only","11:00 AM only","1:00 PM only","Morning games only"]],["div","Division preference",["Any division","My division only","Any except A"]]].map(([k,label,opts]) => (
                <div key={k} style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontWeight:600}}>{label}</label>
                  <select style={{padding:"9px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14,background:"#f8f9fb"}}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{gridColumn:"1 / -1"}}>
                <button style={{width:"100%",padding:"12px",background:"#0057FF",border:"none",borderRadius:8,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16,textTransform:"uppercase",cursor:"pointer",letterSpacing:".06em"}}>Add me to the sub list</button>
              </div>
            </div>
          </Card>
        </>}
      </div>
    </div>
  );
}

/* ─── SIGN UP PAGE ──────────────────────────────────────────────────────── */
function SignUpPage({ allTeams }) {
  const [form, setForm] = useState({ name: "", team: "", email: "", phone: "", notes: "" });
  const [prefs, setPrefs] = useState({ reminders: false, scores: false, bracket: false, rainout: false });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const teamNames = [...new Set(allTeams.map(t => t.name))].sort();

  const togglePref = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));
  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.name || !form.team || !form.email || !form.phone) return;
    setStatus("sending");
    try {
      const preferences = Object.entries(prefs).filter(([, v]) => v).map(([k]) => {
        const labels = { reminders: "Game day reminders (text)", scores: "Score & standings updates (email)", bracket: "Playoff bracket updates (email)", rainout: "Rainout alerts (text)" };
        return labels[k];
      });
      const r = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, preferences }),
      });
      if (!r.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = { width: "100%", padding: "14px 16px", fontSize: 15, fontFamily: "'Barlow',sans-serif", border: "2px solid rgba(0,0,0,0.1)", borderRadius: 10, outline: "none", background: "#fff", transition: "border .2s" };
  const labelStyle = { fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".04em", textTransform: "uppercase", color: "#333", marginBottom: 6, display: "block" };

  if (status === "done") {
    return (
      <div style={{ minHeight: "100vh", background: "#f2f4f8", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "60px 40px", textAlign: "center", maxWidth: 500, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>⚾</div>
          <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 36, textTransform: "uppercase", color: "#0057FF", marginBottom: 12 }}>You're In!</h2>
          <p style={{ fontSize: 16, color: "rgba(0,0,0,0.5)", lineHeight: 1.6 }}>Thanks for signing up, {form.name.split(" ")[0]}! You'll start receiving playoff updates soon. Good luck to {form.team}!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f2f4f8", overflowX: "hidden", width: "100%" }}>
      <PageHero label="Playoffs 2026" title="Player Sign Up" />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px clamp(12px,3vw,40px) 60px" }}>
        <Card>
          <div style={{ padding: "28px 24px" }}>
            <p style={{ fontSize: 15, color: "rgba(0,0,0,0.55)", lineHeight: 1.7, marginBottom: 28 }}>
              Welcome to Synagogue Softball's new direct communication system! Fill out this form to receive playoff updates, game reminders, and score alerts directly on your phone or email. Takes 30 seconds. Your information will only be used for Synagogue Softball league communications.
            </p>

            {/* Full Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Full Name *</label>
              <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="John Smith" style={inputStyle} onFocus={e => e.target.style.borderColor = "#0057FF"} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"} />
            </div>

            {/* Team Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Team Name *</label>
              <select value={form.team} onChange={e => update("team", e.target.value)} style={{ ...inputStyle, cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}>
                <option value="">Select your team</option>
                {teamNames.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Email Address *</label>
              <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@email.com" style={inputStyle} onFocus={e => e.target.style.borderColor = "#0057FF"} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"} />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Cell Phone Number *</label>
              <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="(310) 555-1234" style={inputStyle} onFocus={e => e.target.style.borderColor = "#0057FF"} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"} />
            </div>

            {/* Preferences */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>What would you like to receive?</label>
              {[
                ["reminders", "Game day reminders (text)"],
                ["scores", "Score & standings updates (email)"],
                ["bracket", "Playoff bracket updates (email)"],
                ["rainout", "Rainout alerts (text)"],
              ].map(([key, label]) => (
                <div key={key} onClick={() => togglePref(key)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", marginBottom: 6, borderRadius: 10, background: prefs[key] ? "rgba(0,87,255,0.06)" : "#f8f9fb", border: prefs[key] ? "2px solid #0057FF" : "2px solid transparent", cursor: "pointer", transition: "all .15s" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: prefs[key] ? "2px solid #0057FF" : "2px solid rgba(0,0,0,0.15)", background: prefs[key] ? "#0057FF" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}>
                    {prefs[key] && <span style={{ color: "#fff", fontSize: 14, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: prefs[key] ? "#0057FF" : "#333" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Anything else? <span style={{ fontWeight: 400, textTransform: "none", color: "rgba(0,0,0,0.3)" }}>(optional)</span></label>
              <textarea value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Questions, comments, or anything you'd like us to know..." rows={3} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => e.target.style.borderColor = "#0057FF"} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"} />
            </div>

            {/* Submit */}
            {status === "error" && <p style={{ color: "#dc2626", fontSize: 14, marginBottom: 12 }}>Something went wrong. Please try again.</p>}
            <button onClick={handleSubmit} disabled={!form.name || !form.team || !form.email || !form.phone || status === "sending"} style={{
              width: "100%", padding: "16px", fontSize: 16, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
              letterSpacing: ".08em", textTransform: "uppercase", color: "#fff",
              background: (!form.name || !form.team || !form.email || !form.phone) ? "rgba(0,0,0,0.15)" : "#0057FF",
              border: "none", borderRadius: 12, cursor: (!form.name || !form.team || !form.email || !form.phone) ? "not-allowed" : "pointer",
              transition: "background .2s",
            }}>
              {status === "sending" ? "Submitting..." : "Sign Me Up ⚾"}
            </button>

            <p style={{ fontSize: 12, color: "rgba(0,0,0,0.3)", textAlign: "center", marginTop: 16 }}>Your information will only be used for Synagogue Softball league communications. No spam, ever.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─── CAPTAIN PAGE ──────────────────────────────────────────────────────── */
/* ─── UMPIRE PAGE ───────────────────────────────────────────────────────── */
function UmpirePage() {
  const [umpName, setUmpName] = useState("");
  const [umpEmail, setUmpEmail] = useState("");
  const [umpPhone, setUmpPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [availability, setAvailability] = useState({});

  // Generate next 8 Sundays
  const getUpcomingSundays = () => {
    const sundays = [];
    const d = new Date();
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
    for (let i = 0; i < 8; i++) {
      const date = new Date(d);
      date.setDate(d.getDate() + i * 7);
      const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const key = date.toISOString().split("T")[0];
      sundays.push({ label, key, date });
      // Check if within 2 weeks
      const diff = (date - new Date()) / (1000*60*60*24);
      sundays[sundays.length-1].locked = diff < 14;
    }
    return sundays;
  };
  const sundays = getUpcomingSundays();
  const times = ["9:00 AM", "11:00 AM", "1:00 PM"];

  const toggleAvail = (dateKey, time) => {
    const sunday = sundays.find(s => s.key === dateKey);
    if (sunday?.locked) return;
    setAvailability(prev => {
      const key = `${dateKey}_${time}`;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const handleSubmit = async () => {
    if (!umpName || !umpEmail) return;
    try {
      await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: umpName, team: "UMPIRE", email: umpEmail, phone: umpPhone,
          preferences: Object.entries(availability).filter(([,v]) => v).map(([k]) => k),
          notes: "Umpire availability submission",
        }),
      });
    } catch(e) {}
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:"#fff",borderRadius:16,padding:"60px 40px",textAlign:"center",maxWidth:500,boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>
        <div style={{fontSize:60,marginBottom:16}}>✅</div>
        <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:36,textTransform:"uppercase",color:"#0057FF",marginBottom:12}}>Submitted!</h2>
        <p style={{fontSize:16,color:"rgba(0,0,0,0.5)",lineHeight:1.6}}>Thanks {umpName.split(" ")[0]}! Your availability has been recorded. The board will be notified of any changes.</p>
        <button onClick={() => setSubmitted(false)} style={{marginTop:20,padding:"10px 24px",background:"#0057FF",border:"none",borderRadius:8,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16,cursor:"pointer",textTransform:"uppercase"}}>Submit Again</button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      <div style={{background:"#fff",borderBottom:"3px solid #0057FF",padding:"28px clamp(12px,3vw,40px) 24px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(36px,6vw,60px)",textTransform:"uppercase",color:"#111",lineHeight:1}}>Umpire <span style={{color:"#0057FF"}}>Scheduling</span></h1>
          <p style={{fontSize:15,color:"rgba(0,0,0,0.45)",marginTop:8}}>Update your availability for upcoming game days. Changes within 2 weeks of a game day require Board approval.</p>
        </div>
      </div>
      <div style={{maxWidth:900,margin:"0 auto",padding:"24px clamp(12px,3vw,40px) 60px"}}>
        <Card>
          <div style={{padding:"20px"}}>
            {/* Umpire info */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:24}}>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4,display:"block"}}>Name *</label>
                <input value={umpName} onChange={e => setUmpName(e.target.value)} placeholder="John Smith" style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:15}} />
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4,display:"block"}}>Email *</label>
                <input value={umpEmail} onChange={e => setUmpEmail(e.target.value)} placeholder="you@email.com" style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:15}} />
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4,display:"block"}}>Phone</label>
                <input value={umpPhone} onChange={e => setUmpPhone(e.target.value)} placeholder="310-555-1234" style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:15}} />
              </div>
            </div>

            {/* Availability grid */}
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,textTransform:"uppercase",color:"#111",marginBottom:12}}>Select Your Availability</div>
            <div style={{overflowX:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                <thead>
                  <tr>
                    <th style={{padding:"10px 12px",textAlign:"left",fontSize:13,fontWeight:700,color:"rgba(0,0,0,0.4)",borderBottom:"2px solid rgba(0,0,0,0.1)"}}>Date</th>
                    {times.map(t => <th key={t} style={{padding:"10px 12px",textAlign:"center",fontSize:13,fontWeight:700,color:"rgba(0,0,0,0.4)",borderBottom:"2px solid rgba(0,0,0,0.1)"}}>{t}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {sundays.map(s => (
                    <tr key={s.key} style={{borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
                      <td style={{padding:"10px 12px",fontWeight:700,color:"#111"}}>
                        Sun {s.label}
                        {s.locked && <span style={{fontSize:10,color:"#dc2626",marginLeft:8,fontWeight:600}}>🔒 Locked</span>}
                      </td>
                      {times.map(t => {
                        const key = `${s.key}_${t}`;
                        const active = availability[key];
                        return (
                          <td key={t} style={{padding:"8px 12px",textAlign:"center"}}>
                            <button onClick={() => toggleAvail(s.key, t)} disabled={s.locked} style={{
                              width:40,height:40,borderRadius:8,border:"none",cursor:s.locked?"not-allowed":"pointer",
                              background:s.locked?"#f3f4f6":active?"#22c55e":"#e5e7eb",
                              color:active?"#fff":"rgba(0,0,0,0.3)",fontSize:18,fontWeight:900,
                              transition:"all .15s",opacity:s.locked?0.5:1,
                            }}>{active?"✓":"—"}</button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,padding:"12px 16px",marginTop:16,marginBottom:16}}>
              <span style={{fontSize:13,color:"#92400e"}}>⚠️ Dates within 2 weeks are <strong>locked</strong>. Changes to locked dates require Board approval — contact the league directly.</span>
            </div>

            <button onClick={handleSubmit} disabled={!umpName||!umpEmail} style={{
              width:"100%",padding:"14px",fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
              textTransform:"uppercase",letterSpacing:".06em",color:"#fff",
              background:(!umpName||!umpEmail)?"rgba(0,0,0,0.15)":"#0057FF",
              border:"none",borderRadius:10,cursor:(!umpName||!umpEmail)?"not-allowed":"pointer",
            }}>Submit Availability</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CaptainPage() {
  const [captainTeam, setCaptainTeam] = useState(null);
  const [fbTeams, setFbTeams] = useState([]);
  const [fbGames, setFbGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [captainGame, setCaptainGame] = useState(null);
  const [captainAway, setCaptainAway] = useState("");
  const [captainHome, setCaptainHome] = useState("");
  const [captainSaving, setCaptainSaving] = useState(false);
  const [captainMsg, setCaptainMsg] = useState(null);

  const loadData = () => {
    setLoading(true);
    fetch('/api/get-data')
      .then(r => r.json())
      .then(({ teams, games }) => { setFbTeams(teams); setFbGames(games.sort((a,b) => (a.wk||0) - (b.wk||0))); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { if (captainTeam) loadData(); }, [captainTeam]);

  const teamName = (id) => fbTeams.find(t => t.id === id)?.name || id || "TBD";

  const handleCaptainSave = async () => {
    if (!captainGame) return;
    const aScore = parseInt(captainAway), hScore = parseInt(captainHome);
    if (isNaN(aScore) || isNaN(hScore)) { setCaptainMsg({ ok: false, text: "Enter valid scores" }); return; }
    setCaptainSaving(true);
    try {
      const r = await fetch('/api/update-firebase', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parsed: { awayScore: aScore, homeScore: hScore, awayBatters: [], homeBatters: [], awayPitchers: [], homePitchers: [], linescore: null, notes: '' },
          gameId: captainGame.id, awayTeamId: captainGame.away, homeTeamId: captainGame.home,
          date: captainGame.date || '', week: captainGame.wk || 0, field: captainGame.field || '',
        }),
      });
      const data = await r.json();
      if (data.success) { setCaptainMsg({ ok: true, text: "Score saved!" }); setCaptainGame(null); loadData(); }
      else setCaptainMsg({ ok: false, text: data.error || "Failed" });
    } catch (e) { setCaptainMsg({ ok: false, text: e.message }); }
    setCaptainSaving(false);
  };

  // ── TEAM SELECT ──
  if (!captainTeam) return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",padding:20}}>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:42,textTransform:"uppercase",color:"#111"}}>Captain Login</div>
          <div style={{fontSize:18,color:"rgba(0,0,0,0.4)",marginTop:6}}>Select your team to get started</div>
        </div>
        {Object.entries(DIV).map(([dk, dv]) => (
          <div key={dk} style={{marginBottom:16}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:dv.accent,marginBottom:4}}>Division {dk}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:0}}>
              {dv.teams.map(t => (
                <div key={t.name} onClick={() => setCaptainTeam(t.name)} style={{
                  flex:"1 1 0",minWidth:0,display:"flex",flexDirection:"column",alignItems:"center",
                  padding:"8px 4px",cursor:"pointer",transition:"background .12s",textAlign:"center",
                }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(0,87,255,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <TLogo name={t.name} size={100} />
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:"#111",marginTop:4,textTransform:"uppercase",lineHeight:1.1}}>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── CAPTAIN SCORES ──
  const myTeamIds = fbTeams.filter(t => t.name === captainTeam || t.id === captainTeam.toLowerCase().replace(/[^a-z0-9]/g,'-') || t.name?.toLowerCase() === captainTeam.toLowerCase()).map(t => t.id);
  const myGames = fbGames.filter(g => {
    const an = teamName(g.away), hn = teamName(g.home);
    return an === captainTeam || hn === captainTeam || myTeamIds.includes(g.away) || myTeamIds.includes(g.home);
  });
  const myWeeks = [...new Set(myGames.map(g => g.wk))].sort((a,b) => a - b);

  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      <div style={{background:"#001a6e",borderBottom:"3px solid #FFD700",padding:"16px clamp(12px,3vw,40px)"}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"flex",alignItems:"center",gap:14}}>
          <TLogo name={captainTeam} size={112} />
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#FFD700",textTransform:"uppercase"}}>{captainTeam}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Captain Mode</div>
          </div>
          <button onClick={() => { setCaptainTeam(null); setCaptainGame(null); setCaptainAway(""); setCaptainHome(""); setCaptainMsg(null); }} style={{marginLeft:"auto",padding:"8px 16px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:6,color:"rgba(255,255,255,0.6)",fontSize:14,cursor:"pointer"}}>Switch Team</button>
        </div>
      </div>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"24px clamp(12px,3vw,40px) 60px"}}>
        <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:36,textTransform:"uppercase",color:"#111",marginBottom:4}}>Scores</h2>
        <div style={{fontSize:15,color:"rgba(0,0,0,0.4)",marginBottom:24}}>Enter and manage game scores</div>

        {captainMsg && (
          <div style={{background:captainMsg.ok?"#f0fdf4":"#fef2f2",border:`1px solid ${captainMsg.ok?"#bbf7d0":"#fecaca"}`,borderRadius:10,padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:15,fontWeight:600,color:captainMsg.ok?"#166534":"#991b1b"}}>{captainMsg.ok ? "✓" : "✗"} {captainMsg.text}</span>
            <button onClick={() => setCaptainMsg(null)} style={{marginLeft:"auto",padding:"4px 12px",background:"none",border:"1px solid rgba(0,0,0,0.15)",borderRadius:6,fontSize:13,cursor:"pointer"}}>Dismiss</button>
          </div>
        )}

        {captainGame && (
          <Card style={{marginBottom:20}}>
            <div id="captain-score-entry" style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>{captainGame.done ? "Edit Score" : "Enter Score"}</div>
              <button onClick={() => setCaptainGame(null)} style={{background:"none",border:"1px solid rgba(0,0,0,0.15)",borderRadius:6,padding:"4px 12px",fontSize:13,cursor:"pointer"}}>Cancel</button>
            </div>
            <div style={{padding:"20px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:16,alignItems:"center",maxWidth:450,margin:"0 auto"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:13,fontWeight:700,color:"rgba(0,0,0,0.4)",marginBottom:6}}>AWAY</div>
                  <TLogo name={teamName(captainGame.away)} size={100} />
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,textTransform:"uppercase",color:"#111",marginTop:6}}>{teamName(captainGame.away)}</div>
                  <input type="number" min="0" max="99" placeholder="0" value={captainAway} onChange={e => setCaptainAway(e.target.value)}
                    style={{width:80,fontSize:40,fontWeight:900,textAlign:"center",background:"#f8f9fb",border:"2px solid rgba(0,0,0,0.15)",borderRadius:10,color:"#111",padding:"6px",marginTop:8}} />
                </div>
                <div style={{fontSize:20,fontWeight:700,color:"rgba(0,0,0,0.2)"}}>VS</div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:13,fontWeight:700,color:"rgba(0,0,0,0.4)",marginBottom:6}}>HOME</div>
                  <TLogo name={teamName(captainGame.home)} size={100} />
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,textTransform:"uppercase",color:"#111",marginTop:6}}>{teamName(captainGame.home)}</div>
                  <input type="number" min="0" max="99" placeholder="0" value={captainHome} onChange={e => setCaptainHome(e.target.value)}
                    style={{width:80,fontSize:40,fontWeight:900,textAlign:"center",background:"#f8f9fb",border:"2px solid rgba(0,0,0,0.15)",borderRadius:10,color:"#111",padding:"6px",marginTop:8}} />
                </div>
              </div>
              <button onClick={handleCaptainSave} disabled={captainSaving}
                style={{display:"block",width:"100%",maxWidth:450,margin:"20px auto 0",padding:"14px",background:captainSaving?"#94a3b8":"#0057FF",border:"none",borderRadius:8,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,textTransform:"uppercase",cursor:captainSaving?"not-allowed":"pointer"}}>
                {captainSaving ? "Saving..." : "Save Score"}
              </button>
            </div>
          </Card>
        )}

        {loading ? <div style={{textAlign:"center",padding:40,color:"rgba(0,0,0,0.4)"}}>Loading games...</div> :
          myGames.length === 0 ? <div style={{textAlign:"center",padding:40,color:"rgba(0,0,0,0.4)"}}>No games found for {captainTeam}. ({fbGames.length} total games, {fbTeams.length} teams loaded)</div> :
          myWeeks.map(wk => {
            const wkGames = myGames.filter(g => g.wk === wk);
            return (
              <div key={wk} style={{marginBottom:24}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111",borderBottom:"2px solid rgba(0,0,0,0.1)",paddingBottom:8,marginBottom:12}}>Week {wk} {wkGames[0]?.date ? `— ${wkGames[0].date}` : ""}</div>
                {wkGames.map(g => {
                  const away = teamName(g.away), home = teamName(g.home);
                  return (
                    <div key={g.id} style={{background:"#fff",border:"1px solid rgba(0,0,0,0.08)",borderRadius:10,padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,minWidth:200}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111"}}>{away}</span>
                        <span style={{fontSize:14,color:"rgba(0,0,0,0.3)"}}>@</span>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111"}}>{home}</span>
                      </div>
                      <span style={{fontSize:14,color:"rgba(0,0,0,0.4)"}}>{g.date || ""} · {g.time || "TBD"} · {g.field || "TBD"}</span>
                      {g.done ? (
                        <span style={{fontSize:14,fontWeight:700,color:"#22c55e",background:"rgba(34,197,94,0.1)",borderRadius:6,padding:"4px 12px"}}>Final {g.away_score}–{g.home_score}</span>
                      ) : (
                        <span style={{fontSize:14,fontWeight:700,color:"#f59e0b",background:"rgba(245,158,11,0.1)",borderRadius:6,padding:"4px 10px"}}>Pending</span>
                      )}
                      <div style={{display:"flex",gap:6,marginLeft:"auto",flexWrap:"wrap",justifyContent:"flex-end"}}>
                        <button onClick={() => { setCaptainGame(g); setCaptainAway(g.done ? String(g.away_score ?? "") : ""); setCaptainHome(g.done ? String(g.home_score ?? "") : ""); setCaptainMsg(null); setTimeout(() => document.getElementById('captain-score-entry')?.scrollIntoView({behavior:'smooth'}), 100); }} style={{
                          fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,letterSpacing:".04em",textTransform:"uppercase",
                          background:g.done?"#f59e0b":"#0057FF",color:"#fff",border:"none",borderRadius:6,padding:"8px 16px",cursor:"pointer",whiteSpace:"nowrap",
                        }}>{g.done ? "Edit Score" : "Quick Score"}</button>
                        {g.done && <button onClick={async () => { if (!confirm('Clear this score and reset game to pending? Standings will be reversed.')) return; setCaptainMsg(null); try { const r = await fetch('/api/clear-score', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({gameId:g.id}) }); const d = await r.json(); if (d.success) { setCaptainMsg({ok:true,text:'Score cleared!'}); loadData(); } else { setCaptainMsg({ok:false,text:d.error||'Failed'}); } } catch(e) { setCaptainMsg({ok:false,text:e.message}); } }} style={{
                          fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,letterSpacing:".04em",textTransform:"uppercase",
                          background:"none",color:"#dc2626",border:"1px solid #dc2626",borderRadius:6,padding:"7px 16px",cursor:"pointer",whiteSpace:"nowrap",
                        }}>Clear Score</button>}
                        {!g.done && <a href={`/live-score.html?game=${g.id}`} target="_blank" rel="noopener noreferrer" style={{
                          fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:14,letterSpacing:".04em",textTransform:"uppercase",
                          background:"none",color:"#0057FF",border:"1px solid #0057FF",borderRadius:6,padding:"7px 16px",cursor:"pointer",textDecoration:"none",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4,
                        }}>⚡ Live Score</a>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

/* ─── ADMIN PAGE ─────────────────────────────────────────────────────────── */
function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [adminView, setAdminView] = useState("dashboard");
  const [alertText, setAlertText] = useState("");
  const [alertBg, setAlertBg] = useState("#dc2626");
  const [alertTextColor, setAlertTextColor] = useState("#ffffff");
  const [alertFontSize, setAlertFontSize] = useState(16);
  const [alertBold, setAlertBold] = useState(false);
  const [alertItalic, setAlertItalic] = useState(false);
  const [alertAlign, setAlertAlign] = useState("center");
  const [alertBorder, setAlertBorder] = useState("Solid");
  const [alertBlink, setAlertBlink] = useState(false);
  const [alertFont, setAlertFont] = useState("'Barlow Condensed',sans-serif");
  const [alertPosting, setAlertPosting] = useState(false);
  const [alertPosted, setAlertPosted] = useState(false);

  // Firebase data
  const [fbTeams, setFbTeams] = useState([]);
  const [fbGames, setFbGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // Score entry state
  const [selWeek, setSelWeek] = useState(null);
  const [selGame, setSelGame] = useState(null);
  const [awayScore, setAwayScore] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  // Sign-ups
  const [signups, setSignups] = useState([]);
  const [signupsLoading, setSignupsLoading] = useState(false);
  const [showSignups, setShowSignups] = useState(false);

  // Sub board state
  const [adminSubs, setAdminSubs] = useState({ daySubs: [], seasonSubs: [] });
  const [subsLoading, setSubsLoading] = useState(false);

  const loadSignups = () => {
    setSignupsLoading(true);
    fetch('/api/get-signups')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(({ signups: data }) => { setSignups(data || []); setSignupsLoading(false); })
      .catch(() => { setSignupsLoading(false); });
  };

  // Load data from Firebase
  const loadData = () => {
    setLoading(true);
    fetch('/api/get-data')
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(({ teams, games }) => {
        setFbTeams(teams);
        setFbGames(games.sort((a,b) => (a.wk||0) - (b.wk||0)));
        setConnected(true);
        setLoading(false);
      })
      .catch(() => { setConnected(false); setLoading(false); });
  };

  useEffect(() => { if (authed) loadData(); }, [authed]);

  const teamName = (id) => fbTeams.find(t => t.id === id)?.name || id || "TBD";

  // Group games by week
  const weeks = [...new Set(fbGames.map(g => g.wk))].sort((a,b) => a - b);
  const weekGames = selWeek !== null ? fbGames.filter(g => g.wk === selWeek) : [];

  const handleSave = async () => {
    if (!selGame) return;
    const aScore = parseInt(awayScore);
    const hScore = parseInt(homeScore);
    if (isNaN(aScore) || isNaN(hScore)) { setSaveMsg({ ok: false, text: "Enter valid scores" }); return; }

    setSaving(true);
    setSaveMsg(null);
    try {
      const r = await fetch('/api/update-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parsed: { awayScore: aScore, homeScore: hScore, awayBatters: [], homeBatters: [], awayPitchers: [], homePitchers: [], linescore: null, notes: '' },
          gameId: selGame.id,
          awayTeamId: selGame.away,
          homeTeamId: selGame.home,
          date: selGame.date || '',
          week: selGame.wk || 0,
          field: selGame.field || '',
        }),
      });
      const data = await r.json();
      if (data.success) {
        setSaveMsg({ ok: true, text: `Saved! ${teamName(selGame.away)} ${aScore} – ${teamName(selGame.home)} ${hScore}` });
        setSelGame(null);
        setAwayScore("");
        setHomeScore("");
        loadData(); // refresh
      } else {
        setSaveMsg({ ok: false, text: data.error || "Save failed" });
      }
    } catch (e) {
      setSaveMsg({ ok: false, text: e.message });
    }
    setSaving(false);
  };

  // ── ADMIN LOGIN ──
  if (!authed) return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <Card style={{maxWidth:380,width:"100%",padding:0}}>
        <div style={{background:"#001a6e",padding:"24px 28px",borderRadius:"12px 12px 0 0",display:"flex",alignItems:"center",gap:12}}>
          <img src={L_LEAGUE} alt="LASSL" style={{width:40,height:40,borderRadius:"50%",objectFit:"cover"}} />
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:"#FFD700",textTransform:"uppercase"}}>LASSL Admin</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>League management portal</div>
          </div>
        </div>
        <div style={{padding:"28px"}}>
          <div style={{fontSize:14,color:"rgba(0,0,0,0.5)",marginBottom:16}}>Enter your admin password to continue.</div>
          <input type="password" placeholder="Password" value={pw} onChange={e => {setPw(e.target.value); setPwError(false);}} onKeyDown={e => e.key==="Enter" && (pw==="lassl2026" ? setAuthed(true) : setPwError(true))} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:`1px solid ${pwError?"#dc2626":"rgba(0,0,0,0.15)"}`,fontSize:15,marginBottom:8,background:"#f8f9fb"}} />
          {pwError && <div style={{fontSize:12,color:"#dc2626",marginBottom:8}}>Incorrect password.</div>}
          <button onClick={() => pw==="lassl2026" ? setAuthed(true) : setPwError(true)} style={{width:"100%",padding:"11px",background:"#0057FF",border:"none",borderRadius:8,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16,textTransform:"uppercase",cursor:"pointer",letterSpacing:".06em"}}>Log in</button>
          <div style={{fontSize:12,color:"rgba(0,0,0,0.3)",textAlign:"center",marginTop:12}}>Password: lassl2026</div>
        </div>
      </Card>
    </div>
  );

  // ── ADMIN DASHBOARD (captain removed — separate page now) ──
  if (false) {
    const myGames = [], myWeeks = [];

    // Captain score entry
    const [captainGame, setCaptainGame] = useState(null);
    const [captainAway, setCaptainAway] = useState("");
    const [captainHome, setCaptainHome] = useState("");
    const [captainSaving, setCaptainSaving] = useState(false);
    const [captainMsg, setCaptainMsg] = useState(null);

    const handleCaptainSave = async () => {
      if (!captainGame) return;
      const aScore = parseInt(captainAway);
      const hScore = parseInt(captainHome);
      if (isNaN(aScore) || isNaN(hScore)) { setCaptainMsg({ ok: false, text: "Enter valid scores" }); return; }
      setCaptainSaving(true);
      try {
        const r = await fetch('/api/update-firebase', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parsed: { awayScore: aScore, homeScore: hScore, awayBatters: [], homeBatters: [], awayPitchers: [], homePitchers: [], linescore: null, notes: '' },
            gameId: captainGame.id, awayTeamId: captainGame.away, homeTeamId: captainGame.home,
            date: captainGame.date || '', week: captainGame.wk || 0, field: captainGame.field || '',
          }),
        });
        const data = await r.json();
        if (data.success) { setCaptainMsg({ ok: true, text: "Score saved!" }); setCaptainGame(null); loadData(); }
        else setCaptainMsg({ ok: false, text: data.error || "Failed" });
      } catch (e) { setCaptainMsg({ ok: false, text: e.message }); }
      setCaptainSaving(false);
    };

    return (
      <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
        <div style={{background:"#001a6e",borderBottom:"3px solid #FFD700",padding:"16px clamp(12px,3vw,40px)"}}>
          <div style={{maxWidth:1000,margin:"0 auto",display:"flex",alignItems:"center",gap:14}}>
            <TLogo name={captainTeam} size={112} />
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:"#FFD700",textTransform:"uppercase"}}>{captainTeam}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Captain Mode</div>
            </div>
            <button onClick={() => { setRole(null); setCaptainTeam(null); setAuthed(false); }} style={{marginLeft:"auto",padding:"8px 16px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:6,color:"rgba(255,255,255,0.6)",fontSize:14,cursor:"pointer"}}>Log out</button>
          </div>
        </div>
        <div style={{maxWidth:1000,margin:"0 auto",padding:"24px clamp(12px,3vw,40px) 60px"}}>
          <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:36,textTransform:"uppercase",color:"#111",marginBottom:4}}>Scores</h2>
          <div style={{fontSize:15,color:"rgba(0,0,0,0.4)",marginBottom:24}}>Enter and manage game scores</div>

          {captainMsg && (
            <div style={{background:captainMsg.ok?"#f0fdf4":"#fef2f2",border:`1px solid ${captainMsg.ok?"#bbf7d0":"#fecaca"}`,borderRadius:10,padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:15,fontWeight:600,color:captainMsg.ok?"#166534":"#991b1b"}}>{captainMsg.ok ? "✓" : "✗"} {captainMsg.text}</span>
              <button onClick={() => setCaptainMsg(null)} style={{marginLeft:"auto",padding:"4px 12px",background:"none",border:"1px solid rgba(0,0,0,0.15)",borderRadius:6,fontSize:13,cursor:"pointer"}}>Dismiss</button>
            </div>
          )}

          {/* Quick score modal */}
          {captainGame && (
            <Card style={{marginBottom:20}}>
              <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>Enter Score</div>
                <button onClick={() => setCaptainGame(null)} style={{background:"none",border:"1px solid rgba(0,0,0,0.15)",borderRadius:6,padding:"4px 12px",fontSize:13,cursor:"pointer"}}>Cancel</button>
              </div>
              <div style={{padding:"20px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:16,alignItems:"center",maxWidth:450,margin:"0 auto"}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:13,fontWeight:700,color:"rgba(0,0,0,0.4)",marginBottom:6}}>AWAY</div>
                    <TLogo name={teamName(captainGame.away)} size={100} />
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,textTransform:"uppercase",color:"#111",marginTop:6}}>{teamName(captainGame.away)}</div>
                    <input type="number" min="0" max="99" placeholder="0" value={captainAway} onChange={e => setCaptainAway(e.target.value)}
                      style={{width:80,fontSize:40,fontWeight:900,textAlign:"center",background:"#f8f9fb",border:"2px solid rgba(0,0,0,0.15)",borderRadius:10,color:"#111",padding:"6px",marginTop:8}} />
                  </div>
                  <div style={{fontSize:20,fontWeight:700,color:"rgba(0,0,0,0.2)"}}>VS</div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:13,fontWeight:700,color:"rgba(0,0,0,0.4)",marginBottom:6}}>HOME</div>
                    <TLogo name={teamName(captainGame.home)} size={100} />
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,textTransform:"uppercase",color:"#111",marginTop:6}}>{teamName(captainGame.home)}</div>
                    <input type="number" min="0" max="99" placeholder="0" value={captainHome} onChange={e => setCaptainHome(e.target.value)}
                      style={{width:80,fontSize:40,fontWeight:900,textAlign:"center",background:"#f8f9fb",border:"2px solid rgba(0,0,0,0.15)",borderRadius:10,color:"#111",padding:"6px",marginTop:8}} />
                  </div>
                </div>
                <button onClick={handleCaptainSave} disabled={captainSaving}
                  style={{display:"block",width:"100%",maxWidth:450,margin:"20px auto 0",padding:"14px",background:captainSaving?"#94a3b8":"#0057FF",border:"none",borderRadius:8,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,textTransform:"uppercase",cursor:captainSaving?"not-allowed":"pointer"}}>
                  {captainSaving ? "Saving..." : "Save Score"}
                </button>
              </div>
            </Card>
          )}

          {myWeeks.map(wk => {
            const wkGames = myGames.filter(g => g.wk === wk);
            return (
              <div key={wk} style={{marginBottom:24}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111",borderBottom:"2px solid rgba(0,0,0,0.1)",paddingBottom:8,marginBottom:12}}>Week {wk} {wkGames[0]?.date ? `— ${wkGames[0].date}` : ""}</div>
                {wkGames.map(g => {
                  const away = teamName(g.away);
                  const home = teamName(g.home);
                  return (
                    <div key={g.id} style={{background:"#fff",border:"1px solid rgba(0,0,0,0.08)",borderRadius:10,padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,minWidth:200}}>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111"}}>{away}</span>
                        <span style={{fontSize:14,color:"rgba(0,0,0,0.3)"}}>@</span>
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111"}}>{home}</span>
                      </div>
                      <span style={{fontSize:13,color:"rgba(0,0,0,0.4)"}}>{g.date || ""} · {g.time || "TBD"} · {g.field || "TBD"}</span>
                      {g.done ? (
                        <span style={{fontSize:14,fontWeight:700,color:"#22c55e",background:"rgba(34,197,94,0.1)",borderRadius:6,padding:"4px 12px"}}>Final {g.away_score}–{g.home_score}</span>
                      ) : (
                        <span style={{fontSize:13,fontWeight:700,color:"#f59e0b",background:"rgba(245,158,11,0.1)",borderRadius:6,padding:"4px 10px"}}>Pending</span>
                      )}
                      <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
                        {!g.done && (
                          <button onClick={() => { setCaptainGame(g); setCaptainAway(""); setCaptainHome(""); setCaptainMsg(null); }} style={{
                            fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,letterSpacing:".04em",textTransform:"uppercase",
                            background:"#0057FF",color:"#fff",border:"none",borderRadius:6,padding:"8px 14px",cursor:"pointer",whiteSpace:"nowrap",
                          }}>Quick Score</button>
                        )}
                        <a href="/live-score.html" target="_blank" rel="noopener noreferrer" style={{
                          fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,letterSpacing:".04em",textTransform:"uppercase",
                          background:"none",color:"#0057FF",border:"1px solid #0057FF",borderRadius:6,padding:"7px 14px",cursor:"pointer",textDecoration:"none",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4,
                        }}>⚡ Live Score</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ──
  const loadSubs = () => {
    setSubsLoading(true);
    fetch('/api/sub-board').then(r => r.json()).then(d => { setAdminSubs(d); setSubsLoading(false); }).catch(() => setSubsLoading(false));
  };
  const deleteSub = async (type, id) => {
    if (!confirm('Delete this sub?')) return;
    await fetch('/api/sub-board', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, id }) });
    loadSubs();
  };

  const adminCards = [
    { icon: "🚨", title: "League Alert Banner", desc: "Post urgent site-wide notices", color: "#dc2626", borderColor: "#dc2626", action: () => setAdminView("alert") },
    { icon: "📰", title: "News & Events", desc: "Post announcements to the Home page", color: "#b45309", borderColor: "#f59e0b", action: () => setAdminView("news") },
    { icon: "⚡", title: "Live Game Tracker", desc: "Score games in real time", color: "#0057FF", borderColor: "#0057FF", action: () => window.open("/live-score.html", "_blank") },
    { icon: "📊", title: "Enter Scores", desc: "Enter this week's results", color: "#0057FF", borderColor: "#0057FF", action: () => setAdminView("scores") },
    { icon: "👥", title: "Player Sign-Ups", desc: "View player registrations", color: "#0057FF", borderColor: "#0057FF", action: () => { setAdminView("signups"); if (signups.length === 0) loadSignups(); } },
    { icon: "🔄", title: "Sub Board", desc: "Manage game day & season subs", color: "#b45309", borderColor: "#f59e0b", action: () => { setAdminView("subs"); loadSubs(); } },
    { icon: "⚖️", title: "Umpire Schedule", desc: "View umpire availability", color: "#6d28d9", borderColor: "#8b5cf6", action: () => setAdminView("umpires") },
    { icon: "💰", title: "Finances & Payments", desc: "Track fees, payments & balances", color: "#15803d", borderColor: "#22c55e", action: () => setAdminView("finances") },
    { icon: "📧", title: "Contact Manager", desc: "Email players, managers & teams", color: "#6d28d9", borderColor: "#8b5cf6", action: () => setAdminView("contacts") },
    { icon: "📋", title: "Standings", desc: "View current standings", color: "#15803d", borderColor: "#22c55e", action: () => window.open("/", "_blank") },
  ];

  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      <div style={{background:"#fff",borderBottom:"3px solid #0057FF",padding:"16px clamp(12px,3vw,40px)"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,textTransform:"uppercase",color:"#111"}}>Admin Dashboard</div>
            <div style={{fontSize:14,color:"rgba(0,0,0,0.4)",marginTop:2}}>{loading ? "Loading..." : connected ? `${fbTeams.length} teams · ${fbGames.length} games` : "Not connected"}</div>
          </div>
          <button onClick={() => setAuthed(false)} style={{padding:"8px 18px",background:"none",border:"1px solid rgba(0,0,0,0.2)",borderRadius:8,color:"#555",fontSize:14,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textTransform:"uppercase"}}>Log out</button>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"24px clamp(12px,3vw,40px) 60px",display:"flex",flexDirection:"column",gap:20}}>

        {/* Dashboard Grid */}
        {adminView === "dashboard" && (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16}}>
            {adminCards.map((c,i) => (
              <button key={i} onClick={c.action} style={{
                background:"#fff",border:"1px solid rgba(0,0,0,0.09)",borderTop:`4px solid ${c.borderColor}`,
                borderRadius:12,padding:"24px 20px",cursor:"pointer",textAlign:"left",
                transition:"all .15s",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.1)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)"}>
                <div style={{fontSize:32,marginBottom:12}}>{c.icon}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111",letterSpacing:".04em"}}>{c.title}</div>
                <div style={{fontSize:12,color:"rgba(0,0,0,0.4)",marginTop:4}}>{c.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Back button when in sub-view */}
        {adminView !== "dashboard" && (
          <button onClick={() => setAdminView("dashboard")} style={{alignSelf:"flex-start",padding:"6px 14px",background:"none",border:"1px solid rgba(0,0,0,0.2)",borderRadius:6,fontSize:13,cursor:"pointer",color:"#555",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:".04em"}}>← Dashboard</button>
        )}

        {/* Sign-ups view */}
        {adminView === "signups" && (
          <Card>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>Player Sign-Ups</div>
            </div>
            <div style={{padding:"16px 20px"}}>
              {signupsLoading ? (
                <div style={{fontSize:14,color:"rgba(0,0,0,0.4)",textAlign:"center",padding:20}}>Loading sign-ups...</div>
              ) : signups.length === 0 ? (
                <div style={{fontSize:14,color:"rgba(0,0,0,0.4)",textAlign:"center",padding:20}}>No sign-ups yet.</div>
              ) : (() => {
                const byTeam = {};
                signups.forEach(s => { const t = s.team || "Unknown"; if (!byTeam[t]) byTeam[t] = []; byTeam[t].push(s); });
                const sortedTeams = Object.keys(byTeam).sort();
                return (
                  <div>
                    <div style={{fontSize:12,color:"rgba(0,0,0,0.3)",marginBottom:14}}>{signups.length} player{signups.length !== 1 ? "s" : ""} across {sortedTeams.length} team{sortedTeams.length !== 1 ? "s" : ""}</div>
                    {sortedTeams.map(team => (
                      <div key={team} style={{marginBottom:16}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                          <TLogo name={team} size={80} />
                          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,textTransform:"uppercase",color:"#111"}}>{team}</span>
                          <span style={{fontSize:12,color:"rgba(0,0,0,0.35)",fontWeight:600}}>({byTeam[team].length})</span>
                        </div>
                        {byTeam[team].map((s, i) => (
                          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 12px",borderBottom:"1px solid rgba(0,0,0,0.04)",fontSize:13}}>
                            <span style={{fontWeight:600,color:"#111",minWidth:120}}>{s.name}</span>
                            <a href={`mailto:${s.email}`} style={{color:"#0057FF",minWidth:160}}>{s.email}</a>
                            <span style={{color:"#555",minWidth:110}}>{s.phone}</span>
                            <span style={{color:"rgba(0,0,0,0.35)",fontSize:11}}>{(s.preferences || []).join(", ") || "—"}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </Card>
        )}

        {/* Subs view */}
        {adminView === "subs" && (
          <Card>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>Sub Board Management</div>
            </div>
            <div style={{padding:"16px 20px"}}>
              {subsLoading ? <div style={{textAlign:"center",padding:20,color:"rgba(0,0,0,0.4)"}}>Loading...</div> : <>
                <div style={{marginBottom:24}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111",marginBottom:10}}>Game Day Board ({adminSubs.daySubs.length})</div>
                  {adminSubs.daySubs.length === 0 ? <div style={{fontSize:14,color:"rgba(0,0,0,0.35)"}}>No game day subs posted.</div> :
                    adminSubs.daySubs.map(s => (
                      <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
                        <span style={{fontWeight:700,flex:1}}>{s.name || "?"}</span>
                        <span style={{color:"rgba(0,0,0,0.4)",fontSize:13}}>{s.team || ""}</span>
                        <span style={{color:"rgba(0,0,0,0.4)",fontSize:13}}>{s.contact || ""}</span>
                        <span style={{color:"rgba(0,0,0,0.4)",fontSize:13}}>{s.playing || ""} → {s.available || ""}</span>
                        <button onClick={() => deleteSub('day', s.id)} style={{background:"none",border:"1px solid #dc2626",color:"#dc2626",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:700}}>Delete</button>
                      </div>
                    ))
                  }
                </div>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111",marginBottom:10}}>Season Sub List ({adminSubs.seasonSubs.length})</div>
                  {adminSubs.seasonSubs.length === 0 ? <div style={{fontSize:14,color:"rgba(0,0,0,0.35)"}}>No season subs registered.</div> :
                    adminSubs.seasonSubs.map(s => (
                      <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(0,0,0,0.05)"}}>
                        <span style={{fontWeight:700,flex:1}}>{s.name || "?"}</span>
                        <span style={{color:"rgba(0,0,0,0.4)",fontSize:13}}>{s.team || ""}</span>
                        <span style={{color:"rgba(0,0,0,0.4)",fontSize:13}}>{s.contact || ""}</span>
                        <span style={{color:"rgba(0,0,0,0.4)",fontSize:13}}>{s.field || ""} · {s.times || ""}</span>
                        <button onClick={() => deleteSub('season', s.id)} style={{background:"none",border:"1px solid #dc2626",color:"#dc2626",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",fontWeight:700}}>Delete</button>
                      </div>
                    ))
                  }
                </div>
              </>}
            </div>
          </Card>
        )}

        {/* Umpire Schedule view */}
        {adminView === "umpires" && (
          <Card>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>⚖️</span>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>Umpire Schedule</div>
            </div>
            <div style={{padding:"20px"}}>
              <p style={{fontSize:14,color:"rgba(0,0,0,0.5)",marginBottom:16}}>Umpire availability submissions will appear here. Changes within 2 weeks of a game day are flagged for Board approval.</p>
              <div style={{fontSize:14,color:"rgba(0,0,0,0.35)",textAlign:"center",padding:30}}>No submissions yet. Umpires can submit availability from More → Umpires.</div>
              <div style={{fontSize:12,color:"rgba(0,0,0,0.3)",textAlign:"center",marginTop:10}}>Submissions save to Firebase — will populate when quota resets</div>
            </div>
          </Card>
        )}

        {/* Alert Banner view */}
        {adminView === "alert" && (() => {
          const quickEmojis = ["⚠️","🚨","❌","📢","🎉","📋","✅","🔴","⚾","📅","🏟️"];
          return (
          <Card>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",gap:8}}>
              <span style={{width:10,height:10,borderRadius:"50%",background:"#22c55e",flexShrink:0}} />
              <span style={{fontSize:20}}>🚨</span>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>League Alert Banner</div>
            </div>
            <div style={{padding:"20px"}}>
              <p style={{fontSize:14,color:"rgba(0,0,0,0.5)",marginBottom:16}}>When active, a <strong style={{color:"#dc2626"}}>big red blocking popup</strong> appears on the site — visitors must click OK to continue. Leave blank to clear.</p>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                <span style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase"}}>Quick Insert:</span>
                {quickEmojis.map(em => <button key={em} onClick={() => setAlertText(t => t + em)} style={{fontSize:22,background:"none",border:"1px solid rgba(0,0,0,0.1)",borderRadius:6,padding:"4px 8px",cursor:"pointer"}}>{em}</button>)}
              </div>
              <textarea id="alert-text" value={alertText} onChange={e => setAlertText(e.target.value)} placeholder="e.g. ⚠️ RAINOUT — All Saturday April 19 games are CANCELLED due to rain. Makeup dates TBD." rows={4} style={{width:"100%",padding:"14px",borderRadius:10,border:"1px solid rgba(0,0,0,0.15)",fontSize:16,fontFamily:"'Barlow',sans-serif",resize:"vertical",marginBottom:12}} />
              {/* Formatting toolbar */}
              <div style={{border:"1px solid rgba(0,0,0,0.1)",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <select value={alertFont} onChange={e => setAlertFont(e.target.value)} style={{padding:"6px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,0.15)",fontSize:13}}>
                  <option value="'Barlow Condensed',sans-serif">Default (Barlow)</option>
                  <option value="Arial,sans-serif">Arial</option>
                  <option value="Georgia,serif">Georgia</option>
                  <option value="Impact,sans-serif">Impact</option>
                </select>
                <div style={{display:"flex",alignItems:"center",gap:2,border:"1px solid rgba(0,0,0,0.15)",borderRadius:6,overflow:"hidden"}}>
                  <button onClick={() => setAlertFontSize(s => Math.max(10,s-2))} style={{padding:"6px 10px",background:"none",border:"none",cursor:"pointer",fontSize:16,fontWeight:700}}>−</button>
                  <input type="number" value={alertFontSize} onChange={e => setAlertFontSize(Number(e.target.value)||16)} style={{width:40,textAlign:"center",border:"none",fontSize:14,padding:"4px 0"}} />
                  <button onClick={() => setAlertFontSize(s => Math.min(48,s+2))} style={{padding:"6px 10px",background:"none",border:"none",cursor:"pointer",fontSize:16,fontWeight:700}}>+</button>
                </div>
                <button onClick={() => setAlertBold(b => !b)} style={{padding:"6px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,0.15)",background:alertBold?"#001a6e":"none",color:alertBold?"#fff":"#111",cursor:"pointer",fontSize:16,fontWeight:900}}>B</button>
                <button onClick={() => setAlertItalic(i => !i)} style={{padding:"6px 10px",borderRadius:6,border:"1px solid rgba(0,0,0,0.15)",background:alertItalic?"#001a6e":"none",color:alertItalic?"#fff":"#111",cursor:"pointer",fontSize:16,fontStyle:"italic"}}>I</button>
                <div style={{display:"flex",border:"1px solid rgba(0,0,0,0.15)",borderRadius:6,overflow:"hidden"}}>
                  {[["left","≡←"],["center","≡"],["right","≡→"]].map(([a,icon]) => (
                    <button key={a} onClick={() => setAlertAlign(a)} style={{padding:"6px 8px",background:alertAlign===a?"#001a6e":"none",border:"none",cursor:"pointer",fontSize:13,color:alertAlign===a?"#fff":"#111"}}>{icon}</button>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)"}}>TEXT</span>
                  <input type="color" value={alertTextColor} onChange={e => setAlertTextColor(e.target.value)} style={{width:28,height:28,border:"1px solid rgba(0,0,0,0.15)",borderRadius:4,cursor:"pointer",padding:0}} />
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)"}}>BACKGROUND</span>
                  <input type="color" value={alertBg} onChange={e => setAlertBg(e.target.value)} style={{width:28,height:28,border:"1px solid rgba(0,0,0,0.15)",borderRadius:4,cursor:"pointer",padding:0}} />
                </div>
              </div>
              {/* Border + Blink */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                <span style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase"}}>Border</span>
                {["None","Solid","Dashed","Glow"].map(b => (
                  <button key={b} onClick={() => setAlertBorder(b)} style={{padding:"5px 14px",borderRadius:6,border:"1px solid rgba(0,0,0,0.15)",background:alertBorder===b?"#0057FF":"#fff",color:alertBorder===b?"#fff":"#111",fontSize:13,fontWeight:700,cursor:"pointer"}}>{b}</button>
                ))}
                <span style={{marginLeft:8}} />
                <button onClick={() => setAlertBlink(b => !b)} style={{padding:"5px 14px",borderRadius:6,border:"1px solid rgba(0,0,0,0.15)",background:alertBlink?"#0057FF":"#fff",color:alertBlink?"#fff":"#111",fontSize:13,fontWeight:700,cursor:"pointer"}}>✨ Blink</button>
              </div>
              {/* Preview */}
              <div style={{
                background:alertBg,borderRadius:10,padding:"16px 20px",marginBottom:16,minHeight:50,
                border:alertBorder==="None"?"none":alertBorder==="Solid"?`3px solid ${alertTextColor}`:alertBorder==="Dashed"?`3px dashed ${alertTextColor}`:"none",
                boxShadow:alertBorder==="Glow"?`0 0 20px ${alertBg}, 0 0 40px ${alertBg}60`:"none",
                animation:alertBlink?"alertBlink 1s ease-in-out infinite":"none",
              }}>
                {alertText ? (
                  <div style={{fontFamily:alertFont,fontWeight:alertBold?900:700,fontSize:alertFontSize,color:alertTextColor,textAlign:alertAlign,fontStyle:alertItalic?"italic":"normal"}}>{alertText}</div>
                ) : (
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16,color:"rgba(255,255,255,0.5)",textAlign:"center",fontStyle:"italic"}}>Preview will appear here as you type...</div>
                )}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",marginBottom:4}}>📅 Go Live At (optional)</div>
                  <input type="datetime-local" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14}} />
                  <div style={{fontSize:11,color:"rgba(0,0,0,0.3)",marginTop:2}}>Leave blank to post immediately</div>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",marginBottom:4}}>😴 Auto-Expire At (optional)</div>
                  <input type="datetime-local" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14}} />
                  <div style={{fontSize:11,color:"rgba(0,0,0,0.3)",marginTop:2}}>Alert clears itself automatically</div>
                </div>
              </div>
              <button onClick={async () => {
                if (!alertText) return;
                setAlertPosting(true);
                try {
                  await fetch('/api/signup', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({
                    name:'ALERT_BANNER', team:'SYSTEM', email:'admin@lassl.com', phone:'',
                    preferences:[`bg:${alertBg}`,`color:${alertTextColor}`,`size:${alertFontSize}`,`bold:${alertBold}`,`italic:${alertItalic}`,`align:${alertAlign}`,`border:${alertBorder}`,`blink:${alertBlink}`,`font:${alertFont}`],
                    notes:alertText,
                  })});
                  setAlertPosted(true);
                } catch(e) { alert('Failed: '+e.message); }
                setAlertPosting(false);
              }} disabled={!alertText||alertPosting} style={{width:"100%",padding:"16px",background:!alertText?"rgba(0,0,0,0.15)":"#dc2626",border:"none",borderRadius:10,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,textTransform:"uppercase",cursor:!alertText?"not-allowed":"pointer",letterSpacing:".06em"}}>
                {alertPosting ? "Posting..." : alertPosted ? "✓ Alert Posted!" : "Post Alert to Site"}
              </button>
            </div>
          </Card>
          );
        })()}

        {/* News & Events view */}
        {adminView === "news" && (() => {
          const insertEmojis = ["⚾","🏆","📅","⚠️","📢","📋","✅","🔴","⭐","🎉","📌","🏟️"];
          return (
          <Card>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:20}}>📰</span>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>News & Events</div>
              </div>
              <button style={{padding:"6px 14px",background:"none",border:"1px solid #0057FF",borderRadius:6,color:"#0057FF",fontSize:13,fontWeight:700,cursor:"pointer"}}>↻ Refresh</button>
            </div>
            <div style={{padding:"20px"}}>
              <p style={{fontSize:14,color:"rgba(0,0,0,0.5)",marginBottom:16}}>Post announcements, upcoming events, or league news. These appear at the top of the Home page for all visitors.</p>
              <div style={{border:"1px solid rgba(0,0,0,0.1)",borderRadius:12,padding:"20px",marginBottom:20}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,color:"#0057FF",textTransform:"uppercase",marginBottom:12}}>+ New Post</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase"}}>Insert:</span>
                  {insertEmojis.map(e => <button key={e} onClick={() => { const ta = document.getElementById('news-body'); if(ta) { ta.value += e; ta.focus(); } }} style={{fontSize:20,background:"none",border:"1px solid rgba(0,0,0,0.08)",borderRadius:6,padding:"3px 6px",cursor:"pointer"}}>{e}</button>)}
                </div>
                <input id="news-title" placeholder="Title (required)" style={{width:"100%",padding:"12px 14px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:16,fontFamily:"'Barlow',sans-serif",marginBottom:10}} />
                {/* Formatting toolbar */}
                <div style={{border:"1px solid rgba(0,0,0,0.1)",borderRadius:10,padding:"8px 12px",marginBottom:8,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                  <select style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,0.15)",fontSize:12}}>
                    <option>Default</option><option>Arial</option><option>Georgia</option><option>Impact</option>
                  </select>
                  <div style={{display:"flex",alignItems:"center",gap:2,border:"1px solid rgba(0,0,0,0.15)",borderRadius:6,overflow:"hidden"}}>
                    <button style={{padding:"4px 8px",background:"none",border:"none",cursor:"pointer",fontSize:14,fontWeight:700}}>−</button>
                    <input type="number" defaultValue={14} style={{width:36,textAlign:"center",border:"none",fontSize:13,padding:"3px 0"}} />
                    <button style={{padding:"4px 8px",background:"none",border:"none",cursor:"pointer",fontSize:14,fontWeight:700}}>+</button>
                  </div>
                  <button style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,0.15)",background:"none",cursor:"pointer",fontSize:15,fontWeight:900}}>B</button>
                  <button style={{padding:"5px 8px",borderRadius:6,border:"1px solid rgba(0,0,0,0.15)",background:"none",cursor:"pointer",fontSize:15,fontStyle:"italic"}}>/</button>
                  <div style={{display:"flex",border:"1px solid rgba(0,0,0,0.15)",borderRadius:6,overflow:"hidden"}}>
                    <button style={{padding:"5px 7px",background:"#001a6e",border:"none",cursor:"pointer",fontSize:12,color:"#fff"}}>≡←</button>
                    <button style={{padding:"5px 7px",background:"none",border:"none",cursor:"pointer",fontSize:12}}>≡</button>
                    <button style={{padding:"5px 7px",background:"none",border:"none",cursor:"pointer",fontSize:12}}>≡→</button>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:3}}>
                    <span style={{fontSize:11,fontWeight:700,color:"rgba(0,0,0,0.4)"}}>COLOR</span>
                    <input type="color" defaultValue="#000000" style={{width:24,height:24,border:"1px solid rgba(0,0,0,0.15)",borderRadius:4,cursor:"pointer",padding:0}} />
                  </div>
                </div>
                <textarea id="news-body" placeholder="Body / details (optional)" rows={4} style={{width:"100%",padding:"12px 14px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:15,fontFamily:"'Barlow',sans-serif",resize:"vertical",marginBottom:12}} />
                <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"end",marginBottom:12}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",marginBottom:4}}>Event Date (optional)</div>
                    <input type="date" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14}} />
                  </div>
                  <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:"10px 0"}}>
                    <input type="checkbox" /> <span style={{fontSize:13,fontWeight:600}}>📌 Pin to top</span>
                  </label>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",marginBottom:4}}>📅 Go Live At (optional)</div>
                    <input type="datetime-local" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14}} />
                    <div style={{fontSize:11,color:"rgba(0,0,0,0.3)",marginTop:2}}>Leave blank to post immediately</div>
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",marginBottom:4}}>😴 Auto-Expire At (optional)</div>
                    <input type="datetime-local" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14}} />
                    <div style={{fontSize:11,color:"rgba(0,0,0,0.3)",marginTop:2}}>Post removes itself automatically</div>
                  </div>
                </div>
                <button style={{width:"100%",padding:"14px",background:"#0057FF",border:"none",borderRadius:10,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",cursor:"pointer",letterSpacing:".06em"}}>Post to Site</button>
              </div>
              <div style={{fontSize:14,color:"rgba(0,0,0,0.35)",textAlign:"center",padding:20}}>No posts yet. Add your first announcement above.</div>
            </div>
          </Card>
          );
        })()}

        {/* Finances view */}
        {adminView === "finances" && (
          <Card>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>💰</span>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>Finances & Payments</div>
            </div>
            <div style={{padding:"20px"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
                <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"16px",textAlign:"center"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",marginBottom:4}}>Total Collected</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,color:"#166534"}}>$0</div>
                </div>
                <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"16px",textAlign:"center"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",marginBottom:4}}>Outstanding</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,color:"#991b1b"}}>$0</div>
                </div>
                <div style={{background:"#f8f9fb",border:"1px solid rgba(0,0,0,0.08)",borderRadius:10,padding:"16px",textAlign:"center"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",marginBottom:4}}>Teams Paid</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,color:"#111"}}>0/22</div>
                </div>
              </div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111",marginBottom:12}}>Team Payment Status</div>
              {Object.entries(divData||DIV).map(([dk,dv]) => (
                <div key={dk} style={{marginBottom:16}}>
                  <div style={{fontSize:13,fontWeight:700,color:dv.accent,marginBottom:6}}>Division {dk}</div>
                  {dv.teams.map(t => (
                    <div key={t.name} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(0,0,0,0.04)"}}>
                      <TLogo name={t.name} size={24} />
                      <span style={{flex:1,fontWeight:600,fontSize:14}}>{t.name}</span>
                      <span style={{fontSize:13,fontWeight:700,color:"#f59e0b",background:"rgba(245,158,11,0.1)",borderRadius:6,padding:"3px 10px"}}>Pending</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Contact Manager view */}
        {adminView === "contacts" && (
          <Card>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>📧</span>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>Contact Manager</div>
            </div>
            <div style={{padding:"20px"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:24}}>
                <button onClick={() => {}} style={{background:"#0057FF",color:"#fff",border:"none",borderRadius:10,padding:"16px",cursor:"pointer",textAlign:"left"}}>
                  <div style={{fontSize:20,marginBottom:4}}>📢</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,textTransform:"uppercase"}}>Email All Players</div>
                  <div style={{fontSize:12,opacity:0.7,marginTop:2}}>Send to every signed-up player</div>
                </button>
                <button onClick={() => {}} style={{background:"#001a6e",color:"#fff",border:"none",borderRadius:10,padding:"16px",cursor:"pointer",textAlign:"left"}}>
                  <div style={{fontSize:20,marginBottom:4}}>👥</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,textTransform:"uppercase"}}>Email All Managers</div>
                  <div style={{fontSize:12,opacity:0.7,marginTop:2}}>Send to every team captain</div>
                </button>
                <button onClick={() => {}} style={{background:"#15803d",color:"#fff",border:"none",borderRadius:10,padding:"16px",cursor:"pointer",textAlign:"left"}}>
                  <div style={{fontSize:20,marginBottom:4}}>🏟️</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,textTransform:"uppercase"}}>Email by Division</div>
                  <div style={{fontSize:12,opacity:0.7,marginTop:2}}>Send to a specific division</div>
                </button>
              </div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111",marginBottom:12}}>Email One Team</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8}}>
                {Object.entries(divData||DIV).flatMap(([dk,dv]) => dv.teams.map(t => (
                  <button key={t.name} onClick={() => {}} style={{display:"flex",alignItems:"center",gap:8,background:"#f8f9fb",border:"1px solid rgba(0,0,0,0.08)",borderRadius:8,padding:"10px 12px",cursor:"pointer",transition:"all .15s"}}
                    onMouseEnter={e => {e.currentTarget.style.background="rgba(0,87,255,0.06)";e.currentTarget.style.borderColor="#0057FF";}}
                    onMouseLeave={e => {e.currentTarget.style.background="#f8f9fb";e.currentTarget.style.borderColor="rgba(0,0,0,0.08)";}}>
                    <TLogo name={t.name} size={28} />
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,textTransform:"uppercase",color:"#111"}}>{t.name}</span>
                  </button>
                )))}
              </div>
              <div style={{fontSize:12,color:"rgba(0,0,0,0.3)",textAlign:"center",marginTop:16}}>Email functionality will connect to your sign-up data once Firebase quota resets</div>
            </div>
          </Card>
        )}

        {/* Scores view */}
        {adminView === "scores" && <>
        {/* Save confirmation */}
        {saveMsg && (
          <div style={{background:saveMsg.ok?"#f0fdf4":"#fef2f2",border:`1px solid ${saveMsg.ok?"#bbf7d0":"#fecaca"}`,borderRadius:10,padding:"12px 18px",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:14,fontWeight:600,color:saveMsg.ok?"#166534":"#991b1b"}}>{saveMsg.ok ? "✓" : "✗"} {saveMsg.text}</span>
            <button onClick={() => setSaveMsg(null)} style={{marginLeft:"auto",padding:"4px 12px",background:"none",border:`1px solid ${saveMsg.ok?"#bbf7d0":"#fca5a5"}`,borderRadius:6,color:saveMsg.ok?"#166534":"#dc2626",fontSize:12,cursor:"pointer"}}>Dismiss</button>
          </div>
        )}

        {/* Step 1: Pick a week */}
        <Card>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>1. Select Week</div>
          </div>
          <div style={{padding:"16px 20px"}}>
            {weeks.length === 0 ? (
              <div style={{fontSize:14,color:"rgba(0,0,0,0.4)"}}>{loading ? "Loading weeks..." : "No games found in Firebase."}</div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8}}>
                {weeks.map(wk => {
                  const wg = fbGames.filter(g => g.wk === wk);
                  const done = wg.filter(g => g.done).length;
                  const isActive = selWeek === wk;
                  return (
                    <button key={wk} onClick={() => { setSelWeek(wk); setSelGame(null); setAwayScore(""); setHomeScore(""); }}
                      style={{background:isActive?"rgba(0,87,255,0.08)":"#f8f9fb",border:`1px solid ${isActive?"#0057FF":"rgba(0,0,0,0.1)"}`,borderRadius:8,padding:"10px 12px",cursor:"pointer",textAlign:"left",transition:"all .15s"}}>
                      <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(0,0,0,0.4)"}}>WK {wk}</div>
                      <div style={{fontSize:15,fontWeight:700,color:"#111",marginTop:1}}>{wg[0]?.date || "—"}</div>
                      <div style={{fontSize:10,marginTop:2,color:done===wg.length?"#22c55e":done>0?"#f59e0b":"rgba(0,0,0,0.3)",fontWeight:700}}>{done}/{wg.length} done</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Step 2: Pick a game */}
        {selWeek !== null && (
          <Card>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>2. Select Game — Week {selWeek}</div>
            </div>
            <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:6}}>
              {weekGames.map(g => {
                const isActive = selGame?.id === g.id;
                return (
                  <button key={g.id} onClick={() => { setSelGame(g); setAwayScore(g.done ? String(g.away_score ?? "") : ""); setHomeScore(g.done ? String(g.home_score ?? "") : ""); setSaveMsg(null); setTimeout(() => document.getElementById('score-entry')?.scrollIntoView({behavior:'smooth'}), 100); }}
                    style={{background:isActive?"rgba(0,87,255,0.06)":"#f8f9fb",border:`1px solid ${isActive?"#0057FF":"rgba(0,0,0,0.1)"}`,borderRadius:8,padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,textAlign:"left",width:"100%",transition:"all .15s"}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,fontWeight:700,color:"#111"}}>{teamName(g.away)} vs {teamName(g.home)}</div>
                      <div style={{fontSize:12,color:"rgba(0,0,0,0.4)",marginTop:2}}>{g.time || ""} · {g.field || "TBD"}</div>
                    </div>
                    {g.done ? (
                      <span style={{fontSize:12,fontWeight:700,color:"#22c55e",background:"rgba(34,197,94,0.1)",borderRadius:4,padding:"2px 8px"}}>✓ {g.away_score}–{g.home_score}</span>
                    ) : (
                      <span style={{fontSize:12,fontWeight:700,color:"rgba(0,0,0,0.3)",background:"rgba(0,0,0,0.05)",borderRadius:4,padding:"2px 8px"}}>Pending</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* Step 3: Enter score */}
        {selGame && (
          <Card>
            <div id="score-entry" style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>3. Enter Score</div>
              {selGame.done && <div style={{fontSize:12,color:"#f59e0b",fontWeight:600,marginTop:4}}>This game already has a score. Saving will overwrite it.</div>}
            </div>
            <div style={{padding:"24px 20px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:16,alignItems:"center",maxWidth:500,margin:"0 auto"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:12,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(0,0,0,0.4)",marginBottom:8}}>Away</div>
                  <TLogo name={teamName(selGame.away)} size={112} />
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111",marginTop:8}}>{teamName(selGame.away)}</div>
                  <input type="number" min="0" max="99" placeholder="0" value={awayScore} onChange={e => setAwayScore(e.target.value)}
                    style={{width:88,fontSize:44,fontWeight:900,textAlign:"center",background:"#f8f9fb",border:"2px solid rgba(0,0,0,0.15)",borderRadius:10,color:"#111",padding:"6px",marginTop:10,outline:"none"}} />
                </div>
                <div style={{fontSize:20,fontWeight:700,color:"rgba(0,0,0,0.2)"}}>VS</div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:12,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(0,0,0,0.4)",marginBottom:8}}>Home</div>
                  <TLogo name={teamName(selGame.home)} size={112} />
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111",marginTop:8}}>{teamName(selGame.home)}</div>
                  <input type="number" min="0" max="99" placeholder="0" value={homeScore} onChange={e => setHomeScore(e.target.value)}
                    style={{width:88,fontSize:44,fontWeight:900,textAlign:"center",background:"#f8f9fb",border:"2px solid rgba(0,0,0,0.15)",borderRadius:10,color:"#111",padding:"6px",marginTop:10,outline:"none"}} />
                </div>
              </div>
              <button onClick={handleSave} disabled={saving}
                style={{display:"block",width:"100%",maxWidth:500,margin:"24px auto 0",padding:"14px",background:saving?"#94a3b8":"#0057FF",border:"none",borderRadius:8,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,textTransform:"uppercase",cursor:saving?"not-allowed":"pointer",letterSpacing:".06em",transition:"background .15s"}}>
                {saving ? "Saving..." : "Save Score & Update Standings"}
              </button>
            </div>
          </Card>
        )}
        </>}
      </div>
    </div>
  );
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("home");
  const [teamDetail, setTeamDetail] = useState(null);
  const { div, scores, sched, rosters, loading, live } = useLiveData();

  const allTeams = Object.entries(div).flatMap(([dk,d]) =>
    d.teams.map(t => ({...t, divKey:dk, divName:d.name, divAccent:d.accent}))
  );

  const handleSetTab = (t) => { setTab(t); setTeamDetail(null); };
  const handleTeamDetail = (name) => { setTeamDetail(name); setTab("teams"); };

  return (
    <div style={{minHeight:"100vh",fontFamily:"'Barlow',sans-serif",width:"100%",maxWidth:"100%",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body,#root{overflow-x:hidden;width:100%;max-width:100%;}
        body{background:#f2f4f8;color:#111;-webkit-font-smoothing:antialiased;position:relative;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes alertBlink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 10px rgba(255,215,0,0.2)}50%{box-shadow:0 0 25px rgba(255,215,0,0.5),0 0 50px rgba(255,215,0,0.2)}}
        @keyframes rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sparkle{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}
        .bracket-slot:hover{transform:scale(1.06)!important;box-shadow:0 4px 25px rgba(0,87,255,0.4)!important;border-color:rgba(255,215,0,0.6)!important}
        .bracket-game{animation:slideIn 0.6s ease forwards;opacity:0}
        .bracket-game:nth-child(1){animation-delay:0.1s}
        .bracket-game:nth-child(2){animation-delay:0.3s}
        .trophy-float{animation:float 3s ease-in-out infinite}
        .championship-glow{animation:glow 2s ease-in-out infinite}
        a{text-decoration:none;}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#f2f4f8}
        ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:3px}
        .standings-table{overflow-x:auto;-webkit-overflow-scrolling:touch;}
        .mobile-standings{display:none;}
        .desktop-standings{display:block;}
        @media(max-width:700px){
          .home-two-col{grid-template-columns:1fr!important;}
          .team-detail-grid{grid-template-columns:1fr!important;}
          .sidebar-standings{display:none!important;}
          .scores-grid{grid-template-columns:1fr!important;}
          .schedule-grid{grid-template-columns:1fr!important;}
          .desktop-nav{display:none!important;}
          .hamburger{display:flex!important;}
          .mobile-standings{display:block!important;}
          .desktop-standings{display:none!important;}
        }
      `}</style>
      <div style={{position:"relative",zIndex:200,overflow:"hidden",width:"100%"}}><Ticker setTab={handleSetTab} sched={sched} allTeams={allTeams} scores={scores} /></div>
      <div style={{position:"sticky",top:0,zIndex:300,width:"100%"}}><Navbar tab={tab} setTab={handleSetTab} /></div>
      {tab==="home"      && <HomePage setTab={handleSetTab} setTeamDetail={handleTeamDetail} allTeams={allTeams} scores={scores} sched={sched} div={div} />}
      {tab==="scores"    && <ScoresPage setTab={handleSetTab} setTeamDetail={handleTeamDetail} scores={scores} allTeams={allTeams} sched={sched} />}
      {tab==="schedule"  && <SchedulePage setTab={handleSetTab} setTeamDetail={handleTeamDetail} sched={sched} allTeams={allTeams} scores={scores} divData={div} />}
      {tab==="standings" && <StandingsPage setTab={handleSetTab} setTeamDetail={handleTeamDetail} div={div} />}
      {tab==="teams"     && !teamDetail && <TeamsPage setTab={handleSetTab} setTeamDetail={handleTeamDetail} div={div} allTeams={allTeams} />}
      {tab==="teams"     && teamDetail  && <TeamDetailPage teamName={teamDetail} onBack={() => { setTeamDetail(null); window.scrollTo(0,0); }} setTab={handleSetTab} setTeamDetail={handleTeamDetail} div={div} allTeams={allTeams} scores={scores} sched={sched} rosters={rosters} />}
      {tab==="gallery"   && <GalleryPage />}
      {tab==="subs"      && <SubBoardPage />}
      {tab==="umpires"   && <UmpirePage />}
      {tab==="registration" && <div style={{minHeight:"100vh",background:"#f2f4f8"}}><PageHero label="LASSL" title="Online Registration" /><div style={{maxWidth:800,margin:"0 auto",padding:"40px 20px",textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>📝</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:28,color:"#111",marginBottom:8}}>Coming Soon</div><div style={{fontSize:16,color:"rgba(0,0,0,0.45)"}}>Online registration for the upcoming season will be available here. Check back soon!</div></div></div>}
      {tab==="waiver"    && <div style={{minHeight:"100vh",background:"#f2f4f8"}}><PageHero label="LASSL" title="Waiver Form" /><div style={{maxWidth:800,margin:"0 auto",padding:"40px 20px",textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>📋</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:28,color:"#111",marginBottom:8}}>Coming Soon</div><div style={{fontSize:16,color:"rgba(0,0,0,0.45)"}}>One will be posted for the next season soon.</div></div></div>}
      {tab==="board"     && <div style={{minHeight:"100vh",background:"#f2f4f8"}}>
        <PageHero label="LASSL" title="Board" />
        <div style={{maxWidth:800,margin:"0 auto",padding:"32px clamp(12px,3vw,40px) 60px"}}>
          <Card>
            <div style={{padding:"32px clamp(16px,3vw,40px)"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                <div style={{width:4,height:32,background:"#0057FF",borderRadius:2}} />
                <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:28,textTransform:"uppercase",color:"#111"}}>League Leadership</h2>
              </div>
              <p style={{fontSize:16,color:"rgba(0,0,0,0.6)",lineHeight:1.8,marginBottom:24}}>
                Synagogue Softball is an LLC. The Board is responsible for every detail ensuring that our league runs smoothly and effectively. The Board is comprised of the following members and should be contacted by your team's manager if any issues arise during your game. Each member of the Board is responsible for various facets of the league.
              </p>
              <div style={{background:"rgba(0,87,255,0.04)",border:"1px solid rgba(0,87,255,0.1)",borderRadius:12,padding:"16px 20px",marginBottom:28,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>✉️</span>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"rgba(0,0,0,0.4)",textTransform:"uppercase",letterSpacing:".06em"}}>Contact the Board</div>
                  <a href="mailto:ssoftball2022@gmail.com" style={{fontSize:18,fontWeight:700,color:"#0057FF",textDecoration:"none"}}>ssoftball2022@gmail.com</a>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {[
                  {name:"Avery Krut",role:"Board Member"},
                  {name:"Marc Canter",role:"Board Member"},
                  {name:"Ron Kalbrosky",role:"Board Member"},
                  {name:"Josh Enbom",role:"Website"},
                  {name:"Chris Miller",role:"Website"},
                ].map((m,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 0",borderBottom:i<4?"1px solid rgba(0,0,0,0.06)":"none"}}>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:"#111",textTransform:"uppercase"}}>{m.name}</div>
                      <div style={{fontSize:13,color:"rgba(0,0,0,0.4)",fontWeight:600}}>{m.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>}
      {tab==="signup"    && <SignUpPage allTeams={allTeams} />}
      {tab==="captain"   && <CaptainPage />}
      {tab==="admin"     && <AdminPage />}
      {tab==="rules"     && <RulesPage />}
      <Footer setTab={handleSetTab} />
    </div>
  );
}
