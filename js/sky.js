(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);


const stops = [[0,'#091725','#153350'],[.3,'#0c1e30','#1d4266'],[.62,'#132c45','#2f5d8c'],[.8,'#204972','#5885b8'],[1,'#3f6c9e','#ffb59a']];
const hex = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
const mix = (a,b,t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v,i) => Math.round(v+(B[i]-v)*t)).join(',')})`; };
let dawn = 0, prog = 0;
function atmo(){
  const max = document.documentElement.scrollHeight - innerHeight; prog = max > 0 ? Math.min(1, Math.max(0, scrollY/max)) : 0;
  let i = 0; while (i < stops.length-2 && prog > stops[i+1][0]) i++;
  const [p0,a0,b0] = stops[i], [p1,a1,b1] = stops[i+1], t = (prog-p0)/(p1-p0);
  $('atmo').style.background = `linear-gradient(180deg,${mix(a0,a1,t)},${mix(b0,b1,t)})`;
  dawn = Math.max(0, Math.min(1, (prog-.72)/.28));
  document.documentElement.style.setProperty('--navA', (.82 - dawn*.6).toFixed(3));
}


const nc = $('night'), nx = nc.getContext('2d');
let NW, NH, nstars = [], nshoots = [];
function nsize(){
  const dpr = Math.min(devicePixelRatio||1,2); NW = innerWidth; NH = innerHeight;
  nc.width = NW*dpr; nc.height = NH*dpr; nx.setTransform(dpr,0,0,dpr,0,0);
  nstars = Array.from({length: Math.round(NW*NH/2600)}, () => ({x:Math.random()*NW, y:Math.random()*NH, r:Math.random()<.92?Math.random()*1+.3:Math.random()*1.4+1, p:Math.random()*6.28, s:.4+Math.random()*1.4, z:Math.random()}));
}
function ndraw(t){
  nx.clearRect(0,0,NW,NH);
  const fade = 1 - dawn*.92, sy = scrollY;
  for (const s of nstars){
    const tw = reduce ? .8 : .55 + .45*Math.sin(t/1000*s.s + s.p);
    const y = ((s.y - sy*s.z*.08) % NH + NH) % NH;
    let a = (.3+s.z*.7)*tw*fade, rad = s.r;
    const b = window.__beam;
    if (b){ const dx = s.x-b.x, dy = y-b.y, d = Math.hypot(dx,dy);
      if (d > 20){ let df = Math.atan2(dy,dx) - b.a; df = Math.atan2(Math.sin(df), Math.cos(df));
        const k = Math.max(0, 1 - Math.abs(df)/(b.s*1.3)) * Math.max(.25, 1 - d/b.L);
        if (k > 0){ a = Math.min(1, a + k*.9); rad *= 1 + k*1.1; if (k > .35){ nx.fillStyle = `rgba(255,244,228,${k*.25})`; nx.beginPath(); nx.arc(s.x, y, rad*3.2, 0, 6.29); nx.fill(); } } } }
    nx.fillStyle = `rgba(234,244,255,${a})`;
    nx.beginPath(); nx.arc(s.x, y, rad, 0, 6.29); nx.fill();
  }
  for (const s of nshoots){
    const g = nx.createLinearGradient(s.x, s.y, s.x - s.vx*14, s.y - s.vy*14);
    g.addColorStop(0, `rgba(255,255,255,${s.life*fade})`); g.addColorStop(1, 'rgba(184,218,255,0)');
    nx.strokeStyle = g; nx.lineWidth = 2; nx.beginPath(); nx.moveTo(s.x, s.y); nx.lineTo(s.x - s.vx*14, s.y - s.vy*14); nx.stroke();
    s.x += s.vx; s.y += s.vy; s.life -= .013;
  }
  nshoots = nshoots.filter(s => s.life > 0 && !s.caught);
  rideDraw();
  scene(t);
  requestAnimationFrame(ndraw);
}


(function moon(){
  const syn = 29.530588853, age = (((Date.now() - Date.UTC(2000,0,6,18,14))/864e5) % syn + syn) % syn;
  const r = 40, k = Math.cos(2*Math.PI*age/syn), waxing = age < syn/2, rx = Math.max(.01, Math.abs(k)*r);
  const limbSweep = waxing ? 1 : 0, termSweep = (k > 0) === waxing ? 0 : 1;
  const d = `M0 ${-r}A${r} ${r} 0 0 ${limbSweep} 0 ${r}A${rx.toFixed(2)} ${r} 0 0 ${termSweep} 0 ${-r}Z`;
  $('moonlit').setAttribute('d', d);
  $('mTerm').setAttribute('d', `M0 ${r}A${rx.toFixed(2)} ${r} 0 0 ${termSweep} 0 ${-r}`);
  const ill = Math.round((1-k)/2*100);
  $('moonsvg').setAttribute('aria-label', `Tonight's moon: ${ill}% lit, ${waxing ? 'waxing' : 'waning'}`);
})();


