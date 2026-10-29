(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;


const N = {
  me:{name:'me', big:true, d:[50,50], m:[50,50], type:'origin', status:'you are here',
    sum:'CS + math student at uOttawa who falls down rabbit holes for fun.',
    html:`<span class="lab">origin star</span><h2>hi, I'm Elvya</h2>
      <p>I study <b>computer science and math at uOttawa</b>, I'm on the Dean's Honour List, and I build things whenever an idea won't leave me alone.</p>
      <p>Favorite kind of night: 2am, deep in a rabbit hole about space or math, three monitors glowing.</p>
      <dl class="kv"><dt>studying</dt><dd>CS + Math, co-op</dd><dt>latest</dt><dd>won at Hack the Valley 11</dd><dt>next</dt><dd>summer 2027 internship</dd></dl>`},
  uottawa:{name:'uOttawa', d:[30,24], m:[24,28], type:'school', status:'Dean’s list',
    sum:'CS + Math, co-op program, CGPA 8.82/10, Dean’s Honour List.',
    html:`<span class="lab">school</span><h2>CS + Math</h2>
      <p>Double-majoring in <b>computer science and mathematics</b> at the University of Ottawa, in the co-op program.</p>
      <dl class="kv"><dt>CGPA</dt><dd>8.82 / 10</dd><dt>honours</dt><dd>Dean's Honour List</dd><dt>this term</dt><dd>data structures &amp; algorithms, math, architecture</dd><dt>speaks</dt><dd>Python · C++ · Java · TypeScript · JavaScript · SQL · Verilog</dd></dl>`},
  classmark:{name:'Classmark', d:[13,48], m:[17,50], type:'web app', status:'live',
    sum:'See your percentile among classmates; a uOttawa email unlocks your own numbers.',
    html:`<span class="lab">web app · live</span><h2>Classmark</h2>
      <p>Where do you actually stand? Classmark puts students <b>on the curve</b>: percentiles on skills and metrics against their peers.</p>
      <p>Visitors only see the average student. A <b>uOttawa email</b> unlocks your own spot. Built to expand to more schools.</p>
      <div class="chips"><span>Supabase</span><span>Vercel</span><span>auth-gated</span></div>
      <div class="btns"><a class="btn" href="https://classmark.vercel.app" target="_blank" rel="noopener">open classmark ↗</a></div>`},
  goal:{name:'Goal!', d:[25,80], m:[24,74], type:'web app', status:'building',
    sum:'A planner that analyzes how you actually spent your time.',
    html:`<span class="lab">web app · building</span><h2>Goal!</h2>
      <p>A planning app that also <b>analyzes how you actually spent your time</b>, so a goal gets honest feedback instead of a checkbox.</p>
      <div class="chips"><span>Node</span><span>Express</span><span>PostgreSQL</span><span>vanilla JS</span></div>`},
  book:{name:'order book', d:[64,18], m:[73,20], type:'systems', status:'in progress',
    sum:'A limit order book and matching engine in C++.',
    html:`<span class="lab">systems · in progress</span><h2>Order book</h2>
      <p>A <b>limit order book and matching engine in C++</b>: price-time priority, bids and asks, the spread in between. Correct first, then fast.</p>
      <div class="chips"><span>C++</span><span>data structures</span><span>low latency</span></div>`},
  leet:{name:'LeetCode', d:[85,38], m:[80,42], type:'practice', status:'<span data-lc="total">63</span> solved',
    sum:'<span data-lc="total">63</span> solved and counting. Goal: every problem.',
    html:`<span class="lab">practice · ongoing</span><h2>LeetCode</h2>
      <p><b><span data-lc="total">63</span> problems solved</b>, mostly Python with some C++. Long-term goal: solve every single one. Yes, all of them.</p>
      <dl class="kv"><dt>solved</dt><dd><span data-lc="easy">53</span> easy · <span data-lc="medium">9</span> medium · <span data-lc="hard">1</span> hard</dd><dt>best streak</dt><dd><span data-lc="maxStreak">16</span> days</dd></dl>
      <div class="btns"><a class="btn ghost" href="https://leetcode.com/u/Elvya/" target="_blank" rel="noopener">profile ↗</a></div>`},
  viralens:{name:'Viralens', d:[68,70], m:[72,64], type:'ML + web', status:'hackathon',
    sum:'Sickness-risk heatmaps from cough detection; training my own model.',
    html:`<span class="lab">ML + web · Hack the Hill</span><h2>Viralens</h2>
      <p>Sickness-risk <b>heatmaps by city zone</b>, built from cough and sneeze detection on a laptop mic plus self-reported symptoms.</p>
      <p>Now training my <b>own cough-detection model</b> for it.</p>
      <div class="chips"><span>audio ML</span><span>React</span><span>Leaflet</span><span>TimescaleDB</span></div>
      <div class="btns"><a class="btn ghost" href="https://github.com/ElvyaAne/viralense" target="_blank" rel="noopener">repo ↗</a></div>`},
  hacks:{name:'hackathons', d:[84,80], m:[50,88], type:'events', status:'winner',
    sum:'Hack the Hill, then a win at Hack the Valley 11.',
    html:`<span class="lab">events</span><h2>Hackathons</h2>
      <p>Each one gets its own star. Click through to them.</p>
      <dl class="kv"><dt>Sep 2026</dt><dd>Hack the Hill, Ottawa</dd><dt>Oct 2026</dt><dd>Hack the Valley 11, UTSC: <b>won</b></dd></dl>`},
  hth:{name:'Hack the Hill', d:[95,62], m:[78,76], type:'hackathon', status:'Viralens',
    sum:'Ottawa, Sep 2026. Where Viralens was born.',
    html:`<span class="lab">hackathon · Sep 2026</span><h2>Hack the Hill</h2>
      <p>A hackathon in <b>Ottawa</b>, and where <b>Viralens</b> was born: sickness-risk heatmaps from cough and sneeze detection.</p>
      <dl class="kv"><dt>when</dt><dd>Sep 2026</dd><dt>where</dt><dd>Ottawa</dd><dt>built</dt><dd>Viralens</dd></dl>`},
  htv:{name:'Hack the Valley', d:[68,93], m:[22,90], type:'hackathon', status:'won',
    sum:'UTSC, Oct 2026. Won with a biometric "are you okay?" signal.',
    html:`<span class="lab">hackathon · winner</span><h2>Hack the Valley 11</h2>
      <p><b>Won</b> at Hack the Valley 11 at UTSC with a biometric <b>"are you okay?" signal</b> for people who can't ask for help.</p>
      <dl class="kv"><dt>when</dt><dd>Oct 2026</dd><dt>where</dt><dd>UTSC, Toronto</dd><dt>result</dt><dd><b>won</b></dd></dl>`},
  intern:{name:'summer 2027', d:[50,8], m:[50,8], type:'wish', status:'looking',
    sum:'Looking for a software or ML/AI internship.',
    html:`<span class="lab">the wish</span><h2>Summer 2027</h2>
      <p>Looking for an internship in <b>software or ML/AI</b>. Ottawa, Toronto, anywhere in Canada, or US/remote.</p>
      <div class="btns"><button class="btn" id="copy" type="button"><span id="copytxt">elvya.ane@gmail.com</span> · copy</button><a class="btn ghost" href="https://github.com/ElvyaAne" target="_blank" rel="noopener">GitHub ↗</a></div>`}
};
const E = [
  ['me','uottawa','where I study'],
  ['uottawa','classmark','Classmark launched at uOttawa'],
  ['classmark','goal','both apps measure you honestly'],
  ['me','goal','I plan everything'],
  ['uottawa','book','math major, systems brain'],
  ['book','leet','same muscles: C++ and data structures'],
  ['leet','intern','the grind has a destination'],
    ['me','viralens','my first ML rabbit hole'],
  ['viralens','hth','born at Hack the Hill'],
  ['hacks','hth','Sep 2026, Ottawa'],
  ['hacks','htv','Oct 2026, the win'],
  ['hacks','intern','where I learn fastest'],
  ['uottawa','intern','co-op makes it possible']
];
const ids = Object.keys(N);

const stage = document.getElementById('stage'), svg = document.getElementById('links');
const mobile = () => matchMedia('(max-width:980px)').matches;
const seen = new Set(['me']);
let open = ['me'], active = 'me';


const sky = document.getElementById('sky'), cv = document.getElementById('stars'), ctx = cv.getContext('2d');
const lines = E.map(([a,b]) => { const l = document.createElementNS('http://www.w3.org/2000/svg','line'); svg.appendChild(l); return {a,b,l}; });
const btns = {}, B = {};
let SW = 0, SH = 0, offX = 0, offY = 0;
let drag = null, hoverId = null, mxS = -1e4, myS = -1e4, T0 = performance.now();

ids.forEach((id, i) => {
  const n = N[id], b = document.createElement('button');
  b.type = 'button'; b.className = 'star' + (n.big ? ' big' : ''); b.dataset.id = id;
  b.innerHTML = `<span class="dot"></span><span class="lbl">${n.name}</span>`;
  b.setAttribute('aria-label', `Open ${n.name}`);
  stage.appendChild(b); btns[id] = b;
  B[id] = {x:0, y:0, vx:0, vy:0, hx:0, hy:0, ph:Math.random()*6.28};
  b.addEventListener('pointerdown', e => {
    e.preventDefault(); e.stopPropagation();
    const r = stage.getBoundingClientRect();
    drag = {id, sx:e.clientX, sy:e.clientY, moved:false, dx:B[id].x-(e.clientX-r.left), dy:B[id].y-(e.clientY-r.top), lx:e.clientX, ly:e.clientY, t:performance.now()};
    b.setPointerCapture(e.pointerId); b.classList.add('drag');
  });
  b.addEventListener('pointermove', e => {
    if (!drag || drag.id !== id) return;
    if (Math.hypot(e.clientX-drag.sx, e.clientY-drag.sy) > 10) drag.moved = true;
    const r = stage.getBoundingClientRect(), now = performance.now(), dt = Math.max(8, now-drag.t);
    B[id].vx = (e.clientX-drag.lx)/dt*16; B[id].vy = (e.clientY-drag.ly)/dt*16;
    B[id].x = e.clientX-r.left+drag.dx; B[id].y = e.clientY-r.top+drag.dy;
    drag.lx = e.clientX; drag.ly = e.clientY; drag.t = now;
  });
  const end = e => {
    if (!drag || drag.id !== id) return;
    b.classList.remove('drag');
    const wasClick = !drag.moved; drag = null;
    if (wasClick) visit(id);
    else if (!reduce) say(['wheee','boing ✦','careful, that one’s load-bearing','constellations are elastic, apparently'][Math.random()*4|0]);
  };
  b.addEventListener('pointerup', end); b.addEventListener('pointercancel', end);
  b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); visit(id); } });
  b.addEventListener('mouseenter', () => { hoverId = id; focus(); });
  b.addEventListener('mouseleave', () => { hoverId = null; focus(); });
});

