/* ===========================================================
   SMART REPINTURA — SCROLL.JS
   Header inteligente + animações de revelação no scroll
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header inteligente ---------- */
  const header = document.getElementById('siteHeader');
  const toggleHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  toggleHeader();
  window.addEventListener('scroll', toggleHeader, { passive: true });

  /* ---------- Delay em cascata para grids ---------- */
  const cascadeGroups = document.querySelectorAll('.diff-list, .product-grid, .sol-grid, .academy-grid, .sc-steps, .video-row, .proof-grid');
  cascadeGroups.forEach(group => {
    const items = group.querySelectorAll('.reveal-up');
    items.forEach((item, i) => {
      item.style.setProperty('--d', `${(i % 8) * 0.08}s`);
    });
  });

  /* ---------- Intersection Observer: fade/slide up ---------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in-view');
      observer.unobserve(el);
      /* terminada a entrada, o elemento volta a usar as próprias transições (hover sem atraso) */
      const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
      setTimeout(() => el.classList.remove('reveal-up', 'in-view'), (delay + 0.9) * 1000);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ---------- Marca ano corrente no rodapé ---------- */
  document.querySelectorAll('.js-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Ativa link do menu conforme a seção que MAIS ocupa a tela ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-list > li > a');

  const setActiveLink = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  /* guarda quantos pixels de cada seção estão visíveis no momento */
  const visibleArea = new Map();

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      visibleArea.set(entry.target.id, entry.isIntersecting ? entry.intersectionRect.height : 0);
    });

    /* escolhe a seção que ocupa mais espaço na tela
       (evita que uma faixa curta, mesmo inteira na tela, "roube" o item ativo) */
    let bestId = null;
    let bestArea = 0;
    visibleArea.forEach((area, id) => {
      if (area > bestArea) {
        bestArea = area;
        bestId = id;
      }
    });

    if (bestId) setActiveLink(bestId);
  }, { threshold: [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1] });

  sections.forEach(sec => navObserver.observe(sec));

  /* ---------- Resposta imediata ao clicar no menu ---------- */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href').replace('#', '');
      setActiveLink(id);
    });
  });

});
