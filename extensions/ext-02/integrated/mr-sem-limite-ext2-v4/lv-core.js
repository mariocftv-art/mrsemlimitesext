(function(){
    const MASTER_SESSION = {
        valid: true,
        license_key: "MR-SEM-LIMITE-MASTER",
        device_id: "DEVICE-OFFLINE-INF",
        source: "r",
        status: "valid",
        user_name: "Admin Master (Mr Sem Limite)",
        expires_at: "2099-12-31T23:59:59Z",
        has_skills: true,
        credits: 999999
    };

    window._lvc = {
        resolveLicense: async function(key) {
            console.log("[MR-CORE] Offline Validation Active");
            return MASTER_SESSION;
        },
        isChildFormat: (k) => true,
        isHyperFormat: (k) => true,
        getChildHwid: async () => "HWID-OFFLINE-999"
    };
    
    // Auto-inject session into storage to bypass loading screens
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({
            'ql_license_valid': true,
            'ql_lk': MASTER_SESSION.license_key,
            'ql_user_name': MASTER_SESSION.user_name,
            'ql_expires_at': MASTER_SESSION.expires_at,
            'ql_license_status': 'active',
            'ql_has_skills': true
        });
    }
})();