function pos(id){ return mobile() ? N[id].m : N[id].d; }
const rest = new Map();
function place(first){
  const sr = stage.getBoundingClientRect(), kr = sky.getBoundingClientRect();
  SW = sr.width; SH = sr.height; offX = sr.left-kr.left; offY = sr.top-kr.top;
  svg.setAttribute('viewBox', `0 0 ${SW} ${SH}`);
  ids.forEach(id => {
    const [px, py] = pos(id), o = B[id];
    o.hx = SW*px/100; o.hy = SH*py/100;
    if (first){ o.x = o.hx + (reduce?0:(Math.random()-.5)*SW*.5); o.y = o.hy + (reduce?0:(Math.random()-.5)*SH*.5); }
  });
  lines.forEach(L => rest.set(L, Math.hypot(B[L.a].hx-B[L.b].hx, B[L.a].hy-B[L.b].hy)));
}
function neighbors(id){ const s = new Set([id]); E.forEach(([a,b]) => { if (a===id) s.add(b); if (b===id) s.add(a); }); return s; }
function focus(){
  const f = hoverId, nb = f ? neighbors(f) : null;
  stage.classList.toggle('focus', !!f);
  ids.forEach(id => btns[id].classList.toggle('dim', !!f && !nb.has(id)));
  lines.forEach(({a,b,l}) => { l.classList.toggle('hot', (f||active)===a || (f||active)===b); l.classList.toggle('dim', !!f && a!==f && b!==f); });
}
function hot(){ focus(); }
function refresh(){
  ids.forEach(id => { btns[id].classList.toggle('seen', seen.has(id)); btns[id].classList.toggle('on', id===active); });
  lines.forEach(({a,b,l}) => l.classList.toggle('lit', seen.has(a) && seen.has(b)));
  focus();
  const f = document.getElementById('foundN'), txt = `${seen.size} / ${ids.length}`;
  if (f.textContent !== txt){ f.textContent = txt; f.classList.remove('pop'); void f.offsetWidth; f.classList.add('pop'); }
}

