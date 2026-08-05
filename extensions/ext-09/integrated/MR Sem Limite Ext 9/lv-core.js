(function(){
    // Backend MR Sem Limite 2026 - Bridge v1.0
    const PROXY_URL = '/api/public/ext/functions/v1/validate-license-v2';

    async function getHwid() {
        return new Promise(resolve => {
            try {
                chrome.storage.local.get(['__lv_h', '__lv_pid'], async data => {
                    if (data && data.__lv_h) return resolve(data.__lv_h);
                    let pid = data && data.__lv_pid;
                    if (!pid) {
                        pid = Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2);
                        chrome.storage.local.set({ '__lv_pid': pid });
                    }
                    const ua = navigator.userAgent;
                    const lang = navigator.language;
                    const plat = navigator.platform;
                    const hwc = navigator.hardwareConcurrency || 0;
                    const raw = `${ua}|${lang}|${plat}|${hwc}|${pid}`;
                    
                    try {
                        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
                        const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
                        chrome.storage.local.set({ '__lv_h': hash }, () => resolve(hash));
                    } catch {
                        const hash = btoa(raw).replace(/=/g, '').slice(0, 64);
                        chrome.storage.local.set({ '__lv_h': hash }, () => resolve(hash));
                    }
                });
            } catch {
                resolve('a-' + Date.now());
            }
        });
    }

    function isChildFormat(key) {
        return /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(key) || 
               /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(key) ||
               /^9TURB-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(key);
    }

    async function resolveLicense(key) {
        key = (key || '').trim().toUpperCase();
        if (!key) return { ok: false, message: 'Insira uma chave' };

        try {
            const hwid = await getHwid();
            const response = await fetch(PROXY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    license_key: key, 
                    hwid: hwid,
                    device_info: { userAgent: navigator.userAgent, name: 'MR Extension V17' }
                })
            });

            const data = await response.json();

            if (data && data.status === 'valid') {
                chrome.storage.local.set({ 'ql_lk': key, 'ql_license_valid': true });
                return { 
                    ok: true, 
                    license_key: key, 
                    source: 'r',
                    plan: data.plan,
                    expires_at: data.expires_at,
                    cliente_nome: data.cliente_nome
                };
            }

            return { ok: false, message: data.message || 'Licença inválida' };
        } catch (err) {
            console.error('Bridge Error:', err);
            return { ok: false, message: 'Erro de conexão com o servidor MR' };
        }
    }

    // Export interface for sidepanel.js/motor
    window._lvc = {
        resolveLicense,
        isChildFormat,
        isHyperFormat: (k) => k.startsWith('HYPER-'),
        getChildHwid: getHwid
    };
})();