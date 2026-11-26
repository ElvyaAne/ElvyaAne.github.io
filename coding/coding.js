// Coding notes: renders the topic list (coding/index.html) and one topic (coding/topic.html?t=<id>) from coding/topics.json.
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
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const ext = d => { const m = (d.file || d.url || '').split(/[?#]/)[0].match(/\.([a-z0-9]{1,5})$/i); return d.type || (m ? m[1] : (d.url ? 'link' : 'file')); };
const pages = t => (t.pages || []).map(p => typeof p === 'string' ? {file:p} : p).filter(p => p.file);

// What shows while there are no notes yet: a blank notebook page.
const EMPTY = `<div class="nb" role="note">
  <div class="nb-page">
    <span class="lab">page 1</span>
    <p class="nb-h">Still in the notebook.</p>
    <p class="nb-t">I filled these pages by hand over the summer. They'll show up here once I've had the time to scan them.</p>
    <code class="nb-c" aria-hidden="true">while (!scanned) { notes.wait(); }</code>
  </div>
</div>`;

const card = t => { const ps = pages(t), ds = t.documents || [], cover = t.cover || (ps[0] && ps[0].file);
  return `<li><a class="topic${ps.length || ds.length ? '' : ' wait'}" href="topic.html?t=${encodeURIComponent(t.id)}">
    ${cover ? `<span class="cover"><img src="${esc(safeUrl(cover))}" alt="" loading="lazy"></span>` : ''}
    <span class="top"><span class="code">${esc(t.tag || '')}</span><span class="term">${esc(t.when || (t.together ? 'one set of notes' : ''))}</span></span>
    <span class="nm">${esc(t.title)}</span>
    ${t.blurb ? `<p class="bl">${inline(t.blurb)}</p>` : ''}
    <span class="meta">${ps.length ? `<span>${plural(ps.length, 'page')}</span>` : '<span class="soon">pages coming soon</span>'}${t.extra ? `<span>${esc(t.extra)}</span>` : ''}${ds.length ? `<span>${plural(ds.length, 'file')}</span>` : ''}</span>
  </a></li>`; };

function list(topics){
  $('topics').innerHTML = topics.length ? `<ol class="topics">${topics.map(card).join('')}</ol>` : EMPTY;
}

function topic(topics){
  const id = new URLSearchParams(location.search).get('t'), t = topics.find(x => x.id === id);
  if (!t){
    $('tName').textContent = 'Topic not found';
    $('tBlurb').innerHTML = 'That one isn\'t in my coding notes (yet). <a href="./">See all coding notes</a>.';
    return;
  }
  document.title = `${t.title} · Coding notes · Elvya Ané`;
  $('tTag').textContent = ['Coding notes', t.tag, t.when].filter(Boolean).join(' · ');
  $('tName').textContent = t.title;
  $('tBlurb').innerHTML = inline(t.blurb);
  const ps = pages(t), ds = t.documents || [];
  $('tBody').innerHTML =
    (t.thoughts ? `<section class="panel thoughts"><span class="lab">my thoughts</span>${paras(t.thoughts)}</section>` : '')
    + (ps.length ? `<ol class="pages">${ps.map((p, i) => `<li><a href="${esc(safeUrl(p.file))}" target="_blank" rel="noopener">
        <img src="${esc(safeUrl(p.file))}" alt="${esc(p.alt || `${t.title}, page ${i + 1}`)}" loading="lazy">
        <span class="pn">${esc(p.caption || `page ${i + 1}`)}</span></a></li>`).join('')}</ol>` : '')
    + (ds.length ? `<section class="panel"><span class="lab">files</span><ul class="docs">${ds.map(d => { const u = d.file || d.url || '#';
        return `<li><a href="${esc(safeUrl(u))}" target="_blank" rel="noopener"><span class="ty">${esc(ext(d))}</span><span class="t">${esc(d.title || u)}${d.note ? `<small>${inline(d.note)}</small>` : ''}</span><span class="ar">↗</span></a></li>`; }).join('')}</ul></section>` : '')
    + (t.list ? '<div id="pList"><p class="empty">Loading the list…</p></div>' : '')
    || EMPTY;
  if (t.list) fetch(t.list, {cache:'no-cache'}).then(r => { if (!r.ok) throw r.status; return r.json(); })
    .then(problemSet).catch(() => { $('pList').innerHTML = '<p class="empty">Couldn\'t load the list. Try refreshing.</p>'; });
}

// A problem set (like the NeetCode 150): my typed-up pattern notes by day, then every problem grouped by category.
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const LV = {easy:'E', medium:'M', hard:'H'};
function problemSet(j){
  const cats = j.categories || [], noted = {};
  (j.notes || []).forEach(d => (d.topics || []).forEach(s => { noted[s.category] = {day: d.day, id: 'n-' + slug(s.category)}; }));
  const total = cats.reduce((n, c) => n + c.problems.length, 0);
  const count = lv => cats.reduce((n, c) => n + c.problems.filter(p => p.level === lv).length, 0);
  const notes = (j.notes || []).length ? `<section class="ps-notes"><span class="lab">my notes, typed up</span>${j.notes.map(d => `
    <div class="ps-day"><h2 class="ps-date">${esc(d.day)}</h2>${(d.topics || []).map(s => `
      <article class="panel ps-topic" id="n-${slug(s.category)}"><h3>${esc(s.title)}</h3>${s.sub ? `<p class="ps-sub">${inline(s.sub)}</p>` : ''}
        <ul class="ps-pats">${(s.patterns || []).map(p => `<li${p.text ? '' : ' class="bare"'}><mark>${inline(p.name)}</mark>${p.text ? paras(p.text) : ''}</li>`).join('')}</ul>
      </article>`).join('')}</div>`).join('')}</section>` : '';
  const list = `<section class="ps-list"><span class="lab">the list</span>
    <h2 class="ps-h">All ${total} problems</h2>
    <p class="ps-split"><span class="lv easy">${count('easy')} easy</span><span class="lv medium">${count('medium')} medium</span><span class="lv hard">${count('hard')} hard</span></p>
    <div class="ps-filter" role="group" aria-label="Show problems">${['all','easy','medium','hard'].map(f => `<button type="button" data-f="${f}"${f === 'all' ? ' aria-pressed="true"' : ' aria-pressed="false"'}>${f}</button>`).join('')}</div>
    ${cats.map((c, i) => { const n = noted[c.name];
      return `<details class="ps-cat"${i === 0 ? ' open' : ''}><summary><span class="ci">${String(i + 1).padStart(2, '0')}</span><span class="cn">${esc(c.name)}</span>
        ${n ? `<a class="cnote" href="#${n.id}">✦ in my notes</a>` : ''}<span class="cc">${c.problems.length}</span></summary>
        <ol class="ps-probs">${c.problems.map(p => `<li data-l="${esc(p.level)}"><a href="https://leetcode.com/problems/${encodeURIComponent(p.slug)}/" target="_blank" rel="noopener">
          <span class="pt">${esc(p.title)}</span><span class="lv ${esc(p.level)}" title="${esc(p.level)}">${esc(p.level)}</span><span class="ar">↗</span></a></li>`).join('')}</ol></details>`; }).join('')}
  </section>`;
  $('pList').innerHTML = notes + list;
  document.querySelectorAll('.cnote').forEach(a => a.addEventListener('click', e => { e.preventDefault(); document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'}); }));
  const btns = [...document.querySelectorAll('.ps-filter button')];
  btns.forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.f; btns.forEach(x => x.setAttribute('aria-pressed', x === b));
    document.querySelectorAll('.ps-probs li').forEach(li => { li.hidden = f !== 'all' && li.dataset.l !== f; });
    document.querySelectorAll('.ps-cat').forEach(d => { const any = d.querySelector('.ps-probs li:not([hidden])'); d.hidden = !any; if (f !== 'all') d.open = true; });
  }));
}

// Full-size view for a note page: tap a page to open it, then ✕, Esc, or tapping outside closes it.
function lightbox(){
  const links = [...document.querySelectorAll('.pages a')];
  if (!links.length) return;
  const box = document.createElement('div');
  box.className = 'lb'; box.hidden = true;
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Note page');
  box.innerHTML = `<div class="lb-bar"><span class="lb-cap"></span><a class="lb-raw" target="_blank" rel="noopener">open original ↗</a><button type="button" class="lb-x" aria-label="Close">✕</button></div>
    <div class="lb-scroll"><img class="lb-img" alt=""></div>
    <button type="button" class="lb-nav lb-prev" aria-label="Previous page">‹</button><button type="button" class="lb-nav lb-next" aria-label="Next page">›</button>`;
  document.body.appendChild(box);
  const img = box.querySelector('.lb-img'), cap = box.querySelector('.lb-cap'), raw = box.querySelector('.lb-raw'), x = box.querySelector('.lb-x'), sc = box.querySelector('.lb-scroll');
  let at = 0, back = null;
  const show = i => {
    at = (i + links.length) % links.length; const a = links[at], im = a.querySelector('img');
    img.src = a.getAttribute('href'); img.alt = im ? im.alt : '';
    cap.textContent = `${a.querySelector('.pn')?.textContent || ''}${links.length > 1 ? `  ·  ${at + 1} / ${links.length}` : ''}`;
    raw.href = a.getAttribute('href'); sc.scrollTop = 0;
  };
  const open = i => { back = document.activeElement; show(i); box.hidden = false; document.documentElement.classList.add('lb-on'); x.focus(); };
  const close = () => { box.hidden = true; document.documentElement.classList.remove('lb-on'); if (back) back.focus(); };
  box.classList.toggle('single', links.length < 2);
  links.forEach((a, i) => a.addEventListener('click', e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); open(i); }));
  x.addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', () => show(at - 1));
  box.querySelector('.lb-next').addEventListener('click', () => show(at + 1));
  sc.addEventListener('click', e => { if (e.target === sc) close(); });
  addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && links.length > 1) show(at - 1);
    else if (e.key === 'ArrowRight' && links.length > 1) show(at + 1);
    else if (e.key === 'Tab'){ const f = [...box.querySelectorAll('a,button')].filter(el => el.offsetParent); const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0){ e.preventDefault(); f[f.length-1].focus(); } else if (!e.shiftKey && i === f.length-1){ e.preventDefault(); f[0].focus(); } }
  });
}

fetch('topics.json', {cache:'no-cache'}).then(r => { if (!r.ok) throw r.status; return r.json(); })
  .then(j => { ($('topics') ? list : topic)(j.topics || []); lightbox(); })
  .catch(() => {
    const el = $('topics') || $('tBody');
    if (el) el.innerHTML = '<p class="empty">Couldn\'t load the notes. Try refreshing.</p>';
    if ($('tName')) $('tName').textContent = 'Coding notes';
  });
})();
