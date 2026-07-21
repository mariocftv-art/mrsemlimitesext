// MR Sem Limites Reformulada 2.1 — Biblioteca de Vídeos IA
// Todos os vídeos devem ser entregues COM ÁUDIO (trilha, locução ou som ambiente).

export const VIDEOS_AI = [
  { id:'vid-hero',        name:'Hero Video',        category:'UI',        desc:'Vídeo curto de fundo do hero (loop suave) com trilha sonora.', icon:'🎬', preview:'grad-cool' },
  { id:'vid-bg',          name:'Background',        category:'UI',        desc:'Vídeo ambient para seção/página inteira com trilha sonora.',    icon:'🌌', preview:'grad-cool' },
  { id:'vid-pub',         name:'Publicidade',       category:'Marketing', desc:'Anúncio 15-30s com hook, locução, música e CTA.',               icon:'📣', preview:'grad-warm' },
  { id:'vid-landing',     name:'Landing Page',      category:'UI',        desc:'Vídeo explicativo curto com narração para landing.',            icon:'🖥', preview:'grad-cool' },
  { id:'vid-dash',        name:'Dashboard',         category:'UI',        desc:'Screencast animado do dashboard SaaS com trilha e SFX.',        icon:'📊', preview:'grad-cool' },
  { id:'vid-logo',        name:'Logo Reveal',       category:'Brand',     desc:'Reveal cinematográfico do logo 3-6s com whoosh/impacto.',       icon:'🔷', preview:'grad-mono' },
  { id:'vid-produto',     name:'Produto',           category:'Produto',   desc:'Showcase 360°/close-ups do produto com trilha premium.',        icon:'📦', preview:'grad-warm' },
  { id:'vid-instit',      name:'Institucional',     category:'Marketing', desc:'Vídeo institucional 30-60s com narração e música orquestral.',  icon:'🏢', preview:'grad-mono' },
  { id:'vid-reels',       name:'Reels',             category:'Social',    desc:'Vertical 9:16, 15-30s, música alta e voz em destaque.',         icon:'📱', preview:'grad-pink' },
  { id:'vid-shorts',      name:'Shorts',            category:'Social',    desc:'YouTube Shorts vertical 9:16, hook em áudio nos 2s iniciais.',  icon:'▶️', preview:'grad-pink' },
  { id:'vid-tiktok',      name:'TikTok',            category:'Social',    desc:'Formato TikTok 9:16, áudio de tendência + storytelling.',       icon:'🎵', preview:'grad-pink' },
  { id:'vid-face',        name:'Facebook',          category:'Social',    desc:'Feed 1:1 ou 4:5 com locução e legendas embutidas.',             icon:'👍', preview:'grad-blue' },
  { id:'vid-insta',       name:'Instagram',         category:'Social',    desc:'Feed 4:5 ou 1:1, trilha punchy nos primeiros 3s.',              icon:'📷', preview:'grad-pink' },
  { id:'vid-avatar',      name:'Avatar IA',         category:'Marketing', desc:'Apresentador virtual com voz sincronizada (lip-sync).',         icon:'🧑‍💼', preview:'grad-cool' },
  { id:'vid-motion',      name:'Motion Background', category:'UI',        desc:'Motion abstrato em loop com trilha ambient sutil.',             icon:'🌀', preview:'grad-cyber' },
];

const COMMON = `Requisitos técnicos:
- Duração curta (3-30s conforme categoria), loop perfeito quando fundo.
- Codec H.264/MP4 ou WebM otimizado para web.
- TODOS os vídeos devem ter ÁUDIO — trilha sonora, locução ou som ambiente. Nenhuma exceção.
- Primeiros segundos devem "prender" (hook audiovisual).
- Legendas embutidas quando houver fala.
- Paleta, mood e trilha alinhados ao design do projeto atual.

Integração no projeto:
- Inserir em <video autoplay loop playsinline controls preload="metadata"> mantendo o áudio disponível.
- Adicionar poster (frame de fallback) e lazy-loading.
- Respeitar prefers-reduced-motion (fallback estático com o áudio opcional).`;

