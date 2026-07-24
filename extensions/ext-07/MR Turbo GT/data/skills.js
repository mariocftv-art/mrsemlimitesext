// MR Turbo GT — 50 Skills profissionais
// Cada skill injeta um prompt profissional no chat #message.

export const SKILL_CATEGORIES = [
  { id: 'all',     name: 'Todas',      icon: '✨' },
  { id: 'build',   name: 'Construir',  icon: '🚀' },
  { id: 'ui',      name: 'UI/Design',  icon: '🎨' },
  { id: 'backend', name: 'Backend',    icon: '🗄' },
  { id: 'growth',  name: 'Growth',     icon: '📈' },
  { id: 'fix',     name: 'Consertar',  icon: '🛠' },
  { id: 'content', name: 'Conteúdo',   icon: '✍️' },
  { id: 'auto',    name: 'Automação',  icon: '⚡' },
  { id: 'ai',      name: 'IA/Agents',  icon: '🤖' },
  { id: 'edu',     name: 'Aulas/Professores', icon: '🎓' },
  { id: 'iptv',    name: 'IPTV / P2P',        icon: '📺' },
];

const s = (id, cat, icon, name, desc, prompt) => ({ id, cat, icon, name, desc, prompt });

export const SKILLS = [
  // ================== BUILD (7) ==================
  s('landing-premium','build','🚀','Landing Page Premium','Landing moderna completa (hero, features, prova social, preço, FAQ, CTA).',
`Crie uma landing page premium moderna com design elegante e futurista.\n\nEstrutura:\n1) Hero cinematográfico (headline forte, subheadline, CTA, visual)\n2) Logos de prova social\n3) 3-6 features com ícones lucide-react\n4) Como funciona em 3 passos\n5) Depoimentos com foto/nome/cargo\n6) Preços 3 planos (meio destacado)\n7) FAQ accordion (6+ perguntas)\n8) CTA final + Footer completo\n\nTokens semânticos, animações sutis, mobile-first. SEO: title, meta, H1 único.`),
  s('saas-dashboard','build','💼','SaaS Dashboard','Sidebar, KPIs, gráficos Recharts, tabela e ações rápidas.',
`Dashboard SaaS profissional: sidebar colapsável (Overview/Analytics/Customers/Billing/Settings), topbar (busca, notificações, avatar), 4 KPI cards com sparkline, gráficos line+bar (Recharts), tabela com filtros e paginação, skeleton loaders, estado vazio. shadcn/ui + tokens semânticos, responsivo.`),
  s('ecommerce','build','🛒','E-commerce Completo','Loja com catálogo, carrinho, checkout e área do cliente.',
`E-commerce completo: home (hero + categorias + destaques), listagem com filtros, PDP (galeria, variações, avaliações), carrinho lateral com cupom, checkout em passos, área do cliente (pedidos/endereços/favoritos). Tabelas com RLS: produtos, categorias, pedidos, itens_pedido, endereços. Preços em centavos. Design premium mobile-first.`),
  s('blog-cms','build','📝','Blog / CMS','Editor rich text, categorias, tags e SEO por post.',
`Blog CMS: listagem pública paginada com filtro por categoria/tag, PDP do post (título, capa, autor, tempo de leitura, markdown), admin protegido para CRUD com preview, SEO por post (title/description/og:image/canonical/JSON-LD Article), busca full-text. Tabelas com RLS: posts (leitura pública se publicado), categorias, tags, autores.`),
  s('booking','build','📅','Sistema de Agendamento','Calendly-like: calendário, horários, confirmação.',
`Agendamento estilo Calendly: seleção de serviço, calendário mensal, horários do dia, formulário do cliente, confirmação por email, admin com reservas/filtros/status, bloqueio de conflitos e horários passados, fuso do usuário. Tabelas RLS: services, availability_rules, bookings.`),
  s('crm','build','📇','CRM Simples','Contatos, pipeline, atividades, notas.',
`CRM enxuto: tabela de contatos (nome/email/telefone/empresa/tags), pipeline Kanban (Lead → Contato → Proposta → Fechado), atividades (call/email/nota) com timeline por contato, filtros e busca, importação CSV, exportação, permissões por owner. RLS por user_id. Design moderno com shadcn.`),
  s('directory','build','📚','Diretório / Marketplace','Listagem com busca, filtros, mapa e páginas de item.',
`Diretório tipo marketplace: home com destaques + categorias, listagem com busca full-text e filtros (categoria, preço, localização), página do item (fotos, descrição, contato), submissão pública com moderação, painel admin, mapa (opcional). Tabelas RLS: items, categories, submissions.`),

  // ================== UI (6) ==================
  s('hero','ui','🌠','Hero Cinemática','Hero impactante com headline, sub, 2 CTAs e visual.',
`Hero cinematográfico: headline em 2 linhas com hierarquia forte, subheadline curta com valor, 2 CTAs (primário + fantasma), visual à direita ou fundo com gradiente/blur animado, badges de confiança, animações fade-in/slide-up staggered, responsivo. Tokens semânticos apenas.`),
  s('pricing','ui','💰','Tabela de Preços','3 planos com toggle mensal/anual e destaque no popular.',
`Tabela de preços: toggle mensal/anual (desconto anual visível), 3 planos (Starter/Pro/Enterprise), plano do meio destacado com badge "Mais popular", features com check, comparação expandível abaixo, responsivo. Tokens semânticos.`),
  s('testimonials','ui','💬','Depoimentos','Grid/carrossel com foto, nome, cargo e estrelas.',
`Seção depoimentos premium: grid 3x1 desktop e 1x em mobile, aspas grandes, avatar/nome/cargo, 5 estrelas, carrossel opcional com autoplay. Prova social acima. Tokens e animações on scroll.`),
  s('faq','ui','❓','FAQ Accordion','FAQ acessível com 8+ perguntas.',
`FAQ com Accordion shadcn (8+ perguntas relevantes), título + subtítulo, CTA final "Não achou sua resposta? Fale conosco". Animação suave. Tokens semânticos.`),
  s('design-system','ui','🎨','Design System Setup','Tokens semânticos ricos (cor, gradiente, sombra, radius).',
`Configure design system em src/styles.css: palette oklch (--background, --foreground, --primary(+glow), --secondary, --muted, --accent, --border, --ring), tokens extras (--gradient-primary, --gradient-hero, --shadow-elegant, --shadow-glow), dark/light, radius/spacing/transições consistentes. Atualize variantes de shadcn para consumir os tokens. Nada de cor hardcoded.`),
  s('pwa','ui','📱','PWA Mobile-First','Transforma app em PWA instalável.',
`PWA mobile-first: manifest.json (nome, ícones 192/512, theme/background color, display standalone), service worker com cache básico, meta viewport correta, prompt "Adicionar à tela inicial", bottom nav se fizer sentido, splash. Manter responsividade desktop.`),

  // ================== BACKEND (6) ==================
  s('auth','backend','🔐','Auth Completo','Login/Signup email+senha, Google, rotas protegidas.',
`Auth completo com Lovable Cloud: /auth com tabs Login/Signup, email+senha, botão Google, /reset-password, trigger criando public.profiles no signup, rotas protegidas em _authenticated/*, logout no header, redirect pós-login. Nunca guarde roles em profiles — use user_roles + has_role() security definer.`),
  s('stripe','backend','💳','Pagamentos Stripe','Checkout + webhook + status de assinatura.',
`Integração Stripe: botão Assinar cria Checkout Session (server function), webhook em src/routes/api/public/stripe-webhook.ts verificando assinatura, tabela subscriptions (user_id, stripe_customer_id, status, plan, current_period_end) com RLS, página /billing (plano atual, Portal Stripe, próximo pagamento), guards por plano. Secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET.`),
  s('db-schema','backend','🗄','Schema de Banco','Tabelas com RLS, GRANTs e índices.',
`Modele banco Lovable Cloud. Regras: todo CREATE TABLE public.* seguido de GRANT (SELECT/INSERT/UPDATE/DELETE) para authenticated e ALL para service_role, ENABLE ROW LEVEL SECURITY, policies por operação (não FOR ALL), roles em user_roles + has_role() security definer, FKs com ON DELETE apropriado, índices em WHERE/JOIN, timestamps + trigger de updated_at. Pergunte o domínio antes.`),
  s('rls-fix','backend','🔒','Corrigir RLS','Auditar e corrigir políticas de segurança.',
`Audite RLS de todas as tabelas em public. Liste: RLS ligado? policies (nome, op, roles, USING/WITH CHECK), GRANTs. Aponte problemas (RLS off, FOR ALL sem WITH CHECK, referência circular, GRANTs faltando, escopo por profile) e proponha migration corrigindo tudo com has_role() security definer.`),
  s('email-flow','backend','📧','E-mail Transacional','Resend: boas-vindas, reset, notificações.',
`E-mails via Resend: adicione RESEND_API_KEY (secret), server function sendEmail(to, subject, html), templates HTML (boas-vindas, reset, confirmação), dispare no signup/reset/checkout, log em email_logs com RLS (só admin lê).`),
  s('files-upload','backend','📎','Upload de Arquivos','Storage privado com URLs assinadas.',
`Upload de arquivos: bucket privado, RLS no bucket por owner, server function que retorna signed URL para upload/download, componente com dropzone + preview + progresso, validação de tipo/tamanho no client e no server, chave file_path em tabela files (owner_id, size, mime, created_at).`),

  // ================== GROWTH (4) ==================
  s('seo','growth','🔍','SEO Completo','Título, meta, OG, sitemap, robots e JSON-LD.',
`SEO total: cada rota com head() (title <60c com keyword, description <160c, og:*, twitter:card), H1 único e semântico, alt em imagens, JSON-LD (Organization, WebSite, Article/Product), sitemap.xml + robots.txt, canonical, lazy-loading, viewport correto. Nada de "Lovable App".`),
  s('analytics','growth','📊','Analytics + Eventos','Instrumenta eventos-chave.',
`Adicione PostHog/similar (chave VITE_). Track: page_view, sign_up, log_in, subscribe_click, purchase_completed, cta_click{cta_id}. Identifique usuário pós-login. Dashboard interno com MRR, signups da semana, top páginas via server function. Não envie PII sensível.`),
  s('i18n','growth','🌍','Multi-idioma (i18n)','PT/EN/ES com detecção automática.',
`react-i18next com pt/en/es, extrair strings visíveis, seletor no header com bandeira, detecção do browser + persistência, hreflang e locale nas OG. PT como default.`),
  s('cta-optimize','growth','🎯','Otimizar CTAs','Reforma textos e visual para conversão.',
`Audite CTAs: verbo de ação + benefício ("Começar grátis"), alto contraste, tamanho/padding generosos em mobile, micro-hover (scale/glow), hierarquia primário vs secundário, prova social próxima. Aplique com tokens semânticos.`),

  // ================== FIX (4) ==================
  s('bug-fix','fix','🐛','Consertar Bug','Diagnóstico + causa raiz + patch + validação.',
`Antes de escrever código: 1) diga a investigação (logs, network, arquivos), 2) aponte causa raiz (não sintoma), 3) enumere onde mais o padrão falha (rotas irmãs, políticas, fetchers), 4) proponha patch, 5) valide (build/console/teste).\n\nBug: [DESCREVA — o que acontece, o esperado e a mensagem]`),
  s('perf','fix','⚡','Otimizar Performance','LCP, bundle e re-renders.',
`Otimizar performance: medir LCP/CLS/INP por rota, corrigir imagens grandes (formato/tamanho/loading=lazy), evitar re-renders (memo/useMemo/useCallback), code-split rotas com lazy(), reduzir bundle (libs duplicadas, alternativas menores), Suspense + skeletons. Relatório antes/depois.`),
  s('refactor','fix','♻️','Refatorar Código','Quebra arquivos grandes e melhora legibilidade.',
`Refatorar mantendo comportamento: quebrar arquivos +300 linhas em componentes/hooks focados, extrair util/hooks compartilhados, tipos claros (sem any), nomes expressivos, remover código morto/imports não usados, consolidar estilos em tokens. Antes de mudar, mostrar plano.`),
  s('a11y','fix','♿','Acessibilidade (a11y)','Contraste, foco, labels e ARIA.',
`Auditoria a11y: labels em todos inputs, aria-label em botões só-ícone, contraste 4.5:1, foco visível no teclado, ordem lógica de tabulação, landmarks (header/main/footer/nav), alt significativo, modais com trap de foco e Escape. Corrigir tudo mantendo design.`),

  // ================== CONTENT (4) ==================
  s('copy','content','✍️','Copy Persuasivo','Reescreve textos com foco em conversão.',
`Reescreva textos com foco em conversão: headline (promessa + benefício + diferencial ≤12 palavras), subheadline (quem é, o que resolve, para quem ≤20 palavras), features (benefício antes de característica), CTAs (verbo + resultado), depoimentos específicos, FAQ com perguntas reais. PT-BR, tom [profissional/próximo/técnico/luxo]. Mantenha HTML.`),
  s('about','content','🏛','Página Sobre','Missão, história, time e valores.',
`Página /sobre premium: hero com foto/ilustração + manifesto, história em timeline visual, missão/visão/valores em 3 cards, time com fotos e mini bios, métricas de impacto, CTA final. Tokens do site.`),
  s('legal','content','📜','Termos + Privacidade (LGPD)','Páginas legais PT-BR.',
`Crie /termos e /privacidade em PT-BR alinhadas com LGPD (aceitação, cadastro, pagamentos, PI, limitação, rescisão, foro / dados, base legal, uso, compartilhamento, direitos, cookies, DPO). Sumário lateral, data de atualização. Peça antes: empresa, CNPJ, site, email de contato.`),
  s('social-content','content','📱','Kit de Redes Sociais','Legendas + roteiros para posts e reels.',
`Kit para redes: 5 legendas Instagram (hook + corpo + CTA + hashtags), 3 roteiros de Reels 30-60s cena a cena (visual+texto+narração), 3 posts LinkedIn (storytelling), 3 threads X/Twitter. PT-BR, tom [ESCOLHA]. Pergunte o nicho se não estiver claro.`),

  // ================== AUTOMAÇÃO / N8N / WHATSAPP (11) ==================
  s('n8n-setup','auto','⚙️','n8n Setup Completo','Sobe n8n auto-hospedado com Postgres e HTTPS.',
`Instruções passo-a-passo para subir n8n em produção: docker-compose com n8n + Postgres + Caddy/Traefik (HTTPS auto), variáveis WEBHOOK_URL/N8N_ENCRYPTION_KEY/N8N_BASIC_AUTH_*, backup do Postgres, worker mode para escala, política de retries e timeouts. Boas práticas de segurança e observabilidade.`),
  s('n8n-whatsapp-atendimento','auto','💬','n8n — Atendimento WhatsApp 24/7','Fluxo WhatsApp Cloud API + IA + handoff humano.',
`Fluxo n8n de atendimento WhatsApp 24/7: webhook do WhatsApp Cloud API → node HTTP para OpenAI/Gemini/Claude com contexto por chat_id (buffer no Postgres/Supabase) → resposta para o WhatsApp. Detecção de intenção "falar com humano" → tag no CRM + notificação no Slack. Fila para mensagens fora do horário. Log completo em Supabase.`),
  s('n8n-leads-instagram','auto','📸','n8n — Leads Instagram → CRM','Captura comentários/DMs e cria leads.',
`Fluxo n8n: trigger Instagram Graph (webhook comments/mentions/DMs) → parse do texto → HTTP para API do CRM (HubSpot/Pipedrive/Supabase) criando lead com tag "instagram" → resposta automática por DM ("Recebemos, em breve retornamos") → notificação no e-mail/Slack do time comercial. Tratamento de duplicados por username.`),
  s('n8n-agendador','auto','📅','n8n — Agendador Google Calendar','Confirma, lembra e reagenda automaticamente.',
`Fluxo n8n: trigger Cron → busca eventos do dia no Google Calendar → envia lembrete 24h e 2h antes via WhatsApp/Email → cliente responde "1" (confirma), "2" (reagenda), "3" (cancela) → atualiza evento e envia link novo se reagendou. Log de todas as interações.`),
  s('n8n-relatorio-vendas','auto','📊','n8n — Relatório Diário de Vendas','Consolida vendas e envia por e-mail/WhatsApp.',
`Fluxo n8n Cron diário 08h: consultas SQL (Supabase/MySQL) para vendas do dia anterior (total, ticket médio, top produtos, top vendedores) → gera PDF/HTML com gráficos → envia por e-mail (Resend) para o dono e por WhatsApp para o gerente. Comparativo D-1 e D-7.`),
  s('n8n-erp-integracao','auto','🔌','n8n — Integração ERP ↔ E-commerce','Sincroniza produtos, estoque e pedidos.',
`Fluxo n8n bidirecional entre ERP (Bling/Tiny/Omie) e e-commerce (Shopify/WooCommerce): a cada 5 min, sincronizar produtos e estoque ERP → e-commerce; pedidos novos e-commerce → ERP com cliente/itens/pagamento; NF-e emitida no ERP → e-mail para o cliente com PDF. Idempotência via SKU/external_id.`),
  s('n8n-content-pipeline','auto','🎬','n8n — Pipeline de Conteúdo','Ideia → roteiro → imagem → post multi-plataforma.',
`Fluxo n8n: form no Notion/Airtable com ideia → OpenAI gera roteiro + legenda + hashtags → gera imagem (Gemini/Pollinations) → aprovação humana no Slack (botão) → publica simultâneo em Instagram (Graph API), Facebook, LinkedIn e X. Registra métricas em Sheets.`),
  s('whatsapp-cloud-api','auto','📲','WhatsApp Cloud API — Bot Direto','Envia/recebe mensagens sem Twilio.',
`Integre WhatsApp Cloud API (Meta): registro do número, geração do WHATSAPP_TOKEN + PHONE_NUMBER_ID (secrets), webhook em /api/public/wa-webhook.ts verificando hub.verify_token e assinatura, server function sendWhatsApp(to, template|text), tabela wa_messages com RLS. Suporte a templates aprovados, mídia e botões interativos.`),
  s('whatsapp-broadcast','auto','📢','WhatsApp — Broadcast por Template','Disparo em massa com opt-in e taxa controlada.',
`Sistema de broadcast WhatsApp: cadastro de contatos com opt-in explícito (LGPD), lista segmentada por tags, escolha de template aprovado, disparo com rate-limit (ex.: 20/s), fila com retries e status por mensagem (queued/sent/delivered/read/failed). Painel com KPIs e opt-out automático via keyword "SAIR".`),
  s('whatsapp-orcamento','auto','💵','WhatsApp — Orçamento Automático','Cliente pede orçamento, bot responde na hora.',
`Bot WhatsApp para orçamento: cliente escolhe categoria e itens via lista interativa → bot calcula (tabela de preços no Supabase) → envia orçamento em texto + PDF → botão "Fechar pedido" gera link de pagamento Stripe → notifica atendente e cria pedido no sistema. Log completo.`),
  s('zapier-alternative','auto','🔁','Automação Multi-app (sem code)','Conecta apps quando não puder usar n8n.',
`Quando o cliente não tem servidor: implementar automações usando Make/Zapier equivalentes internas. Mapeie triggers (novo lead, novo pedido, novo evento) e ações (email, WhatsApp, CRM, planilha). Documente cada cenário com passos, campos e testes. Inclua backoff em falhas.`),

  // ================== IA / AGENTES (8) ==================
  s('ai-chatbot','ai','🤖','AI Chatbot com Streaming','Chat com streaming, histórico e UI polida.',
`Chatbot AI com AI SDK + Lovable AI Gateway: bolhas assistant/user, streaming em tempo real, threads persistidas, Enter envia + Shift+Enter nova linha, shimmer "Pensando…", tratamento de 429/402. Modelo padrão google/gemini-3.6-flash. Server route em src/routes/api/chat.ts com streamText + toUIMessageStreamResponse. UI com AI Elements.`),
  s('ai-rag','ai','📚','RAG sobre seus documentos','Upload → embeddings → busca semântica → resposta.',
`RAG completo: upload PDF/DOCX/TXT no Storage privado → server function extrai texto → chunk 800/overlap 100 → embeddings openai/text-embedding-3-small → tabela documents_chunks com pgvector → busca por similaridade top-k → prompt ao LLM com contexto → resposta com citações. Painel de conversas e reindex.`),
  s('ai-agent-atendimento','ai','🧑‍💼','Agente de Atendimento','Agent com tools (buscar pedido, abrir ticket).',
`Agente de atendimento com tool-use: tools findOrder(id), openTicket(assunto,desc), refundOrder(id) implementadas como server functions com RLS por usuário. LLM decide qual tool chamar. Log de cada chamada (tool_calls table). UI de chat com badges de ferramenta usada.`),
  s('ai-image-gen','ai','🖼','Gerador de Imagens IA','UI de geração com histórico e prompts salvos.',
`App de imagens IA: input do prompt + presets de estilo → chama Lovable AI Gateway (google/gemini-3-pro-image) com fallback para Pollinations em 402/429 → galeria com metadata (prompt, seed, modelo) por usuário, favoritos, download, "prompts salvos". Storage privado por owner.`),
  s('ai-video-summary','ai','🎞','Resumo de Vídeos com IA','Upload/URL → transcrição → resumo estruturado.',
`Fluxo: URL do YouTube ou upload → server function baixa áudio → openai/whisper transcreve → LLM gera resumo, tópicos, timestamps clicáveis e Q&A. Salva em Storage/DB. UI com player + transcrição em coluna e resumo destacável.`),
  s('ai-lead-qualifier','ai','🎯','Qualificador de Leads (BANT)','LLM pontua leads e sugere próximo passo.',
`Ao criar lead, um server function envia dados (empresa, cargo, necessidade, orçamento, prazo) ao LLM que retorna JSON: score 0-100, tags, próxima ação, e-mail sugerido. Grava em leads.score + leads.suggested_action. Notifica SDR quando score ≥ 80.`),
  s('ai-code-review','ai','👨‍💻','Code Review Automático','LLM comenta PRs e aponta risco.',
`Server function recebe diff (GitHub webhook em /api/public/gh-webhook.ts), envia ao LLM com um system prompt sênior (segurança, performance, RLS, tipos), e posta comentário resumido no PR via API do GitHub. Ignora arquivos gerados/lockfiles. Marca commits com status.`),
  s('ai-voice-tts','ai','🎙','Voz do Site (TTS)','Botão "Ouvir" em qualquer texto do app.',
`Componente <ReadAloud text=... /> que chama server function TTS (openai gpt-4o-mini-tts, voz configurável), retorna MP3 base64, tocado no <audio>. Cache por hash do texto+voz. Ícone de play/pause com animação sutil. Sem depender do Web Speech do browser.`),

  // ================== AULAS / PROFESSORES (8) ==================
  s('edu-plano-aula','edu','📘','Plano de Aula Completo','Objetivos, BNCC, metodologia, avaliação e recursos.',
`Crie um plano de aula profissional em PT-BR estruturado assim:\n1) Cabeçalho (disciplina, ano/série, duração, professor)\n2) Tema e justificativa\n3) Objetivos geral e específicos alinhados à BNCC (com códigos de habilidade)\n4) Conteúdos (conceituais, procedimentais, atitudinais)\n5) Metodologia passo a passo com tempo por etapa\n6) Recursos didáticos (materiais, tecnologia)\n7) Avaliação (critérios, instrumentos, rubrica)\n8) Adaptações para inclusão (TEA, TDAH, deficiência visual/auditiva)\n9) Referências\n\nPergunte antes: disciplina, ano/série e tema.`),
  s('edu-prova-gabarito','edu','📝','Prova + Gabarito','Prova com múltipla escolha, dissertativas e gabarito comentado.',
`Gere uma prova completa em PT-BR:\n- 10 questões de múltipla escolha (5 alternativas, apenas 1 correta, distratores plausíveis)\n- 3 questões dissertativas com espaço para resposta\n- 2 questões contextualizadas (texto/imagem/situação-problema)\n- Distribuição por nível: 40% fácil, 40% médio, 20% difícil\n- Gabarito ao final com resposta correta E comentário pedagógico explicando o porquê\n- Rubrica de correção para as dissertativas (0-10 com critérios)\n\nPergunte: disciplina, ano, tema, duração e valor total da prova.`),
  s('edu-slides','edu','🖥','Slides de Aula','Apresentação didática com abertura, desenvolvimento, atividades e fechamento.',
`Crie roteiro de apresentação de slides para aula (12-18 slides) em PT-BR:\n- Slide 1: capa (tema, professor, turma)\n- Slide 2: objetivos de aprendizagem\n- Slide 3: agenda\n- Slides 4-12: conteúdo com um conceito por slide (título + 3-5 bullets curtos + sugestão de imagem/analogia)\n- Slide de atividade prática/quiz no meio\n- Slide de estudo de caso ou exemplo real\n- Slide de resumo e mapa mental\n- Slide de tarefa/dever de casa\n- Slide final: dúvidas + referências\n\nPara cada slide, dê também a fala do professor (2-4 linhas) e uma pergunta para engajar a turma.`),
  s('edu-atividades','edu','✏️','Lista de Atividades','Exercícios progressivos com gabarito.',
`Monte uma lista de exercícios em PT-BR com 15 questões em progressão (fácil → difícil):\n- 5 questões de fixação (conceito puro)\n- 5 questões de aplicação (situação-problema)\n- 5 questões de aprofundamento (interdisciplinar/desafio)\n- Enunciados claros, contextualizados com o cotidiano do aluno\n- Gabarito completo com resolução comentada passo a passo\n- Dica em 3 questões para o aluno que travar\n\nPergunte: disciplina, ano/série e conteúdo específico.`),
  s('edu-projeto-abp','edu','🧪','Projeto (Aprendizagem por Projetos)','Projeto interdisciplinar por etapas com entregáveis.',
`Elabore um projeto ABP (Aprendizagem Baseada em Projetos) em PT-BR:\n- Pergunta essencial motivadora\n- Produto final tangível (o que o aluno vai entregar)\n- Duração total e etapas semanais\n- Competências e habilidades BNCC envolvidas (multidisciplinar)\n- Papéis dentro do grupo\n- Cronograma detalhado por semana\n- Rubrica de avaliação (conteúdo, colaboração, criatividade, apresentação)\n- Momentos de feedback e autoavaliação\n- Sugestões de ferramentas digitais (Canva, Padlet, Genially)\n\nPergunte: tema/problema, ano/série e disciplinas envolvidas.`),
  s('edu-explicar-facil','edu','💡','Explicar Fácil (Analogias)','Explica um conceito difícil com analogias do dia a dia.',
`Explique um conceito complexo em PT-BR para um estudante do [ANO], como se ele nunca tivesse ouvido falar:\n- Comece com uma analogia do cotidiano (algo que ele conhece)\n- Depois a definição formal simples\n- 2 exemplos práticos progressivos\n- Erro comum que os alunos cometem e como evitar\n- Mini-quiz de 3 perguntas com resposta\n- Frase-resumo para decorar\n\nPergunte antes o conceito e o ano/série.`),
  s('edu-relatorio-aluno','edu','📊','Relatório de Aluno','Parecer descritivo pedagógico bem redigido.',
`Escreva um parecer descritivo (relatório pedagógico) em PT-BR profissional, respeitoso e construtivo:\n- Aspectos cognitivos (leitura, escrita, raciocínio lógico, atenção)\n- Aspectos socioemocionais (relacionamento, autonomia, responsabilidade)\n- Progressos observados no bimestre\n- Dificuldades e estratégias já aplicadas\n- Sugestões para a família apoiar em casa\n- Fechamento otimista\n\nEvite rótulos negativos; use linguagem pedagógica. Pergunte antes: nome do aluno, ano/série, e 3-5 observações-chave que o professor tem sobre ele.`),
  s('edu-gestao-sala','edu','🧑‍🏫','Estratégias de Gestão de Sala','Rotinas, combinados e técnicas para turmas difíceis.',
`Monte um pacote de estratégias de gestão de sala de aula em PT-BR para [ANO/SÉRIE]:\n- 10 combinados iniciais (linguagem positiva, no que fazer e não no que não fazer)\n- Rotina de entrada, transição entre atividades e saída\n- 5 técnicas para chamar atenção sem gritar\n- Como lidar com aluno disruptivo (passo a passo em 4 níveis)\n- Sistema de reforço positivo (fichas, elogio específico, quadro de conquistas)\n- Comunicação com a família (modelo de bilhete, quando ligar)\n- Autocuidado do professor (checklist semanal)\n\nPergunte antes: ano/série e principais desafios da turma.`),
];

  // ================== IPTV / P2P (6) ==================
  s('iptv-painel-revenda','iptv','📺','Painel IPTV Revenda Completo','Painel administrativo pronto para revenda com M3U, Xtream, EPG e clientes.',
`Construa um PAINEL ADMINISTRATIVO DE IPTV COMPLETO pronto para revenda, em PT-BR, com design premium (dark + acentos dourados/neon), 100% responsivo:

MÓDULOS OBRIGATÓRIOS:
1) Dashboard: KPIs (clientes ativos, expirando 7d, receita MRR, créditos, canais online, servidores). Gráficos Recharts (assinaturas por mês, top revendedores, uso por servidor).
2) Clientes: CRUD com nome, email, telefone, plano, data ativação, expiração, status (ativo/vencido/bloqueado), device count, notas. Renovação em 1 clique, extensão de teste, bloqueio/desbloqueio, log de conexões.
3) Revendedores: hierarquia master → sub-revenda, saldo de créditos, comissão %, transferência de créditos entre níveis, extrato.
4) Planos: nome, duração (dias), conexões simultâneas, preço, adulto on/off, categorias liberadas.
5) Servidores/Linhas: cadastro de servidores Xtream/M3U upstream (host, porta, user, pass), balanceamento, status online, latência, contagem de clientes.
6) Catálogo: canais ao vivo, filmes VOD, séries — importação por M3U, Xtream Codes API, playlists remotas com refresh automático (cron). EPG XMLTV (URL + agendador), logos.
7) Aplicativos: gerenciamento de códigos ativação IBO Player / Smarters / Duplecast / IPTV Smarters Pro / TiviMate / OTT Navigator / Absolute — com QR Code e link "adicionar 1 clique".
8) Financeiro: cobranças (Pix/cartão), assinaturas recorrentes, cupons, gateway (Stripe/Mercado Pago/Asaas), inadimplência, notas.
9) Suporte: tickets, WhatsApp direto, avisos em massa (banner + notificação push), FAQ.
10) Configurações: branding (logo, cores, domínio), SMTP, integrações, chaves API, políticas.

SCHEMA (Supabase RLS): profiles, resellers, clients, plans, subscriptions, servers, playlists, channels, movies, series, epg_sources, applications, activation_codes, invoices, payments, tickets, audit_logs. Roles: super_admin, master_reseller, reseller, support, client.

DEPENDÊNCIAS: recharts, @tanstack/react-table, react-hook-form + zod, sonner, date-fns, qrcode.react.

Comece pelo Dashboard + Clientes + Planos + Servidores. Use tokens semânticos, sem cor hardcoded.`),

  s('iptv-m3u-xtream','iptv','🎛','Importador M3U + Xtream Codes','Importa playlists M3U, EPG XMLTV e sincroniza via Xtream Codes API.',
`Implemente o SUBSISTEMA DE IMPORTAÇÃO/SINCRONIZAÇÃO para o painel IPTV:

1) Importador M3U (arquivo ou URL) com parser tolerante de #EXTINF, #EXTGRP, tvg-id, tvg-name, tvg-logo, group-title, catchup. Suporta HLS (m3u8), MPEG-TS (ts), HTTPS/HTTP. Progresso em tempo real.
2) Xtream Codes API client: player_api.php (get_live_streams, get_vod_streams, get_series, get_live_categories, get_vod_categories, get_series_categories, get_live_epg, xmltv.php). Autenticação via host+user+pass, teste de conexão, expiração da linha.
3) EPG XMLTV: importador de URL (gz suportado), matching por tvg-id/tvg-name, agenda de refresh (cron 6h).
4) Deduplicação de canais, matching automático de logos (fallback: Iptv-org logos public repo por tvg-id), agrupamento por categoria.
5) Cron: refresh de playlists conforme intervalo por fonte, alerta se cair.
6) UI: página "Fontes" (M3U/Xtream/EPG), botão "Sincronizar agora", log de última importação (adicionados/atualizados/removidos), preview do stream (hls.js).

Server functions (TanStack Start) para os fetch pesados; nunca expor credenciais Xtream ao browser. Salve em servers, playlists, channels, epg_sources.`),

  s('iptv-p2p-cdn','iptv','🛰','P2P Streaming (WebRTC + HLS)','Distribui streams via P2P reduzindo carga do servidor.',
`Implemente distribuição P2P dos streams do painel IPTV para reduzir banda do servidor:

1) Player web hls.js + biblioteca P2P (P2P-Media-Loader-Hlsjs OU CDNBye/hlsjs-p2p) integrada. Tracker WebTorrent/WSS próprio ou público (wss://tracker.openwebtorrent.com).
2) Configuração por canal: on/off P2P, número máximo de peers, tamanho de segmento, TTL do cache.
3) Métricas em tempo real: % de tráfego servido por P2P vs HTTP, peers conectados, economia estimada de banda em GB/mês, latência média. Gráfico Recharts na dashboard.
4) Fallback automático 100% HTTP se P2P falhar.
5) Página "P2P" no admin: economia total, top canais por peers, health do tracker.
6) Segurança: token efêmero por sessão (JWT curto) na URL do manifesto, validação server-side (edge function), rate-limit por IP.

Documente que P2P só funciona em navegador (WebRTC); apps nativos continuam HTTP puro. Adicione instrução para whitelist do tracker no CSP.`),

  s('iptv-catchup-vod','iptv','🎬','Catch-up + VOD + Séries','Grava programação, biblioteca de filmes/séries com posters TMDB.',
`Implemente CATCH-UP e biblioteca VOD/SÉRIES no painel IPTV:

1) Catch-up: gravação dos últimos 3-7 dias por canal marcado, storage em bucket (Supabase Storage/R2), navegação por EPG "voltar no tempo", limpeza automática.
2) VOD: biblioteca de filmes com posters e metadados enriquecidos via TMDB API (título original, sinopse PT-BR, gêneros, elenco, ano, duração, IMDB rating, trailer YouTube). Cron para reprocessar novos VODs.
3) Séries: temporadas/episódios com continuar assistindo por cliente, próxima temporada auto-play.
4) Player: hls.js com legendas WebVTT, múltiplos áudios, controle de qualidade, tela cheia, PiP, mini-player.
5) UI cliente: Netflix-like (hero rotativo, linhas por categoria, minha lista, continuar assistindo, "porque você viu…").
6) Watchlist e histórico por cliente com RLS.

Peça a TMDB_API_KEY como secret (add_secret). Tabelas: movies, series, seasons, episodes, watch_history, watchlist.`),

  s('iptv-app-codes','iptv','📱','Códigos de Ativação de Apps','Gera códigos IBO/Smarters/Duplecast com QR e ativação 1 clique.',
`Implemente MÓDULO DE APLICATIVOS/CÓDIGOS DE ATIVAÇÃO para o painel IPTV:

Apps suportados (cadastro por app):
- IBO Player / IBO Pro
- IPTV Smarters Pro / Smarters Player Lite
- Duplecast
- TiviMate (M3U + EPG)
- OTT Navigator
- Absolute IPTV
- 9Xtream
- SparkleTV
- BOB Player
- XCIPTV

Funcionalidades:
1) Cadastro de MAC/Device ID + código de ativação por cliente/app.
2) Geração automática de credenciais Xtream (user/pass) por cliente com expiração.
3) URL de ativação profunda por app (deep link) + QR Code gerado (qrcode.react) + botão "Copiar M3U", "Copiar Xtream URL".
4) Envio automático por WhatsApp (link wa.me com mensagem pronta) e email (SMTP).
5) Limite de conexões simultâneas por plano com kickout do device antigo.
6) Renovação: mesmo código continua funcionando; só atualiza expiração no upstream.
7) Log de dispositivos: IP, User-Agent, país, última conexão.

Tabelas: applications, activation_codes, devices, device_sessions. Interface admin com filtros por app, status e cliente.`),

  s('iptv-cliente-portal','iptv','👤','Portal do Cliente + Área de Testes','Área do cliente para renovar, ver dados e criar teste grátis.',
`Implemente PORTAL PÚBLICO DO CLIENTE + LANDING DE VENDAS para o painel IPTV:

1) Landing pública (dark premium): hero com CTA "Teste grátis 6h", 3 planos com preço, lista de canais/filmes destacados, prova social (depoimentos), FAQ IPTV (legalidade, apps, dispositivos, requisitos de internet), rodapé com WhatsApp, políticas.
2) Cadastro teste grátis: nome + WhatsApp + email → cria cliente trial de 6h automaticamente, envia credenciais Xtream + link M3U + QR Code por email/WhatsApp. Anti-abuso: rate-limit por IP/telefone (turnstile).
3) Área logada do cliente: minhas assinaturas, expiração com contador, botão "Renovar" (checkout), dispositivos conectados (com kickout), suporte, tutoriais por app (vídeo YouTube + passo a passo).
4) Checkout: Pix (QR + copia-cola), cartão (Stripe/Mercado Pago), boleto opcional; ao confirmar pagamento, estende assinatura automaticamente no upstream via webhook.
5) Notificações: 5 dias antes de expirar, 1 dia antes, no dia (email + WhatsApp).
6) Multi-idioma (PT-BR default; EN e ES prontos para tradução).

Não prometa nem cite conteúdo pirata; foque em "seu provedor de streaming"/"IPTV licenciado". SEO otimizado (title, meta, JSON-LD Product).`),

export function buildSkillPrompt(skill) {
  return skill.prompt;
}
