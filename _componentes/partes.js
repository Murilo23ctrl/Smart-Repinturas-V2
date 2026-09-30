/* ===========================================================
   SMART REPINTURA — COMPONENTES
   Header, busca, rodapé, CTA, cards (produto, solução, vídeo), marcas...
   Cada função devolve HTML. "base" é o caminho até a raiz do site
   ('' na Home, '../' em /produtos/, '../../' em /produtos/abrasivos/).
=========================================================== */
const fs = require('fs');
const path = require('path');
const D = require('./dados');

const ROOT = path.resolve(__dirname, '..');
const C = D.contato;

/* ---------- utilidades ---------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ico = (id, cls) => `<svg${cls ? ` class="${cls}"` : ''} aria-hidden="true" focusable="false"><use href="#${id}"/></svg>`;

/* links de WhatsApp com mensagem pronta (identifica a origem do contato) */
const wa = (msg) => `https://wa.me/${C.whats}?text=${encodeURIComponent(msg)}`;
const msg = {
  geral: 'Olá! Vim pelo site da Smart Repintura e gostaria de atendimento.',
  especialista: 'Olá! Vim pelo site da Smart Repintura e gostaria de falar com um especialista.',
  categoria: (c) => `Olá! Vim pelo site da Smart Repintura e gostaria de atendimento sobre ${c}.`,
  produto: (p) => `Olá! Vim pelo site da Smart Repintura e gostaria de informações sobre ${p}.`
};

/* ---------- imagens: detecta os arquivos na pasta ---------- */
const existe = (rel) => fs.existsSync(path.join(ROOT, rel));
const mtime = (rel) => fs.statSync(path.join(ROOT, rel)).mtimeMs;