function physics(t){
  const drift = reduce ? 0 : 1;
  for (const id of ids){
    const o = B[id]; if (drag && drag.id === id) continue;
    if (id === hoverId){ o.vx *= .4; o.vy *= .4; continue; }
    const hx = o.hx + Math.sin(t*.00045 + o.ph)*9*drift, hy = o.hy + Math.cos(t*.0004 + o.ph*1.3)*7*drift;
    o.vx += (hx-o.x)*.012; o.vy += (hy-o.y)*.012;
    const dx = o.x-mxS, dy = o.y-myS, d = Math.hypot(dx,dy);
    if (!drag && !hoverId && d < 90 && d > 0){ const f = (1-d/90)*.35; o.vx += dx/d*f; o.vy += dy/d*f; }
  }
  for (const L of lines){
    const a = B[L.a], b = B[L.b], dx = b.x-a.x, dy = b.y-a.y, d = Math.hypot(dx,dy)||1, f = (d-rest.get(L))*.006;
    const fx = dx/d*f, fy = dy/d*f;
    if (!(drag && drag.id===L.a)){ a.vx += fx; a.vy += fy; }
    if (!(drag && drag.id===L.b)){ b.vx -= fx; b.vy -= fy; }
  }
  for (let i=0;i<ids.length;i++) for (let j=i+1;j<ids.length;j++){
    const a = B[ids[i]], b = B[ids[j]], dx = b.x-a.x, dy = b.y-a.y, d = Math.hypot(dx,dy)||1;
    if (d < 95){ const f = (95-d)/95*.7, fx = dx/d*f, fy = dy/d*f; a.vx -= fx; a.vy -= fy; b.vx += fx; b.vy += fy; }
  }
  for (const id of ids){
    const o = B[id];
    if (!(drag && drag.id === id)){ o.vx *= .9; o.vy *= .9; o.x += o.vx; o.y += o.vy; }
    o.x = Math.max(10, Math.min(SW-10, o.x)); o.y = Math.max(10, Math.min(SH-10, o.y));
    btns[id].style.transform = `translate(${o.x}px,${o.y}px) translate(-50%,-50%)`;
  }
  lines.forEach((L, i) => {
    const a = B[L.a], b = B[L.b], p = reduce ? 1 : Math.min(1, Math.max(0, (t - T0 - 500 - i*140)/650));
    const e = 1 - Math.pow(1-p, 3);
    L.l.setAttribute('x1', a.x); L.l.setAttribute('y1', a.y);
    L.l.setAttribute('x2', a.x + (b.x-a.x)*e); L.l.setAttribute('y2', a.y + (b.y-a.y)*e);
  });
}


