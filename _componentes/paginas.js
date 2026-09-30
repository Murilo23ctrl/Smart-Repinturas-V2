/* ===========================================================
   SMART REPINTURA — PÁGINAS INTERNAS
   Cada página: caminho, SEO (título e descrição), menu ativo,
   topo (h1, texto, botões) e conteúdo.
=========================================================== */
const D = require('./dados');
const P = require('./partes');
const { esc, ico, wa, msg, foto, picture } = P;

const btnWhats = (mensagem, texto = 'Comprar pelo WhatsApp', cls = '') =>
  `<a class="btn btn-whats${cls}" href="${wa(mensagem)}" target="_blank" rel="noopener">${ico('i-whats')} ${esc(texto)} ${ico('i-arrow')}</a>`;
const btnYoutube = () =>
  `<a class="btn btn-dark" href="${D.contato.youtube}" target="_blank" rel="noopener">${ico('i-yt', 'ico-yt')} Assistir no YouTube ${ico('i-arrow')}</a>`;

const imgSolucao = (s) => (base) => {
  const f = foto(`assets/images/solucoes/${s.imagem}`);
  return f ? picture(f, base, s.imagemAlt) : '';
};
const sol = (slug) => D.solucoes.find(s => s.slug === slug);

const lista = (itens) => `<ul class="check-list">${itens.map(i => `<li>${ico('i-check')}<span>${esc(i)}</span></li>`).join('')}</ul>`;

const secao = (conteudo, extra = '') => `<section class="section${extra}"><div class="container">${conteudo}</div></section>`;

const paginas = [];

/* ---------- /produtos ---------- */
paginas.push({
  caminho: 'produtos/',
  titulo: 'Produtos para Repintura Automotiva | Smart Repintura',
  descricao: 'Abrasivos, mascaramento, preparação, tintas automotivas, vernizes, polimento, pistolas e EPI para funilaria e pintura em Ribeirão Preto.',
  nav: 'produtos',
  migalhas: [{ nome: 'Produtos' }],
  eyebrow: 'Nossos Produtos',
  h1: 'Tudo para Repintura Automotiva',
  lead: 'As melhores marcas e soluções para todas as etapas do processo.',
  acoes: () => btnWhats(msg.categoria('produtos')),
  conteudo: (base) => secao(P.gradeCategorias(base, 'h2')) + P.marcas(base)
});

/* ---------- /produtos/<categoria> ---------- */
D.categorias.forEach(c => {
  paginas.push({
    caminho: `produtos/${c.slug}/`,
    titulo: `${c.nome} para Repintura Automotiva | Smart Repintura`,
    descricao: `${c.nome}: ${c.desc} Atendimento e compra pelo WhatsApp com a Smart Repintura, em Ribeirão Preto.`,
    nav: 'produtos',
    migalhas: [{ nome: 'Produtos', url: 'produtos/index.html' }, { nome: c.nome }],
    eyebrow: 'Produtos',
    h1: esc(c.nome),
    lead: c.desc,
    acoes: () => btnWhats(msg.categoria(c.nome)),
    mensagem: msg.categoria(c.nome),
    imagem: (base) => {
      const f = foto(`assets/images/categorias/${c.slug}`) || (c.fallback && foto(`assets/images/produtos/${c.fallback.arquivo}`));
      return f ? `<div class="ph-media-produto">${picture(f, base, c.fallback ? c.fallback.alt : c.nome, { lazy: false })}</div>` : '';
    },
    conteudo: (base) => {
      let html;
      if (c.produtos.length) {
        const cards = c.produtos.map(p => {
          const f = foto(`assets/images/produtos/${p.arquivo}`);
          return `<li class="item-card reveal-up">
          <div class="ic-media">${f ? picture(f, base, p.alt) : ico(c.icone, 'pc-ph')}</div>
          <div class="ic-body"><h3>${esc(p.nome)}</h3>
          <a class="btn btn-whats btn-sm" href="${wa(msg.produto(p.nome))}" target="_blank" rel="noopener">${ico('i-whats')} Comprar pelo WhatsApp</a></div>
        </li>`;
        }).join('\n');
        html = `<div class="section-top"><div><span class="eyebrow">${esc(c.nome)}</span><h2>Produtos em destaque</h2>
          <p class="section-lead">Linha completa sob consulta: fale com a nossa equipe para ver marcas e opções disponíveis.</p></div></div>
          <ul class="item-grid">${cards}</ul>`;
      } else {
        html = `<div class="notice reveal-up">
          <span class="notice-ico">${ico(c.icone)}</span>
          <div><h2>Catálogo em atualização</h2>
          <p>Fale com a nossa equipe para conhecer os produtos e as marcas de ${esc(c.nome.toLowerCase())} disponíveis.</p></div>
          ${btnWhats(msg.categoria(c.nome))}
        </div>`;
      }
      const outras = D.categorias.filter(o => o.slug !== c.slug)
        .map(o => `<li><a href="${base}produtos/${o.slug}/index.html">${esc(o.nome)}</a></li>`).join('');
      return secao(html) + secao(`<h2 class="h-small">Outras categorias</h2><ul class="chip-list">${outras}</ul>`, ' section--tight');
    }
  });
});

