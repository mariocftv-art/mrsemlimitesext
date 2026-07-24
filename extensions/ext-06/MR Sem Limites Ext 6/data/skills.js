// MR Sem Limites EXT6 — Skills
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
  { id: 'edu',     name: 'Aulas/Professores', icon: '🎓' },
];

export const SKILLS = [
  // ============ BUILD ============
  { id: 'landing-premium', cat: 'build', icon: '🚀', name: 'Landing Page Premium',
    desc: 'Landing moderna com hero, features, prova social, pricing, FAQ e CTA final.',
    prompt: `Crie uma landing page premium moderna com design elegante e futurista.\n\nEstrutura obrigatória:\n1. Hero cinematográfico com headline forte, subheadline explicativa, CTA principal e imagem/visual\n2. Barra de logos de prova social\n3. Seção de 3-6 features com ícones (lucide-react) e microcopy\n4. "Como funciona" em 3 passos numerados\n5. Depoimentos com foto/nome/cargo\n6. Tabela de preços (3 planos, plano do meio destacado)\n7. FAQ com accordion (mín. 6 perguntas)\n8. CTA final com fundo em destaque\n9. Footer completo (links, redes, copyright)\n\nUse tokens semânticos do design system (src/styles.css), animações sutis (fade-in/scale-in), tipografia hierárquica, espaçamento generoso, responsivo mobile-first. Nada de cores hardcoded. SEO: title, meta description, H1 único.`, },

  { id: 'saas-dashboard', cat: 'build', icon: '💼', name: 'SaaS Dashboard',
    desc: 'Dashboard com sidebar, KPIs, gráficos, tabela e ações rápidas.',
    prompt: `Construa um dashboard SaaS completo e profissional.\n\nRequisitos:\n- Sidebar colapsável com navegação (Overview, Analytics, Customers, Billing, Settings)\n- Topbar com busca, notificações, avatar/dropdown\n- 4 cards de KPI (valor, variação %, sparkline)\n- 2 gráficos (line + bar) usando Recharts\n- Tabela com paginação, busca e filtros\n- Estado vazio elegante\n- Skeleton loaders\n- Totalmente responsivo, dark/light via tokens semânticos\n\nUse shadcn/ui (Card, Table, Button, Badge, DropdownMenu). Não use cores hardcoded — apenas tokens do design system.`, },

  { id: 'ecommerce', cat: 'build', icon: '🛒', name: 'E-commerce Setup',
    desc: 'Loja com catálogo, carrinho, checkout e área do cliente.',
    prompt: `Crie uma loja e-commerce completa:\n\n- Home com hero + categorias em destaque + produtos em alta\n- Página de listagem com filtros (categoria, preço, ordenação)\n- Página de produto com galeria, variações, descrição, avaliações\n- Carrinho lateral (Sheet) com resumo e cupom\n- Checkout em passos (endereço → pagamento → confirmação)\n- Área do cliente (pedidos, endereços, favoritos)\n- Design premium, mobile-first\n\nEstruture o banco (produtos, categorias, pedidos, itens_pedido, endereços) com RLS. Preços em centavos.`, },

  { id: 'blog-cms', cat: 'build', icon: '📝', name: 'Blog / CMS',
    desc: 'Blog com editor rich text, categorias, tags e SEO por post.',
    prompt: `Construa um blog CMS completo com:\n\n- Lista pública de posts com paginação e filtro por categoria/tag\n- Página do post com título, capa, autor, data, tempo de leitura, conteúdo em rich text (markdown)\n- Painel admin (protegido) para criar/editar/publicar posts\n- Editor com preview\n- SEO por post: title, description, og:image, canonical, JSON-LD Article\n- Comentários (opcional)\n- Busca full-text\n\nTabelas: posts, categorias, tags, autores. RLS: leitura pública para publicados, escrita só para admins.`, },

  { id: 'booking', cat: 'build', icon: '📅', name: 'Sistema de Agendamento',
    desc: 'Calendário com horários disponíveis, reserva e confirmação.',
    prompt: `Crie um sistema de agendamento tipo Calendly:\n\n- Página pública com seleção de serviço, calendário mensal, horários do dia\n- Formulário do cliente (nome, email, telefone, observações)\n- Confirmação por email\n- Painel admin com lista de reservas, filtros e status (pendente/confirmado/cancelado)\n- Bloqueio de horários passados e conflitos\n- Fuso horário do usuário\n\nTabelas: services, availability_rules, bookings. RLS adequada.`, },

  { id: 'ai-chatbot', cat: 'build', icon: '🤖', name: 'AI Chatbot',
    desc: 'Chat com streaming, histórico e componente polido.',
    prompt: `Implemente um AI chatbot moderno usando AI SDK + Lovable AI Gateway:\n\n- Interface de chat com bolhas assistant/usuário\n- Streaming de tokens em tempo real\n- Histórico persistido por conversa (threads)\n- Input com submit por Enter e Shift+Enter para nova linha\n- Loading state (shimmer "Pensando...") e tratamento de erros (429, 402)\n- Model padrão google/gemini-2.5-flash\n- Server route em src/routes/api/chat.ts usando streamText + toUIMessageStreamResponse\n\nUse AI Elements (Conversation, Message, PromptInput). Design elegante, dark theme com tokens do sistema.`, },

  // ============ UI ============
  { id: 'hero', cat: 'ui', icon: '🌠', name: 'Hero Section Cinemática',
    desc: 'Hero impactante com headline, sub, CTA e visual.',
    prompt: `Crie uma seção Hero cinematográfica e impactante:\n\n- Headline em 2 linhas, hierarquia tipográfica forte\n- Subheadline curta explicando o valor\n- 2 CTAs (primário + secundário fantasma)\n- Visual à direita (imagem ou mockup) OU fundo com gradiente/blur animado\n- Badges de confiança abaixo\n- Animações fade-in/slide-up staggered\n- Responsivo (empilha em mobile)\n\nUse apenas tokens semânticos do design system. Sem cores hardcoded.`, },

  { id: 'pricing', cat: 'ui', icon: '💰', name: 'Tabela de Preços',
    desc: '3 planos com toggle mensal/anual e destaque no popular.',
    prompt: `Crie uma tabela de preços premium:\n\n- Toggle mensal/anual com desconto anual visível\n- 3 planos (Starter / Pro / Enterprise), plano do meio destacado com badge "Mais popular"\n- Cada plano: nome, preço, descrição curta, lista de features com check, CTA\n- Comparação de features em tabela expandível abaixo\n- Layout responsivo (empilha em mobile)\n\nUse tokens semânticos, sem cores hardcoded.`, },

  { id: 'testimonials', cat: 'ui', icon: '💬', name: 'Depoimentos',
    desc: 'Carrossel/grid de depoimentos com foto, nome, cargo e estrelas.',
    prompt: `Crie uma seção de depoimentos premium:\n\n- Grid de 3 cards em desktop, 1 em mobile\n- Cada card: aspas grandes, texto do depoimento, avatar, nome, cargo/empresa, 5 estrelas\n- Carrossel opcional com autoplay e controles\n- Prova social acima: "+2.000 clientes" ou logos de empresas\n\nUse tokens semânticos e animações sutis on scroll.`, },

  { id: 'faq', cat: 'ui', icon: '❓', name: 'FAQ com Accordion',
    desc: 'FAQ acessível com 8+ perguntas.',
    prompt: `Crie uma seção FAQ:\n\n- Accordion acessível (shadcn/ui Accordion)\n- Mínimo 8 perguntas relevantes\n- Título + subtítulo\n- CTA no final: "Não achou sua resposta? Fale conosco"\n\nAnime a expansão suavemente. Use tokens semânticos.`, },

  { id: 'design-system', cat: 'ui', icon: '🎨', name: 'Design System Setup',
    desc: 'Define tokens semânticos ricos (cor, gradiente, sombra, radius).',
    prompt: `Configure um design system elegante e futurista em src/styles.css:\n\n- Palette em oklch: --background, --foreground, --primary, --primary-foreground, --secondary, --muted, --accent, --border, --ring\n- Tokens extras: --primary-glow, --gradient-primary, --gradient-hero, --shadow-elegant, --shadow-glow\n- Suporte dark/light\n- Radius, spacing e transições consistentes\n- Atualize componentes shadcn para consumir variantes com esses tokens\n\nNão use classes com cores hardcoded (text-white, bg-black). Sempre tokens.`, },

  { id: 'pwa', cat: 'ui', icon: '📱', name: 'PWA Mobile-First',
    desc: 'Transforma o app em PWA instalável e responsivo.',
    prompt: `Transforme o projeto em PWA mobile-first:\n\n- manifest.json com nome, ícones (192/512), theme_color, background_color, display standalone\n- Service worker com cache básico\n- Meta viewport correta\n- Ícone de instalação e prompt "Adicionar à tela inicial"\n- Layout revisado para mobile-first (bottom nav se fizer sentido)\n- Splash screen elegante\n\nMantenha responsividade em desktop.`, },

  // ============ BACKEND ============
  { id: 'auth', cat: 'backend', icon: '🔐', name: 'Auth Completo',
    desc: 'Login/Signup com email+senha, sessão e rotas protegidas.',
    prompt: `Implemente autenticação completa com Lovable Cloud:\n\n- Página /auth com tabs Login/Signup\n- Email + senha, validação e mensagens claras\n- Botão "Continuar com Google" (se disponível)\n- Página /reset-password\n- Trigger no signup criando profile em public.profiles\n- Rotas protegidas em _authenticated/*\n- Logout no header/menu\n- Redirecionamento pós-login para dashboard\n\nRespeite RLS. Nunca guarde roles em profiles — use tabela user_roles separada com has_role() security definer.`, },

  { id: 'stripe', cat: 'backend', icon: '💳', name: 'Pagamento Stripe',
    desc: 'Checkout Stripe com webhook e status de assinatura.',
    prompt: `Integre pagamentos Stripe:\n\n- Botão "Assinar" que cria Checkout Session (server function)\n- Webhook em src/routes/api/public/stripe-webhook.ts verificando assinatura\n- Tabela subscriptions (user_id, stripe_customer_id, status, plan, current_period_end) com RLS\n- Página /billing mostrando plano atual, botão gerenciar (Portal), próximo pagamento\n- Guards de rota por plano\n\nUse STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET como secrets.`, },

  { id: 'db-schema', cat: 'backend', icon: '🗄', name: 'Schema de Banco',
    desc: 'Modela tabelas com RLS, grants e índices.',
    prompt: `Modele o banco Lovable Cloud para o meu domínio.\n\nRegras obrigatórias:\n- Todo CREATE TABLE public.* seguido de GRANT (SELECT/INSERT/UPDATE/DELETE) para authenticated e ALL para service_role\n- ENABLE ROW LEVEL SECURITY em todas\n- Políticas por operação (não FOR ALL genérico)\n- Roles em tabela user_roles separada + função has_role security definer\n- Chaves estrangeiras com ON DELETE apropriado\n- Índices nas colunas usadas em WHERE/JOIN\n- Timestamps created_at/updated_at + trigger de updated_at\n\nAntes de escrever a migration, me pergunte o domínio (ex: agendamento, ecommerce, blog).`, },

  { id: 'rls-fix', cat: 'backend', icon: '🔒', name: 'Corrigir RLS',
    desc: 'Audita e corrige políticas de segurança.',
    prompt: `Audite as políticas RLS de todas as tabelas em public.\n\nPara cada tabela liste:\n- Se RLS está habilitado\n- Cada policy: nome, operação, roles, expressão USING/WITH CHECK\n- GRANTs concedidos\n\nAponte problemas: RLS desligado, políticas FOR ALL sem WITH CHECK, referência circular a user_roles, falta de GRANTs, escopo por profile em vez de user_roles. Depois proponha uma migration corrigindo tudo, incluindo função has_role security definer se ainda não existir.`, },

  { id: 'email-flow', cat: 'backend', icon: '📧', name: 'E-mail Transacional',
    desc: 'Envia e-mails (boas-vindas, reset, notificações).',
    prompt: `Configure e-mails transacionais via Resend:\n\n- Adicione RESEND_API_KEY como secret\n- Crie server function sendEmail(to, subject, html)\n- Templates HTML elegantes (boas-vindas, reset, confirmação de compra)\n- Dispare no signup (via trigger + edge/server), no reset, no checkout concluído\n- Log dos envios em tabela email_logs\n\nRespeite RLS: só admin lê logs.`, },

  // ============ GROWTH ============
  { id: 'seo', cat: 'growth', icon: '🔍', name: 'SEO Completo',
    desc: 'Otimiza título, meta, OG, sitemap, robots e JSON-LD.',
    prompt: `Otimize o SEO do site inteiro:\n\n- Em cada rota, defina head() com title único (<60 chars, com keyword), meta description (<160 chars), og:title, og:description, og:type, twitter:card\n- H1 único por página, hierarquia semântica\n- Alt em todas as imagens\n- JSON-LD (Organization, WebSite, Article/Product conforme rota)\n- sitemap.xml e robots.txt gerados\n- Canonical tags\n- Lazy loading de imagens abaixo do fold\n- Meta viewport responsivo\n\nNão use "Lovable App" nem placeholders. Cada página com identidade própria.`, },

  { id: 'analytics', cat: 'growth', icon: '📊', name: 'Analytics + Eventos',
    desc: 'Instrumenta eventos-chave (signup, purchase, click).',
    prompt: `Adicione analytics ao app:\n\n- Integre PostHog ou similar (chave em VITE_)\n- Track eventos-chave: page_view, sign_up, log_in, subscribe_click, purchase_completed, cta_click (com prop cta_id)\n- Identifique o usuário pós-login\n- Dashboard interno mostrando MRR, signups da semana, top páginas (server function agregando)\n\nRespeite privacidade e não envie PII sensível.`, },

  { id: 'i18n', cat: 'growth', icon: '🌍', name: 'Multi-idioma (i18n)',
    desc: 'Adiciona PT/EN/ES com detecção automática.',
    prompt: `Adicione internacionalização:\n\n- react-i18next com locales pt, en, es\n- Extraia todas as strings visíveis para arquivos de tradução\n- Seletor de idioma no header (com bandeira)\n- Detecção do idioma do browser + persistência em localStorage\n- hreflang e locale nas metatags OG\n\nMantenha PT como default.`, },

  { id: 'cta-optimize', cat: 'growth', icon: '🎯', name: 'Otimizar CTAs',
    desc: 'Reforma textos e visual dos CTAs para conversão.',
    prompt: `Audite todos os botões CTA do site e proponha melhorias:\n\n- Texto: verbo de ação + benefício claro (ex: "Começar grátis", "Ver demonstração")\n- Contraste alto contra fundo\n- Tamanho e padding generosos, especialmente em mobile\n- Micro-interação no hover (scale/glow)\n- Hierarquia clara entre CTA primário e secundário\n- Prova social próxima ("+2.000 usuários já usam")\n\nAplique as mudanças mantendo tokens semânticos.`, },

  // ============ FIX ============
  { id: 'bug-fix', cat: 'fix', icon: '🐛', name: 'Consertar Bug',
    desc: 'Diagnostica e corrige um erro específico.',
    prompt: `Preciso corrigir um bug. Antes de escrever código:\n\n1. Me diga qual investigação você vai fazer (logs, network, arquivos suspeitos)\n2. Aponte a causa raiz, não só o sintoma\n3. Enumere onde mais o mesmo padrão pode falhar (rotas irmãs, políticas, fetchers)\n4. Só então proponha o patch\n5. Depois de aplicar, valide (build, teste ou console)\n\nBug atual: [DESCREVA AQUI O QUE ESTÁ ACONTECENDO, O QUE VOCÊ ESPERAVA E QUAL MENSAGEM APARECE]`, },

  { id: 'perf', cat: 'fix', icon: '⚡', name: 'Otimizar Performance',
    desc: 'Analisa e reduz LCP, bundle e re-renders.',
    prompt: `Otimize performance do app:\n\n- Meça LCP, CLS, INP mentalmente pelas rotas\n- Identifique imagens grandes sem lazy loading e otimize (formato, tamanho, loading="lazy")\n- Encontre re-renders desnecessários (useMemo, useCallback, React.memo onde faz sentido)\n- Code-split rotas pesadas com lazy()\n- Reduza bundle: remova libs duplicadas, prefira alternativas menores\n- Suspense + skeletons ao invés de spinners genéricos\n\nApresente um relatório antes/depois do que mudou.`, },

  { id: 'refactor', cat: 'fix', icon: '♻️', name: 'Refatorar Código',
    desc: 'Quebra arquivos grandes e melhora legibilidade.',
    prompt: `Refatore o código mantendo comportamento idêntico:\n\n- Identifique arquivos com +300 linhas e quebre em componentes/hooks focados\n- Extraia lógica compartilhada para hooks/utils\n- Tipos claros (nada de any)\n- Nomes expressivos\n- Remova código morto e imports não usados\n- Consolide estilos duplicados em tokens\n\nAntes de mudar algo, mostre a lista de arquivos afetados e o plano.`, },

  { id: 'a11y', cat: 'fix', icon: '♿', name: 'Acessibilidade (a11y)',
    desc: 'Audita e corrige contraste, foco, labels e ARIA.',
    prompt: `Faça uma auditoria de acessibilidade:\n\n- Todos os inputs com <label>\n- Botões sem texto com aria-label\n- Contraste mínimo 4.5:1 em texto normal\n- Foco visível em toda navegação por teclado\n- Ordem lógica de tabulação\n- Landmarks (header, main, footer, nav)\n- Imagens com alt significativo\n- Modais com trap de foco e Escape para fechar\n\nCorrija tudo mantendo o design.`, },

  // ============ CONTENT ============
  { id: 'copy', cat: 'content', icon: '✍️', name: 'Copy Persuasivo',
    desc: 'Reescreve textos com foco em conversão.',
    prompt: `Reescreva todos os textos visíveis do site com foco em conversão:\n\n- Headline: promessa clara + benefício + diferencial (máx 12 palavras)\n- Subheadline: quem é, o que resolve, para quem (máx 20 palavras)\n- Features: benefício antes de característica\n- CTAs: verbo + resultado\n- Depoimentos: reais e específicos\n- FAQ: perguntas que o cliente REALMENTE tem\n\nEm português brasileiro, tom [ESCOLHA: profissional / próximo / técnico / luxo]. Mantenha estrutura HTML igual.`, },

  { id: 'about', cat: 'content', icon: '🏛', name: 'Página Sobre',
    desc: 'Sobre nós com missão, história, time e valores.',
    prompt: `Crie uma página /sobre premium:\n\n- Hero com foto/ilustração + frase-manifesto\n- Nossa história em timeline visual\n- Missão, visão, valores em 3 cards\n- Time com fotos, nomes, cargos e mini bios\n- Métricas de impacto (clientes, países, anos)\n- CTA final para contato/produto\n\nDesign elegante, mesmos tokens do restante do site.`, },

  { id: 'legal', cat: 'content', icon: '📜', name: 'Termos + Privacidade',
    desc: 'Gera páginas legais em PT-BR (LGPD).',
    prompt: `Crie páginas legais em /termos e /privacidade, em português brasileiro, alinhadas com LGPD:\n\n- Termos de Uso: aceitação, cadastro, pagamentos, propriedade intelectual, limitação de responsabilidade, rescisão, foro\n- Política de Privacidade: dados coletados, base legal, uso, compartilhamento, direitos do titular, cookies, contato do DPO\n- Layout limpo com sumário lateral clicável\n- Data de atualização visível\n\nPergunte antes o nome da empresa, CNPJ (opcional), site e email de contato.`, },

  { id: 'social-content', cat: 'content', icon: '📱', name: 'Kit de Redes Sociais',
    desc: 'Gera legendas + roteiros para posts e reels.',
    prompt: `Gere um kit de conteúdo para redes sociais do meu produto:\n\n- 5 legendas prontas para Instagram (hook forte + corpo + CTA + hashtags)\n- 3 roteiros de Reels (30-60s) com cena a cena (visual + texto na tela + narração)\n- 3 tópicos para LinkedIn (mais formais, storytelling)\n- 3 threads curtas para X/Twitter\n\nEm PT-BR, tom [ESCOLHA]. Pergunte o nicho antes se não estiver claro.`, },
  // ============ AULAS / PROFESSORES ============
  { id: 'edu-plano-aula', cat: 'edu', icon: '📘', name: 'Plano de Aula Completo',
    desc: 'Objetivos, BNCC, metodologia, avaliação e recursos.',
    prompt: `Crie um plano de aula profissional em PT-BR estruturado assim:\n1) Cabeçalho (disciplina, ano/série, duração, professor)\n2) Tema e justificativa\n3) Objetivos geral e específicos alinhados à BNCC (com códigos de habilidade)\n4) Conteúdos (conceituais, procedimentais, atitudinais)\n5) Metodologia passo a passo com tempo por etapa\n6) Recursos didáticos (materiais, tecnologia)\n7) Avaliação (critérios, instrumentos, rubrica)\n8) Adaptações para inclusão (TEA, TDAH, deficiência visual/auditiva)\n9) Referências\n\nPergunte antes: disciplina, ano/série e tema.`, },

  { id: 'edu-prova-gabarito', cat: 'edu', icon: '📝', name: 'Prova + Gabarito',
    desc: 'Prova com múltipla escolha, dissertativas e gabarito comentado.',
    prompt: `Gere uma prova completa em PT-BR:\n- 10 questões de múltipla escolha (5 alternativas, apenas 1 correta, distratores plausíveis)\n- 3 questões dissertativas com espaço para resposta\n- 2 questões contextualizadas (texto/imagem/situação-problema)\n- Distribuição por nível: 40% fácil, 40% médio, 20% difícil\n- Gabarito ao final com resposta correta E comentário pedagógico explicando o porquê\n- Rubrica de correção para as dissertativas (0-10 com critérios)\n\nPergunte: disciplina, ano, tema, duração e valor total da prova.`, },

  { id: 'edu-slides', cat: 'edu', icon: '🖥', name: 'Slides de Aula',
    desc: 'Apresentação didática com abertura, desenvolvimento, atividades e fechamento.',
    prompt: `Crie roteiro de apresentação de slides para aula (12-18 slides) em PT-BR:\n- Slide 1: capa (tema, professor, turma)\n- Slide 2: objetivos de aprendizagem\n- Slide 3: agenda\n- Slides 4-12: conteúdo com um conceito por slide (título + 3-5 bullets curtos + sugestão de imagem/analogia)\n- Slide de atividade prática/quiz no meio\n- Slide de estudo de caso ou exemplo real\n- Slide de resumo e mapa mental\n- Slide de tarefa/dever de casa\n- Slide final: dúvidas + referências\n\nPara cada slide, dê também a fala do professor (2-4 linhas) e uma pergunta para engajar a turma.`, },

  { id: 'edu-atividades', cat: 'edu', icon: '✏️', name: 'Lista de Atividades',
    desc: 'Exercícios progressivos com gabarito.',
    prompt: `Monte uma lista de exercícios em PT-BR com 15 questões em progressão (fácil → difícil):\n- 5 questões de fixação (conceito puro)\n- 5 questões de aplicação (situação-problema)\n- 5 questões de aprofundamento (interdisciplinar/desafio)\n- Enunciados claros, contextualizados com o cotidiano do aluno\n- Gabarito completo com resolução comentada passo a passo\n- Dica em 3 questões para o aluno que travar\n\nPergunte: disciplina, ano/série e conteúdo específico.`, },

  { id: 'edu-projeto-abp', cat: 'edu', icon: '🧪', name: 'Projeto (ABP)',
    desc: 'Projeto interdisciplinar por etapas com entregáveis.',
    prompt: `Elabore um projeto ABP (Aprendizagem Baseada em Projetos) em PT-BR:\n- Pergunta essencial motivadora\n- Produto final tangível (o que o aluno vai entregar)\n- Duração total e etapas semanais\n- Competências e habilidades BNCC envolvidas (multidisciplinar)\n- Papéis dentro do grupo\n- Cronograma detalhado por semana\n- Rubrica de avaliação (conteúdo, colaboração, criatividade, apresentação)\n- Momentos de feedback e autoavaliação\n- Sugestões de ferramentas digitais (Canva, Padlet, Genially)\n\nPergunte: tema/problema, ano/série e disciplinas envolvidas.`, },

  { id: 'edu-explicar-facil', cat: 'edu', icon: '💡', name: 'Explicar Fácil (Analogias)',
    desc: 'Explica um conceito difícil com analogias do dia a dia.',
    prompt: `Explique um conceito complexo em PT-BR para um estudante do [ANO], como se ele nunca tivesse ouvido falar:\n- Comece com uma analogia do cotidiano (algo que ele conhece)\n- Depois a definição formal simples\n- 2 exemplos práticos progressivos\n- Erro comum que os alunos cometem e como evitar\n- Mini-quiz de 3 perguntas com resposta\n- Frase-resumo para decorar\n\nPergunte antes o conceito e o ano/série.`, },

  { id: 'edu-relatorio-aluno', cat: 'edu', icon: '📊', name: 'Relatório de Aluno',
    desc: 'Parecer descritivo pedagógico bem redigido.',
    prompt: `Escreva um parecer descritivo (relatório pedagógico) em PT-BR profissional, respeitoso e construtivo:\n- Aspectos cognitivos (leitura, escrita, raciocínio lógico, atenção)\n- Aspectos socioemocionais (relacionamento, autonomia, responsabilidade)\n- Progressos observados no bimestre\n- Dificuldades e estratégias já aplicadas\n- Sugestões para a família apoiar em casa\n- Fechamento otimista\n\nEvite rótulos negativos; use linguagem pedagógica. Pergunte antes: nome do aluno, ano/série, e 3-5 observações-chave que o professor tem sobre ele.`, },

  { id: 'edu-gestao-sala', cat: 'edu', icon: '🧑‍🏫', name: 'Gestão de Sala',
    desc: 'Rotinas, combinados e técnicas para turmas difíceis.',
    prompt: `Monte um pacote de estratégias de gestão de sala de aula em PT-BR para [ANO/SÉRIE]:\n- 10 combinados iniciais (linguagem positiva, no que fazer e não no que não fazer)\n- Rotina de entrada, transição entre atividades e saída\n- 5 técnicas para chamar atenção sem gritar\n- Como lidar com aluno disruptivo (passo a passo em 4 níveis)\n- Sistema de reforço positivo (fichas, elogio específico, quadro de conquistas)\n- Comunicação com a família (modelo de bilhete, quando ligar)\n- Autocuidado do professor (checklist semanal)\n\nPergunte antes: ano/série e principais desafios da turma.`, },
];


export function buildSkillPrompt(skill) {
  return skill.prompt;
}
