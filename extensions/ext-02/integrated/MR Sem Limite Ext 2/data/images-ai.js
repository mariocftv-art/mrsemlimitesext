// MR Sem Limites Reformulada 2.1 — Biblioteca de Imagens IA
// Cada categoria vira um prompt estruturado copiado no chat quando o usuário clica "Usar".
// NÃO altera lógica de envio: usa o mesmo textarea #message do chat.

export const IMAGES_AI = [
  { id:'img-pub',        name:'Publicidade',  category:'Marketing',  desc:'Peça publicitária premium com CTA e brand.', icon:'📣', preview:'grad-warm' },
  { id:'img-dash',       name:'Dashboard',    category:'UI',         desc:'Mockup de dashboard SaaS moderno.',          icon:'📊', preview:'grad-cool' },
  { id:'img-landing',    name:'Landing Page', category:'UI',         desc:'Hero cinematográfico para landing.',         icon:'🖥', preview:'grad-cool' },
  { id:'img-banner',     name:'Banner',       category:'Marketing',  desc:'Banner web wide com hierarquia forte.',      icon:'🎯', preview:'grad-warm' },
  { id:'img-hero',       name:'Hero',         category:'UI',         desc:'Imagem de hero com profundidade e brilho.',  icon:'🌠', preview:'grad-cool' },
  { id:'img-insta',      name:'Instagram',    category:'Social',     desc:'Post quadrado 1080×1080 com brand.',         icon:'📷', preview:'grad-pink' },
  { id:'img-face',       name:'Facebook',     category:'Social',     desc:'Post retangular 1200×630 para feed.',        icon:'👍', preview:'grad-blue' },
  { id:'img-story',      name:'Story',        category:'Social',     desc:'Story vertical 1080×1920 com CTA.',          icon:'📱', preview:'grad-pink' },
  { id:'img-logo',       name:'Logo',         category:'Brand',      desc:'Logo minimalista, escalável, vetorial-like.',icon:'🔷', preview:'grad-mono' },
  { id:'img-mockup',     name:'Mockup',       category:'Produto',    desc:'Mockup de device com cena realista.',        icon:'📦', preview:'grad-cool' },
  { id:'img-produto',    name:'Produto',      category:'Produto',    desc:'Foto de produto em estúdio, iluminação suave.',icon:'🛍', preview:'grad-warm' },
  { id:'img-icone',      name:'Ícones',       category:'UI',         desc:'Set de ícones coeso, linha 1.5px.',          icon:'✳️', preview:'grad-mono' },
  { id:'img-png',        name:'PNG (recorte)',category:'Utilitário', desc:'Objeto isolado em fundo transparente.',      icon:'🧷', preview:'grad-mono' },
  { id:'img-bg',         name:'Background',   category:'UI',         desc:'Wallpaper abstrato para hero/section.',      icon:'🖼', preview:'grad-cool' },
  { id:'img-glass',      name:'Glass',        category:'Estilo',     desc:'Estética glassmorphism translúcida.',        icon:'🧊', preview:'grad-cool' },
  { id:'img-cyber',      name:'Cyberpunk',    category:'Estilo',     desc:'Neon noir 80s, chuva, reflexos.',            icon:'🌆', preview:'grad-cyber' },
  { id:'img-neon',       name:'Neon',         category:'Estilo',     desc:'Luzes neon vivas em cena escura.',           icon:'💡', preview:'grad-pink' },
  { id:'img-realista',   name:'Realista',     category:'Estilo',     desc:'Foto hiper-realista, DOF cinematográfico.',  icon:'📸', preview:'grad-mono' },
];

const COMMON = `Instruções:
- Alta resolução, composição limpa, hierarquia clara.
- Paleta coerente com o design do projeto atual (não usar cores hardcoded conflitantes).
- Iluminação suave, contraste balanceado, foco no assunto.
- Sem watermark, sem texto ilegível, sem artefatos.
- Entregar em formato adequado para uso web (PNG/JPG/WebP conforme necessário).`;

