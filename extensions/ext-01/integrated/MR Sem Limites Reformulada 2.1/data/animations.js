// MR Sem Limites Reformulada 2.1 — Biblioteca de animações
// Cada animação vira um prompt estruturado copiado no chat quando o usuário clica "Usar".

export const ANIMATIONS = [
  { id:'neon-marquee', name:'Neon Marquee', category:'Texto', desc:'Faixa deslizante com brilho neon contínuo.', preview:'marquee', hint:'header, banners, tickers' },
  { id:'glass-tilt', name:'Glass Tilt', category:'Card', desc:'Card de vidro que inclina levemente ao passar o mouse (3D tilt).', preview:'tilt', hint:'cards de produto, features' },
  { id:'gradient-flow', name:'Gradient Flow', category:'Fundo', desc:'Gradiente animado deslizante em loop suave.', preview:'gradient', hint:'hero, seções de destaque' },
  { id:'shimmer-sweep', name:'Shimmer Sweep', category:'Loading', desc:'Brilho que varre o elemento de esquerda para direita.', preview:'shimmer', hint:'skeletons, botões premium' },
  { id:'pulse-glow', name:'Pulse Glow', category:'Ênfase', desc:'Halo pulsante que atrai atenção para CTAs.', preview:'pulse', hint:'botão principal, avatares online' },
  { id:'float-orb', name:'Float Orb', category:'Fundo', desc:'Esferas coloridas flutuando com blur em background.', preview:'orb', hint:'hero, seção sobre' },
  { id:'flip-card', name:'Flip Card', category:'Card', desc:'Card que gira 180° revelando o verso ao hover.', preview:'flip', hint:'time, portfolio' },
  { id:'reveal-up', name:'Reveal Up', category:'Scroll', desc:'Elementos aparecem subindo suavemente ao entrar na viewport.', preview:'reveal', hint:'seções, listas' },
  { id:'count-up', name:'Count Up', category:'Número', desc:'Números que contam do 0 até o valor final.', preview:'count', hint:'métricas, KPIs' },
  { id:'typewriter', name:'Typewriter', category:'Texto', desc:'Efeito máquina de escrever com cursor piscante.', preview:'type', hint:'headlines, hero titles' },
  { id:'aurora-hero', name:'Aurora Hero', category:'Fundo', desc:'Aurora boreal em movimento no fundo do hero.', preview:'aurora', hint:'topo da home' },
  { id:'particles-soft', name:'Particles Soft', category:'Fundo', desc:'Partículas suaves conectadas por linhas finas.', preview:'particles', hint:'landing page' },
  { id:'morph-blob', name:'Morph Blob', category:'Forma', desc:'Blob orgânico que morfa entre formas suaves.', preview:'blob', hint:'decoração, avatares' },
  { id:'border-scan', name:'Border Scan', category:'Ênfase', desc:'Borda com linha luminosa correndo pelo perímetro.', preview:'border', hint:'card selecionado, foco' },
  { id:'hover-scale', name:'Hover Scale', category:'Interação', desc:'Suave ampliação ao passar o mouse (1.03x).', preview:'scale', hint:'cards, imagens, botões' },
  { id:'stagger-list', name:'Stagger List', category:'Lista', desc:'Itens de lista aparecem em cascata com delay.', preview:'stagger', hint:'menus, feeds' },
  { id:'gradient-text', name:'Gradient Text', category:'Texto', desc:'Texto com gradiente animado.', preview:'grad-text', hint:'títulos, brand marks' },
  { id:'spotlight', name:'Spotlight', category:'Ênfase', desc:'Foco de luz que segue o cursor sobre a superfície.', preview:'spotlight', hint:'cards de features' },
  { id:'rgb-glow', name:'RGB Glow', category:'Neon', desc:'Halo RGB que muda de cor ciclicamente.', preview:'rgb', hint:'gaming, tech, cards' },
  { id:'confetti-rain', name:'Confetti Rain', category:'Celebração', desc:'Chuva de confetes para eventos de sucesso.', preview:'confetti', hint:'pagamento OK, tarefa concluída' },
  { id:'laser-scan', name:'Laser Scan', category:'Neon', desc:'Feixe de laser varrendo verticalmente o container.', preview:'laser', hint:'loading premium, banners' },
  { id:'cyber-grid', name:'Cyber Grid', category:'Fundo', desc:'Grid perspectiva estilo synthwave em movimento.', preview:'grid', hint:'hero cyberpunk' },
  { id:'matrix-rain', name:'Matrix Rain', category:'Fundo', desc:'Chuva de caracteres verdes estilo Matrix.', preview:'matrix', hint:'hero tech, easter egg' },
  { id:'fire-glow', name:'Fire Glow', category:'Ênfase', desc:'Brilho quente pulsante em tons de fogo.', preview:'fire', hint:'ofertas, hot items' },
  { id:'ice-shine', name:'Ice Shine', category:'Ênfase', desc:'Reflexo cristalino frio deslizando pelo elemento.', preview:'ice', hint:'cards premium, planos' },
  { id:'rainbow-wave', name:'Rainbow Wave', category:'Texto', desc:'Ondas de arco-íris passando pelo texto.', preview:'rainbow', hint:'títulos criativos' },
  { id:'star-burst', name:'Star Burst', category:'Celebração', desc:'Explosão de estrelas em pontos-chave.', preview:'star', hint:'achievements, unlocks' },
  { id:'electric-arc', name:'Electric Arc', category:'Neon', desc:'Arcos elétricos entre pontos do elemento.', preview:'arc', hint:'headers dramáticos' },
  { id:'hologram', name:'Hologram', category:'Neon', desc:'Efeito holográfico com scanlines e iridescência.', preview:'holo', hint:'cards futuristas' },
  { id:'bubble-pop', name:'Bubble Pop', category:'Interação', desc:'Bolhas que aparecem e estouram ao clicar.', preview:'bubble', hint:'botões lúdicos, likes' },
  { id:'neon-heart', name:'Neon Heart', category:'Ícone', desc:'Coração neon pulsando com brilho rosa.', preview:'heart', hint:'favoritar, curtir' },
  { id:'disco-ball', name:'Disco Ball', category:'Ênfase', desc:'Reflexos girando estilo bola de discoteca.', preview:'disco', hint:'evento, festa, música' },
  { id:'vortex', name:'Vortex', category:'Fundo', desc:'Vórtice espiralado hipnótico ao fundo.', preview:'vortex', hint:'transições, loading' },
  { id:'glitch-text', name:'Glitch Text', category:'Texto', desc:'Texto com efeito glitch RGB deslocado.', preview:'glitch', hint:'cyberpunk, 404 pages' },
  { id:'neon-sign', name:'Neon Sign', category:'Texto', desc:'Letreiro neon que liga/desliga com flicker.', preview:'sign', hint:'headline retro' },
  { id:'rainbow-orbit', name:'Rainbow Orbit', category:'Ícone', desc:'Anéis coloridos orbitando ao redor do elemento.', preview:'orbit', hint:'avatares, logos' },
];

export function buildAnimationPrompt(anim) {
  return `Aplicar animação **${anim.name}** utilizando exatamente o estilo salvo na biblioteca da extensão MR Sem Limites.

Categoria: ${anim.category}
Descrição: ${anim.desc}
Uso recomendado: ${anim.hint}

Instruções de implementação:
1. Criar/estender o CSS global com as keyframes e utilitário para "${anim.name}" (use apenas tokens semânticos do design system existente — nunca cores hardcoded).
2. Aplicar a classe utilitária no local que eu vou indicar em seguida (aguarde meu prompt de destino).
3. Garantir performance: usar transform/opacity, não animar layout; respeitar prefers-reduced-motion.
4. Compatibilidade: manter funcional em dark e light mode; mobile e desktop.
5. Não substituir animações existentes — adicionar sem quebrar o layout.

Boas práticas:
- Duration entre 300ms e 8s conforme intensidade.
- Easing suave (ease-out, cubic-bezier).
- Fallback estático quando reduced-motion estiver ativo.

Aguardando local de aplicação (ex.: "no Hero", "no card Produtos", "no botão principal").`;
}
