// Thomas Macedo — motion engine (vanilla, zero dependências)
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- 1. Split text (palavra a palavra) ---------- */
  function splitEl(el) {
    var idx = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var wi = document.createElement('span'); wi.className = 'wi';
            wi.textContent = p;
            wi.style.transitionDelay = (idx * 0.05) + 's';
            idx++;
            w.appendChild(wi); frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    })(el);
  }
  var splits = $$('[data-split]');
  if (!reduced) {
    splits.forEach(function (el) {
      el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
      splitEl(el);
    });
  } else {
    splits.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 2. Entrada em cena (à prova de falhas) ---------- */
  var pending = $$('.reveal, [data-split], .img-reveal, .step');
  function sweep() {
    if (!pending.length) return;
    var vh = window.innerHeight;
    pending = pending.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) { el.classList.add('in'); return false; }
      return true;
    });
  }
  sweep();
  setInterval(sweep, 350); // rede de segurança (resize, âncoras, browsers antigos)

  /* ---------- 3. Contadores ---------- */
  function count(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1500, t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1); p = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * p) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var nums = $$('[data-count]');
  function sweepNums() {
    if (!nums.length || reduced) return;
    var vh = window.innerHeight;
    nums = nums.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) { count(el); return false; }
      return true;
    });
  }
  sweepNums();
  setInterval(sweepNums, 350);

  /* ---------- 4. Scroll: progresso, header, parallax, kinetic, wa ---------- */
  var bar = document.querySelector('.scroll-progress i');
  var header = document.querySelector('header');
  var wa = document.querySelector('.wa-float');
  var pallax = reduced ? [] : $$('[data-parallax]');
  var kinetics = reduced ? [] : $$('.kinetic');
  kinetics.forEach(function (k) { k._lines = $$('.k-line', k); });

  var lastY = 0, ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;

    if (bar) {
      var max = document.documentElement.scrollHeight - vh;
      bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    }
    if (header) {
      if (y > 600 && y > lastY) header.classList.add('hidden');
      else header.classList.remove('hidden');
    }
    if (wa) wa.classList.toggle('show', y > 600);

    pallax.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var f = parseFloat(el.getAttribute('data-parallax')) || 0.08;
      var off = (r.top + r.height / 2 - vh / 2) * -f;
      el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
    });

    kinetics.forEach(function (k) {
      var r = k.getBoundingClientRect();
      var prog = (vh - r.top) / (vh + r.height);
      prog = Math.max(0, Math.min(1, prog));
      var n = k._lines.length;
      k._lines.forEach(function (line, i) {
        var local = Math.max(0, Math.min(1, prog * (n + 0.6) - i * 0.9));
        line.style.setProperty('--fill', (local * 100).toFixed(1) + '%');
      });
    });

    sweep();
    sweepNums();

    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- 5. Botões magnéticos ---------- */
  if (fine && !reduced) {
    $$('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.22).toFixed(1) + 'px,' + (y * 0.3).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- 6. Tilt 3D sutil ---------- */
  if (fine && !reduced) {
    $$('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.getAttribute('data-tilt')) || 4;
      el.style.transition = 'transform .5s cubic-bezier(.19,1,.22,1)';
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -max;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * max;
        el.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- 7. Cursor customizado ---------- */
  var dot = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  if (dot && ring && fine && !reduced) {
    var mx = -40, my = -40, rx2 = -40, ry2 = -40, moved = false;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY; moved = true;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    }, { passive: true });
    (function loop() {
      if (moved) {
        rx2 += (mx - rx2) * 0.16; ry2 += (my - ry2) * 0.16;
        ring.style.left = rx2 + 'px'; ring.style.top = ry2 + 'px';
      }
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a,button,.reel')) document.body.classList.add('link-hover');
      else document.body.classList.remove('link-hover');
    });
  }

  /* ---------- 7b. Carrossel: autoplay + setas + contador ---------- */
  $$('.carousel').forEach(function (car) {
    var reel = car.querySelector('.reel');
    if (!reel) return;
    var figs = $$('figure', reel);
    var countEl = car.querySelector('.car-count');
    var barEl = car.querySelector('.car-progress i');
    var prev = car.querySelector('.car-prev');
    var next = car.querySelector('.car-next');
    var idx = 0, paused = false, t0 = null;
    var DUR = 4200;

    function itemW() { return figs.length > 1 ? figs[1].offsetLeft - figs[0].offsetLeft : reel.clientWidth; }
    function maxIdx() {
      return Math.max(0, Math.round((reel.scrollWidth - reel.clientWidth) / itemW()));
    }
    function goTo(i, smooth) {
      var m = maxIdx();
      idx = i > m ? 0 : (i < 0 ? m : i);
      reel.scrollTo({ left: idx * itemW(), behavior: smooth === false ? 'auto' : 'smooth' });
      t0 = null;
    }
    function syncCount() {
      var m = maxIdx();
      var i = Math.round(reel.scrollLeft / itemW());
      i = Math.max(0, Math.min(m, i));
      if (i !== idx) { idx = i; t0 = null; }
      if (countEl) countEl.innerHTML = '<b>' + String(idx + 1).padStart(2, '0') + '</b> / ' + String(m + 1).padStart(2, '0');
    }
    reel.addEventListener('scroll', function () { requestAnimationFrame(syncCount); }, { passive: true });
    if (prev) prev.addEventListener('click', function () { goTo(idx - 1); });
    if (next) next.addEventListener('click', function () { goTo(idx + 1); });

    ['pointerenter', 'pointerdown', 'focusin'].forEach(function (ev) { car.addEventListener(ev, function () { paused = true; }); });
    ['pointerleave', 'pointerup', 'focusout'].forEach(function (ev) { car.addEventListener(ev, function () { paused = false; t0 = null; }); });

    if (!reduced) {
      (function autoplay(t) {
        if (!paused && document.visibilityState === 'visible') {
          if (!t0) t0 = t;
          var p = (t - t0) / DUR;
          if (barEl) barEl.style.width = Math.min(100, p * 100) + '%';
          if (p >= 1) goTo(idx + 1);
        } else { t0 = null; }
        requestAnimationFrame(autoplay);
      })(0);
    }
    syncCount();
  });

  /* ---------- 7c. Abertura: filme guiado pelo scroll ---------- */
  (function () {
    var sec = document.querySelector('.vscrub');
    if (!sec) return;
    var sticky = sec.querySelector('.vscrub-sticky');
    var canvas = sec.querySelector('.vscrub-canvas');
    var overlay = sec.querySelector('.vscrub-overlay');
    var hint = sec.querySelector('.vscrub-hint');
    var fade = sec.querySelector('.vscrub-fade');
    if (!sticky || !canvas || !canvas.getContext) { sec.classList.add('static'); return; }
    if (reduced) { sec.classList.add('static'); return; }

    var ctx = canvas.getContext('2d');
    var N = parseInt(sec.getAttribute('data-frames'), 10) || 64;
    var path = sec.getAttribute('data-path') || './img/hero-frames/frame-';
    var ext = sec.getAttribute('data-ext') || '.webp';
    var imgs = new Array(N), ok = new Array(N), shown = -1;

    var IDLE_END = 48;      /* frames do loop de espera (~2s a 24fps) */
    var IDLE_MS = 42;       /* 24 fps */
    var target = 0, idleFrame = 0, idleAcc = 0, lastT = 0;

    function src(i) {
      var s = String(i + 1);
      while (s.length < 3) s = '0' + s;
      return path + s + ext;
    }
    function draw(i) {
      var img = imgs[i];
      if (!img || !ok[i]) return;
      var cw = canvas.width, ch = canvas.height;
      var iw = img.naturalWidth, ih = img.naturalHeight;
      if (!iw || !ih || !cw || !ch) return;
      var s = Math.max(cw / iw, ch / ih);
      var w = iw * s, h = ih * s;
      /* foco levemente à direita (o carrinho vive do lado direito do quadro) */
      ctx.drawImage(img, (cw - w) * 0.6, (ch - h) * 0.5, w, h);
      shown = i;
      if (canvas.className.indexOf('on') < 0) canvas.className += ' on';
    }
    function nearest(i) {
      for (var d = 0; d < N; d++) {
        if (i - d >= 0 && ok[i - d]) return i - d;
        if (i + d < N && ok[i + d]) return i + d;
      }
      return -1;
    }
    function progress() {
      var r = sec.getBoundingClientRect();
      var total = sec.offsetHeight - sticky.offsetHeight;
      if (total <= 0) return 0;
      return Math.max(0, Math.min(1, -r.top / total));
    }
    function update(t) {
      var dt = lastT ? t - lastT : 0;
      lastT = t;
      var p = progress();

      if (p <= 0.002) {
        /* topo da página: o filme roda sozinho em loop até o scroll começar */
        idleAcc += dt;
        if (idleAcc >= IDLE_MS) {
          idleAcc = 0;
          idleFrame = (idleFrame + 1) % IDLE_END;
        }
        target = idleFrame;
      } else {
        /* scroll assume: avança/retrocede quadro a quadro até o fim */
        target = Math.min(N - 1, Math.floor(p * N));
        idleFrame = 0; idleAcc = 0;
      }

      /* aproxima o quadro exibido do alvo (suaviza saltos, ex.: loop -> scrub) */
      if (shown < 0) {
        var j0 = nearest(target);
        if (j0 >= 0) draw(j0);
      } else if (target !== shown) {
        var diff = target - shown;
        var step = diff > 0 ? Math.min(diff, 8, Math.max(1, Math.round(diff / 5))) :
                              Math.max(diff, -8, Math.min(-1, Math.round(diff / 5)));
        var j = nearest(shown + step);
        if (j >= 0 && j !== shown) draw(j);
      }

      if (overlay) overlay.style.opacity = String(Math.max(0, 1 - p * 5));
      if (hint) hint.style.opacity = String(Math.max(0, 1 - p * 8));
      if (fade) fade.style.opacity = String(Math.max(0, (p - 0.94) / 0.06));
      if (header) header.classList.toggle('over-film', p < 0.92);
    }
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(sticky.clientWidth * dpr);
      canvas.height = Math.round(sticky.clientHeight * dpr);
      var j = nearest(shown >= 0 ? shown : 0);
      if (j >= 0) draw(j);
    }

    /* pré-carga: primeiro os frames do loop inicial, depois o resto em ondas */
    var order = [], seen = {};
    for (var ii = 0; ii < IDLE_END && ii < N; ii++) { seen[ii] = 1; order.push(ii); }
    [8, 4, 2, 1].forEach(function (st) {
      for (var i = 0; i < N; i += st) { if (!seen[i]) { seen[i] = 1; order.push(i); } }
    });
    var qi = 0, active = 0, CONC = 10;
    function pump() {
      while (active < CONC && qi < order.length) {
        (function (i) {
          if (imgs[i]) { return; }
          active++;
          var im = new Image();
          im.onload = function () { ok[i] = true; active--; pump(); };
          im.onerror = function () { active--; pump(); };
          im.src = src(i);
          imgs[i] = im;
        })(order[qi++]);
      }
    }

    window.addEventListener('resize', resize);
    resize();
    pump();
    (function loop(t) {
      if (document.visibilityState === 'visible') update(t || 0);
      else lastT = 0;
      requestAnimationFrame(loop);
    })(0);
  })();

  /* ---------- 8. Reel: arrastar para navegar ---------- */
  $$('.reel').forEach(function (reel) {
    var down = false, startX = 0, sl = 0;
    function release() { down = false; reel.classList.remove('drag'); }
    reel.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') e.preventDefault();
      down = true; startX = e.clientX; sl = reel.scrollLeft;
      reel.classList.add('drag');
      if (reel.setPointerCapture) { try { reel.setPointerCapture(e.pointerId); } catch (_) {} }
    });
    reel.addEventListener('pointermove', function (e) {
      if (!down) return;
      reel.scrollLeft = sl - (e.clientX - startX);
    }, { passive: true });
    reel.addEventListener('pointerup', release);
    reel.addEventListener('pointercancel', release);
    reel.addEventListener('lostpointercapture', release);
  });
})();
