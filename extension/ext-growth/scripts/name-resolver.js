// MR Social Growth — Resolução de Nomes (v1.0)
// Resolve o nome do contato a partir do número de telefone, usando várias fontes:
// 1. WhatsApp Store (WA-Web): busca o número na pesquisa do WhatsApp Web e lê o nome exibido
// 2. Agenda do usuário via ContactPicker API (Chrome, se disponível e autorizado)
// 3. Fallback por número (mantém o número como nome)

window.__MR_NAME_RESOLVER__ = window.__MR_NAME_RESOLVER__ || {};

const NameResolver = {
  // Cache em memória durante a sessão
  _cache: new Map(),

  async resolve(phone, options = {}) {
    const p = String(phone || "").replace(/\D/g, "");
    if (!p || p.length < 10) return "";
    const timeout = Number(options.timeout) || 6000;

    if (this._cache.has(p)) return this._cache.get(p);

    let name = "";

    // 1. Tentar ContactPicker API (agenda do Chrome) — rápido e não precisa do WhatsApp aberto
    try {
      if (navigator.contacts?.select && !this._triedContactPicker) {
        this._triedContactPicker = true;
        name = await this._tryContactPicker(p, timeout);
      }
    } catch (_) {}

    // 2. Tentar extrair nome do WhatsApp Web (DOM atual)
    if (!name && window.location.host.includes("whatsapp.com")) {
      try {
        name = await this._tryWhatsAppDom(p, timeout);
      } catch (_) {}
    }

    if (name) this._cache.set(p, name);
    return name;
  },

  // ---- ContactPicker: agenda do dispositivo/navegador ----
  _tryContactPicker(phone, timeout) {
    if (!("contacts" in navigator)) return "";
    const phoneIntl = "+" + phone;
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(""), Math.min(timeout, 4000));
      navigator.contacts
        .select(["name", "tel"], { multiple: false, signal: undefined })
        .then((contacts) => {
          // ContactPicker sempre abre o seletor; não é prático em massa.
          // Só usamos quando o usuário clicar em "Buscar nomes" explicitamente.
          clearTimeout(timer);
          if (contacts && contacts.length) {
            const c = contacts[0];
            resolve((c?.name?.[0] || "").trim());
          } else resolve("");
        })
        .catch(() => {
          clearTimeout(timer);
          resolve("");
        });
    });
  },

  // ---- Busca pelo DOM do WhatsApp Web ----
  _tryWhatsAppDom(phone, timeout) {
    const start = Date.now();
    // Procura por spans que mostram o número e tenta achar o nome vizinho
    const nodes = document.querySelectorAll('span[title], span.copyable-text, span.selectable-text');
    const rePhone = new RegExp(phone.slice(-6)); // busca pelo final do número
    for (const node of nodes) {
      const t = (node.getAttribute("title") || node.innerText || "");
      if (!t) continue;
      if (phoneFromTextWA(t).includes(phone) || rePhone.test(t.replace(/\D/g, ""))) {
        // Pega o contexto (pai/avô) e procura span com título de nome
        let scope = node.closest('div[role="row"], div[role="listitem"]') || node.parentElement?.parentElement || node;
        if (!scope) continue;
        const titleSpans = scope.querySelectorAll('span[title]');
        for (const ts of titleSpans) {
          const tt = (ts.getAttribute("title") || "").trim();
          if (!tt) continue;
          if (!/^\+?[\d\s\-().]+$/.test(tt) && tt.length < 60 && !/^(online|digitando|visto)/i.test(tt)) {
            return tt;
          }
        }
      }
      if (Date.now() - start > timeout) return "";
    }
    return "";
  },

  async resolveMany(items, report = null) {
    // items: array de { n, c, ... } — retorna novos itens com nomes resolvidos
    const resolved = [];
    let done = 0;
    for (const item of items) {
      const phone = String(item?.c || "").replace(/\D/g, "");
      let name = (item?.n || "").trim();
      if (!phone || name) { resolved.push(item); done++; continue; }
      const found = await this.resolve(phone);
      resolved.push({ ...item, n: found || phone });
      done++;
      if (report) report(done, items.length, resolved);
    }
    return resolved;
  },
};

function phoneFromTextWA(text) {
  const m = String(text || "").match(/\+?\d[\d\s\-().]{8,}\d/g);
  if (!m) return [];
  return m.map((x) => x.replace(/\D/g, "")).filter((x) => x.length >= 10 && x.length <= 15);
}

// Personalização de mensagem: substitui {nome} pelo nome do contato
function personalizeMessage(template, contact) {
  const name = (contact?.n || "").toString().trim() || "";
  const firstName = name.split(/\s+/)[0] || name;
  const phone = String(contact?.c || "").replace(/\D/g, "") || "";
  let msg = String(template || "");
  msg = msg.replace(/\{nome completo\}|\{nome_completo\}/gi, name || phone);
  msg = msg.replace(/\{nome\}/gi, firstName || phone);
  msg = msg.replace(/\{telefone\}/gi, phone);
  msg = msg.replace(/\{primeiro_nome\}|\{first_name\}/gi, firstName || phone);
  return msg;
}

// Interpolação de spintax + personalização
function expandSpintaxAndPersonalize(text, contact) {
  const expanded = String(text || "").replace(/\{([^{}]+)\}/g, (_whole, choices) => {
    const values = String(choices).split("|").map((x) => x.trim()).filter(Boolean);
    return values.length ? values[Math.floor(Math.random() * values.length)] : "";
  });
  return personalizeMessage(expanded, contact);
}

// Expande apenas tokens de nome (sem tocar em spintax)
function expandNameTokens(template, contact) {
  const name = (contact?.n || "").toString().trim() || "";
  const firstName = name.split(/\s+/)[0] || name;
  const phone = String(contact?.c || "").replace(/\D/g, "") || "";
  let msg = String(template || "");
  msg = msg.replace(/\{nome completo\}|\{nome_completo\}/gi, name || phone);
  msg = msg.replace(/\{nome\}/gi, firstName || phone);
  msg = msg.replace(/\{telefone\}/gi, phone);
  msg = msg.replace(/\{primeiro_nome\}|\{first_name\}/gi, firstName || phone);
  return msg;
}

// Exportar para o escopo do content script / painel
if (typeof window !== "undefined") {
  window.MR_NameResolver = NameResolver;
  window.MR_PersonalizeMessage = personalizeMessage;
  window.MR_ExpandSpintaxAndPersonalize = expandSpintaxAndPersonalize;
  window.MR_ExpandNameTokens = expandNameTokens;
}
