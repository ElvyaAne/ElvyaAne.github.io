// Hobbies page: one small toy per hobby card (dance, music & poetry, swimming, gym, content).
(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, at = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (parent) parent.appendChild(e); return e; };
const chips = (root, cb) => root.querySelectorAll('.vchips [data-k]').forEach(b => b.addEventListener('click', () => {
  root.querySelectorAll('.vchips [data-k]').forEach(x => x.setAttribute('aria-pressed', x === b)); cb(b.dataset.k);
}));
const defs = svg => el('defs', {}, svg);
const glow = (d, id, sd) => { const f = el('filter', {id, x:'-50%', y:'-50%', width:'200%', height:'200%'}, d); el('feGaussianBlur', {stdDeviation: sd, result:'b'}, f); const m = el('feMerge', {}, f); el('feMergeNode', {in:'b'}, m); el('feMergeNode', {in:'SourceGraphic'}, m); };
const onScreen = (node, fn) => { let on = false; new IntersectionObserver(es => { on = es[0].isIntersecting; if (on) fn(); }).observe(node); return () => on; };

/* ---------- dance: a dancer whose poses change with the style ---------- */
(() => {
  const root = document.getElementById('v-dance'); if (!root) return;
  const svg = root.querySelector('svg'), info = root.querySelector('.vinfo');
  const d = defs(svg); glow(d, 'dg', 2.2);
  const sp = el('radialGradient', {id:'spot', cx:'.5', cy:'.35', r:'.6'}, d);
  el('stop', {offset:'0', 'stop-color':'#9beeff', 'stop-opacity':'.22'}, sp); el('stop', {offset:'1', 'stop-color':'#9beeff', 'stop-opacity':'0'}, sp);
  el('ellipse', {cx:100, cy:110, rx:90, ry:100, fill:'url(#spot)'}, svg);
  el('line', {x1:20, y1:176, x2:180, y2:176, stroke:'#b8daff', 'stroke-opacity':'.35', 'stroke-dasharray':'2 4'}, svg);
  const shadow = el('ellipse', {cx:100, cy:177, rx:22, ry:3, fill:'#9beeff', 'fill-opacity':'.18'}, svg);
  const g = el('g', {filter:'url(#dg)', stroke:'#eaf4ff', 'stroke-width':4.2, 'stroke-linecap':'round', 'stroke-linejoin':'round', fill:'none'}, svg);
  const tutu = el('path', {fill:'#c4fff7', 'fill-opacity':'.35', stroke:'#c4fff7', 'stroke-width':1.2}, svg);
  const limbs = ['spine','larm','rarm','lleg','rleg'].map(() => el('polyline', {}, g));
  const head = el('circle', {r:8.5, fill:'#eaf4ff', stroke:'none'}, svg); head.setAttribute('filter', 'url(#dg)');
  const label = el('text', {x:100, y:194, 'text-anchor':'middle', 'font-size':7}, svg);
  // poses: [neck, hip, lElbow, lHand, rElbow, rHand, lKnee, lFoot, rKnee, rFoot]
  const P = {
    ballet:{ms:1900, name:'ballet', a:[[100,72],[100,118],[88,52],[96,34],[112,52],[104,34],[98,145],[100,172],[122,128],[148,118]],
                                   b:[[100,70],[100,117],[80,76],[62,70],[120,76],[138,70],[98,144],[100,170],[104,146],[100,170]]},
    jazz:{ms:900, name:'jazz', a:[[104,72],[100,120],[84,60],[74,44],[120,86],[132,100],[90,146],[84,172],[116,142],[124,168]],
                              b:[[96,72],[100,120],[80,86],[68,100],[122,58],[132,42],[88,144],[80,170],[112,146],[118,172]]},
    tap:{ms:420, name:'tap', a:[[100,74],[100,122],[90,96],[84,116],[112,96],[120,114],[96,148],[92,174],[110,146],[126,166]],
                            b:[[100,74],[100,122],[88,96],[80,112],[110,96],[116,116],[92,146],[78,166],[106,148],[108,174]]},
    contemporary:{ms:2200, name:'contemporary', a:[[86,82],[100,124],[70,70],[54,58],[98,96],[116,104],[92,148],[88,174],[118,142],[132,166]],
                                               b:[[112,74],[100,120],[100,52],[94,32],[132,64],[150,52],[96,146],[98,172],[80,136],[62,148]]},
    modern:{ms:1100, name:'modern', a:[[100,72],[100,120],[76,72],[76,50],[124,72],[124,94],[84,140],[84,168],[116,140],[116,168]],
                                   b:[[100,72],[100,120],[76,72],[76,94],[124,72],[124,50],[88,144],[76,170],[112,144],[124,170]]},
    hiphop:{ms:640, name:'hip hop', a:[[98,80],[100,126],[84,96],[98,104],[118,88],[130,72],[84,148],[80,174],[118,146],[122,174]],
                                    b:[[102,82],[100,128],[80,84],[70,70],[114,98],[102,106],[82,150],[78,174],[116,150],[120,174]]},
  };
  let style = 'ballet', from = null, t0 = performance.now(), switchT = 0;
  const lerp = (a, b, k) => a.map((p, i) => [p[0] + (b[i][0]-p[0])*k, p[1] + (b[i][1]-p[1])*k]);
  const pts = arr => arr.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');
  function pose(t){
    const s = P[style], ph = reduce ? 0 : (1 - Math.cos((t - t0) / s.ms * Math.PI)) / 2;
    let p = lerp(s.a, s.b, ph);
    if (from){ const k = Math.min(1, (t - switchT) / 350); p = lerp(from, p, k*k*(3-2*k)); if (k >= 1) from = null; }
    return p;
  }
  let last;
  function draw(t){
    const p = last = pose(t), [n, h, le, lh, re, rh, lk, lf, rk, rf] = p;
    const dx = n[0]-h[0], dy = n[1]-h[1], L = Math.hypot(dx, dy);
    head.setAttribute('cx', (n[0] + dx/L*13).toFixed(1)); head.setAttribute('cy', (n[1] + dy/L*13).toFixed(1));
    limbs[0].setAttribute('points', pts([n, h]));
    limbs[1].setAttribute('points', pts([n, le, lh])); limbs[2].setAttribute('points', pts([n, re, rh]));
    limbs[3].setAttribute('points', pts([h, lk, lf])); limbs[4].setAttribute('points', pts([h, rk, rf]));
    if (style === 'ballet'){ const hx = h[0], hy = h[1] - 4; tutu.setAttribute('d', `M${hx-7} ${hy}L${hx-24} ${hy+9}Q${hx} ${hy+15} ${hx+24} ${hy+9}L${hx+7} ${hy}Z`); }
    else tutu.setAttribute('d', '');
    shadow.setAttribute('cx', ((lf[0] + rf[0]) / 2).toFixed(1));
  }
  const vis = onScreen(root, () => requestAnimationFrame(loop));
  function loop(t){ draw(t); if (!reduce && vis()) requestAnimationFrame(loop); }
  function set(k){ from = last; switchT = performance.now(); style = k; t0 = switchT; label.textContent = P[k].name.toUpperCase(); info.textContent = `${P[k].name} · one of the styles I learned`; if (reduce) requestAnimationFrame(loop); }
  chips(root, set);
  set('ballet'); draw(performance.now());
})();