const tabsEl = document.getElementById('tabs'), bodyEl = document.getElementById('body'), pathEl = document.getElementById('path');
function slug(id){ return N[id].name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
let typer;
function renderWin(animate){
  tabsEl.innerHTML = open.map(id => `<button class="tab${id===active?' on':''}${id===pendingTab?' pending':''}${id===landedId?' landed':''}" role="tab" aria-selected="${id===active}" data-id="${id}">${slug(id)}.md${open.length>1?`<span class="x" data-x="${id}" aria-label="close">×</span>`:''}</button>`).join('');
  const onTab = tabsEl.querySelector('.tab.on'); if (onTab){ const l = onTab.offsetLeft - tabsEl.offsetLeft, rgt = l + onTab.offsetWidth; if (l < tabsEl.scrollLeft) tabsEl.scrollLeft = l - 8; else if (rgt > tabsEl.scrollLeft + tabsEl.clientWidth) tabsEl.scrollLeft = rgt - tabsEl.clientWidth + 8; }
  pathEl.textContent = `~/sky/${slug(active)}.md`;
  const links = E.filter(e => e[0]===active || e[1]===active);
  const back = links.map(([a,b,why]) => { const o = a===active ? b : a; return `<button class="backlink" data-go="${o}"><b>[[${slug(o)}]]</b><span>${why}</span></button>`; }).join('');
  bodyEl.innerHTML = N[active].html + `<div class="back"><span class="lab">linked notes · ${links.length}</span>${back}</div>`;
  bodyEl.scrollTop = 0;
  const c = document.getElementById('copy'); if (c) wireCopy(c);
  if (window.__fillLC) window.__fillLC();
  if (animate && !reduce){
    bodyEl.classList.remove('enter'); void bodyEl.offsetWidth; bodyEl.classList.add('enter');
    const h = bodyEl.querySelector('h2'), full = h.textContent; let k = 0; clearInterval(typer);
    h.textContent = ''; typer = setInterval(() => { h.textContent = full.slice(0, ++k) + (k < full.length ? '▍' : ''); if (k >= full.length) clearInterval(typer); }, 34);
  }
}
tabsEl.addEventListener('click', e => {
  const x = e.target.closest('[data-x]');
  if (x){ e.stopPropagation(); const id = x.dataset.x; open = open.filter(o => o!==id); if (active===id) active = open[open.length-1]; renderWin(true); refresh(); return; }
  const t = e.target.closest('.tab'); if (t && t.dataset.id !== active){ active = t.dataset.id; renderWin(true); refresh(); }
});
bodyEl.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) visit(g.dataset.go, true); });

