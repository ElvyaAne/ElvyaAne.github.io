// Hobbies page: night sky, sudoku trophies and the playable puzzle.
(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);
// Twinkling night sky behind the page.
const nc = $('night'), nx = nc.getContext('2d');
let W, H, stars = [];
function size(){
  const dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
  nc.width = W*dpr; nc.height = H*dpr; nx.setTransform(dpr,0,0,dpr,0,0);
  stars = Array.from({length: Math.round(W*H/2600)}, () => ({x:Math.random()*W, y:Math.random()*H, r:Math.random()<.92 ? Math.random()+.3 : Math.random()*1.4+1, p:Math.random()*6.28, s:.4+Math.random()*1.4, z:Math.random()}));
}
function draw(t){
  nx.clearRect(0,0,W,H);
  for (const s of stars){
    const tw = reduce ? .8 : .55 + .45*Math.sin(t/1000*s.s + s.p);
    const y = ((s.y - scrollY*s.z*.08) % H + H) % H;
    nx.fillStyle = `rgba(234,244,255,${(.3+s.z*.7)*tw})`;
    nx.beginPath(); nx.arc(s.x, y, s.r, 0, 6.29); nx.fill();
  }
  if (!reduce) requestAnimationFrame(draw);
}
size(); addEventListener('resize', () => { size(); if (reduce) draw(0); }); requestAnimationFrame(draw);
if (reduce) addEventListener('scroll', () => draw(0), {passive:true});

const tw = document.querySelector('.trophies');
if (tw){
  // daily-challenge trophies: every month from Jan 2022 through Nov 2024
  const M = 'JFMAMJJASOND';
  tw.innerHTML = '<span></span>' + [...M].map(m => `<span class="ml">${m}</span>`).join('')
    + [2022, 2023, 2024].map(y => `<span class="yr">${y}</span>` + [...M].map((m, i) => {
        const got = y < 2024 || i < 11;
        return `<i${got ? '' : ' class="no"'} title="${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]} ${y}${got ? ': trophy' : ''}"></i>`;
      }).join('')).join('');
}
const root = document.getElementById('sudoku');
if (!root) return;
const grid = root.querySelector('.sgrid'), pad = root.querySelector('.spad'), info = root.querySelector('.sinfo'), clock = root.querySelector('.stime');

const BOX = i => ((i/27|0)*3 + (i%9/3|0));
const PEERS = Array.from({length:81}, (_, i) => {
  const s = new Set();
  for (let j=0;j<81;j++) if (j!==i && (j/9|0)===(i/9|0) || j!==i && j%9===i%9 || j!==i && BOX(j)===BOX(i)) s.add(j);
  return [...s];
});
const shuffle = a => { for (let i=a.length-1;i>0;i--){ const j = Math.random()*(i+1)|0; [a[i],a[j]] = [a[j],a[i]]; } return a; };

// count solutions (stops at `cap`); fills `out` with the first one found
function solve(g, cap, out){
  let n = 0;
  (function go(){
    let best = -1, bm = 0, bc = 10;
    for (let i=0;i<81;i++) if (!g[i]){
      let m = 0x3fe; for (const p of PEERS[i]) m &= ~(1<<g[p]);
      let c = 0; for (let v=m; v; v&=v-1) c++;
      if (c < bc){ bc = c; best = i; bm = m; if (!c) return; }
    }
    if (best < 0){ n++; if (out && n===1) out.splice(0, 81, ...g); return; }
    const ds = []; for (let d=1; d<=9; d++) if (bm & (1<<d)) ds.push(d);
    for (const d of (out && n===0 ? shuffle(ds) : ds)){ g[best] = d; go(); g[best] = 0; if (n >= cap) return; }
  })();
  return n;
}
function make(clues){
  const sol = []; solve(Array(81).fill(0), 1, sol);
  const g = sol.slice();
  let left = 81;
  for (const i of shuffle([...Array(81).keys()])){
    if (left <= clues) break;
    const v = g[i]; g[i] = 0;
    if (solve(g.slice(), 2) !== 1) g[i] = v; else left--;
  }
  return {g, sol};
}

