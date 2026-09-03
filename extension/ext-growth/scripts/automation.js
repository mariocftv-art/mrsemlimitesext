if (!window.__MR_SOCIAL_AUTOMATION_LOADED__) {
  window.__MR_SOCIAL_AUTOMATION_LOADED__ = true;
  console.log("MR Social Growth content script activo");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function reportProgress(jobId, stage, found, progress = null, preview = []) {
  if (!jobId) return;
  try {
    chrome.runtime.sendMessage({
      type: "MR_EXTRACT_PROGRESS",
      jobId,
      stage,
      found: Number(found) || 0,
      progress: progress === null ? null : Math.min(99, Math.max(0, Number(progress) || 0)),
      preview: Array.isArray(preview) ? preview.slice(-5) : [],
    }).catch(() => {});
  } catch (_) {}
}

// A extração só aceita registros vinculados a telefone ou identificador real.
// Textos isolados da interface nunca são convertidos em contatos.
function pushPair(map, contact, name, isAdmin = false) {
  if (!contact) return;
  const key = String(contact).trim();
  if (!key) return;
  const existing = map.get(key);
  const cleanName = (name || "").toString().trim();

  // Se o mesmo telefone aparecer primeiro sem nome e depois com nome, preserva a versão melhor.
  const existingName = String(existing?.n || key).trim();
  const incomingIsRealName = !!cleanName && cleanName !== key && !/^\+?[\d\s().-]+$/.test(cleanName);
  const existingIsOnlyPhone = !existing || existingName === key || /^\+?[\d\s().-]+$/.test(existingName);
  if (!existing || (incomingIsRealName && existingIsOnlyPhone) || (!existing.isAdmin && isAdmin)) {
    map.set(key, { n: incomingIsRealName ? cleanName : (existing?.n || cleanName || key), c: key, isAdmin: isAdmin || (existing?.isAdmin || false) });
  }
}
const toArray = (map) => Array.from(map.values());

function phoneFromText(text) {
  const raw = String(text || "");
  const matches = raw.match(/\+?\d[\d\s\-().]{8,}\d/g) || [];
  const compact = raw.match(/(?:^|[^\d])(\d{10,15})(?:@c\.us|@s\.whatsapp\.net)?(?:$|[^\d])/g) || [];
  return [...matches, ...compact]
    .map((x) => x.replace(/\D/g, ""))
    .filter((x, i, arr) => x.length >= 10 && x.length <= 15 && arr.indexOf(x) === i);
}

function cleanContactName(text) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (!t || /^\+?[\d\s\-().]+$/.test(t)) return "";
  if (/^(online|typing|digitando|last seen|visto|recado|mensagem)$/i.test(t)) return "";
  if (/licen[cç]a\s+(?:[ée]|e)\s+limitada|license\s+limited|limited\s+to\s+love|lovable/i.test(t)) return "";
  return t.slice(0, 90);
}

function rowHasAdminMarker(row) {
  const text = String(row?.innerText || "");
  const attrs = Array.from(row?.querySelectorAll?.('[aria-label], [title], [data-icon]') || []).map((el) => `${el.getAttribute('aria-label') || ''} ${el.getAttribute('title') || ''} ${el.getAttribute('data-icon') || ''}`).join(' ');
  return /admin(?:istrador)?(?:\s+do\s+grupo)?|group\s+admin|admin\s+group|👑/i.test(`${text} ${attrs}`);
}

function pushVisibleParticipantName(map, name, isAdmin = false) {
  const clean = cleanContactName(name);
  if (!clean || clean.length < 2 || clean.length > 90) return;
  if (/^(você|you|proprietário|owner|ocupado|disponível|no trabalho|adicionar membro|adicionar participante|convidar via link|mostrar mudanças de membros|adicionar aos favoritos|adicionar à lista|limpar conversa|remover da comunidade|sair do grupo|denunciar grupo|dados do grupo|group info|membros?|members?|participantes?|participants?)$/i.test(clean)) {
    // “Você” pode ser o participante dono do grupo, mas somente quando vier
    // dentro de uma linha com avatar; o filtro de linha acontece no chamador.
    if (!/^você$/i.test(clean)) return;
  }
  const key = `name:${clean.toLocaleLowerCase("pt-BR")}`;
  const existing = map.get(key);
  if (!existing || (!existing.isAdmin && isAdmin)) map.set(key, { n: clean, c: "", isAdmin: !!isAdmin });
}

function scanVisibleParticipantNames(scope, map) {
  const root = scope || document;
  const images = Array.from(root.querySelectorAll("img"));
  const seen = new Set();
  images.forEach((img) => {
    let row = null;
    const candidates = [
      img.closest('div[role="listitem"]'),
      img.closest('div[role="row"]'),
      img.closest('div[role="button"]'),
      img.closest('[tabindex="0"]'),
      img.closest('[data-testid*="cell-frame"]'),
      img.closest('[data-testid*="participant"]'),
      img.closest('[data-testid*="cell"]'),
      img.closest('[role="option"]'),
      img.closest('[role="listitem"]'),
      img.parentElement?.parentElement,
      img.parentElement,
    ].filter(Boolean);
    row = candidates.find((candidate) => {
      const rect = candidate.getBoundingClientRect?.();
      const text = String(candidate.innerText || "").trim();
      return rect && rect.width >= 80 && rect.height >= 24 && rect.height <= 220 && text;
    });
    if (!row || seen.has(row)) return;
    seen.add(row);
    const lines = String(row.innerText || "").split(/\n+/).map((line) => cleanContactName(line)).filter(Boolean);
    const ignored = /^(admin|administrador|admin do grupo|group admin|ocupado|disponível|no trabalho|online|offline|visto|last seen|recado|membro|member|participante|participant)$/i;
    const name = lines.find((line) => !ignored.test(line) && !/^\+?[\d\s().-]+$/.test(line) && !phoneFromText(line).length && !/^(pesquisar membros|pesquisar contatos|search members|search contacts|ver tudo|view all)$/i.test(line));
    if (!name) return;
    const isAdmin = rowHasAdminMarker(row);
    pushVisibleParticipantName(map, name, isAdmin);
  });
}

function scanModalParticipantRows(scope, map) {
  const root = scope || document;
  const rows = Array.from(root.querySelectorAll('div[role="listitem"], div[role="row"], div[role="option"], div[role="button"], [tabindex="0"], [data-testid*="cell-frame"], [data-testid*="participant"], [data-testid*="contact"]'));
  const ignored = /^(pesquisar membros|pesquisar contatos|search members|search contacts|ver tudo|view all|membros?|members?|participantes?|participants?|administrador|admin|adicionar membro|adicionar participante|convidar via link|online|offline|visto|last seen)$/i;
  rows.forEach((row) => {
    const rect = row.getBoundingClientRect?.();
    if (!rect || rect.width < 120 || rect.height < 24 || rect.height > 260) return;
    const text = String(row.innerText || '').trim();
    if (!text || /^(pesquisar membros|pesquisar contatos|search members|search contacts)$/i.test(text)) return;
    if (row.querySelector('input, textarea, [contenteditable="true"]')) return;
    const dataId = row.getAttribute('data-id') || row.id || row.getAttribute('data-uid') || row.getAttribute('data-user-id') || '';
    const phones = [...phoneFromText(text), ...phoneFromText(dataId)];
    const lines = text.split(/\n+/).map((line) => cleanContactName(line)).filter((line) => line && !ignored.test(line) && !/^\+?[\d\s().-]+$/.test(line));
    const name = lines.find((line) => !/^(você|you|proprietário|owner)$/i.test(line)) || lines[0] || '';
    const isAdmin = rowHasAdminMarker(row);
    if (phones.length) phones.forEach((phone) => pushPair(map, phone, name, isAdmin));
    else if (name) pushVisibleParticipantName(map, name, isAdmin);
  });
}

