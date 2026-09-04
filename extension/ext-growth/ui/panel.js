// MR Social Growth - Elite Edition | Controller v6.3.0 (ULTRA FIX)
const $ = (id) => document.getElementById(id);

// ============ LICENÇA MR SOCIAL GLOW ============
// O pacote contém apenas a URL pública; credenciais administrativas não são incluídas.
const MR_LICENSE_API = "https://mrsemlimites.lovable.app";
const MR_LICENSE_EXTENSION_ID = "mr-social-glow";
const MR_LICENSE_VERSION = "17.0.0";
const MR_LICENSE_STORAGE_KEY = "mr_social_glow_license";
const MR_LICENSE_DEVICE_KEY = "mr_social_glow_device_id";

// ============ MODO DE TESTES (temporário) ============
// Enquanto TRUE, o painel libera o acesso direto, sem chamar o servidor de
// licenças (evita gastar créditos do backend durante os testes de vídeo/
// imagem). IMPORTANTE: voltar para false antes de divulgar a extensão para
// clientes — só assim a chave volta a ser exigida/validada de verdade.
const MR_LICENSE_TESTING_BYPASS = false;

function mrLicenseDeviceId() {
  return new Promise((resolve) => {
    chrome.storage.local.get([MR_LICENSE_DEVICE_KEY], (saved) => {
      if (saved?.[MR_LICENSE_DEVICE_KEY]) return resolve(saved[MR_LICENSE_DEVICE_KEY]);
      const value = (crypto.randomUUID?.() || `mrsg-${Date.now()}-${Math.random().toString(36).slice(2)}`);
      chrome.storage.local.set({ [MR_LICENSE_DEVICE_KEY]: value }, () => resolve(value));
    });
  });
}

function mrNormalizeLicenseKey(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[‐‑‒–—−]/g, "-")
    .trim()
    .toUpperCase();
}

function mrLicenseLooksLikeKey(value) {
  const key = mrNormalizeLicenseKey(value);
  // Aceita MR-XXXX-XXXX-XXXX, 4 blocos de 5 e o padrão oficial de 5 blocos de 5.
  return /^MR-[A-Z0-9]{4}(?:-[A-Z0-9]{4}){2,4}$/.test(key)
    || /^[A-Z0-9]{4,6}(?:-[A-Z0-9]{4,6}){3,4}$/.test(key);
}

