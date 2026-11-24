// Hobbies as a shelf of floating figurines (same idea as the project stars on the home page).
// Click one and it slides aside; that hobby's card and toy open beside it on the bare sky.
(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const shelf = document.getElementById('hshelf'), grid = document.querySelector('.hgrid');
if (!shelf || !grid) return;
const cards = [...grid.querySelectorAll('.hc')];
const S = 'stroke="#eaf4ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"';
const F = 'fill="rgba(184,218,255,.22)"';

// each figurine: a tiny flat lavender/white drawing with its own little idle motion
const H = [
  {name:'Sudoku', status:'monthly trophies', s:1, svg:`
    <g class="f-sud"><rect x="14" y="14" width="72" height="72" rx="8" ${F} ${S}/>
    <path d="M38 14v72M62 14v72M14 38h72M14 62h72" stroke="rgba(234,244,255,.55)" stroke-width="2"/>
    <g font-family="Fraunces,Georgia,serif" font-size="17" fill="#eaf4ff" text-anchor="middle"><text x="26" y="32">5</text><text x="74" y="32">3</text><text x="50" y="56" class="tw">9</text><text x="26" y="80">7</text><text x="74" y="80" class="tw2">1</text></g></g>
    <circle class="f-trophy" cx="84" cy="16" r="8" fill="#ffd9a8"/>`},
  {name:'Dance', status:'tap · jazz · ballet', s:.95, svg:`
    <g class="f-dance" ${S}><circle cx="50" cy="20" r="8" ${F}/><path d="M50 28v26"/><path class="arm" d="M50 34 30 22M50 34 70 22"/>
    <path d="M36 54q14-8 28 0q-14 6-28 0z" ${F}/><path d="M50 56 46 84M50 56 64 76 74 70"/></g>`},
  {name:'Music & poetry', status:'songs, slam, singing', s:.9, svg:`
    <g ${S}><path d="M34 74V30l38-8v44"/><ellipse cx="27" cy="74" rx="8" ry="6" ${F}/><ellipse cx="65" cy="66" rx="8" ry="6" ${F}/></g>
    <g class="f-notes" fill="#eaf4ff"><circle cx="80" cy="36" r="3.5"/><circle cx="16" cy="40" r="2.5"/><circle cx="86" cy="58" r="2.5"/></g>`},
  {name:'Swimming', status:'since I was six', s:.95, svg:`
    <g class="f-swim" ${S}><circle cx="26" cy="56" r="8" ${F}/><path d="M34 60h40"/><path class="kick" d="M74 60l14-4M74 60l14 5"/>
    <path class="armL" d="M40 60q2-26 -18-24"/></g>
    <path class="f-wave" d="M-4 66q10-6 21 0t21 0 21 0 21 0 21 0" stroke="#9beeff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <g class="f-drops" fill="#9beeff"><circle cx="16" cy="40" r="2"/><circle cx="10" cy="48" r="1.6"/></g>`},
  {name:'Gym', status:'little goals', s:1, svg:`
    <g class="f-lift" ${S}><path d="M14 50h72"/><rect x="18" y="34" width="9" height="32" rx="3" ${F}/><rect x="28" y="40" width="6" height="20" rx="2" ${F}/>
    <rect x="73" y="34" width="9" height="32" rx="3" ${F}/><rect x="66" y="40" width="6" height="20" rx="2" ${F}/></g>
    <path class="f-spark" d="M50 18v-8M40 22l-5-6M60 22l5-6" stroke="#9beeff" stroke-width="2.5" stroke-linecap="round"/>`},
  {name:'Content creation', status:'posting, talking', s:.9, svg:`
    <g ${S}><rect x="30" y="14" width="40" height="72" rx="8" ${F}/><circle cx="50" cy="78" r="2.5" fill="#eaf4ff" stroke="none"/><path d="M40 34h20M40 44h14" stroke-width="2.5"/></g>
    <g class="f-bub"><path d="M70 30h20v14H78l-5 5v-5h-3z" fill="rgba(155,238,255,.25)" stroke="#9beeff" stroke-width="2" stroke-linejoin="round"/>
    <path class="b2" d="M8 52h20v14h-3v5l-5-5H8z" fill="rgba(196,255,247,.2)" stroke="#c4fff7" stroke-width="2" stroke-linejoin="round"/></g>`},
  {name:'Candy Crush', status:'level 4400', s:1, svg:`
    <g class="f-candy"><path d="M26 50 8 38v24zM74 50l18-12v24z" fill="rgba(184,218,255,.35)" stroke="#eaf4ff" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="50" cy="50" r="24" ${F} ${S}/><path d="M34 38q16 4 30 22M30 52q12 2 22 16M42 28q14 6 26 22" stroke="#9beeff" stroke-width="3" fill="none" stroke-linecap="round"/></g>`},
  {name:'Solitaire', status:'Klondike lvl 48', s:.9, svg:`
    <g class="f-cards" ${S}><rect class="c1" x="30" y="22" width="34" height="50" rx="5" ${F}/><rect class="c2" x="30" y="22" width="34" height="50" rx="5" ${F}/>
    <g class="c3"><rect x="30" y="22" width="34" height="50" rx="5" fill="#16314d"/><text x="38" y="38" font-family="Fraunces,Georgia,serif" font-size="13" fill="#eaf4ff" stroke="none">A</text><path d="M47 48c-6 6 0 12 0 12s6-6 0-12z" fill="#eaf4ff" stroke="none"/></g></g>`},
  {name:'Reading', status:'Les Mis forever', s:.9, svg:`
    <g ${S}><path d="M50 30q-16-10-36-6v50q20-4 36 6z" ${F}/><path d="M50 30q16-10 36-6v50q-20-4-36 6z" ${F}/><path d="M50 30v50"/></g>
    <path class="f-page" d="M50 30q16-10 36-6v50q-20-4-36 6z" fill="rgba(234,244,255,.35)" stroke="#eaf4ff" stroke-width="2"/>
    <path class="f-moon" d="M80 6a9 9 0 1 0 8 13a7 7 0 1 1-8-13z" fill="#ffd9a8"/>`},
  {name:'Musicals', status:'Hamilton & co.', s:.95, svg:`
    <g ${S}><path d="M12 16h76"/><path d="M12 16v70M88 16v70"/><path d="M8 86h84"/></g>
    <path class="f-curL" d="M14 18q12 34 2 66h-2z" fill="rgba(196,255,247,.3)" stroke="#c4fff7" stroke-width="2"/>
    <path class="f-curR" d="M86 18q-12 34-2 66h2z" fill="rgba(196,255,247,.3)" stroke="#c4fff7" stroke-width="2"/>
    <g class="f-bow" ${S}><circle cx="50" cy="44" r="6" ${F}/><path d="M50 50v18M50 56 40 50M50 56 60 50M50 68 44 82M50 68 56 82"/></g>
    <path d="M30 26 50 40 70 26" stroke="rgba(255,217,168,.6)" stroke-width="1.5" fill="none"/>`},
];

const EASE = 'cubic-bezier(.2,.8,.2,1)';
const B = H.map((h, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'hfig'; b.setAttribute('aria-expanded', 'false');
  b.style.cssText = `--s:${h.s};--d:${(i*.6).toFixed(1)}s;--fd:${(6.5 + (i*1.37)%3).toFixed(2)}s;--fo:${(-i*1.3).toFixed(1)}s;--fx:${(i%2?1:-1)*(5+i%3*2)}px`;
  b.innerHTML = `<span class="hf-art" aria-hidden="true"><span class="hf-glow"></span><span class="hf-shadow"></span><svg viewBox="0 0 100 100">${h.svg}</svg></span><span class="hf-lbl">${h.name}<em>${h.status}</em></span>`;
  b.addEventListener('click', e => toggle(i, e.detail === 0));
  shelf.appendChild(b); return b;
});
const info = document.createElement('div'); info.className = 'hinfo'; info.hidden = true; shelf.appendChild(info);
let openI = -1, home = null;
function open(i, kb){
  const sb = B[i], first = sb.getBoundingClientRect();
  shelf.classList.add('open'); openI = i;
  B.forEach((b, k) => { b.classList.toggle('sel', k === i); b.setAttribute('aria-expanded', String(k === i)); });
  info.hidden = false; info.innerHTML = '<button class="pback" type="button">← all hobbies</button>';
  // borrow the real card (text + toy) so everything stays playable
  home = cards[i].nextSibling; info.appendChild(cards[i]);
  info.querySelector('.pback').onclick = close;
  dispatchEvent(new Event('resize'));
  const t = shelf.getBoundingClientRect().top; if (t < 70) scrollBy({top:t-90, behavior:reduce?'auto':'smooth'});
  if (kb) info.querySelector('.pback').focus({preventScroll:true});
  if (reduce) return;
  const last = sb.getBoundingClientRect();
  sb.animate([{transform:`translate(${first.left-last.left}px,${first.top-last.top}px) scale(${first.width/last.width})`, transformOrigin:'top left'},{transform:'none', transformOrigin:'top left'}], {duration:750, easing:EASE});
  info.animate([{opacity:0, transform:'translateX(40px)'},{opacity:1, transform:'none'}], {duration:650, delay:250, easing:EASE, fill:'backwards'});
}
function close(){
  const i = openI; if (i < 0) return;
  const sb = B[i], first = sb.getBoundingClientRect();
  grid.insertBefore(cards[i], home);
  shelf.classList.remove('open'); openI = -1; info.hidden = true;
  B.forEach(b => { b.classList.remove('sel'); b.setAttribute('aria-expanded', 'false'); });
  sb.focus({preventScroll:true});
  if (reduce) return;
  const last = sb.getBoundingClientRect();
  sb.animate([{transform:`translate(${first.left-last.left}px,${first.top-last.top}px)`},{transform:'none'}], {duration:650, easing:EASE});
  B.forEach((b, k) => { if (k !== i) b.animate([{opacity:0, transform:'translateY(12px)'},{opacity:1, transform:'none'}], {duration:500, delay:150 + k*40, easing:EASE, fill:'backwards'}); });
}
function toggle(i, kb){ if (openI === i) close(); else { if (openI >= 0) close(); open(i, kb); } }
addEventListener('keydown', e => { if (e.key === 'Escape' && openI >= 0) close(); });
})();
