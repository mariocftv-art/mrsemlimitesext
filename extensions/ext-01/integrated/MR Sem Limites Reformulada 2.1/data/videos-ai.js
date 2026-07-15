// MR Sem Limites Reformulada 2.1 — Biblioteca de Vídeos IA
// Preparado para integrar vídeos gerados pelo Lovable quando disponíveis.

export const VIDEOS_AI = [
  { id:'vid-hero',        name:'Hero Video',        category:'UI',        desc:'Vídeo curto de fundo do hero (loop suave).',           icon:'🎬', preview:'grad-cool' },
  { id:'vid-bg',          name:'Background',        category:'UI',        desc:'Vídeo ambient para seção/página inteira.',             icon:'🌌', preview:'grad-cool' },
  { id:'vid-pub',         name:'Publicidade',       category:'Marketing', desc:'Anúncio 15-30s com hook, CTA e brand.',                icon:'📣', preview:'grad-warm' },
  { id:'vid-landing',     name:'Landing Page',      category:'UI',        desc:'Vídeo explicativo curto para landing.',                icon:'🖥', preview:'grad-cool' },
  { id:'vid-dash',        name:'Dashboard',         category:'UI',        desc:'Screencast animado de dashboard SaaS.',                icon:'📊', preview:'grad-cool' },
  { id:'vid-logo',        name:'Logo Reveal',       category:'Brand',     desc:'Reveal cinematográfico do logo, 3-6s.',                icon:'🔷', preview:'grad-mono' },
  { id:'vid-produto',     name:'Produto',           category:'Produto',   desc:'Showcase 360°/close-ups do produto.',                  icon:'📦', preview:'grad-warm' },
  { id:'vid-instit',      name:'Institucional',     category:'Marketing', desc:'Vídeo institucional 30-60s, tom premium.',             icon:'🏢', preview:'grad-mono' },
  { id:'vid-reels',       name:'Reels',             category:'Social',    desc:'Vertical 9:16, 15-30s, ritmo alto, texto animado.',    icon:'📱', preview:'grad-pink' },
  { id:'vid-shorts',      name:'Shorts',            category:'Social',    desc:'YouTube Shorts vertical 9:16, hook nos 2s iniciais.',  icon:'▶️', preview:'grad-pink' },
  { id:'vid-tiktok',      name:'TikTok',            category:'Social',    desc:'Formato TikTok 9:16, storytelling nativo.',            icon:'🎵', preview:'grad-pink' },
  { id:'vid-face',        name:'Facebook',          category:'Social',    desc:'Feed 1:1 ou 4:5, legenda-first (sem áudio).',          icon:'👍', preview:'grad-blue' },
  { id:'vid-insta',       name:'Instagram',         category:'Social',    desc:'Feed 4:5 ou 1:1, primeiros 3s decisivos.',             icon:'📷', preview:'grad-pink' },
  { id:'vid-avatar',      name:'Avatar IA',         category:'Marketing', desc:'Apresentador virtual falando script curto.',           icon:'🧑‍💼', preview:'grad-cool' },
  { id:'vid-motion',      name:'Motion Background', category:'UI',        desc:'Motion abstrato em loop para hero/section.',           icon:'🌀', preview:'grad-cyber' },
];

const COMMON = `Requisitos técnicos:
- Duração curta (3-30s conforme categoria), loop perfeito quando fundo.
- Codec H.264/MP4 ou WebM otimizado para web.
- Sem áudio para backgrounds; com áudio nativo para social/anúncio.
- Primeiros segundos devem "prender" (hook).
- Legendas embutidas quando houver fala.
- Paleta e mood alinhados ao design do projeto atual.

Integração no projeto:
- Inserir em <video autoplay muted loop playsinline> se for fundo.
- Adicionar poster (frame de fallback) e lazy-loading.
- Respeitar prefers-reduced-motion (fallback estático).`;

const RECIPES = {
  'vid-hero':      'Vídeo hero de fundo (10-15s em loop), cena cinematográfica alinhada ao produto, movimento suave da câmera.',
  'vid-bg':        'Loop ambient 15-30s sem áudio, ritmo lento, sem elementos que roubem atenção da UI sobreposta.',
  'vid-pub':       'Anúncio de 15-30s: hook (2s), problema (5s), solução/produto (10s), CTA final claro.',
  'vid-landing':   'Explicativo 20-40s mostrando o que o produto faz + ganho, ritmo dinâmico, música leve.',
  'vid-dash':      'Screencast animado do dashboard (KPIs, gráficos, sidebar), transições suaves, 15-25s.',
  'vid-logo':      'Reveal cinematográfico 3-6s: partículas → forma → logo final com brilho neon curto.',
  'vid-produto':   'Showcase do produto: ângulos 360°, close-ups, mãos usando, mood aspiracional. 15-30s.',
  'vid-instit':    'Institucional 30-60s: cenas humanas + produto + missão, narração calma, música orquestral leve.',
  'vid-reels':     'Reels 9:16 15-30s, texto animado grande, cortes rápidos, música em alta, CTA final.',
  'vid-shorts':    'Shorts 9:16 até 60s, hook nos 2s iniciais, storytelling direto, legenda visível.',
  'vid-tiktok':    'TikTok 9:16 nativo, tom autêntico, tendência de áudio quando fizer sentido, texto legível.',
  'vid-face':      'Facebook 1:1 ou 4:5, primeiros 3s sem áudio já contando a história, legendas embutidas.',
  'vid-insta':     'Instagram 4:5 ou 1:1, estética coerente com feed, cortes ritmados.',
  'vid-avatar':    'Avatar IA falando script curto (até 60s), apresentação clara, olhar para câmera, iluminação neutra.',
  'vid-motion':    'Motion abstrato em loop 8-15s (formas, gradientes, partículas) para usar como background de hero.',
};

export function buildVideoAIPrompt(item) {
  return `Gerar vídeo — categoria **${item.name}** (${item.category}).

${RECIPES[item.id] || item.desc}

${COMMON}

Descreva o roteiro/assunto exato na próxima mensagem (cena, tom, duração, se tem locução). Se o Lovable já gerar vídeos nativos, use-os; senão, entregar orientação para produção externa e integrar o <video> no projeto.`;
}
