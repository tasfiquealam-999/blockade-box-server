/* Blockade Box server: leaderboard API + Socket.io multiplayer relay (one service). */
const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const express = require('express');
const { Server } = require('socket.io');

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
const BAD = ['fuck','shit','bitch','cunt','dick','pussy','nigg','fag','rape','nazi','hitler','porn','sex','asshole','whore','slut','chudi','magi','khanki','madarchod','bokachoda'];

/* ---------------- Storage ---------------- */
let store;
if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const ready = pool.query(`CREATE TABLE IF NOT EXISTS lb(id TEXT PRIMARY KEY, name TEXT NOT NULL, points INT NOT NULL, updated TIMESTAMPTZ NOT NULL DEFAULT now()); CREATE INDEX IF NOT EXISTS lb_points ON lb(points DESC, updated ASC);`);
  store = {
    async get(id){ await ready; const r = await pool.query('SELECT id,name,points,EXTRACT(EPOCH FROM updated)*1000 AS t FROM lb WHERE id=$1',[id]); return r.rows[0] ? { ...r.rows[0], t:+r.rows[0].t } : null; },
    async put(id,name,points){ await ready; await pool.query(`INSERT INTO lb(id,name,points,updated) VALUES($1,$2,$3,now()) ON CONFLICT(id) DO UPDATE SET name=$2, points=$3, updated=now()`,[id,name,points]); },
    async top(n){ await ready; return (await pool.query('SELECT id,name,points FROM lb ORDER BY points DESC, updated ASC LIMIT $1',[n])).rows; },
    async rank(points){ await ready; return +(await pool.query('SELECT COUNT(*)+1 AS r FROM lb WHERE points>$1',[points])).rows[0].r; }
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
  console.log('⚠️  Storage: in-memory');
}

/* ---------------- Helpers ---------------- */
const hits = new Map();
setInterval(()=>hits.clear(), 60000).unref();
const limited = ip => { const n=(hits.get(ip)||0)+1; hits.set(ip,n); return n>IP_LIMIT; };
const clean = raw => {
  let n = String(raw||'').replace(/[\u0000-\u001f<>&"'`\\]/g,'').replace(/\s+/g,' ').trim().slice(0,14);
  const flat = n.toLowerCase().replace(/[^a-z0-9]/g,'');
  if (!n || BAD.some(w=>flat.includes(w))) n = 'Player'+(1000+Math.floor(Math.random()*9000));
  return n;
};
const send = (res,code,body,type='application/json') => {
  res.writeHead(code,{ 'Content-Type':type, 'Access-Control-Allow-Origin':ORIGIN, 'Access-Control-Allow-Methods':'GET,POST,OPTIONS', 'Access-Control-Allow-Headers':'Content-Type', 'Cache-Control':'no-store' });
  res.end(typeof body==='string' ? body : JSON.stringify(body));
};
const readBody = req => new Promise((ok,no)=>{
  let d=''; req.on('data',c=>{ d+=c; if(d.length>2000){ no(new Error('big')); req.destroy(); } });
  req.on('end',()=>ok(d)); req.on('error',no);
});
const validId = id => typeof id==='string' && /^[A-Za-z0-9_-]{4,40}$/.test(id);

/* ---------------- Leaderboard ---------------- */
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
      let b; try { b = JSON.parse(await readBody(req)); } catch(e){ return send(res,400,{ error:'bad json' }); }
      if (!validId(b.id)) return send(res,400,{ error:'bad id' });
      const pts = Math.floor(Number(b.points));
      if (!Number.isFinite(pts) || pts<0 || pts>1000000) return send(res,400,{ error:'bad points' });
      const name = clean(b.name);
      const old  = await store.get(b.id);
      let next = pts;
      if (!old) { next = Math.min(pts, FIRST_MAX); }
      else {
        if (Date.now()-old.t < MIN_GAP_MS && pts !== old.points) return send(res,429,{ error:'too fast' });
        next = Math.max(old.points-MAX_STEP, Math.min(old.points+MAX_STEP, pts));
      }
      await store.put(b.id, name, next);
      return send(res,200,{ ok:true, rank: await store.rank(next) });
    }
    send(res,405,{ error:'method' });
  } catch(e) { console.error(e); send(res,500,{ error:'server' }); }
};

/* ---------------- Express + Socket.io ---------------- */
const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: ORIGIN },
  pingInterval: 4000,      // detect a dead player within ~10s
  pingTimeout: 6000,
  maxHttpBufferSize: 4000  // game messages are tiny
});

/* ---------------- Multiplayer rooms ----------------
   Server only relays moves between the 2 players of a room. Protocol (client -> server):
     'create' (ack)        -> {ok, code}           host makes a private room
     'join' (code, ack)    -> {ok} | {ok:false, error:'not-found'|'full'}
     'quick'                                        enter the quick-match queue
     'm' (data)                                     relay a game message to the opponent
   Server -> client:
     'start' {role:1|2}    both players are in the room, game begins
     'm' data              message from the opponent
     'peer-left'           opponent disconnected / left                              */
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const rooms = new Map();   // code -> { players:[hostSocket, guestSocket|null] }
let waiting = null;        // socket waiting in the quick-match queue

function newCode() {
  let c;
  do { c = Array.from({ length: 4 }, () => ALPHA[Math.floor(Math.random() * ALPHA.length)]).join(''); }
  while (rooms.has(c));
  return c;
}
function startRoom(r) {
  r.players[0].emit('start', { role: 1 });
  r.players[1].emit('start', { role: 2 });
}
function leaveAll(s) {
  if (waiting === s) waiting = null;
  const code = s.data.room;
  if (!code) return;
  s.data.room = null;
  const r = rooms.get(code);
  if (!r) return;
  rooms.delete(code);
  for (const p of r.players) if (p && p !== s) { p.data.room = null; p.emit('peer-left'); }
}

io.on('connection', socket => {
  socket.data.room = null;
  let burst = 0;
  const tick = setInterval(() => { burst = 0; }, 1000);

  socket.on('create', ack => {
    if (typeof ack !== 'function') return;
    leaveAll(socket);
    const code = newCode();
    rooms.set(code, { players: [socket, null] });
    socket.data.room = code;
    ack({ ok: true, code });
  });

  socket.on('join', (code, ack) => {
    if (typeof ack !== 'function') return;
    leaveAll(socket);
    code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    const r = rooms.get(code);
    if (!r) return ack({ ok: false, error: 'not-found' });
    if (r.players[1]) return ack({ ok: false, error: 'full' });
    r.players[1] = socket;
    socket.data.room = code;
    ack({ ok: true });
    startRoom(r);
  });

  socket.on('quick', () => {
    leaveAll(socket);
    if (waiting && waiting.connected && waiting !== socket) {
      const host = waiting; waiting = null;
      const code = newCode();
      const r = { players: [host, socket] };
      rooms.set(code, r);
      host.data.room = code; socket.data.room = code;
      startRoom(r);
    } else waiting = socket;
  });

  socket.on('m', d => {
    if (++burst > 40) return;                       // flood protection
    const r = rooms.get(socket.data.room);
    if (!r || !d || typeof d !== 'object') return;
    let size = 0; try { size = JSON.stringify(d).length; } catch (e) { return; }
    if (size > 400) return;
    const other = r.players[0] === socket ? r.players[1] : r.players[0];
    if (other) other.emit('m', d);
  });

  socket.on('disconnect', () => { clearInterval(tick); leaveAll(socket); });
});

app.get('/health', (_req,res) => res.json({ ok:true, uptime:process.uptime(), rooms:rooms.size }));
app.use(handler);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
