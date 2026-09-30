/* ===========================================================
   SMART REPINTURA — SLIDER.JS
   1. Hero: troca dos banners (automática, com indicadores e pausa)
   2. Carrossel de vídeos (botões anterior/próximo)
=========================================================== */

/* ---------- 1. HERO ----------
   Quem marca o tempo é a barrinha do indicador ativo (animação no CSS, --hero-tempo):
   quando ela termina, entra a próxima imagem. Pausar = pausar a barrinha. */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('[data-hero-slider]');
  if (!hero) return;
  const slides = [...hero.querySelectorAll('.hero-slide')];
  const dots = [...hero.querySelectorAll('.hero-dot')];
  const pause = hero.querySelector('.hero-pause');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;

  const show = (n) => {
    current = (n + slides.length) % slides.length;
    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === current);
      if (i === current) s.removeAttribute('aria-hidden');
      else s.setAttribute('aria-hidden', 'true');
    });
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
      if (i === current) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
  };

  dots.forEach((d, i) => d.addEventListener('click', () => show(i)));

  hero.addEventListener('animationend', (e) => {
    if (e.target.classList.contains('hero-dot-fill') && !reduceMotion.matches) show(current + 1);
  });

  pause.addEventListener('click', () => {
    const paused = hero.classList.toggle('is-paused');
    pause.setAttribute('aria-label', paused ? 'Continuar troca de banners' : 'Pausar troca de banners');
  });

  /* celular: arrastar o dedo para os lados troca a imagem */
  let x0 = null, y0 = 0;
  hero.addEventListener('touchstart', (e) => {
    x0 = e.touches[0].clientX;
    y0 = e.touches[0].clientY;
  }, { passive: true });
  hero.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
});

/* ---------- 2. VÍDEOS ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const row = document.getElementById('videoRow');
  if (!row) return;
  const buttons = row.parentElement.querySelectorAll('.rail-btn');

  const stepSize = () => {
    const card = row.querySelector('li');
    const gap = parseFloat(getComputedStyle(row).columnGap) || 14;
    return card ? card.getBoundingClientRect().width + gap : 280;
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      row.scrollBy({ left: stepSize() * Number(btn.dataset.dir), behavior: 'smooth' });
    });
  });

  /* desativa a seta quando não há mais para onde rolar */
  const update = () => {
    const max = row.scrollWidth - row.clientWidth - 2;
    buttons.forEach(btn => {
      btn.disabled = Number(btn.dataset.dir) < 0 ? row.scrollLeft <= 2 : row.scrollLeft >= max;
    });
  };
  row.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
});
