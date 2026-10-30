/**
 * Blockade Board multiplayer relay server
 * Compatible with the Socket.IO event protocol used by the supplied index.html.
 * Node.js 18+ recommended.
 */
'use strict';

const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const ORIGINS = (process.env.CORS_ORIGIN || '*').split(',').map(s => s.trim()).filter(Boolean);
const ROOM_TTL_MS = 6 * 60 * 60 * 1000;
const CHAT_MAX = 120;
const MODES = new Set(['classic', 'race', 'king', '2v2', '3pt', 'ffa']);
const CAPACITY = { classic: 2, race: 2, king: 2, '2v2': 4, '3pt': 4, ffa: 4 };

const app = express();
app.disable('x-powered-by');
app.get('/', (_req, res) => res.status(200).json({
  name: 'Blockade Board multiplayer server',
  status: 'ok',
  socketio: true,
  uptime: Math.floor(process.uptime())
}));
app.get('/health', (_req, res) => res.status(200).json({ ok: true, rooms: rooms.size }));
app.get('/api/rooms', (_req, res) => {
  const list = [...rooms.values()]
    .filter(r => r.pub && !r.started && r.seats.some(Boolean) && r.seats.filter(Boolean).length < r.cap)
    .slice(0, 50)
    .map(r => ({ code: r.code, mode: r.mode, q: r.q, n: r.seats.filter(Boolean).length, cap: r.cap, host: (r.seats[r.host] && r.seats[r.host].n) || 'Host', hc: '', seats: r.seats.map(s => s ? ({ n: s.n }) : null) }));
  res.set('Cache-Control', 'no-store');
  res.status(200).json({ rooms: list });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ORIGINS.includes('*') ? '*' : ORIGINS, methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 20000,
  maxHttpBufferSize: 1e6
});

const rooms = new Map();
const socketRoom = new Map();
const quickQueues = new Map();

