(function(){
  function draw(){
    var p=((Date.now()-Date.UTC(2000,0,6,18,14))/864e5/29.530588853)%1;
    var waxing=p<0.5, c=Math.cos(2*Math.PI*p), rx=Math.abs(28*c).toFixed(2);
    var lit='M32 4A28 28 0 0 '+(waxing?1:0)+' 32 60A'+rx+' 28 0 0 '+((c>0)===waxing?0:1)+' 32 4Z';
    var svg="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><circle cx='32' cy='32' r='28' fill='#1e4266'/><path d='"+lit+"' fill='#eaf4ff'/></svg>";
    document.getElementById('moon-icon').href='data:image/svg+xml,'+encodeURIComponent(svg);
  }
  draw(); setInterval(draw,36e5);
})();
