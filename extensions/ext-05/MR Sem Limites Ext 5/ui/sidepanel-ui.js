// MR Sem Limites Reformulada 2.1 — UI module (v3 UX/UI)
// Adiciona: Chat como aba inicial, persistência da última aba, novas galerias
// (Imagens IA, Vídeos IA, Templates SaaS), aba Favoritos agregada, botões
// rápidos Pro, toggle ON/OFF visual e disclaimer automático de imagem-referência.
// NÃO altera envio de mensagens, licença, autenticação, background ou backend.
// Ao clicar em "Usar", apenas copia o prompt no textarea #message; o usuário decide quando enviar.

import { ANIMATIONS, buildAnimationPrompt } from '../data/animations.js';
import { COMPONENTS, buildComponentPrompt } from '../data/components.js';
import { PROMPTS, buildPromptForChat } from '../data/prompts.js';
import { IMAGES_AI, buildImageAIPrompt } from '../data/images-ai.js';
import { VIDEOS_AI, buildVideoAIPrompt } from '../data/videos-ai.js';
import { TEMPLATES_SAAS, buildTemplateSaaSPrompt } from '../data/templates-saas.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const LS_FAV = 'mr21.favorites';         // legado: só ids de prompts
const LS_FAV_V2 = 'mr21.favoritesV2';    // novo: { prompt:[], anim:[], comp:[], img:[], vid:[], tpl:[] }
const LS_RECENTS = 'mr21.recents';
const LS_LAST_TAB = 'mr21.lastTab';
const LS_POWER = 'mr21.ext-enabled';

const DEFAULT_TAB = 'chat';

const REF_DISCLAIMER = `\n\n---\n[REFERÊNCIA VISUAL]\nA(s) imagem(ns) anexada(s) serve(m) APENAS como referência visual do layout desejado.\nNÃO gere uma nova imagem. NÃO recrie a imagem.\nConstrua o projeto real: crie código, componentes, páginas, dashboard, banco de dados e autenticação quando necessário, usando o design como referência.`;

const state = {
  favorites: JSON.parse(localStorage.getItem(LS_FAV) || '[]'),
  favoritesV2: loadFavoritesV2(),
  recents: JSON.parse(localStorage.getItem(LS_RECENTS) || '[]'),
  power: localStorage.getItem(LS_POWER) !== '0',
};

function loadFavoritesV2() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(LS_FAV_V2) || 'null'); } catch (_) {}
  const base = { prompt: [], anim: [], comp: [], img: [], vid: [], tpl: [] };
  if (raw && typeof raw === 'object') Object.assign(base, raw);
  // migração do legado (favoritos antigos = ids de prompts)
  if (!base.prompt.length) {
    try {
      const legacy = JSON.parse(localStorage.getItem(LS_FAV) || '[]');
      if (Array.isArray(legacy) && legacy.length) base.prompt = [...legacy];
    } catch (_) {}
  }
  return base;
}

function saveFav() { localStorage.setItem(LS_FAV, JSON.stringify(state.favorites)); }
function saveFavV2() { localStorage.setItem(LS_FAV_V2, JSON.stringify(state.favoritesV2)); }
function saveRecents() { localStorage.setItem(LS_RECENTS, JSON.stringify(state.recents.slice(0, 6))); }

function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}

function isFavV2(type, id) { return (state.favoritesV2[type] || []).includes(id); }
function toggleFavV2(type, id) {
  const list = state.favoritesV2[type] || (state.favoritesV2[type] = []);
  const idx = list.indexOf(id);
  if (idx >= 0) list.splice(idx, 1); else list.push(id);
  saveFavV2();
  renderFavoritesPanel();
  renderFavorites(); // Home
}

/* ============================================================
 * Núcleo: enviar prompt para o chat SEM disparar envio
 * ============================================================ */
function sendToChat(text, { switchTab = true, label = '' } = {}) {
  const ta = $('#message');
  if (!ta) { toast('Chat indisponível'); return; }
  ta.value = text;
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  if (switchTab) activateTab('chat');
  ta.focus();
  try { ta.setSelectionRange(ta.value.length, ta.value.length); } catch (_) {}
  toast(label ? `Prompt "${label}" copiado no chat` : 'Prompt copiado no chat');
  if (label) {
    state.recents = [{ label, at: Date.now() }, ...state.recents.filter(r => r.label !== label)].slice(0, 6);
    saveRecents();
    renderRecents();
  }
}

/* ============================================================
 * Navegação por abas (com persistência da última usada)
 * ============================================================ */
function activateTab(name) {
  $$('.mr-tab').forEach(t => t.classList.toggle('active', t.dataset.mrtab === name));
  $$('.mr-panel').forEach(p => p.classList.toggle('active', p.dataset.mrpanel === name));
  try { localStorage.setItem(LS_LAST_TAB, name); } catch (_) {}
  if (name === 'fav') renderFavoritesPanel();
}

