// MR Sem Limites EXT5 — Skills (50 habilidades)
// Cada skill injeta um prompt profissional no chat #message.
// Não altera backend, licença, autenticação ou envio de mensagens.

export const SKILL_CATEGORIES = [
  { id: 'all',     name: 'Todas',     icon: '✨' },
  { id: 'build',   name: 'Construir', icon: '🚀' },
  { id: 'ui',      name: 'UI/Design', icon: '🎨' },
  { id: 'backend', name: 'Backend',   icon: '🗄' },
  { id: 'growth',  name: 'Growth',    icon: '📈' },
  { id: 'fix',     name: 'Consertar', icon: '🛠' },
  { id: 'content', name: 'Conteúdo',  icon: '✍️' },
];

export const SKILLS = [
  // ============ BUILD (10) ============
  { id: 'landing-premium', cat: 'build', icon: '🚀', name: 'Landing Page Premium',
    desc: 'Landing moderna com hero, features, prova social, pricing, FAQ e CTA final.',
    prompt: `Crie uma landing page premium moderna com design elegante e futurista.\n\nEstrutura obrigatória:\n1. Hero cinematográfico com headline forte, subheadline explicativa, CTA principal e imagem/visual\n2. Barra de logos de prova social\n3. Seção de 3-6 features com ícones (lucide-react) e microcopy\n4. "Como funciona" em 3 passos numerados\n5. Depoimentos com foto/nome/cargo\n6. Tabela de preços (3 planos, plano do meio destacado)\n7. FAQ com accordion (mín. 6 perguntas)\n8. CTA final com fundo em destaque\n9. Footer completo\n\nUse tokens semânticos, animações sutis, tipografia hierárquica, responsivo mobile-first. Nada de cores hardcoded. SEO completo.`, },

  { id: 'saas-dashboard', cat: 'build', icon: '💼', name: 'SaaS Dashboard',
    desc: 'Dashboard com sidebar, KPIs, gráficos, tabela e ações rápidas.',
    prompt: `Construa um dashboard SaaS completo com sidebar colapsável (Overview/Analytics/Customers/Billing/Settings), topbar com busca+avatar, 4 KPIs com sparkline, 2 gráficos Recharts (line+bar), tabela com paginação/busca/filtros, skeleton loaders, estado vazio elegante, totalmente responsivo. Use shadcn/ui e tokens semânticos.`, },

  { id: 'ecommerce', cat: 'build', icon: '🛒', name: 'E-commerce Completo',
    desc: 'Loja com catálogo, carrinho, checkout e área do cliente.',
    prompt: `Crie uma loja e-commerce completa: home com categorias e destaques, listagem com filtros, página de produto com galeria e variações, carrinho lateral com cupom, checkout em passos, área do cliente (pedidos/endereços/favoritos). Design premium mobile-first. Modele banco (produtos, categorias, pedidos, itens_pedido, endereços) com RLS. Preços em centavos.`, },

  { id: 'blog-cms', cat: 'build', icon: '📝', name: 'Blog / CMS',
    desc: 'Blog com editor rich text, categorias, tags e SEO por post.',
    prompt: `Construa um blog CMS: lista pública paginada com filtros, página do post com autor/data/tempo de leitura e rich text, painel admin protegido para CRUD, editor com preview, SEO por post (title/description/og/canonical/JSON-LD Article), busca full-text. RLS: leitura pública para publicados, escrita só admin.`, },

  { id: 'booking', cat: 'build', icon: '📅', name: 'Sistema de Agendamento',
    desc: 'Calendário com horários disponíveis, reserva e confirmação.',
    prompt: `Crie um sistema tipo Calendly: página pública com seleção de serviço, calendário mensal, horários do dia, form do cliente, confirmação por email. Painel admin com reservas, filtros e status. Bloqueio de horários passados/conflitos, fuso horário do usuário. Tabelas: services, availability_rules, bookings com RLS.`, },

  { id: 'ai-chatbot', cat: 'build', icon: '🤖', name: 'AI Chatbot',
    desc: 'Chat com streaming, histórico e componente polido.',
    prompt: `Implemente um AI chatbot moderno com AI SDK + Lovable AI Gateway: bolhas assistant/user, streaming de tokens, histórico persistido em threads, Enter/Shift+Enter, loading shimmer, tratamento de 429/402, model padrão google/gemini-2.5-flash, server route em src/routes/api/chat.ts com streamText + toUIMessageStreamResponse. Design dark elegante com tokens.`, },

  { id: 'crm', cat: 'build', icon: '📇', name: 'CRM de Leads',
    desc: 'Kanban de leads com pipeline, notas e follow-up.',
    prompt: `Construa um CRM completo: pipeline em Kanban (Novo → Contato → Proposta → Fechado/Perdido) com drag & drop, cadastro de lead (nome/empresa/email/telefone/origem/valor), notas com histórico, tarefas de follow-up com data, filtros por proprietário/etapa/origem, dashboard com conversão por etapa. RLS por owner_id.`, },

  { id: 'quiz', cat: 'build', icon: '🧩', name: 'Quiz Interativo',
    desc: 'Quiz com perguntas, pontuação, tempo e ranking.',
    prompt: `Crie um quiz interativo profissional: tela inicial com nome do participante, perguntas com múltipla escolha (imagem opcional), timer por pergunta, animação ao acertar/errar, tela final com pontuação e compartilhamento, ranking global (top 10). Painel admin para criar quizzes/perguntas. Design gamificado.`, },

  { id: 'crm-imob', cat: 'build', icon: '🏠', name: 'Site Imobiliário',
    desc: 'Portal com imóveis, filtros, mapa e contato via WhatsApp.',
    prompt: `Crie um portal imobiliário: home com busca inteligente (cidade/tipo/faixa de preço/quartos), listagem com card do imóvel (fotos, preço, características), mapa integrado, página do imóvel com galeria, tour 360 (opcional), características, mapa e botão "Falar no WhatsApp" com mensagem pronta. Painel admin para corretores. SEO por imóvel.`, },

  { id: 'form-builder', cat: 'build', icon: '📋', name: 'Form Builder',
    desc: 'Formulários dinâmicos com validação e respostas.',
    prompt: `Construa um form builder tipo Typeform: admin monta o form arrastando campos (texto, número, email, escolha, upload, data), com validação e lógica condicional. Página pública responde uma pergunta por vez com progresso. Respostas armazenadas no banco com export CSV. Design fluido e animado.`, },

  // ============ UI (9) ============
  { id: 'hero', cat: 'ui', icon: '🌠', name: 'Hero Cinemática',
    desc: 'Hero impactante com headline, sub, CTA e visual.',
    prompt: `Crie uma seção Hero cinematográfica: headline em 2 linhas com hierarquia forte, subheadline curta, 2 CTAs (primário + fantasma), visual à direita (mockup) OU fundo gradiente/blur animado, badges de confiança, animações fade-in/slide-up staggered, responsivo. Só tokens semânticos, sem cores hardcoded.`, },

  { id: 'pricing', cat: 'ui', icon: '💰', name: 'Tabela de Preços',
    desc: '3 planos com toggle mensal/anual e destaque no popular.',
    prompt: `Crie tabela de preços premium: toggle mensal/anual com desconto anual visível, 3 planos (Starter/Pro/Enterprise) com o do meio destacado ("Mais popular"), cada plano com features em check, comparação expandível abaixo, responsivo. Só tokens semânticos.`, },

  { id: 'testimonials', cat: 'ui', icon: '💬', name: 'Depoimentos',
    desc: 'Carrossel/grid de depoimentos com foto e estrelas.',
    prompt: `Crie seção de depoimentos: grid 3 cards desktop / 1 mobile, cada card com aspas grandes, texto, avatar, nome, cargo/empresa, 5 estrelas. Prova social acima ("+2.000 clientes"). Animações on scroll. Tokens semânticos.`, },

  { id: 'faq', cat: 'ui', icon: '❓', name: 'FAQ Accordion',
    desc: 'FAQ acessível com 8+ perguntas.',
    prompt: `Crie FAQ com accordion shadcn/ui acessível, mínimo 8 perguntas relevantes, título + subtítulo, CTA final "Não achou sua resposta? Fale conosco". Animação suave de expansão. Tokens semânticos.`, },

  { id: 'design-system', cat: 'ui', icon: '🎨', name: 'Design System Setup',
    desc: 'Tokens semânticos ricos (cor, gradiente, sombra).',
    prompt: `Configure design system elegante em src/styles.css: palette oklch (--background, --foreground, --primary, --secondary, --muted, --accent, --border, --ring), tokens extras (--primary-glow, --gradient-primary, --gradient-hero, --shadow-elegant, --shadow-glow), suporte dark/light, radius/spacing/transições consistentes. Atualize componentes shadcn para consumir esses tokens. Nunca hardcode cor.`, },

  { id: 'pwa', cat: 'ui', icon: '📱', name: 'PWA Mobile-First',
    desc: 'Transforma o app em PWA instalável.',
    prompt: `Transforme em PWA mobile-first: manifest.json com ícones 192/512, theme/bg color, display standalone. Service worker com cache básico. Meta viewport. Prompt "Adicionar à tela inicial". Layout mobile-first com bottom nav se fizer sentido. Splash screen elegante. Mantém desktop.`, },

  { id: 'bento-grid', cat: 'ui', icon: '🍱', name: 'Bento Grid',
    desc: 'Grid moderno estilo bento com cards de tamanhos variados.',
    prompt: `Construa uma seção Bento Grid moderna: 6-8 cards de tamanhos diferentes (2x1, 1x2, 1x1, 2x2), cada um destacando uma feature/estatística com ícone, número grande, título e microcopy. Animações hover (glow, scale). Responsivo (empilha em mobile). Tokens semânticos.`, },

  { id: 'auth-ui', cat: 'ui', icon: '🔑', name: 'Tela de Login Elegante',
    desc: 'Login split-screen com ilustração e formulário limpo.',
    prompt: `Crie uma tela de login premium split-screen: metade esquerda com ilustração/gradiente animado + frase inspiradora, metade direita com form (email/senha, "esqueci minha senha", botão Google, link para cadastro). Validação inline, mensagens de erro claras, loading state. Responsivo. Tokens semânticos.`, },

  { id: 'onboarding', cat: 'ui', icon: '🎬', name: 'Onboarding Wizard',
    desc: 'Fluxo em passos com progresso e animações.',
    prompt: `Implemente um wizard de onboarding em 4-5 passos: barra de progresso no topo, um passo por tela (perguntas simples, uma por vez), botões "Voltar/Próximo", validação por etapa, tela final "Tudo pronto" com CTA para dashboard. Animações slide entre etapas. Persiste respostas mesmo se recarregar. Mobile-first.`, },

  // ============ BACKEND (8) ============
  { id: 'auth', cat: 'backend', icon: '🔐', name: 'Auth Completo',
    desc: 'Login/Signup com email+senha, sessão e rotas protegidas.',
    prompt: `Implemente auth completo com Lovable Cloud: /auth com tabs Login/Signup, email+senha com validação, "Continuar com Google" se disponível, /reset-password, trigger de signup criando profile em public.profiles, rotas protegidas em _authenticated/*, logout no header, redirect pós-login. RLS respeitado. Roles em tabela user_roles separada com has_role() security definer — NUNCA em profiles.`, },

  { id: 'stripe', cat: 'backend', icon: '💳', name: 'Pagamento Stripe',
    desc: 'Checkout Stripe com webhook e status de assinatura.',
    prompt: `Integre Stripe: botão Assinar cria Checkout Session (server function), webhook em src/routes/api/public/stripe-webhook.ts com verificação de assinatura, tabela subscriptions (user_id, stripe_customer_id, status, plan, current_period_end) com RLS, página /billing com plano atual + Portal, guards de rota por plano. Secrets: STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET.`, },

  { id: 'db-schema', cat: 'backend', icon: '🗄', name: 'Schema de Banco',
    desc: 'Modela tabelas com RLS, grants e índices.',
    prompt: `Modele o banco Lovable Cloud para o meu domínio. Obrigatório: todo CREATE TABLE public.* seguido de GRANT (SELECT/INSERT/UPDATE/DELETE) para authenticated e ALL para service_role; ENABLE ROW LEVEL SECURITY em todas; políticas por operação (não FOR ALL); roles em user_roles + has_role security definer; FKs com ON DELETE; índices em colunas de WHERE/JOIN; timestamps created_at/updated_at com trigger. Me pergunte o domínio antes.`, },

  { id: 'rls-fix', cat: 'backend', icon: '🔒', name: 'Corrigir RLS',
    desc: 'Audita e corrige políticas de segurança.',
    prompt: `Audite RLS de todas as tabelas em public. Liste: RLS habilitado?, cada policy (nome/op/roles/USING/WITH CHECK), GRANTs. Aponte problemas: RLS off, FOR ALL sem WITH CHECK, referência circular a user_roles, falta de GRANT, escopo por profile em vez de user_roles. Depois proponha migration corrigindo tudo, incluindo has_role security definer se faltar.`, },

  { id: 'email-flow', cat: 'backend', icon: '📧', name: 'E-mail Transacional',
    desc: 'Envia e-mails (boas-vindas, reset, notificações).',
    prompt: `Configure e-mails via Resend: secret RESEND_API_KEY, server function sendEmail(to, subject, html), templates HTML elegantes (boas-vindas, reset, confirmação de compra), dispara no signup/reset/checkout, log em tabela email_logs com RLS admin-only.`, },

  { id: 'file-upload', cat: 'backend', icon: '📤', name: 'Upload de Arquivos',
    desc: 'Upload seguro com validação e preview.',
    prompt: `Implemente upload de arquivos: bucket com policies (owner-only ou public conforme caso), UI com drag & drop, preview instantâneo, barra de progresso, validação de tipo/tamanho no cliente e servidor, geração de URL assinada quando privado, thumbnails para imagens. Tabela files (user_id, path, size, mime, created_at) com RLS.`, },

  { id: 'admin-panel', cat: 'backend', icon: '🛡', name: 'Painel Admin',
    desc: 'Área admin protegida com listagem, filtros e ações.',
    prompt: `Crie área admin em /admin protegida por has_role('admin'): dashboard com KPIs, listagem de usuários com busca/filtros, ações (banir, promover, resetar senha via server function), listagem das principais entidades do app com CRUD, logs de auditoria em tabela audit_logs. Roles em user_roles — nunca em profiles.`, },

  { id: 'realtime', cat: 'backend', icon: '📡', name: 'Realtime / Websockets',
    desc: 'Atualização em tempo real de listas e chats.',
    prompt: `Adicione realtime: habilite replication na tabela alvo, no client subscribe a INSERT/UPDATE/DELETE e atualize o estado local incrementalmente (sem refetch total). Aplique em chats, notificações e listas colaborativas. Cleanup no unmount. Toast quando chega item novo enquanto o usuário está em outra rota.`, },

  // ============ GROWTH (7) ============
  { id: 'seo', cat: 'growth', icon: '🔍', name: 'SEO Completo',
    desc: 'Otimiza título, meta, OG, sitemap, robots e JSON-LD.',
    prompt: `Otimize SEO do site: cada rota com head() (title <60 com keyword, meta description <160, og:title/description/type, twitter:card), H1 único, alt em todas as imagens, JSON-LD (Organization/WebSite/Article/Product), sitemap.xml + robots.txt, canonical tags, lazy loading, viewport responsivo. Nada de "Lovable App" ou placeholder.`, },

  { id: 'analytics', cat: 'growth', icon: '📊', name: 'Analytics + Eventos',
    desc: 'Instrumenta eventos-chave (signup, purchase, click).',
    prompt: `Integre PostHog (chave em VITE_): track page_view, sign_up, log_in, subscribe_click, purchase_completed, cta_click (com prop cta_id). Identify pós-login. Dashboard interno mostrando MRR, signups da semana, top páginas (server function agregando). Sem PII sensível.`, },

  { id: 'i18n', cat: 'growth', icon: '🌍', name: 'Multi-idioma (i18n)',
    desc: 'Adiciona PT/EN/ES com detecção automática.',
    prompt: `Adicione i18n com react-i18next (pt, en, es): extraia strings visíveis para arquivos de tradução, seletor com bandeira no header, detecção pelo browser + persistência em localStorage, hreflang e locale nas metatags. PT como default.`, },

  { id: 'cta-optimize', cat: 'growth', icon: '🎯', name: 'Otimizar CTAs',
    desc: 'Reforma textos e visual dos CTAs para conversão.',
    prompt: `Audite todos os CTAs e melhore: texto com verbo + benefício ("Começar grátis", "Ver demonstração"), contraste alto, tamanho/padding generoso especialmente mobile, micro-interação hover (scale/glow), hierarquia clara entre primário e secundário, prova social próxima. Mantenha tokens semânticos.`, },

  { id: 'ab-test', cat: 'growth', icon: '🧪', name: 'A/B Test Simples',
    desc: 'Experimento A/B com variantes e métricas.',
    prompt: `Implemente A/B testing simples: hook useExperiment(name) que sorteia variante A/B por usuário, persiste em cookie/localStorage, envia evento experiment_exposed pro analytics. Uso em headline/CTA. Painel interno mostrando conversão por variante e significância estatística.`, },

  { id: 'affiliate', cat: 'growth', icon: '🤝', name: 'Programa de Afiliados',
    desc: 'Links únicos, tracking de conversão e dashboard.',
    prompt: `Crie programa de afiliados: cada usuário tem link único (?ref=CODIGO), cookie de 30 dias, tabela referrals (affiliate_id, referred_user, converted_at, commission), dashboard do afiliado com cliques/conversões/comissão a receber, painel admin para aprovar pagamentos. RLS.`, },

  { id: 'newsletter', cat: 'growth', icon: '📬', name: 'Captura de Leads',
    desc: 'Popup/exit intent + integração de e-mail.',
    prompt: `Adicione captura de leads: popup elegante com exit-intent (mouse sai pra fechar aba), oferta clara (ebook/desconto), form email + nome, gravação em tabela leads com origem e UTM, envio automático do lead magnet via Resend, ocultar popup por 7 dias após submissão/fechamento.`, },

  // ============ FIX (6) ============
  { id: 'bug-fix', cat: 'fix', icon: '🐛', name: 'Consertar Bug',
    desc: 'Diagnostica e corrige um erro específico.',
    prompt: `Preciso corrigir um bug. Antes de mexer no código: (1) me diga qual investigação vai fazer (logs, network, arquivos suspeitos), (2) aponte causa raiz não sintoma, (3) enumere onde mais o mesmo padrão pode falhar (rotas irmãs, políticas, fetchers), (4) só então proponha o patch, (5) valide depois de aplicar.\n\nBug: [DESCREVA O QUE ACONTECE, O QUE ESPERAVA E A MENSAGEM]`, },

  { id: 'perf', cat: 'fix', icon: '⚡', name: 'Otimizar Performance',
    desc: 'Reduz LCP, bundle e re-renders.',
    prompt: `Otimize performance: meça LCP/CLS/INP mentalmente por rota, otimize imagens grandes (formato/tamanho/loading lazy), elimine re-renders desnecessários (useMemo/useCallback/memo onde importa), code-split rotas pesadas com lazy(), reduza bundle (libs duplicadas), Suspense + skeletons no lugar de spinners. Relatório antes/depois.`, },

  { id: 'refactor', cat: 'fix', icon: '♻️', name: 'Refatorar Código',
    desc: 'Quebra arquivos grandes e melhora legibilidade.',
    prompt: `Refatore mantendo comportamento idêntico: identifique arquivos >300 linhas e quebre em componentes/hooks focados, extraia lógica compartilhada, tipos claros (sem any), nomes expressivos, remova código morto e imports não usados, consolide estilos duplicados em tokens. Antes de mudar, apresente lista de afetados e plano.`, },

  { id: 'a11y', cat: 'fix', icon: '♿', name: 'Acessibilidade (a11y)',
    desc: 'Corrige contraste, foco, labels e ARIA.',
    prompt: `Auditoria de a11y: inputs com <label>, botões sem texto com aria-label, contraste mín 4.5:1, foco visível em teclado, ordem lógica de tabulação, landmarks (header/main/footer/nav), alt significativo, modais com trap de foco e Escape. Corrija tudo mantendo o design.`, },

  { id: 'security-audit', cat: 'fix', icon: '🛡', name: 'Auditoria de Segurança',
    desc: 'Verifica RLS, secrets, XSS e endpoints públicos.',
    prompt: `Faça auditoria de segurança: RLS habilitado e correto em todas as tabelas, secrets fora do código (só via env), endpoints /api/public/* com verificação de assinatura ou rate limit, sanitização de HTML para prevenir XSS, validação com Zod em todas as server functions, roles em user_roles com has_role security definer. Relatório de riscos e correção.`, },

  { id: 'error-boundary', cat: 'fix', icon: '🚨', name: 'Error Handling Global',
    desc: 'ErrorBoundary, toast de erro e fallback amigável.',
    prompt: `Implemente error handling global: ErrorBoundary no __root que mostra tela amigável ("Algo deu errado — tente novamente") com botão de reload, captura de erros de rede com toast, retry automático em queries idempotentes, log dos erros críticos em tabela error_logs (server function), rota /404 e /500 customizadas com identidade do produto.`, },

  // ============ CONTENT (10) ============
  { id: 'copy', cat: 'content', icon: '✍️', name: 'Copy Persuasivo',
    desc: 'Reescreve textos com foco em conversão.',
    prompt: `Reescreva todos os textos visíveis com foco em conversão: headline (promessa + benefício + diferencial, máx 12 palavras), subheadline (quem é, o que resolve, para quem, máx 20 palavras), features (benefício antes de característica), CTAs (verbo + resultado), depoimentos específicos, FAQ com dúvidas REAIS. PT-BR, tom [profissional / próximo / técnico / luxo].`, },

  { id: 'about', cat: 'content', icon: '🏛', name: 'Página Sobre',
    desc: 'Sobre nós com missão, história, time e valores.',
    prompt: `Crie /sobre premium: hero com foto/ilustração + manifesto, nossa história em timeline visual, missão/visão/valores em 3 cards, time com fotos/nomes/cargos/mini bios, métricas de impacto, CTA final. Design elegante com mesmos tokens do site.`, },

  { id: 'legal', cat: 'content', icon: '📜', name: 'Termos + Privacidade',
    desc: 'Gera páginas legais em PT-BR (LGPD).',
    prompt: `Crie /termos e /privacidade em PT-BR alinhadas com LGPD. Termos: aceitação, cadastro, pagamentos, propriedade intelectual, limitação de responsabilidade, rescisão, foro. Privacidade: dados coletados, base legal, uso, compartilhamento, direitos do titular, cookies, DPO. Sumário lateral clicável, data de atualização. Me pergunte nome da empresa, CNPJ opcional, site e email antes.`, },

  { id: 'social-content', cat: 'content', icon: '📱', name: 'Kit Redes Sociais',
    desc: 'Legendas + roteiros para posts e reels.',
    prompt: `Gere kit de conteúdo para redes: 5 legendas Instagram (hook + corpo + CTA + hashtags), 3 roteiros Reels 30-60s cena a cena (visual + texto na tela + narração), 3 tópicos LinkedIn com storytelling, 3 threads curtas X. PT-BR, tom [ESCOLHA]. Pergunte o nicho antes se preciso.`, },

  { id: 'email-marketing', cat: 'content', icon: '💌', name: 'Sequência de E-mail',
    desc: 'Fluxo de e-mail marketing de 5 mensagens.',
    prompt: `Crie sequência de e-mail marketing de 5 mensagens em PT-BR: (1) Boas-vindas + valor, (2) história/prova social, (3) educação sobre o problema, (4) oferta principal, (5) urgência/último aviso. Cada e-mail com subject A/B (2 opções), preheader, corpo curto e escaneável, um CTA claro. Tom [ESCOLHA].`, },

  { id: 'ads-copy', cat: 'content', icon: '🎯', name: 'Copy para Anúncios',
    desc: 'Textos prontos para Meta Ads e Google Ads.',
    prompt: `Gere copy para anúncios pagos do meu produto: 5 variações Meta Ads (headline curta 30 chars, primary text 90 chars, description 30 chars, CTA), 5 variações Google Search (headline1/2/3 30 chars, description1/2 90 chars). PT-BR, foco em benefício + prova + urgência. Pergunte o nicho e público-alvo antes.`, },

  { id: 'youtube-script', cat: 'content', icon: '🎥', name: 'Roteiro YouTube',
    desc: 'Roteiro completo para vídeo do YouTube.',
    prompt: `Crie roteiro completo para vídeo YouTube (8-12 min): hook nos primeiros 15s (promessa + prévia), intro curta com identidade, 3-5 blocos de conteúdo com transições, exemplos práticos, CTA no meio e no fim (inscrever/próximo vídeo), timestamps sugeridos, título com CTR alto e 3 thumbnails textuais. PT-BR.`, },

  { id: 'sales-page', cat: 'content', icon: '💵', name: 'Página de Vendas Longa',
    desc: 'Sales page completa com storytelling e prova.',
    prompt: `Crie sales page longa e persuasiva: headline promessa + subhead, VSL/vídeo opcional, história do problema, agitação da dor, apresentação da solução com bullets de benefícios, prova (depoimentos com resultado numérico), o que está incluso (deliverables ilustrados), preço com ancoragem e desconto, garantia visual, bônus, FAQ, CTA repetido 3-5x, contagem regressiva. Design premium.`, },

  { id: 'whatsapp-scripts', cat: 'content', icon: '💚', name: 'Scripts de WhatsApp',
    desc: 'Mensagens prontas para vendas via WhatsApp.',
    prompt: `Gere scripts de WhatsApp para vendas: (1) abordagem inicial ao lead, (2) qualificação em 3 perguntas, (3) apresentação da oferta, (4) quebra de objeções (preço/tempo/confiança), (5) fechamento com urgência, (6) follow-up 24h/72h/7 dias sem resposta. PT-BR informal-profissional, mensagens curtas com emojis moderados. Pergunte o produto/nicho antes.`, },

  { id: 'brand-guide', cat: 'content', icon: '🎨', name: 'Guia de Marca',
    desc: 'Manual de marca com voz, cores e uso.',
    prompt: `Crie guia de marca resumido: propósito, missão, visão, valores, arquétipo, personalidade em 5 palavras, voz e tom (o que usar / o que evitar) com exemplos, paleta de cores (nome, HEX, uso), tipografia (heading/body), regras de logo (afastamento, versões, o que não fazer). Página bonita e navegável.`, },
];

export function buildSkillPrompt(skill) {
  return skill.prompt;
}