async function mrLicenseRequest(path, body) {
  const response = await fetch(`${MR_LICENSE_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store"
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || data?.message || "Não foi possível validar a licença.");
  return data;
}

async function mrValidateLicense(key, email = "") {
  const device_id = await mrLicenseDeviceId();
  const chave = String(key || "").trim().toUpperCase();
  return mrLicenseRequest("/api/public/ext/validate-license", {
    license_key: chave,
    chave,
    code: chave,
    email: String(email || "").trim(),
    device_id,
    hwid: device_id,
    device_nome: "MR Social Growth",
    versao: MR_LICENSE_VERSION,
    extension_id: MR_LICENSE_EXTENSION_ID
  });
}


async function mrLicenseHeartbeat(session) {
  if (!session?.key) return false;
  try {
    const device_id = await mrLicenseDeviceId();
    const result = await mrLicenseRequest("/api/public/ext/license-heartbeat", {
      chave: session.key, license_key: session.key, device_id, hwid: device_id, extension_id: MR_LICENSE_EXTENSION_ID
    });
    if (result?.ok === false || /expirad|bloquead|inexistent/i.test(String(result?.estado || ""))) {
      document.body.classList.add("license-locked");
      $("mr-license-gate")?.removeAttribute("hidden");
      $("mr-license-status").textContent = "A licença deixou de estar válida. Verifique a sua chave.";
      mrUpdateLicenseCountdown();
      return false;
    }
    // Mantém a contagem regressiva em dia com o que o backend devolveu agora.
    if (result?.expira_em) {
      session.expiresAt = result.expira_em;
      await chrome.storage.local.set({ [MR_LICENSE_STORAGE_KEY]: session });
      mrUpdateLicenseCountdown();
    }
    return true;
  } catch (_) {
    // Indisponibilidade temporária não derruba uma sessão já validada; a próxima
    // validação completa continua obrigatória quando a extensão for reaberta.
    return true;
  }
}

// ---- Contagem regressiva de validade da licença (dias/horas/minutos restantes) ----
function mrFormatCountdown(expiresAtIso) {
  if (!expiresAtIso) return "Licença vitalícia";
  const diffMs = new Date(expiresAtIso).getTime() - Date.now();
  if (!Number.isFinite(diffMs)) return "";
  if (diffMs <= 0) return "Licença expirada";
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `Expira em ${days}d ${hours}h`;
  if (hours > 0) return `Expira em ${hours}h ${minutes}min`;
  return `Expira em ${Math.max(1, minutes)}min`;
}

async function mrUpdateLicenseCountdown() {
  const badge = $("mr-license-countdown");
  if (!badge) return;
  const saved = await new Promise((resolve) => chrome.storage.local.get([MR_LICENSE_STORAGE_KEY], resolve));
  const session = saved?.[MR_LICENSE_STORAGE_KEY];
  if (!session?.key) { badge.hidden = true; return; }
  const text = mrFormatCountdown(session.expiresAt);
  badge.textContent = text;
  badge.classList.toggle("license-badge-warn", /expirad/i.test(text));
  badge.hidden = !text;
}

async function mrUnlockWithLicense(key, email = "", silent = false) {
  const status = $("mr-license-status");
  const submit = $("mr-license-submit");
  const normalized = mrNormalizeLicenseKey(key);
  if (!mrLicenseLooksLikeKey(normalized)) {
    if (!silent && status) { status.className = "error"; status.textContent = "Formato de chave inválido. Use MR-XXXX-XXXX-XXXX ou XXXXX-XXXXX-XXXXX-XXXXX-XXXXX."; }
    return false;
  }
  if (!silent && submit) { submit.disabled = true; submit.textContent = "⏳ A VALIDAR..."; }
  if (!silent && status) { status.className = ""; status.textContent = "A validar acesso com o MR Sem Limites..."; }
  try {
    const result = await mrValidateLicense(normalized, email);
    if (result?.valid !== true && result?.ok !== true) throw new Error(result?.error || "Licença inválida ou expirada.");
    const session = { key: normalized, email: String(email || "").trim(), validAt: new Date().toISOString(), expiresAt: result.expira_em || null, tipo: result.tipo || (result.premium ? "premium" : "teste") };
    await chrome.storage.local.set({ [MR_LICENSE_STORAGE_KEY]: session });
    document.body.classList.remove("license-locked");
    $("mr-license-gate")?.setAttribute("hidden", "hidden");
    if (!silent && status) { status.className = "ok"; status.textContent = "✅ Acesso autorizado."; }
    mrUpdateLicenseCountdown();
    window.setInterval(() => mrUpdateLicenseCountdown(), 30 * 1000);
    window.setInterval(() => mrLicenseHeartbeat(session), 6 * 60 * 60 * 1000);
    return true;
  } catch (error) {
    document.body.classList.add("license-locked");
    $("mr-license-gate")?.removeAttribute("hidden");
    if (!silent && status) { status.className = "error"; status.textContent = `❌ ${error?.message || "Licença inválida ou expirada."}`; }
    return false;
  } finally {
    if (!silent && submit) { submit.disabled = false; submit.textContent = "🔐 ATIVAR ACESSO"; }
  }
}

(async function initMrSocialGlowLicense() {
  if (MR_LICENSE_TESTING_BYPASS) {
    // Bypass de testes: libera o painel direto, sem chamar o backend de licenças.
    document.body.classList.remove("license-locked");
    $("mr-license-gate")?.setAttribute("hidden", "hidden");
    const badge = $("mr-license-countdown");
    if (badge) {
      badge.hidden = false;
      badge.textContent = "Modo de testes (licença não verificada)";
      badge.classList.remove("license-badge-warn");
    }
    return;
  }
  document.body.classList.add("license-locked");
  const submit = $("mr-license-submit");
  const keyInput = $("mr-license-key");
  const emailInput = $("mr-license-email");
  submit?.addEventListener("click", () => mrUnlockWithLicense(keyInput?.value, emailInput?.value));
  keyInput?.addEventListener("keydown", (event) => { if (event.key === "Enter") submit?.click(); });
  const saved = await new Promise((resolve) => chrome.storage.local.get([MR_LICENSE_STORAGE_KEY], resolve));
  if (saved?.[MR_LICENSE_STORAGE_KEY]?.key) {
    keyInput.value = saved[MR_LICENSE_STORAGE_KEY].key;
    if (emailInput) emailInput.value = saved[MR_LICENSE_STORAGE_KEY].email || "";
    await mrUnlockWithLicense(saved[MR_LICENSE_STORAGE_KEY].key, saved[MR_LICENSE_STORAGE_KEY].email || "", true);
  }
})();
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
let database = { whatsapp: {}, telegram: {}, instagram: {}, youtube: {} };
let currentPlat = "whatsapp";
let loaded = { whatsapp: null, telegram: null, instagram: null, youtube: null };
let selected = { whatsapp: new Set(), telegram: new Set(), instagram: new Set(), youtube: new Set() };
let filterText = { whatsapp: "", telegram: "", instagram: "", youtube: "" };
// Modo temporário: mantém Telegram, Instagram e YouTube preservados no código e no banco,
// mas bloqueados na interface até serem reativados numa atualização futura.
const WA_ONLY_MODE = true;
let activeExtractionJob = null;
let activeDispatchJob = null;
let dispatchCancelRequested = false;

function beginDispatchJob() {
  activeDispatchJob = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  dispatchCancelRequested = false;
  const btn = $("btnCancelDispatch");
  if (btn) { btn.style.display = "block"; btn.disabled = false; btn.textContent = "⏹ CANCELAR OPERAÇÃO"; }
  return activeDispatchJob;
}

async function finishDispatchJob(message = "Operação concluída.") {
  activeDispatchJob = null;
  const btn = $("btnCancelDispatch");
  if (btn) { btn.style.display = "none"; btn.disabled = false; }
  setStatus(message, 100);
}

$("btnCancelDispatch")?.addEventListener("click", async () => {
  if (!activeDispatchJob) return;
  dispatchCancelRequested = true;
  const job = activeDispatchJob;
  const btn = $("btnCancelDispatch");
  if (btn) { btn.disabled = true; btn.textContent = "⏳ CANCELANDO..."; }
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) await chrome.tabs.sendMessage(tab.id, { action: "CANCEL_DISPATCH", jobId: job }).catch(() => {});
  } catch (_) {}
  setStatus("⏹ Cancelamento solicitado. A operação será interrompida antes do próximo item.");
});

function getSelectedContacts(plat) {
  const name = loaded[plat];
  if (!name || !database[plat] || !database[plat][name]) return [];
  const all = database[plat][name];
  const sel = selected[plat];
  // Um conjunto vazio significa que o utilizador marcou explicitamente "Nenhum".
  // Só uma lista ainda não inicializada usa todos os registos por compatibilidade.
  if (!sel) return all.slice();
  return all.filter((_, i) => sel.has(i));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const setStatus = (t, progress = null, count = null, preview = null) => {
  // Atualizar Controle
  const text = $("statusText");
  if (text) text.textContent = t;
  const p = $("statusProgress");
  const pb = $("statusProgressBar");
  if (p && pb) {
    if (progress !== null && progress !== undefined) {
      p.style.display = "block";
      pb.style.width = Math.min(100, Math.max(0, Number(progress) || 0)) + "%";
    } else {
      p.style.display = "none";
      pb.style.width = "0%";
    }
  }
  const countEl = $("statusCount");
  if (countEl && count !== null && count !== undefined) {
    countEl.textContent = `${Number(count) || 0} contacto${Number(count) === 1 ? "" : "s"} encontrado${Number(count) === 1 ? "" : "s"}`;
  }
  const previewEl = $("statusPreview");
  if (previewEl && Array.isArray(preview)) {
    previewEl.textContent = preview.length ? preview.slice(-5).map((x) => contactOf(x)).filter(Boolean).join(" · ") : "";
  }
  
  // Atualizar também WA Extração
  const textWa = $("statusText-wa-extract");
  if (textWa) textWa.textContent = t;
  const pWa = $("statusProgress-wa-extract");
  const pbWa = $("statusProgressBar-wa-extract");
  if (pWa && pbWa) {
    if (progress !== null && progress !== undefined) {
      pWa.style.display = "block";
      pbWa.style.width = Math.min(100, Math.max(0, Number(progress) || 0)) + "%";
    } else {
      pWa.style.display = "none";
      pbWa.style.width = "0%";
    }
  }
  const countWa = $("statusCount-wa-extract");
  if (countWa && count !== null && count !== undefined) {
    countWa.textContent = `${Number(count) || 0} contacto${Number(count) === 1 ? "" : "s"} encontrado${Number(count) === 1 ? "" : "s"}`;
  }
  const previewWa = $("statusPreview-wa-extract");
  if (previewWa && Array.isArray(preview)) {
    previewWa.textContent = preview.length ? preview.slice(-5).map((x) => contactOf(x)).filter(Boolean).join(" · ") : "";
  }
};

chrome.runtime?.onMessage?.addListener((message) => {
  if (!message || message.type !== "MR_EXTRACT_PROGRESS") return;
  if (activeExtractionJob && message.jobId !== activeExtractionJob) return;
  const found = Number(message.found) || 0;
  const progress = Number.isFinite(Number(message.progress)) ? Number(message.progress) : null;
  setStatus(`⏳ ${message.stage || "A extrair"} · ${found} encontrados`, progress, found, message.preview || []);
});

// Normaliza item: string legado ou {n, c}
const asItem = (x) => {
  if (typeof x === "string") return { n: x, c: x, isAdmin: false };
  return {
    n: x?.n || x?.c || "",
    c: x?.c || "",
    isAdmin: !!x?.isAdmin,
    sentAt: x?.sentAt || null,
    sendCount: Number(x?.sendCount) || 0
  };
};
const contactOf = (x) => asItem(x).c;
const nameOf = (x) => asItem(x).n;

// Descrição ampliável: mantém o campo compacto por padrão e permite leitura longa.
$("btnExpandWaDescription")?.addEventListener("click", () => {
  const field = $("msg-whatsapp");
  const button = $("btnExpandWaDescription");
  if (!field || !button) return;
  const expanded = field.dataset.expanded === "1";
  field.dataset.expanded = expanded ? "0" : "1";
  field.style.minHeight = expanded ? "70px" : "280px";
  field.style.height = expanded ? "70px" : "280px";
  button.textContent = expanded ? "↕ Aumentar" : "↕ Recolher";
});

$("btnCopySecurityAppeal")?.addEventListener("click", async () => {
  const text = $("waSecurityAppeal")?.value || "";
  const status = $("securityCopyStatus");
  try {
    await navigator.clipboard.writeText(text);
    if (status) status.textContent = "✅ Modelo copiado. Substitua os campos entre colchetes antes de enviar.";
  } catch (_) {
    const field = $("waSecurityAppeal");
    field?.removeAttribute("readonly");
    field?.select();
    document.execCommand("copy");
    field?.setAttribute("readonly", "readonly");
    if (status) status.textContent = "✅ Modelo copiado para a área de transferência.";
  }
});

// ============ CRUZAMENTO DE GRUPOS ============
let crossGroups = [];
let crossPrimaryMembers = [];
let crossSecondaryGroups = [];
let crossScans = {};
const crossKey = (item) => {
  const x = asItem(item);
  const raw = String(x.c || x.phone || "");
  const digits = raw.replace(/\D/g, "");
  const id = String(x.id || x.uid || "").trim();
  return digits || id || "";
};
const crossLabel = (item) => {
  const x = asItem(item);
  return String(x.n || x.name || x.c || "Participante").trim();
};
const crossAdmin = (item) => !!(item?.isAdmin || item?.admin || /admin|administrador/i.test(String(item?.role || "")));

function renderCrossSelectors() {
  const primary = $("crossPrimaryGroup");
  const secondary = $("crossSecondaryGroup");
  const list = $("crossSecondaryList");
  if (!primary || !secondary || !list) return;
  const selectedPrimary = primary.value;
  const selectedSecondary = secondary.value;
  primary.innerHTML = '<option value="">Selecione o grupo principal</option>';
  crossGroups.forEach((name) => {
    const option = document.createElement("option"); option.value = name; option.textContent = name; primary.appendChild(option);
  });
  if (crossGroups.includes(selectedPrimary)) primary.value = selectedPrimary;
  secondary.innerHTML = '<option value="">Selecione um grupo secundário</option>';
  crossGroups.filter((name) => name !== primary.value && !crossSecondaryGroups.includes(name)).forEach((name) => {
    const option = document.createElement("option"); option.value = name; option.textContent = name; secondary.appendChild(option);
  });
  if (selectedSecondary && Array.from(secondary.options).some((option) => option.value === selectedSecondary)) {
    secondary.value = selectedSecondary;
  }
  list.innerHTML = crossSecondaryGroups.length ? crossSecondaryGroups.map((name) => {
    const count = Array.isArray(crossScans[name]) ? crossScans[name].length : 0;
    const safe = String(name).replace(/&/g,"&amp;").replace(/</g,"&lt;");
    return `<div style="display:flex;gap:8px;align-items:center;padding:8px;border-bottom:1px solid rgba(255,255,255,.08)"><span style="flex:1">${safe} <small>${count ? `· ${count} lidos` : "· ainda não lido"}</small></span><button class="btn btn-ghost cross-remove-secondary" data-group="${safe}" style="width:auto;padding:4px 8px">✕</button></div>`;
  }).join("") : '<div class="hint">Nenhum grupo secundário adicionado.</div>';
  list.querySelectorAll(".cross-remove-secondary").forEach((button) => button.addEventListener("click", () => {
    crossSecondaryGroups = crossSecondaryGroups.filter((name) => name !== button.dataset.group);
    delete crossScans[button.dataset.group]; renderCrossSelectors();
  }));
  const ready = !!primary.value;
  $("btnCrossScanPrimary").disabled = !ready;
  $("btnCrossAddSecondary").disabled = !ready || !secondary.value;
  $("btnCrossScanSecondary").disabled = !ready || !secondary.value;
  $("btnCrossRun").disabled = !crossPrimaryMembers.length || !crossSecondaryGroups.some((name) => Array.isArray(crossScans[name]));
}

$("btnCrossLoadGroups")?.addEventListener("click", async () => {
  const res = await sendToPage("LIST_WA_CHATS", { onlyGroups: true });
  if (!res?.ok) { $("crossStatus").textContent = "❌ " + (res?.error || "Abra o WhatsApp Web."); return; }
  crossGroups = Array.from(new Set((res.data || []).map((x) => nameOf(x)).filter(Boolean))).sort((a,b) => a.localeCompare(b, "pt-BR"));
  crossScans = {}; crossPrimaryMembers = []; crossSecondaryGroups = [];
  $("crossPrimaryGroup").disabled = false; $("crossSecondaryGroup").disabled = false;
  renderCrossSelectors();
  $("crossStatus").textContent = `✅ ${crossGroups.length} grupos carregados. Agora escolha o grupo principal.`;
});

$("crossPrimaryGroup")?.addEventListener("change", () => { crossPrimaryMembers = []; crossSecondaryGroups = []; crossScans = {}; $("crossPrimaryStatus").textContent = ""; renderCrossSelectors(); });
$("crossSecondaryGroup")?.addEventListener("change", () => renderCrossSelectors());

async function crossExtractCurrent(expectedGroup = "") {
  const res = await sendToPage("EXTRACT", { mode: "current", expectedGroup, jobId: `cross-${Date.now()}` });
  if (!res?.ok) throw new Error(res?.error || "Não foi possível ler os membros visíveis.");
  return Array.isArray(res.data) ? res.data : [];
}
async function crossOpenAndRead(group) {
  // Se o utilizador já deixou o grupo secundário aberto com o modal visível,
  // lê esse contexto primeiro; isto evita o falso sucesso de uma aba/painel antigo.
  try {
    const visible = await crossExtractCurrent(group);
    if (visible.length) return visible;
  } catch (_) {}
  const opened = await sendToPage("OPEN_WA_CHAT_BY_NAME", { name: group });
  if (!opened?.ok) throw new Error(opened?.error || `Não foi possível abrir “${group}”.`);
  // Grupos grandes abrem primeiro o painel resumido e só depois o modal
  // “Pesquisar membros/Ver tudo”; aguardamos o DOM antes de extrair.
  await sleep(4200);
  let data = await crossExtractCurrent(group);
  if (data.length) return data;
  await sleep(3500);
  data = await crossExtractCurrent(group);
  if (!data.length) throw new Error(`O grupo “${group}” foi aberto, mas a lista de membros ainda não ficou disponível. Aguarde o painel “Ver tudo” carregar e tente novamente.`);
  return data;
}

$("btnCrossScanPrimary")?.addEventListener("click", async () => {
  const primary = $("crossPrimaryGroup")?.value;
  if (!primary) return alert("Escolha o grupo principal primeiro.");
  try {
    $("crossStatus").textContent = `⏳ Lendo o grupo principal: ${primary}`;
    crossPrimaryMembers = await crossOpenAndRead(primary);
    crossScans[primary] = crossPrimaryMembers;
    $("crossPrimaryStatus").textContent = `✅ ${crossPrimaryMembers.length} participantes lidos.`;
    renderCrossSelectors(); renderCrossResults([]);
  } catch (e) { $("crossPrimaryStatus").textContent = `❌ ${e.message || e}`; }
});

$("btnCrossAddSecondary")?.addEventListener("click", () => {
  const group = $("crossSecondaryGroup")?.value;
  if (!group) return alert("Escolha um grupo secundário.");
  if (!crossSecondaryGroups.includes(group)) crossSecondaryGroups.push(group);
  renderCrossSelectors();
  $("crossStatus").textContent = `✅ Grupo secundário adicionado: ${group}. Agora clique em Ler grupo secundário.`;
});

$("btnCrossScanSecondary")?.addEventListener("click", async () => {
  const group = $("crossSecondaryGroup")?.value;
  if (!group) return alert("Escolha um grupo secundário.");
  if (!crossSecondaryGroups.includes(group)) crossSecondaryGroups.push(group);
  try {
    $("crossStatus").textContent = `⏳ Lendo o grupo secundário: ${group}`;
    crossScans[group] = await crossOpenAndRead(group);
    renderCrossSelectors();
    $("crossStatus").textContent = `✅ ${group}: ${crossScans[group].length} participantes lidos. Você pode ler outro secundário ou cruzar agora.`;
  } catch (e) { $("crossStatus").textContent = `❌ ${e.message || e}`; }
});

function renderCrossResults(rows) {
  const box = $("crossResults"); if (!box) return;
  if (!rows.length) { box.innerHTML = '<div class="hint">Nenhuma correspondência confirmada ainda.</div>'; return; }
  box.innerHTML = rows.map((r) => `<div style="padding:10px;border:1px solid var(--neon-cyan);border-radius:8px;margin-bottom:8px;background:rgba(0,220,255,.10);font-weight:700;text-decoration:underline"><div>${r.phone || r.id}</div><div style="font-weight:500;text-decoration:none">${r.name || "Nome não exposto"} · Administrador em: ${r.groups.join(", ")}</div></div>`).join("");
}

$("btnCrossRun")?.addEventListener("click", () => {
  const primary = $("crossPrimaryGroup")?.value;
  const readySecondary = crossSecondaryGroups.filter((group) => Array.isArray(crossScans[group]));
  if (!primary || !crossPrimaryMembers.length) return alert("Leia o grupo principal antes de cruzar.");
  if (!readySecondary.length) return alert("Adicione e leia pelo menos um grupo secundário antes de cruzar.");
  const primaryMap = new Map(crossPrimaryMembers.map((x) => [crossKey(x), x]).filter(([k]) => k));
  const matches = [];
  for (const group of readySecondary) for (const member of crossScans[group]) {
    const key = crossKey(member); if (!key || !crossAdmin(member)) continue;
    const base = primaryMap.get(key); if (!base) continue;
    let row = matches.find((m) => m.key === key);
    if (!row) { row = { key, phone: String(key).replace(/\D/g, "") || key, name: crossLabel(base) || crossLabel(member), groups: [] }; matches.push(row); }
    if (!row.groups.includes(group)) row.groups.push(group);
  }
  renderCrossResults(matches);
  $("crossStatus").textContent = `✅ Cruzamento concluído: ${matches.length} administrador(es) encontrados nos grupos secundários lidos.`;
});

// ============ STORAGE ============
chrome.storage?.local.get(["mr_db_v5", "mr_drafts_v5"], (r) => {
  if (r.mr_db_v5) {
    database = { whatsapp: {}, telegram: {}, instagram: {}, youtube: {}, ...r.mr_db_v5 };
    renderDatabase();
  }
  if (r.mr_drafts_v5) restoreDrafts(r.mr_drafts_v5);
});

// Auto-save de TODOS os campos de texto por id
const DRAFT_IDS = [
  "msg-whatsapp", "msg-telegram", "msg-instagram", "waTitle", "waMedia",
  "igTitle", "igMedia", "igPostUrl", "igTarget",
  "ytVideoUrl", "ytNotes", "warmupNumbers", "warmupMessage", "warmupFreq", "dispatchDelay", "dispatchType",
  "scheduleDate", "scheduleTime", "schedulePlatform"
];
function collectDrafts() {
  const out = {};
  DRAFT_IDS.forEach((id) => { const el = $(id); if (el) out[id] = el.value; });
  return out;
}
function restoreDrafts(d) {
  DRAFT_IDS.forEach((id) => { const el = $(id); if (el && typeof d[id] === "string") el.value = d[id]; });
}
let saveTimer = null;
function scheduleSaveDrafts() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    chrome.storage.local.set({ mr_drafts_v5: collectDrafts() });
  }, 300);
}
document.addEventListener("input", (e) => {
  if (e.target && DRAFT_IDS.includes(e.target.id)) scheduleSaveDrafts();
});

// ============ TABS / CHIPS ============
$$(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabId = btn.getAttribute("data-tab");
    if (!tabId) return;
    
    // Reset visual
    $$(".tab").forEach((b) => b.classList.remove("active"));
    $$(".card").forEach((c) => c.classList.remove("active"));
    
    // Activate
    btn.classList.add("active");
    const targetCard = $(tabId);
    if (targetCard) {
      targetCard.classList.add("active");
    }
    
    if (tabId === "db") renderDatabase();
    if (tabId === "schedule") {
      if (typeof window.renderScheduledDispatchTasks === 'function') {
        window.renderScheduledDispatchTasks();
      }
    }
  });
});

$$(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const plat = chip.getAttribute("data-plat");
    if (!plat) return;
    
    currentPlat = plat;
    $$(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    
    $$(".plat-block").forEach((b) => b.classList.remove("active"));
    const targetBlock = document.querySelector(`.plat-block[data-plat-block="${plat}"]`);
    if (targetBlock) {
      targetBlock.classList.add("active");
    }
    
    setStatus(`Rede: ${plat.toUpperCase()} · pronta para ação manual`);
    updateLoadedUI(plat);
  });
});

async function detectPlatform() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url) return;
  const url = tab.url;
  let p = null;
  if (url.includes("whatsapp.com")) p = "whatsapp";
  else if (url.includes("telegram.org")) p = "telegram";
  else if (url.includes("instagram.com")) p = "instagram";
  else if (url.includes("youtube.com")) p = "youtube";
  if (p) {
    if (WA_ONLY_MODE && p !== "whatsapp") p = "whatsapp";
    currentPlat = p;
    $$(".chip").forEach((c) => c.classList.toggle("active", c.dataset.plat === p));
    $$(".plat-block").forEach((b) => b.classList.toggle("active", b.dataset.platBlock === p));
  }
}
detectPlatform();
chrome.tabs?.onActivated?.addListener(detectPlatform);
chrome.tabs?.onUpdated?.addListener(detectPlatform);

const SUPPORTED_HOSTS = ["whatsapp.com", "telegram.org", "instagram.com", "youtube.com"];

function isSupportedPage(url) {
  try {
    const host = new URL(url || "").hostname;
    return SUPPORTED_HOSTS.some((part) => host === part || host.endsWith(`.${part}`));
  } catch (_) {
    return false;
  }
}

async function sendToPage(action, data = {}) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return { ok: false, error: "Nenhuma aba ativa encontrada." };
  if (!isSupportedPage(tab.url)) {
    return { ok: false, error: "Abra primeiro o WhatsApp Web, Telegram Web, Instagram ou YouTube na aba ativa." };
  }

  const payload = { action, ...data };
  const trySend = async () => chrome.tabs.sendMessage(tab.id, payload);
  const retrySend = async (attempts = 3) => {
    let lastError = null;
    for (let i = 0; i < attempts; i++) {
      try {
        const response = await trySend();
        if (response) return response;
      } catch (error) {
        lastError = error;
      }
      await sleep(250);
    }
    throw lastError || new Error("A página não devolveu resposta.");
  };

  try {
    const pong = await chrome.tabs.sendMessage(tab.id, { action: "PING" });
    if (pong?.ok) return await retrySend();
  } catch (_) {
    // O content script pode ainda não existir nesta navegação; reinjetamos abaixo.
  }

  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["scripts/automation.js"] });
    await sleep(250);
    return await retrySend(4);
  } catch (error) {
    const detail = String(error?.message || error || "");
    if (/Cannot access contents|not allowed|extensions gallery|chrome:\/\//i.test(detail)) {
      return { ok: false, error: "O navegador não permite executar nesta página. Abra uma aba normal da rede social." };
    }
    return { ok: false, error: "Não consegui ligar à página. Recarregue a aba da rede social e tente novamente." };
  }
}

// ============ EXTRAÇÃO ============
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-extract]");
  if (!btn) return;
  if (activeExtractionJob) return setStatus("⏳ Já existe uma extração em curso. Aguarde terminar.", 15);

  const kind = btn.getAttribute("data-extract");
  activeExtractionJob = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  const jobId = activeExtractionJob;
  setStatus("⏳ A iniciar a extração na página…", 3, 0, []);

  let res;
  try {
    if (kind === "instagram-post") {
      const url = ($("igPostUrl")?.value || "").trim();
      if (url) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url && !tab.url.includes(url.replace(/^https?:\/\//, ""))) {
          await chrome.tabs.update(tab.id, { url });
          setStatus("🌐 O post está a abrir. Clique novamente em extrair quando carregar.", 100, 0, []);
          activeExtractionJob = null;
          return;
        }
      }
      res = await sendToPage("EXTRACT", { mode: "post", jobId });
    } else {
      const mode = kind === "whatsapp-page" ? "page" : kind === "whatsapp-current" ? "current" : "";
      res = await sendToPage("EXTRACT", mode ? { mode, jobId } : { jobId });
    }
  } catch (err) {
    res = { ok: false, error: String(err?.message || "Falha na comunicação com a página. Recarregue a aba da rede social.") };
  } finally {
    activeExtractionJob = null;
  }

  if (res && res.ok) {
    handleExtractResult(res, kind.includes("whatsapp") ? "whatsapp" : (kind.includes("instagram") ? "instagram" : (kind === "youtube" ? "youtube" : "telegram")));
  } else {
    setStatus("❌ " + (res?.error || "Erro na extração."), 0);
  }
});

function composePlatformMessage(platform) {
  const msgEl = document.querySelector(`[data-msg="${platform}"]`);
  let msg = (msgEl?.value || "").trim();

  if (platform === "whatsapp") {
    const title = ($("waTitle")?.value || "").trim();
    const media = ($("waMedia")?.value || "").trim();
    msg = [title, msg, media].filter(Boolean).join("\n");
  }

  if (platform === "instagram") {
    const title = ($("igTitle").value || "").trim();
    const media = ($("igMedia").value || "").trim();
    msg = [title, msg, media].filter(Boolean).join("\n");
  }

  return msg;
}

function getDispatchDelay() {
  const input = $("dispatchDelay");
  const value = Number(input?.value || 15);
  const safe = Math.min(120, Math.max(5, Number.isFinite(value) ? value : 15));
  if (input) input.value = String(safe);
  return safe;
}

function expandSpintax(text) {
  // Só trata blocos que tenham opções separadas por |.
  // Assim, {nome}, {nome completo} e {telefone} ficam disponíveis para personalização.
  return String(text || "").replace(/\{([^{}]+)\}/g, (whole, choices) => {
    const values = String(choices).split("|").map((x) => x.trim()).filter(Boolean);
    return values.length > 1 ? values[rand(0, values.length - 1)] : whole;
  });
}

function messageForDispatch(platform, baseMessage) {
  const mode = $("dispatchType")?.value || "individual";
  return platform === "whatsapp" && mode === "alternado" ? expandSpintax(baseMessage) : baseMessage;
}

function uniqueListName(platform, base) {
  const clean = (base || "Lista").replace(/[\r\n;]/g, " ").trim().slice(0, 50) || "Lista";
  if (!database[platform]) database[platform] = {};
  if (!database[platform][clean]) return clean;
  let i = 2;
  while (database[platform][`${clean} (${i})`]) i++;
  return `${clean} (${i})`;
}

// Salva automático (sem perguntar), carrega a lista e marca todos
function handleExtractResult(res, platform) {
  if (res && res.ok) {
    const contacts = res.data || [];
    if (contacts.length > 0) {
      // Nome padrão baseado no grupo ou data
      const defaultName = res.name || `Lista ${new Date().toLocaleDateString()}`;
      const finalName = uniqueListName(platform, defaultName);
      
      // Salva no banco imediatamente para não perder
      database[platform][finalName] = contacts;
      chrome.storage.local.set({ mr_db_v5: database });
      
      // Carrega para a UI de revisão
      loaded[platform] = finalName;
      selected[platform] = new Set(contacts.map((_, i) => i));
      filterText[platform] = "";
      
      renderDatabase();
      updateLoadedUI(platform);
      
      // A lista agora aparece no footer, não precisa mudar de aba
      // mas garantimos que o footer seja scrollado para visibilidade
      setTimeout(() => {
        const title = $("extra-list-title");
        if (title) title.scrollIntoView({ behavior: 'smooth' });
      }, 500);

      setStatus(`✅ ${contacts.length} contatos extraídos. REVISE a lista abaixo antes de usar.`, 100, contacts.length, contacts);
    } else {
      setStatus(`❌ Nenhum contacto visível. ${res.hint || ""}`, 0, 0, []);
    }
  } else {
    setStatus("❌ " + (res?.error || "Erro na extração."), 0);
  }
}


// ============ DISPARO ============
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-send]");
  if (!btn) return;

  const platform = btn.getAttribute("data-send");
  const msg = composePlatformMessage(platform);
  if (!msg) return alert("Digite a mensagem antes de enviar.");

  if (!loaded[platform]) {
    const lists = Object.keys(database[platform] || {});
    if (!lists.length) return alert(`Nenhuma lista salva em ${platform.toUpperCase()}. Extraia contactos primeiro.`);
    const pick = lists.length === 1 ? lists[0] : prompt(`Qual lista usar? (${lists.join(" | ")})`, lists[0]);
    if (!pick || !database[platform][pick]) return;
    loaded[platform] = pick;
    selected[platform] = new Set();
    updateLoadedUI(platform);
  }

  const contacts = getSelectedContacts(platform);
  if (!contacts.length) return alert("Nenhum contacto selecionado. Marque os checkboxes ou use 'Todos'.");

  const delay = getDispatchDelay();
  const mode = $("dispatchType")?.value === "alternado" ? "Texto alternado (sorteia opções)" : "Texto fixo (igual para todos)";
  const ok = confirm(`ENVIAR PARA CONTATOS SELECIONADOS\n\nQuantidade: ${contacts.length}\nModo: ${mode}\nIntervalo: ${delay}s entre cada contato.\n\nO WhatsApp Web precisa estar aberto e conectado.\nConfirme que você tem autorização para contactar esta lista.`);
  if (!ok) return;

  setStatus(`⏳ A preparar 0/${contacts.length}…`, 0, 0, []);
  if (platform === "whatsapp") {
    await sendWhatsAppSequential(contacts, msg);
    return;
  }

  let sent = 0;
  let failed = 0;
  for (let i = 0; i < contacts.length; i++) {
    const raw = contactOf(contacts[i]);
    const handle = String(raw || "").replace(/^@/, "").trim();
    const url = platform === "telegram"
      ? `https://web.telegram.org/k/#@${encodeURIComponent(handle)}`
      : platform === "instagram"
        ? `https://www.instagram.com/${encodeURIComponent(handle)}/`
        : null;

    if (!url) { failed++; continue; }
    try {
      const tab = await chrome.tabs.create({ url, active: true });
      await waitTabReady(tab.id, 35000);
      await sleep(2500);
      const personalMsg = personalizeWithContactName(messageForDispatch(platform, msg), contacts[i]);
      const res = await sendMessageToTab(tab.id, personalMsg, null);
      if (res?.ok) sent++; else failed++;
    } catch (_) {
      failed++;
    }
    const progress = ((i + 1) / contacts.length) * 100;
    setStatus(`📨 Processados ${i + 1}/${contacts.length} · enviados ${sent} · falhas ${failed}`, progress, sent, []);
    if (i < contacts.length - 1) await sleep(delay * 1000);
  }
  setStatus(`✅ Processo concluído · ${sent} enviados · ${failed} falhas.`, 100, sent, []);
});