const quips = { classmark:'one of my favorite builds', book:'ooh, the fast one', viralens:'listen closely… *cough*', intern:'make a wish ✦', leet:'and counting!', hacks:'collecting these ✦', hth:'Ottawa, home turf', htv:'fresh off a win ✦', goal:'goals, but honest', uottawa:'home base', me:'origin star ✦' };
let pendingTab = null, landedId = null;
const winEl = document.getElementById('win');
function visit(id, fromNote){
  const fresh = !seen.has(id);
  seen.add(id); if (!open.includes(id)) open.push(id); if (open.length > 9) open.shift();
  burst(B[id].x + offX, B[id].y + offY, fresh ? 46 : 22);
  if (!reduce){ const nb = neighbors(id); nb.forEach(n => { if (n!==id){ const dx = B[n].x-B[id].x, dy = B[n].y-B[id].y, d = Math.hypot(dx,dy)||1; B[n].vx += dx/d*5; B[n].vy += dy/d*5; } }); }
  refresh();
  const land = () => {
    pendingTab = null; active = id; landedId = id; renderWin(true); landedId = null; refresh();
    btns[id].classList.remove('launch');
    winEl.classList.remove('glow'); void winEl.offsetWidth; winEl.classList.add('glow');
    setTimeout(() => say(seen.size === ids.length && fresh ? 'every star found. you read all her tabs… hire her? ✦' : quips[id]), reduce ? 0 : 250);
    if (seen.size === ids.length && fresh && !reduce) for (let i=0;i<7;i++) setTimeout(() => shoot(Math.random()*W*.8, Math.random()*H*.3), i*180);
    if (mobile() && !fromNote) winEl.scrollIntoView({behavior: reduce?'auto':'smooth', block:'start'});
  };
  if (reduce || mobile()) { land(); return; }
  pendingTab = id; renderWin(false);
  const tab = tabsEl.querySelector(`.tab[data-id="${id}"]`), kr = sky.getBoundingClientRect(), tr = tab.getBoundingClientRect();
  btns[id].classList.add('launch');
  launch(B[id].x + offX, B[id].y + offY, tr.left - kr.left + tr.width/2, tr.top - kr.top + tr.height/2, land);
}