function initTabs() {
  $('#mrTabs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.mr-tab');
    if (btn?.dataset.mrtab) activateTab(btn.dataset.mrtab);
  });
  $$('[data-mrgo]').forEach(el => el.addEventListener('click', () => activateTab(el.dataset.mrgo)));

  // Restaurar última aba OU garantir Chat como padrão
  let target = DEFAULT_TAB;
  try {
    const saved = localStorage.getItem(LS_LAST_TAB);
    if (saved && $(`.mr-tab[data-mrtab="${saved}"]`)) target = saved;
  } catch (_) {}
  activateTab(target);
}

/* ============================================================
 * ON/OFF toggle visual (não interfere no fluxo interno)
 * ============================================================ */
function initPowerToggle() {
  const btn = $('#mrPowerToggle');
  const label = $('#mrPowerLabel');
  if (!btn || !label) return;
  const paint = () => {
    btn.classList.toggle('off', !state.power);
    label.textContent = state.power ? 'ATIVA' : 'DESATIVADA';
    btn.title = state.power ? 'Extensão ativa — clique para desativar visual' : 'Extensão desativada — clique para reativar';
  };
  paint();
  btn.addEventListener('click', () => {
    state.power = !state.power;
    localStorage.setItem(LS_POWER, state.power ? '1' : '0');
    paint();
    toast(state.power ? 'Extensão ativada' : 'Extensão desativada (visual)');
  });
}

/* ============================================================
 * Botões rápidos Pro (ações explícitas)
 * ============================================================ */
const QA_PRO = [
  { i:'🚀', l:'Criar SaaS Completo', p:'Construa um SaaS COMPLETO do zero com autenticação (email + provedor social opcional), banco de dados com RLS + GRANTs + policies, sistema de roles em tabela separada (has_role SECURITY DEFINER), dashboard inicial com KPIs, sidebar de navegação, CRUDs principais com validação Zod, seed idempotente, SEO por rota e design system semântico. Comece perguntando o nome do produto e cor primária.' },
  { i:'▶',  l:'Continuar Projeto Atual', p:'Continue exatamente de onde paramos no projeto atual. Antes de qualquer mudança, faça um resumo curto do estado atual (rotas, telas, integrações) e proponha os próximos 3 passos priorizados.' },
  { i:'🔍', l:'Analisar Projeto', p:'Faça uma análise completa do projeto atual: arquitetura, rotas, componentes, banco, segurança (RLS/roles/exposição de secrets), performance, acessibilidade e SEO. Liste findings por severidade (crítico/alto/médio/baixo) SEM alterar código ainda.' },
  { i:'🛠', l:'Corrigir Erros', p:'Analise o build e o console e corrija TODOS os erros de TypeScript, imports quebrados, dependências faltando e runtime errors. Não silencie com any nem @ts-ignore. Explique cada correção em uma linha.' },
  { i:'✨', l:'Melhorar Código', p:'Refatore o código atual mantendo 100% do comportamento: extraia componentes duplicados/longos, migre cores hardcoded para tokens semânticos, melhore nomes, remova código morto e adicione comentários apenas onde agregam. Mostre antes/depois dos pontos críticos.' },
  { i:'⚡', l:'Otimizar Performance', p:'Otimize performance: identifique re-renders desnecessários (React.memo/useMemo/useCallback quando ajudar), aplique lazy loading em rotas pesadas e imagens abaixo da dobra, reduza bundle size e meça antes/depois.' },
  { i:'📊', l:'Criar Dashboard', p:'Crie um dashboard SaaS moderno: sidebar colapsável com ícones, header com search + avatar, 4 KPI cards, gráfico principal em área, gráfico secundário em pizza, tabela recente com ações e filtros. Design glassmorphism sutil, tokens semânticos, totalmente responsivo.' },
  { i:'🛡', l:'Criar Painel Admin', p:'Crie um painel administrativo com sistema de roles em tabela separada (user_roles + has_role SECURITY DEFINER), telas de gerenciamento de usuários/roles, logs de auditoria, configurações globais e proteção de rota admin.' },
  { i:'🎨', l:'Gerar Imagem', p:'Gere uma imagem para o projeto atual. Antes, pergunte: categoria (hero/banner/logo/mockup/produto/social), dimensões, mood, paleta e assunto exato.' },
  { i:'🎬', l:'Gerar Vídeo', p:'Gere/oriente um vídeo para o projeto atual. Antes, pergunte: categoria (hero/background/publicidade/reels/tiktok), duração, se tem áudio/legenda e roteiro/assunto.' },
  { i:'🧩', l:'Inserir Componente', p:'Insira um componente novo no projeto (informar qual: navbar, hero, pricing, faq, tabela, modal, etc.), acessível, responsivo, com variantes via cva, usando exclusivamente tokens semânticos do design system atual.' },
  { i:'✨', l:'Inserir Animação', p:'Adicione uma animação da biblioteca MR Sem Limites (informar qual e onde aplicar). Use apenas transform/opacity, respeite prefers-reduced-motion e não quebre o layout atual.' },
];

