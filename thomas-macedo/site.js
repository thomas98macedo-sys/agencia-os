// Thomas Macedo — motion engine (vanilla, zero dependências)
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

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
  var splits = document.querySelectorAll('[data-split]');
  if (!reduced) splits.forEach(splitEl);
  else splits.forEach(function (el) { el.classList.add('in'); });

  /* ---------- 2. Entrada em cena (à prova de falhas) ---------- */
  var pending = Array.prototype.slice.call(
    document.querySelectorAll('.reveal, [data-split], .img-reveal, .step')
  );
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
  var nums = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
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
  var pallax = reduced ? [] : Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var kinetics = reduced ? [] : Array.prototype.slice.call(document.querySelectorAll('.kinetic'));
  kinetics.forEach(function (k) { k._lines = k.querySelectorAll('.k-line'); });

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
    document.querySelectorAll('.magnetic').forEach(function (btn) {
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
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
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

  /* ---------- 8. Reel: arrastar para navegar ---------- */
  document.querySelectorAll('.reel').forEach(function (reel) {
    var down = false, startX = 0, sl = 0;
    reel.addEventListener('pointerdown', function (e) {
      down = true; startX = e.clientX; sl = reel.scrollLeft;
      reel.classList.add('drag');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      reel.scrollLeft = sl - (e.clientX - startX);
    }, { passive: true });
    window.addEventListener('pointerup', function () {
      down = false; reel.classList.remove('drag');
    });
  });
})();