async function waitTabReady(tabId, timeoutMs = 35000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const tab = await chrome.tabs.get(tabId).catch(() => null);
    if (tab?.status === "complete") return true;
    await sleep(500);
  }
  return false;
}

async function sendMessageToTab(tabId, message, media) {
  if (!tabId) return { ok: false, error: "Aba de destino inválida." };
  const payload = { action: "SEND_OPEN_CHAT", message, media: media || null };
  try {
    const response = await chrome.tabs.sendMessage(tabId, payload);
    return response || { ok: false, error: "A página não devolveu confirmação." };
  } catch (_e) {
    try {
      await chrome.scripting.executeScript({ target: { tabId }, files: ["scripts/automation.js"] });
      await sleep(800);
      return await chrome.tabs.sendMessage(tabId, payload);
    } catch (error) {
      return { ok: false, error: String(error?.message || "Não consegui ligar à aba de destino.") };
    }
  }
}

function markWhatsAppContactSent(contact) {
  const phone = String(contactOf(contact) || '').replace(/\D/g, '');
  const listName = loaded.whatsapp;
  const list = listName && database.whatsapp?.[listName];
  if (!phone || !Array.isArray(list)) return;
  const item = list.find((entry) => String(contactOf(entry) || '').replace(/\D/g, '') === phone);
  if (!item) return;
  item.sentAt = new Date().toISOString();
  item.sendCount = (Number(item.sendCount) || 0) + 1;
  chrome.storage.local.set({ mr_db_v5: database });
  updateLoadedUI('whatsapp');
}

