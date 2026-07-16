/**
 * Mr Sem Limite Ext 2 6.0.18 - Unlocked Version
 */

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'proxyFetch' || msg.action === 'executeSubAction' || msg.type === 'SEND_MESSAGE_PROXY') {
    const text = msg.body?.chatBody || msg.message || msg.text || '';
    handleNativeSend(text, sendResponse);
    return true;
  }
  
  if (msg.action === 'getLovableCookies') {
    chrome.cookies.getAll({ domain: 'lovable.dev' }, (cookies) => {
      const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      sendResponse({ cookie: cookieStr });
    });
    return true;
  }

  // Respostas de licença sempre válidas
  sendResponse({ 
    ok: true, 
    status: 'valid', 
    valid: true, 
    license_status: 'valid',
    expires_at: '2099-12-31',
    user_name: 'Master User'
  });
  return true;
});

async function handleNativeSend(text, sendResponse) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url.includes('lovable.dev')) {
      sendResponse({ ok: false, error: 'Abra o Lovable primeiro' });
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: 'MAIN',
      func: (promptText) => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.value = promptText;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.dispatchEvent(new Event('change', { bubbles: true }));
          setTimeout(() => {
            const btn = document.querySelector('button[type="submit"]') || 
                        document.querySelector('button[aria-label*="Send"]') ||
                        document.querySelector('button svg path[d*="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"]')?.closest('button');
            if (btn) btn.click();
          }, 300);
        }
      },
      args: [text]
    });
    sendResponse({ ok: true });
  } catch (e) {
    sendResponse({ ok: false, error: e.message });
  }
}
