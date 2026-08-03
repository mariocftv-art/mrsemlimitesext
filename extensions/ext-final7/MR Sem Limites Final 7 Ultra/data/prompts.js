// MR Sem Limites Reformulada 2.1 — Biblioteca de prompts premium

export const PROMPTS = [
  // UI / Design
  { id:'p-ui-1', cat:'UI/UX', name:'Landing Premium', body:'Crie uma landing page premium com hero em glassmorphism, gradient animado, 3 seções de features com ícones lucide, testimonials em carousel, pricing com destaque, FAQ accordion e footer completo. Design futurista neon.' },
  { id:'p-ui-2', cat:'UI/UX', name:'Dashboard Executivo', body:'Monte um dashboard SaaS com sidebar colapsável, header com search e avatar, 4 KPI cards, gráfico principal (área), gráfico secundário (pizza) e tabela recente com ações. Use design system semântico.' },
  { id:'p-ui-3', cat:'UI/UX', name:'Auth Completa', body:'Implementar telas de Sign In, Sign Up, Forgot Password e Reset com validação Zod, mensagens de erro claras, loading states, provider social (Google/Apple) e redirecionamento pós-login.' },
  { id:'p-ui-4', cat:'UI/UX', name:'Onboarding 3 passos', body:'Fluxo de onboarding em 3 passos com progress indicator, transições suaves, validação por etapa e persistência de rascunho no localStorage.' },

  // Refactor / Fix
  { id:'p-fix-1', cat:'Correção', name:'Corrigir erros do build', body:'Analise o build e resolva TODOS os erros de TypeScript, imports quebrados e dependências faltando. Não silencie com any nem @ts-ignore. Explique cada correção em uma linha.' },
  { id:'p-fix-2', cat:'Correção', name:'Corrigir responsividade', body:'Percorra as principais telas e corrija problemas de responsividade mobile (breakpoints, overflow, tap targets < 44px, fontes muito pequenas, imagens não fluidas). Mostre antes/depois por tela.' },
  { id:'p-fix-3', cat:'Correção', name:'Acessibilidade WCAG AA', body:'Faça uma auditoria de acessibilidade: contraste, labels, ARIA, foco visível, ordem de tabulação, alt text. Corrija tudo que estiver abaixo de AA.' },

  // Refactor
  { id:'p-ref-1', cat:'Refatoração', name:'Extrair componentes', body:'Identifique componentes duplicados/longos e extraia em componentes reutilizáveis pequenos com props tipadas. Não mude comportamento; apenas organize.' },
  { id:'p-ref-2', cat:'Refatoração', name:'Design tokens', body:'Migre todas as cores hardcoded (text-white, bg-black, bg-[#...]) para tokens semânticos do design system em src/styles.css. Garanta dark/light coerentes.' },

  // Performance
  { id:'p-perf-1', cat:'Performance', name:'Lazy loading', body:'Aplique lazy loading em rotas pesadas e imagens abaixo da dobra. Meça bundle size antes/depois.' },
  { id:'p-perf-2', cat:'Performance', name:'Otimizar renders', body:'Identifique re-renders desnecessários e aplique React.memo, useMemo, useCallback onde realmente ajudar. Meça com React DevTools Profiler.' },

  // Segurança
  { id:'p-sec-1', cat:'Segurança', name:'Auditoria de segurança', body:'Revise autenticação, autorização, RLS, validação de input, exposição de secrets e injeção. Liste findings por severidade e corrija críticos.' },
  { id:'p-sec-2', cat:'Segurança', name:'Roles seguras', body:'Implemente sistema de roles em tabela separada com função has_role SECURITY DEFINER. Nunca guardar role na tabela profiles.' },

  // Backend
  { id:'p-be-1', cat:'Backend', name:'API REST completa', body:'Crie endpoints CRUD com validação Zod, tratamento de erro consistente, auth middleware, rate limit e documentação inline.' },
  { id:'p-be-2', cat:'Backend', name:'Webhook seguro', body:'Implemente endpoint /api/public/webhook que verifica assinatura HMAC com timingSafeEqual antes de processar qualquer payload.' },

  // SEO / Marketing
  { id:'p-seo-1', cat:'SEO', name:'SEO completo', body:'Configure title <60 chars, meta description <160 chars, H1 único, semântica correta, alt em todas as imagens, JSON-LD, canonical e og tags. Verifique por página.' },
  { id:'p-mkt-1', cat:'Marketing', name:'Copy alta conversão', body:'Reescreva a copy do hero, features e CTAs com headlines fortes, benefícios claros e provas sociais. Use fórmula PAS ou AIDA.' },

  // Data
  { id:'p-data-1', cat:'Dados', name:'Migração de schema', body:'Escreva uma migration idempotente para adicionar a coluna X com backfill, índice apropriado e política RLS. Inclua GRANT necessários.' },
  { id:'p-data-2', cat:'Dados', name:'Seed inicial', body:'Crie um seed idempotente com dados de demonstração realistas para todas as tabelas principais.' },

  // Produtividade
  { id:'p-prod-1', cat:'Produtividade', name:'PRD do produto', body:'Escreva um PRD conciso: problema, usuário, jobs-to-be-done, escopo do MVP, métricas de sucesso e riscos.' },
  { id:'p-prod-2', cat:'Produtividade', name:'Plano de sprint', body:'Quebre a feature descrita em tarefas de até 1 dia, com dependências e critérios de aceite.' },
];

export function buildPromptForChat(p) {
  return p.body;
}
