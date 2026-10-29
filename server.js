/* Blockade Box server: leaderboard API + PeerJS signaling (one service).

   Routes:
   - GET  /api/leaderboard?id=PLAYER_ID  -> { top:[{n,p,me}], rank }
   - POST /api/leaderboard               -> { ok:true, rank }  body: {id,name,points}
   - GET  /health                        -> { ok:true } (keep-alive ping)
   - GET  /                              -> "ok"
   - /peerjs/*                           -> PeerJS signaling (HTTP + WebSocket)
*/
const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const express = require('express');
const { ExpressPeerServer } = require('peer');

const PORT      = process.env.PORT || 3000;
const ORIGIN    = process.env.ALLOWED_ORIGIN || '*';
const MAX_STEP  = 30;
const FIRST_MAX = 300;
const MIN_GAP_MS = 4000;
const IP_LIMIT  = 90;

const TYPES = {
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'application/javascript; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.woff2':'font/woff2', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.svg':'image/svg+xml', '.ico':'image/x-icon'
};
const BAD = ['fuck','shit','bitch','cunt','dick','pussy','nigg','fag','rape','nazi','hitler',
             'porn','sex','asshole','whore','slut','chudi','magi','khanki','madarchod','bokachoda'];

/* ---------------- Storage ---------------- */
let store;
if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false }
  });
  const ready = pool.query(`
    CREATE TABLE IF NOT EXISTS lb(id TEXT PRIMARY KEY, name TEXT NOT NULL, points INT NOT NULL,
                                  updated TIMESTAMPTZ NOT NULL DEFAULT now());
    CREATE INDEX IF NOT EXISTS lb_points ON lb(points DESC, updated ASC);
  `);
  store = {
    async get(id){ await ready; const r = await pool.query(
      'SELECT id,name,points,EXTRACT(EPOCH FROM updated)*1000 AS t FROM lb WHERE id=$1',[id]);
      return r.rows[0] ? { ...r.rows[0], t:+r.rows[0].t } : null; },
    async put(id,name,points){ await ready; await pool.query(
      `INSERT INTO lb(id,name,points,updated) VALUES($1,$2,$3,now())
       ON CONFLICT(id) DO UPDATE SET name=$2, points=$3, updated=now()`,
      [id,name,points]); },
    async top(n){ await ready; return (await pool.query(
      'SELECT id,name,points FROM lb ORDER BY points DESC, updated ASC LIMIT $1',[n])).rows; },
    async rank(points){ await ready; return +(await pool.query(
      'SELECT COUNT(*)+1 AS r FROM lb WHERE points>$1',[points])).rows[0].r; }
  };
  console.log('✅ Storage: Postgres');
} else {
  const m = new Map();
  store = {
    async get(id){ return m.get(id) || null; },
    async put(id,name,points){ m.set(id,{ id,name,points,t:Date.now() }); },
    async top(n){ return [...m.values()].sort((a,b)=>b.points-a.points||a.t-b.t).slice(0,n); },
    async rank(points){ let c=1; for(const v of m.values()) if(v.points>points) c++; return c; }
  };
  console.log('⚠️  Storage: in-memory (set DATABASE_URL for permanent storage)');
}

/* ---------------- Helpers ---------------- */
const hits = new Map();
setInterval(()=>hits.clear(), 60000).unref();
const limited = ip => { const n=(hits.get(ip)||0)+1; hits.set(ip,n); return n>IP_LIMIT; };