/* ---------- /solucoes ---------- */
paginas.push({
  caminho: 'solucoes/',
  titulo: 'Soluções para Oficinas de Repintura | Smart Repintura',
  descricao: 'Colorimetria automotiva, treinamentos, suporte técnico de produtos, consultoria em gestão de oficinas, manutenção em cabines e equipamentos e laboratórios de colorimetria em Ribeirão Preto.',
  nav: 'solucoes',
  migalhas: [{ nome: 'Soluções' }],
  eyebrow: 'Nossas Soluções',
  h1: 'Muito mais que uma loja de tintas.',
  lead: 'Tudo o que sua oficina precisa para pintar melhor, produzir mais e reduzir retrabalhos.',
  conteudo: (base) => secao(P.gradeSolucoes(base, 'h2'))
});

/* ---------- /colorimetria ---------- */
{
  const s = sol('colorimetria');
  const etapas = [
    ['Leitura', 'Leitura da cor utilizando espectrofotômetro.'],
    ['Identificação', 'Identificação da melhor fórmula disponível.'],
    ['Pesagem', 'Produção da fórmula no sistema tintométrico.'],
    ['Teste', 'Aplicação e controle de cobertura em cartão de teste.'],
    ['Ajuste', 'Correção técnica de frente, ângulo e flop quando necessário.'],
    ['Conferência', 'Conferência final e amostra do ajuste.']
  ];
  paginas.push({
    caminho: 'colorimetria/',
    titulo: 'Colorimetria Automotiva em Ribeirão Preto | Smart Repintura',
    descricao: 'Leitura com espectrofotômetro, identificação de fórmula, pesagem, teste e ajuste fino de cores automotivas com a Smart Repintura.',
    nav: 'colorimetria',
    migalhas: [{ nome: 'Soluções', url: 'solucoes/index.html' }, { nome: 'Colorimetria' }],
    eyebrow: 'Soluções',
    h1: 'Colorimetria <em>Automotiva</em>',
    lead: s.desc,
    acoes: () => btnWhats(msg.categoria('Colorimetria'), 'Falar com um especialista'),
    mensagem: msg.categoria('Colorimetria'),
    imagem: imgSolucao(s),
    conteudo: () => secao(`<div class="section-top"><div><span class="eyebrow">Processo de cor</span>
      <h2>A cor certa começa com um processo certo.</h2>
      <p class="section-lead">Tecnologia, experiência e conhecimento técnico para entregar cores com alto padrão de precisão.</p></div></div>
      <ol class="steps">${etapas.map((e, i) => `<li class="step reveal-up"><span class="step-num">${String(i + 1).padStart(2, '0')}</span><h3>${e[0]}</h3><p>${e[1]}</p></li>`).join('')}</ol>`)
  });
}

