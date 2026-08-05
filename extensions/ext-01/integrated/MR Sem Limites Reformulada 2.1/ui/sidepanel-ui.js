// MR Sem Limites Reformulada 2.1 — UI module
// Adiciona: navegação por abas, Home, galerias de Animações/Componentes/Prompts, Ferramentas.
// NÃO altera envio de mensagens, licença, autenticação ou backend.
// Ao clicar em "Usar", apenas copia o prompt no textarea #message; o usuário decide quando enviar.

import { ANIMATIONS, buildAnimationPrompt } from '../data/animations.js';
import { COMPONENTS, buildComponentPrompt } from '../data/components.js';
import { PROMPTS, buildPromptForChat } from '../data/prompts.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const LS_FAV = 'mr21.favorites';
const LS_RECENTS = 'mr21.recents';

const state = {
  favorites: JSON.parse(localStorage.getItem(LS_FAV) || '[]'),
  recents: JSON.parse(localStorage.getItem(LS_RECENTS) || '[]'),
};

function saveFav() { localStorage.setItem(LS_FAV, JSON.stringify(state.favorites)); }
function saveRecents() { localStorage.setItem(LS_RECENTS, JSON.stringify(state.recents.slice(0, 6))); }

function toast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
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
 * Navegação por abas
 * ============================================================ */
function activateTab(name) {
  $$('.mr-tab').forEach(t => t.classList.toggle('active', t.dataset.mrtab === name));
  $$('.mr-panel').forEach(p => p.classList.toggle('active', p.dataset.mrpanel === name));
}

function initTabs() {
  $('#mrTabs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.mr-tab');
    if (btn?.dataset.mrtab) activateTab(btn.dataset.mrtab);
  });
  $$('[data-mrgo]').forEach(el => el.addEventListener('click', () => activateTab(el.dataset.mrgo)));
}

/* ============================================================
 * Home: status de licença + recentes + favoritos
 * ============================================================ */
async function initHome() {
  try {
    const info = $('#licenseInfo')?.textContent?.trim() || '';
    const pill = $('#mrHomeLicPill');
    const days = $('#mrHomeLicDays');
    if (info && info !== '--') {
      pill.textContent = 'Licença ativa';
      pill.className = 'mr-pill';
      days.textContent = info;
    } else {
      pill.textContent = 'Verificando…';
      pill.className = 'mr-pill warn';
      days.textContent = '';
    }
  } catch (_) {}

  try {
    const m = await chrome.runtime.getManifest?.();
    if (m?.version) $('#mrHomeVersion').textContent = 'v' + m.version;
  } catch (_) {}

  renderRecents();
  renderFavorites();

  // Reagir a mudanças no licenseInfo do fluxo legado
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
  if (!state.favorites.length) {
    el.innerHTML = `<div class="mr-empty" style="grid-column:1/-1;padding:20px">Marque prompts como ★ para vê-los aqui</div>`;
    return;
  }
  el.innerHTML = state.favorites.slice(0, 6).map(id => {
    const p = PROMPTS.find(x => x.id === id);
    if (!p) return '';
    return `<div class="mr-card" data-fav-run="${p.id}"><div class="mr-card-icon">★</div><h4>${escapeHtml(p.name)}</h4><p>${escapeHtml(p.cat)}</p></div>`;
  }).join('');
  el.querySelectorAll('[data-fav-run]').forEach(c => c.addEventListener('click', () => {
    const p = PROMPTS.find(x => x.id === c.dataset.favRun);
    if (p) sendToChat(buildPromptForChat(p), { label: p.name });
  }));
}

/* ============================================================
 * Galeria genérica: filtros por categoria + busca
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
  renderGallery({
    items: ANIMATIONS,
    catsEl, gridEl, searchEl,
    getCat: a => a.category,
    renderItem: (a) => `
      <div class="mr-item">
        <div class="mr-preview ${previewClass(a.preview)}">${previewClass(a.preview) === 'prev-generic' ? escapeHtml(a.name) : ''}</div>
        <div class="mr-item-head"><span class="mr-item-title">${escapeHtml(a.name)}</span><span class="mr-item-cat">${escapeHtml(a.category)}</span></div>
        <div class="mr-item-desc">${escapeHtml(a.desc)}</div>
        <div class="mr-item-actions">
          <button class="mr-btn primary" data-anim-use="${a.id}">Usar no chat</button>
          <button class="mr-btn" data-anim-copy="${a.id}" title="Copiar prompt">📋</button>
        </div>
      </div>`,
  });
  gridEl.addEventListener('click', async (e) => {
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
  renderGallery({
    items: COMPONENTS,
    catsEl, gridEl, searchEl,
    getCat: c => c.category,
    renderItem: (c) => `
      <div class="mr-item">
        <div class="mr-preview prev-generic">${escapeHtml(c.icon)} ${escapeHtml(c.name)}</div>
        <div class="mr-item-head"><span class="mr-item-title">${escapeHtml(c.name)}</span><span class="mr-item-cat">${escapeHtml(c.category)}</span></div>
        <div class="mr-item-desc">${escapeHtml(c.desc)}</div>
        <div class="mr-item-actions">
          <button class="mr-btn primary" data-comp-use="${c.id}">Usar</button>
          <button class="mr-btn" data-comp-prompt="${c.id}">Copiar Prompt</button>
        </div>
      </div>`,
  });
  gridEl.addEventListener('click', async (e) => {
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
 * Prompts Premium
 * ============================================================ */