const clean = raw => {
  let n = String(raw||'').replace(/[\u0000-\u001f<>&"'`\\]/g,'').replace(/\s+/g,' ').trim().slice(0,14);
  const flat = n.toLowerCase().replace(/[^a-z0-9]/g,'')
    .replace(/0/g,'o').replace(/1/g,'i').replace(/3/g,'e').replace(/4/g,'a').replace(/5/g,'s').replace(/\$/g,'s');
  if (!n || BAD.some(w=>flat.includes(w))) n = 'Player'+(1000+Math.floor(Math.random()*9000));
  return n;
};
const send = (res,code,body,type='application/json') => {
  res.writeHead(code,{
    'Content-Type':type,
    'Access-Control-Allow-Origin':ORIGIN,
    'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type',
    'Cache-Control':'no-store'
  });
  res.end(typeof body==='string' ? body : JSON.stringify(body));
};
const readBody = req => new Promise((ok,no)=>{
  let d=''; req.on('data',c=>{ d+=c; if(d.length>2000){ no(new Error('big')); req.destroy(); } });
  req.on('end',()=>ok(d)); req.on('error',no);
});
const validId = id => typeof id==='string' && /^[A-Za-z0-9_-]{4,40}$/.test(id);

/* ---------------- Leaderboard + static ---------------- */
const handler = async (req,res) => {
  try {
    if (req.method==='OPTIONS') return send(res,204,'');
    const u = new URL(req.url,'http://x');

    if (req.method==='GET' && !u.pathname.startsWith('/api/')) {
      const rel  = u.pathname==='/' ? 'index.html' : decodeURIComponent(u.pathname).replace(/^\/+/,'');
      const file = path.resolve(__dirname, rel);
      const type = TYPES[path.extname(file).toLowerCase()];
      if (type && file.startsWith(__dirname+path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) {
        res.writeHead(200,{ 'Content-Type':type, 'Cache-Control':'no-cache' });
        return fs.createReadStream(file).pipe(res);
      }
      if (u.pathname==='/') return send(res,200,'ok','text/plain');
    }

    if (!u.pathname.startsWith('/api/leaderboard')) return send(res,404,{ error:'not found' });

    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    if (limited(ip)) return send(res,429,{ error:'slow down' });

    if (req.method==='GET') {
      const id = u.searchParams.get('id') || '';
      const rows = await store.top(100);
      const top  = rows.map(r=>({ n:r.name, p:r.points, me:r.id===id?1:0 }));
      const mine = validId(id) ? await store.get(id) : null;
      const rank = await store.rank(mine ? mine.points : 0);
      return send(res,200,{ top, rank });
    }

    if (req.method==='POST') {
      let b;
      try { b = JSON.parse(await readBody(req)); }
      catch(e){ return send(res,400,{ error:'bad json' }); }
      if (!validId(b.id)) return send(res,400,{ error:'bad id' });
      const pts = Math.floor(Number(b.points));
      if (!Number.isFinite(pts) || pts<0 || pts>1000000) return send(res,400,{ error:'bad points' });
      const name = clean(b.name);
      const old  = await store.get(b.id);
      let next = pts;
      if (!old) {
        next = Math.min(pts, FIRST_MAX);
      } else {
        if (Date.now()-old.t < MIN_GAP_MS && pts !== old.points) return send(res,429,{ error:'too fast' });
        next = Math.max(old.points-MAX_STEP, Math.min(old.points+MAX_STEP, pts));
      }
      await store.put(b.id, name, next);
      return send(res,200,{ ok:true, rank: await store.rank(next) });
    }

    send(res,405,{ error:'method' });
  } catch(e) {
    console.error('[handler error]', e);
    send(res,500,{ error:'server' });
  }
};

/* ---------------- Express + PeerJS ---------------- */
const app    = express();
app.set('trust proxy', 1);
const server = http.createServer(app);

/* PeerJS signaling.
   ⚠️ VERY IMPORTANT:
   - Do NOT set `path` inside ExpressPeerServer. Default '/' is correct when mounted at '/peerjs'.
   - Client side MUST use: path: '/peerjs' (already in your index.html NET object).
   - `proxied: true` is required behind Render's reverse proxy. */
const peerServer = ExpressPeerServer(server, {
  proxied: true,
  allow_discovery: false,
  debug: process.env.PEER_DEBUG === '1',
  corsOptions: { origin: true, credentials: true }
});

peerServer.on('connection', client => console.log(`[peer] ✅ connected: ${client.getId()}`));
peerServer.on('disconnect', client => console.log(`[peer] ❌ disconnected: ${client.getId()}`));

app.use('/peerjs', peerServer);

/* Keep-alive / health check for Render free tier (point UptimeRobot here every 10 min) */
app.get('/health', (_req,res) => res.json({ ok:true, ts:Date.now(), peer:'/peerjs', uptime:process.uptime() }));

/* Leaderboard + static files (must be registered last) */
app.use(handler);

/* ---------------- Boot ---------------- */
server.listen(PORT, () => {
  console.log('');
  console.log(`🚀 Blockade Box server listening on port ${PORT}`);
  console.log(`   PeerJS signaling : /peerjs   (client uses path:'/peerjs')`);
  console.log(`   Leaderboard API  : /api/leaderboard`);
  console.log(`   Health check     : /health`);
  console.log('');
});

/* ---------------- Graceful shutdown ---------------- */
process.on('SIGTERM', () => { console.log('SIGTERM, shutting down'); server.close(()=>process.exit(0)); });
process.on('SIGINT',  () => { console.log('SIGINT, shutting down');  server.close(()=>process.exit(0)); });