/* ---------- /treinamentos ---------- */
{
  const s = sol('treinamentos');
  const cursos = [
    ['i-drop', 'Colorimetria Automotiva', 'Do fundamento ao ajuste avançado de cores.'],
    ['i-spray', 'Repintura Automotiva', 'Preparação, aplicação e acabamento.'],
    ['i-gauge', 'Processos & Produtividade', 'Menos desperdício.<br>Menos retrabalho.<br>Mais produtividade.'],
    ['i-building', 'Treinamento In Company', 'Capacitação realizada dentro da oficina do cliente.']
  ];
  paginas.push({
    caminho: 'treinamentos/',
    titulo: 'Treinamentos de Colorimetria e Repintura | Smart Repintura',
    descricao: 'Treinamentos práticos de colorimetria, repintura automotiva, processos e produtividade, inclusive dentro da sua oficina. Smart Repintura, Ribeirão Preto.',
    nav: 'treinamentos',
    migalhas: [{ nome: 'Soluções', url: 'solucoes/index.html' }, { nome: 'Treinamentos' }],
    eyebrow: 'Soluções',
    h1: 'Treinamentos &amp; <em>Capacitação</em>',
    lead: s.desc,
    acoes: () => btnWhats(msg.categoria('Treinamentos'), 'Falar sobre treinamentos'),
    mensagem: msg.categoria('Treinamentos'),
    imagem: imgSolucao(s),
    conteudo: () => secao(`<div class="section-top"><div><span class="eyebrow">Treinamentos</span>
      <h2>Conhecimento que melhora o resultado da oficina.</h2>
      <p class="section-lead">Treinamentos práticos desenvolvidos para melhorar qualidade, produtividade e padronização.</p></div></div>
      <ul class="info-grid">${cursos.map(c => `<li class="info-card reveal-up"><span class="info-ico">${ico(c[0])}</span><h3>${c[1]}</h3><p>${c[2]}</p></li>`).join('')}</ul>`)
  });
}

/* ---------- páginas de serviço (suporte, consultoria, cabines, laboratórios) ---------- */
const servicos = [
  { slug: 'suporte-tecnico', titulo: 'Suporte Técnico de Produtos para Pintura Automotiva | Smart Repintura',
    descricao: 'Suporte técnico de produtos: uso correto, diagnóstico de problemas de pintura e apoio para oficinas, profissionais e equipes de repintura. Smart Repintura, Ribeirão Preto.',
    h1: 'Suporte Técnico de <em>Produtos</em>', botao: 'Solicitar suporte',
    titulo2: 'Como podemos ajudar', itens: ['Suporte no uso dos produtos', 'Diagnóstico de problemas de pintura', 'Suporte técnico para oficinas e profissionais', 'Suporte para a sua equipe'] },
  { slug: 'consultoria', titulo: 'Consultoria em Gestão de Oficinas | Smart Repintura',
    descricao: 'Consultoria em gestão de oficinas de funilaria e pintura: processos, produtividade, custos, estoque, indicadores e redução de retrabalho.',
    h1: 'Consultoria em Gestão de <em>Oficinas</em>', botao: 'Quero conhecer',
    titulo2: 'O que a consultoria aborda', itens: ['Processos', 'Produtividade', 'Custos', 'Estoque', 'Indicadores', 'Redução de retrabalho'] },
  { slug: 'cabines-de-pintura', titulo: 'Manutenção em Cabines de Pintura e Equipamentos | Smart Repintura',
    descricao: 'Manutenção em cabines e equipamentos: limpeza técnica, troca de filtros e manutenção preventiva de cabines de pintura e plano aspirante em Ribeirão Preto e região.',
    h1: 'Manutenção em Cabines e <em>Equipamentos</em>', botao: 'Solicitar orçamento',
    titulo2: 'Serviços', itens: ['Limpeza técnica', 'Troca de filtros', 'Manutenção preventiva de cabines de pintura e plano aspirante', 'Manutenção de equipamentos'] },
  { slug: 'laboratorios-colorimetria', titulo: 'Laboratórios de Colorimetria | Smart Repintura',
    descricao: 'Implantação, organização, treinamento e padronização de laboratórios de colorimetria para oficinas de repintura automotiva.',
    h1: 'Laboratórios de <em>Colorimetria</em>', botao: 'Quero conhecer',
    titulo2: 'Como trabalhamos', itens: ['Implantação', 'Organização', 'Treinamento', 'Padronização'] }
];
servicos.forEach(sv => {
  const s = sol(sv.slug);
  paginas.push({
    caminho: `${sv.slug}/`,
    titulo: sv.titulo,
    descricao: sv.descricao,
    nav: 'solucoes',
    migalhas: [{ nome: 'Soluções', url: 'solucoes/index.html' }, { nome: s.menu }],
    eyebrow: 'Soluções',
    h1: sv.h1,
    lead: s.desc,
    acoes: () => btnWhats(msg.categoria(s.nome), sv.botao),
    mensagem: msg.categoria(s.nome),
    imagem: imgSolucao(s),
    conteudo: () => secao(`<div class="split">
      <div><span class="eyebrow">${esc(s.nome)}</span><h2>${esc(sv.titulo2)}</h2></div>
      ${lista(sv.itens)}
    </div>`)
  });
});

