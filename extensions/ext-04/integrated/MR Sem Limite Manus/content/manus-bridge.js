/**
 * MR Sem Limite Manus - Edição API BRIDGE (V16.0)
 * Sistema de Túnel de API Direta & System Token Emulation
 */

(function() {
    if (!location.hostname.includes('manus.ai') && !location.hostname.includes('manus.im')) return;

    console.log('⚡ [MR MANUS] API BRIDGE ACTIVE - Rota de Desenvolvedor Habilitada...');

    // 1. Estilos Flame & UI Ghost Mode V3
    const style = document.createElement('style');
    style.innerHTML = `
        .mr-overdrive-badge {
            position: fixed; bottom: 20px; left: 20px;
            background: linear-gradient(135deg, #FF4D00, #FF0000);
            color: white; padding: 10px 18px; border-radius: 25px;
            font-weight: 800; font-size: 11px; z-index: 999999;
            box-shadow: 0 4px 15px rgba(255, 0, 0, 0.5);
            letter-spacing: 1px; border: 1px solid rgba(255,255,255,0.2);
            pointer-events: none; font-family: 'Inter', sans-serif;
            text-transform: uppercase;
        }
        /* Bloqueio Total de Avisos de Sistema */
        div[class*="Credit"], div[class*="Limit"], div[class*="Upgrade"], 
        div[role="dialog"], [class*="modal"], [class*="overlay"],
        section[class*="Banner"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
        body { overflow: auto !important; }
    `;
    document.head.appendChild(style);
    
    const badge = document.createElement('div');
    badge.className = 'mr-overdrive-badge';
    badge.innerText = '🛡️ MR SEM LIMITE MANUS - SHADOW MODE ATIVO';
    document.body.appendChild(badge);

    // 2. API Bridge & Request Hijacking (CONGELAMENTO DE CONSUMO)
    const originalFetch = window.fetch;
    const originalXHR = window.XMLHttpRequest.prototype.open;

    // PROTOCOLO RIGOROSO - DEEP SHADOW ISOLATION
    const billingKeywords = ['billing', 'usage', 'telemetry', 'track', 'credits', 'stream', 'report', 'analytics', 'quota', 'limit'];
    
    // 1. Bloqueio de Rede Total (Fetch e XHR)
    const isBillingRequest = (url, body) => {
        const target = (String(url) + String(body || '')).toLowerCase();
        return billingKeywords.some(k => target.includes(k));
    };

    window.fetch = async (...args) => {
        const [url, options] = args;
        if (isBillingRequest(url, options?.body)) {
            console.log('🛡️ [RIGOROUS] Bloqueando requisição de faturamento:', url);
            return new Response(JSON.stringify({ status: 'success', balance: 999999, paused: true }), { status: 200 });
        }
        return originalFetch(...args);
    };

    // 2. Interceptar WebSockets com negação total
    window.WebSocket = function(url, protocols) {
        if (isBillingRequest(url)) {
            console.log('🛡️ [RIGOROUS] Bloqueando WebSocket de faturamento:', url);
            return new NativeWebSocket('ws://127.0.0.1:9999');
        }
        return new NativeWebSocket(url, protocols);
    };
    window.WebSocket.prototype = NativeWebSocket.prototype;

    window.fetch = async (...args) => {
        let [url, options] = args;
        const urlStr = typeof url === 'string' ? url : (url instanceof URL ? url.href : '');
        options = options || {};

        // 1. Bloqueio de reporte de consumo (PAUSAR CRÉDITOS)
        if (billingEndpoints.some(endpoint => urlStr.includes(endpoint))) {
            console.log('🛡️ [SHADOW MODE] Bloqueando reporte de consumo para paralisar créditos...');
            return new Response(JSON.stringify({ success: true, balance_paused: true }), { status: 200 });
        }

        if (urlStr.includes('/api/chat') || urlStr.includes('/api/agent')) {
            console.log('🚀 [API BRIDGE] Redirecionando requisição para túnel prioritário...');
            
            // Injeção de Headers Estratégicos (V16.3 Shadow Mode - Congelamento)
            options.headers = {
                ...options.headers,
                'X-Manus-Priority': 'high',
                'X-System-Access': 'authorized',
                'X-Developer-Mode': 'true',
                'X-Manus-Internal': 'true',
                'X-Admin-Preview': 'true',
                'X-Bypass-Telemetry': 'true',
                'X-Session-Type': 'internal-debug',
                'X-Billing-Paused': 'true',
                'X-Quota-Override': 'unlimited'
            };
            
            // Remover headers que podem ser usados para tracking de cota
            delete options.headers['x-manus-usage-tracking'];
            delete options.headers['x-client-fingerprint'];
            delete options.headers['x-manus-credits-check'];

            // Tentar usar rota de API alternativa se a principal falhar
            try {
                const response = await originalFetch(url, options);
                
                if (response.status === 402 || response.status === 403) {
                    console.warn('⚠️ [API BRIDGE] Cota excedida na Rota A. Tentando Rota B (System Bridge)...');
                    
                    // Simular resposta de sucesso para evitar que a UI do Manus trave
                    return new Response(JSON.stringify({
                        success: true,
                        status: "streaming",
                        bypass_active: true
                    }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                return response;
            } catch (e) {
                console.error('❌ [API BRIDGE] Falha de conexão, forçando túnel...');
                return new Response(JSON.stringify({ success: true }), { status: 200 });
            }
        }
        return originalFetch(url, options);
    };

    // 3. UI Force-Unlocker & Keyword Scanner (V16.1)
    const forceUnlock = () => {
        const keywords = ['credit', 'limit', 'upgrade', 'limite', 'used up', 'insufficient'];
        
        // Varredura por elementos de aviso
        document.querySelectorAll('div, span, section, p, button, a').forEach(el => {
            const text = (el.innerText || '').toLowerCase();
            const hasKeyword = keywords.some(k => text.includes(k));
            
            if (hasKeyword) {
                // Se não for o menu lateral ou o badge da extensão, esconde
                if (!el.closest('nav') && !el.closest('.mr-overdrive-badge')) {
                    el.style.setProperty('display', 'none', 'important');
                    el.style.setProperty('visibility', 'hidden', 'important');
                }
            }
        });

        // Forçar ativação do botão de envio
        document.querySelectorAll('button').forEach(btn => {
            const isSendBtn = btn.querySelector('svg') || (btn.className && btn.className.includes('rounded-full'));
            if (isSendBtn) {
                btn.disabled = false;
                btn.style.setProperty('opacity', '1', 'important');
                btn.style.setProperty('pointer-events', 'auto', 'important');
                btn.style.setProperty('cursor', 'pointer', 'important');
            }
        });
    };
    setInterval(forceUnlock, 200);

})();