async function sendWhatsAppSequential(contacts, msg) {
  const dispatchJobId = beginDispatchJob();
  async function sendTextThenMedia(tabId, text, media) {
    const hasMedia = Array.isArray(media) ? media.length > 0 : !!media;
    if (!hasMedia) return sendMessageToTab(tabId, text, null);
    if (text) {
      const textResult = await sendMessageToTab(tabId, text, null);
      if (!textResult?.ok) return textResult;
    }
    return sendMessageToTab(tabId, "", media);
  }
  const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!active?.id) return setStatus("❌ Nenhuma aba ativa para abrir o WhatsApp Web.");

  let tabId = active.id;
  if (!String(active.url || "").includes("whatsapp.com")) {
    const existing = (await chrome.tabs.query({})).find((tab) => String(tab.url || "").includes("whatsapp.com"));
    if (existing?.id) tabId = existing.id;
    else {
      const tab = await chrome.tabs.create({ url: "https://web.whatsapp.com/", active: true });
      tabId = tab.id;
      setStatus("🌐 A abrir o WhatsApp Web…", 0, 0, []);
      await waitTabReady(tabId, 45000);
      await sleep(4500);
    }
  }

  const delay = getDispatchDelay();
  let sent = 0;
  let failed = 0;
  for (let i = 0; i < contacts.length; i++) {
    if (dispatchCancelRequested) {
      await finishDispatchJob(`⏹ Operação cancelada · ${sent} enviados · ${failed} falhas.`);
      return;
    }
    const phone = String(contactOf(contacts[i]) || "").replace(/\D/g, "");
    if (!phone) {
      failed++;
      setStatus(`⚠️ Contacto ${i + 1}/${contacts.length} sem número válido`, ((i + 1) / contacts.length) * 100, sent, []);
      continue;
    }

    // Monta o texto antes de navegar. O parâmetro text é um fallback nativo do WhatsApp Web.
    const baseMsg = messageForDispatch("whatsapp", msg);
    const contactMessage = personalizeWithContactName(baseMsg, contacts[i]);
    // Não pré-preenche a mensagem pela URL: o WhatsApp pode enviá-la ao carregar
    // e depois a rotina enviaria novamente. O texto será enviado uma única vez
    // por sendTextThenMedia, após a conversa estar pronta.
    setStatus(`📨 WhatsApp ${i + 1}/${contacts.length} · a abrir contacto…`, (i / contacts.length) * 100, sent, [contacts[i]]);
    await chrome.tabs.update(tabId, { url: `https://web.whatsapp.com/send?phone=${encodeURIComponent(phone)}` });
    await waitTabReady(tabId, 40000);
    await sleep(3500);

    const res = await sendTextThenMedia(tabId, contactMessage, getWaMediaPayload());
    if (res?.ok) { sent++; markWhatsAppContactSent(contacts[i]); }
    else failed++;

    const progress = ((i + 1) / contacts.length) * 100;
    setStatus(`📨 Processados ${i + 1}/${contacts.length} · enviados ${sent} · falhas ${failed}`, progress, sent, [contacts[i]]);
    if (i < contacts.length - 1) {
      for (let remaining = delay * 1000; remaining > 0; remaining -= 250) {
        if (dispatchCancelRequested) {
          await finishDispatchJob(`⏹ Operação cancelada · ${sent} enviados · ${failed} falhas.`);
          return;
        }
        await sleep(Math.min(250, remaining));
      }
    }
  }
  await finishDispatchJob(`✅ WhatsApp concluído · ${sent} enviados · ${failed} falhas.`);
}

// ============ MELHORIA v7.3: Buscar nomes dos contatos (DOM do WhatsApp Web) ============
let resolvingBusy = false;
$("btnResolveNames")?.addEventListener("click", async () => {
  if (resolvingBusy) return setStatus("⏳ Busca de nomes já em andamento…");
  if (currentPlat !== "whatsapp") return alert("Selecione o chip WhatsApp antes de buscar nomes.");
  const name = loaded.whatsapp;
  if (!name || !database.whatsapp?.[name]) return alert("Carregue uma lista de contatos primeiro (Banco ou extração recente).");
  const contacts = database.whatsapp[name];
  if (!contacts.length) return alert("A lista está vazia.");

  // Seleciona lista caso não esteja carregada
  loaded.whatsapp = name;
  updateLoadedUI("whatsapp");

  const info = $("resolveInfo");
  resolvingBusy = true;
  let resolved = 0;
  const started = Date.now();

  // Varre a lista de chats do WhatsApp Web para construir mapa número->nome
  // (a lista esquerda mostra o nome que o WhatsApp exibe para cada contato)
  let nameByPhone = new Map();
  try {
    const [waTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (waTab?.url?.includes("whatsapp.com")) {
      // Pede à aba do WhatsApp que faça a varredura da lista de chats
      const res = await sendToPage("SCAN_CHAT_LIST", {});
      if (res?.ok && Array.isArray(res.entries)) {
        res.entries.forEach((e) => {
          if (e.phone && e.name && e.name !== e.phone) nameByPhone.set(e.phone, e.name);
        });
      }
    }
  } catch (_) {}

  const refreshInfo = () => {
    if (info) info.textContent = `🔍 Resolvidos ${resolved}/${contacts.length} · ${nameByPhone.size} nomes na lista`;
  };
  refreshInfo();

  // Aplica nomes encontrados pela varredura da lista de chats
  let applied = 0;
  contacts.forEach((x) => {
    const it = asItem(x);
    const phone = String(it.c || "").replace(/\D/g, "");
    if (!it.n || it.n === it.c) {
      const found = nameByPhone.get(phone);
      if (found) { x.n = found; x.c = it.c; applied++; }
    }
    resolved++;
    refreshInfo();
  });

  // Fallback: contatos sem nome na varredura → abre cada um na busca do WhatsApp
  // e tenta ler o nome exibido (só para poucos, para não sobrecarregar)
  const missing = contacts.filter((x) => asItem(x).n === asItem(x).c);
  if (missing.length && missing.length <= 40 && waTabActive()) {
    setStatus(`🔍 A buscar ${missing.length} nomes restantes pela busca do WhatsApp Web…`, 0, resolved - applied, []);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url?.includes("whatsapp.com")) {
      // Abre a aba de participantes do grupo ou usa a varredura do DOM
      // Tentativa: pesquisa pelo número no campo de busca e lê o resultado
      for (let i = 0; i < missing.length; i++) {
        const it = asItem(missing[i]);
        const phone = String(it.c || "").replace(/\D/g, "");
        if (nameByPhone.has(phone)) { resolved++; refreshInfo(); continue; }
        try {
          const res = await sendToPage("RESOLVE_NAME", { phone });
          if (res?.ok && res.name) {
            missing[i].n = res.name;
            nameByPhone.set(phone, res.name);
            applied++;
          }
        } catch (_) {}
        resolved++;
        refreshInfo();
        await sleep(400);
        if (Date.now() - started > 240000) break; // 4 minutos máximo
      }
    }
  }

  chrome.storage.local.set({ mr_db_v5: database });
  renderDatabase();
  updateLoadedUI("whatsapp");
  resolvingBusy = false;
  setStatus(`✅ Busca concluída · ${applied} nome${applied === 1 ? "" : "s"} recuperado${applied === 1 ? "" : "s"} (de ${contacts.length} contatos).`, 100, applied, []);
});

function waTabActive() {
  return !!document.location.href.includes("whatsapp.com");
}

// ============ MELHORIA v7.3: Personalização com nome do contato ============
function personalizeWithContactName(template, contact) {
  const it = asItem(contact);
  const fullName = String(it.n || "").trim();
  const firstName = fullName.split(/\s+/)[0] || fullName;
  const phone = String(it.c || "").replace(/\D/g, "");
  let msg = String(template || "");
  msg = msg.replace(/\{nome completo\}|\{nome_completo\}/gi, fullName || phone);
  msg = msg.replace(/\{nome\}/gi, firstName || phone);
  msg = msg.replace(/\{primeiro_nome\}|\{first_name\}/gi, firstName || phone);
  msg = msg.replace(/\{telefone\}/gi, phone);
  return msg;
}

// ============ UPLOAD DE MÍDIA (imagem / vídeo) ============
let waMediaFile = null; // compatibilidade: primeiro arquivo ou arquivo único
let waMediaFiles = [];
let waMediaLoading = false;

function getWaMediaPayload() {
  return waMediaFiles.length > 1 ? waMediaFiles : (waMediaFiles[0] || waMediaFile || null);
}