function initPrompts() {
  const gridEl = $('#mrPromptGrid'), catsEl = $('#mrPromptCats'), searchEl = $('#mrPromptSearch');
  if (!gridEl) return;
  const gallery = renderGallery({
    items: PROMPTS,
    catsEl, gridEl, searchEl,
    getCat: p => p.cat,
    renderItem: (p) => {
      const fav = state.favorites.includes(p.id);
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
      state.favorites = state.favorites.includes(id) ? state.favorites.filter(x => x !== id) : [...state.favorites, id];
      saveFav();
      gallery.repaint();
      renderFavorites();
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
 * Ferramentas
 * ============================================================ */
function hsl(h, s, l) { return `hsl(${h} ${s}% ${l}%)`; }
function randColor() { const h = Math.floor(Math.random() * 360); return { h, hex: hslToHex(h, 70, 55) }; }
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))).toString(16).padStart(2, '0');
  return `#${f(0)}${f(8)}${f(4)}`;
}

function initTools() {
  // cores
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

  // gradientes
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

  // ícones (lucide names)
  const icons = ['Sparkles','Zap','Rocket','Star','Heart','Home','Settings','User','Search','Bell','Mail','Cloud','Sun','Moon','Wifi','Lock','Key','Shield','Code','Terminal','Palette','Camera','Music','Video','Play','Pause','Download','Upload','Trash','Edit','Copy','Check','X','Plus','Minus','ChevronRight','ArrowRight','BarChart','PieChart','TrendingUp'];
  const iconRow = $('#mrIconRow');
  if (iconRow) {
    iconRow.innerHTML = icons.map(i => `<span class="mr-chip" data-icon="${i}">${i}</span>`).join('');
    iconRow.addEventListener('click', async (e) => {
      const c = e.target.closest('[data-icon]'); if (!c) return;
      try { await navigator.clipboard.writeText(c.dataset.icon); toast(`Copiado: ${c.dataset.icon}`); } catch {}
    });
  }

  // fontes
  const fonts = ['Inter','Space Grotesk','DM Sans','Sora','Manrope','Outfit','Figtree','JetBrains Mono','Bebas Neue','Playfair Display','Cormorant','Instrument Serif'];
  const fontRow = $('#mrFontRow');
  if (fontRow) {
    fontRow.innerHTML = fonts.map(f => `<span class="mr-chip" data-font="${f}" style="font-family:'${f}',sans-serif">${f}</span>`).join('');
    fontRow.addEventListener('click', async (e) => {
      const c = e.target.closest('[data-font]'); if (!c) return;
      try { await navigator.clipboard.writeText(c.dataset.font); toast(`Copiado: ${c.dataset.font}`); } catch {}
    });
  }

  // conversor px<->rem
  $('#mrConvIn')?.addEventListener('input', (e) => {
    const v = e.target.value.trim();
    const out = $('#mrConvOut');
    if (!v) { out.textContent = '—'; return; }
    if (/rem$/i.test(v)) { const n = parseFloat(v); out.textContent = isFinite(n) ? (n * 16) + 'px' : '—'; }
    else { const n = parseFloat(v); out.textContent = isFinite(n) ? (n / 16) + 'rem' : '—'; }
  });

  // regex
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

  // JSON
  $('#mrJsonPretty')?.addEventListener('click', () => {
    try { $('#mrJsonOut').textContent = JSON.stringify(JSON.parse($('#mrJsonIn').value), null, 2); } catch (e) { $('#mrJsonOut').textContent = 'Erro: ' + e.message; }
  });
  $('#mrJsonMin')?.addEventListener('click', () => {
    try { $('#mrJsonOut').textContent = JSON.stringify(JSON.parse($('#mrJsonIn').value)); } catch (e) { $('#mrJsonOut').textContent = 'Erro: ' + e.message; }
  });

  // UUID
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

  // lorem
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
  initTabs();
  initHome();
  initAnimations();
  initComponents();
  initPrompts();
  initTools();
  console.log('[MR 2.1] UI Reformulada inicializada');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