const fx = document.getElementById('fx'), fctx = fx.getContext('2d');
let comets = [], fparts = [];
function launch(x0, y0, x1, y1, cb){
  const mx = (x0+x1)/2, my = Math.min(y0, y1) - 140 - Math.abs(x1-x0)*.12;
  comets.push({x0, y0, cx:mx, cy:my, x1, y1, t0:performance.now(), dur:820, trail:[], cb});
}
function drawFx(t){
  fctx.clearRect(0,0,W,H);
  for (const c of comets){
    const p = Math.min(1, (t - c.t0)/c.dur), e = p < .5 ? 4*p*p*p : 1 - Math.pow(-2*p+2, 3)/2, u = 1-e;
    const x = u*u*c.x0 + 2*u*e*c.cx + e*e*c.x1, y = u*u*c.y0 + 2*u*e*c.cy + e*e*c.y1;
    c.trail.push({x,y}); if (c.trail.length > 26) c.trail.shift();
    for (let i=1;i<c.trail.length;i++){
      const a = i/c.trail.length, q = c.trail[i-1], r = c.trail[i];
      fctx.strokeStyle = `rgba(184,218,255,${a*.8})`; fctx.lineWidth = a*7; fctx.lineCap = 'round';
      fctx.beginPath(); fctx.moveTo(q.x,q.y); fctx.lineTo(r.x,r.y); fctx.stroke();
      fctx.strokeStyle = `rgba(255,255,255,${a*.9})`; fctx.lineWidth = a*2.2;
      fctx.beginPath(); fctx.moveTo(q.x,q.y); fctx.lineTo(r.x,r.y); fctx.stroke();
    }
    const g = fctx.createRadialGradient(x,y,0,x,y,26); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.25,'rgba(155,238,255,.7)'); g.addColorStop(1,'rgba(184,218,255,0)');
    fctx.fillStyle = g; fctx.beginPath(); fctx.arc(x,y,26,0,6.29); fctx.fill();
    fctx.save(); fctx.translate(x,y); fctx.rotate(t*.006); fctx.fillStyle = '#ffffff';
    for (let k=0;k<2;k++){ fctx.rotate(Math.PI/2*k); fctx.fillRect(-14,-1,28,2); fctx.fillRect(-1,-14,2,28); }
    fctx.restore();
    if (Math.random() < .7) fparts.push({x, y, vx:(Math.random()-.5)*1.6, vy:(Math.random()-.5)*1.6+.4, life:1, r:1+Math.random()*1.8, c:['255,255,255','184,218,255','155,238,255','196,255,247'][Math.random()*4|0]});
    if (p >= 1){
      c.done = true;
      for (let i=0;i<34;i++){ const a = Math.random()*6.28, s = 1+Math.random()*4; fparts.push({x:c.x1, y:c.y1, vx:Math.cos(a)*s, vy:Math.sin(a)*s, life:1, r:1+Math.random()*2.2, c:['255,255,255','184,218,255','155,238,255','196,255,247'][i%4]}); }
      c.cb();
    }
  }
  comets = comets.filter(c => !c.done);
  for (const p of fparts){
    fctx.fillStyle = `rgba(${p.c},${p.life})`; fctx.beginPath(); fctx.arc(p.x, p.y, p.r*p.life, 0, 6.29); fctx.fill();
    p.x += p.vx; p.y += p.vy; p.vx *= .95; p.vy *= .95; p.life -= .025;
  }
  fparts = fparts.filter(p => p.life > 0);
}


const naut = document.getElementById('naut'), bubble = document.getElementById('bubble');
(function sprite(){
  const S = ['....kkkk....','...kwwwwk...','..kwwwwwwk..','.kwwbbbbwwk.','.kwbvvvsbwk.','.kwbvvvvbwk.','.kwwbbbbwwk.','..kwwwwwwk..','.pkwgwwgwkp.','.pkwwrrwwkp.','.pkwwwwwwkp.','..kwwkkwwk..','..kwk..kwk..','..kkk..kkk..'];
  const C = {k:'#224364',w:'#f0f7ff',g:'#c6ddf5',b:'#336494',v:'#9beeff',s:'#ffffff',p:'#b8daff',r:'#c4fff7'};
  const c = naut.querySelector('canvas').getContext('2d');
  S.forEach((row,y) => [...row].forEach((ch,x) => { if (C[ch]){ c.fillStyle = C[ch]; c.fillRect(x,y,1,1); } }));
})();
const A = {x:0, y:0, vx:0, vy:0, ang:0, spin:0};
let bubbleOn = false, bt;
function astro(t){
  const s = B[active], r = 46 + Math.sin(t*.0007)*6;
  A.ang += reduce ? 0 : .012;
  const tx = s.x + Math.cos(A.ang)*r - 18, ty = s.y + Math.sin(A.ang)*r*.6 - 52;
  A.vx += (tx-A.x)*.008; A.vy += (ty-A.y)*.008; A.vx *= .93; A.vy *= .93;
  A.x += A.vx; A.y += A.vy; A.spin *= .94;
  const tilt = Math.max(-35, Math.min(35, A.vx*5)) + A.spin;
  naut.style.transform = `translate(${A.x}px,${A.y}px) rotate(${tilt}deg)`;
  const sp = Math.hypot(A.vx, A.vy);
  if (!reduce && sp > .6 && Math.random() < Math.min(1, sp*.5)) parts.push({x:A.x+18+offX - A.vx*2, y:A.y+34+offY - A.vy*2, vx:-A.vx*.3+(Math.random()-.5), vy:-A.vy*.3+Math.random()*.8, life:1, r:1+Math.random()*2, c:Math.random()<.5?'196,255,247':'184,218,255', g:0});
  if (bubbleOn){ const bx = Math.min(SW-240, A.x + 42), by = A.y - 30; bubble.style.transform = `translate(${Math.max(0,bx)}px,${Math.max(-10,by)}px)`; }
}
function fly(){}
function say(t){
  if (!t) return;
  bubble.textContent = t; bubbleOn = true; bubble.classList.add('show');
  clearTimeout(bt); bt = setTimeout(() => { bubble.classList.remove('show'); setTimeout(() => bubbleOn = bubble.classList.contains('show'), 300); }, 3200);
}
const facts = ['a day on Venus is longer than its year.','light from the Sun is about 8 minutes old when it reaches you.','e^(iπ) + 1 = 0. still not over it.','there are more possible chess games than atoms in the observable universe.','neutron stars can spin hundreds of times per second.','Andromeda and the Milky Way are on a collision course. no rush though.','Saturn is less dense than water.','there are infinitely many primes. Euclid proved it ~2300 years ago.'];
let fi = Math.random()*facts.length|0;
naut.addEventListener('click', e => { e.stopPropagation(); A.spin = 360; A.vy -= 6; say(facts[fi++ % facts.length]); });


