// Thomas Macedo — interações leves e elegantes (sem dependências)
(function () {
  'use strict';

  // Revelar elementos ao rolar
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && els.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Botão flutuante de WhatsApp aparece após sair do hero
  var wa = document.querySelector('.wa-float');
  if (wa) {
    var onScroll = function () {
      if (window.scrollY > 600) wa.classList.add('show');
      else wa.classList.remove('show');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