/* ---------- /conteudos ---------- */
paginas.push({
  caminho: 'conteudos/',
  titulo: 'Dicas Técnicas de Repintura Automotiva | Smart Repintura',
  descricao: 'Vídeos e dicas técnicas de colorimetria, preparação, aplicação de verniz, cabines de pintura e gestão de oficinas no canal da Smart Repintura.',
  nav: 'conteudos',
  migalhas: [{ nome: 'Conteúdos' }],
  eyebrow: 'Conteúdos',
  h1: 'Dicas técnicas e <em>treinamentos</em>',
  lead: 'Acompanhe nosso canal no YouTube e aprenda com quem vive repintura automotiva.',
  acoes: () => btnYoutube(),
  conteudo: () => secao(`<ul class="video-grid">${D.videos.map(v => P.cardVideo(v, 'h2')).join('\n')}</ul>`, ' section--light')
});

/* ---------- /sobre ---------- */
paginas.push({
  caminho: 'sobre/',
  titulo: 'Sobre a Smart Repintura | Especialistas em Repintura Automotiva',
  descricao: 'A Smart Repintura é um centro especializado em soluções para repintura automotiva em Ribeirão Preto: produtos, colorimetria, suporte técnico, treinamentos e consultoria.',
  nav: 'sobre',
  migalhas: [{ nome: 'A Smart' }],
  eyebrow: 'A Smart',
  h1: 'Especialistas em soluções para <em>repintura automotiva</em>',
  lead: 'Um centro especializado em soluções para quem vive repintura automotiva.',
  acoes: () => btnWhats(msg.especialista, 'Falar com um especialista'),
  conteudo: (base) => secao(`<div class="split">
      <div><span class="eyebrow">Quem somos</span><h2>Produto + conhecimento + tecnologia + suporte.</h2></div>
      <div class="prose">
        <p>A Smart Repintura não é apenas uma loja que vende tinta. Reunimos produtos, colorimetria, suporte técnico de produtos, treinamentos, consultoria em gestão de oficinas, manutenção em cabines e equipamentos e soluções para laboratórios para que oficinas e profissionais pintem melhor, produzam mais e evitem retrabalhos.</p>
        ${lista(['Produtos para todas as etapas da repintura', 'Colorimetria', 'Suporte técnico de produtos', 'Treinamentos', 'Consultoria em gestão de oficinas', 'Manutenção em cabines e equipamentos', 'Soluções para laboratórios de colorimetria'])}
      </div>
    </div>`) + P.diferenciais() + P.marcas(base) + secao(`<div class="split">
      <div><span class="eyebrow">Onde estamos</span><h2>Ribeirão Preto - SP</h2></div>
      <ul class="contact-lines">
        <li>${ico('i-pin')}<span>${esc(D.contato.endereco)}<br>${esc(D.contato.cidade)}</span></li>
        <li>${ico('i-clock')}<span>${esc(D.contato.horario[0])}, ${esc(D.contato.horario[1])}</span></li>
        <li>${ico('i-phone')}<a href="tel:${D.contato.tel}">${D.contato.telFmt}</a></li>
      </ul>
    </div>`)
});

