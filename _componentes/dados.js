/* ===========================================================
   SMART REPINTURA — DADOS DO SITE
   Edite aqui e rode:  node _componentes/gerar.js
   Tudo que aparece em mais de uma página (menu, cards, contato)
   sai daqui, então muda em todas as páginas de uma vez.
=========================================================== */

/* endereço do site publicado (usado no SEO: canonical, Open Graph e sitemap) */
const SITE_URL = 'https://murilo23ctrl.github.io/Smart-Repinturas-V2/';

const contato = {
  whats: '5516997850858',            // WhatsApp principal (todos os botões)
  whatsFmt: '(16) 9.9785-0858',
  tel: '+551630409505',
  telFmt: '(16) 3040-9505',
  endereco: 'Av. Marechal Costa e Silva, 3435',
  cidade: 'Ribeirão Preto - SP',
  horario: ['Segunda a Sexta', '7:30 às 17:18'],
  instagram: 'https://instagram.com/smart.repintura',
  youtube: 'https://youtube.com',     // PENDENTE: link do canal da Smart no YouTube
  facebook: '',                       // PENDENTE: link da página do Facebook (vazio = ícone não aparece)
  /* Webmail (rodapé, ao lado de "Contato"; vazio = link não aparece). Está em http porque o https do domínio
     ainda dá erro de certificado; quando o SSL estiver certo, troque para https:// */
  webmail: 'http://www.smartrepintura.com.br/webemail',
  /* mapinha do rodapé: o que o Google Maps procura (o botão "Como chegar" abre a rota até aqui) */
  mapaBusca: 'Smart Repintura, Av. Marechal Costa e Silva, 3435 - Campos Elísios, Ribeirão Preto - SP, 14075-600'
};

/* Categorias de produtos.
   Foto da categoria: coloque assets/images/categorias/<slug>.jpg — ela substitui o ícone/imagem provisória.
   produtos: itens mostrados na página da categoria (cada um com botão "Comprar pelo WhatsApp");
     "arquivo" = foto em assets/images/produtos/ (nome sem extensão). */
const categorias = [
  { slug: 'abrasivos', nome: 'Abrasivos', desc: 'Lixas, discos, cintas e acessórios.',
    icone: 'i-disc', palavras: 'lixa lixas disco discos cinta cintas abrasivo lixamento', produtos: [] },
  { slug: 'mascaramento', nome: 'Mascaramento', desc: 'Fitas, papel, plástico e proteção.',
    icone: 'i-tape', palavras: 'fita fitas papel plastico protecao mascaramento', produtos: [] },
  { slug: 'preparacao', nome: 'Preparação', desc: 'Massas, primers, desengraxantes e complementos.',
    icone: 'i-drop', fallback: { arquivo: 'massas', alt: 'Massa para preparação automotiva' },
    palavras: 'massa massas primer primers desengraxante preparacao',
    produtos: [
      { nome: 'Massa', arquivo: 'massas', alt: 'Lata de massa para preparação automotiva' },
      { nome: 'Primer PU', arquivo: 'primer', alt: 'Lata de primer PU' }
    ] },
  { slug: 'tintas-automotivas', nome: 'Tintas Automotivas', desc: 'PU, poliéster, sistemas tintométricos e especiais.',
    icone: 'i-drop', fallback: { arquivo: 'pu', alt: 'Lata de tinta automotiva PU' },
    palavras: 'tinta tintas pu poliuretano poliester tintometrico sistema tintometrico',
    produtos: [
      { nome: 'Tinta Poliuretano (PU)', arquivo: 'pu', alt: 'Lata de tinta poliuretano PU' },
      { nome: 'Tinta Poliéster', arquivo: 'poliester', alt: 'Lata de tinta poliéster' }
    ] },
  { slug: 'vernizes', nome: 'Vernizes & Acabamento', desc: 'Vernizes, catalisadores e aditivos.',
    icone: 'i-drop', fallback: { arquivo: 'verniz', alt: 'Lata de verniz automotivo PU' },
    palavras: 'verniz vernizes catalisador catalisadores aditivo aditivos acabamento',
    produtos: [
      { nome: 'Verniz PU', arquivo: 'verniz', alt: 'Lata de verniz PU' },
      { nome: 'Catalisador', arquivo: 'catalisador', alt: 'Frasco de catalisador' }
    ] },
  { slug: 'polimento', nome: 'Polimento', desc: 'Polidores, boinas, compostos e acessórios.',
    icone: 'i-sparkle', palavras: 'polidor polidores boina boinas composto compostos polimento', produtos: [] },
  { slug: 'equipamentos', nome: 'Pistolas & Equipamentos', desc: 'Pistolas, lixadeiras, politrizes e ferramentas.',
    icone: 'i-spray', palavras: 'pistola pistolas lixadeira lixadeiras politriz politrizes ferramenta equipamento', produtos: [] },
  { slug: 'epi', nome: 'EPI & Segurança', desc: 'Respiradores, filtros, luvas, óculos e mais.',
    icone: 'i-shield', palavras: 'epi respirador respiradores filtro filtros luva luvas oculos seguranca mascara', produtos: [] }
];