/* ---------- music & poetry: two circles that meet in songs ---------- */
(() => {
  const root = document.getElementById('v-music'); if (!root) return;
  const svg = root.querySelector('svg'), info = root.querySelector('.vinfo');
  const d = defs(svg); glow(d, 'mg', 2.5);
  const venn = el('g', {class:'venn'}, svg);
  const A = el('circle', {cx:78, cy:84, r:46, fill:'#b8daff', 'fill-opacity':'.08', stroke:'#b8daff', 'stroke-opacity':'.6', 'stroke-width':1.2}, venn);
  const B = el('circle', {cx:122, cy:84, r:46, fill:'#9beeff', 'fill-opacity':'.08', stroke:'#9beeff', 'stroke-opacity':'.6', 'stroke-width':1.2}, venn);
  const cl = el('clipPath', {id:'mclip'}, d); el('circle', {cx:122, cy:84, r:46}, cl);
  const mid = el('circle', {cx:78, cy:84, r:46, fill:'#c4fff7', 'fill-opacity':'.12', 'clip-path':'url(#mclip)', 'pointer-events':'none'}, svg);
  const t = (x, y, s, size, fill) => { const e = el('text', {x, y, 'text-anchor':'middle', 'font-size':size, 'pointer-events':'none'}, svg); e.textContent = s; if (fill) e.style.fill = fill; return e; };
  t(58, 86, 'POETRY', 7); t(142, 86, 'SINGING', 7);
  const song = t(100, 88, 'songs', 9.5, '#eaf4ff'); song.style.fontFamily = 'Fraunces, Georgia, serif'; song.style.fontStyle = 'italic'; song.style.letterSpacing = '0';
  const N = 23, bars = [], wave = el('g', {filter:'url(#mg)'}, svg);
  for (let i = 0; i < N; i++) bars.push(el('line', {x1:22 + i*7, x2:22 + i*7, y1:166, y2:166, stroke:'#9beeff', 'stroke-width':3, 'stroke-linecap':'round'}, wave));
  let amp = 0, hl = null, playing = 0;
  const lines = {A:'poetry · a slam piece in Sec 4, then just for me', B:'singing · the other half of it', mid:'songs · where poetry and singing meet'};
  info.textContent = lines.mid;
  const pick = k => { hl = k; info.textContent = lines[k];
    A.setAttribute('fill-opacity', k === 'A' ? .22 : .08); B.setAttribute('fill-opacity', k === 'B' ? .22 : .08); mid.setAttribute('fill-opacity', k === 'mid' ? .35 : .12); };
  A.addEventListener('click', () => pick('A')); B.addEventListener('click', () => pick('B'));
  svg.addEventListener('click', e => { if (e.target === svg) pick('mid'); });
  // a short, soft melody (pentatonic) played only when asked
  root.querySelector('[data-k="hum"]').addEventListener('click', () => {
    pick('mid');
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const ac = new AC(), notes = [392, 440, 523.25, 587.33, 523.25, 440, 392, 329.63], now = ac.currentTime;
    notes.forEach((f, i) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, now + i*.32); g.gain.linearRampToValueAtTime(.08, now + i*.32 + .05); g.gain.exponentialRampToValueAtTime(.0001, now + i*.32 + .42);
      o.connect(g).connect(ac.destination); o.start(now + i*.32); o.stop(now + i*.32 + .45); });
    playing = performance.now() + notes.length*320; setTimeout(() => ac.close(), notes.length*320 + 600);
    if (reduce) loop(performance.now());
  });
  const vis = onScreen(root, () => requestAnimationFrame(loop));
  function loop(now){
    const target = now < playing ? 1 : .18; amp += (target - amp) * .08;
    bars.forEach((b, i) => { const h = 3 + amp * 22 * (.5 + .5*Math.sin(now/180 + i*.7)) * (1 - Math.abs(i - N/2)/(N*.62)); b.setAttribute('y1', (166 - h).toFixed(1)); b.setAttribute('y2', (166 + h).toFixed(1)); });
    song.setAttribute('font-size', (9.5 + amp*2).toFixed(2));
    if (!reduce && vis()) requestAnimationFrame(loop);
  }
  loop(performance.now());
})();

