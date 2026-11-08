/* Private visit counter (GoatCounter, no cookies, no personal data).
   Sends one tiny image request per page view; stats live at
   https://elvya.goatcounter.com (only the owner can see them). */
(function(){
  var CODE = 'elvya';
  var h = location.hostname;
  if (h !== 'elvyaane.github.io') return;          // skip local previews
  if (navigator.webdriver) return;                  // skip bots/headless
  var p = location.pathname.replace(/index\.html$/, '');
  var c = new URLSearchParams(location.search).get('c');
  if (c) p += '?c=' + c;                            // keep course pages apart
  var q = 'p=' + encodeURIComponent(p) +
          '&t=' + encodeURIComponent(document.title) +
          '&r=' + encodeURIComponent(document.referrer) +
          '&s=' + encodeURIComponent(screen.width + ',' + screen.height + ',' + (devicePixelRatio || 1)) +
          '&rnd=' + Math.random().toString(36).slice(2);
  new Image().src = 'https://' + CODE + '.goatcounter.com/count?' + q;
})();