/* Soluções (cards da Home e páginas de serviço).
   Imagem: assets/images/solucoes/<imagem>.jpg (sem imagem = ícone). */
const solucoes = [
  { slug: 'colorimetria', menu: 'Colorimetria', nome: 'Colorimetria Automotiva',
    desc: 'Leitura, identificação, produção e ajuste fino de cores.',
    cta: 'Conhecer', destino: 'pagina', imagem: 'color', imagemAlt: 'Espectrofotômetro e software de colorimetria automotiva', icone: 'i-palette',
    palavras: 'colorimetria cor cores espectrofotometro ajuste de cor formula' },
  { slug: 'treinamentos', menu: 'Treinamentos', nome: 'Treinamentos & Capacitação',
    desc: 'Colorimetria, pintura, preparação, processos e produtividade.',
    cta: 'Ver treinamentos', destino: 'pagina', imagem: 'academy', imagemAlt: 'Treinamento técnico de repintura automotiva', icone: 'i-cap',
    palavras: 'treinamento treinamentos curso cursos capacitacao' },
  { slug: 'suporte-tecnico', menu: 'Suporte Técnico de Produtos', nome: 'Suporte Técnico de Produtos',
    desc: 'Suporte no uso dos produtos, diagnóstico de problemas de pintura e apoio à sua equipe.',
    cta: 'Solicitar suporte', destino: 'whatsapp', imagem: 'tech', imagemAlt: 'Pintor automotivo aplicando tinta com pistola de pintura', icone: 'i-wrench',
    palavras: 'suporte tecnico produto produtos diagnostico problema defeito pintura ajuda' },
  { slug: 'consultoria', menu: 'Consultoria em Gestão de Oficinas', nome: 'Consultoria em Gestão de Oficinas',
    desc: 'Processos, custos, estoque, indicadores e redução de retrabalho.',
    cta: 'Conhecer', destino: 'pagina', imagem: 'consultoria', imagemAlt: 'Indicadores de gestão de oficina', icone: 'i-chart',
    palavras: 'consultoria gestao oficina oficinas processos custos estoque indicadores retrabalho' },
  { slug: 'cabines-de-pintura', menu: 'Manutenção em Cabines e Equipamentos', nome: 'Manutenção em Cabines e Equipamentos',
    desc: 'Limpeza técnica, troca de filtros e manutenção preventiva de cabines e equipamentos.',
    cta: 'Solicitar orçamento', destino: 'whatsapp', imagem: 'cabines', imagemAlt: 'Cabine de pintura automotiva iluminada', icone: 'i-booth',
    palavras: 'cabine cabines pintura limpeza filtro filtros manutencao equipamento equipamentos plano aspirante' },
  { slug: 'laboratorios-colorimetria', menu: 'Laboratórios de Colorimetria', nome: 'Laboratórios de Colorimetria',
    desc: 'Implantação, organização, treinamento e padronização.',
    cta: 'Conhecer', destino: 'pagina', imagem: 'lab', imagemAlt: 'Prateleiras de sistema tintométrico em laboratório de cores', icone: 'i-flask',
    palavras: 'laboratorio laboratorios colorimetria tintometrico implantacao padronizacao' }
];

