/* ===========================================================
   SMART REPINTURA — SCRIPT.JS
   Menu (hambúrguer + submenus), busca, formulário de contato
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const base = document.documentElement.dataset.base || '';
  const WHATS = window.SMART_WHATS || '5516997850858';
  const waLink = (texto) => `https://wa.me/${WHATS}?text=${encodeURIComponent(texto)}`;

  /* ---------- Menu mobile + submenus ---------- */
  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');

  if (burger && nav) {
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

    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

    document.addEventListener('click', (e) => {
      if (nav.contains(e.target) || burger.contains(e.target)) return;
      if (nav.classList.contains('open')) setMenu(false);
      else closeSubs();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); burger.focus(); }
    });

    /* voltando para o computador com o menu aberto */
    window.matchMedia('(min-width:1240px)').addEventListener('change', () => setMenu(false));
  }

  /* ---------- Busca ---------- */
  const dialog = document.getElementById('searchDialog');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const indice = window.SMART_BUSCA || [];

  if (dialog && input && results) {
    let lastTrigger = null;
    let activeIndex = -1;
    const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    const openSearch = (trigger) => {
      lastTrigger = trigger || document.activeElement;
      if (nav && nav.classList.contains('open')) burger.click();
      dialog.hidden = false;
      document.body.style.overflow = 'hidden';
      input.value = '';
      render('');
      setTimeout(() => input.focus(), 30);
    };
    const closeSearch = () => {
      dialog.hidden = true;
      document.body.style.overflow = '';
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
    };

    const render = (q) => {
      activeIndex = -1;
      const termos = norm(q.trim()).split(/\s+/).filter(Boolean);
      if (!termos.length) {
        results.innerHTML = indice.slice(0, 6).map(item).join('');
        return;
      }
      const achados = indice
        .map(it => {
          const t = norm(it.t), texto = `${t} ${norm(it.d)} ${norm(it.k || '')}`;
          if (!termos.every(term => texto.includes(term))) return null;
          const score = termos.reduce((s, term) => s + (t.startsWith(term) ? 3 : t.includes(term) ? 2 : 1), 0);
          return { it, score };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map(r => r.it);
      results.innerHTML = achados.length
        ? achados.map(item).join('')
        : `<li class="search-empty">Nada encontrado para "${escapeHtml(q)}". <a href="${waLink(`Olá! Vim pelo site da Smart Repintura e gostaria de informações sobre ${q.trim()}.`)}" target="_blank" rel="noopener">Pergunte no WhatsApp</a></li>`;
    };
    const escapeHtml = (s) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const item = (it) => `<li><a href="${base}${it.u}"><strong>${escapeHtml(it.t)}</strong><small>${escapeHtml(it.d)}</small></a></li>`;

    const links = () => [...results.querySelectorAll('a')];
    const setActive = (i) => {
      const l = links();
      if (!l.length) return;
      activeIndex = (i + l.length) % l.length;
      l.forEach((a, idx) => a.classList.toggle('is-active', idx === activeIndex));
      l[activeIndex].scrollIntoView({ block: 'nearest' });
    };

    document.querySelectorAll('[data-open-search]').forEach(btn => btn.addEventListener('click', () => openSearch(btn)));
    dialog.querySelector('[data-close-search]').addEventListener('click', closeSearch);
    dialog.addEventListener('click', (e) => { if (e.target === dialog) closeSearch(); });
    input.addEventListener('input', () => render(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIndex + 1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIndex - 1); }
    });
    document.getElementById('searchForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const l = links();
      const alvo = l[activeIndex >= 0 ? activeIndex : 0];
      if (alvo) window.location.href = alvo.href;
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !dialog.hidden) closeSearch();
      /* atalho: "/" abre a busca */
      if (e.key === '/' && dialog.hidden && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        openSearch();
      }
    });
    /* mantém o foco dentro da busca enquanto ela está aberta */
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = [input, dialog.querySelector('[data-close-search]'), ...links()];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
  }

  /* ---------- Formulário de contato → WhatsApp ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const note = document.getElementById('formNote');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const campos = ['nome', 'telefone', 'mensagem'].map(id => document.getElementById(id));
      let ok = true;
      campos.forEach(c => {
        const vazio = !c.value.trim();
        c.setAttribute('aria-invalid', String(vazio));
        if (vazio) ok = false;
      });
      if (!ok) {
        note.textContent = 'Preencha nome, telefone e mensagem.';
        note.style.color = '#ff8a8a';
        campos.find(c => !c.value.trim()).focus();
        return;
      }
      const [nome, telefone, mensagem] = campos.map(c => c.value.trim());
      const texto = `Olá! Vim pelo site da Smart Repintura.\nNome: ${nome}\nTelefone: ${telefone}\n\n${mensagem}`;
      note.textContent = 'Abrindo o WhatsApp...';
      note.style.color = '#34c759';
      window.open(waLink(texto), '_blank', 'noopener');
      form.reset();
    });
  }

});
