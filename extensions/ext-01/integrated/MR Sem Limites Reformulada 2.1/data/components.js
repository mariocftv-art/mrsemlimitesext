// MR Sem Limites Reformulada 2.1 — Biblioteca de componentes prontos

export const COMPONENTS = [
  { id:'card', name:'Cards', category:'Layout', desc:'Grid de cards com hover suave e sombra elegante.', icon:'▢' },
  { id:'hero', name:'Hero', category:'Seção', desc:'Hero premium com título gradient, subtítulo e CTAs.', icon:'★' },
  { id:'navbar', name:'Navbar', category:'Navegação', desc:'Navbar glassmorphism com scroll blur e mobile menu.', icon:'≡' },
  { id:'sidebar', name:'Sidebar', category:'Navegação', desc:'Sidebar colapsável com ícones e grupos.', icon:'⫞' },
  { id:'dashboard', name:'Dashboard', category:'Layout', desc:'Layout de dashboard com KPI cards, gráficos e tabela.', icon:'▦' },
  { id:'table', name:'Tabela', category:'Dados', desc:'Tabela com sort, filtro, paginação e ações de linha.', icon:'⊞' },
  { id:'modal', name:'Modal', category:'Overlay', desc:'Modal acessível com foco preso, ESC e backdrop blur.', icon:'□' },
  { id:'buttons', name:'Botões', category:'UI', desc:'Set completo de variantes: primary, ghost, outline, destructive, gradient.', icon:'●' },
  { id:'pricing', name:'Pricing', category:'Seção', desc:'Tabela de planos com destaque, toggle mensal/anual e CTA.', icon:'💎' },
  { id:'faq', name:'FAQ', category:'Seção', desc:'FAQ em accordion com busca e categorias.', icon:'?' },
  { id:'timeline', name:'Timeline', category:'Seção', desc:'Timeline vertical com marcos, datas e ícones.', icon:'┃' },
  { id:'testimonials', name:'Testimonials', category:'Seção', desc:'Depoimentos em carousel com avatar, cargo e rating.', icon:'❞' },
  { id:'footer', name:'Footer', category:'Seção', desc:'Footer multi-coluna com newsletter e social.', icon:'▁' },
  { id:'accordion', name:'Accordion', category:'UI', desc:'Accordion acessível com animação de altura.', icon:'⇕' },
  { id:'carousel', name:'Carrossel', category:'UI', desc:'Carrossel com autoplay, dots, arrows e swipe.', icon:'⇄' },
  { id:'skeleton', name:'Skeleton', category:'Loading', desc:'Placeholder shimmer para conteúdo carregando.', icon:'▧' },
  { id:'loading', name:'Loading', category:'Loading', desc:'Spinner + variações: dots, progress bar, page loader.', icon:'◐' },
  { id:'empty', name:'Empty State', category:'UX', desc:'Empty state com ilustração, mensagem e CTA.', icon:'∅' },
];

export function buildComponentPrompt(comp, mode /* 'use' | 'prompt' */) {
  if (mode === 'prompt') {
    return `Gere um prompt detalhado para implementar o componente **${comp.name}** (${comp.category}).

Descrição: ${comp.desc}

O prompt deve exigir:
- uso do design system semântico existente (nada de cores hardcoded)
- acessibilidade (ARIA, foco visível, navegação por teclado)
- responsividade (mobile-first)
- variantes reutilizáveis via cva/props
- estados: default, hover, active, disabled, loading, error
- animações suaves e prefers-reduced-motion
- exemplo de uso no final`;
  }
  return `Implementar o componente **${comp.name}** (${comp.category}) seguindo o padrão da MR Sem Limites.

Descrição: ${comp.desc}

Requisitos:
1. Usar exclusivamente tokens semânticos do design system (nada de text-white, bg-black).
2. Componente reutilizável em src/components/ com variantes via cva.
3. Totalmente acessível (ARIA, teclado, foco visível).
4. Responsivo mobile-first.
5. Estados: default, hover, active, disabled, loading, error.
6. Animações performáticas (transform/opacity) e prefers-reduced-motion.
7. Adicionar uma pequena demonstração de uso no local que vou indicar.

Aguardando local de aplicação.`;
}
