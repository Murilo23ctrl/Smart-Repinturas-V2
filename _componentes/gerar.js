/* ===========================================================
   SMART REPINTURA — GERADOR DO SITE
   Uso (na pasta do site):   node _componentes/gerar.js

   O que ele faz:
   1. cria/atualiza as páginas internas (produtos/, colorimetria/, contato/...);
   2. atualiza, no index.html, os trechos entre
      <!-- COMPONENTE:nome --> e <!-- /COMPONENTE:nome -->
      (o resto do index.html você pode editar à mão normalmente);
   3. gera sitemap.xml e o índice da busca (js/busca-indice.js).
   Não precisa instalar nada: só o Node.js.
=========================================================== */
const fs = require('fs');
const path = require('path');
const D = require('./dados');
const P = require('./partes');
const paginas = require('./paginas');
const { esc } = P;

const ROOT = path.resolve(__dirname, '..');
const escrever = (rel, conteudo) => {
  const alvo = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(alvo), { recursive: true });
  fs.writeFileSync(alvo, conteudo, 'utf8');
};

/* ---------- topo das páginas internas ---------- */
function topo(p, base) {
  const crumbs = [{ nome: 'Início', url: 'index.html' }, ...p.migalhas]
    .map((c, i, arr) => (i === arr.length - 1 || !c.url)
      ? `<li aria-current="page">${esc(c.nome)}</li>`
      : `<li><a href="${base}${c.url}">${esc(c.nome)}</a></li>`)
    .join('');
  const media = p.imagem ? p.imagem(base) : '';
  return `<section class="page-hero">
  <div class="container page-hero-inner${media ? ' has-media' : ''}">
    <div class="ph-text">
      <nav class="breadcrumb" aria-label="Você está em"><ol>${crumbs}</ol></nav>
      ${p.eyebrow ? `<span class="eyebrow">${esc(p.eyebrow)}</span>` : ''}
      <h1>${p.h1}</h1>
      ${p.lead ? `<p class="ph-lead">${esc(p.lead)}</p>` : ''}
      ${p.acoes ? `<div class="ph-actions">${p.acoes(base)}</div>` : ''}
    </div>
    ${media ? `<div class="ph-media">${media}</div>` : ''}
  </div>
</section>`;
}

/* ---------- página interna completa ---------- */
function montar(p) {
  const nivel = p.caminho.split('/').filter(Boolean).length;
  const base = '../'.repeat(nivel);
  const url = D.SITE_URL + p.caminho;
  const trilha = [{ nome: 'Início', caminho: '' }, ...p.migalhas.map((m, i) => ({
    nome: m.nome,
    caminho: m.url ? m.url.replace(/index\.html$/, '') : p.caminho
  }))];
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trilha.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.nome, item: D.SITE_URL + t.caminho }))
  };
  return `<!DOCTYPE html>
<html lang="pt-BR" data-base="${base}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.classList.add('js')</script>
<title>${esc(p.titulo)}</title>
<meta name="description" content="${esc(p.descricao)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#050505">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Smart Repintura">
<meta property="og:title" content="${esc(p.titulo)}">
<meta property="og:description" content="${esc(p.descricao)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${D.SITE_URL}assets/images/hero/hero-banner2-desktop.jpg">
<link rel="icon" type="image/png" href="${base}assets/icons/icon-192.png">
<link rel="apple-touch-icon" href="${base}assets/icons/icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}css/style.css">
<link rel="stylesheet" href="${base}css/animations.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<!-- Página gerada por _componentes/gerar.js — para mudar o conteúdo, edite _componentes/paginas.js ou dados.js e rode o gerador. -->
${P.icones()}
${P.header(base, p.nav)}
<main id="conteudo">
${topo(p, base)}
${p.conteudo(base)}
${p.semCta ? '' : P.ctaFinal(base, p.mensagem)}
</main>
${P.footer(base)}
${P.busca()}
${P.flutuante()}
<script src="${base}js/busca-indice.js" defer></script>
<script src="${base}js/scroll.js" defer></script>
<script src="${base}js/slider.js" defer></script>
<script src="${base}js/script.js" defer></script>
</body>
</html>
`;
}