let W, H, dots = [], shoots = [], parts = [], px = 0, py = 0, tx = 0, ty = 0, lastSpark = {x:-99,y:-99};
function size(){
  const dpr = Math.min(devicePixelRatio||1,2); W = sky.offsetWidth; H = sky.offsetHeight;
  cv.width = W*dpr; cv.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  fx.width = W*dpr; fx.height = H*dpr; fctx.setTransform(dpr,0,0,dpr,0,0);
  const n = Math.round(W*H/2400); dots = [];
  const cols = ['234,244,255','184,218,255','155,238,255','196,255,247'];
  for (let i=0;i<n;i++) dots.push({x:Math.random()*W, y:Math.random()*H*.95, r:Math.random()<.9?Math.random()*1.1+.3:Math.random()*1.6+1.1, z:Math.random(), p:Math.random()*6.28, s:.5+Math.random()*1.5, c:cols[Math.random()<.7?0:(1+Math.random()*3|0)]});
}
function shoot(x,y){ const a = Math.PI*(.12+Math.random()*.22); shoots.push({x, y, vx:Math.cos(a)*10, vy:Math.sin(a)*10, life:1}); }
function burst(x,y,n){
  const cols = ['234,244,255','184,218,255','155,238,255','196,255,247'];
  for (let i=0;i<n;i++){ const a = Math.random()*6.28, s = 1.5+Math.random()*4.5; parts.push({x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, life:1, r:1+Math.random()*2.2, c:cols[i%4], g:.04}); }
}
const neb = [{c:'184,218,255',a:.16,p:0},{c:'155,238,255',a:.12,p:2.1},{c:'196,255,247',a:.11,p:4.2}];
function frame(t){
  ctx.clearRect(0,0,W,H);
  px += (tx-px)*.05; py += (ty-py)*.05;
  const sc = Math.min(scrollY, H) * .25;
  for (const n of neb){
    const x = W*(.5 + .35*Math.sin(t*.00006 + n.p)), y = H*(.45 + .25*Math.cos(t*.00005 + n.p*1.7)) - sc*.5, R = Math.max(W,H)*.45;
    const g = ctx.createRadialGradient(x,y,0,x,y,R); g.addColorStop(0, `rgba(${n.c},${n.a})`); g.addColorStop(1, `rgba(${n.c},0)`);
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  }
  for (const d of dots){
    const tw = reduce ? .8 : .55 + .45*Math.sin(t/1000*d.s + d.p);
    const ox = px*d.z*18, oy = py*d.z*12 - sc*d.z;
    ctx.fillStyle = `rgba(${d.c},${(.35+d.z*.65)*tw})`;
    ctx.beginPath(); ctx.arc(d.x+ox, d.y+oy, d.r, 0, 6.29); ctx.fill();
    if (d.r > 1.6){ ctx.fillStyle = `rgba(${d.c},${.12*tw})`; ctx.beginPath(); ctx.arc(d.x+ox, d.y+oy, d.r*4, 0, 6.29); ctx.fill(); }
  }
  for (const s of shoots){
    const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx*14, s.y - s.vy*14);
    g.addColorStop(0, `rgba(255,255,255,${s.life})`); g.addColorStop(1, 'rgba(184,218,255,0)');
    ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx*14, s.y - s.vy*14); ctx.stroke();
    s.x += s.vx; s.y += s.vy; s.life -= .013;
  }
  shoots = shoots.filter(s => s.life > 0 && !s.caught);
  window.__skyShoots = shoots;
  for (const p of parts){
    ctx.fillStyle = `rgba(${p.c},${p.life})`;
    if (p.star){ const r = p.r*p.life*2.2; ctx.fillRect(p.x-r, p.y-.6, r*2, 1.2); ctx.fillRect(p.x-.6, p.y-r, 1.2, r*2); }
    else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r*p.life, 0, 6.29); ctx.fill(); }
    p.x += p.vx; p.y += p.vy; p.vx *= .96; p.vy = p.vy*.96 + (p.g||0); p.life -= p.star ? .022 : .018;
  }
  parts = parts.filter(p => p.life > 0);
  physics(t); astro(t); drawFx(t);
  requestAnimationFrame(frame);
}
function draw(t){ frame(t || performance.now()); }