/* ---------- swimming: laps, and a results bar that takes its time ---------- */
(() => {
  const root = document.getElementById('v-swim'); if (!root) return;
  const cv = root.querySelector('canvas'), x = cv.getContext('2d'), info = root.querySelector('.vinfo');
  let W, H, laps = 0, pos = 0, dir = 1, speed = .0045, ripples = [];
  function size(){ const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W*dpr; cv.height = H*dpr; x.setTransform(dpr,0,0,dpr,0,0); }
  const results = () => laps < 2 ? 0 : Math.min(1, ((laps - 1) / 12) ** 1.6);
  function say(){ const r = results(); info.textContent = `lap ${laps} · ` + (r === 0 ? 'no results yet, keep going' : r < 1 ? 'starting to show' : 'hard to ignore now ✦'); }
  cv.addEventListener('click', e => { const r = cv.getBoundingClientRect(); ripples.push({x:e.clientX - r.left, y:e.clientY - r.top, t:0}); });
  chips(root, k => { speed = k === 'race' ? .0075 : .0032; });
  root.querySelector('[data-k="reset"]').addEventListener('click', () => { laps = 0; pos = 0; dir = 1; say(); });
  const vis = onScreen(root, () => requestAnimationFrame(loop));
  let prev = 0;
  function loop(t){
    const dt = Math.min(50, t - (prev || t)); prev = t;
    if (!reduce){ pos += dir * speed * dt / 16; if (pos > 1){ pos = 1; dir = -1; laps++; say(); } if (pos < 0){ pos = 0; dir = 1; laps++; say(); } }
    x.clearRect(0,0,W,H);
    const g = x.createLinearGradient(0,0,0,H); g.addColorStop(0,'rgba(79,132,184,.35)'); g.addColorStop(1,'rgba(30,66,102,.55)'); x.fillStyle = g; x.fillRect(0,0,W,H);
    // caustics
    x.strokeStyle = 'rgba(196,255,247,.08)'; x.lineWidth = 1.2;
    for (let i = 0; i < 9; i++){ x.beginPath(); for (let px = 0; px <= W; px += 8){ const py = i*H/8 + Math.sin(px/38 + t/900 + i)*5; px ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
    // lanes
    const top = H*.12, bot = H*.78, lanes = 4, lh = (bot - top)/lanes;
    for (let i = 0; i <= lanes; i++){ const y = top + i*lh; for (let px = 10; px < W - 10; px += 9){ x.fillStyle = (Math.floor(px/9) % 4 < 2) ? 'rgba(184,218,255,.55)' : 'rgba(155,238,255,.25)'; x.beginPath(); x.arc(px, y, 1.6, 0, 6.29); x.fill(); } }
    x.fillStyle = 'rgba(234,244,255,.18)'; x.fillRect(6, top, 3, bot - top); x.fillRect(W-9, top, 3, bot - top);
    // swimmer in lane 2
    const sy = top + lh*1.5, sx = 22 + pos*(W - 44), stroke = Math.sin(t/(speed > .005 ? 90 : 160));
    x.save(); x.translate(sx, sy); x.scale(dir, 1);
    x.fillStyle = 'rgba(155,238,255,.18)'; x.beginPath(); x.ellipse(-16, 0, 18, 5, 0, 0, 6.29); x.fill();
    x.fillStyle = '#eaf4ff'; x.shadowColor = 'rgba(155,238,255,.9)'; x.shadowBlur = 8;
    x.beginPath(); x.ellipse(0, 0, 15, 5, 0, 0, 6.29); x.fill(); x.beginPath(); x.arc(15, 0, 5, 0, 6.29); x.fill();
    x.strokeStyle = '#eaf4ff'; x.lineWidth = 3; x.lineCap = 'round';
    x.beginPath(); x.moveTo(4, -2); x.lineTo(4 + 13*stroke, -13*Math.abs(Math.cos(t/160))); x.moveTo(4, 2); x.lineTo(4 - 13*stroke, 13*Math.abs(Math.cos(t/160))); x.stroke();
    x.restore(); x.shadowBlur = 0;
    // ripples
    ripples = ripples.filter(r => (r.t += dt) < 1400);
    for (const r of ripples){ const k = r.t/1400; x.strokeStyle = `rgba(196,255,247,${(1-k)*.6})`; x.lineWidth = 1.2; x.beginPath(); x.arc(r.x, r.y, 4 + k*40, 0, 6.29); x.stroke(); }
    // results bar
    const r = results(), by = H*.88;
    x.font = '500 10px "Geist Mono", monospace'; x.fillStyle = 'rgba(160,187,214,.9)'; x.fillText('RESULTS', 14, by - 8);
    x.fillStyle = 'rgba(184,218,255,.15)'; x.fillRect(14, by, W - 28, 6);
    if (r){ x.fillStyle = '#ffd9a8'; x.shadowColor = 'rgba(255,217,168,.8)'; x.shadowBlur = r >= 1 ? 12 : 4; x.fillRect(14, by, (W - 28)*r, 6); x.shadowBlur = 0; }
    if (!reduce && vis()) requestAnimationFrame(loop);
  }
  addEventListener('resize', () => { size(); if (reduce) loop(performance.now()); });
  size(); say(); loop(performance.now());
})();

/* ---------- gym: load the bar toward a little goal ---------- */
(() => {
  const root = document.getElementById('v-gym'); if (!root) return;
  const svg = root.querySelector('svg'), info = root.querySelector('.vinfo');
  const d = defs(svg); glow(d, 'gg', 2);
  const BAR = 20; let goal = 40, kg = BAR;
  const lift = el('g', {}, svg);
  el('line', {x1:18, y1:100, x2:182, y2:100, stroke:'#b8daff', 'stroke-width':3.2, 'stroke-linecap':'round'}, lift);
  el('rect', {x:62, y:96, width:4, height:8, rx:1, fill:'#b8daff'}, lift); el('rect', {x:134, y:96, width:4, height:8, rx:1, fill:'#b8daff'}, lift);
  const plates = el('g', {filter:'url(#gg)'}, lift);
  const big = el('text', {x:100, y:58, 'text-anchor':'middle', 'font-size':22}, svg); big.style.fill = '#eaf4ff'; big.style.fontFamily = 'Fraunces, Georgia, serif'; big.style.fontStyle = 'italic'; big.style.letterSpacing = '0';
  const sub = el('text', {x:100, y:72, 'text-anchor':'middle', 'font-size':6.5}, svg);
  el('rect', {x:30, y:150, width:140, height:5, rx:2.5, fill:'#b8daff', 'fill-opacity':'.15'}, svg);
  const prog = el('rect', {x:30, y:150, width:0, height:5, rx:2.5, fill:'#9beeff'}, svg);
  const mk = (bx, label, act) => { const g = el('g', {class:'node', role:'button', tabindex:0}, svg);
    el('rect', {x:bx, y:166, width:58, height:18, rx:9, fill:'#9beeff', 'fill-opacity':'.12', stroke:'#9beeff', 'stroke-opacity':'.45'}, g);
    const tx = el('text', {x:bx+29, y:178, 'text-anchor':'middle', 'font-size':7}, g); tx.textContent = label; tx.style.fill = '#9beeff';
    g.addEventListener('click', act); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); act(); } }); };
  mk(38, '+ 5 KG', () => { if (kg < 140){ kg += 5; draw(true); } });
  mk(104, 'UNLOAD', () => { kg = BAR; draw(); });
  function draw(added){
    plates.innerHTML = '';
    let side = (kg - BAR)/2, i = 0; const sizes = [[20,34,'#9beeff'],[10,28,'#b8daff'],[5,22,'#c4fff7'],[2.5,16,'#eaf4ff']], done = kg >= goal;
    for (const [w, h, c] of sizes) while (side >= w - 1e-9){ side -= w;
      for (const s of [-1, 1]) el('rect', {x: s < 0 ? 56 - i*7 : 140 + i*7, y:100 - h/2, width:5, height:h, rx:1.6, fill: done ? '#ffd9a8' : c, 'fill-opacity': done ? .95 : .8}, plates);
      i++; }
    big.textContent = `${kg} kg`; sub.textContent = done ? 'GOAL HIT · BE PROUD' : `${goal - kg} KG TO YOUR GOAL`;
    prog.setAttribute('width', (140 * Math.min(1, (kg - BAR)/(goal - BAR))).toFixed(1)); prog.setAttribute('fill', done ? '#ffd9a8' : '#9beeff');
    lift.style.transition = reduce ? 'none' : 'transform .5s cubic-bezier(.3,1.6,.5,1)'; lift.style.transform = done ? 'translateY(-14px)' : 'none';
    info.textContent = done ? `goal of ${goal} hit ✦ set a new one` : `goal ${goal} · the bar alone is ${BAR}`;
  }
  chips(root, k => { goal = +k; draw(); });
  draw();
})();

