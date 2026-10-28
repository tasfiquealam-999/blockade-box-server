/* Blockade Box leaderboard server (no framework, only `pg` when DATABASE_URL is set).
   GET  /api/leaderboard?id=PLAYER_ID  -> { top:[{n,p,me}], rank }
   POST /api/leaderboard  {id,name,points} -> { ok:true, rank }
   GET  /                                   -> "ok" (health check / keep-alive ping)            */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ALLOWED_ORIGIN || '*';      /* e.g. https://www.crazygames.com (or keep * while testing) */
const MAX_STEP = 30;          /* biggest legit change per submit (a ranked win is +30, a loss -10) */
const FIRST_MAX = 300;        /* max points accepted from a brand-new player (they may have played before the leaderboard) */
const MIN_GAP_MS = 4000;      /* min time between two submits from the same player */
const IP_LIMIT = 90;          /* requests per minute per IP */
const TYPES = { '.html': 'text/html; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const BAD = ['fuck', 'shit', 'bitch', 'cunt', 'dick', 'pussy', 'nigg', 'fag', 'rape', 'nazi', 'hitler', 'porn', 'sex', 'asshole', 'whore', 'slut', 'chudi', 'magi', 'khanki', 'madarchod', 'bokachoda'];

/* ---------- storage: Postgres if DATABASE_URL, else in-memory (data is lost on restart) ---------- */
let store;
if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  const url = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString: url, ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false } });
  const ready = pool.query(`CREATE TABLE IF NOT EXISTS lb(id TEXT PRIMARY KEY, name TEXT NOT NULL, points INT NOT NULL, updated TIMESTAMPTZ NOT NULL DEFAULT now());
                           CREATE INDEX IF NOT EXISTS lb_points ON lb(points DESC, updated ASC);`);
  store = {
    async get(id) { await ready; const r = await pool.query('SELECT id,name,points,EXTRACT(EPOCH FROM updated)*1000 AS t FROM lb WHERE id=$1', [id]); return r.rows[0] ? { ...r.rows[0], t: +r.rows[0].t } : null; },
    async put(id, name, points) { await ready; await pool.query(`INSERT INTO lb(id,name,points,updated) VALUES($1,$2,$3,now()) ON CONFLICT(id) DO UPDATE SET name=$2,points=$3,updated=now()`, [id, name, points]); },
    async top(n) { await ready; return (await pool.query('SELECT id,name,points FROM lb ORDER BY points DESC, updated ASC LIMIT $1', [n])).rows; },
    async rank(points) { await ready; return +(await pool.query('SELECT COUNT(*)+1 AS r FROM lb WHERE points>$1', [points])).rows[0].r; }
  };
  console.log('Storage: Postgres');
} else {
  const m = new Map();
  store = {
    async get(id) { return m.get(id) || null; },
    async put(id, name, points) { m.set(id, { id, name, points, t: Date.now() }); },
    async top(n) { return [...m.values()].sort((a, b) => b.points - a.points || a.t - b.t).slice(0, n); },
    async rank(points) { let c = 1; for (const v of m.values()) if (v.points > points) c++; return c; }
  };
  console.log('Storage: in-memory (set DATABASE_URL for permanent storage)');
}

/* ---------- helpers ---------- */
const hits = new Map();
setInterval(() => hits.clear(), 60000).unref();
const limited = ip => { const n = (hits.get(ip) || 0) + 1; hits.set(ip, n); return n > IP_LIMIT; };
const clean = raw => {
  let n = String(raw || '').replace(/[\u0000-\u001f<>&"'`\\]/g, '').replace(/\s+/g, ' ').trim().slice(0, 14);
  const flat = n.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's').replace(/\$/g, 's');
  if (!n || BAD.some(w => flat.includes(w))) n = 'Player' + (1000 + Math.floor(Math.random() * 9000));
  return n;
};
const send = (res, code, body, type = 'application/json') => {
  res.writeHead(code, { 'Content-Type': type, 'Access-Control-Allow-Origin': ORIGIN, 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
};
const readBody = req => new Promise((ok, no) => {
  let d = ''; req.on('data', c => { d += c; if (d.length > 2000) { no(new Error('big')); req.destroy(); } });
  req.on('end', () => ok(d)); req.on('error', no);
});
const validId = id => typeof id === 'string' && /^[A-Za-z0-9_-]{4,40}$/.test(id);

/* ---------- server ---------- */
http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return send(res, 204, '');
    const u = new URL(req.url, 'http://x');
    /* Static files: if index.html (the game) sits next to server.js it is served at "/" (handy for testing). */
    if (req.method === 'GET' && !u.pathname.startsWith('/api/')) {
      const rel = u.pathname === '/' ? 'index.html' : decodeURIComponent(u.pathname).replace(/^\/+/, '');
      const file = path.resolve(__dirname, rel);
      const type = TYPES[path.extname(file).toLowerCase()];
      if (type && file.startsWith(__dirname + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile()) {
        res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
        return fs.createReadStream(file).pipe(res);
      }
      if (u.pathname === '/') return send(res, 200, 'ok', 'text/plain');
    }
    if (!u.pathname.startsWith('/api/leaderboard')) return send(res, 404, { error: 'not found' });
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    if (limited(ip)) return send(res, 429, { error: 'slow down' });

    if (req.method === 'GET') {
      const id = u.searchParams.get('id') || '';
      const rows = await store.top(100);
      const top = rows.map(r => ({ n: r.name, p: r.points, me: r.id === id ? 1 : 0 }));
      let rank = null;
      const mine = validId(id) ? await store.get(id) : null;
      rank = await store.rank(mine ? mine.points : 0);
      return send(res, 200, { top, rank });
    }

    if (req.method === 'POST') {
      let b; try { b = JSON.parse(await readBody(req)); } catch (e) { return send(res, 400, { error: 'bad json' }); }
      if (!validId(b.id)) return send(res, 400, { error: 'bad id' });
      const pts = Math.floor(Number(b.points));
      if (!Number.isFinite(pts) || pts < 0 || pts > 1000000) return send(res, 400, { error: 'bad points' });
      const name = clean(b.name);
      const old = await store.get(b.id);
      let next = pts;
      if (!old) { next = Math.min(pts, FIRST_MAX); }
      else {
        if (Date.now() - old.t < MIN_GAP_MS && pts !== old.points) return send(res, 429, { error: 'too fast' });
        next = Math.max(old.points - MAX_STEP, Math.min(old.points + MAX_STEP, pts));   /* clamp: can't jump */
      }
      await store.put(b.id, name, next);
      return send(res, 200, { ok: true, rank: await store.rank(next) });
    }
    send(res, 405, { error: 'method' });
  } catch (e) { console.error(e); send(res, 500, { error: 'server' }); }
}).listen(PORT, () => console.log('Leaderboard server on :' + PORT));