function scanWhatsAppScope(scope, map) {
  const root = scope || document;
  // O modal Pesquisar membros usa linhas sem avatar/telefone visível no texto.
  scanModalParticipantRows(root, map);
  // Grupos pequenos exibem os participantes diretamente no painel lateral.
  // A leitura fica limitada a linhas com avatar visível, evitando cabeçalhos,
  // botões e textos soltos da interface.
  scanVisibleParticipantNames(root, map);

  // 1. Varredura por elementos que costumam conter IDs de usuário (Data-ID)
  // O WhatsApp armazena o número no formato 5511999999999@c.us em vários lugares
  const elementsWithIds = root.querySelectorAll('[data-id], [id*="@c.us"], [data-uid], [data-user-id], [data-testid*="cell-frame"], [data-testid*="participant"], [data-testid*="contact"]');
  elementsWithIds.forEach(el => {
    const dataId = el.getAttribute('data-id') || el.id || el.getAttribute('data-uid') || el.getAttribute('data-user-id') || "";
    const rawPhone = dataId.match(/(?:^|[^\d])(\d{10,15})(?:@(?:c\.us|s\.whatsapp\.net))?(?:$|[^\d])/);
    if (dataId.includes('@c.us') || dataId.includes('@s.whatsapp.net') || rawPhone) {
      const phone = (rawPhone?.[1] || dataId.split('@')[0]).replace(/\D/g, "");
      if (phone.length >= 10 && phone.length <= 15) {
        const row = el.closest('div[role="listitem"], div[role="row"], div[role="button"], [data-testid*="cell-frame"], [data-testid*="participant"], [data-testid*="contact"]') || el;
        const name = cleanContactName(row.querySelector('span[title]')?.title || row.querySelector('span')?.innerText) || phone;
        const isAdmin = rowHasAdminMarker(row);
        pushPair(map, phone, name, isAdmin);
      }
    }
  });

  // 2. Varredura por Imagens de Perfil (contêm o número na URL da imagem)
  root.querySelectorAll('img[src*="u="]').forEach(img => {
    const src = img.src || "";
    const match = src.match(/u=(\d+)/);
    if (match) {
      const phone = match[1];
      const row = img.closest('div[role="listitem"], div[role="row"], [data-testid*="cell-frame"], [data-testid*="participant"], [data-testid*="contact"]') || img.parentElement;
      const name = cleanContactName(row.querySelector('span[title]')?.title || row.innerText.split('\n')[0]) || phone;
      const isAdmin = rowHasAdminMarker(row);
      pushPair(map, phone, name, isAdmin);
    }
  });

  // 3. Varredura por Links (wa.me)
  root.querySelectorAll('a[href*="wa.me"], a[href*="phone="]').forEach(a => {
    const href = a.href || "";
    const phones = phoneFromText(href);
    phones.forEach(p => {
      const name = cleanContactName(a.innerText || a.title) || p;
      pushPair(map, p, name, false);
    });
  });

  // 4. Fallback: Qualquer texto que pareça número de telefone
  // Útil para quando o número está visível na tela
  const allText = root.innerText || "";
  phoneFromText(allText).forEach(p => pushPair(map, p, p, false));

  // 5. MELHORIA v7.3: Captura NOME + TELEFONE juntos
  // No WhatsApp Web, a lista de participantes mostra o nome exibido
  // (do perfil do contato, mesmo quando não está salvo na agenda)
  // Procuramos pares nome->número dentro de cada linha (row) e
  // também pares número->nome (nome acima do número no título).
  root.querySelectorAll('div[role="listitem"], div[role="row"], div[role="button"], [tabindex="0"], [data-testid*="cell-frame"], [data-testid*="participant"], [data-testid*="contact"]').forEach((row) => {
    let name = "", phone = "";
    const spans = row.querySelectorAll('span[title], span[aria-label], span.copyable-text, span.selectable-text, span[dir], [data-testid="cell-frame-title"], [data-testid="cell-frame-secondary"], [data-testid*="title"], [data-testid*="secondary"], [aria-label]');
    spans.forEach((s) => {
      const t = (s.getAttribute('title') || s.innerText || "").trim();
      if (!t) return;
      const digits = t.replace(/\D/g, "");
      if (digits.length >= 10 && digits.length <= 15 && /^\+?[\d\s\-().]+$/.test(t)) {
        if (!phone) phone = digits;
      } else if (t.length > 1 && t.length < 70 && !/^[\d\s\-().]+$/.test(t) && !/^(online|typing|digitando|last seen|visto|recado|mensagem)$/i.test(t)) {
        if (!name) name = t;
      }
    });
    // Fallback adicional: em algumas versões do WhatsApp o nome e o telefone ficam
    // em nós diferentes, sem title/copyable-text. Lemos cada linha visível da célula.
    if (!phone) {
      const rowPhones = phoneFromText(row.innerText || "");
      if (rowPhones.length) phone = rowPhones[0];
    }
    if (!phone) {
      const nestedIds = Array.from(row.querySelectorAll('[data-id], [id*="@c.us"], [data-uid], [data-user-id]'))
        .map((el) => el.getAttribute('data-id') || el.id || el.getAttribute('data-uid') || el.getAttribute('data-user-id') || '')
        .flatMap((value) => phoneFromText(value.replace(/@.*$/, '')));
      if (nestedIds.length) phone = nestedIds[0];
    }
    if (!phone) {
      const attrValues = Array.from(row.querySelectorAll('[title], [aria-label], [data-id], [data-uid], [data-user-id]'))
        .flatMap((el) => [el.getAttribute('title'), el.getAttribute('aria-label'), el.getAttribute('data-id'), el.getAttribute('data-uid'), el.getAttribute('data-user-id')])
        .filter(Boolean);
      for (const value of attrValues) {
        const found = phoneFromText(String(value).replace(/@[^ ]+$/, ''));
        if (found.length) { phone = found[0]; break; }
        const compact = String(value).match(/(?:^|[^\d])(\d{10,15})(?:@c\.us)?(?:$|[^\d])/);
        if (compact) { phone = compact[1]; break; }
      }
    }
    if (phone && !name) {
      const phoneDigits = phone.replace(/\D/g, "");
      const lines = String(row.innerText || "").split(/\n+/).map((x) => x.trim()).filter(Boolean);
      const candidate = lines.find((line) => {
        const digits = line.replace(/\D/g, "");
        return line !== phone && digits !== phoneDigits && !/^\+?[\d\s().-]+$/.test(line) &&
          !/^(admin|administrador|comunidade|community|membro|member|online|visto|last seen)$/i.test(line);
      });
      if (candidate) name = cleanContactName(candidate);
    }
    if (phone) pushPair(map, phone, name || phone, rowHasAdminMarker(row));
  });

  // Algumas versões renderizam os participantes como divs sem role/data-testid.
  // Ainda assim, o telefone pode estar no title/aria-label da própria célula.
  root.querySelectorAll('[title], [aria-label]').forEach((node) => {
    const values = [node.getAttribute('title') || '', node.getAttribute('aria-label') || ''];
    const phones = values.flatMap((value) => phoneFromText(value).concat((String(value).match(/(?:^|[^\d])(\d{10,15})(?:@c\.us)?(?:$|[^\d])/g) || []).map((x) => x.replace(/\D/g, ''))));
    if (!phones.length) return;
    const phone = phones.find((p) => p.length >= 10 && p.length <= 15);
    if (!phone) return;
    const cell = node.closest('div[role="listitem"], div[role="row"], [data-testid*="cell"], [data-testid*="participant"], [data-testid*="contact"]') || node.parentElement;
    const name = cleanContactName(cell?.querySelector?.('[data-testid*="title"], span[title], span[dir]')?.innerText || cell?.innerText || '') || phone;
    pushPair(map, phone, name, rowHasAdminMarker(cell));
  });
}

function getWhatsAppCurrentScope() {
  return document.querySelector('div[role="application"] main')
    || document.querySelector('#main')
    || document.querySelector('main')
    || document;
}

function getWhatsAppGroupPanelScope() {
  // 1. Prioridade Máxima: Janela de membros "Ver tudo" (Modal)
  // Esta janela fica por cima de tudo e é a mais confiável
  const overlays = document.querySelectorAll('div[role="dialog"], div[aria-modal="true"]');
  for (const overlay of overlays) {
    const text = overlay.innerText || "";
    if (/participantes?|participants?|membros?(?:\s+do\s+grupo)?|members?|ver\s+todos|view\s+all|dados\s+do\s+grupo|group\s+info/i.test(text)) {
      console.log("MR: Encontrou modal de membros");
      return overlay;
    }
  }

  // 2. Prioridade Média: Painel Lateral Direito (Drawer)
  // Procuramos por um container que esteja à direita do chat principal
  const drawers = document.querySelectorAll('div[role="complementary"], aside, section[data-testid="group-info-drawer"]');
  for (const drawer of drawers) {
    const text = drawer.innerText || "";
    // Garantimos que não é a lista de chats da esquerda verificando palavras-chave de grupo
    if (/participante|membro|admin|dados do grupo|info do grupo|ver todos|view all|group info/i.test(text)) {
      console.log("MR: Encontrou painel lateral de grupo");
      return drawer;
    }
  }

  // 3. Painel lateral genérico: grupos pequenos exibem todos os participantes
  // diretamente nos dados do grupo e não mostram o botão “Ver tudo”.
  const genericPanels = Array.from(document.querySelectorAll('div, section, aside')).filter((el) => {
    const text = String(el.innerText || '');
    if (!/participantes?|participants?|membros?|members?|dados do grupo|group info/i.test(text)) return false;
    const rect = el.getBoundingClientRect?.();
    if (!rect || rect.width < 180 || rect.width > window.innerWidth * 0.65 || rect.left < window.innerWidth * 0.45) return false;
    const rows = el.querySelectorAll('div[role="listitem"], div[role="row"], [data-testid*="cell-frame"], [data-testid*="participant"], span[title]').length;
    return rows >= 2;
  }).sort((a, b) => {
    const score = (el) => {
      const rows = el.querySelectorAll('div[role="listitem"], div[role="row"], [data-testid*="cell-frame"], [data-testid*="participant"], [data-testid*="contact"]').length;
      const phones = phoneFromText(el.innerText || '').length;
      return rows * 10 + phones * 25 + Math.min(20, Math.round((el.getBoundingClientRect().width * el.getBoundingClientRect().height) / 100000));
    };
    return score(b) - score(a);
  });
  if (genericPanels[0]) {
    console.log('MR: Encontrou painel lateral com participantes visíveis');
    return genericPanels[0];
  }

  // 3b. Fallback para a janela pequena de membros: em algumas versões ela não
  // recebe role=dialog nem contém a palavra “membros”; costuma ser uma janela
  // visível à direita, com vários nomes e sem o campo de pesquisa de chats.
  const smallMemberPanels = Array.from(document.querySelectorAll('div, section, aside')).filter((el) => {
    const rect = el.getBoundingClientRect?.();
    if (!rect || rect.width < 180 || rect.height < 120 || rect.left < window.innerWidth * 0.42) return false;
    const text = String(el.innerText || '').trim();
    if (!text || /Pesquisar|Search chats|Nova conversa|New chat/i.test(text)) return false;
    const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const visibleChildren = Array.from(el.querySelectorAll('span, div')).filter((node) => {
      const r = node.getBoundingClientRect?.();
      return r && r.width > 20 && r.height > 10 && cleanContactName(node.innerText || node.getAttribute('title') || '');
    });
    return lines.length >= 4 && visibleChildren.length >= 4;
  }).sort((a, b) => {
    const area = (el) => el.getBoundingClientRect().width * el.getBoundingClientRect().height;
    return area(a) - area(b);
  });
  if (smallMemberPanels[0]) {
    console.log('MR: Encontrou janela pequena de membros sem botão Ver tudo');
    return smallMemberPanels[0];
  }

  // 4. Fallback: Tenta encontrar o container de membros pela estrutura de classes
  // O WhatsApp Web costuma colocar a lista de membros dentro de um container específico
  const possibleLists = document.querySelectorAll('div[style*="overflow-y: auto"], div[style*="overflow: auto"], div[role="list"]');
  for (const list of possibleLists) {
    // Ignoramos a lista de chats da esquerda (geralmente tem o campo de busca no topo)
    const isChatList = !!list.querySelector('div[contenteditable="true"]') || !!list.querySelector('input[placeholder*="Pesquisar"]');
    if (isChatList) continue;

    const text = list.innerText || "";
    if (/participante|membro|admin|ver todos|view all|dados do grupo|group info/i.test(text) && (list.querySelectorAll('div[role="listitem"], div[role="row"], div[data-testid*="cell-frame"], div[data-testid*="participant"], span[title]').length > 0)) {
      console.log("MR: Encontrou lista de membros via fallback");
      return list;
    }
  }

  // 5. Fallback final para grupos pequenos: o WhatsApp pode mostrar apenas
  // nomes e avatares no painel direito, sem roles, data-testid ou “Ver tudo”.
  const avatarPanels = Array.from(document.querySelectorAll('div, section, aside')).filter((el) => {
    const rect = el.getBoundingClientRect?.();
    if (!rect || rect.left < window.innerWidth * 0.42 || rect.width < 180 || rect.height < 180) return false;
    const text = String(el.innerText || '').trim();
    if (!text || /Pesquisar ou começar|Search or start|Nova conversa|New chat/i.test(text)) return false;
    const avatars = Array.from(el.querySelectorAll('img')).filter((img) => {
      const r = img.getBoundingClientRect?.();
      return r && r.width >= 20 && r.height >= 20 && r.width <= 120 && r.height <= 120;
    });
    const lines = text.split(/\n+/).map((line) => cleanContactName(line)).filter(Boolean);
    return avatars.length >= 2 && lines.length >= 4;
  }).sort((a, b) => {
    const score = (el) => {
      const rect = el.getBoundingClientRect();
      return el.querySelectorAll('img').length * 20 + Math.min(40, Math.round(rect.height / 30));
    };
    return score(b) - score(a);
  });
  if (avatarPanels[0]) {
    console.log('MR: Usando painel direito com avatares para grupo pequeno');
    return avatarPanels[0];
  }

  return null;
}

