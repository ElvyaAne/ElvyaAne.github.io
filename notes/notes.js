// Class notes: renders the course list (notes/index.html) and one course (notes/course.html?c=<id>) from notes/courses.json.
(() => {
const $ = id => document.getElementById(id);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = u => /^(https?:|mailto:|\.{0,2}\/|files\/|#)/i.test(u) ? u : '#';
// Tiny formatter: blank line = new paragraph, **bold**, *italic*, `code`, [text](url).
const inline = s => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${safeUrl(u)}"${/^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`);
const paras = s => String(s ?? '').split(/\n\s*\n/).map(p => `<p>${inline(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
const fmtDate = d => { const t = new Date(d + 'T12:00:00'); return isNaN(t) ? esc(d) : t.toLocaleDateString('en-CA', {month:'short', day:'numeric', year:'numeric'}); };
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const ext = d => { const m = (d.file || d.url || '').split(/[?#]/)[0].match(/\.([a-z0-9]{1,5})$/i); return d.type || (m ? m[1] : (d.url ? 'link' : 'file')); };

function load(){
  return fetch('courses.json', {cache:'no-cache'}).then(r => { if (!r.ok) throw r.status; return r.json(); }).then(j => { const cs = j.courses || []; cs.upcoming = j.upcoming || []; return cs; });
}

// Groups courses by academic year and term ("Year 1 - Fall", "Year 1 - Winter", "Year 1 - Summer", ...), oldest first.
const SEASON = {fall:0, winter:1, summer:2};
const parseTerm = t => { const m = String(t||'').match(/year\s*(\d+)\s*[-–·,]?\s*(fall|winter|summer)/i); return m ? {y:+m[1], s:m[2][0].toUpperCase() + m[2].slice(1).toLowerCase()} : null; };
const termLabel = t => { const p = parseTerm(t); return p ? `Year ${p.y} · ${p.s}` : String(t||''); };
const card = c => `<li><a class="course" href="course.html?c=${encodeURIComponent(c.id)}">
    <span class="top"><span class="code">${esc(c.code)}</span><span class="term">${esc(termLabel(c.term))}</span></span>
    <span class="nm">${esc(c.name)}</span>
    <p class="bl">${inline(c.blurb)}</p>
    <span class="meta"><span>${plural((c.comments||[]).length, 'comment')}</span><span>${plural((c.documents||[]).length, 'document')}</span></span>
  </a></li>`;
function list(courses){
  const el = $('courses');
  if (!courses.length){ el.innerHTML = '<p class="empty">No courses yet.</p>'; return; }
  const groups = new Map();
  for (const c of courses){ const p = parseTerm(c.term), k = p ? `${p.y}|${p.s}` : ''; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(c); }
  const soon = new Map();
  for (const u of courses.upcoming || []){ const p = parseTerm(u.term); if (p){ const k = `${p.y}|${p.s}`; soon.set(k, u.note); if (!groups.has(k)) groups.set(k, []); } }
  if (groups.size === 1 && groups.has('')){ el.innerHTML = `<ol class="courses">${courses.map(card).join('')}</ol>`; return; }
  const order = k => { if (!k) return Infinity; const [y, t] = k.split('|'); return +y*3 + SEASON[t.toLowerCase()]; };
  const keys = [...groups.keys()].sort((a, b) => order(a) - order(b));
  el.classList.add('timeline');
  el.innerHTML = keys.map(k => { const [y, s] = k.split('|'), cs = groups.get(k);
    const next = !cs.length;
    return `<section class="term-group${next ? ' next' : ''}">
    <h2 class="term-h">${k ? `<span class="yr">Year ${esc(y)}</span><span class="sn">${esc(s)}</span>` : '<span class="sn">More courses</span>'}${next ? '' : `<span class="ct">${plural(cs.length, 'course')}</span>`}</h2>
    ${next ? `<p class="tbc">${inline(soon.get(k) || 'To be continued…')}</p>` : `<ol class="courses">${cs.map(card).join('')}</ol>`}</section>`; }).join('');
}

function course(courses){
  const id = new URLSearchParams(location.search).get('c'), c = courses.find(x => x.id === id);
  if (!c){
    $('cName').textContent = 'Course not found';
    $('cBlurb').innerHTML = 'That course isn\'t in my notes (yet). <a href="./">See all courses</a>.';
    document.querySelector('.cols').hidden = true; return;
  }
  document.title = `${c.code ? c.code + ' · ' : ''}${c.name} · Elvya Ané`;
  $('cCode').textContent = [c.code, c.term].filter(Boolean).join(' · ');
  $('cName').textContent = c.name;
  $('cBlurb').innerHTML = inline(c.blurb);
  const cm = (c.comments || []).slice().sort((a, b) => String(b.date||'').localeCompare(String(a.date||'')));
  $('cComments').innerHTML = cm.length ? cm.map(e => `<article class="entry">
    ${e.date ? `<span class="when">${fmtDate(e.date)}</span>` : ''}${e.title ? `<h3>${esc(e.title)}</h3>` : ''}${paras(e.text)}</article>`).join('')
    : '<p class="empty">No comments yet.</p>';
  const ds = c.documents || [];
  $('cDocs').innerHTML = ds.length ? `<ul class="docs">${ds.map(d => { const u = d.file || d.url || '#';
    return `<li><a href="${esc(safeUrl(u))}" target="_blank" rel="noopener"><span class="ty">${esc(ext(d))}</span><span class="t">${esc(d.title || u)}${d.note ? `<small>${inline(d.note)}</small>` : ''}</span><span class="ar">↗</span></a></li>`; }).join('')}</ul>`
    : `<p class="empty">${c.docsNote ? inline(c.docsNote) : 'No documents for this one.'}</p>`;
}

load().then(cs => ($('courses') ? list : course)(cs)).catch(() => {
  const t = $('courses') || $('cComments');
  if (t) t.innerHTML = '<p class="empty">Couldn\'t load the notes. Try refreshing.</p>';
  if ($('cName')) $('cName').textContent = 'Class notes';
});
})();