/* ---------- content creation: post a topic, strangers join in ---------- */
(() => {
  const root = document.getElementById('v-content'); if (!root) return;
  const svg = root.querySelector('svg'), info = root.querySelector('.vinfo');
  const d = defs(svg); glow(d, 'cg', 2.4);
  const linkG = el('g', {}, svg), nodeG = el('g', {filter:'url(#cg)'}, svg), sparkG = el('g', {}, svg);
  const center = el('circle', {cx:100, cy:96, r:0, fill:'#eaf4ff'}, nodeG);
  const ctext = el('text', {x:100, y:116, 'text-anchor':'middle', 'font-size':7}, svg);
  let nodes = [], ideas = 0, posted = false, timers = [];
  const say = () => info.textContent = posted ? `${nodes.length} ${nodes.length === 1 ? 'stranger' : 'strangers'} talking · ${ideas} new ${ideas === 1 ? 'idea' : 'ideas'}` : 'nothing posted yet';
  function spark(x0, y0){ if (reduce) return; const s = el('text', {x:x0, y:y0, 'text-anchor':'middle', 'font-size':8}, sparkG); s.textContent = '✦'; s.style.fill = '#ffd9a8';
    s.animate([{transform:'translateY(0)', opacity:1}, {transform:'translateY(-16px)', opacity:0}], {duration:1100, easing:'ease-out'}).onfinish = () => s.remove(); }
  function join(){
    if (nodes.length >= 14) return;
    const a = Math.random()*6.28, r = 42 + Math.random()*40, n = {x:100 + Math.cos(a)*r, y:96 + Math.sin(a)*r*.85};
    n.x = Math.max(14, Math.min(186, n.x)); n.y = Math.max(14, Math.min(176, n.y));
    n.line = el('line', {x1:100, y1:96, x2:n.x, y2:n.y, stroke:'#b8daff', 'stroke-opacity':'.35', 'stroke-dasharray':'2 3'}, linkG);
    n.dot = el('circle', {cx:n.x, cy:n.y, r:3.4, fill:'#9beeff', class:'node'}, nodeG);
    n.dot.addEventListener('click', () => talk(n)); nodes.push(n);
    if (Math.random() < .5){ ideas++; spark(n.x, n.y - 6); }
    say();
  }
  function talk(n){ // strangers start talking to each other
    const o = nodes.filter(m => m !== n).sort((p, q) => Math.hypot(p.x-n.x, p.y-n.y) - Math.hypot(q.x-n.x, q.y-n.y))[0]; if (!o) return;
    el('line', {x1:n.x, y1:n.y, x2:o.x, y2:o.y, stroke:'#ffd9a8', 'stroke-opacity':'.6'}, linkG);
    ideas++; spark((n.x+o.x)/2, (n.y+o.y)/2 - 4); say();
  }
  function clear(){ timers.forEach(clearTimeout); timers = []; nodes = []; ideas = 0; posted = false; linkG.innerHTML = ''; [...nodeG.querySelectorAll('.node')].forEach(n => n.remove());
    center.setAttribute('r', 0); ctext.textContent = 'POST SOMETHING ↑'; say(); }
  root.querySelector('[data-k="post"]').addEventListener('click', () => {
    posted = true; center.setAttribute('r', 6); ctext.textContent = 'A TOPIC';
    if (!reduce) center.animate([{r:6}, {r:9}, {r:6}], {duration:600});
    for (let i = 0; i < 5; i++) timers.push(setTimeout(join, reduce ? 0 : 350 + i*420 + Math.random()*200));
    say();
  });
  root.querySelector('[data-k="reset"]').addEventListener('click', clear);
  clear(); info.textContent = 'post a topic, then tap a stranger';
})();
})();