const cancelledDispatchJobs = new Set();

const automation = {
  // 1. WHATSAPP — captura nome COMPLETO + número
  async extractWhatsApp(mode = "current", jobId = "", expectedGroup = "") {
    const map = new Map();
    const groupName = document.querySelector('#main header span[title]')?.getAttribute('title') || document.querySelector('#main header [data-testid="conversation-info-header-chat-title"]')?.textContent || document.querySelector('#main header span[dir="auto"]')?.textContent || document.querySelector('header span[title]')?.getAttribute('title') || "Grupo WhatsApp";
    if (expectedGroup) {
      const wanted = String(expectedGroup).replace(/\s+/g, ' ').trim().toLocaleLowerCase('pt-BR');
      const actual = String(groupName).replace(/\s+/g, ' ').trim().toLocaleLowerCase('pt-BR');
      if (actual && actual !== 'grupo whatsapp' && !actual.includes(wanted)) {
        return { ok: false, error: `O WhatsApp está aberto em “${groupName}”, não em “${expectedGroup}”. Abra o grupo secundário correto e tente novamente.` };
      }
    }
    
    // 1. Em grupos pequenos, o painel pode mostrar somente “8 membros”.
    // Clique nessa contagem para abrir a lista real antes de procurar o escopo.
    const memberCountNode = Array.from(document.querySelectorAll('span, div, button')).find((el) => {
      const rect = el.getBoundingClientRect?.();
      const text = String(el.innerText || el.getAttribute('aria-label') || '').trim();
      return rect && rect.left > window.innerWidth * 0.42 && rect.width > 35 &&
        /^\d+\s+(?:membros?|members?|participantes?|participants?)$/i.test(text);
    });
    if (memberCountNode) {
      const clickable = memberCountNode.closest('[role="button"], button, [tabindex="0"]') || memberCountNode;
      clickable.click();
      await sleep(1200);
    }

    // 2. Tenta clicar no botão "Ver tudo" ANTES de definir o escopo final
    const viewAllBtn = Array.from(document.querySelectorAll('span, div')).find(el => 
      (/ver tudo|view all/i.test(el.innerText) && el.innerText.includes("(")) || 
      (el.getAttribute('role') === 'button' && el.innerText.includes('mais'))
    );
    if (viewAllBtn) {
      viewAllBtn.click();
      await sleep(2500);
    }

    // 2. Define o escopo de extração (Prioriza o modal central se aberto)
    let extractionScope = document;
    if (mode === "current") {
      const panel = getWhatsAppGroupPanelScope();
      if (!panel) {
        return { ok: false, error: "Painel do grupo não encontrado. Abra os dados do grupo; em grupos pequenos não é necessário clicar em 'Ver tudo'." };
      }
      extractionScope = panel;
    }

    // Função auxiliar para pegar elementos de scroll dentro do escopo
    const getActiveScrollables = () => {
      if (!extractionScope) return [];
      return Array.from(extractionScope.querySelectorAll('div')).filter(d => {
        const style = window.getComputedStyle(d);
        return (style.overflowY === 'auto' || style.overflowY === 'scroll') && d.scrollHeight > d.clientHeight;
      });
    };

    // Captura estática inicial rápida
    scanWhatsAppScope(extractionScope, map);
    reportProgress(jobId, "Iniciando extração...", map.size, 5, toArray(map));

    let lastCount = -1;
    let staleCount = 0;
    
    // 3. Loop de Scroll Cadenciado (Mais lento e profundo)
    for (let i = 0; i < 400; i++) {
      const currentScrollables = getActiveScrollables();
      
      if (currentScrollables.length > 0) {
        currentScrollables.forEach((s) => {
          try { 
            s.scrollTop += 800; // Scroll menor para garantir carregamento
            const listContainer = s.querySelector('div[role="list"]') || s;
            listContainer.scrollTop += 800;
          } catch (_) {}
        });
      } else {
        // Fallback para o modal central
        const modalRow = extractionScope.querySelector?.('div[role="row"]');
        if (modalRow && modalRow.parentElement) {
          modalRow.parentElement.scrollTop += 800;
        }
        window.scrollBy(0, 500);
      }
      
      await sleep(1000); // Aumentado para 1 segundo para o WhatsApp renderizar
      scanWhatsAppScope(extractionScope, map);
      
      if (map.size === lastCount) staleCount++; else staleCount = 0;
      lastCount = map.size;
      
      // Se ficar 35 iterações sem achar nada, assume fim da lista
      if (staleCount > 35) break; 
      
      if (i % 5 === 0) reportProgress(jobId, "Extraindo membros...", map.size, 5 + ((i + 1) / 400) * 85, toArray(map));
    }

    // 4. Finalização e Fallbacks Legados
    try {
      getActiveScrollables().forEach(s => s.scrollTop = 0);
    } catch(e) {}

    scanWhatsAppScope(extractionScope, map);
    
    // Fallback legado dentro do escopo escolhido
    const rows = extractionScope.querySelectorAll?.('div[role="listitem"], div[role="row"], div[role="gridcell"]') || [];
    rows.forEach((row) => {
      const titles = row.querySelectorAll('span[title], span.copyable-text');
      let name = "", phone = "";
      titles.forEach((t) => {
        const v = (t.getAttribute('title') || t.innerText || "").trim();
        if (!v) return;
        const m = v.match(/\+?\d[\d\s\-()]{8,}\d/);
        if (m) phone = m[0].replace(/\D/g, "");
        else if (!name && v.length > 1 && v.length < 80 && !/^\d+$/.test(v)) name = v;
      });
      const pre = row.querySelector('[data-pre-plain-text]');
      if (pre) {
        const pv = pre.getAttribute('data-pre-plain-text') || "";
        const mm = pv.match(/\]\s*([^:]+):/);
        if (mm && !name) name = mm[1].trim();
      }
      if (phone) pushPair(map, phone, name);
    });

    // Fallback global final - USANDO extractionScope PARA EVITAR ERRO DE VARIÁVEL
    if (extractionScope && extractionScope.querySelectorAll) {
      extractionScope.querySelectorAll('a[href*="wa.me"], a[href*="phone="]').forEach((a) => {
        const href = a.getAttribute('href') || "";
        const phones = phoneFromText(href);
        phones.forEach(p => pushPair(map, p, (a.innerText || "").trim()));
      });
    }

    const data = toArray(map);
    reportProgress(jobId, "Extração concluída!", data.length, 100, data);
    return { ok: true, name: groupName, data, hint: data.length ? "" : "Abra os dados do grupo e deixe os nomes e avatares dos participantes visíveis. Em grupos pequenos, não é necessário clicar em 'Ver tudo'." };
  },

  // 2. TELEGRAM
  async extractTelegram(jobId = "") {
    const map = new Map();
    const groupName = document.querySelector('.peer-title, .ChatInfo .title')?.innerText || "Grupo Telegram";
    const panels = document.querySelectorAll('.RightColumn .custom-scroll, .Profile .custom-scroll, .chat-info .scrollable, .sidebar-content .scrollable');
    let lastCount = -1, stable = 0;
    reportProgress(jobId, "A ler membros do Telegram", 0, 5, []);
    for (let i = 0; i < 60; i++) {
      panels.forEach((p) => { try { p.scrollTop = p.scrollHeight; } catch (_) {} });
      await sleep(250);
      const now = document.querySelectorAll('.ListItem-details .title, .peer-title, .username').length;
      if (now === lastCount) { stable++; if (stable > 5) break; } else stable = 0;
      lastCount = now;
      if (i % 2 === 0) reportProgress(jobId, "A rolar membros do Telegram", map.size, 5 + ((i + 1) / 60) * 70, toArray(map));
    }
    const items = document.querySelectorAll('.ListItem, li.chatlist-chat, .participant');
    items.forEach((it) => {
      const nameEl = it.querySelector('.ListItem-details .title, .peer-title, .fullName, .user-title');
      const userEl = it.querySelector('.username, .user-username, [class*="username"]');
      const name = (nameEl?.innerText || "").trim();
      let contact = (userEl?.innerText || "").trim();
      if (contact && !contact.startsWith('@')) contact = '@' + contact.replace(/^@/, '');
      if (!contact && name) contact = name;
      if (contact) pushPair(map, contact, name || contact);
    });
    reportProgress(jobId, "A consolidar membros do Telegram", map.size, 85, toArray(map));
    // Fallback: tg://user?id=
    document.querySelectorAll('a[href^="tg://"]').forEach((a) => {
      const h = a.getAttribute('href') || "";
      const m = h.match(/user\?id=(\d+)/);
      if (m) pushPair(map, 'id:' + m[1], (a.innerText || "").trim());
    });
    const data = toArray(map);
    reportProgress(jobId, "Extração do Telegram concluída", data.length, 99, data);
    return { name: groupName, data };
  },

  // 3. INSTAGRAM lista aberta
  async extractInstagram(jobId = "") {
    const map = new Map();
    const target = document.querySelector('header h2, h2._aacl, header section h2')?.innerText || "Perfil Instagram";
    const dialog = document.querySelector('div[role="dialog"] div[style*="overflow"], div[role="dialog"] ._aano');
    let lastH = 0, stable = 0;
    reportProgress(jobId, "A ler a lista do Instagram", 0, 5, []);
    for (let i = 0; i < 60 && dialog; i++) {
      try { dialog.scrollTop = dialog.scrollHeight; } catch (_) {}
      await sleep(320);
      if (dialog.scrollHeight === lastH) { stable++; if (stable > 5) break; } else stable = 0;
      lastH = dialog.scrollHeight;
      if (i % 2 === 0) reportProgress(jobId, "A rolar a lista do Instagram", map.size, 5 + ((i + 1) / 60) * 70, toArray(map));
    }
    const rows = document.querySelectorAll('div[role="dialog"] div[role="button"], div[role="dialog"] li, div[role="dialog"] > div > div > div');
    rows.forEach((row) => {
      const link = row.querySelector('a[href^="/"]');
      if (!link) return;
      const href = link.getAttribute('href') || "";
      const m = href.match(/^\/([A-Za-z0-9_.]+)\/?$/);
      if (!m) return;
      const handle = '@' + m[1];
      // Nome completo geralmente em <span> abaixo do handle
      const spans = row.querySelectorAll('span');
      let name = "";
      spans.forEach((s) => {
        const t = (s.innerText || "").trim();
        if (t && t !== m[1] && t !== handle && !t.startsWith('•') && t.length < 60 && !name) name = t;
      });
      pushPair(map, handle, name || handle);
    });
    const data = toArray(map);
    reportProgress(jobId, "Extração do Instagram concluída", data.length, 99, data);
    return { name: target, data };
  },

  // 3b. INSTAGRAM POST
  async extractInstagramPost(jobId = "") {
    const map = new Map();
    if (!location.pathname.match(/^\/(p|reel)\//)) {
      return { name: "Post Instagram", data: [], hint: "Abra o post primeiro." };
    }
    const title = document.title || "Post Instagram";
    reportProgress(jobId, "A abrir curtidas do post", 0, 5, []);
    const likesLink = document.querySelector('a[href*="/liked_by/"]');
    if (likesLink) { likesLink.click(); await sleep(2500); }
    const dialog = document.querySelector('div[role="dialog"] div[style*="overflow"], div[role="dialog"] ._aano');
    let lastH = 0, stable = 0;
    for (let i = 0; i < 50 && dialog; i++) {
      try { dialog.scrollTop = dialog.scrollHeight; } catch (_) {}
      await sleep(320);
      if (dialog.scrollHeight === lastH) { stable++; if (stable > 5) break; } else stable = 0;
      lastH = dialog.scrollHeight;
      if (i % 2 === 0) reportProgress(jobId, "A ler curtidas", map.size, 5 + ((i + 1) / 50) * 45, toArray(map));
    }
    document.querySelectorAll('div[role="dialog"] div[role="button"], div[role="dialog"] li').forEach((row) => {
      const link = row.querySelector('a[href^="/"]');
      if (!link) return;
      const m = (link.getAttribute('href') || "").match(/^\/([A-Za-z0-9_.]+)\/?$/);
      if (!m) return;
      let name = "";
      row.querySelectorAll('span').forEach((s) => {
        const t = (s.innerText || "").trim();
        if (t && t !== m[1] && t.length < 60 && !name) name = t;
      });
      pushPair(map, '@' + m[1], name);
    });

    const close = document.querySelector('svg[aria-label="Fechar"], svg[aria-label="Close"]')?.closest('div[role="button"], button');
    if (close) close.click();
    await sleep(1200);
    reportProgress(jobId, "A ler comentários", map.size, 55, toArray(map));
    for (let i = 0; i < 15; i++) {
      const more = Array.from(document.querySelectorAll('button, span')).find((b) => /Ver mais comentários|View more comments|Load more/i.test(b.innerText || ""));
      if (more) more.click();
      await sleep(1200);
      if (i % 2 === 0) reportProgress(jobId, "A carregar comentários", map.size, 55 + ((i + 1) / 15) * 35, toArray(map));
    }
    document.querySelectorAll('ul li').forEach((li) => {
      const a = li.querySelector('a[href^="/"]');
      if (!a) return;
      const m = (a.getAttribute('href') || "").match(/^\/([A-Za-z0-9_.]+)\/?$/);
      if (!m) return;
      let name = "";
      li.querySelectorAll('span').forEach((s) => {
        const t = (s.innerText || "").trim();
        if (t && t !== m[1] && t.length < 60 && !name) name = t;
      });
      pushPair(map, '@' + m[1], name);
    });

    const data = toArray(map);
    reportProgress(jobId, "Post do Instagram concluído", data.length, 99, data);
    return { name: title.replace(/\s*[·•|].*$/, "").slice(0, 80), data };
  },

  // 4. YOUTUBE (robusto: rola até os comentários e lê os @ pelo href do autor)
  async extractYouTube(jobId = "") {
    const map = new Map();
    const videoTitle =
      (document.querySelector('h1.ytd-watch-metadata, h1.ytd-video-primary-info-renderer, h1.title')?.innerText || "").trim() ||
      (document.title || "Vídeo YouTube").replace(/ - YouTube$/, "");

    reportProgress(jobId, "A preparar comentários do YouTube", 0, 5, []);
    const collect = () => {
      const nodes = document.querySelectorAll(
        'ytd-comment-view-model, ytd-comment-thread-renderer, ytd-comment-renderer'
      );
      nodes.forEach((c) => {
        const a =
          c.querySelector('a#author-text') ||
          c.querySelector('#author-text a') ||
          c.querySelector('#header-author a[href*="/@"]') ||
          c.querySelector('a[href*="/@"]');
        if (!a) return;
        const href = a.getAttribute('href') || "";
        let handle = "";
        const m = href.match(/\/(@[A-Za-z0-9._-]+)/);
        if (m) handle = m[1];
        const txt = (a.innerText || a.textContent || "").trim();
        if (!handle && txt.startsWith('@')) handle = txt;
        if (!handle) return;
        const full = txt && !txt.startsWith('@') ? txt : handle;
        pushPair(map, handle, full);
      });
      return map.size;
    };

    // garante que a seção de comentários seja renderizada
    const commentsAnchor = document.querySelector('#comments, ytd-comments');
    if (commentsAnchor) commentsAnchor.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollTo(0, 900);
    await sleep(1800);

    let last = -1, stale = 0;
    for (let i = 0; i < 60 && stale < 6; i++) {
      window.scrollBy(0, 1000);
      // Rola especificamente a área de comentários se achá-la
      const scroller = document.querySelector('ytd-app') || document.documentElement;
      scroller.scrollTop += 1000;
      
      await sleep(800);
      const count = collect();
      if (count === last) stale++; else { stale = 0; last = count; }
      if (i % 2 === 0) reportProgress(jobId, "A rolar comentários do YouTube", count, 5 + ((i + 1) / 60) * 85, toArray(map));
    }
    const data = toArray(map);
    reportProgress(jobId, "Comentários do YouTube concluídos", data.length, 99, data);

    return {
      name: videoTitle.slice(0, 80) || "Vídeo YouTube",
      data,
      hint: "Abra o vídeo (youtube.com/watch), role até os comentários carregarem e tente de novo.",
    };
  },


  // 5. DISPARO chat aberto
  // ---- Utilitários de mídia (upload real de imagem/vídeo) ----
  _normalizeMediaItem(entry) {
    if (!entry) return null;
    if (typeof entry === "string") return { dataUrl: entry };
    if (entry.dataUrl) return entry;
    return null;
  },

  async _dataUrlToFile(media) {
    const res = await fetch(media.dataUrl);
    const blob = await res.blob();
    const fallbackName = typeof media.dataUrl === "string" && !media.dataUrl.startsWith("data:")
      ? (media.dataUrl.split("/").pop() || "midia").split("?")[0]
      : "midia";
    return new File([blob], media.name || fallbackName, { type: media.type || blob.type || "application/octet-stream" });
  },

  // Abre o menu de anexo (clipe/+) do WhatsApp Web e escolhe "Fotos e vídeos",
  // pra garantir que exista um <input type="file"> real no DOM antes de tentar
  // anexar — sem isso, o anexo só funcionava por coincidência quando já havia
  // um input residual na página.
  // Tenta achar e clicar no botão de anexo (clipe/+) do WhatsApp Web. Faz um pequeno
  // retry (o botão pode ainda não estar renderizado no instante em que attachMedia
  // roda) e usa _fireClick (sequência completa de eventos de ponteiro), porque um
  // .click() simples às vezes não é o bastante pro handler React reagir.
  async _openWaAttachPicker() {
    const clipSelectors = [
      'span[data-icon="clip"]', 'span[data-icon="plus-rounded"]', 'span[data-icon="attach-menu-plus"]',
      'span[data-icon="wds-ic-attach-outline-refreshed"]', 'span[data-icon="ic-attach-menu-plus"]',
      'div[title="Anexar"]', 'div[aria-label="Anexar"]', 'button[aria-label="Anexar"]',
      'div[title="Attach"]', 'div[aria-label="Attach"]', 'button[aria-label="Attach"]',
      '[data-icon*="clip" i]', '[data-icon*="attach" i]', '[aria-label*="anexar" i]', '[aria-label*="attach" i]',
    ];
    const started = Date.now();
    while (Date.now() - started < 4000) {
      for (const sel of clipSelectors) {
        const node = document.querySelector(sel);
        if (node) {
          const target = node.closest('button, div[role="button"]') || node;
          console.log('[MR Social Growth] botão de anexo encontrado via', sel);
          this._fireClick(target);
          return true;
        }
      }
      await sleep(200);
    }
    console.warn('[MR Social Growth] não encontrei o botão de anexo (clipe) do WhatsApp em nenhum dos seletores conhecidos');
    return false;
  },

  async _clickWaPhotoVideoMenuItem() {
    const started = Date.now();
    let texts = [];
    while (Date.now() - started < 2500) {
      const items = Array.from(document.querySelectorAll('li, div[role="button"], button'));
      texts = items.map((el) => (el.innerText || el.getAttribute('aria-label') || '').trim()).filter(Boolean);
      const match = items.find((el) => /Fotos e v[ií]deos|Photos\s*&?\s*[Vv]ideos/i.test(el.innerText || el.getAttribute('aria-label') || ''));
      if (match) {
        console.log('[MR Social Growth] clicando no item do menu:', match.innerText || match.getAttribute('aria-label'));
        this._fireClick(match);
        await sleep(400);
        return true;
      }
      await sleep(200);
    }
    console.log('[MR Social Growth] menu de anexo — itens vistos:', texts);
    console.warn('[MR Social Growth] não achei "Fotos e vídeos" no menu de anexo — veja a lista de itens acima');
    return false;
  },

  // Classifica os <input type="file"> encontrados por especificidade do "accept":
  // um input que aceita "image/*,video/*" é quase certamente o seletor de Fotos e
  // vídeos (gera prévia real); um input sem accept (ou accept="*") é quase certamente
  // o de Documento (anexa como arquivo genérico, sem prévia — foi isso que aconteceu
  // quando o vídeo apareceu como "Prévia indisponível"). Por isso o genérico só é
  // usado como ÚLTIMO recurso, nunca escolhido por engano na frente do certo.
  _rankMediaInputs(wantsImage, wantsVideo) {
    const all = Array.from(document.querySelectorAll('input[type="file"]'));
    const specific = [];
    const generic = [];
    for (const i of all) {
      const acc = (i.getAttribute('accept') || '').toLowerCase();
      const matchesWanted = (wantsImage && acc.includes('image')) || (wantsVideo && acc.includes('video'));
      if (matchesWanted) specific.push(i);
      else if (!acc || acc.includes('*')) generic.push(i);
    }
    return { specific, generic };
  },

  async _findMediaInputs(files) {
    const wantsImage = files.some((f) => f.type.startsWith('image'));
    const wantsVideo = files.some((f) => f.type.startsWith('video'));
    let { specific, generic } = this._rankMediaInputs(wantsImage, wantsVideo);
    if (specific.length) {
      console.log('[MR Social Growth] _findMediaInputs: input específico já presente no DOM, sem precisar abrir o clipe', specific.map((i) => i.getAttribute('accept')));
      return specific;
    }
    // Não achou o input certo de cara — abre o clipe e escolhe "Fotos e vídeos"
    // de verdade, em vez de aceitar um input genérico (documento) por engano.
    const openedPicker = await this._openWaAttachPicker();
    console.log('[MR Social Growth] _findMediaInputs: abriu o clipe?', openedPicker);
    if (openedPicker) {
      const clickedPhotoVideo = await this._clickWaPhotoVideoMenuItem();
      console.log('[MR Social Growth] _findMediaInputs: clicou em "Fotos e vídeos"?', clickedPhotoVideo);
      ({ specific, generic } = this._rankMediaInputs(wantsImage, wantsVideo));
      if (specific.length) {
        console.log('[MR Social Growth] _findMediaInputs: input específico apareceu depois de abrir o clipe', specific.map((i) => i.getAttribute('accept')));
        return specific;
      }
    }
    console.warn('[MR Social Growth] _findMediaInputs: NÃO achei input específico (image/video) — indo pro genérico como último recurso', generic.map((i) => i.getAttribute('accept')));
    return generic;
  },

  async _waitMediaPreview(timeoutMs = 6000) {
    const started = Date.now();
    const sel = 'div[data-testid="media-canvas"], div[data-animate-modal-body] img, div[data-animate-modal-body] video, div[role="dialog"] img, div[role="dialog"] video, div[data-testid="media-caption"]';
    while (Date.now() - started < timeoutMs) {
      if (document.querySelector(sel)) return true;
      await sleep(200);
    }
    return false;
  },

  // Clica no item "Documento" do menu de anexo — usado quando o formato do vídeo
  // não é suportado pelo player do WhatsApp Web (MOV/AVI/MKV/WMV/3GP etc.).
  // Assim o arquivo é entregue integralmente como documento em vez de falhar.
  async _clickWaDocumentMenuItem() {
    const started = Date.now();
    while (Date.now() - started < 2500) {
      const items = Array.from(document.querySelectorAll('li, div[role="button"], button'));
      const match = items.find((el) => /Documento|Document/i.test(el.innerText || el.getAttribute('aria-label') || ''));
      if (match) { this._fireClick(match); await sleep(400); return true; }
      await sleep(200);
    }
    return false;
  },

  async _attachAsDocument(file, dt, tag) {
    console.log(tag, 'tentando anexar como DOCUMENTO');
    const before = new Set(Array.from(document.querySelectorAll('input[type="file"]')));
    if (!(await this._openWaAttachPicker())) return false;
    await this._clickWaDocumentMenuItem();
    const all = Array.from(document.querySelectorAll('input[type="file"]'));
    const fresh = all.filter((i) => !before.has(i));
    const generic = all.filter((i) => {
      const acc = (i.getAttribute('accept') || '').toLowerCase();
      return !acc || acc.includes('*');
    });
    for (const input of [...fresh, ...generic]) {
      try {
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        const ok = await this._waitDocumentPreview(15000);
        console.log(tag, 'via DOCUMENTO ->', ok ? 'prévia/dialog apareceu' : 'sem prévia');
        if (ok) return true;
      } catch (e) { console.warn(tag, 'erro tentando input de documento', e); }
    }
    return false;
  },

  async _waitDocumentPreview(timeoutMs = 12000) {
    const started = Date.now();
    const sel = 'div[role="dialog"], div[data-animate-modal-body], div[data-testid="media-caption"], div[data-testid="document-thumb"]';
    while (Date.now() - started < timeoutMs) {
      if (document.querySelector(sel)) return true;
      await sleep(200);
    }
    return false;
  },

  async attachMedia(box, media) {
    const raw = Array.isArray(media) ? media.find((entry) => !!this._normalizeMediaItem(entry)) : media;
    const item = this._normalizeMediaItem(raw);
    if (!item?.dataUrl) throw new Error("Nenhum arquivo de mídia foi selecionado.");
    const file = await this._dataUrlToFile(item);
    const files = [file];
    const dt = new DataTransfer();
    dt.items.add(file);
    const tag = `[MR Social Growth] attachMedia(${file.type || '?'}, ${(file.size / 1024 / 1024).toFixed(1)}MB)`;
    console.log(tag, 'iniciando');

    // 1ª tentativa: input[type=file] do anexo, abrindo o menu "clipe" se preciso
    // pra não depender de sobrar um input escondido de uma tela anterior.
    const inputs = await this._findMediaInputs(files);
    console.log(tag, `${inputs.length} input(s) de arquivo encontrado(s)`);
    // Vídeo grande demora mais pra o WhatsApp gerar a prévia (decodificar o
    // arquivo, gerar thumbnail) do que uma imagem — 6s costumava ser
    // suficiente pra imagem mas insuficiente pra vídeo, fazendo o código
    // desistir cedo demais mesmo com o input certo selecionado (por isso
    // funcionava quando o vídeo era o 2º item do lote, com mais tempo total
    // decorrido, e falhava sozinho/como 1º item).
    const previewTimeout = file.type.startsWith('video') ? 20000 : 6000;
    let attached = false;
    // Formato marcado como incompatível pelo painel: vai direto pelo caminho de
    // Documento (não perde tempo tentando gerar prévia que nunca vai aparecer).
    if (item.asDocument) {
      attached = await this._attachAsDocument(file, dt, tag);
      if (attached) {
        console.log(tag, 'anexado como documento (formato sem prévia no WhatsApp Web)');
        await sleep(rand(1500, 2500));
        return true;
      }
    }
    for (const input of inputs) {
      try {
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        attached = await this._waitMediaPreview(previewTimeout);
        console.log(tag, 'via input[type=file] ->', attached ? 'prévia apareceu' : 'sem prévia', `(esperei até ${previewTimeout}ms)`);
        if (attached) break;
      } catch (e) { console.warn(tag, 'erro tentando input[type=file]', e); }
    }

    // 2ª tentativa: se o input escolhido por "accept" não deu prévia real (o
    // "Prévia indisponível" indica que caiu num input de Documento, não no de
    // Fotos e vídeos), força abrir o fluxo de verdade do WhatsApp (clipe ->
    // "Fotos e vídeos") e usa SÓ o input que aparecer NOVO no DOM depois disso
    // — em vez de confiar de novo no atributo accept, que pode bater com algum
    // input de outra função da página (foto de perfil, ícone de grupo etc.)
    // que só parece certo mas não é o da tela de anexo real.
    if (!attached) {
      const before = new Set(Array.from(document.querySelectorAll('input[type="file"]')));
      const openedPicker = await this._openWaAttachPicker();
      console.log(tag, 'input por accept falhou — forçando abrir o clipe pra achar o input real ->', openedPicker);
      if (openedPicker) {
        await this._clickWaPhotoVideoMenuItem();
        const freshInputs = Array.from(document.querySelectorAll('input[type="file"]')).filter((i) => !before.has(i));
        console.log(tag, `${freshInputs.length} input(s) NOVO(S) apareceram depois de abrir o clipe`, freshInputs.map((i) => i.getAttribute('accept')));
        for (const input of freshInputs) {
          try {
            input.files = dt.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            attached = await this._waitMediaPreview(previewTimeout);
            console.log(tag, 'via input NOVO ->', attached ? 'prévia apareceu' : 'sem prévia');
            if (attached) break;
          } catch (e) { console.warn(tag, 'erro tentando input NOVO', e); }
        }
      }
    }

    // 3ª tentativa: colar no compositor — o WhatsApp Web só aceita isso de
    // forma confiável para IMAGEM; vídeo colado por paste não é reconhecido,
    // então esse fallback nunca é usado para vídeo (evita reportar sucesso falso).
    if (!attached && box && file.type.startsWith('image')) {
      const paste = new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dt });
      try { Object.defineProperty(paste, 'clipboardData', { value: dt }); } catch (_) {}
      box.focus();
      box.dispatchEvent(paste);
      attached = await this._waitMediaPreview(6000);
      console.log(tag, 'via paste ->', attached ? 'prévia apareceu' : 'sem prévia');
    }

    // 4ª tentativa: qualquer arquivo que não gerou prévia (vídeo em codec/container
    // que o WhatsApp Web não decodifica, ou imagem exótica) ainda pode ser entregue
    // como DOCUMENTO — melhor enviar íntegro como documento do que falhar o item.
    if (!attached) {
      attached = await this._attachAsDocument(file, dt, tag);
      if (attached) {
        console.log(tag, 'anexado como documento (fallback)');
        await sleep(rand(1500, 2500));
        return true;
      }
    }

    if (!attached) {
      console.error(tag, 'FALHOU em anexar (nenhuma prévia apareceu)');
      throw new Error(file.type.startsWith('video')
        ? "Não consegui anexar o vídeo nesta tela. Abra o menu de anexo (clipe) do WhatsApp manualmente uma vez e tente de novo."
        : "Não consegui anexar o arquivo nesta tela.");
    }
    console.log(tag, 'anexado com sucesso, aguardando processamento...');
    await sleep(file.type.startsWith('video') ? rand(3000, 5000) : rand(800, 1500));
    return true;
  },

  _findComposer() {
    const candidates = Array.from(document.querySelectorAll('div[contenteditable="true"], div[role="textbox"][contenteditable="true"], textarea'));
    const visible = candidates.filter((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    });
    const host = location.host;
    if (host.includes('whatsapp.com')) {
      const footer = visible.filter((el) => el.closest('footer') || el.getAttribute('data-tab') === '10' || el.getAttribute('data-tab') === '6');
      return footer[footer.length - 1] || visible[visible.length - 1] || null;
    }
    if (host.includes('telegram.org')) return visible.find((el) => el.matches('div.input-message-input, #editable-message-text')) || visible[visible.length - 1] || null;
    return visible[visible.length - 1] || null;
  },

  _outgoingCount() {
    return document.querySelectorAll('div.message-out, div[data-testid="msg-container"][data-id^="true_"]').length;
  },

  async _waitForComposer(timeoutMs = 20000) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      const box = this._findComposer();
      if (box) return box;
      await sleep(500);
    }
    return null;
  },

  _composerText(box) {
    return String(box?.innerText || box?.textContent || box?.value || '').replace(/\u200b/g, '').trim();
  },

  _typeInto(box, message) {
    if (!box) throw new Error('Caixa de mensagem não encontrada.');
    const text = String(message || '');
    box.focus();
    box.click?.();
    try { document.execCommand('selectAll', false, null); document.execCommand('delete', false, null); } catch (_) {}
    if (box instanceof HTMLTextAreaElement || box instanceof HTMLInputElement) {
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(box), 'value')?.set;
      if (setter) setter.call(box, text); else box.value = text;
    } else {
      document.execCommand('insertText', false, text);
      if (!this._composerText(box) && text) box.textContent = text;
    }
    try {
      box.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    } catch (_) { box.dispatchEvent(new Event('input', { bubbles: true })); }
    box.dispatchEvent(new Event('change', { bubbles: true }));
  },

  // Clique sintético completo (mousedown+mouseup+click). Um .click() simples às vezes
  // não é suficiente pro handler React do WhatsApp Web reagir, dependendo da versão.
  _fireClick(el) {
    const opts = { bubbles: true, cancelable: true, view: window };
    try { el.dispatchEvent(new PointerEvent('pointerdown', opts)); } catch (_) {}
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    try { el.dispatchEvent(new PointerEvent('pointerup', opts)); } catch (_) {}
    el.dispatchEvent(new MouseEvent('click', opts));
    if (typeof el.click === 'function') el.click();
  },

  async _pressSend(box, beforeOutgoing = 0, requireOutgoing = false) {
    if (!box) throw new Error('Caixa de mensagem não encontrada.');
    // Quando há um modal de pré-visualização de mídia aberto (foto/vídeo com legenda),
    // o botão de enviar dele é o alvo certo — procurar nele primeiro evita clicar em
    // algum outro botão "enviar" que por acaso esteja escondido no resto da página.
    const dialog = document.querySelector('div[role="dialog"]');
    const selectors = [
      'button[aria-label="Enviar"]', 'button[aria-label="Send"]',
      'div[role="button"][aria-label="Enviar"]', 'div[role="button"][aria-label="Send"]',
      'span[data-icon="send"]', 'span[data-icon="wds-ic-send-filled"]',
      'span[data-testid="send"]', 'footer [data-testid="send"]',
      // Coringas: cobrem nomes de ícone/aria-label que o WhatsApp troca entre versões
      // (ex.: "wds-ic-send-filled", "ic-send-light" etc.) sem depender de acertar o nome exato.
      '[data-icon*="send" i]', '[aria-label*="enviar" i]', '[aria-label*="send" i]', '[data-testid*="send" i]',
    ];
    await sleep(500);
    let clicked = false;
    // Vídeo grande pode ficar "processando" no WhatsApp por muito mais que alguns
    // segundos depois de anexado (o botão de enviar existe mas fica desabilitado até
    // terminar) — por isso a varredura insiste por até 1 minuto, tentando de novo a
    // cada 700ms, em vez de cair pro fallback de teclado rápido demais.
    console.log('[MR Social Growth] _pressSend: dialog aberto?', !!dialog);
    const searchDeadline = Date.now() + 60000;
    let bestSeen = null; // guarda o melhor candidato encontrado (mesmo desabilitado) pra log final
    searchLoop: while (Date.now() < searchDeadline) {
      for (const selector of selectors) {
        const scoped = dialog ? Array.from(dialog.querySelectorAll(selector)) : [];
        const pool = scoped.length ? scoped : Array.from(document.querySelectorAll(selector));
        const node = pool.find((el) => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
        if (node) {
          const target = node.closest('button, div[role="button"]') || node;
          const isDisabled = target.disabled || target.getAttribute('aria-disabled') === 'true';
          if (!bestSeen) bestSeen = { selector, outerHTML: target.outerHTML?.slice(0, 300), disabled: isDisabled };
          if (!isDisabled) {
            console.log('[MR Social Growth] _pressSend: clicando via', selector, target.outerHTML?.slice(0, 300));
            this._fireClick(target); clicked = true; break searchLoop;
          }
        }
      }
      await sleep(700);
    }
    if (!clicked) {
      console.warn('[MR Social Growth] _pressSend: nenhum botão clicável encontrado em 60s. Melhor candidato visto:', bestSeen);
    }
    let triggered = clicked;
    if (!clicked) {
      // Fallback por teclado: usar a própria caixa de legenda do modal (quando existir),
      // não a caixa do chat por trás dele — que já não é o campo em foco.
      const modalBox = dialog?.querySelector('div[contenteditable="true"], div[role="textbox"][contenteditable="true"]') || box;
      console.log('[MR Social Growth] _pressSend: fallback teclado Enter em', modalBox);
      modalBox.focus();
      modalBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
      triggered = true;
    }
    // Depois de clicar, o upload em si (sobretudo de vídeo grande) pode levar bem
    // mais que alguns segundos até confirmar — por isso essa espera final também é
    // generosa quando é mídia (requireOutgoing).
    const started = Date.now();
    const confirmTimeout = requireOutgoing ? 60000 : 12000;
    while (Date.now() - started < confirmTimeout) {
      await sleep(500);
      const remaining = this._composerText(this._findComposer());
      if (this._outgoingCount() > beforeOutgoing) return true;
      // Para mídia, não aceitar apenas o desaparecimento do compositor:
      // é obrigatório aparecer uma nova mensagem de saída no chat.
      if (!requireOutgoing && !remaining && triggered) return true;
    }
    throw new Error('O WhatsApp abriu a conversa, mas não confirmou o envio.');
  },

  async sendOpenChat(message, media) {
    const mediaList = Array.isArray(media) ? media.filter((item) => item?.dataUrl) : [media].filter(Boolean);
    const hasMedia = mediaList.length > 0;
    const host = location.host;
    if (host.includes('instagram.com') && !location.pathname.startsWith('/direct/')) {
      const msgBtn = Array.from(document.querySelectorAll('div[role="button"], button')).find((b) => /Enviar mensagem|Message|Mensagem/i.test(b.innerText || ""));
      if (msgBtn) { msgBtn.click(); await sleep(2500); }
    }
    let box = await this._waitForComposer(20000);
    const beforeOutgoing = this._outgoingCount();

    if (!box && !hasMedia) {
      const blocked = Array.from(document.querySelectorAll('div,span'))
        .some((el) => /somente administradores|somente admins|only admins|admins only|apenas administradores|só administradores/i.test(el.innerText || ""));
      throw new Error(blocked
        ? "Este grupo está configurado para aceitar mensagens somente de administradores. A extensão não consegue enviar nele se sua conta não for admin."
        : "Caixa de mensagem não encontrada. Abra a conversa/grupo.");
    }

    await sleep(600);

    // Com mídia: anexa e envia um arquivo por vez. Isso evita que a seleção de imagens
    // substitua o vídeo em versões do WhatsApp Web que aceitam apenas um arquivo por input.
    // Cada item roda isolado (try/catch próprio): se um arquivo falhar ao anexar, os
    // próximos da lista continuam sendo tentados em vez de a falha travar o lote inteiro
    // (era isso que fazia, por exemplo, o vídeo — sempre o último da lista — nunca ser
    // tentado quando a 2ª imagem já tinha falhado antes dele).
    if (hasMedia) {
      const results = [];
      console.log(`[MR Social Growth] sendOpenChat: iniciando lote de ${mediaList.length} mídia(s)`, mediaList.map((m) => m?.name || m?.type || '?'));
      for (let index = 0; index < mediaList.length; index++) {
        const item = mediaList[index];
        const label = (item && typeof item === "object" && item.name) || `mídia ${index + 1}`;
        console.log(`[MR Social Growth] sendOpenChat: item ${index + 1}/${mediaList.length} (${label}) — anexando...`);
        try {
          await this.attachMedia(this._findComposer() || box, item);
          const caption = this._findComposer() || document.querySelector('div[contenteditable="true"]');
          // A descrição fica como legenda do primeiro arquivo; os demais seguem em sequência.
          if (index === 0 && message && caption) { this._typeInto(caption, message); await sleep(800); }
          const currentBefore = this._outgoingCount();
          console.log(`[MR Social Growth] sendOpenChat: item ${index + 1}/${mediaList.length} (${label}) — anexado, tentando enviar...`);
          await this._pressSend(caption, Math.max(beforeOutgoing, currentBefore), true);
          console.log(`[MR Social Growth] sendOpenChat: item ${index + 1}/${mediaList.length} (${label}) — ENVIADO`);
          await sleep(rand(1800, 3000));
          results.push({ ok: true, name: label });
        } catch (e) {
          console.error(`[MR Social Growth] sendOpenChat: item ${index + 1}/${mediaList.length} (${label}) — FALHOU:`, e);
          results.push({ ok: false, name: label, error: String((e && e.message) || e) });
        }
      }
      const failed = results.filter((r) => !r.ok);
      console.log('[MR Social Growth] sendOpenChat: resultado final', results);
      return {
        ok: failed.length === 0,
        media: true,
        mediaCount: mediaList.length,
        sentCount: results.length - failed.length,
        failed,
        confirmed: true,
        error: failed.length ? `Falhou: ${failed.map((f) => `${f.name} (${f.error})`).join(" · ")}` : undefined,
      };
    }

    this._typeInto(box, message);
    await sleep(800);
    await this._pressSend(box, beforeOutgoing);
    return { ok: true };
  },


  async igGrowth(target) {
    const clean = String(target || "").replace('@', '').trim();
    if (!clean) throw new Error("Alvo vazio");
    if (!location.href.includes('/' + clean)) {
      location.href = 'https://www.instagram.com/' + clean + '/';
      return { ok: true, message: "Abrindo perfil. Clique novamente após carregar." };
    }
    const posts = document.querySelectorAll('a[href*="/p/"]');
    let liked = 0;
    for (let i = 0; i < Math.min(6, posts.length); i++) {
      posts[i].click();
      await sleep(3000 + rand(500, 1500));
      const likeBtn = document.querySelector('svg[aria-label="Curtir"], svg[aria-label="Like"]')?.closest('div[role="button"], button');
      if (likeBtn) { likeBtn.click(); liked++; }
      await sleep(1500 + rand(500, 2000));
      const close = document.querySelector('svg[aria-label="Fechar"], svg[aria-label="Close"]')?.closest('div[role="button"], button');
      if (close) close.click();
      await sleep(1500 + rand(500, 1200));
    }
    return { ok: true, liked };
  },

  // 9. PASSO DE DISPARO SEQUENCIAL WHATSAPP (Agendador)
  async sendWaSequentialStep(contact, message, mediaUrl, title) {
    const phone = String(contact).replace(/\D/g, "");
    if (!phone) throw new Error("Número inválido.");
    
    // 1. Abrir conversa via URL
    window.location.href = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    await sleep(8000); // Espera carregar o chat
    
    // 2. Tenta enviar mídia se houver
    if (mediaUrl) {
      try {
        await this.sendOpenChat("", mediaUrl);
        await sleep(2000);
      } catch(e) { console.error("Erro ao enviar mídia agendada:", e); }
    }
    
    // 3. Tenta clicar no botão de enviar (o texto já deve estar no input pela URL)
    const box = await this._waitForComposer(20000);
    const beforeOutgoing = this._outgoingCount();
    await this._pressSend(box, beforeOutgoing);
    
    return { ok: true };
  },

  // 8. OBTER CONTATOS DO WHATSAPP
  async getContacts() {
    const contacts = new Set();
    // Procura na lista de chats
    document.querySelectorAll('div[role="listitem"] span[title], div[role="listitem"] span.copyable-text').forEach((el) => {
      const text = el.getAttribute('title') || el.innerText || '';
      const match = text.match(/\+?\d[\d\s\-()]{8,}\d/);
      if (match) contacts.add(match[0].replace(/\D/g, ''));
    });
    // Procura em links wa.me
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach((a) => {
      const match = a.getAttribute('href').match(/\d+/);
      if (match) contacts.add(match[0]);
    });
    return { ok: true, contacts: Array.from(contacts).slice(0, 50) };
  },

  // 6. ADICIONAR AO GRUPO — WhatsApp (Adiciona de verdade, não como mensagem)
  async addToWhatsAppGroup(targets) {
    // Abre painel de dados do grupo
    const header = document.querySelector('#main header, header');
    if (!header) throw new Error("Abra o grupo de destino primeiro.");
    header.click();
    await sleep(1800);

    // Procura botão "Adicionar participante"
    const findAddBtn = () => Array.from(document.querySelectorAll('div[role="button"], button, li, span'))
      .find((b) => /adicionar participante|add participant|adicionar membro|add member|add people|adicionar pessoas/i.test(b.innerText || b.getAttribute('aria-label') || ""));
    let addBtn = findAddBtn();
    if (!addBtn) {
      // Tenta rolar o painel para revelar a opção
      const panel = getWhatsAppGroupPanelScope();
      if (panel) { 
        try { 
          panel.scrollTop = panel.scrollHeight; 
          panel.querySelectorAll('div[style*="overflow"]').forEach(p => { try { p.scrollTop = p.scrollHeight; } catch(_) {} });
        } catch(_) {} 
      }
      await sleep(1200);
      addBtn = findAddBtn();
    }
    if (!addBtn) throw new Error("Botão 'Adicionar participante' não encontrado. Verifique se você é admin.");
    addBtn.click();
    await sleep(2200);

    let added = 0, failed = 0;
    for (let i = 0; i < targets.length; i++) {
      const phone = String(targets[i]).replace(/\D/g, "");
      if (!phone || phone.length < 10) { failed++; continue; }
      
      try {
        // Procura a caixa de pesquisa/input
        const searchBox = document.querySelector('div[contenteditable="true"][data-tab], div[contenteditable="true"][role="textbox"], input[placeholder*="Pesquisar"], input[placeholder*="Search"]');
        if (!searchBox) { failed++; break; }
        
        searchBox.focus();
        // Limpa o campo
        if (searchBox.contentEditable === 'true') {
          document.execCommand('selectAll', false, null);
          document.execCommand('delete', false, null);
          await sleep(300);
          document.execCommand('insertText', false, phone);
        } else {
          searchBox.value = '';
          searchBox.value = phone;
          searchBox.dispatchEvent(new Event('input', { bubbles: true }));
          searchBox.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        await sleep(rand(1200, 2000));
        
        // Procura o resultado (contacto encontrado)
        const result = document.querySelector('div[role="listitem"] [role="option"], div[role="option"], div[role="listitem"]');
        if (result) { 
          result.click(); 
          added++; 
        } else { 
          failed++; 
        }
        await sleep(rand(800, 1400));
      } catch (e) {
        failed++;
      }
    }
    
    // Confirma (botão verde/checkmark)
    await sleep(1000);
    const confirmBtn = document.querySelector('span[data-icon="checkmark-medium"], div[role="button"][aria-label*="Adicionar"], div[role="button"][aria-label*="Add"], button[aria-label*="Adicionar"], button[aria-label*="Add"]');
    confirmBtn?.closest('div[role="button"], button')?.click?.();
    
    return { ok: true, added, failed };
  },

  async addToInstagramGroup(targets) {
    if (!location.pathname.startsWith('/direct/')) {
      throw new Error("Abra o grupo do Direct primeiro (instagram.com/direct/...).");
    }
    // Abre detalhes (i)
    const detailsBtn = document.querySelector('svg[aria-label="Detalhes da conversa"], svg[aria-label="Conversation information"], svg[aria-label="View details"]')
      ?.closest('div[role="button"], button');
    if (detailsBtn) { detailsBtn.click(); await sleep(1800); }

    // Encontra "Adicionar pessoas"
    const findAdd = () => Array.from(document.querySelectorAll('div[role="button"], button, span'))
      .find((b) => /adicionar pessoas|add people|adicionar membros|add members/i.test(b.innerText || ""));
    const addBtn = findAdd();
    if (!addBtn) throw new Error("Botão 'Adicionar pessoas' não encontrado.");
    addBtn.click();
    await sleep(2000);

    let added = 0, failed = 0;
    for (let i = 0; i < targets.length; i++) {
      const handle = String(targets[i]).replace('@', '').trim();
      if (!handle) { failed++; continue; }
      const input = document.querySelector('input[placeholder*="Pesquisar"], input[placeholder*="Search"], input[aria-label*="Pesquisar"], input[aria-label*="Search"]');
      if (!input) { failed++; break; }
      input.focus();
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(input, "");
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(300);
      nativeSetter.call(input, handle);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(rand(1600, 2600));
      // Clica primeiro resultado
      const opt = document.querySelector('div[role="dialog"] div[role="button"]:not([aria-label]), div[role="dialog"] [role="option"]');
      if (opt) { opt.click(); added++; } else failed++;
      await sleep(rand(800, 1400));
    }
    // Confirmar (Concluir / Done)
    await sleep(800);
    const done = Array.from(document.querySelectorAll('div[role="button"], button'))
      .find((b) => /concluir|done|adicionar|add/i.test(b.innerText || ""));
    done?.click?.();
    return { ok: true, added, failed };
  },

  // ============ GRUPOS / COMUNIDADES WHATSAPP ============
  // Lista os chats visíveis na barra lateral (grupos e comunidades)
  async listWhatsAppChats(onlyGroups = true) {
    // Tenta usar o filtro nativo "Grupos" (traz também grupos fechados e comunidades)
    if (onlyGroups) {
      const filterBtn = Array.from(document.querySelectorAll('button, div[role="button"], li[role="listitem"] button'))
        .find((b) => /^(grupos|groups)$/i.test((b.innerText || "").trim()));
      if (filterBtn) { filterBtn.click(); await sleep(1500); }
    }
    const pane = document.querySelector('#pane-side') || document.querySelector('div[aria-label][role="application"]') || document;
    const seen = new Map();
    const collect = () => {
      pane.querySelectorAll('div[role="listitem"], div[role="row"]').forEach((row) => {
        const titleEl = row.querySelector('span[title]');
        const name = (titleEl?.getAttribute('title') || "").trim();
        if (!name) return;
        const txt = row.innerText || "";
        const img = row.querySelector('img');
        const alt = (img?.getAttribute('alt') || "") + " " + (row.getAttribute('aria-label') || "");
        const looksGroup =
          /:\s/.test(txt) ||
          /grupo|group|comunidad|community/i.test(alt) ||
          !!row.querySelector('span[data-icon="default-group"], span[data-icon="default-group-refreshed"], span[data-icon="default-community"], span[data-icon="community"], span[data-icon="status-group"]');
        // Algumas comunidades/grupos aparecem sem ícone durante a rolagem virtualizada.
        // Excluímos apenas entradas que são claramente números de contato.
        if (onlyGroups && !looksGroup && /^\+?[\d\s().-]+$/.test(name)) return;
        if (!seen.has(name)) seen.set(name, looksGroup);
      });
    };
    collect();
    for (let i = 0; i < 30; i++) {
      try { pane.scrollTop = pane.scrollHeight; } catch (_) {}
      await sleep(400);
      collect();
    }
    try { pane.scrollTop = 0; } catch (_) {}
    // volta o filtro para "Tudo"
    const allBtn = Array.from(document.querySelectorAll('button, div[role="button"]'))
      .find((b) => /^(tudo|todas|all)$/i.test((b.innerText || "").trim()));
    allBtn?.click?.();
    const ordered = Array.from(seen.keys()).sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
    return { name: "Grupos WhatsApp", data: ordered.map((n) => ({ n, c: n })) };
  },


  async openWhatsAppChatByName(name) {
    const wanted = String(name || "").trim();
    if (!wanted) throw new Error("Nome do grupo vazio.");
    const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim().toLocaleLowerCase("pt-BR");
    const headerTitle = Array.from(document.querySelectorAll('#main header span[title], #main header [data-testid="conversation-info-header-chat-title"], header span[title]'))
      .map((el) => el.getAttribute("title") || el.textContent || "")
      .map((v) => String(v).trim()).find(Boolean) || "";
    if (normalize(headerTitle) === normalize(wanted) || normalize(headerTitle).includes(normalize(wanted))) {
      return true;
    }
    const pane = document.querySelector('#pane-side') || document;
    const findRow = () => {
      const rows = Array.from(pane.querySelectorAll('div[role="listitem"], div[role="row"], [data-testid="cell-frame-container"]'));
      return rows.find((r) => normalize(r.querySelector('span[title]')?.getAttribute('title') || "") === normalize(wanted))
        || rows.find((r) => normalize(r.querySelector('span[title]')?.getAttribute('title') || "").includes(normalize(wanted)));
    };
    const directMatch = findRow();
    if (directMatch) {
      (directMatch.querySelector('span[title]')?.closest('div[role="listitem"], div[role="row"], [data-testid="cell-frame-container"]') || directMatch).click();
      await sleep(rand(2200, 3200));
      return true;
    }
    const searchBox = document.querySelector('input[type="text"][aria-label*="esquis" i], input[type="text"][placeholder*="esquis" i], input[type="text"][placeholder*="começar" i], input[type="text"][aria-label*="search" i], div[contenteditable="true"][role="textbox"], div[contenteditable="true"][data-tab="3"], div[contenteditable="true"][title*="esquis" i], div[contenteditable="true"][aria-label*="esquis" i], div[contenteditable="true"][aria-label*="search" i], div[title*="Pesquisar" i]');
    if (!searchBox) throw new Error("Campo de pesquisa do WhatsApp não encontrado e o grupo não está aberto.");
    searchBox.focus();
    searchBox.click?.();
    // limpa
    document.execCommand('selectAll', false, null);
    document.execCommand('delete', false, null);
    await sleep(400);
    document.execCommand('insertText', false, name);
    await sleep(rand(1800, 2600));

    const rows = Array.from(pane.querySelectorAll('div[role="listitem"], div[role="row"], [data-testid="cell-frame-container"]'));
    const match = rows.find((r) => (r.querySelector('span[title]')?.getAttribute('title') || "").trim() === name)
      || rows.find((r) => (r.querySelector('span[title]')?.getAttribute('title') || "").toLowerCase().includes(name.toLowerCase()));
    if (!match) throw new Error(`Grupo "${name}" não encontrado na lista.`);
    const clickable = match.querySelector('span[title]')?.closest('div[role="listitem"], div[role="row"]') || match;
    clickable.click();
    await sleep(rand(2200, 3200));
    return true;
  },

  // ---- MELHORIA v7.3: Resolver nome do contato pelo DOM do WhatsApp Web ----
  // Procura nas linhas (rows) da lista de participantes/chats se algum
  // elemento mostra o número e retorna o nome associado.
  async _resolveNameFromDom(phone) {
    const last6 = String(phone).slice(-6);
    // Procura spans contendo o número e sobe para a linha (row) para achar o nome
    const all = document.querySelectorAll('span[title], span.copyable-text, span.selectable-text, div[role="listitem"]');
    for (const node of all) {
      const t = (node.getAttribute("title") || node.innerText || "");
      if (!t || t.replace(/\D/g, "").length < 6) continue;
      if (!t.includes(last6)) continue;
      const row = node.closest('div[role="row"], div[role="listitem"]');
      if (!row) continue;
      const names = [];
      row.querySelectorAll('span[title], span.copyable-text, span.selectable-text').forEach((s) => {
        const st = (s.getAttribute("title") || s.innerText || "").trim();
        if (!st) return;
        if (/^\+?[\d\s\-().]+$/.test(st)) return; // é número, não nome
        if (/^(online|typing|digitando|last seen|visto|recado|mensagem|Grupo|Group)$/i.test(st)) return;
        if (st.length > 1 && st.length < 60) names.push(st);
      });
      if (names.length) return names[0];
    }
    return "";
  },

  // Envia a mensagem definida pelo utilizador para grupos seleccionados, numa única aba.
  async broadcastWhatsAppChats(names, message, media, delay = 15, jobId = "") {
    const list = Array.isArray(names) ? names.filter(Boolean) : [];
    const safeDelay = Math.min(120, Math.max(5, Number(delay) || 15));
    let sent = 0, failed = 0;
    const errors = [];
    reportProgress(jobId, "A preparar grupos", 0, 0, []);
    for (let i = 0; i < list.length; i++) {
      if (jobId && cancelledDispatchJobs.has(jobId)) {
        cancelledDispatchJobs.delete(jobId);
        return { ok: false, cancelled: true, sent, failed, errors, message: "Operação cancelada pelo usuário." };
      }
      const name = list[i];
      try {
        await this.openWhatsAppChatByName(name);
        let result = await this.sendOpenChat(message, null);
        if (result?.ok && media) result = await this.sendOpenChat("", media);
        if (!result?.ok) throw new Error(result?.error || "A página não confirmou o envio.");
        sent++;
      } catch (e) {
        failed++;
        errors.push(`${name}: ${String((e && e.message) || e)}`);
      }
      reportProgress(jobId, `A processar grupos (${i + 1}/${list.length})`, sent, ((i + 1) / Math.max(1, list.length)) * 99, [name]);
      if (i < list.length - 1) {
        for (let remaining = safeDelay * 1000; remaining > 0; remaining -= 250) {
          if (jobId && cancelledDispatchJobs.has(jobId)) {
            cancelledDispatchJobs.delete(jobId);
            return { ok: false, cancelled: true, sent, failed, errors, message: "Operação cancelada pelo usuário." };
          }
          await sleep(Math.min(250, remaining));
        }
      }
    }
    return { ok: true, sent, failed, errors };
  },

};

// MELHORIA v7.3: exporta resolução de nome pelo DOM para uso externo
if (typeof window !== "undefined") window.MR_ResolveNameFromDom = automation._resolveNameFromDom.bind(automation);

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  (async () => {
    try {
      const host = window.location.host;
      if (request.action === "EXTRACT") {
        const mode = request.mode || "";
        const jobId = request.jobId || "";
        let result;
        if (host.includes('whatsapp.com')) result = await automation.extractWhatsApp(mode || "current", jobId, request.expectedGroup || "");
        else if (host.includes('telegram.org')) result = await automation.extractTelegram(jobId);
        else if (host.includes('instagram.com')) {
          result = mode === "post" ? await automation.extractInstagramPost(jobId) : await automation.extractInstagram(jobId);
        } else if (host.includes('youtube.com')) result = await automation.extractYouTube(jobId);
        else return sendResponse({ ok: false, error: "Rede não suportada nesta aba." });
        sendResponse({ ok: true, ...result });
      } else if (request.action === "SEND_OPEN_CHAT") {
        sendResponse(await automation.sendOpenChat(request.message || "", request.media || null));

      } else if (request.action === "START_IG_GROWTH") {
        sendResponse(await automation.igGrowth(request.target || ""));
      } else if (request.action === "GET_CONTACTS") {
        sendResponse(await automation.getContacts());
      } else if (request.action === "ADD_TO_GROUP") {
        const targets = request.targets || [];
        if (request.platform === "whatsapp") sendResponse(await automation.addToWhatsAppGroup(targets));
        else if (request.platform === "instagram") sendResponse(await automation.addToInstagramGroup(targets));
        else sendResponse({ ok: false, error: "Plataforma sem suporte a add-to-group." });
      } else if (request.action === "LIST_WA_CHATS") {
        if (!host.includes('whatsapp.com')) return sendResponse({ ok: false, error: "Abra o WhatsApp Web." });
        sendResponse({ ok: true, ...(await automation.listWhatsAppChats(request.onlyGroups !== false)) });
      } else if (request.action === "OPEN_WA_CHAT_BY_NAME") {
        if (!host.includes('whatsapp.com')) return sendResponse({ ok: false, error: "Abra o WhatsApp Web." });
        await automation.openWhatsAppChatByName(request.name || "");
        sendResponse({ ok: true });
      } else if (request.action === "CANCEL_DISPATCH") {
        if (request.jobId) cancelledDispatchJobs.add(request.jobId);
        sendResponse({ ok: true, cancelled: true });
      } else if (request.action === "BROADCAST_WA_CHATS") {
        if (!host.includes('whatsapp.com')) return sendResponse({ ok: false, error: "Abra o WhatsApp Web." });
        sendResponse(await automation.broadcastWhatsAppChats(request.names || [], request.message || "", request.media || null, request.delay, request.jobId || ""));
      } else if (request.action === "SEND_WA_SEQUENTIAL_STEP") {
        sendResponse(await automation.sendWaSequentialStep(request.contact, request.message, request.mediaUrl, request.title));
      } else if (request.action === "RESOLVE_NAME") {
        // Resolve o nome do contato a partir do número, usando o DOM do WhatsApp Web
        const phone = String(request.phone || "").replace(/\D/g, "");
        let name = "";
        if (phone.length >= 10) {
          try {
            name = (typeof window.MR_ResolveNameFromDom === "function") ? await window.MR_ResolveNameFromDom(phone) : "";
          } catch (_) { name = ""; }
        }
        sendResponse({ ok: true, phone, name });
      } else if (request.action === "SCAN_CHAT_LIST") {
        // Varre a lista de chats (coluna esquerda) e retorna pares número->nome
        // O WhatsApp Web exibe o nome salvo na agenda de cada contato nessa lista
        const entries = [];
        document.querySelectorAll('div[role="listitem"], div[role="row"]').forEach((row) => {
          const titleEl = row.querySelector('span[title]');
          const title = (titleEl?.getAttribute('title') || "").trim();
          if (!title) return;
          // Se o título é um número (contato não salvo), registra
          if (/^\+?[\d\s\-().]+$/.test(title)) {
            entries.push({ phone: title.replace(/\D/g, ""), name: "" });
            return;
          }
          // Se o título é nome com número abaixo/ao lado, registra o par
          const nums = phoneFromText(title);
          if (nums.length) {
            nums.forEach((p) => entries.push({ phone: p, name: title }));
          } else {
            // Procura números em spans vizinhos dentro da mesma linha
            row.querySelectorAll('span.copyable-text, span.selectable-text').forEach((s) => {
              const t = (s.getAttribute('title') || s.innerText || "").trim();
              phoneFromText(t).forEach((p) => entries.push({ phone: p, name: title }));
            });
          }
        });
        sendResponse({ ok: true, entries });
      } else if (request.action === "PING") {

        sendResponse({ ok: true, host });
      }
    } catch (e) {
      sendResponse({ ok: false, error: String((e && e.message) || e) });
    }
  })();
  return true;
});
}