const land = $('land'), lsvg = land.querySelector('svg'), scope = $('scope'), lyrs = [...land.querySelectorAll('.lyr')];
let ang = -38, angT = -38, cur = null;
document.addEventListener('pointerleave', () => cur = null);
window.__beam = null;
const aim = e => {
  const r = $('observatory').getBoundingClientRect();
  cur = (e.clientY < r.bottom && e.clientY > r.top) ? {x:e.clientX, y:e.clientY} : null;
  if (!cur) return;
  const m = lsvg.getScreenCTM(); if (!m) return;
  const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
  angT = Math.max(-172, Math.min(-8, Math.atan2(p.y-212, p.x-985)*180/Math.PI));
  if (!reduce){ const dx = (e.clientX/innerWidth - .5); lyrs.forEach(l => l.style.transform = `translateX(${-dx*l.dataset.d}px)`); }
};
document.addEventListener('pointermove', aim);
document.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') aim(e); });

let ride = null, rparts = [], swallowClick = false;
function segDist(px, py, s){
  const ax = s.x, ay = s.y, bx = s.x - s.vx*14, by = s.y - s.vy*14, dx = bx-ax, dy = by-ay;
  const t = Math.max(0, Math.min(1, ((px-ax)*dx + (py-ay)*dy) / (dx*dx + dy*dy || 1)));
  return Math.hypot(px - (ax + dx*t), py - (ay + dy*t));
}
function findStar(cx, cy){
  for (const s of nshoots) if (s.life > .2 && segDist(cx, cy, s) < 34) return {s, ox:0, oy:0, list:'n'};
  const ss = window.__skyShoots, sky = document.getElementById('sky');
  if (ss && sky){ const r = sky.getBoundingClientRect(); for (const s of ss) if (s.life > .2 && segDist(cx - r.left, cy - r.top, s) < 34) return {s, ox:r.left, oy:r.top}; }
  return null;
}
function nextStop(docY){
  const tops = ['constellation','range','dawn'].map(id => $(id).getBoundingClientRect().top + scrollY);
  const max = document.documentElement.scrollHeight - innerHeight;
  for (const t of tops) if (t > docY + innerHeight*.35) return Math.min(t, max + innerHeight*.45);
  return max + innerHeight*.45;
}
function startRide(hit){
  const s = hit.s; s.caught = true;
  const x = s.x + hit.ox, dy = s.y + hit.oy + scrollY;
  const sp = Math.hypot(s.vx, s.vy) || 9;
  ride = {x, dy, vx: s.vx/sp*4, vy: Math.max(2, s.vy/sp*4), trail: [], t0: performance.now(), stop: nextStop(dy), y0: dy};
  document.documentElement.style.cursor = '';
  burstAt(x, dy, 18);
}
function burstAt(x, dy, n){ for (let i=0;i<n;i++){ const a = Math.random()*6.28, sp = 1+Math.random()*4; rparts.push({x, dy, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, life:1, r:1+Math.random()*2, c:['255,255,255','184,218,255','155,238,255','196,255,247'][i%4]}); } }
function rideDraw(){
  if (ride){
    const left = ride.stop - ride.dy, total = Math.max(1, ride.stop - ride.y0), p = 1 - left/total;
    const speed = 5 + 16*Math.sin(Math.min(1, p)*Math.PI) ;
    ride.vy += (1 - ride.vy)*.04; ride.vx *= .985;
    const n = Math.hypot(ride.vx, ride.vy) || 1;
    ride.x += ride.vx/n*speed*.35; ride.dy += Math.max(1.2, ride.vy/n*speed);
    ride.x = Math.max(40, Math.min(innerWidth-40, ride.x));
    ride.trail.push({x:ride.x, dy:ride.dy}); if (ride.trail.length > 40) ride.trail.shift();
    window.scrollTo(0, ride.dy - innerHeight*.42);
    if (Math.random() < .6) rparts.push({x:ride.x, dy:ride.dy, vx:(Math.random()-.5)*1.2, vy:-Math.random()*1.5, life:1, r:.8+Math.random()*1.6, c:['255,255,255','184,218,255','155,238,255','196,255,247'][Math.random()*4|0]});
    if (ride.dy >= ride.stop){ burstAt(ride.x, ride.dy, 44); ride = null; }
  }
  const sy = scrollY;
  if (ride){
    for (let i=1;i<ride.trail.length;i++){
      const a = i/ride.trail.length, q = ride.trail[i-1], r = ride.trail[i];
      nx.strokeStyle = `rgba(184,218,255,${a*.7})`; nx.lineWidth = a*7; nx.lineCap = 'round';
      nx.beginPath(); nx.moveTo(q.x, q.dy-sy); nx.lineTo(r.x, r.dy-sy); nx.stroke();
      nx.strokeStyle = `rgba(255,255,255,${a})`; nx.lineWidth = a*2.2;
      nx.beginPath(); nx.moveTo(q.x, q.dy-sy); nx.lineTo(r.x, r.dy-sy); nx.stroke();
    }
    const hx = ride.x, hy = ride.dy - sy, g = nx.createRadialGradient(hx,hy,0,hx,hy,30);
    g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.25,'rgba(155,238,255,.6)'); g.addColorStop(1,'rgba(184,218,255,0)');
    nx.fillStyle = g; nx.beginPath(); nx.arc(hx,hy,30,0,6.29); nx.fill();
  }
  for (const p of rparts){
    nx.fillStyle = `rgba(${p.c},${p.life})`; nx.beginPath(); nx.arc(p.x, p.dy-sy, p.r*p.life, 0, 6.29); nx.fill();
    p.x += p.vx; p.dy += p.vy; p.vx *= .95; p.vy *= .95; p.life -= .02;
  }
  rparts = rparts.filter(p => p.life > 0);
}
document.addEventListener('pointerdown', e => {
  if (ride || e.button !== 0 || e.target.closest('a,button,.win')) return;
  const hit = findStar(e.clientX, e.clientY);
  if (!hit) return;
  e.preventDefault(); e.stopPropagation(); swallowClick = true;
  if (reduce){ const stop = nextStop(e.clientY + scrollY); window.scrollTo({top: stop - innerHeight*.42}); return; }
  startRide(hit);
}, true);
document.addEventListener('click', e => { if (swallowClick){ swallowClick = false; e.stopPropagation(); e.preventDefault(); } }, true);
addEventListener('wheel', () => { if (ride){ burstAt(ride.x, ride.dy, 20); ride = null; } }, {passive:true});
addEventListener('touchmove', () => { if (ride){ ride = null; } }, {passive:true});
document.addEventListener('pointermove', e => {
  if (ride || e.pointerType !== 'mouse') return;
  document.documentElement.style.cursor = findStar(e.clientX, e.clientY) ? 'pointer' : '';
});
if (!reduce) setInterval(() => { if (!document.hidden && dawn < .6 && !ride) nshoots.push({x: Math.random()*NW*.6, y: Math.random()*NH*.35, vx: 6.5+Math.random()*2, vy: 2.6+Math.random()*1.6, life: 1}); }, 6500);

