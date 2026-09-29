 /* ===========================================================
   SMART REPINTURA — SCRIPT.JS
   Loader, menu (hambúrguer + submenus), formulário de contato,
   capas dos vídeos do YouTube e logos das marcas
=========================================================== */

/* número principal do WhatsApp (usado pelo formulário) */
const WHATSAPP_NUMERO = '5516997085857';

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader de página (curto, para não atrasar a primeira dobra) ---------- */
  const loader = document.getElementById('pageLoader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 250);

  /* ---------- Menu mobile + submenus ---------- */
  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');
  const subItems = nav.querySelectorAll('.has-sub');

  const closeSubs = (except) => {
    subItems.forEach(li => {
      if (li === except) return;
      li.classList.remove('open');
      li.querySelector('.sub-toggle').setAttribute('aria-expanded', 'false');
    });
  };

  const setMenu = (open) => {
    burger.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) closeSubs();
  };

  burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));

  subItems.forEach(li => {
    const btn = li.querySelector('.sub-toggle');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !li.classList.contains('open');
      closeSubs(li);
      li.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('click', (e) => {
    if (nav.contains(e.target) || burger.contains(e.target)) return;
    if (nav.classList.contains('open')) setMenu(false);
    else closeSubs();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ---------- Formulário de contato → WhatsApp ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    const texto = encodeURIComponent(
      `Olá! Meu nome é ${nome}.\nTelefone: ${telefone}\nE-mail: ${email}\n\n${mensagem}`
    );
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`;

    formNote.textContent = 'Redirecionando para o WhatsApp...';
    formNote.style.color = '#34c759';

    window.open(whatsappURL, '_blank', 'noopener');
    contactForm.reset();
  });

  /* ---------- Vídeos: basta preencher data-video-id no HTML ---------- */
  document.querySelectorAll('.video-card[data-video-id]').forEach(card => {
    const id = card.dataset.videoId.trim();
    if (!id) return;
    card.href = `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
    card.querySelector('.vc-thumb').style.backgroundImage =
      `url('https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg')`;
    card.classList.add('has-video');
  });

  /* ---------- Marcas: mostra o logo quando o arquivo existir ---------- */
  const logoCache = new Map();
  document.querySelectorAll('.brand-logo[data-logo]').forEach(el => {
    const src = el.dataset.logo;
    if (!logoCache.has(src)) {
      logoCache.set(src, new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
      }));
    }
    logoCache.get(src).then(ok => {
      if (!ok) return;
      el.style.backgroundImage = `url('${src}')`;
      el.classList.add('has-logo');
    });
  });

});