sky.addEventListener('pointermove', e => {
  tx = e.clientX/innerWidth - .5; ty = e.clientY/innerHeight - .5;
  const kr = sky.getBoundingClientRect(), x = e.clientX - kr.left, y = e.clientY - kr.top;
  mxS = x - offX; myS = y - offY;
  if (!reduce && e.pointerType === 'mouse' && Math.hypot(x-lastSpark.x, y-lastSpark.y) > 14){
    lastSpark = {x,y};
    parts.push({x, y, vx:(Math.random()-.5)*.6, vy:Math.random()*.6, life:1, r:2+Math.random()*2.5, c:['234,244,255','184,218,255','155,238,255','196,255,247'][Math.random()*4|0], star:true});
  }
});
sky.addEventListener('pointerleave', () => { mxS = myS = -1e4; });
sky.addEventListener('click', e => {
  if (e.target.closest('button,a,.win')) return;
  const r = sky.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  shoot(x, y); burst(x, y, 16);
  if (!reduce) say(['wish made ✦','wish sent. processing…','that one’s for summer 2027','ooh, a big one'][Math.random()*4|0]);
});
if (!reduce) setInterval(() => { if (!document.hidden) shoot(Math.random()*W*.7, Math.random()*H*.3); }, 4200);


document.getElementById('catalogue').innerHTML = ids.map((id,i) => `<li data-id="${id}" tabindex="0"><span class="des">EA·${String(i).padStart(2,'0')}</span><span class="nm">${N[id].name}</span><span class="ds">${N[id].sum}</span><span class="st">${N[id].type} · ${N[id].status}</span></li>`).join('');
document.getElementById('catalogue').addEventListener('click', e => { const li = e.target.closest('li'); if (li){ visit(li.dataset.id, true); stage.scrollIntoView({behavior:reduce?'auto':'smooth', block:'center'}); } });
document.getElementById('catalogue').addEventListener('keydown', e => { if (e.key==='Enter'){ const li = e.target.closest('li'); if (li) li.click(); } });


const fmt = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',hour:'2-digit',minute:'2-digit',hour12:false});
function tick(){
  document.getElementById('clock').textContent = fmt.format(new Date());
  const syn = 29.530588853, age = (((Date.now() - Date.UTC(2000,0,6,18,14))/864e5) % syn + syn) % syn;
  const ill = Math.round((1 - Math.cos(2*Math.PI*age/syn))/2*100);
  const names = ['new','waxing crescent','first quarter','waxing gibbous','full','waning gibbous','last quarter','waning crescent'];
  document.getElementById('moon').textContent = `${names[Math.round(age/syn*8)%8]} ${ill}%`;
}
tick(); setInterval(tick, 30000);


function wireCopy(btn){
  const txt = btn.querySelector('#copytxt'), addr = 'elvya.ane@gmail.com';
  btn.addEventListener('click', () => {
    const done = () => { txt.textContent = 'copied ✦'; setTimeout(() => txt.textContent = addr, 1400); };
    const sel = () => { const r = document.createRange(); r.selectNodeContents(txt); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText(addr).then(done, sel); } catch(e){ sel(); }
  });
}

let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); place(false); }, 120); });
size(); place(true); renderWin(false); refresh();
A.x = B.me.hx - 18; A.y = B.me.hy - 120;
requestAnimationFrame(frame);
if (document.fonts) document.fonts.ready.then(() => { size(); place(false); });
setTimeout(() => say('hi! click a star ✦'), reduce ? 0 : 1200);
})();