function setWaMediaProgress(percent, status, fileLabel = "") {
  const wrap = $("waMediaProgress");
  const bar = $("waMediaProgressBar");
  const pct = $("waMediaProgressPct");
  const st = $("waMediaProgressStatus");
  const file = $("waMediaProgressFile");
  if (wrap) wrap.style.display = "block";
  const safe = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));
  if (bar) bar.style.width = `${safe}%`;
  if (pct) pct.textContent = `${safe}%`;
  if (st) st.textContent = status || "Carregando vídeo...";
  if (fileLabel && file) file.textContent = fileLabel;
}

function finishWaMediaProgress(status, ok = true) {
  setWaMediaProgress(ok ? 100 : 0, status);
  const bar = $("waMediaProgressBar");
  if (bar) bar.style.background = ok ? "linear-gradient(90deg,var(--neon-green),var(--neon-cyan))" : "var(--neon-red)";
}

function readFileAsDataUrl(file, onProgress) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === "function") onProgress((event.loaded / event.total) * 100);
    };
    fr.onload = () => resolve(fr.result);
    fr.onerror = () => reject(new Error("Falha ao ler o arquivo."));
    fr.readAsDataURL(file);
  });
}

const waMediaSourceFiles = { images: [], video: null };

function renderWaImageList() {
  const list = $("waImageList");
  const addLabel = $("waImageAddLabel");
  if (addLabel) addLabel.textContent = waMediaSourceFiles.images.length < 4 ? `+ (${waMediaSourceFiles.images.length}/4)` : "(limite atingido)";
  if (!list) return;
  list.innerHTML = waMediaSourceFiles.images.length
    ? waMediaSourceFiles.images.map((file, index) => `<div style="display:flex;justify-content:space-between;gap:6px;align-items:center;"><span>🖼️ ${index + 1}. ${String(file.name).replace(/[&<>]/g, "")}</span><button type="button" class="btn btn-ghost" data-remove-wa-image="${index}" style="font-size:9px;padding:3px 6px;">×</button></div>`).join("")
    : "Nenhuma imagem selecionada.";
  list.querySelectorAll("[data-remove-wa-image]").forEach((btn) => btn.addEventListener("click", () => {
    waMediaSourceFiles.images.splice(Number(btn.dataset.removeWaImage), 1);
    renderWaImageList();
    rebuildWaMediaPayload();
  }));
}

// Detecta se o container/codec do vídeo é reproduzível pelo WhatsApp Web.
// MP4/WebM passam normalmente; MOV/AVI/MKV/WMV/3GP/FLV/MPEG e afins são
// marcados para envio como DOCUMENTO (chegam íntegros, sem "incompatível").
function detectMediaCompat(file) {
  const type = String(file.type || "").toLowerCase();
  const name = String(file.name || "").toLowerCase();
  const ext = name.includes(".") ? name.split(".").pop() : "";
  if (!type.startsWith("video/") && !/^(mov|avi|mkv|wmv|3gp|flv|mpg|mpeg|m4v|ts|ogv)$/.test(ext)) {
    return { asDocument: false, note: "" };
  }
  const nativeOk = /^(mp4|webm|m4v)$/.test(ext) || /video\/(mp4|webm)/.test(type);
  let playable = false;
  try {
    const probe = document.createElement("video");
    playable = !!type && probe.canPlayType(type) !== "";
  } catch (_) { playable = false; }
  if (nativeOk && (playable || !type)) return { asDocument: false, note: "" };
  return {
    asDocument: true,
    note: `${file.name}: formato ${ext ? ext.toUpperCase() : type || "desconhecido"} sem prévia no WhatsApp Web — será enviado como documento (arquivo completo).`,
  };
}

async function rebuildWaMediaPayload() {
  const files = [...waMediaSourceFiles.images, waMediaSourceFiles.video].filter(Boolean);
  const info = $("waFileInfo");
  renderWaImageList();
  if (!files.length) {
    waMediaFile = null; waMediaFiles = []; waMediaLoading = false;
    if (info) info.textContent = "Nenhuma mídia selecionada.";
    const progress = $("waMediaProgress"); if (progress) progress.style.display = "none";
    return;
  }
  const oversized = files.find((file) => file.size / (1024 * 1024) > 60);
  if (oversized) {
    if (oversized.type.startsWith("video/")) waMediaSourceFiles.video = null;
    else waMediaSourceFiles.images = waMediaSourceFiles.images.filter((file) => file !== oversized);
    renderWaImageList();
    finishWaMediaProgress(`Arquivo recusado: ${oversized.name} excede 60 MB`, false);
    if (info) info.textContent = "❌ Cada imagem ou vídeo precisa ter no máximo 60 MB.";
    return;
  }
  waMediaLoading = true; waMediaFile = null; waMediaFiles = [];
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const label = files.map((file) => `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`).join(" + ");
  setWaMediaProgress(0, `Carregando ${files.length} mídia(s)...`, label);
  if (info) info.textContent = `⏳ Carregando ${label}...`;
  try {
    let loadedBytes = 0;
    for (const file of files) {
      const dataUrl = await readFileAsDataUrl(file, (percent) => {
        setWaMediaProgress(((loadedBytes + file.size * percent / 100) / totalBytes) * 100, `Carregando ${file.name}...`, label);
      });
      const compat = detectMediaCompat(file);
      waMediaFiles.push({ dataUrl, name: file.name, type: file.type, size: file.size, asDocument: compat.asDocument, compatNote: compat.note });
      loadedBytes += file.size;
    }
    waMediaFile = waMediaFiles[0] || null; waMediaLoading = false;
    const notes = waMediaFiles.map((m) => m.compatNote).filter(Boolean);
    finishWaMediaProgress(`${files.length} mídia(s) pronta(s) para enviar`, true);
    if (info) info.textContent = `📎 ${label} · pronto para enviar` + (notes.length ? ` — ⚠️ ${notes.join(" · ")}` : "");
  } catch (err) {
    waMediaFile = null; waMediaFiles = []; waMediaLoading = false;
    finishWaMediaProgress("Falha ao carregar a mídia", false);
    if (info) info.textContent = "❌ " + (err?.message || "Erro ao ler arquivo.");
  }
}

$("waImageFile")?.addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  e.target.value = "";
  if (!file) return;
  if (waMediaSourceFiles.images.length >= 4) return alert("Você pode adicionar no máximo 4 imagens.");
  waMediaSourceFiles.images.push(file);
  renderWaImageList();
  rebuildWaMediaPayload();
});
$("waVideoFile")?.addEventListener("change", (e) => { waMediaSourceFiles.video = e.target.files?.[0] || null; rebuildWaMediaPayload(); });

$("btnWaClearFile")?.addEventListener("click", () => {
  waMediaFile = null;
  waMediaFiles = [];
  [$("waImageFile"), $("waVideoFile")].forEach((inp) => { if (inp) inp.value = ""; });
  waMediaSourceFiles.images = [];
  waMediaSourceFiles.video = null;
  renderWaImageList();
  const info = $("waFileInfo");
  if (info) info.textContent = "Nenhuma mídia selecionada.";
  waMediaLoading = false;
  const progress = $("waMediaProgress");
  if (progress) progress.style.display = "none";
  setStatus("🗑️ Toda a mídia foi removida.");
});

$("btnSendWaOpenChat")?.addEventListener("click", async () => {
  if (waMediaLoading) return alert("Aguarde o vídeo terminar de carregar antes de enviar.");
  const msg = composePlatformMessage("whatsapp");
  const mediaCount = waMediaFiles.length || (waMediaFile ? 1 : 0);
  if (!msg && !mediaCount) return alert("Digite a mensagem ou escolha um arquivo antes de enviar.");
  const ok = confirm(`Enviar ${mediaCount ? `${mediaCount} arquivo(s) + ` : ""}mensagem na conversa/grupo aberto agora?`);
  if (!ok) return;
  setStatus(mediaCount ? `📎 Anexando e enviando ${mediaCount} mídia(s)...` : "💬 Enviando no chat aberto...");
  const mediaPayload = getWaMediaPayload();
  let res = msg ? await sendToPage("SEND_OPEN_CHAT", { message: msg, media: null }) : { ok: true };
  if (res?.ok && mediaPayload) res = await sendToPage("SEND_OPEN_CHAT", { message: "", media: mediaPayload });
  if (res?.ok) {
    setStatus(res.mediaCount ? `✅ Enviado no chat/grupo aberto (${res.sentCount ?? res.mediaCount}/${res.mediaCount} mídia(s)).` : "✅ Enviado no chat/grupo aberto.");
  } else if (res?.mediaCount && res?.sentCount) {
    setStatus(`⚠️ Enviado parcialmente: ${res.sentCount}/${res.mediaCount} mídia(s). ${res.error || ""}`);
  } else {
    setStatus("❌ " + (res?.error || "Abra a conversa/grupo no WhatsApp."));
  }
});


// ============ GRUPOS / COMUNIDADES WHATSAPP ============
let waGroups = [];
let waGroupsSel = new Set();
let waGroupsFilter = "";

function renderWaGroups() {
  const box = $("wa-groups-box");
  if (!box) return;
  if (!waGroups.length) { box.style.display = "none"; box.innerHTML = ""; return; }
  box.style.display = "block";
  const f = waGroupsFilter.toLowerCase();
  const rows = waGroups.map((g, i) => {
    if (f && !g.toLowerCase().includes(f)) return "";
    return `<label class="cl-row"><input type="checkbox" data-wg-idx="${i}" ${waGroupsSel.has(i) ? "checked" : ""}/> <span class="cl-name">${escapeHtml(g)}</span></label>`;
  }).join("");
  box.innerHTML = `
    <div class="ll-head">
      <span>📣 <strong>${waGroups.length} grupos</strong> · <span class="wg-count">${waGroupsSel.size} selecionados</span></span>
    </div>
    <div class="ll-tools">
      <button data-wg-act="all">✓ Todos</button>
      <button data-wg-act="none">✕ Nenhum</button>
      <button data-wg-act="first20">Top 20</button>
      <button data-wg-act="last20">Last 20</button>
      <button data-wg-act="invert">↔ Inverter</button>
    </div>
    <input class="ll-search" placeholder="🔍 Filtrar grupo/comunidade..." value="${escapeHtml(waGroupsFilter)}"/>
    <div class="checklist">${rows || '<p style="font-size:10px;color:#666;text-align:center;padding:8px">Nada encontrado.</p>'}</div>
  `;
  box.querySelectorAll("input[data-wg-idx]").forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const idx = Number(e.target.dataset.wgIdx);
      if (e.target.checked) waGroupsSel.add(idx); else waGroupsSel.delete(idx);
      const c = box.querySelector(".wg-count");
      if (c) c.textContent = `${waGroupsSel.size} selecionados`;
    });
  });
  box.querySelectorAll("[data-wg-act]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const act = btn.dataset.wgAct;
      if (act === "all") waGroupsSel = new Set(waGroups.map((_, i) => i));
      else if (act === "none") waGroupsSel = new Set();
      else if (act === "first20") waGroupsSel = new Set(waGroups.map((_, i) => i).slice(0, 20));
      else if (act === "last20") waGroupsSel = new Set(waGroups.map((_, i) => i).slice(-20));
      else if (act === "invert") { const ns = new Set(); waGroups.forEach((_, i) => { if (!waGroupsSel.has(i)) ns.add(i); }); waGroupsSel = ns; }
      renderWaGroups();
    });
  });
  const search = box.querySelector(".ll-search");
  if (search) {
    search.addEventListener("input", (e) => {
      const val = e.target.value;
      waGroupsFilter = val;
      renderWaGroups();
      const s2 = $("wa-groups-box").querySelector(".ll-search");
      if (s2) { s2.focus(); s2.setSelectionRange(val.length, val.length); }
    });
  }
}