$('observatory').addEventListener('click', e => {
  if (e.target.closest('a')) return;
  nshoots.push({x:e.clientX - 60, y:e.clientY - 40, vx:7, vy:2.8, life:1});
});


const mkR = () => { let s = 20261017; return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const MED = new Set([30,31,44,46,50,53,56,58,61]), HARD = 9, BASE = 300;
let peaks = [], firstMed = -1, firstHard = -1;
function kindsFor(E, M, H){
  const want = {easy:E, medium:M, hard:H}, got = {easy:0, medium:0, hard:0}, out = [];
  for (let i=0;i<62;i++){ const k = i===HARD ? 'hard' : MED.has(i) ? 'medium' : 'easy'; if (got[k] < want[k]){ out.push(k); got[k]++; } }
  const left = () => (want.easy-got.easy) + (want.medium-got.medium) + (want.hard-got.hard);
  while (left() > 0) for (const k of ['easy','easy','easy','medium','easy','hard']) if (got[k] < want[k]){ out.push(k); got[k]++; }
  return out;
}
const ridgeY = (x, sc=1) => { let m = 10 + 6*Math.sin(x/53) + 4*Math.sin(x/17); for (const p of peaks){ const d = (x-p.x)/p.w; if (Math.abs(d) < 4) m = Math.max(m, p.h*sc*Math.exp(-d*d/2)); } return BASE - m; };
const pathOf = (sc, dx) => { let d = `M0 320L0 ${ridgeY(0,sc).toFixed(1)}`; for (let x=2;x<=1000;x+=2) d += `L${x} ${(ridgeY(x-dx,sc)).toFixed(1)}`; return d + 'L1000 320Z'; };
function buildRange(st){
  const R = mkR(), kinds = kindsFor(st.easy|0, st.medium|0, st.hard|0), n = Math.max(2, kinds.length), squeeze = Math.max(.4, Math.min(1, 62/n));
  peaks = kinds.map((kind, i) => {
    const h = kind==='hard' ? 238 : kind==='medium' ? 100 + R()*48 : 26 + R()*44;
    return {i, kind, x: 22 + i*(956/(n-1)) + (R()-.5)*6*squeeze, h, w: (kind==='hard' ? 17 : kind==='medium' ? 12.5 : 8.5)*squeeze};
  });
  firstMed = kinds.indexOf('medium'); firstHard = kinds.indexOf('hard');
  $('ridgeBack').setAttribute('d', pathOf(.62, -9));
  const front = pathOf(1, 0); $('ridgeFront').setAttribute('d', front); $('ridgeLine').setAttribute('d', front.replace(/^M0 320L/, 'M').replace(/L1000 320Z$/, ''));
  drawPeaks();
}
const ridge = $('ridge'), tip = $('tip'), box = $('ridgebox'); let hi = null;
const col = {easy:'#eaf4ff', medium:'#9beeff', hard:'#c4fff7'};
function drawPeaks(){ $('peaks').innerHTML = peaks.map(p => {
  const y = BASE - p.h - 7;
  const flag = p.kind==='hard' ? `<line x1="${p.x}" y1="${y}" x2="${p.x}" y2="${y-26}" stroke="#c4fff7" stroke-width="1.4"/><path d="M${p.x} ${y-26}l15 5-15 5z" fill="#c4fff7"/>` : '';
  return `${flag}<circle data-i="${p.i}" cx="${p.x.toFixed(1)}" cy="${y.toFixed(1)}" r="${p.kind==='easy'?2.2:3.2}" fill="${col[p.kind]}"/>`;
}).join(''); hi = null; }

ridge.addEventListener('pointermove', e => {
  const m = ridge.getScreenCTM(); if (!m) return;
  const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
  let best = peaks[0]; for (const q of peaks) if (Math.abs(q.x-p.x) < Math.abs(best.x-p.x)) best = q;
  if (hi) hi.setAttribute('r', hi.dataset.r);
  hi = ridge.querySelector(`circle[data-i="${best.i}"]`); hi.dataset.r = hi.dataset.r || hi.getAttribute('r'); hi.setAttribute('r', 6);
  const br = box.getBoundingClientRect(), cr = hi.getBoundingClientRect();
  tip.textContent = `peak ${best.i+1} · ${best.kind}${best.i===firstHard ? ' · the first summit' : best.i===firstMed ? ' · first medium!' : ''}`;
  tip.style.transform = `translate(${Math.min(br.width-170, Math.max(0, cr.left-br.left-30))}px,${cr.top-br.top-34}px)`; tip.style.opacity = 1;
});
ridge.addEventListener('pointerleave', () => { tip.style.opacity = 0; if (hi) hi.setAttribute('r', hi.dataset.r); });


const bc = $('beamc'), bx = bc.getContext('2d'), hero = $('observatory');
let BW = 0, BH = 0, pool = null, poolA = 0;
const motes = Array.from({length:46}, () => ({t:Math.random(), u:Math.random()*2-1, v:.0004+Math.random()*.0009, p:Math.random()*6.28}));
function bsize(){ const dpr = Math.min(devicePixelRatio||1,2), r = hero.getBoundingClientRect(); BW = r.width; BH = r.height; bc.width = BW*dpr; bc.height = BH*dpr; bx.setTransform(dpr,0,0,dpr,0,0); }
function beam(t){
  const hr = hero.getBoundingClientRect();
  if (Math.abs(hr.width-BW) > 1 || Math.abs(hr.height-BH) > 1) bsize();
  bx.clearRect(0,0,BW,BH);
  if (hr.bottom < 0 || hr.top > innerHeight){ window.__beam = null; return; }
  const m = lsvg.getScreenCTM(); if (!m) return;
  const rad = ang*Math.PI/180, c = Math.cos(rad), sn = Math.sin(rad);
  const tip = new DOMPoint(985 + c*42, 212 + sn*42).matrixTransform(m);
  const ox = tip.x - hr.left, oy = tip.y - hr.top, L = Math.hypot(BW, BH)*1.15, S = .055;
  window.__beam = {x:tip.x, y:tip.y, a:rad, s:S, L};
  const px = -sn, py = c;
  const cone = (spread, alpha, w0) => {
    const g = bx.createRadialGradient(ox, oy, 0, ox, oy, L);
    g.addColorStop(0, `rgba(255,246,232,${alpha*1.8})`); g.addColorStop(.12, `rgba(255,240,226,${alpha})`);
    g.addColorStop(.55, `rgba(200,227,255,${alpha*.45})`); g.addColorStop(1, 'rgba(184,218,255,0)');
    bx.fillStyle = g; bx.beginPath();
    bx.moveTo(ox + px*w0, oy + py*w0);
    bx.lineTo(ox + Math.cos(rad+spread)*L, oy + Math.sin(rad+spread)*L);
    bx.lineTo(ox + Math.cos(rad-spread)*L, oy + Math.sin(rad-spread)*L);
    bx.lineTo(ox - px*w0, oy - py*w0); bx.closePath(); bx.fill();
  };
  for (let k=0;k<12;k++){ const f = 2.3 - k*.19; cone(S*f, .009 + k*.002, 2 + f*1.8); }
  if (cur) pool = cur;
  poolA += ((cur ? 1 : 0) - poolA)*.12;
  if (pool && poolA > .01){
    const tx = pool.x - hr.left, ty = pool.y - hr.top, d = Math.hypot(tx-ox, ty-oy), w = Math.max(18, d*Math.tan(S)*1.7);
    const g = bx.createRadialGradient(tx, ty, 0, tx, ty, w*1.6);
    g.addColorStop(0, `rgba(255,246,232,${.22*poolA})`); g.addColorStop(.35, `rgba(255,240,226,${.10*poolA})`); g.addColorStop(1, 'rgba(184,218,255,0)');
    bx.fillStyle = g; bx.beginPath(); bx.arc(tx, ty, w*1.6, 0, 6.29); bx.fill();
  }
  if (!reduce) for (const q of motes){
    q.t += q.v; if (q.t > 1){ q.t = 0; q.u = Math.random()*2-1; }
    const dist = 30 + q.t*L*.6, off = q.u*dist*Math.tan(S)*.9 + Math.sin(t*.0006 + q.p)*4;
    const mx = ox + c*dist + px*off, my = oy + sn*dist + py*off, al = .45*Math.sin(q.t*Math.PI)*(.6+.4*Math.sin(t*.002+q.p));
    bx.fillStyle = `rgba(255,248,236,${al})`; bx.beginPath(); bx.arc(mx, my, .9, 0, 6.29); bx.fill();
  }
  const gl = bx.createRadialGradient(ox, oy, 0, ox, oy, 16); gl.addColorStop(0, 'rgba(255,250,240,.75)'); gl.addColorStop(1, 'rgba(255,240,226,0)');
  bx.fillStyle = gl; bx.beginPath(); bx.arc(ox, oy, 16, 0, 6.29); bx.fill();
  const fz = Math.max(0, Math.min(170, (BH - oy - 20)*.8));
  if (fz > 0){
    const fg = bx.createLinearGradient(0, BH - fz, 0, BH);
    fg.addColorStop(0, 'rgba(0,0,0,0)'); fg.addColorStop(.5, 'rgba(0,0,0,.35)'); fg.addColorStop(.8, 'rgba(0,0,0,.8)'); fg.addColorStop(1, 'rgba(0,0,0,1)');
    bx.globalCompositeOperation = 'destination-out'; bx.fillStyle = fg; bx.fillRect(0, BH - fz, BW, fz); bx.globalCompositeOperation = 'source-over';
  }
}
addEventListener('resize', bsize); bsize();


const climber = $('climber'), sun = $('sun');
function scene(t){
  ang += (angT-ang)*.08; scope.setAttribute('transform', `translate(985 212) rotate(${ang.toFixed(2)})`);
  beam(t);
  const rr = $('range').getBoundingClientRect(), cp = Math.max(0, Math.min(1, (innerHeight*.85 - rr.top)/(rr.height*.9)));
  const cx = 8 + cp*984; climber.setAttribute('x', (cx-6).toFixed(1)); climber.setAttribute('y', (ridgeY(cx)-23.5).toFixed(1));
  const dr = $('dawn').getBoundingClientRect(), dp = Math.max(0, Math.min(1, (innerHeight - dr.top)/innerHeight));
  sun.style.transform = `translate(-50%,${(40 - dp*62).toFixed(1)}%)`;
}


const navs = [...document.querySelectorAll('.nav nav a')], secs = ['observatory','constellation','range','dawn'].map($);
function navOn(){ let k = 0; secs.forEach((s,i) => { if (s && s.getBoundingClientRect().top < innerHeight*.45) k = i; }); navs.forEach((a,i) => a.classList.toggle('on', i===k)); }


$('copy2').addEventListener('click', () => {
  const t = $('copytxt2'), addr = 'elvya.ane@gmail.com';
  const done = () => { t.textContent = 'copied ✦'; setTimeout(() => t.textContent = addr, 1400); };
  const sel = () => { const r = document.createRange(); r.selectNodeContents(t); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
  try { navigator.clipboard.writeText(addr).then(done, sel); } catch(e){ sel(); }
});


const FALLBACK = {easy:53, medium:9, hard:1, all:4082, maxStreak:16, activeDays:37, updated:'2026-10-17'};
window.__fillLC = () => { const v = window.__lc; if (!v) return; document.querySelectorAll('[data-lc]').forEach(el => { if (v[el.dataset.lc] != null) el.textContent = v[el.dataset.lc]; }); };
let lcKey = '';
function applyLC(st){
  const e = +st.easy|0, m = +st.medium|0, h = +st.hard|0; if (e+m+h <= 0) return;
  window.__lc = {easy:e, medium:m, hard:h, total:e+m+h, maxStreak:+st.maxStreak||FALLBACK.maxStreak, all:(+st.all||FALLBACK.all).toLocaleString('en-CA')};
  window.__fillLC();
  const k = `${e}/${m}/${h}`; if (k !== lcKey){ lcKey = k; buildRange({easy:e, medium:m, hard:h}); }
  const d = new Date((st.updated||FALLBACK.updated) + (String(st.updated||'').length > 10 ? '' : 'T12:00:00'));
  if (!isNaN(d)) $('lcFresh').textContent = 'updated ' + d.toLocaleDateString('en-CA', {month:'short', day:'numeric'});
}
applyLC(FALLBACK);
fetch('data/leetcode.json', {cache: 'no-store'}).then(r => r.ok ? r.json() : null).then(d => { if (d) applyLC(d); }).catch(() => {});

addEventListener('scroll', () => { atmo(); navOn(); }, {passive:true});
addEventListener('resize', () => { nsize(); atmo(); });
nsize(); atmo(); navOn(); requestAnimationFrame(ndraw);
})();