const RECIPES = {
  'img-pub':      'Gerar uma imagem publicitária impactante, com espaço para headline curta e CTA, mood premium. Formato 1200×628 ou similar.',
  'img-dash':     'Gerar um mockup de dashboard SaaS moderno com KPI cards, gráfico principal e sidebar. Estilo glassmorphism dark. 1600×1000.',
  'img-landing':  'Gerar imagem hero de landing page: cena cinematográfica, profundidade, protagonista claro, espaço para copy à esquerda. 1920×1080.',
  'img-banner':   'Gerar banner web wide com hierarquia forte, produto/tema em destaque e área livre para CTA. 1600×500.',
  'img-hero':     'Gerar hero visual premium, iluminação atmosférica, elementos flutuantes sutis, mood futurista. 1920×1080.',
  'img-insta':    'Gerar post Instagram 1080×1080 com brand consistente, tipografia forte e composição centrada.',
  'img-face':     'Gerar post Facebook 1200×630 com hierarquia clara e área segura ao centro.',
  'img-story':    'Gerar Story vertical 1080×1920 com CTA no terço inferior e assunto no terço central.',
  'img-logo':     'Gerar 3 variações de logo minimalista (mark + wordmark), escalável, monocromático, funcionando em fundos claros e escuros.',
  'img-mockup':   'Gerar mockup fotográfico de device (laptop/tablet/mobile) exibindo a tela do produto, cena realista com sombra e reflexo suave.',
  'img-produto':  'Gerar foto de produto em estúdio: fundo neutro, iluminação suave 3 pontos, sombra realista, foco nítido no produto.',
  'img-icone':    'Gerar um set coeso de 12 ícones (linha 1.5px, cantos arredondados), tema alinhado ao projeto atual, transparente.',
  'img-png':      'Gerar objeto isolado em fundo transparente (PNG), recorte limpo, sombra opcional embutida no PNG.',
  'img-bg':       'Gerar background abstrato para hero/section: gradientes suaves, formas orgânicas, sem elementos que compitam com a UI.',
  'img-glass':    'Gerar cena em estética glassmorphism: painéis translúcidos, blur, luzes coloridas atrás, profundidade.',
  'img-cyber':    'Gerar cena cyberpunk noir: neon rosa/ciano, chuva, reflexos, atmosfera densa, estilo Blade Runner.',
  'img-neon':     'Gerar cena com luzes neon vivas (rosa/violeta/ciano) em ambiente escuro, letreiros e reflexos.',
  'img-realista': 'Gerar foto hiper-realista com DOF cinematográfico, textura crível, luz natural, sem "look de IA".',
};

// Pacote de publicação social — quando a imagem é para redes sociais, gerar títulos/legendas/hashtags prontos.
const SOCIAL_PACK = `📱 PACOTE DE PUBLICAÇÃO SOCIAL (obrigatório para imagens sociais/marketing):

▶ INSTAGRAM FEED (1:1 / 4:5)
- Legenda longa (storytelling + CTA + pergunta para engajar)
- 20-30 hashtags (mix virais + nicho + marca)
- Sugestão de primeiro comentário

▶ INSTAGRAM STORIES (9:16)
- Copy curta para stickers (enquete/pergunta/link)
- CTA visual

▶ TIKTOK (post/carrossel 9:16)
- Título com gancho
- Legenda curta + 8-12 hashtags
- Sugestão de áudio de tendência

▶ FACEBOOK FEED (1200×630 / 1:1)
- Título chamativo
- Descrição longa (história + CTA)
- 3-6 hashtags

Entregar em markdown, um bloco por plataforma, texto FINAL pronto para copiar/colar. Sem placeholders.`;

export function buildImageAIPrompt(item) {
  const isSocial = item.category === 'Social' || item.category === 'Marketing';
  return `Gerar imagem — categoria **${item.name}** (${item.category}).

${RECIPES[item.id] || item.desc}

${COMMON}

${isSocial ? SOCIAL_PACK + '\n\n' : ''}Descreva o assunto exato na próxima mensagem (produto, cena, cor dominante, mood). Vou usar esta imagem no projeto atual.${isSocial ? '\nSempre entregar a imagem + o PACOTE DE PUBLICAÇÃO SOCIAL (TikTok, Instagram Feed/Stories, Facebook) com títulos, descrições e hashtags PRONTOS para publicar.' : ''}`;
}