/* Banners do hero da Home (trocam sozinhos, na ordem abaixo).
   Cada banner tem duas artes em assets/images/hero/ (.jpg ou .png, nome sem extensão abaixo).
   O hero fica com a proporção da arte do 1º banner e mostra a imagem inteira (sem cortar e sem fundo borrado):
     desktop ... computador e tablet: 1920 x 1080 px (tela cheia) ou 1600 x 500 / 1200 x 400 px (faixa)
     mobile .... celular: 800 x 1200 px ou 1080 x 1920 px (vertical)
   Use o mesmo tamanho em todos os banners. O título do site fica por cima: à esquerda no
   computador e na metade de baixo no celular (deixe essas áreas sem texto importante na arte).
   alt: o que está escrito/mostrado no banner (lido pelo Google e por leitores de tela).
   sombraForte: true = no computador, escurece bem a metade esquerda do banner (use quando ela
     tem texto/logo que ficaria "fantasma" atrás do título do site).
   heroTempo: segundos que cada banner fica na tela. */
const heroTempo = 6;
const heroSlides = [
  { desktop: 'hero-banner-desktop', mobile: 'hero-banner-mobile', sombraForte: true,
    alt: 'Smart, tudo para repintura automotiva. A cor certa, a solução é certa: linha de tintas completa, sistema de coloração, produtos de alta qualidade e suporte especializado. Especialista em tintas automotivas: atendimento personalizado, tudo em um só lugar.' },
  { desktop: 'hero-banner2-desktop', mobile: 'hero-banner2-mobile',
    alt: 'Smart, tudo para repintura automotiva: carro esportivo sendo repintado em cabine de pintura, com estoque de tintas, cartela de cores e equipamento de colorimetria.' }
];

/* Vídeos do YouTube.
   id: código do vídeo (youtube.com/watch?v=CODIGO) · duracao: ex. "6:42" (vazio = não mostra).
   home: true = aparece na Home (máximo 4). */
const videos = [
  { titulo: 'Como ajustar uma cor perolizada', tag: 'Colorimetria', id: '', duracao: '', home: true },
  { titulo: 'Preparação correta da peça', tag: 'Preparação', id: '', duracao: '', home: true },
  { titulo: 'Aplicação de verniz sem defeitos', tag: 'Aplicação', id: '', duracao: '', home: true },
  { titulo: 'Limpeza e manutenção da cabine de pintura', tag: 'Cabines', id: '', duracao: '', home: true },
  { titulo: 'Colorimetria automotiva', tag: 'Colorimetria', id: '', duracao: '' },
  { titulo: 'Redução de retrabalho', tag: 'Processos', id: '', duracao: '' },
  { titulo: 'Gestão da oficina', tag: 'Gestão', id: '', duracao: '' }
];

/* Marcas confirmadas pela Smart.
   Logo: assets/images/marcas/<arquivo>.png (ou .svg) — enquanto não existir, aparece o nome. */
const marcas = [
  { nome: 'Autoluks', arquivo: 'autoluks' },
  { nome: 'Mirka', arquivo: 'mirka' },
  { nome: 'Itaquá', arquivo: 'itaqua' },
  { nome: 'Adere', arquivo: 'adere' },
  { nome: 'Adelbras', arquivo: 'adelbras' },
  { nome: 'Norton', arquivo: 'norton' },
  { nome: 'Maxi Rubber', arquivo: 'maxi-rubber' },
  { nome: 'Autoamérica', arquivo: 'autoamerica' }
];

/* Faixa de diferenciais */
const diferenciais = [
  { titulo: 'Colorimetria', comp: 'de alta precisão', icone: 'roda-de-cores' },
  { titulo: 'Suporte técnico', comp: 'especializado', icone: 'i-tools' },
  { titulo: 'Treinamentos', comp: 'com resultados reais', icone: 'i-cap' },
  { titulo: 'Entrega rápida', comp: 'para sua oficina', icone: 'i-truck' },
  { titulo: 'Grandes marcas', comp: 'e tecnologia', icone: 'i-gear' }
];

module.exports = { SITE_URL, contato, categorias, solucoes, heroTempo, heroSlides, videos, marcas, diferenciais };
