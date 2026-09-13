(function () {
  var btn = document.getElementById('lang-toggle');
  if (!btn) return;

  btn.addEventListener('click', function () {
    var html = document.documentElement;
    var current = html.getAttribute('data-lang');
    var next = current === 'zh' ? 'en' : 'zh';

    html.setAttribute('data-lang', next);
    html.setAttribute('lang', next === 'zh' ? 'zh-CN' : 'en');
    try { localStorage.setItem('lang', next); } catch (e) {}

    var t = document.querySelector('title');
    if (t && t.dataset && t.dataset[next]) document.title = t.dataset[next];
  });
})();