/* ---------- blocos da Home (index.html) ---------- */
function atualizarHome() {
  const arq = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(arq, 'utf8');
  const blocos = {
    icones: P.icones(),
    header: P.header('', 'inicio'),
    hero: P.hero(),
    diferenciais: P.diferenciais(),
    produtos: P.gradeCategorias('', 'h3'),
    solucoes: P.gradeSolucoes('', 'h3'),
    conteudos: P.secaoConteudos(),
    marcas: P.marcas(''),
    cta: P.ctaFinal(''),
    footer: P.footer(''),
    busca: P.busca(),
    flutuante: P.flutuante()
  };
  for (const [nome, conteudo] of Object.entries(blocos)) {
    const re = new RegExp(`(<!-- COMPONENTE:${nome} -->)[\\s\\S]*?(<!-- /COMPONENTE:${nome} -->)`);
    if (!re.test(html)) { console.warn(`  aviso: marcador COMPONENTE:${nome} não está no index.html`); continue; }
    html = html.replace(re, (m, a, b) => `${a}\n${conteudo}\n${b}`);
  }
  fs.writeFileSync(arq, html, 'utf8');
}

/* ---------- índice da busca ---------- */
function indiceBusca() {
  const itens = [
    { t: 'Início', d: 'Especialistas em repintura automotiva', u: 'index.html', k: 'home smart repintura' },
    { t: 'Produtos', d: 'Tudo para repintura automotiva', u: 'produtos/index.html', k: 'produtos catalogo loja comprar' },
    ...D.categorias.map(c => ({ t: c.nome, d: c.desc, u: `produtos/${c.slug}/index.html`, k: c.palavras })),
    ...D.categorias.flatMap(c => c.produtos.map(p => ({ t: p.nome, d: `Produto · ${c.nome}`, u: `produtos/${c.slug}/index.html`, k: c.palavras }))),
    { t: 'Soluções', d: 'Muito mais que uma loja de tintas', u: 'solucoes/index.html', k: 'servicos solucoes' },
    ...D.solucoes.map(s => ({ t: s.menu, d: s.desc, u: `${s.slug}/index.html`, k: s.palavras })),
    { t: 'Conteúdos', d: 'Dicas técnicas e vídeos no YouTube', u: 'conteudos/index.html', k: 'videos youtube dicas conteudo' },
    ...D.videos.map(v => ({ t: v.titulo, d: `Vídeo · ${v.tag}`, u: 'conteudos/index.html', k: 'video ' + v.tag })),
    { t: 'A Smart', d: 'Sobre a Smart Repintura', u: 'sobre/index.html', k: 'sobre empresa quem somos' },
    { t: 'Contato', d: `WhatsApp ${D.contato.whatsFmt} · ${D.contato.cidade}`, u: 'contato/index.html', k: 'contato telefone endereco whatsapp horario mapa' }
  ];
  escrever('js/busca-indice.js',
    `/* Gerado por _componentes/gerar.js — não edite à mão. */\nwindow.SMART_WHATS = '${D.contato.whats}';\nwindow.SMART_BUSCA = ${JSON.stringify(itens)};\n`);
}

/* ---------- sitemap.xml ---------- */
function sitemap() {
  const hoje = new Date().toISOString().slice(0, 10);
  const urls = ['', ...paginas.map(p => p.caminho)]
    .map(c => `  <url><loc>${D.SITE_URL}${c}</loc><lastmod>${hoje}</lastmod></url>`).join('\n');
  escrever('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}

/* ---------- executa ---------- */
paginas.forEach(p => escrever(`${p.caminho}index.html`, montar(p)));
atualizarHome();
indiceBusca();
sitemap();
console.log(`OK: ${paginas.length} páginas internas geradas, index.html atualizado, sitemap.xml e busca criados.`);