function cleanName(v) {
  const s = String(v == null ? '' : v).replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim();
  return (s || 'Player').slice(0, 18);
}
function cleanCode(v) {
  return String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
}
function cleanMode(v) { return MODES.has(v) ? v : 'classic'; }
function cleanColour(v) { return /^[a-z0-9_-]{1,24}$/i.test(String(v || '')) ? String(v) : ''; }
function cleanSkin(v) { return /^[a-z0-9_-]{1,24}$/i.test(String(v || '')) ? String(v) : ''; }
function roomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let tries = 0; tries < 100; tries++) {
    let code = '';
    for (let i = 0; i < 4; i++) code += chars[crypto.randomInt(chars.length)];
    if (!rooms.has(code)) return code;
  }
  throw new Error('Unable to allocate a room code');
}
function getRoomFor(socket) {
  const code = socketRoom.get(socket.id);
  return code ? rooms.get(code) : null;
}
function seatsOf(room) {
  return room.seats.map(s => s ? ({
    n: s.n, c: s.c, s: s.s, id: s.id
  }) : null);
}
function roomInfo(room, socket) {
  const you = room.seats.findIndex(s => s && s.id === socket.id);
  return {
    code: room.code,
    mode: room.mode,
    pub: room.pub,
    q: room.q,
    cap: room.cap,
    host: room.host,
    you,
    seats: seatsOf(room)
  };
}
function broadcastRoom(room) {
  for (const seat of room.seats) {
    if (seat && io.sockets.sockets.has(seat.id)) {
      io.to(seat.id).emit('room', roomInfo(room, io.sockets.sockets.get(seat.id)));
    }
  }
  io.emit('public-rooms', publicRoomList());
}
function publicRoomList() {
  return [...rooms.values()]
    .filter(r => r.pub && !r.started && r.seats.some(Boolean) && r.seats.filter(Boolean).length < r.cap)
    .slice(0, 50)
    .map(r => ({ code: r.code, mode: r.mode, n: r.seats.filter(Boolean).length, cap: r.cap }));
}
function removeFromQueue(socket) {
  for (const [key, queue] of quickQueues) {
    const next = queue.filter(item => item.id !== socket.id);
    if (next.length) quickQueues.set(key, next);
    else quickQueues.delete(key);
  }
}
function detachSocket(socket, { announce = true } = {}) {
  removeFromQueue(socket);
  const code = socketRoom.get(socket.id);
  socketRoom.delete(socket.id);
  if (!code) return;
  const room = rooms.get(code);
  if (!room) return;
  const index = room.seats.findIndex(s => s && s.id === socket.id);
  if (index < 0) return;
  const wasStarted = room.started;
  room.seats[index] = null;
  if (room.host === index) {
    const nextHost = room.seats.findIndex(Boolean);
    room.host = nextHost;
  }
  if (announce && wasStarted) {
    for (const seat of room.seats) if (seat) io.to(seat.id).emit('peer-left', { role: index + 1 });
  }
  if (!room.seats.some(Boolean)) {
    rooms.delete(code);
  } else {
    // Keep a started match alive for remaining players; waiting rooms are reusable.
    broadcastRoom(room);
  }
}
function joinSeat(socket, room, index) {
  if (index < 0 || index >= room.cap || room.seats[index]) return false;
  const old = socketRoom.get(socket.id);
  if (old && old !== room.code) detachSocket(socket, { announce: false });
  room.seats[index] = {
    id: socket.id,
    n: cleanName(socket.data.playerName),
    c: cleanColour(socket.data.colour),
    s: cleanSkin(socket.data.skin),
    joinedAt: Date.now()
  };
  socketRoom.set(socket.id, room.code);
  socket.join(room.code);
  return true;
}
function createRoom(socket, data = {}, isQuick = false) {
  const mode = cleanMode(data.mode);
  const cap = CAPACITY[mode];
  const code = roomCode();
  const room = {
    code, mode, cap, pub: !!data.pub, q: !!isQuick, host: 0,
    seats: Array(cap).fill(null), started: false, bots: [],
    createdAt: Date.now(), lastActivity: Date.now()
  };
  rooms.set(code, room);
  socket.data.playerName = cleanName(data.name);
  socket.data.colour = cleanColour(data.c);
  socket.data.skin = cleanSkin(data.s);
  joinSeat(socket, room, 0);
  return room;
}
function startMatch(room, bots = []) {
  if (room.started) return;
  const connected = room.seats.filter(Boolean).length;
  const botSeats = Array.isArray(bots) ? bots.map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= room.cap) : [];
  if (connected + new Set(botSeats).size < room.cap) return;
  room.bots = [...new Set(botSeats)].filter(role => !room.seats[role - 1]).map(role => role - 1);
  room.started = true;
  const names = room.seats.map((s, i) => s ? s.n : (room.bots.includes(i) ? `Bot ${i + 1}` : ''));
  const cs = room.seats.map(s => s ? s.c : '');
  const ss = room.seats.map(s => s ? s.s : '');
  for (let i = 0; i < room.cap; i++) {
    const seat = room.seats[i];
    if (!seat) continue;
    io.to(seat.id).emit('start', { mode: room.mode, pub: room.pub, q: room.q, role: i + 1, bots: room.bots.map(n => n + 1), names, cs, ss });
  }
  broadcastRoom(room);
}
function findQuickRoom(mode) {
  return [...rooms.values()].find(r => r.q && r.mode === mode && !r.started && r.seats.filter(Boolean).length < r.cap);
}
function queueQuick(socket, data) {
  const mode = cleanMode(data.mode);
  socket.data.playerName = cleanName(data.name);
  socket.data.colour = cleanColour(data.c);
  socket.data.skin = cleanSkin(data.s);
  let room = findQuickRoom(mode);
  if (!room) room = createRoom(socket, data, true);
  else {
    const index = room.seats.findIndex(s => !s);
    if (index >= 0) joinSeat(socket, room, index);
  }
  const count = room.seats.filter(Boolean).length;
  for (const seat of room.seats) if (seat) io.to(seat.id).emit('qstat', { n: count, cap: room.cap, mode: room.mode });
  broadcastRoom(room);
  if (count >= room.cap) startMatch(room);
}

