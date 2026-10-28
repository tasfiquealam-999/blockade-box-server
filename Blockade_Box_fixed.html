<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Blockade Box</title>
<script src="https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js"></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700;800;900&display=swap">
<style>
:root{--bg:#0b0e14;--panel:#131722;--card:#1c2230;--tile:#252d3d;--line:#2a3447;--p1:#3b82f6;--p1g:rgba(59,130,246,.6);--p2:#ef4444;--p2g:rgba(239,68,68,.6);--gold:#f59e0b;--tx:#e2e8f0;--mut:#94a3b8;color-scheme:dark;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
*{box-sizing:border-box;user-select:none;font-family:Inter,system-ui,sans-serif}
body{margin:0;background:var(--bg);color:var(--tx);min-height:100vh;display:flex;align-items:center;justify-content:center}
.hidden{display:none!important}
.app{display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:center;padding:16px;max-width:980px}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:24px;padding:18px;box-shadow:0 25px 50px -12px rgba(0,0,0,.7)}
.top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:12px;font-size:11px;font-weight:700;color:var(--mut)}
.dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin:0 6px}
.d1{background:var(--p1)}.d2{background:var(--p2)}
.pill{padding:4px 12px;border-radius:99px;border:1px solid;font-size:11px;font-weight:900;letter-spacing:.06em;text-transform:uppercase}
.pill.c1{color:#60a5fa;background:rgba(59,130,246,.1);border-color:rgba(59,130,246,.3)}
.pill.c2{color:#f87171;background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.3)}
.board{--g:12px;--hl:59,130,246;display:grid;grid-template:repeat(8,1fr var(--g)) 1fr/repeat(8,1fr var(--g)) 1fr;width:min(88vw,520px);aspect-ratio:1;padding:16px;background:#0f131c;border:1px solid #1e2638;border-radius:18px}
.board.p2{--hl:239,68,68}
@media(max-width:640px){.board{--g:8px}}
.t{background:var(--tile);border-radius:9px;display:flex;align-items:center;justify-content:center;position:relative}
.t.ok{background:rgba(var(--hl),.18);border:2px dashed rgb(var(--hl));cursor:pointer;animation:pl 1.5s infinite}
@keyframes pl{50%{border-color:rgba(var(--hl),.35)}}
.g1{background:linear-gradient(rgba(59,130,246,.3),rgba(59,130,246,.3)),var(--tile);box-shadow:inset 0 0 0 1px rgba(59,130,246,.25)} /* Blue player side */
.g2{background:linear-gradient(rgba(239,68,68,.3),rgba(239,68,68,.3)),var(--tile);box-shadow:inset 0 0 0 1px rgba(239,68,68,.25)} /* Red player side */
.board{position:relative;--pd:16px;--gl:8px}
body.mob .board{--pd:10px;--gl:6px}
.board::before,.board::after{content:"";position:absolute;left:var(--pd);right:var(--pd);height:var(--gl);border-radius:0;pointer-events:none;
background:repeating-linear-gradient(90deg,var(--ca) 0 calc(100%/120),var(--cb) 0 calc(100%/60)) top/100% 50% no-repeat,repeating-linear-gradient(90deg,var(--cb) 0 calc(100%/120),var(--ca) 0 calc(100%/60)) bottom/100% 50% no-repeat}
.board::before{--ca:#fca5a5;--cb:#dc2626;top:calc(var(--pd) - var(--gl) - 3px);box-shadow:0 0 10px var(--p2g)} /* Red side: top */
.board::after{--ca:#93c5fd;--cb:#2563eb;bottom:calc(var(--pd) - var(--gl) - 3px);box-shadow:0 0 10px var(--p1g)} /* Blue side: bottom */
.clock{font-size:20px;font-weight:900;font-variant-numeric:tabular-nums;color:#cbd5e1}
.clock.on{color:#fbbf24}.clock.low{color:#f87171}.clock.low.on{animation:pl 1s infinite}
.pawn{display:block;width:68%;height:68%;border-radius:50%}
.pawn.p1{background:radial-gradient(circle at 35% 35%,#93c5fd,#2563eb,#1e40af);box-shadow:0 0 16px var(--p1g);border:2px solid #bfdbfe}
.pawn.p2{background:radial-gradient(circle at 35% 35%,#fca5a5,#dc2626,#991b1b);box-shadow:0 0 16px var(--p2g);border:2px solid #fecaca}
.gem{font-size:1.1rem;animation:fl 2s infinite ease-in-out;filter:drop-shadow(0 0 8px rgba(245,158,11,.7))}
@keyframes fl{50%{transform:translateY(-4px)}}
.s{border-radius:4px;cursor:pointer}.s:hover{background:rgba(var(--hl),.65)}
.w{border-radius:5px}.w1{background:var(--p1);box-shadow:0 0 12px var(--p1g)}.w2{background:var(--p2);box-shadow:0 0 12px var(--p2g)}
.side{width:300px;max-width:92vw;display:flex;flex-direction:column;gap:14px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:14px;transition:.25s}
.card.on1{border-color:rgba(59,130,246,.55);box-shadow:0 0 15px rgba(59,130,246,.15)}
.card.on2{border-color:rgba(239,68,68,.55);box-shadow:0 0 15px rgba(239,68,68,.15)}
.row{display:flex;justify-content:space-between;align-items:center;gap:8px}
.logo{width:36px;height:36px;border-radius:12px;background:rgba(37,99,235,.2);border:1px solid rgba(59,130,246,.4);color:#60a5fa;font-weight:900;display:flex;align-items:center;justify-content:center}
.bars{display:flex;gap:4px;margin-top:8px}
.seg{flex:1;height:10px;border-radius:3px;background:#1e2638;transition:.3s}
.f1{background:var(--p1);box-shadow:0 0 8px var(--p1g)}.f2{background:var(--p2);box-shadow:0 0 8px var(--p2g)}
.mut{color:var(--mut);font-size:12px;font-weight:800}
.gold{color:var(--gold);font-size:18px;font-weight:900;display:block}
small{color:var(--mut);font-size:11px;font-weight:600}
.btns{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.btn{padding:12px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:#cbd5e1;font-weight:700;font-size:12px;cursor:pointer}
.btn:hover{background:var(--tile)}
.btn.pri{background:#2563eb;border-color:#2563eb;color:#fff;font-weight:800}.btn.pri:hover{background:#3b82f6}
.btn:disabled{opacity:.5;cursor:default}
.ov{position:fixed;inset:0;background:rgba(7,10,15,.88);backdrop-filter:blur(10px);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}
#modal{background:rgba(7,10,15,.6);backdrop-filter:blur(3px)}
.box{background:var(--panel);border:1px solid var(--line);border-radius:24px;padding:32px;width:100%;max-width:400px;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,.6)}
.box h1,.box h2{margin:0 0 6px;font-weight:900;color:#fff}.box h1{font-size:34px}.box h2{font-size:32px}
.box p{color:var(--mut);font-size:14px;margin:0 0 22px}
.box .btn{display:block;width:100%;margin-top:10px;padding:14px;font-size:15px}
.seg3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:8px 0 18px}
.seg3 .btn{margin:0;padding:10px;font-size:12px}
.dbtn.on,.cbtn.on{border-color:#3b82f6;background:rgba(37,99,235,.2);color:#60a5fa}
.board{touch-action:none}
.app{max-width:1500px}
body.pc .board{--g:14px;width:max(360px,min(84vh,calc(100vw - 440px),880px))}
body.pc .side{width:320px}
body.mob .app{padding:8px;gap:12px}
body.mob .panel{padding:10px;border-radius:18px}
body.mob .board{--g:8px;padding:10px;width:min(94vw,520px)}
.mobonly{display:none}
body.mob .mobonly{display:grid}
.ori{margin-top:12px;grid-template-columns:1fr 1fr;gap:10px}
.ori .btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px}
.ori .btn.on{border-color:#60a5fa;background:rgba(37,99,235,.2);color:#fff}
.bar{display:inline-block;border-radius:3px;background:var(--tc,#3b82f6)}
.pv{border-radius:5px;pointer-events:none;z-index:5}
.pv.bad{background:rgba(100,116,139,.5);outline:2px dashed #94a3b8}
.btn.grn{background:#16a34a;border-color:#16a34a;color:#fff;font-weight:800}.btn.grn:hover{background:#22c55e}
.btn.yel{background:#eab308;border-color:#eab308;color:#111;font-weight:800}.btn.yel:hover{background:#facc15}
.seg2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.seg2 .btn{margin:0;padding:12px 6px;font-size:12px}
.inp{width:100%;padding:14px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:#fff;font-size:22px;font-weight:900;letter-spacing:.3em;text-align:center;text-transform:uppercase;user-select:text;-webkit-user-select:text;margin-top:6px}
.box{max-height:calc(100vh - 32px);overflow-y:auto}
.total{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:18px;padding:10px;border:1px solid var(--line);border-radius:14px;background:var(--card)}
</style>
</head>
<body>
<main class="app">
  <section class="panel">
    <div class="top">
      <span><i class="dot d2" style="margin-left:0"></i>P2 goal: bottom</span>
      <span id="st" class="pill c1"></span>
      <span>P1 goal: top<i class="dot d1" style="margin-right:0"></i></span>
    </div>
    <div id="board" class="board"></div>
    <div class="ori mobonly"><button id="oh" class="btn on" data-do="ori:h"><i class="bar" style="width:24px;height:6px"></i> Horizontal</button><button id="ov" class="btn" data-do="ori:v"><i class="bar" style="width:6px;height:24px"></i> Vertical</button></div>
    <small class="mobonly" style="text-align:center;margin-top:8px">Pick a direction, then hold &amp; drag on the board to place a wall</small>
  </section>
  <aside class="side">
    <div class="card row">
      <div class="row" style="justify-content:flex-start;gap:12px"><div class="logo">B</div><div><b style="font-size:14px">BLOCKADE BOX</b><br><small>v2.2 • Grid Edition</small></div></div>
      <div class="row" style="gap:8px"><button id="sn" class="btn" data-do="snd">🔊</button><button class="btn" data-do="menu">☰</button></div>
    </div>
    <div id="c2" class="card"><div class="row"><span><i class="dot d2" style="margin-left:0"></i><b id="n2" style="font-size:14px">AI Bot (Medium)</b></span><span class="row" style="gap:10px"><b id="t2" class="clock hidden"></b><span id="w2" class="mut">10/10</span></span></div><div id="b2" class="bars"></div></div>
    <div id="c1" class="card"><div class="row"><span><i class="dot d1" style="margin-left:0"></i><b id="n1" style="font-size:14px">You (Player 1)</b></span><span class="row" style="gap:10px"><b id="t1" class="clock hidden"></b><span id="w1" class="mut">10/10</span></span></div><div id="b1" class="bars"></div></div>
    <div class="card row"><span><small>💎 GEMS THIS GAME</small><b id="gt" class="gold">0</b></span><small id="vl">+15 for victory</small></div>
    <div class="btns"><button class="btn" data-do="reset">↻ Restart</button><button class="btn" data-do="resign">⚑ Resign</button></div>
  </aside>
</main>

<div id="menu" class="ov"><div class="box">
  <h1>BLOCKADE BOX</h1>
  <p>Outsmart your opponent by crossing the grid and erecting neon walls.</p>
  <div class="total">💎 <small>TOTAL GEMS</small> <b id="tg" class="gold">0</b></div>
  <small>AI BOT DIFFICULTY</small>
  <div class="seg3">
    <button class="btn dbtn" data-do="diff:easy">Easy</button>
    <button class="btn dbtn" data-do="diff:medium">Medium</button>
    <button class="btn dbtn" data-do="diff:hard">Hard</button>
  </div>
  <small>CONTROLS</small>
  <div class="seg3"><button class="btn cbtn on" data-do="ctl:auto">Auto</button><button class="btn cbtn" data-do="ctl:pc">PC</button><button class="btn cbtn" data-do="ctl:mobile">Mobile</button></div>
  <button class="btn pri" data-do="start:bot">🤖 Play vs AI Bot</button>
  <button class="btn" data-do="start:local">👥 Pass &amp; Play (Local 1v1)</button>
  <button class="btn grn" data-do="online:quick">🌐 Online Matchmaking (Quick Match)</button>
  <div class="seg2"><button class="btn yel" data-do="online:create">🔑 Create Private Room</button><button class="btn yel" data-do="online:join">🚪 Join Room</button></div>
</div></div>

<div id="net" class="ov hidden" style="z-index:110"><div class="box">
  <h2 id="nt" style="font-size:26px">Online</h2>
  <div id="nc" class="gold" style="font-size:38px;letter-spacing:.25em;margin:4px 0 10px"></div>
  <p id="nm"></p>
  <input id="ni" class="inp hidden" maxlength="4" placeholder="CODE" autocomplete="off">
  <button id="nj" class="btn yel hidden" data-do="online:go">Join Room</button>
  <button class="btn" data-do="online:cancel">Cancel</button>
</div></div>

<div id="modal" class="ov hidden"><div class="box">
  <div id="mi" style="font-size:54px;line-height:1.2"></div>
  <h2 id="mt"></h2>
  <p id="ms"></p>
  <button class="btn pri" data-do="again">↻ Play Again</button>
  <button class="btn" data-do="lobby">🏠 Go to Lobby</button>
</div></div>

<script>
const $=i=>document.getElementById(i),D=[[1,0],[-1,0],[0,1],[0,-1]],goal={1:0,2:8};
const board=$('board'),st=$('st'),menu=$('menu'),modal=$('modal');
let W,pos,wl,gems,gm,turn,over,mode='bot',diff='medium',total=0,gen=0,ft,ctl='auto',ori='h',drag=null,skipUntil=0,ac,mute=false,tm,bs=1,bp={lane:4,lust:1,o:'h'},lastT=0,peer=null,conn=null,myP=1,netTok=0,nTimer=null,rx=false;
// 5-minute clock per player (multiplayer / Pass & Play only)
const fmt=ms=>{const s=Math.ceil(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
function showClock(){
  for(const p of[1,2]){
    const e=$('t'+p);e.textContent=fmt(tm[p]);
    e.className='clock'+(mode==='local'?'':' hidden')+(turn===p&&!over?' on':'')+(tm[p]<30000?' low':'');
  }
}
setInterval(()=>{
  const now=Date.now(),dt=Math.min(now-lastT,1000);lastT=now;
  if(!tm||mode!=='local'||over||!menu.classList.contains('hidden'))return;
  tm[turn]-=dt;
  if(tm[turn]<=0){tm[turn]=0;showClock();end(3-turn,`Time’s up! Player ${turn} ran out of time.`);return;}
  showClock();
},200);
try{total=+localStorage.getItem('bb_gems')||0;mute=localStorage.getItem('bb_mute')==='1';}catch(e){}
const save=()=>{try{localStorage.setItem('bb_gems',total);}catch(e){}};
const isMob=()=>ctl==='mobile'||(ctl==='auto'&&matchMedia('(hover:none),(pointer:coarse)').matches);
function applyCtl(){document.body.classList.toggle('mob',isMob());document.body.classList.toggle('pc',!isMob());render();}
// Sounds: small synthesized effects, no audio files needed
function tone(f,d,type,v,f2,t0){
  if(mute)return;
  try{
    ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();
    const t=ac.currentTime+(t0||0),o=ac.createOscillator(),g=ac.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
    g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);
    o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d+.02);
  }catch(e){}
}
const sfx={
  move:()=>tone(520,.08,'sine',.16,820),
  wall:()=>{tone(180,.16,'triangle',.35,70);tone(1100,.03,'square',.05);},
  gem:()=>{tone(988,.09,'sine',.14);tone(1480,.16,'sine',.14,0,.08);},
  bad:()=>tone(150,.14,'sawtooth',.09,90),
  ui:()=>tone(700,.04,'sine',.07),
  win:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.24,'triangle',.16,0,i*.11)),
  lose:()=>[392,330,262,196].forEach((f,i)=>tone(f,.26,'triangle',.16,0,i*.13))
};
const area=(t,r,c)=>t==='h'?`${2*r+2}/${2*c+1}/${2*r+3}/${2*c+4}`:`${2*r+1}/${2*c+2}/${2*r+4}/${2*c+3}`;
// Nearest wall position (grid intersection) under the finger/mouse
function slotAt(e){
  const R=board.getBoundingClientRect(),cs=getComputedStyle(board),g=parseFloat(cs.getPropertyValue('--g')),
    pd=parseFloat(cs.paddingLeft)+parseFloat(cs.borderLeftWidth),sp=(R.width-2*pd-8*g)/9+g,
    off=e.pointerType==='touch'?sp*.9:0,f=v=>Math.max(0,Math.min(7,Math.round((v+g/2)/sp)-1));
  return{r:f(e.clientY-R.top-pd-off),c:f(e.clientX-R.left-pd)};
}
function showPv(e){
  const{r,c}=slotAt(e),ok=!!wallOk(ori,r,c);
  let pv=board.querySelector('.pv');if(!pv){pv=document.createElement('div');board.appendChild(pv);}
  pv.className='pv '+(ok?'w'+turn:'bad');pv.style.gridArea=area(ori,r,c);drag.slot=ok?{r,c}:null;
}
const grid=()=>Array.from({length:8},()=>Array(8).fill(0));
const inb=(r,c)=>r>=0&&c>=0&&r<9&&c<9;
const human=()=>!over&&(mode==='local'||(mode==='online'?turn===myP:turn===1));

// Is there a wall between two neighbouring cells?
const blocked=(r,c,r2,c2)=>{
  if(r===r2){const m=Math.min(c,c2);return!!((r>0&&W.v[r-1][m])||(r<8&&W.v[r][m]));}
  const m=Math.min(r,r2);return!!((c>0&&W.h[m][c-1])||(c<8&&W.h[m][c]));
};
// Shortest path length to a goal row (walls only, pawns ignored)
const dist=(s,g)=>{
  const seen=new Set([s.r*9+s.c]),q=[[s.r,s.c,0]];
  for(let i=0;i<q.length;i++){
    const[r,c,d]=q[i];if(r===g)return d;
    for(const[a,b]of D){const y=r+a,x=c+b;
      if(inb(y,x)&&!seen.has(y*9+x)&&!blocked(r,c,y,x)){seen.add(y*9+x);q.push([y,x,d+1]);}}
  }
  return Infinity;
};
// Legal pawn moves, including jumping over the opponent
const moves=p=>{
  const me=pos[p],op=pos[3-p],o=[];
  for(const[a,b]of D){
    const r=me.r+a,c=me.c+b;
    if(!inb(r,c)||blocked(me.r,me.c,r,c))continue;
    if(r!==op.r||c!==op.c){o.push({r,c});continue;}
    const r2=r+a,c2=c+b;
    if(inb(r2,c2)&&!blocked(r,c,r2,c2)){o.push({r:r2,c:c2});continue;}
    for(const[e,f]of D){if(e*a+f*b)continue;const r3=r+e,c3=c+f;
      if(inb(r3,c3)&&!blocked(r,c,r3,c3))o.push({r:r3,c:c3});}
  }
  return o;
};
// Wall rules: no overlap, no crossing, nobody may be fully trapped
function wallOk(t,r,c){
  const o=t==='h'?'v':'h',[dr,dc]=t==='h'?[0,1]:[1,0];
  if(W[t][r][c]||W[o][r][c]||W[t][r+dr]?.[c+dc]||W[t][r-dr]?.[c-dc])return null;
  W[t][r][c]=9;
  const a=dist(pos[1],0),b=dist(pos[2],8);
  W[t][r][c]=0;
  return a<Infinity&&b<Infinity?{a,b}:null;
}
function move(r,c){
  if(over||!moves(turn).some(m=>m.r===r&&m.c===c))return;
  if(mode==='online'&&!rx)net({k:'m',r,c});
  pos[turn]={r,c};sfx.move();
  const i=gems.findIndex(g=>g.r===r&&g.c===c);
  if(i>-1){gems.splice(i,1);gm[turn]+=5;sfx.gem();}
  if(r===goal[turn])return end(turn);
  next();
}
function wall(t,r,c){
  if(over||wl[turn]<1)return;
  if(!wallOk(t,r,c)){sfx.bad();return flash('Can’t place a wall there');}
  if(mode==='online'&&!rx)net({k:'w',t,r,c});
  W[t][r][c]=turn;wl[turn]--;sfx.wall();next();
}
function next(){
  turn=3-turn;render();
  if(mode==='bot'&&turn===2&&!over){const g=gen;setTimeout(()=>{if(g===gen)bot();},350+Math.random()*500);}
}
function end(w,why){
  over=true;
  const loc=mode==='local',on=mode==='online',win=on?w===myP:(w===1||loc),who=loc?`Player ${w}`:on?(win?'You':'Your opponent'):w===1?'You':'The bot',bank=on?(win?30:0):win?gm[w]+15:0;
  total+=bank;save();render();win?sfx.win():sfx.lose();
  $('mi').textContent=win?'🏆':'💀';
  $('mt').textContent=loc?`Player ${w} Wins!`:on?(win?'Victory!':'Defeat'):w===1?'Victory!':'Defeat';
  $('mt').style.color=w===1?'#60a5fa':'#f87171';
  $('ms').textContent=(why||`${who} reached the finish line`)+(bank?` · +${bank} gems 💎 (total ${total})`:'');
  modal.classList.remove('hidden');
}
// Bot: scores every move/wall, then picks randomly among the good ones (more random on easy, tighter on hard).
// Each game also gets a random style (bs): runner, balanced or blocker.
const pick=(c,T)=>{
  const mx=Math.max(...c.map(x=>x.s)),w=c.map(x=>Math.exp((x.s-mx)/T));let u=Math.random()*w.reduce((a,b)=>a+b);
  return c[w.findIndex(x=>(u-=x)<=0)]||c[0];
};
const gd=p=>Math.min(99,...gems.map(g=>Math.abs(g.r-p.r)+Math.abs(g.c-p.c)));
function bot(){
  if(over||turn!==2)return;
  // Per-game personality (bp): favourite lane, gem appetite, wall orientation. Plus noise and occasional detours.
  const dm=dist(pos[2],8),dp=dist(pos[1],0),T={easy:3,medium:1.2,hard:.5}[diff],gp={easy:1.6,medium:.8,hard:.3}[diff]*bp.lust,g0=gd(pos[2]),
    nz={easy:3,medium:2,hard:1.2}[diff],eps={easy:.2,medium:.1,hard:.04}[diff],ws=[];
  const mv=moves(2).map(m=>({m,s:(dm-dist(m,8))*3+(g0-gd(m))*gp+(Math.abs(pos[2].c-bp.lane)-Math.abs(m.c-bp.lane))*.4+(Math.random()-.5)*nz}));
  if(Math.random()<eps){const alt=mv.filter(x=>dist(x.m,8)<=dm);if(alt.length>1){const a=alt[Math.floor(Math.random()*alt.length)];return move(a.m.r,a.m.c);}}
  if(wl[2]>0){
    const k=bs*(dp<=dm?1.3:dm+2<dp?.5:1)*{easy:.5,medium:1,hard:1.4}[diff],fun=Math.random()<{easy:.12,medium:.06,hard:.02}[diff];
    for(const t of'hv')for(let r=0;r<8;r++)for(let c=0;c<8;c++){
      const x=wallOk(t,r,c);if(!x)continue;
      const g=(x.a-dp)-(x.b-dm);
      if(g>0)ws.push({w:{t,r,c},s:g*3*k+(t===bp.o?.8:0)+(Math.random()-.5)*nz});
      else if(fun&&g===0&&Math.random()<.05)ws.push({w:{t,r,c},s:99});
    }
  }
  let list=mv;
  if(ws.length&&(!mv.length||Math.random()<1/(1+Math.exp((Math.max(...mv.map(x=>x.s))-Math.max(...ws.map(x=>x.s)))/T))))list=ws;
  if(!list.length)return next();
  const p=pick(list,list===ws?T*.6:T);
  if(p.w){W[p.w.t][p.w.r][p.w.c]=2;wl[2]--;sfx.wall();return next();}
  move(p.m.r,p.m.c);
}
function resign(){
  if(over)return;
  if(mode==='online'){net({k:'r'});return end(3-myP,'You resigned.');}
  mode==='local'?end(3-turn,`Player ${turn} resigned.`):end(2,'You resigned.');
}
function reset(){
  gen++;over=false;turn=1;gm={1:0,2:0};tm={1:300000,2:300000};lastT=Date.now();bs=[.5,1,1.6][Math.floor(Math.random()*3)];
  bp={lane:Math.floor(Math.random()*9),lust:[.4,1,1.8][Math.floor(Math.random()*3)],o:Math.random()<.5?'h':'v'};
  pos={1:{r:8,c:4},2:{r:0,c:4}};wl={1:10,2:10};
  W={h:grid(),v:grid()};
  gems=[{r:4,c:2},{r:4,c:6},{r:2,c:4},{r:6,c:4}];
  modal.classList.add('hidden');render();
}
function start(m){
  netClose();mode=m;
  $('n2').textContent=m==='bot'?`AI Bot (${diff[0].toUpperCase()+diff.slice(1)})`:'Player 2';
  $('n1').textContent=m==='bot'?'You (Player 1)':'Player 1';
  menu.classList.add('hidden');reset();
}
function setDiff(d){
  diff=d;
  document.querySelectorAll('.dbtn').forEach(b=>b.classList.toggle('on',b.dataset.do==='diff:'+d));
}
function flash(m){st.textContent=m;clearTimeout(ft);ft=setTimeout(render,1500);}
function render(){
  const mv=human()?moves(turn):[],can=human()&&wl[turn]>0&&!isMob();
  let h='';
  for(let r=0;r<9;r++)for(let c=0;c<9;c++){
    const p=pos[1].r===r&&pos[1].c===c?1:pos[2].r===r&&pos[2].c===c?2:0;
    const ok=mv.some(m=>m.r===r&&m.c===c);
    h+=`<div class="t${r===0?' g2':r===8?' g1':''}${ok?' ok':''}" style="grid-area:${2*r+1}/${2*c+1}"${ok?` data-do="m:${r},${c}"`:''}>${p?`<i class="pawn p${p}"></i>`:gems.some(g=>g.r===r&&g.c===c)?'<b class="gem">💎</b>':''}</div>`;
  }
  for(const t of'hv')for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const o=W[t][r][c],a=t==='h'?`${2*r+2}/${2*c+1}/${2*r+3}/${2*c+4}`:`${2*r+1}/${2*c+2}/${2*r+4}/${2*c+3}`;
    if(o)h+=`<div class="w w${o}" style="grid-area:${a}"></div>`;
    else if(can)h+=`<div class="s" style="grid-area:${a}" data-do="${t}:${r},${c}"></div>`;
  }
  board.className='board p'+turn;board.innerHTML=h;
  for(const p of[1,2]){
    $('w'+p).textContent=wl[p]+'/10';
    $('b'+p).innerHTML=Array.from({length:10},(_,i)=>`<i class="seg${i<wl[p]?' f'+p:''}"></i>`).join('');
    $('c'+p).className='card'+(turn===p&&!over?' on'+p:'');
  }
  $('gt').textContent=mode!=='bot'?`${gm[1]} – ${gm[2]}`:gm[1];$('tg').textContent=total;
  $('oh').classList.toggle('on',ori==='h');$('ov').classList.toggle('on',ori==='v');
  document.documentElement.style.setProperty('--tc',turn===1?'var(--p1)':'var(--p2)');
  $('vl').textContent=mode==='online'?'+30 for victory':'+15 for victory';
  st.textContent=over?'Game over':mode==='online'?(turn===myP?'Your Turn':'Opponent’s Turn'):turn===1?(mode==='bot'?'Your Turn':'Player 1’s Turn'):(mode==='bot'?'Bot thinking…':'Player 2’s Turn');
  st.className='pill c'+turn;if(tm)showClock();
}
document.addEventListener('click',e=>{
  if(Date.now()<skipUntil)return;
  const b=e.target.closest('[data-do]');if(!b)return;
  const[a,v='']=b.dataset.do.split(':'),[r,c]=v.split(',').map(Number);
  if('mhv'.indexOf(a)<0)sfx.ui();
  if(a==='m'){if(human())move(r,c);}
  else if(a==='h'||a==='v'){if(human())wall(a,r,c);}
  else if(a==='diff')setDiff(v);
  else if(a==='start')start(v);
  else if(a==='menu')menu.classList.remove('hidden');
  else if(a==='online')onl(v);
  else if(a==='reset'||a==='again'){
    if(mode==='online'){if(a==='again'){netClose();mode='bot';modal.classList.add('hidden');reset();menu.classList.remove('hidden');}else flash('Restart isn’t available online');}
    else reset();
  }
  else if(a==='resign')resign();
  else if(a==='ori'){ori=v;render();}
  else if(a==='ctl'){ctl=v;document.querySelectorAll('.cbtn').forEach(x=>x.classList.toggle('on',x.dataset.do==='ctl:'+v));applyCtl();}
  else if(a==='snd'){mute=!mute;try{localStorage.setItem('bb_mute',mute?'1':'0');}catch(e){}$('sn').textContent=mute?'🔇':'🔊';}
  else if(a==='lobby'){netClose();if(mode==='online')mode='bot';reset();menu.classList.remove('hidden');}
});
// Mobile wall placement: pick Horizontal/Vertical, then hold & drag on the board and release to place
board.addEventListener('pointerdown',e=>{if(isMob()&&human()&&wl[turn]>0)drag={x:e.clientX,y:e.clientY,on:false,slot:null};});
board.addEventListener('pointermove',e=>{
  if(!drag)return;
  if(!drag.on&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<8)return;
  drag.on=true;showPv(e);
});
const endDrag=e=>{
  const d=drag;drag=null;if(!d)return;
  board.querySelector('.pv')?.remove();
  if(!d.on)return;
  skipUntil=Date.now()+80;
  if(e.type!=='pointerup')return;
  if(d.slot)wall(ori,d.slot.r,d.slot.c);else{sfx.bad();flash('Can’t place a wall there');}
};
['pointerup','pointercancel','pointerleave'].forEach(t=>board.addEventListener(t,endDrag));
// ---- Online play: PeerJS peer-to-peer, no backend. Everything is wrapped so bot/local modes never depend on it ----
const ALPHA='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',PFX='bbox2-',QN=4,rnd=n=>Math.floor(Math.random()*n),
  soft=e=>!!e&&['peer-unavailable','dial-timeout','unavailable-id','webrtc','negotiation-failed','connection-failed','server-error','socket-error','timeout','network'].includes(e.type),
  msg=e=>{
    if(e&&['peer-unavailable','dial-timeout'].includes(e.type))return 'Room not found or the host is offline. Check the code and try again.';
    if(e&&e.type==='nolib')return 'PeerJS could not load. Check your internet connection or allow cdn.jsdelivr.net.';
    if(e&&e.type==='unavailable-id')return 'That room code is already in use. Generating a fresh code…';
    if(e&&e.type==='timeout')return 'The public PeerJS signaling server did not respond in time. Check your connection, VPN/firewall, or try again shortly. Bot and local play still work.';
    return 'Could not connect to the public PeerJS signaling server (0.peerjs.com:443). It may be blocked by your network, browser, VPN, or firewall. Bot and local 2-player modes still work.';
  };
function netUI(t,m,code,join){
  $('nt').textContent=t;$('nm').textContent=m;$('nc').textContent=code||'';
  $('ni').classList.toggle('hidden',!join);$('nj').classList.toggle('hidden',!join);$('net').classList.remove('hidden');
}
function drop(){clearTimeout(nTimer);try{conn&&conn.close();}catch(e){}try{peer&&peer.destroy();}catch(e){}conn=peer=null;}
function netClose(){netTok++;drop();}
function net(d){try{if(conn&&conn.open)conn.send(d);}catch(e){flash('Connection problem');}}
function netFail(m){netClose();netUI('Online unavailable',m||msg());}
function mkPeer(id,tok,ok,err){
  if(typeof Peer==='undefined')return err({type:'nolib'});
  let p,done=false;
  const fin=(f,a)=>{
    if(done)return;done=true;clearTimeout(to);
    if(tok!==netTok){try{p&&p.destroy();}catch(e){}return;}
    f(a);
  };
  const to=setTimeout(()=>{try{p&&p.destroy();}catch(e){}fin(err,{type:'timeout'});},15000);
  try{
    // Use PeerJS's public cloud broker explicitly over HTTPS/WSS.
    p=new Peer(id||undefined,{host:'0.peerjs.com',port:443,path:'/',secure:true,debug:0});
    p.on('open',()=>fin(ok,p));
    p.on('error',e=>{if(!done){try{p.destroy();}catch(x){}fin(err,e||{type:'server-error'});}});
    p.on('disconnected',()=>{if(!done){try{p.reconnect();}catch(e){}}});
  }catch(e){fin(err,e);}
}
function dial(id,tok,ok,err){
  mkPeer(null,tok,p=>{
    let done=false;
    const fin=(f,a)=>{
      if(done)return;done=true;clearTimeout(to);
      if(tok!==netTok){try{p.destroy();}catch(e){}return;}
      f(a);
    },to=setTimeout(()=>{try{p.destroy();}catch(e){}fin(err,{type:'dial-timeout'});},7000);
    p.on('error',e=>{try{p.destroy();}catch(x){}fin(err,e);});
    try{const c=p.connect(id,{reliable:true});c.on('open',()=>fin(ok,{p,c}));c.on('error',e=>fin(err,e));}
    catch(e){fin(err,e);}
  },err);
}
// Host (role 1 = blue, moves first) tells the guest 'go'; guest (role 2 = red) starts when it hears it
function link(p,c,role,lost){
  const tk=netTok;let on=role===1,dead=false;
  const lose=()=>{if(dead)return;dead=true;clearTimeout(nTimer);on?onClose():lost&&lost();};
  peer=p;conn=c;
  c.on('data',d=>{if(tk!==netTok)return;if(!on&&d&&d.k==='go'){on=true;clearTimeout(nTimer);startOnline(2);}else if(on)onData(d);});
  c.on('close',()=>{if(tk===netTok)lose();});
  p.on('error',()=>{});p.on('disconnected',()=>{try{p.reconnect();}catch(e){}});
  if(role===1){net({k:'go'});startOnline(1);}
  else nTimer=setTimeout(()=>{if(!on){try{c.close();}catch(e){}lose();}},6000);
}
function startOnline(role){
  clearTimeout(nTimer);myP=role;mode='online';
  $('n1').textContent=role===1?'You (Player 1)':'Opponent (Player 1)';
  $('n2').textContent=role===2?'You (Player 2)':'Opponent (Player 2)';
  $('net').classList.add('hidden');menu.classList.add('hidden');reset();
}
function onData(d){
  if(!d||over)return;rx=true;
  try{
    if(d.k==='m'&&turn!==myP)move(d.r,d.c);
    else if(d.k==='w'&&turn!==myP)wall(d.t,d.r,d.c);
    else if(d.k==='r')end(myP,'Your opponent resigned.');
  }catch(e){}finally{rx=false;}
}
function onClose(){if(mode==='online'&&!over)end(myP,'Your opponent disconnected.');}
// Quick Match: fixed public slot IDs act as the pool. Try to join a waiting slot; otherwise wait in one, then rescan.
function quick(){
  const tok=++netTok,order=[...Array(QN).keys()].sort(()=>Math.random()-.5);let i=0;
  netUI('Quick Match','Searching for an opponent…');
  const again=()=>{drop();if(tok===netTok)nTimer=setTimeout(scan,300+rnd(1200));},
  scan=()=>{
    if(tok!==netTok)return;
    if(i>=QN){i=0;return claim();}
    dial(PFX+order[i++],tok,r=>link(r.p,r.c,2,again),e=>soft(e)?scan():netFail(msg(e)));
  },
  claim=()=>mkPeer(PFX+order[rnd(QN)],tok,p=>{
    peer=p;p.on('error',()=>{});
    p.on('connection',c=>c.on('open',()=>{if(conn||tok!==netTok){c.close();return;}clearTimeout(nTimer);link(p,c,1);}));
    nTimer=setTimeout(()=>{if(!conn)again();},8000);
  },e=>soft(e)?again():netFail(msg(e)));
  scan();
}
function create(attempt=0){
  const tok=netTok,code=Array.from({length:4},()=>ALPHA[rnd(ALPHA.length)]).join('');
  netUI('Private Room','Connecting to the public PeerJS signaling server…');
  mkPeer('bbroom-'+code,tok,p=>{
    peer=p;netUI('Private Room','Share this code with your friend and wait for them to join…',code);
    p.on('connection',c=>c.on('open',()=>{if(conn||tok!==netTok){c.close();return;}link(p,c,1);}));
    p.on('error',e=>{if(tok===netTok&&!conn)netFail(msg(e));});
  },e=>{
    // Retry transient broker failures with a new room ID; never recurse forever.
    if(tok===netTok&&attempt<2&&e&&['unavailable-id','timeout','server-error','socket-error','network','disconnected'].includes(e.type)){
      netUI('Retrying room creation',`PeerJS connection attempt ${attempt+2} of 3…`);
      setTimeout(()=>{if(tok===netTok)create(attempt+1);},700*(attempt+1));
    }else netFail(msg(e));
  });
}
function join(code){
  code=code.toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(code.length!==4){$('nm').textContent='Enter the 4-character room code.';return;}
  netClose();const tok=++netTok;netUI('Joining room…','Connecting…',code);
  dial('bbroom-'+code,tok,r=>link(r.p,r.c,2,()=>netFail('Couldn’t enter that room.')),e=>netFail(msg(e)));
}
function onl(v){
  try{
    if(v==='quick'){netClose();quick();}
    else if(v==='create'){netClose();create();}
    else if(v==='join'){netClose();netUI('Join Room','Enter the 4-character room code.','',true);setTimeout(()=>$('ni').focus(),50);}
    else if(v==='go')join($('ni').value);
    else if(v==='cancel'){netClose();$('net').classList.add('hidden');if(mode==='online'){mode='bot';reset();}menu.classList.remove('hidden');}
  }catch(e){netFail(msg(e));}
}
$('ni').addEventListener('keydown',e=>{if(e.key==='Enter')join($('ni').value);});
setDiff('medium');reset();applyCtl();$('sn').textContent=mute?'🔇':'🔊';
</script>
</body>
</html>