function initQaPro() {
  const el = $('#mrQaPro');
  if (!el) return;
  el.innerHTML = QA_PRO.map((a, i) =>
    `<button class="qa-pro-btn" data-qa="${i}"><span class="qa-pro-ico">${a.i}</span>${escapeHtml(a.l)}</button>`
  ).join('');
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-qa]');
    if (!b) return;
    const a = QA_PRO[Number(b.dataset.qa)];
    if (a) sendToChat(a.p, { label: a.l });
  });
}

/* ============================================================
 * Imagem como referência (disclaimer automático)
 * ============================================================ */
function initRefHint() {
  const hint = $('#mrRefHint');
  const chk = $('#mrRefOnly');
  const fileInput = $('#fileInput');
  const ta = $('#message');
  const preview = $('#filePreview');
  if (!hint || !chk || !fileInput || !ta) return;

  const paint = () => {
    const hasFiles = (fileInput.files && fileInput.files.length > 0) ||
                     (preview && preview.querySelector('.file-chip'));
    hint.classList.toggle('show', !!hasFiles);
  };
  fileInput.addEventListener('change', () => {
    paint();
    if (chk.checked && !ta.value.includes('[REFERÊNCIA VISUAL]')) {
      ta.value = (ta.value || '').trimEnd() + REF_DISCLAIMER;
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  chk.addEventListener('change', () => {
    if (chk.checked && !ta.value.includes('[REFERÊNCIA VISUAL]')) {
      ta.value = (ta.value || '').trimEnd() + REF_DISCLAIMER;
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  // reagir a mudanças no filePreview (sidepanel.js manipula)
  if (preview) new MutationObserver(paint).observe(preview, { childList: true, subtree: true });
  paint();
}

/* ============================================================
 * Home
 * ============================================================ */
async function initHome() {
  try {
    const info = $('#licenseInfo')?.textContent?.trim() || '';
    const pill = $('#mrHomeLicPill');
    const days = $('#mrHomeLicDays');
    if (info && info !== '--') {
      pill.textContent = 'Licença ativa'; pill.className = 'mr-pill'; days.textContent = info;
    } else {
      pill.textContent = 'Verificando…'; pill.className = 'mr-pill warn'; days.textContent = '';
    }
  } catch (_) {}

  try {
    const m = await chrome.runtime.getManifest?.();
    if (m?.version) $('#mrHomeVersion').textContent = 'v' + m.version;
  } catch (_) {}

  renderRecents();
  renderFavorites();

  const obs = new MutationObserver(() => {
    const info = $('#licenseInfo')?.textContent?.trim() || '';
    const pill = $('#mrHomeLicPill');
    const days = $('#mrHomeLicDays');
    if (!pill || !days) return;
    if (info && info !== '--') { pill.textContent = 'Licença ativa'; pill.className = 'mr-pill'; days.textContent = info; }
  });
  const li = $('#licenseInfo');
  if (li) obs.observe(li, { childList: true, characterData: true, subtree: true });
}

function renderRecents() {
  const el = $('#mrRecents');
  if (!el) return;
  if (!state.recents.length) {
    el.innerHTML = `<div class="mr-empty" style="grid-column:1/-1;padding:20px">Nenhuma conversa recente ainda</div>`;
    return;
  }
  el.innerHTML = state.recents.slice(0, 4).map(r => `
    <div class="mr-card" data-recent="${encodeURIComponent(r.label)}">
      <div class="mr-card-icon">💬</div>
      <h4>${escapeHtml(r.label)}</h4>
      <p>${new Date(r.at).toLocaleString()}</p>
    </div>
  `).join('');
}

function renderFavorites() {
  const el = $('#mrFavorites');
  if (!el) return;
  const items = collectFavorites();
  if (!items.length) {
    el.innerHTML = `<div class="mr-empty" style="grid-column:1/-1;padding:20px">Marque itens como ★ para vê-los aqui</div>`;
    return;
  }
  el.innerHTML = items.slice(0, 6).map(f => `
    <div class="mr-card" data-favgo="${f.type}:${escapeAttr(f.id)}">
      <div class="mr-card-icon">${f.icon || '★'}</div>
      <h4>${escapeHtml(f.name)}</h4>
      <p>${escapeHtml(f.category || f.type)}</p>
    </div>
  `).join('');
  el.querySelectorAll('[data-favgo]').forEach(c => c.addEventListener('click', () => {
    const [type, id] = c.dataset.favgo.split(':');
    runFavorite(type, id);
  }));
}

/* ============================================================
 * Galeria genérica
 * ============================================================ */
function renderGallery({ items, catsEl, gridEl, searchEl, renderItem, getCat }) {
  const cats = ['Todas', ...Array.from(new Set(items.map(getCat)))];
  let activeCat = 'Todas';
  let query = '';

  function paint() {
    catsEl.innerHTML = cats.map(c => `<span class="mr-chip${c === activeCat ? ' active' : ''}" data-cat="${escapeAttr(c)}">${escapeHtml(c)}</span>`).join('');
    const q = query.trim().toLowerCase();
    const filtered = items.filter(i => (activeCat === 'Todas' || getCat(i) === activeCat) && (!q || (i.name + ' ' + (i.desc || '') + ' ' + (i.body || '')).toLowerCase().includes(q)));
    gridEl.innerHTML = filtered.length ? filtered.map(renderItem).join('') : `<div class="mr-empty" style="grid-column:1/-1">Nada encontrado</div>`;
  }
  catsEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.mr-chip');
    if (!chip) return;
    activeCat = chip.dataset.cat;
    paint();
  });
  searchEl.addEventListener('input', (e) => { query = e.target.value; paint(); });
  paint();
  return { repaint: paint };
}

/* ============================================================
 * Animações
 * ============================================================ */
function previewClass(preview) {
  const map = { marquee:'prev-marquee', gradient:'prev-gradient', shimmer:'prev-shimmer', pulse:'prev-pulse', aurora:'prev-aurora', matrix:'prev-matrix', holo:'prev-holo', glitch:'prev-glitch' };
  return map[preview] || 'prev-generic';
}

function initAnimations() {
  const gridEl = $('#mrAnimGrid'), catsEl = $('#mrAnimCats'), searchEl = $('#mrAnimSearch');
  if (!gridEl) return;
  const gallery = renderGallery({
    items: ANIMATIONS, catsEl, gridEl, searchEl,
    getCat: a => a.category,
    renderItem: (a) => {
      const fav = isFavV2('anim', a.id);
      return `
      <div class="mr-item">
        <button class="mr-fav ${fav ? 'on' : ''}" data-fav-anim="${a.id}" title="Favoritar">★</button>
        <div class="mr-preview ${previewClass(a.preview)}">${previewClass(a.preview) === 'prev-generic' ? escapeHtml(a.name) : ''}</div>
        <div class="mr-item-head"><span class="mr-item-title">${escapeHtml(a.name)}</span><span class="mr-item-cat">${escapeHtml(a.category)}</span></div>
        <div class="mr-item-desc">${escapeHtml(a.desc)}</div>
        <div class="mr-item-actions">
          <button class="mr-btn primary" data-anim-use="${a.id}">Usar no chat</button>
          <button class="mr-btn" data-anim-copy="${a.id}" title="Copiar prompt">📋</button>
        </div>
      </div>`;
    },
  });
  gridEl.addEventListener('click', async (e) => {
    const favBtn = e.target.closest('[data-fav-anim]');
    if (favBtn) { toggleFavV2('anim', favBtn.dataset.favAnim); gallery.repaint(); return; }
    const useBtn = e.target.closest('[data-anim-use]');
    const copyBtn = e.target.closest('[data-anim-copy]');
    const id = useBtn?.dataset.animUse || copyBtn?.dataset.animCopy;
    if (!id) return;
    const a = ANIMATIONS.find(x => x.id === id);
    if (!a) return;
    const prompt = buildAnimationPrompt(a);
    if (useBtn) sendToChat(prompt, { label: `Animação: ${a.name}` });
    else { try { await navigator.clipboard.writeText(prompt); toast('Prompt copiado'); } catch { toast('Falha ao copiar'); } }
  });
}

/* ============================================================
 * Componentes
 * ============================================================ */
function initComponents() {
  const gridEl = $('#mrCompGrid'), catsEl = $('#mrCompCats'), searchEl = $('#mrCompSearch');
  if (!gridEl) return;
  const gallery = renderGallery({
    items: COMPONENTS, catsEl, gridEl, searchEl,
    getCat: c => c.category,
    renderItem: (c) => {
      const fav = isFavV2('comp', c.id);
      return `
      <div class="mr-item">
        <button class="mr-fav ${fav ? 'on' : ''}" data-fav-comp="${c.id}" title="Favoritar">★</button>
        <div class="mr-preview prev-generic">${escapeHtml(c.icon)} ${escapeHtml(c.name)}</div>
        <div class="mr-item-head"><span class="mr-item-title">${escapeHtml(c.name)}</span><span class="mr-item-cat">${escapeHtml(c.category)}</span></div>
        <div class="mr-item-desc">${escapeHtml(c.desc)}</div>
        <div class="mr-item-actions">
          <button class="mr-btn primary" data-comp-use="${c.id}">Usar</button>
          <button class="mr-btn" data-comp-prompt="${c.id}">Copiar Prompt</button>
        </div>
      </div>`;
    },
  });
  gridEl.addEventListener('click', async (e) => {
    const favBtn = e.target.closest('[data-fav-comp]');
    if (favBtn) { toggleFavV2('comp', favBtn.dataset.favComp); gallery.repaint(); return; }
    const useBtn = e.target.closest('[data-comp-use]');
    const promptBtn = e.target.closest('[data-comp-prompt]');
    const id = useBtn?.dataset.compUse || promptBtn?.dataset.compPrompt;
    if (!id) return;
    const c = COMPONENTS.find(x => x.id === id);
    if (!c) return;
    if (useBtn) sendToChat(buildComponentPrompt(c, 'use'), { label: `Componente: ${c.name}` });
    else { try { await navigator.clipboard.writeText(buildComponentPrompt(c, 'prompt')); toast('Prompt copiado'); } catch { toast('Falha ao copiar'); } }
  });
}

/* ============================================================
 * Prompts Premium (mantém compat com LS_FAV legado + V2)
 * ============================================================ */
function initPrompts() {
  const gridEl = $('#mrPromptGrid'), catsEl = $('#mrPromptCats'), searchEl = $('#mrPromptSearch');
  if (!gridEl) return;
  const gallery = renderGallery({
    items: PROMPTS, catsEl, gridEl, searchEl,
    getCat: p => p.cat,
    renderItem: (p) => {
      const fav = isFavV2('prompt', p.id);
      return `
        <div class="mr-item">
          <button class="mr-fav ${fav ? 'on' : ''}" data-fav="${p.id}" title="Favoritar">★</button>
          <div class="mr-item-head"><span class="mr-item-title">${escapeHtml(p.name)}</span><span class="mr-item-cat">${escapeHtml(p.cat)}</span></div>
          <div class="mr-item-desc">${escapeHtml(p.body.slice(0, 140))}${p.body.length > 140 ? '…' : ''}</div>
          <div class="mr-item-actions">
            <button class="mr-btn primary" data-prompt-use="${p.id}">Usar</button>
            <button class="mr-btn" data-prompt-copy="${p.id}">Copiar</button>
          </div>
        </div>`;
    },
  });
  gridEl.addEventListener('click', async (e) => {
    const favBtn = e.target.closest('[data-fav]');
    const useBtn = e.target.closest('[data-prompt-use]');
    const copyBtn = e.target.closest('[data-prompt-copy]');
    if (favBtn) {
      const id = favBtn.dataset.fav;
      toggleFavV2('prompt', id);
      // manter LS_FAV legado sincronizado
      state.favorites = state.favoritesV2.prompt.slice();
      saveFav();
      gallery.repaint();
      return;
    }
    const id = useBtn?.dataset.promptUse || copyBtn?.dataset.promptCopy;
    if (!id) return;
    const p = PROMPTS.find(x => x.id === id);
    if (!p) return;
    if (useBtn) sendToChat(buildPromptForChat(p), { label: p.name });
    else { try { await navigator.clipboard.writeText(p.body); toast('Prompt copiado'); } catch { toast('Falha ao copiar'); } }
  });
}

/* ============================================================
 * Imagens IA
 * ============================================================ */
function previewFromKey(k) {
  const map = { 'grad-warm':'prev-warm', 'grad-cool':'prev-cool', 'grad-pink':'prev-pink', 'grad-blue':'prev-blue', 'grad-mono':'prev-mono', 'grad-cyber':'prev-cyber' };
  return map[k] || 'prev-generic';
}

function initImages() {
  const gridEl = $('#mrImgGrid'), catsEl = $('#mrImgCats'), searchEl = $('#mrImgSearch');
  if (!gridEl) return;
  const gallery = renderGallery({
    items: IMAGES_AI, catsEl, gridEl, searchEl,
    getCat: i => i.category,
    renderItem: (i) => {
      const fav = isFavV2('img', i.id);
      return `
        <div class="mr-item">
          <button class="mr-fav ${fav ? 'on' : ''}" data-fav-img="${i.id}" title="Favoritar">★</button>
          <div class="mr-preview ${previewFromKey(i.preview)}"><span class="mr-preview-icon">${escapeHtml(i.icon || '🎨')}</span></div>
          <div class="mr-item-head"><span class="mr-item-title">${escapeHtml(i.name)}</span><span class="mr-item-cat">${escapeHtml(i.category)}</span></div>
          <div class="mr-item-desc">${escapeHtml(i.desc)}</div>
          <div class="mr-item-actions">
            <button class="mr-btn primary" data-img-use="${i.id}">Usar</button>
            <button class="mr-btn" data-img-copy="${i.id}">📋</button>
          </div>
        </div>`;
    },
  });
  gridEl.addEventListener('click', async (e) => {
    const favBtn = e.target.closest('[data-fav-img]');
    if (favBtn) { toggleFavV2('img', favBtn.dataset.favImg); gallery.repaint(); return; }
    const useBtn = e.target.closest('[data-img-use]');
    const copyBtn = e.target.closest('[data-img-copy]');
    const id = useBtn?.dataset.imgUse || copyBtn?.dataset.imgCopy;
    if (!id) return;
    const it = IMAGES_AI.find(x => x.id === id);
    if (!it) return;
    const prompt = buildImageAIPrompt(it);
    if (useBtn) sendToChat(prompt, { label: `Imagem: ${it.name}` });
    else { try { await navigator.clipboard.writeText(prompt); toast('Prompt copiado'); } catch {} }
  });
}

/* ============================================================
 * Vídeos IA
 * ============================================================ */
function initVideos() {
  const gridEl = $('#mrVidGrid'), catsEl = $('#mrVidCats'), searchEl = $('#mrVidSearch');
  if (!gridEl) return;
  const gallery = renderGallery({
    items: VIDEOS_AI, catsEl, gridEl, searchEl,
    getCat: v => v.category,
    renderItem: (v) => {
      const fav = isFavV2('vid', v.id);
      return `
        <div class="mr-item">
          <button class="mr-fav ${fav ? 'on' : ''}" data-fav-vid="${v.id}" title="Favoritar">★</button>
          <div class="mr-preview ${previewFromKey(v.preview)}"><span class="mr-preview-icon">${escapeHtml(v.icon || '🎬')}</span></div>
          <div class="mr-item-head"><span class="mr-item-title">${escapeHtml(v.name)}</span><span class="mr-item-cat">${escapeHtml(v.category)}</span></div>
          <div class="mr-item-desc">${escapeHtml(v.desc)}</div>
          <div class="mr-item-actions">
            <button class="mr-btn primary" data-vid-use="${v.id}">Usar</button>
            <button class="mr-btn" data-vid-copy="${v.id}">📋</button>
          </div>
        </div>`;
    },
  });
  gridEl.addEventListener('click', async (e) => {
    const favBtn = e.target.closest('[data-fav-vid]');
    if (favBtn) { toggleFavV2('vid', favBtn.dataset.favVid); gallery.repaint(); return; }
    const useBtn = e.target.closest('[data-vid-use]');
    const copyBtn = e.target.closest('[data-vid-copy]');
    const id = useBtn?.dataset.vidUse || copyBtn?.dataset.vidCopy;
    if (!id) return;
    const it = VIDEOS_AI.find(x => x.id === id);
    if (!it) return;
    const prompt = buildVideoAIPrompt(it);
    if (useBtn) sendToChat(prompt, { label: `Vídeo: ${it.name}` });
    else { try { await navigator.clipboard.writeText(prompt); toast('Prompt copiado'); } catch {} }
  });
}

/* ============================================================
 * Templates SaaS
 * ============================================================ */
function initTemplates() {
  const gridEl = $('#mrTplGrid'), catsEl = $('#mrTplCats'), searchEl = $('#mrTplSearch');
  if (!gridEl) return;
  const gallery = renderGallery({
    items: TEMPLATES_SAAS, catsEl, gridEl, searchEl,
    getCat: t => t.category,
    renderItem: (t) => {
      const fav = isFavV2('tpl', t.id);
      return `
        <div class="mr-item">
          <button class="mr-fav ${fav ? 'on' : ''}" data-fav-tpl="${t.id}" title="Favoritar">★</button>
          <div class="mr-preview prev-cyber"><span class="mr-preview-icon">${escapeHtml(t.icon || '📦')}</span></div>
          <div class="mr-item-head"><span class="mr-item-title">${escapeHtml(t.name)}</span><span class="mr-item-cat">${escapeHtml(t.category)}</span></div>
          <div class="mr-item-desc">${escapeHtml(t.desc)}</div>
          <div class="mr-item-actions">
            <button class="mr-btn primary" data-tpl-use="${t.id}">Construir</button>
            <button class="mr-btn" data-tpl-copy="${t.id}">📋</button>
          </div>
        </div>`;
    },
  });
  gridEl.addEventListener('click', async (e) => {
    const favBtn = e.target.closest('[data-fav-tpl]');
    if (favBtn) { toggleFavV2('tpl', favBtn.dataset.favTpl); gallery.repaint(); return; }
    const useBtn = e.target.closest('[data-tpl-use]');
    const copyBtn = e.target.closest('[data-tpl-copy]');
    const id = useBtn?.dataset.tplUse || copyBtn?.dataset.tplCopy;
    if (!id) return;
    const it = TEMPLATES_SAAS.find(x => x.id === id);
    if (!it) return;
    const prompt = buildTemplateSaaSPrompt(it);
    if (useBtn) sendToChat(prompt, { label: `SaaS: ${it.name}` });
    else { try { await navigator.clipboard.writeText(prompt); toast('Prompt copiado'); } catch {} }
  });
}

/* ============================================================
 * Aba Favoritos agregada
 * ============================================================ */
const FAV_TYPES = [
  { key:'all', label:'Todos' },
  { key:'prompt', label:'Prompts' },
  { key:'comp', label:'Componentes' },
  { key:'anim', label:'Animações' },
  { key:'img', label:'Imagens IA' },
  { key:'vid', label:'Vídeos IA' },
  { key:'tpl', label:'Templates' },
];
let favActive = 'all';

function collectFavorites() {
  const out = [];
  const add = (type, arr, source, getIcon, getName, getCat) => {
    (state.favoritesV2[type] || []).forEach(id => {
      const it = arr.find(x => x.id === id);
      if (!it) return;
      out.push({ type, id, icon: getIcon(it), name: getName(it), category: getCat(it) });
    });
  };
  add('prompt', PROMPTS, 'p', () => '★', p => p.name, p => p.cat);
  add('comp',   COMPONENTS, 'c', c => c.icon || '🧩', c => c.name, c => c.category);
  add('anim',   ANIMATIONS, 'a', () => '✨', a => a.name, a => a.category);
  add('img',    IMAGES_AI, 'i', i => i.icon || '🎨', i => i.name, i => i.category);
  add('vid',    VIDEOS_AI, 'v', v => v.icon || '🎬', v => v.name, v => v.category);
  add('tpl',    TEMPLATES_SAAS, 't', t => t.icon || '📦', t => t.name, t => t.category);
  return out;
}

function runFavorite(type, id) {
  if (type === 'prompt') { const p = PROMPTS.find(x => x.id === id); if (p) sendToChat(buildPromptForChat(p), { label: p.name }); return; }
  if (type === 'comp')   { const c = COMPONENTS.find(x => x.id === id); if (c) sendToChat(buildComponentPrompt(c, 'use'), { label: `Componente: ${c.name}` }); return; }
  if (type === 'anim')   { const a = ANIMATIONS.find(x => x.id === id); if (a) sendToChat(buildAnimationPrompt(a), { label: `Animação: ${a.name}` }); return; }
  if (type === 'img')    { const i = IMAGES_AI.find(x => x.id === id); if (i) sendToChat(buildImageAIPrompt(i), { label: `Imagem: ${i.name}` }); return; }
  if (type === 'vid')    { const v = VIDEOS_AI.find(x => x.id === id); if (v) sendToChat(buildVideoAIPrompt(v), { label: `Vídeo: ${v.name}` }); return; }
  if (type === 'tpl')    { const t = TEMPLATES_SAAS.find(x => x.id === id); if (t) sendToChat(buildTemplateSaaSPrompt(t), { label: `SaaS: ${t.name}` }); return; }
}

function renderFavoritesPanel() {
  const catsEl = $('#mrFavCats');
  const gridEl = $('#mrFavGrid');
  if (!catsEl || !gridEl) return;
  catsEl.innerHTML = FAV_TYPES.map(t =>
    `<span class="mr-chip${favActive === t.key ? ' active' : ''}" data-favtab="${t.key}">${escapeHtml(t.label)}</span>`
  ).join('');
  catsEl.onclick = (e) => {
    const c = e.target.closest('[data-favtab]');
    if (!c) return;
    favActive = c.dataset.favtab;
    renderFavoritesPanel();
  };
  let items = collectFavorites();
  if (favActive !== 'all') items = items.filter(x => x.type === favActive);
  if (!items.length) {
    gridEl.innerHTML = `<div class="mr-empty" style="grid-column:1/-1">Nenhum favorito ainda. Marque itens com ★ nas outras abas.</div>`;
    return;
  }
  gridEl.innerHTML = items.map(f => `
    <div class="mr-item">
      <button class="mr-fav on" data-favrm="${f.type}:${escapeAttr(f.id)}" title="Remover dos favoritos">★</button>
      <div class="mr-preview prev-generic"><span class="mr-preview-icon">${escapeHtml(f.icon || '★')}</span></div>
      <div class="mr-item-head"><span class="mr-item-title">${escapeHtml(f.name)}</span><span class="mr-item-cat">${escapeHtml(f.category)}</span></div>
      <div class="mr-item-actions">
        <button class="mr-btn primary" data-favrun="${f.type}:${escapeAttr(f.id)}">Usar</button>
      </div>
    </div>
  `).join('');
  gridEl.onclick = (e) => {
    const rm = e.target.closest('[data-favrm]');
    if (rm) { const [t, id] = rm.dataset.favrm.split(':'); toggleFavV2(t, id); return; }
    const run = e.target.closest('[data-favrun]');
    if (run) { const [t, id] = run.dataset.favrun.split(':'); runFavorite(t, id); }
  };
}

/* ============================================================
 * Ferramentas (inalterado)
 * ============================================================ */
function randColor() { const h = Math.floor(Math.random() * 360); return { h, hex: hslToHex(h, 70, 55) }; }
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))).toString(16).padStart(2, '0');
  return `#${f(0)}${f(8)}${f(4)}`;
}

