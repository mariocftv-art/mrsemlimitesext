(function() {
  "use strict";

  const STORAGE_KEYS = {
    VALID: 'ql_license_valid',
    KEY: 'ql_lk',
    USER: 'ql_user_name',
    EXPIRES: 'ql_expires_at',
    ACTIVATED: 'ql_activated_at',
    STATUS: 'ql_license_status',
    DAYS: 'ql_ed',
    CLIENT: 'ql_ck'
  };

  const API_URL = 'https://mrsemlimitesext.lovable.app/api/public/validate-license-v2';

  async function checkLicense() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.VALID, STORAGE_KEYS.KEY], (result) => {
        resolve(result[STORAGE_KEYS.VALID] === true && result[STORAGE_KEYS.KEY]);
      });
    });
  }

  function renderUI(isActivated = false, data = {}) {
    const container = document.getElementById('sp-body');
    if (!container) return;

    const config = window.TS_BRANDING_CONFIG || {
      brandName: "MR Sem Limites",
      logoExtendedUrl: "images/logo_horizontal.png"
    };
    console.log("ESCREVENDO TITULO:", config.brandName);

    if (!isActivated) {
      container.innerHTML = `
        <div class="license-container">
          <div class="license-header">
            <img src="${config.logoExtendedUrl}" class="license-logo" alt="Logo">
            <div class="license-title">${config.brandName}</div>
            <p class="license-desc">Insira sua licença oficial para liberar o acesso ao motor de alta performance.</p>
          </div>
          
          <div class="license-form">
            <input type="text" id="license-input" class="license-input" placeholder="XXXXX-XXXXX-XXXXX-XXXXX" spellcheck="false">
            <div id="license-status"></div>
            <button id="activate-btn" class="license-button">Ativar Agora</button>
          </div>

          <div class="license-footer">
            <button class="footer-btn" id="support-btn">Suporte Técnico</button>
          </div>
        </div>
      `;

      document.getElementById('activate-btn').addEventListener('click', handleActivation);
      document.getElementById('support-btn').addEventListener('click', () => window.open(config.whatsappLinks?.support || '#'));
    } else {
      const days = data[STORAGE_KEYS.DAYS] || '1';
      container.innerHTML = `
        <div class="license-container">
          <div class="license-header">
            <img src="${config.logoExtendedUrl}" class="license-logo" alt="Logo">
            <div class="status-msg status-success">✓ Licença Ativa e Vinculada</div>
          </div>

          <div class="license-info">
            <div class="info-item">
              <span class="info-label">Status</span>
              <span class="info-value">Premium</span>
            </div>
            <div class="info-item">
              <span class="info-label">Validade</span>
              <span class="info-value">${days} Dias Restantes</span>
            </div>
            <div class="info-item">
              <span class="info-label">Usuário</span>
              <span class="info-value">MR User</span>
            </div>
            <div class="info-item">
              <span class="info-label">Dispositivo</span>
              <span class="info-value">Vinculado</span>
            </div>
          </div>

          <div class="license-form">
            <button id="refresh-btn" class="license-button">Atualizar Dados</button>
          </div>

          <div class="license-footer">
            <button class="footer-btn" id="remove-btn">Remover Licença</button>
          </div>
        </div>
      `;

      document.getElementById('refresh-btn').addEventListener('click', () => window.location.reload());
      document.getElementById('remove-btn').addEventListener('click', () => {
        chrome.storage.local.remove(Object.values(STORAGE_KEYS), () => window.location.reload());
      });
    }
  }

  async function handleActivation() {
    const btn = document.getElementById('activate-btn');
    const input = document.getElementById('license-input');
    const status = document.getElementById('license-status');
    const key = input.value.trim().toUpperCase();

    console.log("[DEBUG] Início handleActivation - Linha 103");
    if (!key) {
      showStatus('Insira uma chave válida', 'error');
      return;
    }

    btn.disabled = true;
    btn.innerText = 'Validando...';
    showStatus('Conectando ao servidor...', '');

    console.log("[DEBUG] Antes do fetch - Linha 118");
    console.log("[DEBUG] URL:", API_URL);
    console.log("[DEBUG] Método: POST");

    try {
      const hwid = await getHwid();
      const payload = { license_key: key, hwid: hwid };
      console.log("[DEBUG] Payload enviado:", JSON.stringify(payload));
      console.log("[DEBUG] Headers enviados: { 'Content-Type': 'application/json' }");

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log("[DEBUG] Após o fetch - Linha 124");
      console.log("[DEBUG] HTTP Status:", response.status);
      console.log("[DEBUG] Content-Type resposta:", response.headers.get('content-type'));

      const rawText = await response.text();
      console.log("[DEBUG] Corpo bruto da resposta:", rawText);

      console.log("[DEBUG] Fazendo response.json() - Linha 126");
      let data;
      try {
        data = JSON.parse(rawText);
        console.log("[DEBUG] JSON completo:", JSON.stringify(data));
      } catch (jsonErr) {
        console.error("[DEBUG] Erro ao interpretar JSON:", jsonErr);
        throw jsonErr;
      }

      console.log("[DEBUG] Validando data.status - Linha 128");
      console.log("[DEBUG] Campos esperados: status, days_remaining (opcional)");
      console.log("[DEBUG] Campos recebidos:", Object.keys(data).join(', '));

      if (data.status === 'valid') {
        const payloadStorage = {
          [STORAGE_KEYS.VALID]: true,
          [STORAGE_KEYS.KEY]: key,
          [STORAGE_KEYS.DAYS]: data.days_remaining || '1',
          [STORAGE_KEYS.STATUS]: 'valid',
          [STORAGE_KEYS.ACTIVATED]: new Date().toISOString(),
          [STORAGE_KEYS.CLIENT]: key
        };

        console.log("[DEBUG] Gravando chrome.storage.local - Linha 138");
        chrome.storage.local.set(payloadStorage, () => {
          console.log("[DEBUG] Chamando renderUI(true) - Linha 139");
          showStatus('Sucesso! Reiniciando...', 'success');
          setTimeout(() => window.location.reload(), 1500);
        });
      } else {
        console.log("[DEBUG] Licença inválida retornada pelo servidor");
        showStatus(data.message || 'Chave inválida ou expirada', 'error');
      }
    } catch (err) {
      console.error("[DEBUG] Exceção capturada (catch):", err);
      console.error("[DEBUG] Stack trace:", err.stack);
      showStatus('Erro de conexão com o servidor', 'error');
    } finally {
      btn.disabled = false;
      btn.innerText = 'Ativar Agora';
    }
  }

  function showStatus(msg, type) {
    const el = document.getElementById('license-status');
    if (!el) return;
    el.className = 'status-msg ' + (type ? 'status-' + type : '');
    el.innerText = msg;
  }

  async function getHwid() {
    if (window.getHwid) return await window.getHwid();
    return 'HWID-' + navigator.userAgent.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  }

  // Inicialização
  document.addEventListener('DOMContentLoaded', async () => {
    // Atrasar um pouco para garantir que o branding config carregou
    setTimeout(async () => {
      const isOk = await checkLicense();
      if (!isOk) {
        renderUI(false);
        // Bloquear o sp-body de ser alterado por outros scripts
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && !document.getElementById('license-input')) {
              renderUI(false);
            }
          });
        });
        observer.observe(document.getElementById('sp-body'), { childList: true });
      } else {
        chrome.storage.local.get(null, (all) => renderUI(true, all));
      }
    }, 100);
  });

})();