/* ---------- /contato ---------- */
paginas.push({
  caminho: 'contato/',
  titulo: 'Contato | Smart Repintura — Ribeirão Preto',
  descricao: 'Fale com a Smart Repintura pelo WhatsApp (16) 9.9785-0858 ou telefone (16) 3040-9505. Av. Marechal Costa e Silva, 3435, Ribeirão Preto - SP.',
  nav: '',
  migalhas: [{ nome: 'Contato' }],
  eyebrow: 'Contato',
  h1: 'Fale com a <em>Smart Repintura</em>',
  lead: 'Atendimento pelo WhatsApp, por telefone ou no nosso endereço em Ribeirão Preto.',
  semCta: true,
  conteudo: () => secao(`<div class="contact-grid">
      <ul class="contact-info">
        <li><a class="contact-item" href="${wa(msg.geral)}" target="_blank" rel="noopener"><span class="ci-icon">${ico('i-whats')}</span><span><strong>WhatsApp</strong><small>${D.contato.whatsFmt}</small></span></a></li>
        <li><a class="contact-item" href="tel:${D.contato.tel}"><span class="ci-icon">${ico('i-phone')}</span><span><strong>Telefone</strong><small>${D.contato.telFmt}</small></span></a></li>
        <li><div class="contact-item"><span class="ci-icon">${ico('i-pin')}</span><span><strong>Endereço</strong><small>${esc(D.contato.endereco)} — ${esc(D.contato.cidade)}</small></span></div></li>
        <li><div class="contact-item"><span class="ci-icon">${ico('i-clock')}</span><span><strong>Horário</strong><small>${esc(D.contato.horario[0])}, ${esc(D.contato.horario[1])}</small></span></div></li>
        <li><a class="contact-item" href="${D.contato.instagram}" target="_blank" rel="noopener"><span class="ci-icon">${ico('i-insta')}</span><span><strong>Instagram</strong><small>@smart.repintura</small></span></a></li>
        <li><a class="contact-item" href="${D.contato.youtube}" target="_blank" rel="noopener"><span class="ci-icon">${ico('i-yt')}</span><span><strong>YouTube</strong><small>Smart Repintura</small></span></a></li>
      </ul>
      <form class="contact-form" id="contactForm" novalidate>
        <h2 class="h-small">Envie sua mensagem pelo WhatsApp</h2>
        <div class="form-row">
          <div class="field"><label for="nome">Nome</label><input type="text" id="nome" name="nome" required autocomplete="name" placeholder="Seu nome completo"></div>
          <div class="field"><label for="telefone">Telefone</label><input type="tel" id="telefone" name="telefone" required autocomplete="tel" placeholder="(16) 00000-0000"></div>
        </div>
        <div class="field"><label for="mensagem">Mensagem</label><textarea id="mensagem" name="mensagem" rows="4" required placeholder="Conte o que você precisa..."></textarea></div>
        <button type="submit" class="btn btn-whats full">${ico('i-whats')} Enviar pelo WhatsApp</button>
        <p class="form-note" id="formNote" role="status"></p>
      </form>
    </div>
    <div class="contact-map">
      <iframe src="https://www.google.com/maps?q=Smart+Repintura+-+Tintas+Automotiva,+Ajuste+de+Cor,+Produtos,+Treinamentos+e+Consultoria+para+Oficinas.,+Av.+Mal.+Costa+e+Silva,+3435+-+Campos+Elísios,+Ribeirão+Preto+-+SP,+14075-600/Smart+Repintura+-+Tintas+Automotiva,+Ajuste+de+Cor,+Produtos,+Treinamentos+e+Consultoria+para+Oficinas.,+Av.+Mal.+Costa+e+Silva,+3435+-+Campos+Elísios,+Ribeirão+Preto+-+SP,+14075-600/@-21.1403285,-47.7986734,19.5z/data=!4m14!4m13!1m5!1m1!1s0x94b9bfb0cb744f2f:0x50f37a46faa3280d!2m2!1d-47.7988905!2d-21.1402818!1m5!1m1!1s0x94b9bfb0cb744f2f:0x50f37a46faa3280d!2m2!1d-47.7988905!2d-21.1402818!3e0?entry=ttu&amp;g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D&amp;output=embed" title="Localização da Smart Repintura no Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    </div>`)
});

module.exports = paginas;