$("btnWaLoadGroups")?.addEventListener("click", async () => {
  const all = !!$("waAllChats")?.checked;
  setStatus(all ? "⏳ Lendo TODOS os chats..." : "⏳ Lendo grupos e comunidades...", 20);
  
  const res = await sendToPage("LIST_WA_CHATS", { onlyGroups: !all });
  
  if (!res?.ok) {
    setStatus("❌ " + (res?.error || "Falha ao carregar."), 0);
    return;
  }

  waGroups = (res.data || []).map((x) => nameOf(x)).filter(Boolean);
  waGroupsSel = new Set();
  waGroupsFilter = "";
  renderWaGroups();
  
  if (waGroups.length > 0) {
    setStatus(`✅ ${waGroups.length} chats carregados.`, 100);
    setTimeout(() => setStatus("Grupos carregados · reveja a seleção antes de enviar"), 3000);
  } else {
    setStatus("❌ Nenhum chat encontrado.", 0);
  }
});

$("btnWaBroadcastGroups")?.addEventListener("click", async () => {
  if (waMediaLoading) return alert("Aguarde o vídeo terminar de carregar antes de enviar.");
  const msg = composePlatformMessage("whatsapp");
  const names = waGroups.filter((_, i) => waGroupsSel.has(i));
  if (!msg && !waMediaFile) return alert("Digite a mensagem (título / link / descrição) ou escolha um arquivo antes de enviar.");
  if (!names.length) return alert("Marque pelo menos um grupo ou comunidade.");

  const delay = getDispatchDelay();
  const ok = confirm(`Enviar para ${names.length} conversa(s)?\nIntervalo mínimo: ${delay}s.\n\nConfirme que tem autorização para publicar nestes espaços.`);
  if (!ok) return;

  const jobId = beginDispatchJob();
  setStatus(`📣 A preparar 0/${names.length}…`, 0, 0, []);
  const res = await sendToPage("BROADCAST_WA_CHATS", {
    names,
    message: msg,
    media: getWaMediaPayload(),
    delay,
    jobId,
  });

  if (res?.ok) {
    const sent = res.sent || 0;
    const failed = res.failed || 0;
    setStatus(`✅ Grupos concluídos · ${sent} enviados · ${failed} falhas.`, 100, sent, []);
    if (res.errors?.length) {
      console.warn("Falhas nos grupos:", res.errors);
      const details = res.errors.slice(0, 3).join("\\n");
      alert(`Resultado do envio para grupos:\\n\\nEnviados: ${sent}\\nFalhas: ${failed}\\n\\n${details}\\n\\nSe aparecer “somente administradores”, sua conta precisa ser administradora daquele grupo.`);
    }
  } else if (res?.cancelled) {
    await finishDispatchJob(`⏹ Operação cancelada · ${res.sent || 0} enviados.`);
  } else {
    await finishDispatchJob("❌ " + (res?.error || "Falha no envio para os grupos."));
  }
});


// ============ SELEÇÃO DE CONTATOS DO WHATSAPP ============
window.selectContactsFromWhatsApp = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.includes('whatsapp.com')) return alert('Abra o WhatsApp Web primeiro.');
  
  setStatus('📞 A extrair seus contatos do WhatsApp...', 10, 0, []);
  try {
    const res = await sendToPage('GET_CONTACTS', {});
    if (res?.ok && res.contacts?.length) {
      const selected = res.contacts.slice(0, 10).map(c => String(c).replace(/\D/g, '')).filter(c => c.length >= 10);
      $('warmupNumbers').value = selected.join('\n');
      setStatus(`✅ ${selected.length} contatos carregados. Você pode editar a lista.`);
    } else {
      setStatus('⚠️ Nenhum contato encontrado. Digite manualmente.');
    }
  } catch (e) {
    setStatus('❌ Erro ao extrair contatos: ' + String(e?.message || e));
  }
};

// ============ ESQUENTA CHIP ============
let warmupTimer = null;
let warmupBusy = false;
$("btnStartWarmup")?.addEventListener("click", () => {
  if (warmupTimer) return setStatus("⚠️ O Esquenta já está ativo. Use Parar antes de iniciar novamente.");
  const numbers = Array.from(new Set(
    String($("warmupNumbers")?.value || "")
      .split(/[\n,;]+/)
      .map((n) => n.replace(/\D/g, ""))
      .filter((n) => n.length >= 10 && n.length <= 15)
  ));
  const freqInput = $("warmupFreq");
  const freq = Math.min(1440, Math.max(5, Number(freqInput?.value || 5)));
  if (freqInput) freqInput.value = String(freq);
  const text = String($("warmupMessage")?.value || "").trim();

  if (numbers.length < 2) return alert("Insira pelo menos 2 números válidos, um por linha.");
  if (!text) return alert("Escreva a mensagem que será enviada no aquecimento.");
  if (!$("warmupConsent")?.checked) return alert("Confirme que todos os números autorizaram estas mensagens.");

  let attempted = 0;
  let sent = 0;
  let failed = 0;
  setStatus(`🔥 Esquenta ativo · próxima tentativa em ${freq} min`, 0, 0, []);
  $("btnStartWarmup").style.display = "none";
  $("btnStopWarmup").style.display = "block";

  const runWarmup = async () => {
    if (warmupBusy) return;
    warmupBusy = true;
    const target = numbers[rand(0, numbers.length - 1)];
    attempted++;
    try {
      const tabs = await chrome.tabs.query({});
      const tab = tabs.find((candidate) => String(candidate.url || "").includes("whatsapp.com"));
      if (!tab?.id) throw new Error("Abra o WhatsApp Web para executar o próximo ciclo.");
      await chrome.tabs.update(tab.id, { url: `https://web.whatsapp.com/send?phone=${encodeURIComponent(target)}` });
      await waitTabReady(tab.id, 40000);
      await sleep(3000);
      const res = await sendMessageToTab(tab.id, text, null);
      if (res?.ok) sent++; else throw new Error(res?.error || "A página não confirmou o envio.");
      setStatus(`🔥 Esquenta · ${sent} enviados · ${failed} falhas · próximo em ${freq} min`, null, sent, [target]);
    } catch (error) {
      failed++;
      setStatus(`⚠️ Esquenta · ${sent} enviados · ${failed} falhas · ${String(error?.message || error)}`, null, sent, [target]);
    } finally {
      warmupBusy = false;
    }
  };

  runWarmup();
  warmupTimer = setInterval(runWarmup, freq * 60 * 1000);
});

$("btnStopWarmup")?.addEventListener("click", () => {
  clearInterval(warmupTimer);
  warmupTimer = null;
  warmupBusy = false;
  setStatus("🛑 Esquenta parado. Nenhum novo envio será iniciado.");
  $("btnStartWarmup").style.display = "block";
  $("btnStopWarmup").style.display = "none";
});
// ============ ADICIONAR AO GRUPO ============
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-addgroup]");
  if (!btn) return;
  
  const platform = btn.getAttribute("data-addgroup");
  if (!loaded[platform]) {
    const lists = Object.keys(database[platform] || {});
    if (!lists.length) return alert(`Nenhuma lista salva em ${platform.toUpperCase()}.`);
    const pick = lists.length === 1 ? lists[0] : prompt(`Qual lista usar? (${lists.join(" | ")})`, lists[0]);
    if (!pick || !database[platform][pick]) return;
    loaded[platform] = pick;
    selected[platform] = new Set();
    updateLoadedUI(platform);
  }
  const contacts = getSelectedContacts(platform);
  if (!contacts.length) return alert("Nenhum contato selecionado.");
  const ok = confirm(`Adicionar ${contacts.length} contatos ao grupo aberto em ${platform.toUpperCase()}?\nAbra o grupo de destino ANTES de confirmar.`);
  if (!ok) return;
  setStatus(`➕ Adicionando 0/${contacts.length}...`);
  const targets = contacts.map((x) => contactOf(x)).filter(Boolean);
  const res = await sendToPage("ADD_TO_GROUP", { platform, targets });
  if (res?.ok) setStatus(`✅ Adicionados: ${res.added || 0} · falhas: ${res.failed || 0}. Confirme no botão do grupo.`);
  else setStatus("❌ " + (res?.error || "Abra o grupo de destino e tente novamente."));
});


// ============ AGENDADOR COMPLETO (v7.0) ============
let scheduledDispatchTasks = {};

window.scheduleFullDispatch = async () => {
  const date = $('scheduleDate')?.value;
  const time = $('scheduleTime')?.value;
  const platform = $('schedulePlatform')?.value || 'whatsapp';
  // A opção visual “WhatsApp (Grupos)” não usa uma lista distinta no banco.
  // Para telefones selecionados, a origem é sempre a lista WhatsApp individual.
  const sourcePlatform = platform === 'whatsapp-groups' ? 'whatsapp' : platform;
  const listName = loaded[sourcePlatform];
  
  if (!date || !time) return alert('Escolha data e hora.');
  if (!listName) return alert('Carregue uma lista de contatos primeiro.');
  
  const contacts = getSelectedContacts(sourcePlatform);
  if (!contacts.length) return alert('Selecione pelo menos um contato.');
  
  const datetime = new Date(`${date}T${time}`);
  const now = new Date();
  
  if (datetime <= now) return alert('Escolha uma data/hora no futuro.');
  
  // Capturar contexto completo do disparo
  const taskContext = {
    taskId: `${platform}-${Date.now()}-${Math.random()}`,
    platform,
    listName,
    contacts: contacts.map(c => ({ n: nameOf(c), c: contactOf(c), isAdmin: !!c.isAdmin })),
    datetime: datetime.toISOString(),
    created: new Date().toISOString(),
    message: $('msg-' + sourcePlatform)?.value || $('msg-whatsapp')?.value || '',
    title: $(`${sourcePlatform === 'whatsapp' ? 'wa' : sourcePlatform === 'instagram' ? 'ig' : 'tg'}Title`)?.value || '',
    mediaUrl: $(`${sourcePlatform === 'whatsapp' ? 'wa' : sourcePlatform === 'instagram' ? 'ig' : 'tg'}Media`)?.value || '',
    mediaFile: null,
    dispatchMode: $('dispatchType')?.value || 'individual',
    dispatchDelay: Number($('dispatchDelay')?.value || 15)
  };
  
  scheduledDispatchTasks[taskContext.taskId] = taskContext;
  chrome.storage?.local.set({ mr_scheduled_dispatch_tasks: scheduledDispatchTasks });
  
  // Criar alarme no Chrome
  if (chrome.alarms) {
    chrome.alarms.create(taskContext.taskId, { when: datetime.getTime() });
  }
  
  setStatus(`✅ Agendado: ${platform.toUpperCase()} em ${date} às ${time} (${contacts.length} contatos)`);
  renderScheduledDispatchTasks();
};

window.renderScheduledDispatchTasks = () => {
  const box = $('scheduledDispatchList');
  if (!box) return;
  
  chrome.storage?.local.get(['mr_scheduled_dispatch_tasks'], (r) => {
    scheduledDispatchTasks = r.mr_scheduled_dispatch_tasks || {};
    const html = Object.values(scheduledDispatchTasks).map((t) => {
      const dt = new Date(t.datetime);
      const msg_preview = (t.message || '').substring(0, 40) + (t.message?.length > 40 ? '...' : '');
      return `
        <div style="padding:8px; border:1px solid #444; margin:4px 0; border-radius:4px; font-size:10px;">
          <strong>${t.platform.toUpperCase()}</strong> — ${dt.toLocaleString('pt-BR')}<br>
          <span style="color:#aaa;">📋 ${t.listName} · 👥 ${t.contacts.length} contatos</span><br>
          <span style="color:#0f0; font-size:9px;">💬 ${msg_preview || '(sem mensagem)'}</span>
          <button onclick="window.cancelScheduledDispatch('${t.taskId}')" style="float:right; padding:2px 6px; font-size:9px;">❌</button>
        </div>
      `;
    }).join('');
    
    box.innerHTML = html || '<p style="font-size:10px; color:#666;">Nenhum disparo agendado.</p>';
  });
};

