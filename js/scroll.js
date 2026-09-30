/* ===========================================================
   SMART REPINTURA — SCROLL.JS
   Sombra do header ao rolar + entrada discreta dos elementos
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header: sombra ao rolar ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const toggleHeader = () => header.classList.toggle('scrolled', window.scrollY > 10);
    toggleHeader();
    window.addEventListener('scroll', toggleHeader, { passive: true });
  }

  /* ---------- Atraso em cascata nas grades ---------- */
  document.querySelectorAll('.product-grid, .sol-grid, .video-grid, .item-grid, .steps, .info-grid').forEach(group => {
    group.querySelectorAll('.reveal-up').forEach((item, i) => {
      item.style.setProperty('--d', `${(i % 8) * 0.05}s`);
    });
  });

  /* ---------- Entrada discreta ao aparecer na tela ---------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.remove('reveal-up'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('in-view');
        observer.unobserve(el);
        /* terminada a entrada, o elemento volta a usar as próprias transições (hover sem atraso) */
        const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
        setTimeout(() => el.classList.remove('reveal-up', 'in-view'), (delay + 0.7) * 1000);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ---------- Ano corrente no rodapé ---------- */
  document.querySelectorAll('.js-year').forEach(el => { el.textContent = new Date().getFullYear(); });

});