function initTools() {
  function paintColors() {
    const row = $('#mrColorRow'); if (!row) return;
    const arr = Array.from({ length: 6 }, () => randColor().hex);
    row.innerHTML = arr.map(hex => `<div class="mr-swatch" data-hex="${hex}" style="background:${hex}"></div>`).join('');
    row.querySelectorAll('.mr-swatch').forEach(s => s.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(s.dataset.hex); toast('Copiado: ' + s.dataset.hex); } catch {}
    }));
  }
  paintColors();
  $('#mrColorGen')?.addEventListener('click', paintColors);

  function paintGrads() {
    const row = $('#mrGradRow'); if (!row) return;
    const grads = Array.from({ length: 4 }, () => {
      const a = randColor().hex, b = randColor().hex;
      const deg = Math.floor(Math.random() * 360);
      return { css: `linear-gradient(${deg}deg, ${a}, ${b})`, text: `linear-gradient(${deg}deg, ${a}, ${b})` };
    });
    row.innerHTML = grads.map(g => `<div class="mr-swatch" data-hex="${g.text}" style="width:56px;height:36px;background:${g.css}" title="${g.text}"></div>`).join('');
    row.querySelectorAll('.mr-swatch').forEach(s => s.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(s.dataset.hex); toast('Gradient copiado'); } catch {}
    }));
  }
  paintGrads();
  $('#mrGradGen')?.addEventListener('click', paintGrads);

  const icons = ['Sparkles','Zap','Rocket','Star','Heart','Home','Settings','User','Search','Bell','Mail','Cloud','Sun','Moon','Wifi','Lock','Key','Shield','Code','Terminal','Palette','Camera','Music','Video','Play','Pause','Download','Upload','Trash','Edit','Copy','Check','X','Plus','Minus','ChevronRight','ArrowRight','BarChart','PieChart','TrendingUp'];
  const iconRow = $('#mrIconRow');
  if (iconRow) {
    iconRow.innerHTML = icons.map(i => `<span class="mr-chip" data-icon="${i}">${i}</span>`).join('');
    iconRow.addEventListener('click', async (e) => {
      const c = e.target.closest('[data-icon]'); if (!c) return;
      try { await navigator.clipboard.writeText(c.dataset.icon); toast(`Copiado: ${c.dataset.icon}`); } catch {}
    });
  }

  const fonts = ['Inter','Space Grotesk','DM Sans','Sora','Manrope','Outfit','Figtree','JetBrains Mono','Bebas Neue','Playfair Display','Cormorant','Instrument Serif'];
  const fontRow = $('#mrFontRow');
  if (fontRow) {
    fontRow.innerHTML = fonts.map(f => `<span class="mr-chip" data-font="${f}" style="font-family:'${f}',sans-serif">${f}</span>`).join('');
    fontRow.addEventListener('click', async (e) => {
      const c = e.target.closest('[data-font]'); if (!c) return;
      try { await navigator.clipboard.writeText(c.dataset.font); toast(`Copiado: ${c.dataset.font}`); } catch {}
    });
  }

  $('#mrConvIn')?.addEventListener('input', (e) => {
    const v = e.target.value.trim();
    const out = $('#mrConvOut');
    if (!v) { out.textContent = '—'; return; }
    if (/rem$/i.test(v)) { const n = parseFloat(v); out.textContent = isFinite(n) ? (n * 16) + 'px' : '—'; }
    else { const n = parseFloat(v); out.textContent = isFinite(n) ? (n / 16) + 'rem' : '—'; }
  });

  function runRegex() {
    const pat = $('#mrRegexPat').value.trim();
    const txt = $('#mrRegexIn').value;
    const out = $('#mrRegexOut');
    if (!pat) { out.textContent = 'Aguardando…'; return; }
    try {
      const m = pat.match(/^\/(.+)\/([gimsuy]*)$/);
      const re = m ? new RegExp(m[1], m[2]) : new RegExp(pat);
      const matches = [...txt.matchAll(new RegExp(re.source, (re.flags.includes('g') ? re.flags : re.flags + 'g')))];
      out.textContent = matches.length ? matches.map((x, i) => `#${i + 1}: "${x[0]}" @ ${x.index}`).join('\n') : 'Sem correspondências';
    } catch (err) { out.textContent = 'Erro: ' + err.message; }
  }
  $('#mrRegexPat')?.addEventListener('input', runRegex);
  $('#mrRegexIn')?.addEventListener('input', runRegex);

  $('#mrJsonPretty')?.addEventListener('click', () => {
    try { $('#mrJsonOut').textContent = JSON.stringify(JSON.parse($('#mrJsonIn').value), null, 2); } catch (e) { $('#mrJsonOut').textContent = 'Erro: ' + e.message; }
  });
  $('#mrJsonMin')?.addEventListener('click', () => {
    try { $('#mrJsonOut').textContent = JSON.stringify(JSON.parse($('#mrJsonIn').value)); } catch (e) { $('#mrJsonOut').textContent = 'Erro: ' + e.message; }
  });

  function uuid() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  $('#mrUuidGen')?.addEventListener('click', async () => {
    const u = uuid();
    $('#mrUuidOut').textContent = u;
    try { await navigator.clipboard.writeText(u); toast('UUID copiado'); } catch {}
  });

  const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
  $('#mrLoremGen')?.addEventListener('click', () => {
    const n = Math.max(1, Math.min(30, parseInt($('#mrLoremN').value) || 3));
    $('#mrLoremOut').textContent = Array(n).fill(LOREM).join('\n\n');
  });
}

/* ============================================================
 * Utils
 * ============================================================ */
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
function escapeAttr(s) { return escapeHtml(s).replace(/`/g, '&#96;'); }

/* ============================================================
 * Boot
 * ============================================================ */
function boot() {
  if (!$('#mrTabs')) return;
  initPowerToggle();
  initHome();
  initAnimations();
  initComponents();
  initPrompts();
  initImages();
  initVideos();
  initTemplates();
  initTools();
  initQaPro();
  initRefHint();
  initTabs(); // por último: aplica última aba salva (default: chat)
  renderFavoritesPanel();
  console.log('[MR 2.1] UI Reformulada V3 inicializada');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