function dimensoes(rel) {
  const b = fs.readFileSync(path.join(ROOT, rel));
  if (b.slice(1, 4).toString() === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

/* procura <semExt>.jpg/.jpeg/.png; usa .avif/.webp só se forem mais novos que o original
   (se você trocar a foto JPG e não gerar o WebP de novo, o site usa a JPG nova) */
function foto(semExt) {
  const orig = ['jpg', 'jpeg', 'png'].map(e => `${semExt}.${e}`).find(existe);
  if (!orig) return null;
  const t = mtime(orig);
  const fontes = ['avif', 'webp'].map(e => `${semExt}.${e}`).filter(f => existe(f) && mtime(f) >= t - 2000);
  return { orig, fontes, dim: dimensoes(orig) };
}

function picture(f, base, alt, { lazy = true, prioridade = false } = {}) {
  const src = f.fontes.map(s => `<source type="image/${path.extname(s).slice(1)}" srcset="${base}${s}">`).join('');
  const d = f.dim ? ` width="${f.dim.w}" height="${f.dim.h}"` : '';
  return `<picture>${src}<img src="${base}${f.orig}" alt="${esc(alt)}"${d}${lazy ? ' loading="lazy"' : ''}${prioridade ? ' fetchpriority="high"' : ''} decoding="async"></picture>`;
}

/* <picture> com duas artes (hero): o recorte do celular é o padrão e, a partir de 600px,
   entra o recorte largo. O navegador baixa só a arte e o formato (AVIF > WebP > JPG) que vai usar. */
const MEDIA_LARGA = '(min-width: 600px)';
const MIME = { avif: 'image/avif', webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };
const mime = (s) => MIME[path.extname(s).slice(1)];
const dim = (f) => f.dim ? ` width="${f.dim.w}" height="${f.dim.h}"` : '';

function pictureArte(mob, desk, base, alt, { lazy = true, prioridade = false } = {}) {
  if (!mob || !desk) return picture(mob || desk, base, alt, { lazy, prioridade });
  const larga = [...desk.fontes, desk.orig]
    .map(s => `<source media="${MEDIA_LARGA}" type="${mime(s)}" srcset="${base}${s}"${dim(desk)}>`).join('');
  const celular = mob.fontes.map(s => `<source type="${mime(s)}" srcset="${base}${s}">`).join('');
  return `<picture>${larga}${celular}<img src="${base}${mob.orig}" alt="${esc(alt)}"${dim(mob)}${lazy ? ' loading="lazy"' : ''}${prioridade ? ' fetchpriority="high"' : ''} decoding="async"></picture>`;
}

const logo = (base, lazy) =>
  `<picture><source type="image/webp" srcset="${base}assets/icons/logo-web.webp"><img src="${base}assets/icons/logo-web.png" alt="Smart Repintura" width="450" height="300"${lazy ? ' loading="lazy"' : ''} decoding="async"></picture>`;

/* ---------- ícones (SVG sprite: cada ícone é desenhado uma vez e reutilizado) ---------- */
const S = (id, body, vb = '0 0 24 24') => `<symbol id="${id}" viewBox="${vb}">${body}</symbol>`;
const L = (d) => `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;

function icones() {
  return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
${S('i-whats', '<path fill="currentColor" d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>', '0 0 16 16')}
${S('i-insta', '<path fill="currentColor" d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>', '0 0 16 16')}
${S('i-yt', '<path fill="currentColor" d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/>', '0 0 16 16')}
${S('i-fb', '<path fill="currentColor" d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>', '0 0 16 16')}
${S('i-play', '<path fill="currentColor" d="M8 5.5v13l11-6.5z"/>')}
${S('i-pause', '<path fill="currentColor" d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z"/>')}
${S('i-arrow', '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></g>')}
${S('i-caret', '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></g>')}
${S('i-chev-l', '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></g>')}
${S('i-chev-r', '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></g>')}
${S('i-search', L('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'))}
${S('i-close', L('<path d="M6 6l12 12M18 6L6 18"/>'))}
${S('i-check', L('<path d="M5 12.5l4.2 4.2L19 7"/>'))}
${S('i-pin', L('<path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.4"/>'))}
${S('i-phone', L('<path d="M5 4h3.5l1.8 4.6-2.3 1.4a11 11 0 0 0 5 5l1.4-2.3L19 14.5V18a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z"/>'))}
${S('i-clock', L('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'))}
${S('i-mail', L('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/>'))}
${S('i-route', L('<path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z"/><path d="M9.5 9.5 14.5 7.5 12.5 12.5 12 10z"/>'))}
${S('i-tools', L('<path d="M14.7 3.6a4.8 4.8 0 0 0-4.4 6.6L3.8 16.7a1.9 1.9 0 0 0 2.7 2.7l6.5-6.5a4.8 4.8 0 0 0 6.6-4.4l-2.9 1.4-2.5-2.5 1.4-2.9a4.8 4.8 0 0 0-.9-.9Z"/><path d="M4 4l5 5M3 6l3-3"/>'))}
${S('i-wrench', L('<path d="M14.7 3.6a4.8 4.8 0 0 0-4.4 6.6L3.8 16.7a1.9 1.9 0 0 0 2.7 2.7l6.5-6.5a4.8 4.8 0 0 0 6.6-4.4l-2.9 1.4-2.5-2.5 1.4-2.9a4.8 4.8 0 0 0-.9-.9Z"/>'))}
${S('i-cap', L('<path d="M2 9.5 12 5l10 4.5L12 14 2 9.5Z"/><path d="M6 11.5V16c0 1.3 2.7 3 6 3s6-1.7 6-3v-4.5"/><path d="M22 9.5V15"/>'))}
${S('i-truck', L('<path d="M2 6h12v10H2z"/><path d="M14 9h4.2L21 12v4h-7"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'))}
${S('i-gear', L('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>'))}
${S('i-palette', L('<path d="M12 3a9 9 0 1 0 0 18c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5C21 6.5 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1.1"/><circle cx="10" cy="7" r="1.1"/><circle cx="14.5" cy="7" r="1.1"/><circle cx="17" cy="10.5" r="1.1"/>'))}
${S('i-chart', L('<path d="M4 4v16h16"/><path d="M8 16v-4M12 16V9M16 16v-7"/>'))}
${S('i-booth', L('<path d="M3 20V7l9-3.5L21 7v13"/><path d="M2 20h20"/><circle cx="12" cy="13" r="3.4"/><path d="M12 9.6v6.8M8.6 13h6.8"/>'))}
${S('i-flask', L('<path d="M9 3h6"/><path d="M10 3v6.2L4.6 18.4A1.8 1.8 0 0 0 6.2 21h11.6a1.8 1.8 0 0 0 1.6-2.6L14 9.2V3"/><path d="M7.2 15h9.6"/>'))}
${S('i-drop', L('<path d="M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0c0-4.3 6-10.5 6-10.5Z"/><path d="M9.5 14.5A2.5 2.5 0 0 0 12 17"/>'))}
${S('i-spray', L('<rect x="8.5" y="3" width="6" height="4" rx="1"/><path d="M11.5 7v2"/><path d="M3.5 9h11a2 2 0 0 1 2 2v1h-13z"/><path d="M17.5 10.5h3M19 8l1.5-1M19 13l1.5 1"/><path d="M7.5 12l-1.2 9h3.2l1.5-9"/>'))}
${S('i-gauge', L('<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4.2-5"/><circle cx="12" cy="18" r="1.2"/>'))}
${S('i-building', L('<path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M9.5 21v-5h5v5"/>'))}
${S('i-disc', L('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.2"/><circle cx="12" cy="6.3" r=".9"/><circle cx="17.7" cy="12" r=".9"/><circle cx="12" cy="17.7" r=".9"/><circle cx="6.3" cy="12" r=".9"/>'))}
${S('i-tape', L('<circle cx="10" cy="11" r="7"/><circle cx="10" cy="11" r="2.8"/><path d="M10 18h11v-3"/>'))}
${S('i-sparkle', L('<path d="M11 3l1.8 4.7 4.7 1.8-4.7 1.8L11 16l-1.8-4.7L4.5 9.5l4.7-1.8L11 3Z"/><path d="M18.5 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z"/>'))}
${S('i-shield', L('<path d="M12 3 5 6v5c0 4.6 3 8.4 7 10 4-1.6 7-5.4 7-10V6l-7-3Z"/><path d="M9 12l2 2 4-4"/>'))}
</svg>`;
}

/* ---------- header ---------- */
function header(base, ativo) {
  const a = (k) => (ativo === k ? ' class="active" aria-current="page"' : '');
  const cats = D.categorias.map(c => `<li><a href="${base}produtos/${c.slug}/index.html">${esc(c.nome)}</a></li>`).join('');
  const sols = D.solucoes.map(s => `<li><a href="${base}${s.slug}/index.html">${esc(s.menu)}</a></li>`).join('');
  /* computador: 2 faixas (1ª logo + busca + WhatsApp · 2ª só os itens do menu)
     celular/tablet: a 2ª faixa vira o menu lateral aberto pelo botão ☰ */
  return `<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="site-header" id="siteHeader">
  <div class="container header-inner">
    <a class="brand" href="${base}index.html" aria-label="Smart Repintura — página inicial">${logo(base)}</a>

    <button class="search-bar" type="button" data-open-search>${ico('i-search')}<span>Buscar produtos, soluções ou conteúdos</span><kbd aria-hidden="true">/</kbd></button>

    <div class="header-actions">
      <a class="btn btn-whats btn-sm header-wa" href="${wa(msg.geral)}" target="_blank" rel="noopener" aria-label="Comprar pelo WhatsApp">${ico('i-whats')}<span>Comprar pelo WhatsApp</span></a>
      <button class="burger" id="burgerBtn" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="mainNav"><span></span><span></span><span></span></button>
    </div>
  </div>

  <nav class="main-nav" id="mainNav" aria-label="Menu principal">
    <div class="nav-inner">
      <ul class="nav-list">
        <li><a href="${base}index.html"${a('inicio')}>Início</a></li>
        <li class="has-sub">
          <a href="${base}produtos/index.html"${a('produtos')}>Produtos</a>
          <button class="sub-toggle" type="button" aria-expanded="false" aria-label="Ver categorias de produtos">${ico('i-caret')}</button>
          <ul class="sub-menu">${cats}</ul>
        </li>
        <li class="has-sub">
          <a href="${base}solucoes/index.html"${a('solucoes')}>Soluções</a>
          <button class="sub-toggle" type="button" aria-expanded="false" aria-label="Ver soluções">${ico('i-caret')}</button>
          <ul class="sub-menu">${sols}</ul>
        </li>
        <li><a href="${base}colorimetria/index.html"${a('colorimetria')}>Colorimetria</a></li>
        <li><a href="${base}treinamentos/index.html"${a('treinamentos')}>Treinamentos</a></li>
        <li><a href="${base}conteudos/index.html"${a('conteudos')}>Conteúdos</a></li>
        <li><a href="${base}sobre/index.html"${a('sobre')}>A Smart</a></li>
      </ul>
      <div class="nav-extra">
        <button class="btn btn-outline full" type="button" data-open-search>${ico('i-search')} Buscar no site</button>
        <a class="btn btn-whats full" href="${wa(msg.geral)}" target="_blank" rel="noopener">${ico('i-whats')} Comprar pelo WhatsApp</a>
      </div>
    </div>
  </nav>
</header>`;
}

/* ---------- busca ---------- */
function busca() {
  return `<div class="search" id="searchDialog" role="dialog" aria-modal="true" aria-label="Buscar no site" hidden>
  <div class="search-panel">
    <form class="search-form" role="search" action="#" id="searchForm">
      ${ico('i-search')}
      <input type="search" id="searchInput" placeholder="Busque produtos, soluções ou conteúdos" aria-label="O que você procura?" autocomplete="off">
      <button class="icon-btn search-close" type="button" data-close-search aria-label="Fechar busca">${ico('i-close')}</button>
    </form>
    <ul class="search-results" id="searchResults" aria-live="polite"></ul>
  </div>
</div>`;
}

/* ---------- rodapé ---------- */
function footer(base) {
  const fb = C.facebook
    ? `<li><a href="${C.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ico('i-fb')}</a></li>`
    : '<!-- Facebook: preencha contato.facebook em _componentes/dados.js e rode o gerador -->';
  const webmail = C.webmail
    ? `<li><a class="fb-webmail" href="${C.webmail}" target="_blank" rel="noopener">${ico('i-mail')} Webmail</a></li>`
    : '<!-- Webmail: preencha contato.webmail em _componentes/dados.js e rode o gerador -->';
  const busca = encodeURIComponent(C.mapaBusca);
  return `<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-about">
      <a class="footer-brand" href="${base}index.html" aria-label="Smart Repintura — página inicial">${logo(base, true)}</a>
      <ul class="footer-social" aria-label="Redes sociais">
        <li><a href="${C.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${ico('i-yt')}</a></li>
        <li><a href="${C.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ico('i-insta')}</a></li>
        ${fb}
      </ul>
    </div>
    <ul class="footer-info">
      <li>${ico('i-pin')}<span>${esc(C.endereco)}<br>${esc(C.cidade)}</span></li>
      <li class="fi-stack">
        <span>${ico('i-phone')}<a href="tel:${C.tel}">${C.telFmt}</a></span>
        <span class="fi-whats">${ico('i-whats')}<a href="${wa(msg.geral)}" target="_blank" rel="noopener">${C.whatsFmt}</a></span>
      </li>
      <li>${ico('i-clock')}<span>${esc(C.horario[0])}<br>${esc(C.horario[1])}</span></li>
    </ul>
    <div class="footer-map">
      <div class="fm-frame">
        <iframe src="https://www.google.com/maps?q=${busca}&amp;z=16&amp;output=embed" title="Mapa com a localização da Smart Repintura" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <a class="btn btn-outline btn-sm fm-btn" href="https://www.google.com/maps/dir/?api=1&amp;destination=${busca}" target="_blank" rel="noopener">${ico('i-route')} Como chegar</a>
    </div>
  </div>
  <div class="container footer-bottom">
    <nav aria-label="Links do rodapé">
      <ul>
        <li><a href="${base}produtos/index.html">Produtos</a></li>
        <li><a href="${base}solucoes/index.html">Soluções</a></li>
        <li><a href="${base}colorimetria/index.html">Colorimetria</a></li>
        <li><a href="${base}treinamentos/index.html">Treinamentos</a></li>
        <li><a href="${base}conteudos/index.html">Conteúdos</a></li>
        <li><a href="${base}sobre/index.html">A Smart</a></li>
        <li><a href="${base}contato/index.html">Contato</a></li>
        ${webmail}
      </ul>
    </nav>
    <p>© <span class="js-year">${new Date().getFullYear()}</span> Smart Repintura · Developed by Murilo</p>
  </div>
</footer>`;
}

/* ---------- botão flutuante (só no celular) ---------- */
const flutuante = () =>
  `<a class="float-whats" href="${wa(msg.geral)}" target="_blank" rel="noopener" aria-label="Fale no WhatsApp">${ico('i-whats')}</a>`;

/* ---------- faixa de diferenciais ---------- */
function diferenciais() {
  const itens = D.diferenciais.map(d => {
    const i = d.icone === 'roda-de-cores' ? '<span class="color-wheel" aria-hidden="true"></span>' : ico(d.icone);
    return `<li class="feature">${i}<p><strong>${esc(d.titulo)}</strong><span>${esc(d.comp)}</span></p></li>`;
  }).join('\n      ');
  return `<section class="features" aria-label="Diferenciais da Smart Repintura">
    <ul class="container features-list">
      ${itens}
    </ul>
  </section>`;
}

/* ---------- card de categoria de produto ---------- */
function cardCategoria(c, base, tag = 'h3') {
  const propria = foto(`assets/images/categorias/${c.slug}`);
  const lata = c.fallback && foto(`assets/images/produtos/${c.fallback.arquivo}`);
  let media, cls = '';
  if (propria) media = picture(propria, base, c.nome);
  else if (lata) { media = picture(lata, base, c.fallback.alt); cls = ' pc-media--produto'; }
  else { media = ico(c.icone, 'pc-ph'); cls = ' pc-media--icone'; }
  return `<li><a class="product-card reveal-up" href="${base}produtos/${c.slug}/index.html">
        <span class="pc-media${cls}">${media}</span>
        <span class="pc-body"><${tag} class="pc-name">${esc(c.nome)}</${tag}><span class="pc-desc">${esc(c.desc)}</span><span class="pc-link">Ver produtos ${ico('i-arrow')}</span></span>
      </a></li>`;
}
const gradeCategorias = (base, tag) => `<ul class="product-grid">\n      ${D.categorias.map(c => cardCategoria(c, base, tag)).join('\n      ')}\n    </ul>`;

/* ---------- card de solução ---------- */
function cardSolucao(s, base, tag = 'h3') {
  const f = foto(`assets/images/solucoes/${s.imagem}`);
  const media = f ? picture(f, base, s.imagemAlt) : ico(s.icone, 'sol-ph');
  const link = s.destino === 'whatsapp'
    ? `href="${wa(msg.categoria(s.nome))}" target="_blank" rel="noopener"`
    : `href="${base}${s.slug}/index.html"`;
  return `<li><article class="sol-card reveal-up">
        <div class="sol-media${f ? '' : ' sol-media--icone'}">${media}</div>
        <div class="sol-body">
          <${tag}>${esc(s.nome)}</${tag}>
          <p>${esc(s.desc)}</p>
          <a class="btn btn-chrome btn-sm sol-btn" ${link}>${esc(s.cta)} ${ico('i-arrow')}</a>
        </div>
      </article></li>`;
}
const gradeSolucoes = (base, tag) => `<ul class="sol-grid">\n      ${D.solucoes.map(s => cardSolucao(s, base, tag)).join('\n      ')}\n    </ul>`;

/* ---------- card de vídeo ---------- */
function cardVideo(v, tag = 'h3') {
  const href = v.id ? `https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}` : C.youtube;
  const thumb = v.id
    ? `<img src="https://i.ytimg.com/vi/${encodeURIComponent(v.id)}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async">`
    : '';
  const dur = v.duracao ? `<span class="vc-time">${esc(v.duracao)}</span>` : '';
  return `<li><a class="video-card" href="${href}" target="_blank" rel="noopener">
        <span class="vc-thumb${v.id ? ' has-video' : ''}">${thumb}<span class="vc-tag">${esc(v.tag)}</span><span class="vc-play">${ico('i-play')}</span>${dur}</span>
        <${tag} class="vc-title">${esc(v.titulo)}</${tag}>
      </a></li>`;
}

/* ---------- marcas (faixa que roda sozinha; a lista é repetida para o giro não ter emenda) ---------- */
function marcas(base) {
  const itens = (copia) => D.marcas.map(m => {
    const arq = ['svg', 'png', 'webp'].map(e => `assets/images/marcas/${m.arquivo}.${e}`).find(existe);
    return arq
      ? `<li class="brand-logo"><img src="${base}${arq}" alt="${copia ? '' : esc(m.nome)}" loading="lazy" decoding="async"></li>`
      : `<li class="brand-logo brand-logo--texto">${esc(m.nome)}</li>`;
  }).join('\n          ');
  return `<section class="brands" aria-labelledby="marcas-titulo">
    <div class="container">
      <h2 class="eyebrow" id="marcas-titulo">Marcas que trabalhamos</h2>
    </div>
    <div class="brands-marquee">
      <div class="brands-track">
        <ul class="brands-row">
          ${itens(false)}
        </ul>
        <ul class="brands-row" aria-hidden="true">
          ${itens(true)}
        </ul>
      </div>
    </div>
  </section>`;
}

/* ---------- hero da Home (sem animação de entrada: é o que aparece primeiro) ----------
   Texto por cima dos banners da Smart. Os banners trocam sozinhos (js/slider.js); o tempo de cada um
   é a barrinha colorida dos indicadores: quando ela enche, entra o próximo. */
function hero() {
  const slides = D.heroSlides
    .map(s => ({ ...s, mob: foto(`assets/images/hero/${s.mobile}`), desk: foto(`assets/images/hero/${s.desktop}`) }))
    .filter(s => s.mob || s.desk);
  const varias = slides.length > 1;
  /* o hero tem a proporção das artes do 1º banner, para mostrar a imagem inteira:
     1920x1080 = tela cheia, 1600x500 ou 1200x400 = faixa, 800x1200 ou 1080x1920 = celular */
  const razao = (f) => (f && f.dim ? f.dim.w / f.dim.h : null);
  const difere = (f, g) => razao(f) && razao(g) && Math.abs(razao(f) - razao(g)) > 0.01;
  const [d1, m1] = slides.length ? [slides[0].desk, slides[0].mob] : [];
  slides.slice(1).forEach(s => {
    if (difere(s.desk, d1) || difere(s.mob, m1)) console.warn(`  aviso: ${s.desktop}/${s.mobile} têm proporção diferente do 1º banner (o hero segue o 1º e corta as bordas deste)`);
  });
  const proporcao = [d1 && d1.dim && `--hero-ar-d:${d1.dim.w}/${d1.dim.h}`, m1 && m1.dim && `--hero-ar-m:${m1.dim.w}/${m1.dim.h}`].filter(Boolean).join(';');
  const imagens = slides.map((s, i) =>
    `<div class="hero-slide${s.sombraForte ? ' hero-slide--sombra-forte' : ''}${i ? '' : ' is-active'}"${i ? ' aria-hidden="true"' : ''}>${pictureArte(s.mob, s.desk, '', s.alt, { lazy: i > 0, prioridade: i === 0 })}</div>`
  ).join('\n      ');
  const controles = varias ? `
      <div class="hero-controls" role="group" aria-label="Banners do destaque">
        ${slides.map((s, i) => `<button class="hero-dot${i ? '' : ' is-active'}" type="button" aria-label="Mostrar banner ${i + 1} de ${slides.length}"${i ? '' : ' aria-current="true"'}><span class="hero-dot-bar"><span class="hero-dot-fill"></span></span></button>`).join('\n        ')}
        <button class="hero-pause" type="button" aria-label="Pausar troca de banners">${ico('i-pause', 'ico-pause')}${ico('i-play', 'ico-play')}</button>
      </div>` : '';
  return `<section class="hero" id="topo"${proporcao ? ` style="${proporcao}"` : ''}>
    <div class="container hero-inner">
      <div class="hero-content">
        <h1 class="hero-title"><span class="hero-kicker">Especialistas em</span> Repintura<br> <em>Automotiva</em></h1>
        <p class="hero-text">Produtos, tecnologia e soluções para quem vive repintura automotiva.</p>
        <p class="hero-slogan"><span class="slogan-bar" aria-hidden="true"></span>A cor certa, a solução é certa.</p>
      </div>
    </div>
    <div class="hero-media"${varias ? ` data-hero-slider style="--hero-tempo:${D.heroTempo}s"` : ''}>
      ${imagens}${controles}
    </div>
  </section>`;
}

/* ---------- Conteúdos da Home (faixa clara com vídeos) ---------- */
function secaoConteudos() {
  const videos = D.videos.filter(v => v.home).slice(0, 4);
  return `<section class="section contents" id="conteudos" aria-labelledby="conteudos-titulo">
    <div class="container contents-inner">
      <div class="contents-intro reveal-up">
        <span class="eyebrow">Conteúdos</span>
        <h2 id="conteudos-titulo">Dicas técnicas e treinamentos</h2>
        <p>Acompanhe nosso canal no YouTube e aprenda com quem vive repintura automotiva.</p>
        <a class="btn btn-dark" href="${C.youtube}" target="_blank" rel="noopener">${ico('i-yt', 'ico-yt')} Assistir no YouTube ${ico('i-arrow')}</a>
      </div>
      <div class="video-rail">
        <button class="rail-btn" type="button" data-dir="-1" aria-label="Vídeos anteriores">${ico('i-chev-l')}</button>
        <ul class="video-row" id="videoRow">
          ${videos.map(v => cardVideo(v, 'h3')).join('\n          ')}
        </ul>
        <button class="rail-btn" type="button" data-dir="1" aria-label="Próximos vídeos">${ico('i-chev-r')}</button>
      </div>
    </div>
  </section>`;
}

/* ---------- CTA final ---------- */
function ctaFinal(base, mensagem = msg.especialista) {
  const f = foto('assets/images/cta-traseira');
  const media = f ? picture(f, base, '') : '<span class="fc-light"></span>';
  return `<section class="final-cta" aria-labelledby="cta-titulo">
    <div class="fc-media" aria-hidden="true">${media}</div>
    <div class="container fc-inner">
      <div class="fc-text">
        <h2 id="cta-titulo">Sua oficina pode produzir mais, <br>evitando retrabalhos.</h2>
        <p>Produtos, tecnologia, conhecimento e suporte técnico em um único lugar.</p>
      </div>
      <a class="btn btn-whats btn-lg" href="${wa(mensagem)}" target="_blank" rel="noopener">${ico('i-whats')} Falar com um Especialista ${ico('i-arrow')}</a>
    </div>
  </section>`;
}

module.exports = {
  esc, ico, wa, msg, foto, picture, pictureArte, logo,
  icones, header, busca, footer, flutuante, diferenciais, hero, secaoConteudos,
  cardCategoria, gradeCategorias, cardSolucao, gradeSolucoes, cardVideo, marcas, ctaFinal
};