window.cancelScheduledDispatch = (taskId) => {
  delete scheduledDispatchTasks[taskId];
  chrome.storage?.local.set({ mr_scheduled_dispatch_tasks: scheduledDispatchTasks });
  renderScheduledDispatchTasks();
  setStatus('🛑 Agendamento cancelado.');
};

// Carregar agendamentos ao iniciar
chrome.storage?.local.get(['mr_scheduled_dispatch_tasks'], (r) => {
  scheduledDispatchTasks = r.mr_scheduled_dispatch_tasks || {};
  renderScheduledDispatchTasks();
});

// ============ GROWTH ============
$("btnIGGrowth")?.addEventListener("click", async () => {
  const target = ($("igTarget")?.value || "").trim();
  if (!target) return alert("Digite o @ do perfil.");
  const ok = confirm(`Abrir @${target.replace(/^@/, "")} e tentar interagir com até 6 posts visíveis?\n\nConfirme que esta ação é apropriada para a sua conta.`);
  if (!ok) return;
  setStatus("🚀 A abrir o perfil do Instagram…", 0, 0, []);
  const res = await sendToPage("START_IG_GROWTH", { target });
  if (res?.ok) setStatus(res.message || `✅ ${res.liked || 0} interações confirmadas.`, 100, res.liked || 0, []);
  else setStatus("❌ " + (res?.error || "Abra o Instagram primeiro."), 0, 0, []);
});

$("btnYTGrowth")?.addEventListener("click", async () => {
  const chip = document.querySelector('.chip[data-plat="youtube"]');
  const control = document.querySelector('.tab[data-tab="control"]');
  const extract = document.querySelector('[data-extract="youtube"]');
  if (!chip || !control || !extract) return setStatus("❌ A interface do YouTube não está disponível.");
  chip.click();
  control.click();
  extract.click();
});

// ============ ABA YOUTUBE ============
$("btnYTExtract")?.addEventListener("click", async () => {
  if (activeExtractionJob) return setStatus("⏳ Já existe uma extração em curso. Aguarde terminar.", 15);
  const url = ($("ytVideoUrl")?.value || "").trim();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return setStatus("❌ Nenhuma aba ativa.");

  const isWatch = (u) => (u || "").includes("youtube.com/watch");
  if (url && !((tab.url || "").includes(url.split("v=")[1] || "@@@"))) {
    setStatus("🌐 A abrir o vídeo…", 0, 0, []);
    await chrome.tabs.update(tab.id, { url });
    await sleep(6000);
  } else if (!isWatch(tab.url) && !isWatch(url)) {
    return setStatus("❌ Abra um vídeo do YouTube (youtube.com/watch) ou cole a URL acima.");
  }

  activeExtractionJob = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  const jobId = activeExtractionJob;
  setStatus("⏳ A extrair comentaristas…", 3, 0, []);
  try {
    const res = await sendToPage("EXTRACT", { jobId });
    handleExtractResult(res, "youtube");
    updateLoadedUI("youtube");
  } finally {
    activeExtractionJob = null;
  }
});


$("btnYTSaveNotes")?.addEventListener("click", () => {
  const notes = ($("ytNotes").value || "").trim();
  chrome.storage.local.set({ mr_yt_notes: notes }, () => setStatus("💾 Anotações YouTube salvas."));
});
chrome.storage?.local.get(["mr_yt_notes"], (r) => { if (r.mr_yt_notes && $("ytNotes")) $("ytNotes").value = r.mr_yt_notes; });

// ============ BANCO ============
function parseCsvRows(text) {
  const source = String(text || '').replace(/^\uFEFF/, '');
  const delimiter = (source.split(/\r?\n/)[0] || '').split(';').length >= 2 ? ';' : ',';
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '"') {
      if (quoted && source[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === delimiter && !quoted) {
      row.push(cell); cell = '';
    } else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && source[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((value) => String(value).trim() !== '')) rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); if (row.some((value) => String(value).trim() !== '')) rows.push(row); }
  return rows;
}

function normalizeCsvValue(value) {
  return String(value ?? '').trim().replace(/^="?/, '').replace(/"$/, '').replace(/^"|"$/g, '').trim();
}

async function importCsvToReview(plat, currentName, file) {
  try {
    const rows = parseCsvRows(await file.text());
    if (rows.length < 2) return setStatus('❌ CSV vazio ou sem linhas de contatos.');
    const headers = rows[0].map((value) => normalizeCsvValue(value).toLowerCase());
    const nameIndex = headers.findIndex((h) => /nome|name/.test(h));
    const phoneIndex = headers.findIndex((h) => /contato|telefone|phone|numero|número|number/.test(h));
    const groupIndex = headers.findIndex((h) => /grupo|group/.test(h));
    const adminIndex = headers.findIndex((h) => /admin|administrador/.test(h));
    const sentIndex = headers.findIndex((h) => /enviado|sent/.test(h));
    const countIndex = headers.findIndex((h) => /envios|envios|send.?count/.test(h));
    const start = (nameIndex >= 0 || phoneIndex >= 0 || groupIndex >= 0) ? 1 : 0;
    const imported = [];
    const seen = new Set();
    for (const row of rows.slice(start)) {
      const values = row.map(normalizeCsvValue);
      const rawPhone = phoneIndex >= 0 ? values[phoneIndex] : values.find((v) => /\+?\d[\d\s().-]{7,}/.test(v)) || '';
      const phone = rawPhone.replace(/\D/g, '');
      if (phone.length < 8 || phone.length > 15 || seen.has(phone)) continue;
      const name = nameIndex >= 0 ? values[nameIndex] : (values.find((v) => v && v !== rawPhone && !/^\d+$/.test(v)) || phone);
      const isAdmin = adminIndex >= 0 ? /sim|yes|true|admin|👑/i.test(values[adminIndex]) : /admin|administrador|👑/i.test(values.join(' '));
      const wasSent = sentIndex >= 0 && /sim|yes|true|enviado|sent|✓/i.test(values[sentIndex]);
      const sendCount = countIndex >= 0 ? Number(values[countIndex]) || 0 : (wasSent ? 1 : 0);
      imported.push({ n: name || phone, c: phone, isAdmin, sentAt: wasSent ? new Date().toISOString() : null, sendCount });
      seen.add(phone);
    }
    if (!imported.length) return setStatus('❌ Nenhum telefone válido foi encontrado no CSV.');
    let targetName = currentName;
    if (!targetName) targetName = prompt('Nome da lista importada:', file.name.replace(/\.csv$/i, ''));
    if (!targetName) return;
    const current = database[plat][targetName] || [];
    const replace = !current.length || confirm(`Importar ${imported.length} contatos para “${targetName}”?\n\nOK = substituir a lista atual.\nCancelar = adicionar e remover duplicados.`);
    const merged = replace ? imported : [...current, ...imported];
    const unique = new Map();
    merged.forEach((item) => { const it = asItem(item); const phone = String(it.c || '').replace(/\D/g, ''); if (phone) unique.set(phone, { n: it.n || phone, c: phone, isAdmin: !!it.isAdmin, sentAt: it.sentAt || null, sendCount: it.sendCount || 0 }); });
    database[plat][targetName] = Array.from(unique.values());
    loaded[plat] = targetName;
    selected[plat] = new Set(database[plat][targetName].map((_, index) => index));
    filterText[plat] = '';
    chrome.storage.local.set({ mr_db_v5: database });
    renderDatabase();
    updateLoadedUI(plat);
    setStatus(`✅ CSV importado: ${database[plat][targetName].length} contatos disponíveis no WA Envio.`);
  } catch (error) {
    setStatus(`❌ Não foi possível ler o CSV: ${String(error?.message || error)}`);
  }
}