const LEVELS = {easy:40, medium:33, hard:27};
let level = 'medium', P, cur, sel = -1, t0 = 0, done = false, timer;

const cells = Array.from({length:81}, (_, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'sc'; b.dataset.i = i;
  const r = i/9|0, c = i%9;
  if (c===2 || c===5) b.classList.add('br'); if (r===2 || r===5) b.classList.add('bb');
  grid.appendChild(b); return b;
});

function fmt(s){ return `${s/60|0}:${String(s%60).padStart(2,'0')}`; }
function startClock(){ clearInterval(timer); t0 = Date.now(); clock.textContent = '0:00'; timer = setInterval(() => { if (!done && !document.hidden) clock.textContent = fmt((Date.now()-t0)/1000|0); }, 1000); }

function fresh(){
  P = make(LEVELS[level]); cur = P.g.slice(); done = false; sel = -1;
  root.classList.remove('solved');
  info.textContent = `${level} · ${P.g.filter(Boolean).length} clues`;
  startClock(); paint();
}
function paint(){
  const sv = sel >= 0 ? cur[sel] : 0, peers = sel >= 0 ? new Set(PEERS[sel]) : null;
  cells.forEach((b, i) => {
    const v = cur[i], given = !!P.g[i];
    b.textContent = v || '';
    b.classList.toggle('given', given);
    b.classList.toggle('sel', i===sel);
    b.classList.toggle('peer', !!peers && peers.has(i));
    b.classList.toggle('same', !!sv && v===sv && i!==sel);
    b.classList.toggle('bad', !given && !!v && PEERS[i].some(p => cur[p]===v));
    const r = (i/9|0)+1, c = i%9+1;
    b.setAttribute('aria-label', `row ${r} column ${c}, ${v ? v : 'empty'}${given ? ', given' : ''}`);
  });
  pad.querySelectorAll('[data-n]').forEach(k => { const n = +k.dataset.n; k.classList.toggle('full', n>0 && cur.filter(v => v===n).length >= 9); });
}
function put(n){
  if (done || sel < 0 || P.g[sel]) return;
  cur[sel] = cur[sel]===n ? 0 : n; paint();
  if (cur.every((v,i) => v===P.sol[i])) win();
}
function win(){
  done = true; clearInterval(timer);
  const s = (Date.now()-t0)/1000|0;
  info.textContent = `solved in ${fmt(s)} ✦`;
  root.classList.add('solved');
  if (!reduce) cells.forEach((b, i) => { b.style.animationDelay = `${((i/9|0)+i%9)*28}ms`; });
}
function pick(i){ sel = i; paint(); cells[i].focus({preventScroll:true}); }

grid.addEventListener('click', e => { const b = e.target.closest('.sc'); if (b) pick(+b.dataset.i); });
grid.addEventListener('keydown', e => {
  if (sel < 0) return;
  const k = e.key, r = sel/9|0, c = sel%9;
  const mv = {ArrowUp:[-1,0], ArrowDown:[1,0], ArrowLeft:[0,-1], ArrowRight:[0,1]}[k];
  if (mv){ e.preventDefault(); pick(((r+mv[0]+9)%9)*9 + (c+mv[1]+9)%9); return; }
  if (/^[1-9]$/.test(k)){ e.preventDefault(); put(+k); return; }
  if (k==='Backspace' || k==='Delete' || k==='0'){ e.preventDefault(); put(0); }
});
pad.addEventListener('click', e => { const k = e.target.closest('[data-n]'); if (k){ put(+k.dataset.n); if (sel >= 0) cells[sel].focus({preventScroll:true}); } });
root.querySelectorAll('[data-lv]').forEach(b => b.addEventListener('click', () => {
  level = b.dataset.lv;
  root.querySelectorAll('[data-lv]').forEach(x => x.setAttribute('aria-pressed', x===b));
  fresh();
}));
root.querySelector('.snew').addEventListener('click', fresh);

fresh();
})();
