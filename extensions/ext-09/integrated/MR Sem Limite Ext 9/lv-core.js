(function() {
    const API_BASE = "https://mrsemlimitesext.lovable.app/api/public/ext/functions/v1";
    const VALIDATE_URL = API_BASE + "/validate-license-v2";
    
    // Sobrescreve a lógica de validação original injetando no window o objeto de controle
    window._lvc = {
        resolveLicense: async function(key) {
            const hwid = await this.getChildHwid();
            try {
                const response = await fetch(VALIDATE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ license_key: key, hwid: hwid })
                });
                const data = await response.json();
                if (data.status === 'valid') {
                    chrome.storage.local.set({ 
                        'ql_license_valid': true,
                        'ql_lk': key,
                        'ql_session_id': data.session_token,
                        'ql_user_name': data.cliente_nome || 'Usuário',
                        'ql_expires_at': data.expires_at
                    });
                    return { ok: true, license_key: key };
                }
                return { ok: false, message: data.message || "Chave inválida" };
            } catch (e) {
                return { ok: false, message: "Erro de conexão com MR Sem Limite" };
            }
        },
        isChildFormat: (key) => /^(MR-)?[A-Z0-9-]{5,}$/.test(key),
        isHyperFormat: (key) => key.startsWith('HYPER-'),
        getChildHwid: async () => {
            const stored = await chrome.storage.local.get(['__lv_h']);
            if (stored.__lv_h) return stored.__lv_h;
            const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
            await chrome.storage.local.set({ '__lv_h': id });
            return id;
        }
    };
    console.log("MR Sem Limite 2026 Core Bridge Ativo");
})();