function renderDatabase() {
  const list = $("dbList");
  list.innerHTML = "";
  let hasData = false;
  Object.keys(database).forEach((plat) => {
    Object.entries(database[plat] || {}).forEach(([name, contacts]) => {
      hasData = true;
      const item = document.createElement("div");
      item.className = "db-item";
      const safe = name.replace(/'/g, "\\'");
      item.innerHTML = `
        <div>
          <strong style="color:var(--neon-cyan)">[${plat.toUpperCase()}]</strong> ${name}<br>
          <span style="font-size:9px; color:#888;">${contacts.length} leads</span>
        </div>
        <div class="db-actions">
          <button class="db-btn" title="Usar" onclick="useList('${plat}','${safe}')">🎯</button>
          <button class="db-btn" title="Copiar contatos" onclick="copyList('${plat}','${safe}')">📋</button>
          <button class="db-btn" title="CSV" onclick="downloadCSV('${plat}','${safe}')">📥</button>

          <button class="db-btn" style="color:var(--neon-magenta)" title="Excluir" onclick="deleteGroup('${plat}','${safe}')">🗑️</button>
        </div>
      `;
      list.appendChild(item);
    });
  });
  if (!hasData) list.innerHTML = "<p style='font-size:11px; color:#555; text-align:center;'>Banco de dados vazio.</p>";
}

window.useList = (plat, name) => {
  loaded[plat] = name;
  const contacts = database[plat][name] || [];
  selected[plat] = new Set(contacts.map((_, i) => i)); // Seleciona todos por padrão
  filterText[plat] = "";
  
  // Escolhe a aba correta baseada na plataforma
  let tabId = 'control';
  if (plat === 'whatsapp') tabId = 'wa-dispatch';
  
  const chip = document.querySelector(`.chip[data-plat="${plat}"]`);
  if (chip) chip.click();
  
  const tabBtn = Array.from(document.querySelectorAll('.tab')).find(b => b.dataset.tab === tabId);
  if (tabBtn) tabBtn.click();
  
  updateLoadedUI(plat);
  setStatus(`📌 Lista "${name}" carregada. ${contacts.length} contatos selecionados.`);
};

function escapeHtml(s) { return String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

function updateLoadedUI(plat) {
  let box = $(`loaded-${plat}`);
  if (plat === 'whatsapp') {
    box = $(`loaded-whatsapp-footer`);
    const title = $("extra-list-title");
    if (title) title.style.display = loaded[plat] ? "block" : "none";
  }
  if (!box) return;
  const name = loaded[plat];
  if (!name || !database[plat] || !database[plat][name]) { box.style.display = "none"; box.innerHTML = ""; return; }
  const contacts = database[plat][name];
  const sel = selected[plat] || (selected[plat] = new Set());
  const filter = (filterText[plat] || "").toLowerCase();
  box.style.display = "block";

  const rows = contacts.map((x, i) => {
    const it = asItem(x);
    const displayContact = it.c || "telefone não exposto pelo WhatsApp";
    const label = it.n ? `${it.n} — ${displayContact}` : displayContact;
    if (filter && !label.toLowerCase().includes(filter)) return "";
    const checked = sel.has(i) ? "checked" : "";
    const isAdmin = it.isAdmin || (it.n && /admin|administrador|adm|👑/i.test(it.n));
    const sent = !!it.sentAt;
    const adminBadge = isAdmin ? `<span style="color:var(--neon-magenta); font-weight:bold; margin-left:4px; font-size:10px;">👑 Admin</span>` : "";
    const sentBadge = sent ? `<span style="color:#ffd21f; font-weight:bold; margin-left:4px; font-size:9px;">✓ ENVIADO${it.sendCount > 1 ? ` (${it.sendCount}x)` : ""}</span>` : "";
    const nameHtml = it.n ? `<span class="cl-name" style="${isAdmin ? 'color:var(--neon-magenta); font-weight:bold;' : ''}">${escapeHtml(it.n)}</span> <span class="cl-contact">${escapeHtml(displayContact)}</span>${adminBadge}${sentBadge}` : `<span class="cl-contact">${escapeHtml(displayContact)}</span>${sentBadge}`;
    const rowClass = isAdmin ? 'cl-row cl-admin' : 'cl-row';
    const rowStyle = sent ? 'background:rgba(255,210,31,.12);border-left:3px solid #ffd21f;' : '';
    return `
      <div class="${rowClass}" style="${rowStyle}">
        <label style="flex:1; display:flex; align-items:center; gap:8px; cursor:pointer;">
          <input type="checkbox" data-cl-idx="${i}" ${checked}/> 
          ${nameHtml}
        </label>
        ${sent ? `<button class="db-btn" title="Permitir novo envio" style="padding:2px 5px;color:#ffd21f;" data-clear-sent="${i}">↻</button>` : ""}
        <button class="db-btn" title="Remover contato" style="padding:2px 5px; opacity:0.6" data-ll-del="${i}">✕</button>
      </div>`;
  }).join("");

  box.innerHTML = `
    <div class="ll-head">
      <span>📌 <strong>${escapeHtml(name)}</strong> · ${contacts.length} leads · <span class="cl-count">${sel.size} selecionados</span></span>
      <button class="db-btn" style="color:var(--neon-magenta)" onclick="unloadList('${plat}')">↩</button>
    </div>
    <div class="ll-tools">
      <button data-ll-act="all">✓ Todos</button>
      <button data-ll-act="none">✕ Nenhum</button>
      <button data-ll-act="first20">Top 20</button>
      <button data-ll-act="last20">Last 20</button>
      <button data-ll-act="invert">↔ Inverter</button>
      <button data-ll-act="visible">✓ Visíveis</button>
      <button data-ll-act="send-selected" style="color:var(--neon-cyan); font-weight:bold;">📱 ENVIAR SELECIONADOS</button>
      <button data-ll-act="admins">👑 Selecionar Admins</button>
      <button data-ll-act="no-admins" style="color:var(--neon-green)">✅ Remover Admins</button>
      <button data-ll-act="del-sel" style="color:var(--neon-red)">🗑️ Apagar Sel.</button>
      <button data-ll-act="copy">📋 Copiar</button>
      <button data-ll-act="csv">📥 CSV</button>
      <button data-ll-act="upload-csv" style="color:var(--neon-cyan); font-weight:bold;">📤 Upload de CSV</button>
      <input type="file" data-ll-upload-csv accept=".csv,text/csv" style="display:none" />
      <input data-ll-add-phone-input placeholder="+351 912 345 678" inputmode="tel" style="min-width:145px;flex:1;padding:5px;background:#111;color:#fff;border:1px solid #444;border-radius:5px;font-size:10px;" />
      <button data-ll-act="add-phone" style="color:var(--neon-green);font-weight:bold;">➕ Acrescentar telefone</button>
      <button data-ll-act="rename">✏️ Renomear</button>

    </div>
    <input class="ll-search" placeholder="🔍 Filtrar por nome ou número..." value="${escapeHtml(filter)}"/>
    <div class="checklist">${rows || '<p style="font-size:10px;color:#666;text-align:center;padding:8px">Nada encontrado.</p>'}</div>
  `;

  // wire checkboxes
  box.querySelectorAll('input[data-cl-idx]').forEach((cb) => {
    cb.addEventListener("change", (e) => {
      const idx = Number(e.target.dataset.clIdx);
      if (e.target.checked) sel.add(idx); else sel.delete(idx);
      const countEl = box.querySelector(".cl-count");
      if (countEl) countEl.textContent = `${sel.size} selecionados`;
    });
  });

  // Limpa o estado “enviado” para permitir uma nova campanha sem remover o telefone.
  box.querySelectorAll('[data-clear-sent]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.clearSent);
      if (contacts[idx]) { contacts[idx].sentAt = null; contacts[idx].sendCount = 0; }
      chrome.storage.local.set({ mr_db_v5: database });
      updateLoadedUI(plat);
    });
  });

  // wire individual delete
  box.querySelectorAll('[data-ll-del]').forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.llDel);
      const newContacts = contacts.filter((_, i) => i !== idx);
      database[plat][name] = newContacts;
      
      const newSel = new Set();
      selected[plat].forEach(sIdx => {
        if (sIdx > idx) newSel.add(sIdx - 1);
        else if (sIdx < idx) newSel.add(sIdx);
      });
      selected[plat] = newSel;
      
      chrome.storage.local.set({ mr_db_v5: database });
      renderDatabase();
      updateLoadedUI(plat);
    });
  });

  // wire toolbar
  box.querySelectorAll("[data-ll-act]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const act = btn.dataset.llAct;
      if (act === "all") { sel.clear(); contacts.forEach((_, i) => sel.add(i)); }
      else if (act === "none") sel.clear();
      else if (act === "first20") { sel.clear(); contacts.forEach((_, i) => { if (i < 20) sel.add(i); }); }
      else if (act === "last20") { sel.clear(); const start = Math.max(0, contacts.length - 20); contacts.forEach((_, i) => { if (i >= start) sel.add(i); }); }
      else if (act === "invert") { const ns = new Set(); contacts.forEach((_, i) => { if (!sel.has(i)) ns.add(i); }); selected[plat] = ns; }
      else if (act === "visible") {
        box.querySelectorAll('input[data-cl-idx]').forEach((cb) => sel.add(Number(cb.dataset.clIdx)));
      }
      else if (act === "send-selected") {
        const chosen = getSelectedContacts(plat);
        if (plat !== "whatsapp") return setStatus("Use o botão de envio da plataforma correspondente para esta lista.");
        if (waMediaLoading) return setStatus("⏳ Aguarde o vídeo terminar de carregar antes de enviar.");
        if (!chosen.length) return setStatus("Nenhum contato selecionado para enviar.");
        const message = composePlatformMessage("whatsapp");
        if (!message && !waMediaFile) return setStatus("Prepare a mensagem ou escolha um arquivo antes de enviar.");
        const delay = getDispatchDelay();
        const ok = confirm(`Enviar agora para ${chosen.length} contato(s) selecionado(s)?\\nIntervalo: ${delay}s entre cada envio.`);
        if (!ok) return;
        setStatus(`⏳ Enviando para ${chosen.length} contatos selecionados…`, 0, 0, []);
        await sendWhatsAppSequential(chosen, message);
        return;
      }
      else if (act === "admins") {
        sel.clear();
        contacts.forEach((x, i) => {
          const it = asItem(x);
          if (it.isAdmin || (it.n && /admin|administrador|adm|👑/i.test(it.n))) sel.add(i);
        });
      }
      else if (act === "no-admins") {
        const toRemove = [];
        contacts.forEach((x, i) => {
          const it = asItem(x);
          if (it.isAdmin || (it.n && /admin|administrador|adm|👑/i.test(it.n))) toRemove.push(i);
        });
        if (!toRemove.length) return setStatus("Nenhum administrador encontrado para remover.");
        if (!confirm(`Remover ${toRemove.length} administradores desta lista?`)) return;
        const newContacts = contacts.filter((_, i) => !toRemove.includes(i));
        database[plat][name] = newContacts;
        selected[plat] = new Set(newContacts.map((_, i) => i)); // Seleciona o resto
        chrome.storage.local.set({ mr_db_v5: database });
        renderDatabase();
        updateLoadedUI(plat);
        setStatus(`✅ ${toRemove.length} administradores removidos.`);
        return;
      }
      else if (act === "del-sel") {
        if (!sel.size) return;
        if (!confirm(`Apagar ${sel.size} contatos selecionados desta lista?`)) return;
        const newContacts = contacts.filter((_, i) => !sel.has(i));
        database[plat][name] = newContacts;
        selected[plat] = new Set();
        chrome.storage.local.set({ mr_db_v5: database });
        renderDatabase();
        updateLoadedUI(plat);
        setStatus(`🗑️ ${sel.size} contatos removidos.`);
        return;
      }
      else if (act === "copy") {
        const picked = getSelectedContacts(plat).map((x) => contactOf(x)).join("\n");
        navigator.clipboard.writeText(picked).then(
          () => setStatus(`📋 ${picked.split("\n").filter(Boolean).length} contatos copiados!`),
          () => setStatus("❌ Não foi possível copiar.")
        );
        return;
      }
      else if (act === "csv") { window.downloadCSV(plat, name); setStatus("📥 CSV baixado."); return; }
      else if (act === "add-phone") {
        const input = box.querySelector('[data-ll-add-phone-input]');
        const phone = String(input?.value || '').replace(/\D/g, '');
        if (phone.length < 10 || phone.length > 15) return setStatus('❌ Introduza um telefone internacional válido, com indicativo do país.');
        if (contacts.some((item) => contactOf(item).replace(/\D/g, '') === phone)) return setStatus('ℹ️ Esse telefone já existe nesta lista.');
        const contactName = prompt('Nome opcional do contacto:', '') || phone;
        contacts.push({ n: contactName.trim() || phone, c: phone, isAdmin: false, sentAt: null, sendCount: 0 });
        sel.add(contacts.length - 1);
        database[plat][name] = contacts;
        chrome.storage.local.set({ mr_db_v5: database });
        renderDatabase();
        updateLoadedUI(plat);
        setStatus(`✅ Telefone ${phone} acrescentado à lista “${name}”.`);
        return;
      }
      else if (act === "upload-csv") {
        const input = box.querySelector('[data-ll-upload-csv]');
        if (input) input.click();
        return;
      }
      else if (act === "rename") {
        const novo = prompt("Novo nome da lista:", name);
        if (!novo || novo === name) return;
        database[plat][novo] = database[plat][name];
        delete database[plat][name];
        loaded[plat] = novo;
        chrome.storage.local.set({ mr_db_v5: database });
        renderDatabase();
        updateLoadedUI(plat);
        setStatus(`✏️ Lista renomeada para "${novo}".`);
        return;
      }
      updateLoadedUI(plat);
    });

  });

  // Upload do CSV fica ao lado do botão CSV e recupera a lista na revisão atual.
  const csvInput = box.querySelector('[data-ll-upload-csv]');
  if (csvInput) {
    csvInput.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;
      await importCsvToReview(plat, name, file);
    });
  }

  // wire search
  const search = box.querySelector(".ll-search");
  if (search) {
    search.addEventListener("input", (e) => {
      filterText[plat] = e.target.value;
      const val = e.target.value;
      updateLoadedUI(plat);
      const s2 = $(`loaded-${plat}`).querySelector(".ll-search");
      if (s2) { s2.focus(); s2.setSelectionRange(val.length, val.length); }
    });
  }
}

window.unloadList = (plat) => { loaded[plat] = null; selected[plat] = new Set(); updateLoadedUI(plat); setStatus("Lista descarregada."); };

window.copyList = (plat, name) => {
  const contacts = (database[plat] || {})[name] || [];
  const txt = contacts.map((x) => {
    const it = asItem(x);
    return [it.n, it.c || "telefone não exposto pelo WhatsApp"].filter(Boolean).join(" — ");
  }).join("\n");
  navigator.clipboard.writeText(txt).then(
    () => setStatus(`📋 ${contacts.length} contatos de "${name}" copiados!`),
    () => setStatus("❌ Não foi possível copiar.")
  );
};

window.downloadCSV = (plat, name) => {

  const contacts = database[plat][name] || [];
  const rows = ["grupo;nome;contato;enviado;envios"].concat(
    contacts.map((x) => {
      const it = asItem(x);
      const safeName = (it.n || "").replace(/;/g, ",");
      return `${name};${safeName};="${it.c}";${it.sentAt ? "sim" : "não"};${it.sendCount || 0}`;
    })
  );
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `MR_${plat}_${name}.csv`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
};

window.deleteGroup = (plat, name) => {
  if (confirm(`Excluir ${name}?`)) {
    delete database[plat][name];
    if (loaded[plat] === name) { loaded[plat] = null; updateLoadedUI(plat); }
    chrome.storage.local.set({ mr_db_v5: database });
    renderDatabase();
  }
};

$("btnClearDB").addEventListener("click", () => {
  if (confirm("Deseja apagar TODO o banco de dados?")) {
    database = { whatsapp: {}, telegram: {}, instagram: {}, youtube: {} };
    loaded = { whatsapp: null, telegram: null, instagram: null, youtube: null };
    chrome.storage.local.set({ mr_db_v5: database });
    renderDatabase();
    ["whatsapp", "telegram", "instagram", "youtube"].forEach(updateLoadedUI);
  }
});