// Pacote de publicação social — SEMPRE gerar para TikTok, Instagram (Reels/Feed/Stories) e Facebook (Feed/Reels).
const SOCIAL_PACK = `📱 PACOTE DE PUBLICAÇÃO SOCIAL (obrigatório — gerar para TODAS as plataformas abaixo):

Para CADA plataforma, entregar bloco pronto para copiar/colar:

▶ TIKTOK (9:16, até 60s)
- Título curto (máx 100 caracteres, com gancho)
- Legenda/Descrição pronta (2-4 linhas + CTA)
- 8-12 hashtags virais + de nicho
- Áudio sugerido (tendência ou original)
- Hook falado nos primeiros 2s

▶ INSTAGRAM REELS (9:16, 15-30s)
- Título/primeira linha com gancho
- Legenda completa (3-6 linhas, storytelling + CTA)
- 15-25 hashtags (mix: virais, nicho, marca)
- Sugestão de trilha punchy
- Texto on-screen sugerido

▶ INSTAGRAM FEED (1:1 ou 4:5)
- Legenda longa (storytelling + CTA + pergunta para engajar)
- 20-30 hashtags
- Sugestão de carrossel/complemento

▶ INSTAGRAM STORIES (9:16)
- Copy curta para stickers (enquete, pergunta, link)
- CTA e sugestão de figurinhas

▶ FACEBOOK FEED (1:1 ou 4:5)
- Título chamativo
- Descrição longa (contar história + CTA)
- 3-6 hashtags
- Sugestão de link e call-to-action do post

▶ FACEBOOK REELS (9:16)
- Legenda curta com CTA
- Hashtags principais
- Trilha sugerida

Formato de entrega: markdown com cabeçalho por plataforma. Nada de placeholders — texto FINAL pronto para publicar.`;

const RECIPES = {
  'vid-hero':      'Vídeo hero de fundo (10-15s em loop) com trilha cinematográfica suave, movimento de câmera fluido, mix sonoro discreto.',
  'vid-bg':        'Loop ambient 15-30s com trilha atmosférica leve, ritmo lento, sem elementos que roubem atenção da UI sobreposta.',
  'vid-pub':       'Anúncio 15-30s: hook em áudio (2s), problema (5s), solução/produto (10s), CTA final com locução e música impactante.',
  'vid-landing':   'Explicativo 20-40s mostrando o que o produto faz + ganho, narração clara, música leve e SFX pontuais.',
  'vid-dash':      'Screencast animado do dashboard (KPIs, gráficos, sidebar), transições suaves com trilha corporativa e SFX de clique.',
  'vid-logo':      'Reveal cinematográfico 3-6s: partículas → forma → logo final com whoosh + impacto sonoro (sting) marcante.',
  'vid-produto':   'Showcase do produto: ângulos 360°, close-ups, mãos usando, mood aspiracional com trilha premium. 15-30s.',
  'vid-instit':    'Institucional 30-60s: cenas humanas + produto + missão, narração calma, música orquestral leve, mix cinematográfico.',
  'vid-reels':     'Reels 9:16 15-30s: texto animado grande, cortes rápidos, música em alta + voz destacada, CTA final falado.',
  'vid-shorts':    'Shorts 9:16 até 60s: hook falado nos 2s iniciais, storytelling direto, trilha dinâmica e legenda visível.',
  'vid-tiktok':    'TikTok 9:16 nativo, tom autêntico, áudio de tendência quando fizer sentido, voz clara e texto legível.',
  'vid-face':      'Facebook 1:1 ou 4:5: primeiros 3s contam a história mesmo em mute, mas COM trilha e legendas embutidas para quem ativar o áudio.',
  'vid-insta':     'Instagram 4:5 ou 1:1: estética coerente com o feed, cortes ritmados, trilha punchy no primeiro batimento.',
  'vid-avatar':    'Avatar IA falando script curto (até 60s), lip-sync realista, apresentação clara, olhar para câmera, iluminação neutra.',
  'vid-motion':    'Motion abstrato em loop 8-15s (formas, gradientes, partículas) com trilha ambient sutil para background de hero.',
};

export function buildVideoAIPrompt(item) {
  return `Gerar vídeo — categoria **${item.name}** (${item.category}).

${RECIPES[item.id] || item.desc}

${COMMON}

${SOCIAL_PACK}

Descreva o roteiro/assunto exato na próxima mensagem (cena, tom, duração, locução, trilha).
O vídeo final deve entregar ÁUDIO sempre — trilha, locução ou som ambiente — para todas as categorias, inclusive backgrounds.
Sempre entregar o vídeo + o PACOTE DE PUBLICAÇÃO SOCIAL completo (TikTok, Instagram Reels/Feed/Stories, Facebook Feed/Reels) com títulos, descrições e hashtags PRONTOS para publicar.`;
}

