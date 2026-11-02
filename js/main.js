/* =====================================================================
   OKAN ERGÜRBÜZ · DAVRANIŞ DOSYASI (main.js)
   ---------------------------------------------------------------------
   Burada: TR/EN dil düğmesi, gece modu, e-posta kopyalama ve animasyonlar.
   Genelde dokunman gerekmez.
   İsminin altındaki yazılıp silinen kelimeleri değiştirmek istersen
   "var words =" satırını bul ve listeleri düzenle.
   ===================================================================== */
(function () {
  var root = document.documentElement;
  var buttons = document.querySelectorAll('[data-set-lang]');

  function apply(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-set-lang') === lang));
    }
  }
  function remember(lang) {
    try { localStorage.setItem('okan-lang', lang); } catch (e) {}
    try { if (location.hash !== '#' + lang) location.hash = lang; } catch (e) {}
  }
  function initial() {
    var h = '';
    try { h = (location.hash || '').replace('#', ''); } catch (e) {}
    if (h === 'tr' || h === 'en') return h;
    try { var s = localStorage.getItem('okan-lang'); if (s === 'tr' || s === 'en') return s; } catch (e) {}
    var nav = (navigator.language || '').toLowerCase();
    return nav.indexOf('tr') === 0 ? 'tr' : 'en';
  }
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function (ev) {
      var lang = ev.currentTarget.getAttribute('data-set-lang');
      apply(lang); remember(lang);
    });
  }
  window.addEventListener('hashchange', function () {
    var h = (location.hash || '').replace('#', '');
    if (h === 'tr' || h === 'en') apply(h);
  });
  apply(initial());

  // Night mode toggle
  var modeBtn = document.getElementById('mode');
  var mq = null;
  try { mq = window.matchMedia('(prefers-color-scheme: dark)'); } catch (e) {}
  function isDark() {
    var m = root.getAttribute('data-mode');
    if (m) return m === 'dark';
    var t = root.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t === 'dark';
    return !!(mq && mq.matches);
  }
  function syncMode() { modeBtn.setAttribute('aria-pressed', String(isDark())); }
  modeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-mode', next);
    try { localStorage.setItem('okan-mode', next); } catch (e) {}
    syncMode();
  });
  try { mq.addEventListener('change', syncMode); } catch (e) {}
  try { new MutationObserver(syncMode).observe(root, { attributes: true, attributeFilter: ['data-theme'] }); } catch (e) {}
  syncMode();

  document.querySelector('a[href="#iletisim"]').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('iletisim').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.querySelector('.mark').addEventListener('click', function (e) {
    e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  var copyBtn = document.getElementById('copy-mail');
  var original = copyBtn.innerHTML;
  copyBtn.addEventListener('click', function () {
    function done() {
      copyBtn.textContent = root.getAttribute('data-lang') === 'tr' ? 'Kopyalandı' : 'Copied';
      setTimeout(function () { copyBtn.innerHTML = original; }, 1800);
    }
    function fallback() {
      var r = document.createRange(); r.selectNodeContents(document.getElementById('mail'));
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    }
    try { navigator.clipboard.writeText('okanergurbuz35@gmail.com').then(done, fallback); } catch (e) { fallback(); }
  });

  // ---- Motion ----
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reduce || !('IntersectionObserver' in window)) return;
  root.classList.add('js');

  // Sections settle into place as they scroll in (content stays visible throughout)
  var targets = document.querySelectorAll('.sec-head, .proj, .sk, .about > p, .edu, .band h2, .rows .row');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add('seen');
      io.unobserve(el);
      setTimeout(function () { el.classList.remove('reveal'); el.style.transitionDelay = ''; }, 1400);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  Array.prototype.forEach.call(targets, function (el) {
    var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.classList.add('reveal');
    el.style.transitionDelay = (idx * 90) + 'ms';
    io.observe(el);
  });

  // The bot's terminal replays its run while it is on screen
  var term = document.querySelector('.term');
  var timer = null;
  function run() { term.classList.remove('play'); void term.offsetWidth; term.classList.add('play'); }
  new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && !timer) { run(); timer = setInterval(run, 7000); }
      else if (!en.isIntersecting && timer) { clearInterval(timer); timer = null; }
    });
  }, { threshold: 0.4 }).observe(term);

  // ---- Interactive layer ----
  // Name split into letters
  var h1spans = document.querySelectorAll('.hero h1 .ln > span');
  Array.prototype.forEach.call(h1spans, function (sp, li) {
    var txt = sp.textContent; sp.textContent = '';
    sp.setAttribute('aria-hidden', 'true');
    Array.from(txt).forEach(function (c, i) {
      var s = document.createElement('span');
      s.className = 'ch'; s.textContent = c;
      s.style.animationDelay = (li * 0.16 + i * 0.045) + 's';
      sp.appendChild(s);
    });
  });

  // Typed, rotating words
  var words = { tr: ['Python botları', 'web siteleri', 'otomasyonlar'], en: ['Python bots', 'websites', 'automations'] };
  var wEl = document.querySelector('.rot .w');
  var wi = 0, ci = words.tr[0].length, deleting = false;
  function curLang() { return root.getAttribute('data-lang') === 'en' ? 'en' : 'tr'; }
  wEl.textContent = words[curLang()][0];
  ci = wEl.textContent.length;
  function tick() {
    var w = words[curLang()][wi % 3];
    if (!deleting) {
      ci = Math.min(ci + 1, w.length);
      wEl.textContent = w.slice(0, ci);
      if (ci >= w.length) { deleting = true; return setTimeout(tick, 1800); }
      setTimeout(tick, 85);
    } else {
      ci = Math.max(ci - 1, 0);
      wEl.textContent = w.slice(0, ci);
      if (ci <= 0) { deleting = false; wi++; return setTimeout(tick, 250); }
      setTimeout(tick, 40);
    }
  }
  setTimeout(function () { deleting = true; tick(); }, 2600);
  Array.prototype.forEach.call(buttons, function (b) {
    b.addEventListener('click', function () { wEl.textContent = words[curLang()][wi % 3].slice(0, ci); });
  });

  // Scroll progress + floating shapes
  var prog = document.createElement('div');
  prog.className = 'progress'; prog.setAttribute('aria-hidden', 'true');
  document.body.appendChild(prog);
  var specs = [
    [['ring', 'right:-50px;top:30px', 0.22], ['sq', 'left:3%;bottom:70px', -0.14]],
    [['dot', 'right:9%;top:80px', 0.32], ['strip', 'right:-30px;bottom:60px', -0.2]],
    [['sq', 'right:7%;top:60px', 0.16], ['ring', 'left:-70px;bottom:-40px', -0.1]]
  ];
  var floats = [];
  Array.prototype.forEach.call(document.querySelectorAll('main .sec'), function (sec, si) {
    (specs[si] || []).forEach(function (sp) {
      var f = document.createElement('span');
      f.className = 'float ' + sp[0]; f.setAttribute('aria-hidden', 'true');
      f.style.cssText = sp[1];
      sec.insertBefore(f, sec.firstChild);
      floats.push({ el: f, sec: sec, speed: sp[2] });
    });
  });
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
      var vh = window.innerHeight;
      floats.forEach(function (f) {
        var r = f.sec.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        f.el.style.translate = '0 ' + ((r.top + r.height / 2 - vh / 2) * f.speed).toFixed(1) + 'px';
      });
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Pointer effects (mouse only)
  var fine = false;
  try { fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) {}
  if (!fine) return;

  var heroWrap = document.querySelector('.hero-wrap');
  heroWrap.addEventListener('mousemove', function (e) {
    heroWrap.style.setProperty('--mx', (e.clientX / window.innerWidth * 2 - 1).toFixed(3));
    heroWrap.style.setProperty('--my', (e.clientY / window.innerHeight * 2 - 1).toFixed(3));
  });
  heroWrap.addEventListener('mouseleave', function () {
    heroWrap.style.setProperty('--mx', 0); heroWrap.style.setProperty('--my', 0);
  });

  var card = document.querySelector('.idcard');
  card.addEventListener('mousemove', function (e) {
    var r = card.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = 'perspective(900px) rotateX(' + (-y * 9).toFixed(2) + 'deg) rotateY(' + (x * 11).toFixed(2) + 'deg) translateY(-4px)';
  });
  card.addEventListener('mouseleave', function () { card.style.transform = ''; });

  Array.prototype.forEach.call(document.querySelectorAll('.btn, .copy, .go, .mode'), function (el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      el.style.translate = (dx * 0.22).toFixed(1) + 'px ' + (dy * 0.3).toFixed(1) + 'px';
    });
    el.addEventListener('mouseleave', function () { el.style.translate = ''; });
  });

  Array.prototype.forEach.call(document.querySelectorAll('.proj'), function (p) {
    var art = p.querySelector('.term, .browser');
    p.addEventListener('mousemove', function (e) {
      var r = p.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      art.style.translate = (x * 14).toFixed(1) + 'px ' + (y * 10).toFixed(1) + 'px';
    });
    p.addEventListener('mouseleave', function () { art.style.translate = ''; });
  });
})();
