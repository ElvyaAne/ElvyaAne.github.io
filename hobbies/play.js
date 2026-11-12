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
  el('stop', {offset:'0', 'stop-color':'#b8daff', 'stop-opacity':'.22'}, sp); el('stop', {offset:'1', 'stop-color':'#b8daff', 'stop-opacity':'0'}, sp);
  el('line', {x1:20, y1:176, x2:180, y2:176, stroke:'#b8daff', 'stroke-opacity':'.35', 'stroke-dasharray':'2 4'}, svg);
  const shadow = el('ellipse', {cx:100, cy:177, rx:22, ry:3, fill:'#b8daff', 'fill-opacity':'.18'}, svg);
  const g = el('g', {filter:'url(#dg)', stroke:'#eaf4ff', 'stroke-width':4.2, 'stroke-linecap':'round', 'stroke-linejoin':'round', fill:'none'}, svg);
  const tutu = el('path', {fill:'#eaf4ff', 'fill-opacity':'.35', stroke:'#eaf4ff', 'stroke-width':1.2}, svg);
  const limbs = ['spine','larm','rarm','lleg','rleg'].map(() => el('polyline', {}, g));
  const head = el('circle', {r:8.5, fill:'#eaf4ff', stroke:'none'}, svg); head.setAttribute('filter', 'url(#dg)');
  const label = el('text', {x:100, y:194, 'text-anchor':'middle', 'font-size':7}, svg);
  // Each style is a short loop of its signature moves. A key is a set of joint angles in degrees
  // (0 = pointing down, 90 = to her right, 180 = up, -90 = to her left); she faces right.
  // Keys: t torso lean, la/lf left upper/fore arm, ra/rf right arm, lt/ls left thigh/shin, rt/rs right leg, up = rise off the floor.
  const K = (t, la, lf, ra, rf, lt, ls, rt, rs, up = 0) => ({t, la, lf, ra, rf, lt, ls, rt, rs, up});
  const P = {
    // first position, plié, relevé in passé with arms in fifth, arabesque
    ballet:{ms:900, name:'ballet', move:['first position', 'plié', 'passé on relevé', 'arabesque', 'arabesque', 'passé on relevé'], keys:[
      K(0, -30, 10, 30, -10, -6, -6, 6, 6),
      K(0, -70, -20, 70, 20, -28, 22, 28, -22),
      K(0, -150, 112, 150, -112, 0, 0, 78, -50, 4),
      K(14, -98, -92, 112, 108, 0, 0, -100, -98, 4),
      K(14, -98, -92, 112, 108, 0, 0, -100, -98, 4),
      K(0, -150, 112, 150, -112, 0, 0, 78, -50, 4)]},
    // jazz walk with isolations and jazz hands, then a high front kick (grand battement)
    jazz:{ms:430, name:'jazz', move:['jazz walk, jazz hands', 'jazz walk, jazz hands', 'jazz walk, jazz hands', 'jazz walk, jazz hands', 'kick', 'kick'], keys:[
      K(-8, -145, -165, 140, 160, -14, -4, 18, 30),
      K(8, -95, -95, 95, 95, -20, -32, 10, 4),
      K(-8, -145, -165, 140, 160, -14, -4, 18, 30),
      K(8, -95, -95, 95, 95, -20, -32, 10, 4),
      K(-6, -128, -135, 120, 126, -2, -2, 155, 158),
      K(-6, -128, -135, 120, 126, -2, -2, 155, 158)]},
    // upright and relaxed, all in the feet: shuffle (brush forward, brush back), ball change, heel drop
    tap:{ms:200, name:'tap', move:['shuffle', 'shuffle', 'ball change', 'heel drop', 'shuffle', 'shuffle', 'ball change', 'heel drop'], keys:[
      K(0, -18, -8, 22, 30, -4, 4, 28, 48),
      K(0, -10, 0, 12, 18, -4, 4, 6, -28),
      K(0, -16, -6, 18, 26, -10, -42, 4, 4),
      K(0, -14, -4, 14, 22, 12, -8, 12, -8, -2),
      K(0, -22, -30, 18, 8, 28, 48, 4, -4),
      K(0, -12, -18, 10, 0, 6, -28, 4, -4),
      K(0, -18, -26, 16, 6, 4, 4, -10, -42),
      K(0, -14, -22, 14, 4, 12, -8, 12, -8, -2)]},
    // fluid: curl in (contraction), release into a reaching lunge, then a tilt with the leg to the side
    contemporary:{ms:1050, name:'contemporary', move:['curl', 'release and reach', 'tilt', 'release and reach'], keys:[
      K(28, 40, 110, 30, 95, 40, -25, 50, -12),
      K(-16, -168, -150, 160, 176, -28, -12, 34, 0),
      K(-48, -62, -50, 148, 138, -6, -6, 122, 122),
      K(-16, -168, -150, 160, 176, -28, -12, 34, 0)]},
    // angular shapes: parallel stance with flexed arms, contraction, Horton flat back, lateral T
    modern:{ms:800, name:'modern', move:['parallel, flexed arms', 'contraction', 'flat back', 'parallel, flexed arms', 'lateral T', 'lateral T'], keys:[
      K(0, -90, 180, 90, 0, -6, -6, 6, 6),
      K(20, 60, 125, 70, 135, 14, -10, 20, -10),
      K(88, 92, 92, 88, 88, -10, -10, 10, 10),
      K(0, -90, 180, 90, 0, -6, -6, 6, 6),
      K(-88, -92, -92, -86, -86, 0, 0, 90, 90),
      K(-88, -92, -92, -86, -86, 0, 0, 90, 90)]},
    // bouncy grooves: the running man, then a two-step with the arms
    hiphop:{ms:300, name:'hip hop', move:['running man', 'running man', 'running man', 'running man', 'two-step', 'two-step', 'two-step', 'two-step'], keys:[
      K(8, 40, 160, -40, 140, 12, -12, 100, 0),
      K(4, -20, 120, 30, 170, -32, -22, 14, -14),
      K(8, -40, 140, 40, 160, 100, 0, 12, -12),
      K(4, 30, 170, -20, 120, 14, -14, -32, -22),
      K(10, -30, 80, 30, -60, -24, -4, 20, 30),
      K(14, -20, 40, 40, -20, -10, 14, 30, -10),
      K(10, -30, -60, 30, 80, -20, -30, 24, 4),
      K(14, -40, 20, 20, 40, -30, 10, 10, -14)]},
  };
  const UA = 19, FA = 18, TH = 26, SH = 26, SP = 46, FLOOR = 176;
  const v = (a, l) => [Math.sin(a*Math.PI/180)*l, Math.cos(a*Math.PI/180)*l];
  const add = (p, q) => [p[0]+q[0], p[1]+q[1]];
  function solve(k){
    const hip0 = [0, 0], neck = add(hip0, [Math.sin(k.t*Math.PI/180)*SP, -Math.cos(k.t*Math.PI/180)*SP]);
    const le = add(neck, v(k.la, UA)), lh = add(le, v(k.lf, FA)), re = add(neck, v(k.ra, UA)), rh = add(re, v(k.rf, FA));
    const lk = add(hip0, v(k.lt, TH)), lf = add(lk, v(k.ls, SH)), rk = add(hip0, v(k.rt, TH)), rf = add(rk, v(k.rs, SH));
    // keep her standing on the floor: the lowest foot touches it (minus any relevé or jump)
    const low = Math.max(lf[1], rf[1]), dx = 100, dy = FLOOR - low - k.up;
    return [neck, hip0, le, lh, re, rh, lk, lf, rk, rf].map(p => [p[0] + dx, p[1] + dy]);
  }
  const mix = (a, b, e) => { const o = {}; for (const key in a) o[key] = a[key] + (b[key] - a[key])*e; return o; };
  let style = 'ballet', from = null, t0 = performance.now(), switchT = 0, step = -1;
  const lerp = (a, b, k) => a.map((p, i) => [p[0] + (b[i][0]-p[0])*k, p[1] + (b[i][1]-p[1])*k]);
  const pts = arr => arr.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');
  function pose(t){
    const s = P[style], n = s.keys.length, f = reduce ? 0 : (t - t0) / s.ms, i = Math.floor(f) % n, e = f - Math.floor(f), sm = e*e*(3-2*e);
    if (i !== step){ step = i; info.textContent = `${s.name} · ${s.move[i]}`; }
    let p = solve(mix(s.keys[i], s.keys[(i+1) % n], sm));
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
    if (style === 'ballet'){ const ux = dx/L, uy = dy/L, px = -uy, py = ux, at = (a, b) => `${(h[0]+ux*a+px*b).toFixed(1)} ${(h[1]+uy*a+py*b).toFixed(1)}`;
      tutu.setAttribute('d', `M${at(5,-6)}L${at(-3,-24)}Q${at(-10,0)} ${at(-3,24)}L${at(5,6)}Z`); }
    else tutu.setAttribute('d', '');
    shadow.setAttribute('cx', ((lf[0] + rf[0]) / 2).toFixed(1));
  }
  const vis = onScreen(root, () => requestAnimationFrame(loop));
  function loop(t){ draw(t); if (!reduce && vis()) requestAnimationFrame(loop); }
  function set(k){ from = last; switchT = performance.now(); style = k; t0 = switchT; label.textContent = P[k].name.toUpperCase(); step = -1; if (reduce) requestAnimationFrame(loop); }
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
  const B = el('circle', {cx:122, cy:84, r:46, fill:'#b8daff', 'fill-opacity':'.08', stroke:'#b8daff', 'stroke-opacity':'.6', 'stroke-width':1.2}, venn);
  const cl = el('clipPath', {id:'mclip'}, d); el('circle', {cx:122, cy:84, r:46}, cl);
  const mid = el('circle', {cx:78, cy:84, r:46, fill:'#eaf4ff', 'fill-opacity':'.12', 'clip-path':'url(#mclip)', 'pointer-events':'none'}, svg);
  const t = (x, y, s, size, fill) => { const e = el('text', {x, y, 'text-anchor':'middle', 'font-size':size, 'pointer-events':'none'}, svg); e.textContent = s; if (fill) e.style.fill = fill; return e; };
  t(58, 86, 'POETRY', 7); t(142, 86, 'SINGING', 7);
  const song = t(100, 88, 'songs', 9.5, '#eaf4ff'); song.style.fontFamily = 'Fraunces, Georgia, serif'; song.style.fontStyle = 'italic'; song.style.letterSpacing = '0';
  const N = 23, bars = [], wave = el('g', {filter:'url(#mg)'}, svg);
  for (let i = 0; i < N; i++) bars.push(el('line', {x1:22 + i*7, x2:22 + i*7, y1:166, y2:166, stroke:'#b8daff', 'stroke-width':3, 'stroke-linecap':'round'}, wave));
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
    // iPhones mute web audio on silent mode unless the page asks for media playback
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch(e){}
    const ac = new AC(); if (ac.state === 'suspended') ac.resume();
    const notes = [392, 440, 523.25, 587.33, 523.25, 440, 392, 329.63], now = ac.currentTime;
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
    // flat water, same as the other panels
    // caustics
    x.strokeStyle = 'rgba(234,244,255,.08)'; x.lineWidth = 1.2;
    for (let i = 0; i < 9; i++){ x.beginPath(); for (let px = 0; px <= W; px += 8){ const py = i*H/8 + Math.sin(px/38 + t/900 + i)*5; px ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
    // lanes
    const top = H*.12, bot = H*.78, lanes = 4, lh = (bot - top)/lanes;
    for (let i = 0; i <= lanes; i++){ const y = top + i*lh; for (let px = 10; px < W - 10; px += 9){ x.fillStyle = (Math.floor(px/9) % 4 < 2) ? 'rgba(184,218,255,.55)' : 'rgba(184,218,255,.25)'; x.beginPath(); x.arc(px, y, 1.6, 0, 6.29); x.fill(); } }
    x.fillStyle = 'rgba(234,244,255,.18)'; x.fillRect(6, top, 3, bot - top); x.fillRect(W-9, top, 3, bot - top);
    // swimmer in lane 2, seen from above: cap, shoulders, alternating freestyle arms, kicking legs
    const sy = top + lh*1.5, sx = 46 + pos*(W - 92), ph = t/(speed > .006 ? 110 : 190), arm = Math.sin(ph), kick = Math.sin(ph*3);
    x.save(); x.translate(sx, sy); x.scale(dir*1.6, 1.6);
    x.strokeStyle = '#eaf4ff'; x.fillStyle = '#eaf4ff'; x.lineCap = 'round'; x.lineJoin = 'round'; x.shadowColor = 'rgba(184,218,255,.7)'; x.shadowBlur = 6;
    // legs
    x.lineWidth = 3; x.beginPath(); x.moveTo(-8, -2.5); x.lineTo(-22, -3.5 + kick*1.6); x.moveTo(-8, 2.5); x.lineTo(-22, 3.5 - kick*1.6); x.stroke();
    // torso (shoulders wider than hips)
    x.beginPath(); x.moveTo(-9, -3.2); x.lineTo(4, -6.2); x.quadraticCurveTo(7, 0, 4, 6.2); x.lineTo(-9, 3.2); x.closePath(); x.fill();
    // arms: one reaching past the head, the other pulling back along the side
    const reach = (side, k) => { const ext = (k + 1)/2; x.beginPath(); x.moveTo(3, side*5.5); x.lineTo(3 + 8*ext - 6*(1-ext), side*(6.5 + 2*(1-ext))); x.lineTo(3 + 17*ext - 12*(1-ext), side*(4 + 3*(1-ext))); x.stroke(); };
    x.lineWidth = 2.6; reach(-1, arm); reach(1, -arm);
    // head with a swim cap
    x.fillStyle = '#b8daff'; x.beginPath(); x.arc(9.5, 0, 4.4, 0, 6.29); x.fill();
    x.shadowBlur = 0;
    // a little splash at the feet
    x.fillStyle = 'rgba(234,244,255,.55)'; for (let i = 0; i < 4; i++){ const a = ph*2 + i*1.7; x.beginPath(); x.arc(-25 - Math.abs(Math.sin(a))*4, Math.cos(a)*5, 1.1, 0, 6.29); x.fill(); }
    x.restore();
    // ripples
    ripples = ripples.filter(r => (r.t += dt) < 1400);
    for (const r of ripples){ const k = r.t/1400; x.strokeStyle = `rgba(234,244,255,${(1-k)*.6})`; x.lineWidth = 1.2; x.beginPath(); x.arc(r.x, r.y, 4 + k*40, 0, 6.29); x.stroke(); }
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
  const prog = el('rect', {x:30, y:150, width:0, height:5, rx:2.5, fill:'#b8daff'}, svg);
  const mk = (bx, label, act) => { const g = el('g', {class:'node', role:'button', tabindex:0}, svg);
    el('rect', {x:bx, y:166, width:58, height:18, rx:9, fill:'#b8daff', 'fill-opacity':'.12', stroke:'#b8daff', 'stroke-opacity':'.45'}, g);
    const tx = el('text', {x:bx+29, y:178, 'text-anchor':'middle', 'font-size':7}, g); tx.textContent = label; tx.style.fill = '#b8daff';
    g.addEventListener('click', act); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); act(); } }); };
  mk(38, '+ 5 KG', () => { if (kg < 140){ kg += 5; draw(true); } });
  mk(104, 'UNLOAD', () => { kg = BAR; draw(); });
  function draw(added){
    plates.innerHTML = '';
    let side = (kg - BAR)/2, i = 0; const sizes = [[20,34,'#b8daff'],[10,28,'#b8daff'],[5,22,'#eaf4ff'],[2.5,16,'#eaf4ff']], done = kg >= goal;
    for (const [w, h, c] of sizes) while (side >= w - 1e-9){ side -= w;
      for (const s of [-1, 1]) el('rect', {x: s < 0 ? 56 - i*7 : 140 + i*7, y:100 - h/2, width:5, height:h, rx:1.6, fill: done ? '#ffd9a8' : c, 'fill-opacity': done ? .95 : .8}, plates);
      i++; }
    big.textContent = `${kg} kg`; sub.textContent = done ? 'GOAL HIT · BE PROUD' : `${goal - kg} KG TO YOUR GOAL`;
    prog.setAttribute('width', (140 * Math.min(1, (kg - BAR)/(goal - BAR))).toFixed(1)); prog.setAttribute('fill', done ? '#ffd9a8' : '#b8daff');
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
    n.dot = el('circle', {cx:n.x, cy:n.y, r:3.4, fill:'#b8daff', class:'node'}, nodeG);
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

/* ---------- candy crush: a tiny match-three made of stars ---------- */
(() => {
  const root = document.getElementById('v-match'); if (!root) return;
  const svg = root.querySelector('svg'), info = root.querySelector('.vinfo');
  const d = defs(svg); glow(d, 'xg', 1.6);
  const N = 7, S = 200/N, COLS = ['#eaf4ff', '#b8daff', '#ffd9a8', '#d9c8ff', '#9fc3e8'];
  const SHAPES = [ // star, diamond, circle, heart-ish, square: so colour isn't the only clue
    r => `M0 ${-r}L${r*.3} ${-r*.3}L${r} 0L${r*.3} ${r*.3}L0 ${r}L${-r*.3} ${r*.3}L${-r} 0L${-r*.3} ${-r*.3}Z`,
    r => `M0 ${-r}L${r*.8} 0L0 ${r}L${-r*.8} 0Z`,
    r => `M${-r*.85} 0A${r*.85} ${r*.85} 0 1 0 ${r*.85} 0A${r*.85} ${r*.85} 0 1 0 ${-r*.85} 0Z`,
    r => `M0 ${r*.9}C${-r*1.2} ${-r*.1} ${-r*.5} ${-r*1} 0 ${-r*.35}C${r*.5} ${-r*1} ${r*1.2} ${-r*.1} 0 ${r*.9}Z`,
    r => `M${-r*.7} ${-r*.7}H${r*.7}V${r*.7}H${-r*.7}Z`];
  const g = el('g', {filter:'url(#xg)'}, svg), selR = el('rect', {width:S-4, height:S-4, rx:5, fill:'none', stroke:'#eaf4ff', 'stroke-width':1.2, opacity:0}, svg);
  let B = [], sel = -1, score = 0, busy = false;
  const rnd = () => Math.random()*COLS.length|0;
  function fresh(){ do { B = Array.from({length:N*N}, rnd); } while (runs().size); score = 0; sel = -1; draw(); say(); }
  function runs(){ const m = new Set();
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){ const i = r*N+c, v = B[i]; if (v < 0) continue;
      if (c <= N-3 && B[i+1] === v && B[i+2] === v){ let k = c; while (k < N && B[r*N+k] === v) m.add(r*N + k++); }
      if (r <= N-3 && B[i+N] === v && B[i+2*N] === v){ let k = r; while (k < N && B[k*N+c] === v) m.add(k++*N + c); } }
    return m; }
  function draw(pop){ g.innerHTML = '';
    B.forEach((v, i) => { if (v < 0) return; const x = (i%N + .5)*S, y = ((i/N|0) + .5)*S;
      const p = el('path', {d:SHAPES[v](S*.32), fill:COLS[v], transform:`translate(${x.toFixed(1)} ${y.toFixed(1)})`, 'data-i':i}, g);
      if (pop && pop.has(i) && !reduce) p.animate([{opacity:0, transform:`translate(${x}px, ${y - 14}px)`}, {opacity:1, transform:`translate(${x}px, ${y}px)`}], {duration:260, easing:'ease-out'}); });
    if (sel >= 0){ selR.setAttribute('x', (sel%N*S + 2).toFixed(1)); selR.setAttribute('y', ((sel/N|0)*S + 2).toFixed(1)); selR.setAttribute('opacity', 1); } else selR.setAttribute('opacity', 0); }
  const say = msg => info.textContent = msg || `my level: 4200 · your score: ${score}`;
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  async function resolve(){ let chain = 0, m;
    while ((m = runs()).size){ chain++; score += m.size * chain;
      const els = [...g.querySelectorAll('path')].filter(p => m.has(+p.dataset.i));
      if (!reduce) els.forEach(p => p.animate([{opacity:1}, {opacity:0}], {duration:220, fill:'forwards'}));
      await wait(230); m.forEach(i => B[i] = -1);
      const born = new Set();
      for (let c = 0; c < N; c++){ const col = []; for (let r = N-1; r >= 0; r--) if (B[r*N+c] >= 0) col.push(B[r*N+c]);
        for (let r = N-1, k = 0; r >= 0; r--, k++){ if (k < col.length) B[r*N+c] = col[k]; else { B[r*N+c] = rnd(); born.add(r*N+c); } } }
      draw(born); say(chain > 1 ? `chain ×${chain} ✦ your score: ${score}` : null); await wait(280); }
    return chain; }
  svg.addEventListener('click', async e => {
    const t = e.target.closest('path[data-i]'); if (!t || busy) return; const i = +t.dataset.i;
    if (sel < 0){ sel = i; draw(); return; }
    const a = sel, adj = Math.abs(a - i) === N || (Math.abs(a - i) === 1 && (a/N|0) === (i/N|0)); sel = -1;
    if (!adj){ sel = i; draw(); return; }
    busy = true; [B[a], B[i]] = [B[i], B[a]]; draw();
    if (!(await resolve())){ await wait(180); [B[a], B[i]] = [B[i], B[a]]; draw(); say('no match there, try another swap'); }
    busy = false; });
  root.querySelector('[data-k="new"]').addEventListener('click', () => { if (!busy) fresh(); });
  fresh();
})();
})();
