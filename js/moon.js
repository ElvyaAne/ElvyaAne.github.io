/* Moon icons that follow the real lunar phase: days since a known new moon (2000-01-06 18:14 UTC), modulo the synodic month.
   Tab favicon: transparent PNG, colours tuned for light or dark browser chrome.
   Home-screen icon (apple-touch-icon): full-bleed night sky, since iOS fills transparent corners with black. */
(function(){
  function phase(t){ return (((t-Date.UTC(2000,0,6,18,14))/864e5/29.530588853)%1+1)%1; }

  // Draws the moon on a size x size canvas. o.bg fills the square with night sky; o.scale is the moon's diameter as a share of size.
  function paint(ctx,size,p,o){
    var s=size/64, r=28*(o.scale||0.875)/0.875, waxing=p<0.5, c=Math.cos(2*Math.PI*p), rx=Math.abs(r*c);
    ctx.clearRect(0,0,size,size);
    if(o.bg){
      var g=ctx.createLinearGradient(0,0,0,size); g.addColorStop(0,'#0d1e2e'); g.addColorStop(1,'#1e4266');
      ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
    }
    ctx.save(); ctx.scale(s,s);
    ctx.beginPath(); ctx.arc(32,32,r,0,2*Math.PI); ctx.fillStyle=o.shadow; ctx.fill();
    ctx.beginPath();
    // Lit side: outer half circle, closed by the terminator (half ellipse); same geometry as the original SVG path.
    if(waxing) ctx.arc(32,32,r,-Math.PI/2,Math.PI/2,false); else ctx.arc(32,32,r,-Math.PI/2,Math.PI/2,true);
    ctx.ellipse(32,32,rx,r,0,Math.PI/2,-Math.PI/2,(c>0)===waxing);
    ctx.fillStyle='#eaf4ff'; ctx.fill();
    if(o.rim){ ctx.beginPath(); ctx.arc(32,32,r-0.75,0,2*Math.PI); ctx.lineWidth=1.5; ctx.strokeStyle=o.rim; ctx.stroke(); }
    ctx.restore();
  }
  window.moonPaint=paint;

  var dark=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)');
  function png(size,p,o){
    var cv=document.createElement('canvas'); cv.width=cv.height=size;
    paint(cv.getContext('2d'),size,p,o); return cv.toDataURL('image/png');
  }
  function set(rel,href){ var l=document.querySelector('link[rel="'+rel+'"]'); if(l) l.href=href; }
  function draw(){
    var p=phase(Date.now());
    // Dark chrome: lighter shadow side plus a faint rim so the whole disc still reads against a dark tab bar.
    set('icon', png(64,p, dark&&dark.matches ? {shadow:'#2d5580',rim:'rgba(234,244,255,.35)'} : {shadow:'#1e4266'}));
    set('apple-touch-icon', png(180,p,{bg:1,shadow:'#2a5684',scale:0.62}));
  }
  draw(); setInterval(draw,36e5);
  if(dark){ if(dark.addEventListener) dark.addEventListener('change',draw); else if(dark.addListener) dark.addListener(draw); }
})();
