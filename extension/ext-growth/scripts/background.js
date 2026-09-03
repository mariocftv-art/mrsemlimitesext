
// MR Social Growth - Background Script
async function configureSidePanel() {
  if (!chrome.sidePanel?.setPanelBehavior) return;
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  } catch (error) {
    console.error("Não foi possível configurar o painel lateral:", error);
  }
}

configureSidePanel();
chrome.runtime.onStartup.addListener(configureSidePanel);
chrome.runtime.onInstalled.addListener(() => {
  configureSidePanel();
});

// Lógica do Agendador 24/7
chrome.alarms?.onAlarm.addListener(async (alarm) => {
  const taskId = alarm.name;
  const result = await chrome.storage.local.get(['mr_scheduled_dispatch_tasks']);
  const tasks = result.mr_scheduled_dispatch_tasks || {};
  const task = tasks[taskId];
  
  if (!task) return;
  
  console.log("Iniciando tarefa agendada:", task.taskId);
  
  // Remover da fila para não repetir
  delete tasks[taskId];
  await chrome.storage.local.set({ mr_scheduled_dispatch_tasks: tasks });
  chrome.runtime.sendMessage({ type: "MR_SCHEDULE_UPDATED" });

  // Executar o disparo
  try {
    await runScheduledDispatch(task);
  } catch (e) {
    console.error("Erro na execução agendada:", e);
  }
});

async function runScheduledDispatch(task) {
  const { platform, contacts, message, title, mediaUrl, dispatchDelay, dispatchMode } = task;
  
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const raw = contact.c;
    const handle = String(raw || "").replace(/^@/, "").trim();
    
    let url = "";
    if (platform === "whatsapp") url = "https://web.whatsapp.com";
    else if (platform === "telegram") url = `https://web.telegram.org/k/#@${encodeURIComponent(handle)}`;
    else if (platform === "instagram") url = `https://www.instagram.com/${encodeURIComponent(handle)}/`;
    
    if (!url) continue;

    try {
      // 1. Encontrar ou abrir a aba.
      // Para WhatsApp, a navegação para /send?phone deve acontecer antes do
      // comando de envio; não usamos window.location dentro do content script,
      // porque isso interrompe a resposta do comando e torna o agendamento
      // visualmente concluído sem enviar a mensagem.
      let tabs = await chrome.tabs.query({ url: platform === 'whatsapp' || platform === 'whatsapp-groups' ? '*://web.whatsapp.com/*' : '*://' + platform + '.com/*' });
      let tab = tabs[0];
      const personalMessage = personalizeScheduledMessage(message, contact, title);
      if (platform === 'whatsapp' || platform === 'whatsapp-groups') {
        if (!tab) tab = await chrome.tabs.create({ url, active: true });
        else await chrome.tabs.update(tab.id, { url: `https://web.whatsapp.com/send?phone=${encodeURIComponent(handle)}`, active: true });
        await waitTab(tab.id, 20000);
        await new Promise(r => setTimeout(r, 5000));
        // Antes esta linha mandava media: null fixo, então nenhum disparo agendado pelo
        // WhatsApp saía com mídia, mesmo com um link preenchido no campo "Link do vídeo/
        // imagem" do agendador. Agora usa o mesmo valor (mediaUrl) que Telegram/Instagram
        // já usavam.
        await chrome.tabs.sendMessage(tab.id, {
          action: "SEND_OPEN_CHAT",
          message: personalMessage,
          media: mediaUrl || null,
          mode: dispatchMode,
          contact: contact.c,
          name: contact.n
        });
      } else {
        if (!tab) {
          tab = await chrome.tabs.create({ url, active: true });
          await waitTab(tab.id, 20000);
        } else {
          await chrome.tabs.update(tab.id, { url, active: true });
          await waitTab(tab.id, 15000);
        }
        await new Promise(r => setTimeout(r, 3000));
        await chrome.tabs.sendMessage(tab.id, {
          action: "SEND_OPEN_CHAT",
          message: personalMessage,
          title: "",
          media: mediaUrl || null,
          mode: dispatchMode,
          contact: contact.c,
          name: contact.n
        });
      }
      
    } catch (e) {
      console.error(`Erro ao enviar para ${contact.c}:`, e);
    }

    // Esperar o delay
    if (i < contacts.length - 1) {
      await new Promise(r => setTimeout(r, (dispatchDelay || 15) * 1000));
    }
  }
}

// MELHORIA v7.3: personaliza a mensagem agendada com o nome do contato
function personalizeScheduledMessage(template, contact, title = "") {
  const fullName = String(contact?.n || "").trim();
  const firstName = fullName.split(/\s+/)[0] || fullName;
  const phone = String(contact?.c || "").replace(/\D/g, "");
  let msg = String(template || "");
  msg = msg.replace(/\{nome completo\}|\{nome_completo\}/gi, fullName || phone);
  msg = msg.replace(/\{nome\}/gi, firstName || phone);
  msg = msg.replace(/\{primeiro_nome\}|\{first_name\}/gi, firstName || phone);
  msg = msg.replace(/\{telefone\}/gi, phone);
  // Se houver título separado, junta mantendo a personalização
  const personalTitle = (title || "")
    .replace(/\{nome completo\}|\{nome_completo\}/gi, fullName || phone)
    .replace(/\{nome\}/gi, firstName || phone)
    .replace(/\{primeiro_nome\}|\{first_name\}/gi, firstName || phone)
    .replace(/\{telefone\}/gi, phone);
  if (personalTitle && !msg.includes(personalTitle)) {
    msg = [personalTitle, msg].filter(Boolean).join("\n");
  }
  return msg;
}

async function waitTab(tabId, timeout = 30000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = async () => {
      const tab = await chrome.tabs.get(tabId).catch(() => null);
      if (tab?.status === 'complete' || Date.now() - start > timeout) resolve();
      else setTimeout(check, 1000);
    };
    check();
  });
}