io.on('connection', socket => {
  socket.emit('public-rooms', publicRoomList());

  socket.on('create', (data = {}, ack = () => {}) => {
    try {
      detachSocket(socket, { announce: false });
      const room = createRoom(socket, data, false);
      room.lastActivity = Date.now();
      ack({ ok: true, code: room.code });
      broadcastRoom(room);
    } catch (e) {
      ack({ ok: false, error: 'server-error' });
    }
  });

  socket.on('join', (data = {}, ack = () => {}) => {
    const code = cleanCode(data.code);
    const room = rooms.get(code);
    if (!room) return ack({ ok: false, error: 'not-found' });
    if (room.started) return ack({ ok: false, error: 'full' });
    const index = room.seats.findIndex(s => !s);
    if (index < 0) return ack({ ok: false, error: 'full' });
    socket.data.playerName = cleanName(data.name);
    socket.data.colour = cleanColour(data.c);
    socket.data.skin = cleanSkin(data.s);
    if (!joinSeat(socket, room, index)) return ack({ ok: false, error: 'full' });
    room.lastActivity = Date.now();
    ack({ ok: true });
    broadcastRoom(room);
    if (room.pub && room.seats.filter(Boolean).length >= room.cap) startMatch(room);
  });

  socket.on('quick', data => {
    try {
      detachSocket(socket, { announce: false });
      queueQuick(socket, data || {});
    } catch (e) {
      socket.emit('server-error', { message: 'Could not join quick match' });
    }
  });

  socket.on('start', data => {
    const room = getRoomFor(socket);
    if (!room || room.started) return;
    const seatIndex = room.seats.findIndex(s => s && s.id === socket.id);
    if (seatIndex !== room.host) return;
    if (data && data.bots) {
      const missing = room.seats.map((s, i) => s ? null : i + 1).filter(Boolean);
      startMatch(room, missing);
    } else {
      startMatch(room);
    }
  });

  socket.on('seat', data => {
    const room = getRoomFor(socket);
    if (!room || room.started) return;
    const from = room.seats.findIndex(s => s && s.id === socket.id);
    const to = Number(data && data.to);
    if (from < 0 || !Number.isInteger(to) || to < 0 || to >= room.cap || room.seats[to]) return;
    const seat = room.seats[from];
    room.seats[from] = null;
    room.seats[to] = seat;
    if (room.host === from) room.host = to;
    broadcastRoom(room);
  });

  socket.on('m', data => {
    const room = getRoomFor(socket);
    if (!room || !room.started || !data || typeof data !== 'object') return;
    const index = room.seats.findIndex(s => s && s.id === socket.id);
    if (index < 0) return;
    // Server overwrites player identity to prevent spoofing another seat.
    const payload = { ...data, p: index + 1 };
    room.lastActivity = Date.now();
    for (const seat of room.seats) {
      if (seat && seat.id !== socket.id) io.to(seat.id).emit('m', payload);
    }
  });

  socket.on('chat', data => {
    const room = getRoomFor(socket);
    if (!room || !data || typeof data !== 'object') return;
    const index = room.seats.findIndex(s => s && s.id === socket.id);
    if (index < 0) return;
    const t = String(data.t == null ? '' : data.t)
      .replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, CHAT_MAX);
    if (!t) return;
    const seat = room.seats[index];
    const message = { p: index + 1, n: seat.n, t, ts: Date.now() };
    room.lastActivity = Date.now();
    for (const other of room.seats) if (other) io.to(other.id).emit('chat', message);
  });

  socket.on('disconnect', () => detachSocket(socket));
});

// Expire abandoned rooms, but don't expire an active match that still has players.
setInterval(() => {
  const cutoff = Date.now() - ROOM_TTL_MS;
  for (const [code, room] of rooms) {
    if (room.lastActivity < cutoff) {
      for (const seat of room.seats) if (seat) {
        socketRoom.delete(seat.id);
        const s = io.sockets.sockets.get(seat.id);
        if (s) s.leave(code);
      }
      rooms.delete(code);
    }
  }
}, 10 * 60 * 1000).unref();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Blockade Board server listening on 0.0.0.0:${PORT}`);
});
