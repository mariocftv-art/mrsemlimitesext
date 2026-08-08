/**
 * MR Sem Limites - License UI Engine
 * Version: 17.0.9
 * Build: BUILD-17.0.9-R8M2L5V1
 * UUID: 550e8400-e29b-41d4-a716-446655440000
 */
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

  const API_URL = 'https://mrsemlimitesext.lovable.app/api/public/ext/functions/v1/validate-license-v2';

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

    console.log("%c[INSTRUMENTAÇÃO FASE 16]", "color: #00f2ff; font-weight: bold; font-size: 14px;");
    console.log("[AUDITORIA] Início do fluxo de ativação.");
    
    // Passo 4: Auditoria do Manifesto Real
    try {
      const manifest = chrome.runtime.getManifest();
      console.log("[MANIFESTO REAL]", {
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        id: chrome.runtime.id
      });
      console.log(`IMPRIMIR: name=${manifest.name} version=${manifest.version} description=${manifest.description}`);
    } catch (e) {
      console.error("[ERRO] Falha ao ler manifest:", e);
    }

    if (!key) {
      console.warn("[AVISO] Chave vazia.");
      showStatus('Insira uma chave válida', 'error');
      return;
    }

    btn.disabled = true;
    btn.innerText = 'Validando...';
    showStatus('Conectando ao servidor...', '');

    console.log("[DEBUG] PASSO 5: Iniciando requisição...");
    console.log("[DEBUG] URL:", API_URL);
    console.log("[DEBUG] Método: POST");

    try {
      console.log("[DEBUG] Obtendo HWID...");
      const hwid = await getHwid();
      console.log("[DEBUG] HWID obtido:", hwid);

      const payload = { license_key: key, hwid: hwid };
      console.log("[DEBUG] Payload enviado:", JSON.stringify(payload));
      console.log("[DEBUG] Headers enviados: { 'Content-Type': 'application/json' }");

      console.log("[DEBUG] DISPARANDO FETCH (Linha 135)...");
      const startTime = Date.now();
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => {
        console.error("[ERRO CRÍTICO] Falha no Fetch (Rede/CORS):", err);
        throw err;
      });

      const endTime = Date.now();
      console.log(`[DEBUG] Resposta recebida em ${endTime - startTime}ms`);
      console.log("[DEBUG] HTTP Status:", response.status);
      console.log("[DEBUG] Content-Type resposta:", response.headers.get('content-type'));

      if (response.status !== 200) {
        console.error(`[ERRO] Status HTTP inválido: ${response.status}`);
      }

      console.log("[DEBUG] Lendo texto bruto da resposta...");
      const rawText = await response.text();
      console.log("[DEBUG] Corpo bruto da resposta:", rawText);

      console.log("[DEBUG] Tentando parse de JSON...");
      let data;
      try {
        data = JSON.parse(rawText);
        console.log("[DEBUG] JSON interpretado com sucesso:", JSON.stringify(data, null, 2));
      } catch (jsonErr) {
        console.error("[ERRO DE PARSE] Resposta não é um JSON válido:", jsonErr);
        console.error("[STACK]", jsonErr.stack);
        throw jsonErr;
      }

      console.log("[DEBUG] Validando campos do data...");
      console.log("[DEBUG] Campos esperados: status ('valid'?), days_remaining");
      console.log("[DEBUG] Campos encontrados:", Object.keys(data).join(', '));

      if (data.status === 'valid') {
        console.log("[DEBUG] Licença VÁLIDA. Gravando no storage...");
        const payloadStorage = {
          [STORAGE_KEYS.VALID]: true,
          [STORAGE_KEYS.KEY]: key,
          [STORAGE_KEYS.DAYS]: data.days_remaining || '1',
          [STORAGE_KEYS.STATUS]: 'valid',
          [STORAGE_KEYS.ACTIVATED]: new Date().toISOString(),
          [STORAGE_KEYS.CLIENT]: key
        };

        chrome.storage.local.set(payloadStorage, () => {
          if (chrome.runtime.lastError) {
            console.error("[ERRO DE STORAGE]", chrome.runtime.lastError);
            showStatus('Erro ao salvar licença localmente', 'error');
          } else {
            console.log("[DEBUG] Gravado no storage com sucesso. Reiniciando em 1.5s...");
            showStatus('Sucesso! Reiniciando...', 'success');
            setTimeout(() => window.location.reload(), 1500);
          }
        });
      } else {
        console.warn("[AVISO] Servidor retornou licença INVÁLIDA:", data.message || 'Sem mensagem');
        showStatus(data.message || 'Chave inválida ou expirada', 'error');
      }
    } catch (err) {
      console.error("[DEBUG] EXCEÇÃO CAPTURADA NO FLUXO:");
      console.error("[MENSAGEM]", err.message);
      console.error("[STACK]", err.stack);
      
      if (err.message.includes('fetch')) {
        console.error("[CAUSA PROVÁVEL] Bloqueio de rede ou erro de DNS.");
      } else if (err instanceof SyntaxError) {
        console.error("[CAUSA PROVÁVEL] O servidor não retornou JSON.");
      }
      
      showStatus('Erro de conexão ou ativação', 'error');
    } finally {
      btn.disabled = false;
      btn.innerText = 'Ativar Agora';
      console.log("[AUDITORIA] Fluxo handleActivation finalizado.");
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
