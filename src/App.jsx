import { useState, useEffect } from "react";

const L_LEAGUE = "/league2.png";
const L_VBS    = "/2.png";
const L_AAE    = "/3.png";
const L_EMAN   = "/4.png";
const L_ISAIAH = "/5.png";

const TEAM_LOGOS = {
  "VBS": L_VBS, "AAE A's": L_AAE, "AAE Menchwarmers": L_AAE,
  "AAE Mensch Warmers": L_AAE, "Emmanuel": L_EMAN,
  "Emanuel": L_EMAN, "Isaiah-Nouveau": L_ISAIAH, "Isaiah Nouveau": L_ISAIAH,
};

const DIV = {
  A:{ name:"Division A", accent:"#1d4ed8",
    teams:[
      {seed:1,name:"VBS",full:"Valley Beth Shalom",w:5,l:1,t:0,pct:".833",gp:6,rs:83,ra:23,diff:"+60"},
      {seed:2,name:"AAE A's",full:"Anshei Am Echad A's",w:4,l:2,t:0,pct:".667",gp:6,rs:71,ra:51,diff:"+20"},
      {seed:3,name:"Emmanuel",full:"Emmanuel",w:1,l:5,t:0,pct:".167",gp:6,rs:60,ra:77,diff:"-17"},
      {seed:4,name:"Isaiah-Nouveau",full:"Isaiah Nouveau",w:1,l:5,t:0,pct:".167",gp:6,rs:58,ra:97,diff:"-39"},
    ]},
  B:{ name:"Division B", accent:"#15803d",
    teams:[
      {seed:1,name:"Akiba-Blue",full:"Akiba-Blue",w:5,l:1,t:0,pct:".833",gp:6,rs:83,ra:62,diff:"+21"},
      {seed:2,name:"Uni/Beth Hillel",full:"Uni/Beth Hillel",w:4,l:2,t:0,pct:".667",gp:6,rs:63,ra:68,diff:"-15"},
      {seed:3,name:"Bagel Dawgs",full:"Bagel Dawgs",w:4,l:2,t:0,pct:".667",gp:6,rs:66,ra:50,diff:"+16"},
      {seed:4,name:"Hamakom-Epstein",full:"Hamakom-Epstein",w:0,l:6,t:0,pct:".000",gp:6,rs:34,ra:90,diff:"-56"},
    ]},
  C:{ name:"Division C", accent:"#b45309",
    teams:[
      {seed:1,name:"LBT",full:"LBT",w:4,l:0,t:1,pct:".900",gp:5,rs:84,ra:41,diff:"+43"},
      {seed:2,name:"TIOH",full:"TIOH",w:3,l:1,t:2,pct:".667",gp:6,rs:103,ra:86,diff:"+17"},
      {seed:3,name:"Or Ami",full:"Or Ami",w:1,l:4,t:1,pct:".250",gp:6,rs:52,ra:105,diff:"-53"},
      {seed:4,name:"Judea",full:"Judea",w:1,l:4,t:0,pct:".200",gp:5,rs:78,ra:85,diff:"-7"},
    ]},
  D:{ name:"Division D", accent:"#6d28d9",
    teams:[
      {seed:1,name:"Hamakom-Miller",full:"Hamakom-Miller",w:3,l:2,t:0,pct:".600",gp:5,rs:81,ra:70,diff:"+11"},
      {seed:2,name:"Akiba-Red",full:"Akiba-Red",w:3,l:2,t:0,pct:".600",gp:5,rs:54,ra:58,diff:"-4"},
      {seed:3,name:"Beth Am",full:"Beth Am",w:3,l:3,t:0,pct:".500",gp:6,rs:75,ra:75,diff:"0"},
      {seed:4,name:"Santa Monica",full:"Santa Monica",w:3,l:3,t:0,pct:".500",gp:6,rs:114,ra:85,diff:"+29"},
      {seed:5,name:"Kehillat Israel",full:"Kehillat Israel",w:3,l:3,t:0,pct:".500",gp:6,rs:69,ra:92,diff:"-23"},
      {seed:6,name:"Isaiah OG's",full:"Isaiah OG's",w:2,l:4,t:0,pct:".400",gp:6,rs:79,ra:92,diff:"-13"},
    ]},
  E:{ name:"Division E", accent:"#be123c",
    teams:[
      {seed:1,name:"AAE Menchwarmers",full:"AAE Menchwarmers",w:6,l:0,t:0,pct:"1.000",gp:6,rs:80,ra:43,diff:"+37"},
      {seed:2,name:"Beth Am/Sinai/Ikar",full:"Beth Am/Sinai/Ikar",w:4,l:2,t:0,pct:".667",gp:6,rs:74,ra:31,diff:"+43"},
      {seed:3,name:"Sinai Swingers",full:"Sinai Swingers",w:2,l:4,t:0,pct:".333",gp:6,rs:81,ra:81,diff:"0"},
      {seed:4,name:"Beth Shir Shalom",full:"Beth Shir Shalom",w:0,l:6,t:0,pct:".000",gp:6,rs:11,ra:91,diff:"-80"},
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
          sched: liveSched.length > 0 ? liveSched : SCHED,
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

const TEAM_ROSTERS = {
  "VBS": ["David Cohen","Mike Levine","Aaron Goldberg","Josh Weiss","Sam Friedman","Danny Klein","Ben Marcus","Tom Shapiro","Eric Rosen","Ari Silver","Noah Blum","Jake Stern"],
  "AAE A's": ["Rob Katz","Phil Segal","Mark Green","Steve Bloom","Jeff Rubin","Adam Levy","Brian Jacobs","Scott Hoffman","Dan Weiner","Craig Newman","Larry Fox"],
  "Emmanuel": ["Paul Berg","Rick Gold","Gary Lerner","Neil Simon","Hank Abrams","Ira Goodman","Ken Wolff","Mel Diamond","Alan Gross","Sid Fisher","Burt Kaplan"],
  "Isaiah-Nouveau": ["Evan Cohen","Jordan Levy","Tyler Blum","Mason Green","Caleb Stern","Lucas Klein","Ethan Rubin","Noah Wolf","Alex Marcus","Ryan Gold","Zach Berg"],
};

const SCORES = [
  {week:"Week 6 – March 1",games:[
    {away:"Bagel Dawgs",aScore:11,home:"Emanuel",hScore:9,div:"A/B"},
    {away:"Akiba-Blue",aScore:7,home:"AAE A's",hScore:0,div:"A/B",note:"Forfeit"},
    {away:"Uni/Beth Hillel",aScore:10,home:"VBS",hScore:5,div:"A/B"},
    {away:"Isaiah Nouveau",aScore:10,home:"Hamakon-Epstein",hScore:9,div:"A/B"},
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
    {away:"SMS",aScore:28,home:"KI",hScore:18,div:"D"},
    {away:"Beth Am",aScore:23,home:"Santa Monica",hScore:13,div:"D"},
    {away:"AAE Mensch Warmers",aScore:16,home:"Sinai Swingers",hScore:11,div:"E"},
    {away:"Beth Am/Sinai/Ikar",aScore:7,home:"Beth Shir Shalom",hScore:0,div:"E",note:"Forfeit"},
  ]},
  {week:"Week 4 – Feb 8",games:[
    {away:"AAE A's",aScore:21,home:"Uni/Beth Hillel",hScore:8,div:"A/B"},
    {away:"VBS",aScore:19,home:"Hamakom-Epstein",hScore:0,div:"A/B"},
    {away:"Bagel Dawgs",aScore:11,home:"Isaiah Nouveau",hScore:10,div:"A/B"},
    {away:"Akiba-Blue",aScore:19,home:"Emmanuel",hScore:16,div:"A/B"},
    {away:"LBT",aScore:17,home:"Judea",hScore:11,div:"C"},
    {away:"Beth Am",aScore:23,home:"Santa Monica",hScore:13,div:"D"},
    {away:"AAE Mensch Warmers",aScore:16,home:"Beth Am/Sinai/Ikar",hScore:10,div:"E"},
    {away:"Sinai Swingers",aScore:24,home:"Beth Shir Shalom",hScore:3,div:"E"},
  ]},
  {week:"Week 3 – Feb 1",games:[
    {away:"VBS",aScore:13,home:"Emmanuel",hScore:3,div:"A"},
    {away:"AAE A's",aScore:27,home:"Isaiah Nouveau",hScore:10,div:"A"},
    {away:"Uni/Beth Hillel",aScore:8,home:"Bagel Dawgs",hScore:4,div:"B"},
    {away:"Akiba-Blue",aScore:18,home:"Hamakom-Epstein",hScore:5,div:"B"},
    {away:"LBT",aScore:18,home:"TIOH",hScore:18,div:"C"},
    {away:"Beth Am",aScore:18,home:"Hamakom-Miller",hScore:17,div:"D"},
  ]},
  {week:"Week 2 – Jan 25",games:[
    {away:"VBS",aScore:10,home:"AAE A's",hScore:3,div:"A"},
    {away:"Emmanuel",aScore:18,home:"Isaiah Nouveau",hScore:14,div:"A"},
    {away:"Bagel Dawgs",aScore:22,home:"Hamakom-Epstein",hScore:2,div:"B"},
    {away:"Akiba-Blue",aScore:21,home:"Uni/Beth Hillel",hScore:16,div:"B"},
    {away:"TIOH",aScore:23,home:"Judea",hScore:18,div:"C"},
    {away:"LBT",aScore:10,home:"Or Ami",hScore:7,div:"C"},
    {away:"SMS",aScore:23,home:"Akiba-Red",hScore:5,div:"D"},
  ]},
  {week:"Week 1 – Jan 18",games:[
    {away:"AAE A's",aScore:8,home:"Emanuel",hScore:5,div:"A"},
    {away:"VBS",aScore:16,home:"Isaiah Nouveau",hScore:3,div:"A"},
    {away:"Bagel Dawgs",aScore:14,home:"Akiba-Blue",hScore:1,div:"B"},
    {away:"TIOH",aScore:18,home:"Or Ami",hScore:4,div:"C"},
    {away:"LBT",aScore:18,home:"Judea",hScore:4,div:"C"},
    {away:"Hamakom-Miller",aScore:14,home:"Santa Monica",hScore:12,div:"D"},
    {away:"Akiba Red",aScore:11,home:"Beth Am",hScore:2,div:"D"},
    {away:"AAE Mensch Warmers",aScore:8,home:"Beth Am/Sinai/Ikar",hScore:2,div:"E"},
  ]},
];

const SCHED = [
  { label:"Week 10 – Mar 22", fields:[
    {name:"Cheviot Hills #1",games:[{time:"9:00 AM",away:"Sinai Swingers",home:"Beth Shir Shalom"},{time:"11:00 AM",away:"SMS",home:"Kehillat Israel"}]},
    {name:"Cheviot Hills #3",games:[{time:"9:00 AM",away:"Beth Am",home:"Isaiah OGs"},{time:"11:00 AM",away:"AAE A's",home:"Isaiah Nouveau"}]},
    {name:"Sepulveda Basin #2",games:[{time:"9:00 AM",away:"Uni/Beth Hillel",home:"Bagel Dawgs"},{time:"11:00 AM",away:"Beth Am/Sinai/Ikar",home:"AAE Mensch Warmers"}]},
    {name:"Sepulveda Basin #3",games:[{time:"9:00 AM",away:"TIOH",home:"Or Ami"},{time:"11:00 AM",away:"LBT",home:"Judea"}]},
    {name:"Sepulveda Basin #4",games:[{time:"9:00 AM",away:"VBS",home:"Emanuel"},{time:"11:00 AM",away:"Hamakom-Miller",home:"Akiba-Red"},{time:"1:00 PM",away:"Akiba-Blue",home:"Hamakom-Epstein"}]},
  ]},
  { label:"Week 11 – Mar 29", fields:[
    {name:"Cheviot Hills #1",games:[{time:"9:00 AM",away:"Isaiah OGs",home:"Kehillat Israel"},{time:"11:00 AM",away:"Isaiah Nouveau",home:"VBS"}]},
    {name:"Cheviot Hills #3",games:[{time:"9:00 AM",away:"Beth Shir Shalom",home:"Beth Am/Sinai/Ikar"},{time:"11:00 AM",away:"Beth Am",home:"Akiba-Red"}]},
    {name:"Sepulveda Basin #2",games:[{time:"9:00 AM",away:"Or Ami",home:"LBT"},{time:"11:00 AM",away:"Judea",home:"TIOH"}]},
    {name:"Sepulveda Basin #3",games:[{time:"9:00 AM",away:"AAE Mensch Warmers",home:"Sinai Swingers"},{time:"11:00 AM",away:"AAE A's",home:"Emanuel"}]},
    {name:"Sepulveda Basin #4",games:[{time:"9:00 AM",away:"Akiba-Blue",home:"Bagel Dawgs"},{time:"11:00 AM",away:"Hamakom-Miller",home:"SMS"},{time:"1:00 PM",away:"Hamakom-Epstein",home:"Uni/Beth Hillel"}]},
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
    "Home team is responsible for field preparation (raking bases, lining if needed).",
    "In case of rain, the league coordinator will notify managers by 8:00 AM on game day.",
    "Rainouts will be rescheduled at the discretion of the league coordinator.",
    "Games cannot be rescheduled by teams unilaterally — contact the league coordinator.",
    "LASSL fields: Mar Vista Recreation Center, Cheviot Hills Park, Hjelte Athletic Center, Sepulveda Basin.",
  ]},
  {section:"Playoffs",icon:"🏆",items:[
    "Top teams from each division qualify for playoffs.",
    "Playoff seeding is determined by win percentage, then run differential.",
    "Ties are broken by: 1) head-to-head record, 2) run differential, 3) coin flip.",
    "All playoff games must be played to completion — no time limit.",
    "Playoff rosters are frozen one week before playoff start.",
  ]},
];

/* ─── SHARED COMPONENTS ─────────────────────────────────────────────────── */
function TLogo({ name, size=80 }) {
  const src = TEAM_LOGOS[name];
  if (src) return (
    <div style={{width:size,height:size,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <img src={src} alt={name} style={{width:size*2,height:size*2,objectFit:"contain",display:"block",flexShrink:0}} />
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
        {label && <div style={{fontSize:11,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0057FF",marginBottom:4}}>{label}</div>}
        <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(36px,7vw,80px)",textTransform:"uppercase",color:"#111",lineHeight:1}}>{title}</h1>
        {subtitle && <div style={{fontSize:12,color:"rgba(0,0,0,0.38)",marginTop:4}}>{subtitle}</div>}
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

const FAKE_RECAPS = {
  default: (away, aScore, home, hScore) => {
    const winner = aScore > hScore ? away : home;
    const loser = aScore > hScore ? home : away;
    const winScore = Math.max(aScore, hScore);
    const loseScore = Math.min(aScore, hScore);
    const margin = winScore - loseScore;
    const intros = [
      `In a ${margin <= 2 ? "nail-biting finish" : margin >= 10 ? "dominant performance" : "solid outing"}, ${winner} took care of business against ${loser}, ${winScore}–${loseScore}.`,
      `${winner} left no doubt on Saturday, dispatching ${loser} by a score of ${winScore}–${loseScore}.`,
      `It was all ${winner} from the first pitch, as they cruised past ${loser} ${winScore}–${loseScore}.`,
    ];
    const middles = [
      `The offense came alive in the middle innings, stringing together hits and capitalizing on a pair of errors. The defense held firm when it mattered most.`,
      `A big third inning proved to be the difference, as ${winner} sent eight batters to the plate and never looked back. ${loser} mounted a late rally but couldn't close the gap.`,
      `Timely hitting was the story of the day. ${winner} went 6-for-12 with runners in scoring position, while ${loser} left several key opportunities stranded on the bases.`,
    ];
    const outros = [
      `${winner} improves their division record and stays in the hunt for a top playoff seed. ${loser} will look to bounce back next week.`,
      `With the win, ${winner} moves up in the division standings. Both teams are back in action next Saturday at Cheviot Hills.`,
      `A well-earned victory for ${winner}. Coach praised the team's focus and energy throughout the game.`,
    ];
    const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];
    return `${pick(intros)} ${pick(middles)} ${pick(outros)}`;
  }
};

function FinalCard({ g, onTeamClick }) {
  const [showRecap, setShowRecap] = useState(false);
  const aWin = g.aScore > g.hScore, hWin = g.hScore > g.aScore;
  const recap = FAKE_RECAPS.default(g.away, g.aScore, g.home, g.hScore);
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
                  <TLogo name={side.name} size={56} />
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
      <div style={{background:"#fff",border:"1px solid rgba(0,0,0,0.09)",borderTop:"3px solid #0057FF",borderRadius:10,overflow:"hidden",display:"flex",flexDirection:"column",width:"100%"}}>
        <div style={{padding:"8px 10px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(0,0,0,0.25)"}}>FINAL</span>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {g.note && <span style={{fontSize:9,fontWeight:700,color:"#dc2626",textTransform:"uppercase"}}>{g.note}</span>}
            <span style={{fontSize:9,fontWeight:700,color:"rgba(0,0,0,0.2)",textTransform:"uppercase"}}>{g.div}</span>
          </div>
        </div>
        <div style={{padding:"6px 10px 10px"}}>
          {[{name:g.away,score:g.aScore,won:aWin},{name:g.home,score:g.hScore,won:hWin}].map((side,i) => (
            <div key={i} onClick={() => onTeamClick?.(side.name)} style={{display:"flex",alignItems:"center",gap:8,marginBottom:i===0?6:0,cursor:onTeamClick?"pointer":"default",width:"100%"}}>
              <TLogo name={side.name} size={80} />
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:side.won?900:600,fontSize:18,textTransform:"uppercase",color:side.won?"#111":"rgba(0,0,0,0.28)",lineHeight:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,minWidth:0}}>
                {side.name}
              </div>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:side.won?900:400,fontSize:36,lineHeight:1,color:side.won?"#111":"rgba(0,0,0,0.22)",flexShrink:0,minWidth:32,textAlign:"right"}}>{side.score}</span>
            </div>
          ))}
        </div>
        <div style={{height:1,background:"rgba(0,0,0,0.05)"}} />
        <div onClick={() => setShowRecap(true)} style={{padding:"10px",background:"#0057FF",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,letterSpacing:".06em",textTransform:"uppercase",color:"#fff",textAlign:"center",cursor:"pointer"}}>📰 RECAP</div>
      </div>
    </>
  );
}

function UpcomingCard({ away, home, time, date, field, isNext, onTeamClick }) {
  return (
    <div style={{background:"#fff",border:"1px solid rgba(0,0,0,0.09)",borderTop:"3px solid #0057FF",borderLeft:isNext?"4px solid #0057FF":"1px solid rgba(0,0,0,0.09)",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
      <div style={{display:"flex",alignItems:"center",padding:"12px 14px",gap:12,flexWrap:"wrap"}}>
        {/* Teams */}
        <div style={{display:"flex",flexDirection:"column",gap:8,flex:"1 1 200px",minWidth:0}}>
          {isNext && <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#0057FF",marginBottom:-2}}>▶ NEXT GAME</div>}
          {[away,home].map((t,i) => (
            <div key={i} onClick={() => onTeamClick?.(t)} style={{display:"flex",alignItems:"center",gap:10,cursor:onTeamClick?"pointer":"default"}}>
              <TLogo name={t} size={60} />
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(14px,2vw,24px)",textTransform:"uppercase",color:"#111",lineHeight:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t}</div>
            </div>
          ))}
        </div>
        {/* Time + field stacked */}
        <div style={{flexShrink:0,borderLeft:"1px solid rgba(0,0,0,0.08)",paddingLeft:14}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(20px,3vw,32px)",color:"#0057FF",lineHeight:1}}>{time}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(12px,1.5vw,15px)",color:"rgba(0,0,0,0.55)",fontWeight:700,marginTop:3}}>{date}</div>
          <div style={{fontSize:"clamp(11px,1.2vw,13px)",color:"rgba(0,0,0,0.4)",marginTop:2,fontWeight:500}}>{field}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── TICKER ─────────────────────────────────────────────────────────────── */
function Ticker({ setTab, sched }) {
  const fields = sched[0]?.fields || [];
  const games = fields.flatMap(f => f.games.map(g => ({...g, field:f.name})));
  return (
    <div style={{background:"#001a6e",borderBottom:"2px solid #0057FF",display:"flex",alignItems:"stretch",overflow:"hidden",width:"100%",position:"relative"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"0 12px",borderRight:"1px solid rgba(255,255,255,0.15)",flexShrink:0}}>
        <img src={L_LEAGUE} alt="LASSL" style={{height:28,width:28,objectFit:"cover",borderRadius:"50%"}} />
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,letterSpacing:".1em",textTransform:"uppercase",color:"#FFD700"}}>LASSL</span>
      </div>
      <div style={{display:"flex",alignItems:"stretch",overflowX:"auto",overflowY:"hidden",scrollbarWidth:"none",msOverflowStyle:"none",flex:"1 1 0",minWidth:0,WebkitOverflowScrolling:"touch"}}>
        {games.map((g,i) => (
          <div key={i} style={{display:"flex",flexDirection:"column",justifyContent:"center",padding:"5px 12px",borderRight:"1px solid rgba(255,255,255,0.1)",flexShrink:0,gap:2}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:".08em",color:"#ff6b6b",textTransform:"uppercase",whiteSpace:"nowrap"}}>{g.time}</div>
            {[g.away,g.home].map((t,j) => (
              <div key={j} style={{display:"flex",alignItems:"center",gap:5}}>
                <TLogo name={t} size={14} />
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
  );
}

/* ─── NAVBAR ─────────────────────────────────────────────────────────────── */
function Navbar({ tab, setTab }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [["home","Home"],["scores","Scores"],["schedule","Schedule"],["standings","Standings"],["teams","Teams"],["subs","Sub Board"],["rules","Rules"],["admin","⚙ Admin"]];
  const handleNav = (id) => { setTab(id); setMenuOpen(false); window.scrollTo(0,0); };
  return (
    <>
      <nav style={{background:"#fff",borderBottom:"3px solid #0057FF",boxShadow:"0 1px 6px rgba(0,0,0,0.07)",height:62,display:"flex",alignItems:"center",padding:"0 clamp(12px,3vw,32px)",position:"relative",zIndex:400}}>
        <div style={{maxWidth:1400,margin:"0 auto",width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",flexShrink:0}} onClick={() => handleNav("home")}>
            <img src={L_LEAGUE} alt="LASSL" style={{height:38,width:38,objectFit:"cover",borderRadius:"50%",border:"2px solid #0057FF"}} />
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,letterSpacing:".08em",textTransform:"uppercase",color:"#0057FF",lineHeight:1}}>LASSL</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:"rgba(0,0,0,0.4)",letterSpacing:".04em",lineHeight:1}}>Los Angeles Synagogue Softball</div>
            </div>
          </div>
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
          </div>
          <div style={{flex:1,background:"rgba(0,0,0,0.3)"}} onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </>
  );
}

/* ─── HOME PAGE ──────────────────────────────────────────────────────────── */
function HomePage({ setTab, setTeamDetail, allTeams, scores, sched }) {
  const topTeams = [...allTeams].sort((a,b) => parseFloat(b.pct) - parseFloat(a.pct)).slice(0,8);
  const fields = sched[0]?.fields || [];
  const nextGames = fields.flatMap(f => f.games.map(g => ({...g,field:f.name}))).slice(0,5);
  const recent = scores[0]?.games || [];
  const goTeam = (name) => { setTeamDetail(name); setTab("teams"); window.scrollTo(0,0); };
  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      {/* HERO */}
      <div style={{width:"100%",background:"#001a6e",position:"relative",overflow:"hidden",borderBottom:"4px solid #0057FF"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,87,255,0.3) 0%, transparent 70%)",pointerEvents:"none"}} />
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 20px 18px",position:"relative",textAlign:"center"}}>
          <img src={L_LEAGUE} alt="LASSL" style={{
            width:"min(140px,35vw)", height:"min(140px,35vw)",
            objectFit:"cover", objectPosition:"center",
            borderRadius:"50%",
            border:"3px solid rgba(0,87,255,0.7)",
            boxShadow:"0 0 40px rgba(0,87,255,0.55)",
            marginBottom:12,
          }} />
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(28px,4vw,52px)",textTransform:"uppercase",letterSpacing:".04em",color:"#fff",lineHeight:1}}>
            Los Angeles<br/><span style={{color:"#FFD700"}}>Synagogue Softball</span>
          </div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(10px,1.2vw,13px)",fontWeight:600,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",marginTop:6,marginBottom:10}}>
            Celebrating 30 Years · 1995–2026 · est. 5755
          </div>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,215,0,0.15)",border:"1px solid rgba(255,215,0,0.45)",borderRadius:30,padding:"5px 16px"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",display:"inline-block",flexShrink:0,boxShadow:"0 0 6px #22c55e"}} />
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:"#FFD700",letterSpacing:".08em",textTransform:"uppercase"}}>
              🏆 Playoffs Underway — Akiba-Red wins D Division!
            </span>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1400,margin:"0 auto",padding:"28px clamp(12px,3vw,40px) 60px"}}>
        <div className="home-two-col" style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:32,alignItems:"start"}}>
          <div>
            <div style={{marginBottom:32}}>
              <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0057FF",marginBottom:4}}>2026 Season</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:34,textTransform:"uppercase",color:"#111",lineHeight:1}}>Recent Results</h2>
                </div>
                <span onClick={() => setTab("scores")} style={{color:"#0057FF",fontWeight:700,fontSize:13,cursor:"pointer",textDecoration:"none"}}>All Scores →</span>
              </div>
              <div className="scores-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10,gridAutoRows:"1fr"}}>
                {recent.slice(0,6).map((g,i) => <FinalCard key={i} g={g} onTeamClick={goTeam} />)}
              </div>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0057FF",marginBottom:4}}>On Deck</div>
                  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:34,textTransform:"uppercase",color:"#111",lineHeight:1}}>Upcoming</h2>
                </div>
                <span onClick={() => setTab("schedule")} style={{color:"#0057FF",fontWeight:700,fontSize:13,cursor:"pointer"}}>Full Schedule →</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {nextGames.map((g,i) => <UpcomingCard key={i} away={g.away} home={g.home} time={g.time} date="Mar 22" onTeamClick={goTeam} field={g.field} isNext={i===0} />)}
              </div>
            </div>
          </div>

          {/* Standings sidebar - hidden on mobile */}
          <div style={{position:"sticky",top:72}} className="sidebar-standings">
            <Card style={{boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
              <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>Standings</span>
                <span onClick={() => setTab("standings")} style={{color:"#0057FF",fontSize:13,fontWeight:700,cursor:"pointer"}}>Full →</span>
              </div>
              {topTeams.map((t,i) => (
                <div key={t.name+t.divKey} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:"1px solid rgba(0,0,0,0.04)",transition:"background .15s",cursor:"pointer"}}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(0,87,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:"#0057FF",width:22,textAlign:"center",flexShrink:0}}>{i+1}</span>
                  <TLogo name={t.name} size={110} />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:16,color:"#111",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"'Barlow Condensed',sans-serif",textTransform:"uppercase"}}>{t.name}</div>
                    <div style={{fontSize:11,color:"rgba(0,0,0,0.38)"}}>{t.divName}</div>
                  </div>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:"#111",flexShrink:0}}>{t.w}-{t.l}</span>
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
function ScoresPage({ setTab, setTeamDetail, scores }) {
  const [wk,setWk] = useState(0);
  const goTeam = (name) => { setTeamDetail(name); setTab("teams"); window.scrollTo(0,0); };
  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      <PageHero label="2026 Season" title="Scores">
        <TabBar items={scores.map(s=>s.week)} active={wk} onChange={setWk} />
      </PageHero>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"24px clamp(12px,3vw,40px) 60px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(300px,100%),1fr))",gap:12}}>
          {(scores[wk]?.games || []).map((g,i) => <FinalCard key={i} g={g} onTeamClick={goTeam} />)}
        </div>
      </div>
    </div>
  );
}

