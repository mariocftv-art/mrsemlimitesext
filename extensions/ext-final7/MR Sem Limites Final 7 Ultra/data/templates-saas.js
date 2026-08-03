// MR Sem Limites Reformulada 2.1 — Templates SaaS
// Cada template dispara um prompt estruturado para gerar um projeto COMPLETO.

export const TEMPLATES_SAAS = [
  { id:'tpl-condo',    name:'Condomínio Inteligente', category:'Gestão',      desc:'Sistema completo de gestão condominial.',       icon:'🏢' },
  { id:'tpl-crm',      name:'CRM',                     category:'Comercial',   desc:'CRM com pipeline, atividades e relatórios.',    icon:'🤝' },
  { id:'tpl-erp',      name:'ERP',                     category:'Gestão',      desc:'ERP modular (financeiro, estoque, RH).',        icon:'🧮' },
  { id:'tpl-clinica',  name:'Clínica',                 category:'Saúde',       desc:'Prontuário, agenda, prescrição, faturamento.',  icon:'🩺' },
  { id:'tpl-academia', name:'Academia',                category:'Fitness',     desc:'Alunos, treinos, planos, catraca, financeiro.', icon:'🏋️' },
  { id:'tpl-restaur',  name:'Restaurante',             category:'Food',        desc:'Comanda, mesas, cozinha (KDS), delivery.',      icon:'🍽' },
  { id:'tpl-hotel',    name:'Hotel',                   category:'Hospitalidade', desc:'Reservas, check-in/out, tarifas, PMS básico.',icon:'🏨' },
  { id:'tpl-market',   name:'Marketplace',             category:'E-commerce',  desc:'Multi-vendor com split, avaliações e chat.',    icon:'🛒' },
  { id:'tpl-seg',      name:'Segurança',               category:'Operações',   desc:'Rondas, ocorrências, câmeras, alarmes.',        icon:'🛡' },
  { id:'tpl-fin',      name:'Financeiro',              category:'Finanças',    desc:'Contas, DRE, fluxo de caixa, conciliação.',     icon:'💰' },
  { id:'tpl-imob',     name:'Imobiliária',             category:'Real Estate', desc:'Imóveis, leads, propostas, contratos.',         icon:'🏘' },
  { id:'tpl-log',      name:'Logística',               category:'Operações',   desc:'Rotas, motoristas, entregas, rastreio.',        icon:'🚚' },
];

const BASE = `Objetivo: construir um SaaS **completo** (frontend + backend + banco + auth) usando a stack padrão do Lovable.

Requisitos globais:
- Autenticação (email/senha + provedor social opcional), com perfil e logout.
- Sistema de roles em tabela separada (user_roles + has_role SECURITY DEFINER). NUNCA guardar role em profiles.
- Banco com RLS habilitada em todas as tabelas públicas e GRANTs explícitos no mesmo migration.
- Layout responsivo mobile-first, dark/light, design system semântico (nada de cores hardcoded).
- Dashboard inicial com KPIs, navegação por sidebar, breadcrumbs.
- CRUDs com validação Zod, loading/empty/error states, paginação e busca.
- Semântica de rotas separadas (nada de tudo na home com âncoras).
- SEO por rota (title < 60, description < 160, H1 único, og tags).
- Acessibilidade AA (labels, foco visível, teclado).
- Seed inicial idempotente com dados de demonstração.
- Não expor secrets. Webhooks/endpoints públicos com verificação de assinatura.`;

const RECIPES = {
  'tpl-condo': `Módulos: Unidades/Blocos, Moradores, Visitantes (com QR), Reservas de áreas comuns, Boletos/mensalidades, Ocorrências, Comunicados, Portaria (entrada/saída), Encomendas, Assembleias (atas), Painel síndico.`,
  'tpl-crm': `Módulos: Contatos, Empresas, Leads, Pipeline Kanban customizável, Atividades (call/email/task), Propostas, Funis, Relatórios de conversão, Integração e-mail, Automations simples.`,
  'tpl-erp': `Módulos: Financeiro (contas a pagar/receber, fluxo de caixa, DRE), Estoque (produtos, entradas/saídas, inventário), Compras/Fornecedores, Vendas/Clientes, NF (interface), RH básico (funcionários, folha simplificada), Relatórios.`,
  'tpl-clinica': `Módulos: Pacientes, Prontuário eletrônico, Agenda multi-profissional, Prescrição, Anamnese, Convênios, Faturamento TISS-like, Prescrição digital, Anexos (exames), LGPD (consentimento).`,
  'tpl-academia': `Módulos: Alunos, Planos/Contratos, Treinos (fichas), Avaliações físicas, Frequência (catraca simulada/QR), Financeiro (mensalidades), Professores/aulas, App do aluno (área logada).`,
  'tpl-restaur': `Módulos: Cardápio, Mesas/Comandas, PDV, KDS (cozinha), Delivery (pedidos + status), Estoque de insumos, Ficha técnica, Financeiro do dia, Relatórios de vendas.`,
  'tpl-hotel': `Módulos: Quartos/Tarifas, Reservas (calendário), Check-in/out, Hóspedes, Consumo (frigobar/serviços), Faturamento, Housekeeping, PMS básico, Dashboards de ocupação.`,
  'tpl-market': `Módulos: Multi-vendor (cadastro/onboarding), Catálogo, Carrinho, Checkout, Split de pagamento (interface), Pedidos por vendor, Chat comprador↔vendedor, Avaliações, Painel admin.`,
  'tpl-seg': `Módulos: Postos, Rondas (checkpoints via QR/NFC), Ocorrências (com fotos), Escalas, Equipamentos, Alarmes/câmeras (integração fake), Relatórios turno, Painel supervisor.`,
  'tpl-fin': `Módulos: Contas bancárias, Categorias, Lançamentos, Conciliação, Fluxo de caixa, DRE, Metas, Relatórios comparativos, Multi-empresa, Exportação CSV/PDF.`,
  'tpl-imob': `Módulos: Imóveis (mídia, mapa, tour), Captação, Leads/CRM leve, Visitas agendadas, Propostas, Contratos (locação/venda), Comissões, Portal público de busca.`,
  'tpl-log': `Módulos: Motoristas, Frota, Pedidos, Rotas (otimização básica), Coleta/Entrega, Rastreio em tempo real, Ocorrências, KPIs (SLA, ocupação), App do motorista.`,
};

export function buildTemplateSaaSPrompt(tpl) {
  return `Construir SaaS completo — **${tpl.name}** (${tpl.category}).

${RECIPES[tpl.id] || tpl.desc}

${BASE}

Entrega esperada:
1. Estrutura de rotas separadas por módulo (não hash-anchors).
2. Migrations SQL com CREATE TABLE + GRANTs + RLS + policies + índices.
3. Seed inicial idempotente.
4. Componentes reutilizáveis no design system.
5. README curto com como rodar e credenciais demo.

Comece perguntando: nome do produto, cor primária de marca e se quer landing pública antes do login.`;
}
