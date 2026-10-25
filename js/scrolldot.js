// Bright dot that rides down the right edge as you scroll, for the page and the note window.
(() => {
  const PAD = 14;
  function track(scroller, box, getRange){
    const dot = document.createElement('i');
    dot.className = 'sdot';
    box.appendChild(dot);
    let raf = 0;
    const draw = () => {
      raf = 0;
      const max = scroller.scrollHeight - scroller.clientHeight;
      dot.classList.toggle('on', max > 2);
      if (max <= 2) return;
      const [top, len] = getRange();
      const y = top + PAD + (len - PAD * 2) * Math.min(1, Math.max(0, scroller.scrollTop / max));
      dot.style.transform = `translateY(${y}px)`;
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(draw); };
    (scroller === document.scrollingElement ? window : scroller).addEventListener('scroll', queue, {passive:true});
    window.addEventListener('resize', queue);
    new MutationObserver(queue).observe(scroller === document.scrollingElement ? document.body : scroller, {childList:true, subtree:true});
    queue();
  }

  const page = document.scrollingElement;
  track(page, document.body, () => [0, window.innerHeight]);

  const win = document.getElementById('win'), body = document.getElementById('body');
  if (win && body){
    if (getComputedStyle(win).position === 'static') win.style.position = 'relative';
    track(body, win, () => [body.offsetTop, body.clientHeight]);
  }
})();