/* ─── SCHEDULE PAGE ───────────────────────────────────────────────────────── */
function SchedulePage({ setTab, setTeamDetail, sched }) {
  const [wk,setWk] = useState(0);
  const week = sched[wk] || { label: "", fields: [] };
  const games = (week.fields || []).flatMap(f => f.games.map(g => ({...g,field:f.name})));
  const dateStr = week.label.split("–")[1]?.trim()||"";
  const goTeam = (name) => { setTeamDetail(name); setTab("teams"); window.scrollTo(0,0); };
  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      <PageHero label="2026 Season" title="Schedule" subtitle="Away team first (1B dugout) · Home team second (3B dugout)">
        <TabBar items={sched.map(s=>s.label)} active={wk} onChange={setWk} />
      </PageHero>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"24px clamp(12px,3vw,40px) 60px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {games.map((g,i) => <UpcomingCard key={i} away={g.away} home={g.home} time={g.time} date={dateStr} onTeamClick={goTeam} field={g.field} isNext={i===0} />)}
        </div>
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
            <TLogo name={t.name} size={80} />
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
        <Card style={{boxShadow:"0 2px 8px rgba(0,0,0,0.05)",minWidth:"unset"}}>
          <div style={{display:"grid",gridTemplateColumns:"50px minmax(300px,1fr) 60px 60px 60px 80px 60px 60px 60px 70px",padding:"10px 20px",background:"#f8f9fb",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
            {["#","Team","W","L","T","PCT","GP","RS","RA","DIFF"].map((h,i) => (
              <span key={h} style={{fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(0,0,0,0.3)",textAlign:i>1?"center":"left"}}>{h}</span>
            ))}
          </div>
          {div.teams.map((t,i) => (
            <div key={t.name} onClick={() => goTeam(t.name)} style={{display:"grid",gridTemplateColumns:"50px minmax(300px,1fr) 60px 60px 60px 80px 60px 60px 60px 70px",padding:"14px 20px",borderBottom:"1px solid rgba(0,0,0,0.04)",alignItems:"center",transition:"background .15s",cursor:"pointer"}}
              onMouseEnter={e => e.currentTarget.style.background="rgba(0,87,255,0.03)"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:30,color:i===0?"#0057FF":"rgba(0,0,0,0.22)"}}>{t.seed}</span>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <TLogo name={t.name} size={130} />
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:38,textTransform:"uppercase",color:"#111",lineHeight:1}}>{t.name}</div>
                  <div style={{height:3,width:120,background:"rgba(0,0,0,0.07)",borderRadius:2,marginTop:6,overflow:"hidden"}}>
                    <div style={{height:"100%",background:i===0?"#0057FF":"rgba(0,0,0,0.18)",borderRadius:2,width:`${parseFloat(t.pct)*100}%`}} />
                  </div>
                </div>
              </div>
              {[t.w,t.l,t.t,t.pct,t.gp,t.rs,t.ra].map((v,vi) => (
                <span key={vi} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:vi===3?18:28,fontWeight:vi===0?900:vi===3?700:400,color:vi===0?"#111":vi===3?"#0057FF":"rgba(0,0,0,0.55)",textAlign:"center",display:"block"}}>{v}</span>
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
      <div style={{background:`linear-gradient(135deg, ${color}15 0%, #fff 60%)`,borderBottom:"3px solid #0057FF",padding:"32px clamp(12px,3vw,40px) 0"}}>
        <div style={{maxWidth:1400,margin:"0 auto"}}>
          <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(0,0,0,0.4)",fontSize:13,fontWeight:600,marginBottom:16,padding:0,display:"flex",alignItems:"center",gap:6}}>← All Teams</button>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:24,marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:20}}>
              <TLogo name={teamName} size={120} />
              <div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color,marginBottom:4}}>{team.divName}</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"clamp(36px,5vw,60px)",textTransform:"uppercase",color:"#111",lineHeight:1}}>{teamName}</h1>
                <div style={{fontSize:13,color:"rgba(0,0,0,0.45)",marginTop:4}}>#{team.seed} seed · {team.divName}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{background:"#fff",border:"1px solid rgba(0,0,0,0.09)",borderTop:`3px solid ${color}`,borderRadius:10,padding:"16px 24px",textAlign:"center"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:44,color,lineHeight:1}}>{team.w}-{team.l}</div>
                <div style={{fontSize:12,color:"rgba(0,0,0,0.4)",marginTop:4,fontFamily:"'Barlow Condensed',sans-serif"}}>{team.pct} PCT</div>
                <div style={{fontSize:11,color:"rgba(0,0,0,0.35)",marginTop:2}}>{team.rs} RF · {team.ra} RA</div>
              </div>
              <a href="https://www.synagoguesoftball.com/schedule-2/" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:8,color,border:`1px solid ${color}60`,borderRadius:20,padding:"9px 18px",textDecoration:"none",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,letterSpacing:".06em",textTransform:"uppercase",background:`${color}10`}}>
                📅 Subscribe to Schedule
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="team-detail-grid" style={{maxWidth:1400,margin:"0 auto",padding:"28px clamp(12px,3vw,40px) 60px",display:"grid",gridTemplateColumns:"1fr 300px",gap:28,alignItems:"start"}}>
        <div>
          {/* Roster */}
          {roster.length > 0 && (
            <div style={{marginBottom:28}}>
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:26,textTransform:"uppercase",color:"#111",marginBottom:14}}>Roster</h2>
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
            </div>
          )}

          {/* Recent results */}
          {teamGames.length > 0 && (
            <div>
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:26,textTransform:"uppercase",color:"#111",marginBottom:14}}>Recent Results</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
                {teamGames.map((g,i) => <FinalCard key={i} g={g} onTeamClick={goTeam} />)}
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
                    <TLogo name={opp} size={70} />
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111"}}>{isHome?"vs":"@"} {opp}</span>
                  </div>
                  <div style={{fontSize:12,color:"rgba(0,0,0,0.4)"}}>{g.time} · Mar 22 · {g.field}</div>
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
                <TLogo name={t.name} size={70} />
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
      <PageHero label="2026 Season" title="Team Directory">
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:16,paddingBottom:2}}>
          {[...allTeams].sort((a,b)=>parseFloat(b.pct)-parseFloat(a.pct)).map(t => {
            const color = TEAM_COLORS[t.name]||"#0057FF";
            return (
              <button key={t.name} onClick={() => setTeamDetail(t.name)} style={{
                display:"flex",alignItems:"center",gap:8,
                background:"#fff",border:`1px solid ${color}40`,
                borderRadius:8,padding:"7px 14px",cursor:"pointer",
                transition:"all .15s",fontFamily:"'Barlow Condensed',sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor=color}
              onMouseLeave={e => e.currentTarget.style.borderColor=`${color}40`}>
                <TLogo name={t.name} size={80} />
                <span style={{fontWeight:700,fontSize:15,color:"#111",textTransform:"uppercase"}}>{t.name}</span>
              </button>
            );
          })}
        </div>
      </PageHero>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"28px clamp(12px,3vw,40px) 60px"}}>
        {Object.entries(divData).map(([dk,div]) => (
          <div key={dk} style={{marginBottom:36}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:4,height:28,background:div.accent,borderRadius:2}} />
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:28,textTransform:"uppercase",color:"#111"}}>{div.name}</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
              {div.teams.map((t,i) => {
                const color = TEAM_COLORS[t.name]||div.accent;
                return (
                  <button key={t.name} onClick={() => setTeamDetail(t.name)} style={{
                    background:"#fff",border:"1px solid rgba(0,0,0,0.09)",
                    borderLeft:`3px solid ${color}`,borderTop:"3px solid #0057FF",
                    borderRadius:12,padding:"18px 20px",cursor:"pointer",
                    textAlign:"left",transition:"all .15s",
                    boxShadow:"0 1px 4px rgba(0,0,0,0.05)",display:"block",width:"100%",
                  }}
                  onMouseEnter={e => {e.currentTarget.style.boxShadow=`0 4px 16px ${color}25`;e.currentTarget.style.borderColor=color;}}
                  onMouseLeave={e => {e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)";e.currentTarget.style.borderColor="rgba(0,0,0,0.09)";e.currentTarget.style.borderLeftColor=color;}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                      <div style={{display:"flex",alignItems:"center",gap:14}}>
                        <TLogo name={t.name} size={100} />
                        <div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111",lineHeight:1}}>{t.name}</div>
                          <div style={{fontSize:12,color:"rgba(0,0,0,0.4)",marginTop:3}}>#{t.seed} seed · {div.name}</div>
                        </div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:30,color,lineHeight:1}}>{t.w}-{t.l}</div>
                        <div style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontFamily:"'Barlow Condensed',sans-serif"}}>{t.pct}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:16,paddingTop:10,borderTop:"1px solid rgba(0,0,0,0.05)"}}>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,color:"#111"}}>{t.rs}</div>
                        <div style={{fontSize:10,color:"rgba(0,0,0,0.35)",textTransform:"uppercase",letterSpacing:".08em"}}>Runs For</div>
                      </div>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,color:"#111"}}>{t.ra}</div>
                        <div style={{fontSize:10,color:"rgba(0,0,0,0.35)",textTransform:"uppercase",letterSpacing:".08em"}}>Runs Against</div>
                      </div>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,color:t.diff.startsWith("+")?div.accent:t.diff==="0"?"#111":"#dc2626"}}>{t.diff}</div>
                        <div style={{fontSize:10,color:"rgba(0,0,0,0.35)",textTransform:"uppercase",letterSpacing:".08em"}}>Differential</div>
                      </div>
                      <div style={{marginLeft:"auto",display:"flex",alignItems:"center"}}>
                        <span style={{fontSize:12,fontWeight:700,color:"#0057FF",fontFamily:"'Barlow Condensed',sans-serif"}}>View Team →</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
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
  const links = [["home","Home"],["scores","Scores"],["schedule","Schedule"],["standings","Standings"],["teams","Teams"],["subs","Sub Board"],["rules","Rules"]];
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

  const sampleAvail = [
    {initials:"DC",name:"David Cohen",team:"VBS",playing:"9:00 AM",available:"11:00 AM",field:"Sepulveda Basin #4",contact:"310-555-1234",color:"#1d4ed8"},
    {initials:"MK",name:"Mike Klein",team:"LBT",playing:"11:00 AM",available:"1:00 PM",field:"Cheviot Hills #1",contact:"310-555-5678",color:"#0f766e"},
    {initials:"SR",name:"Steve Rosen",team:"AAE A's",playing:"9:00 AM",available:"Any game",field:"Sepulveda Basin #2",contact:"310-555-9012",color:"#b45309"},
  ];

  const sampleSubs = [
    {initials:"GL",name:"Gary Lerner",team:"Emmanuel",field:"Any field",times:"Any time",div:"Any division",contact:"310-555-1111",color:"#1d4ed8"},
    {initials:"AB",name:"Alan Berg",team:"LBT",field:"Cheviot Hills only",times:"Morning games",div:"Any division",contact:"310-555-2222",color:"#0f766e"},
    {initials:"NF",name:"Neil Fisher",team:"TIOH",field:"Any field",times:"11am or 1pm",div:"My division only",contact:"310-555-3333",color:"#b45309"},
    {initials:"PG",name:"Paul Gold",team:"Beth Am",field:"Sepulveda Basin only",times:"Any time",div:"Any division",contact:"310-555-4444",color:"#6d28d9"},
  ];

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
                {[["name","Your name","e.g. David Cohen"],["team","Your team","e.g. VBS"],["contact","Phone or email","e.g. 310-555-1234"]].map(([k,label,ph]) => (
                  <div key={k} style={{display:"flex",flexDirection:"column",gap:4,gridColumn:k==="contact"?"1 / -1":"auto"}}>
                    <label style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontWeight:600}}>{label}</label>
                    <input placeholder={ph} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} style={{padding:"9px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14,background:"#f8f9fb"}} />
                  </div>
                ))}
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
                  <button onClick={() => setPosted(true)} style={{width:"100%",padding:"12px",background:"#0057FF",border:"none",borderRadius:8,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16,textTransform:"uppercase",cursor:"pointer",letterSpacing:".06em"}}>Post my availability</button>
                </div>
              </div>
            )}
          </Card>

          {/* Available players */}
          <div style={{marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>Available this Sunday — Mar 22</div>
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
              {[["name","Your name","e.g. Gary Lerner"],["team","Your team","e.g. Emmanuel"],["contact","Phone or email","e.g. 310-555-1234"]].map(([k,label,ph]) => (
                <div key={k} style={{display:"flex",flexDirection:"column",gap:4,gridColumn:k==="contact"?"1 / -1":"auto"}}>
                  <label style={{fontSize:12,color:"rgba(0,0,0,0.4)",fontWeight:600}}>{label}</label>
                  <input placeholder={ph} style={{padding:"9px 12px",borderRadius:8,border:"1px solid rgba(0,0,0,0.15)",fontSize:14,background:"#f8f9fb"}} />
                </div>
              ))}
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

/* ─── ADMIN PAGE ─────────────────────────────────────────────────────────── */
function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

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

  // ── LOGIN SCREEN ──
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
          <div style={{fontSize:11,color:"rgba(0,0,0,0.3)",textAlign:"center",marginTop:12}}>Demo password: lassl2026</div>
        </div>
      </Card>
    </div>
  );

  // ── ADMIN DASHBOARD ──
  return (
    <div style={{minHeight:"100vh",background:"#f2f4f8",overflowX:"hidden",width:"100%"}}>
      <div style={{background:"#001a6e",borderBottom:"3px solid #0057FF",padding:"16px clamp(12px,3vw,40px)"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",alignItems:"center",gap:14}}>
          <img src={L_LEAGUE} alt="LASSL" style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(255,255,255,0.2)"}} />
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:"#FFD700",textTransform:"uppercase"}}>LASSL Admin</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Logged in as League Admin</div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:connected?"#22c55e":"#dc2626",boxShadow:`0 0 6px ${connected?"#22c55e":"#dc2626"}`}} />
              <span style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>{loading ? "Loading..." : connected ? `${fbTeams.length} teams · ${fbGames.length} games` : "Disconnected"}</span>
            </div>
            <button onClick={() => setAuthed(false)} style={{padding:"6px 14px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:6,color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>Log out</button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"24px clamp(12px,3vw,40px) 60px",display:"flex",flexDirection:"column",gap:20}}>

        {/* Connection status */}
        <div style={{background:connected?"#f0fdf4":"#fef2f2",border:`1px solid ${connected?"#bbf7d0":"#fecaca"}`,borderRadius:10,padding:"12px 18px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:connected?"#22c55e":"#dc2626",flexShrink:0,boxShadow:`0 0 6px ${connected?"#22c55e":"#dc2626"}`}} />
          <span style={{fontSize:14,fontWeight:600,color:connected?"#166534":"#991b1b"}}>
            {connected ? "Connected to Firebase — ready to update scores" : loading ? "Connecting to Firebase..." : "Could not connect to Firebase"}
          </span>
          {!connected && !loading && <button onClick={loadData} style={{marginLeft:"auto",padding:"4px 12px",background:"none",border:"1px solid #fca5a5",borderRadius:6,color:"#dc2626",fontSize:12,cursor:"pointer"}}>Retry</button>}
        </div>

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
                  <button key={g.id} onClick={() => { setSelGame(g); setAwayScore(g.done ? String(g.away_score ?? "") : ""); setHomeScore(g.done ? String(g.home_score ?? "") : ""); setSaveMsg(null); }}
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
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(0,0,0,0.07)"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,textTransform:"uppercase",color:"#111"}}>3. Enter Score</div>
              {selGame.done && <div style={{fontSize:12,color:"#f59e0b",fontWeight:600,marginTop:4}}>This game already has a score. Saving will overwrite it.</div>}
            </div>
            <div style={{padding:"24px 20px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:16,alignItems:"center",maxWidth:500,margin:"0 auto"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:12,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(0,0,0,0.4)",marginBottom:8}}>Away</div>
                  <TLogo name={teamName(selGame.away)} size={56} />
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,textTransform:"uppercase",color:"#111",marginTop:8}}>{teamName(selGame.away)}</div>
                  <input type="number" min="0" max="99" placeholder="0" value={awayScore} onChange={e => setAwayScore(e.target.value)}
                    style={{width:88,fontSize:44,fontWeight:900,textAlign:"center",background:"#f8f9fb",border:"2px solid rgba(0,0,0,0.15)",borderRadius:10,color:"#111",padding:"6px",marginTop:10,outline:"none"}} />
                </div>
                <div style={{fontSize:20,fontWeight:700,color:"rgba(0,0,0,0.2)"}}>VS</div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:12,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"rgba(0,0,0,0.4)",marginBottom:8}}>Home</div>
                  <TLogo name={teamName(selGame.home)} size={56} />
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
          .desktop-nav{display:none!important;}
          .hamburger{display:flex!important;}
          .mobile-standings{display:block!important;}
          .desktop-standings{display:none!important;}
        }
      `}</style>
      <div style={{position:"relative",zIndex:200,overflow:"hidden",width:"100%"}}><Ticker setTab={handleSetTab} sched={sched} /></div>
      <div style={{position:"sticky",top:0,zIndex:300,overflow:"hidden",width:"100%"}}><Navbar tab={tab} setTab={handleSetTab} /></div>
      {tab==="home"      && <HomePage setTab={handleSetTab} setTeamDetail={handleTeamDetail} allTeams={allTeams} scores={scores} sched={sched} />}
      {tab==="scores"    && <ScoresPage setTab={handleSetTab} setTeamDetail={handleTeamDetail} scores={scores} />}
      {tab==="schedule"  && <SchedulePage setTab={handleSetTab} setTeamDetail={handleTeamDetail} sched={sched} />}
      {tab==="standings" && <StandingsPage setTab={handleSetTab} setTeamDetail={handleTeamDetail} div={div} />}
      {tab==="teams"     && !teamDetail && <TeamsPage setTab={handleSetTab} setTeamDetail={handleTeamDetail} div={div} allTeams={allTeams} />}
      {tab==="teams"     && teamDetail  && <TeamDetailPage teamName={teamDetail} onBack={() => { setTeamDetail(null); window.scrollTo(0,0); }} setTab={handleSetTab} setTeamDetail={handleTeamDetail} div={div} allTeams={allTeams} scores={scores} sched={sched} rosters={rosters} />}
      {tab==="subs"      && <SubBoardPage />}
      {tab==="admin"     && <AdminPage />}
      {tab==="rules"     && <RulesPage />}
      <Footer setTab={handleSetTab} />
    </div>
  );
}
