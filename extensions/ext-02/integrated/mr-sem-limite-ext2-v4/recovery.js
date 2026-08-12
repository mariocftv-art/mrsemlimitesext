
(function() {
    // 1. Restauração do Motor Visual (A Bolinha)
    // Force license check function to return true
    if (typeof _n176bc6 === 'undefined') {
        window._n176bc6 = function() { return true; };
    } else {
        const old_n176bc6 = window._n176bc6;
        window._n176bc6 = function() { return true; };
    }

    // Force badge status
    const updateBadge = () => {
        const badge = document.querySelector('#__ql_shield__'); // Adjusted selector based on content.js observation
        if (badge) {
            badge.style.backgroundColor = '#22c55e';
            const textEl = badge.querySelector('div:last-child');
            if (textEl) textEl.textContent = "✓ Lovable ativado no Chat nativo";
        }
    };
    setInterval(updateBadge, 1000);

    // 2. Destravamento do Painel Lateral
    // We append this to sidepanel.js to jump straight to dashboard
    if (typeof _n3e2964 === 'function') {
        console.log("[MR-RECOVERY] Forcing Dashboard...");
        _n3e2964();
    }

    // Mate o Heartbeat
    const oldSetInterval = window.setInterval;
    window.setInterval = function(fn, delay) {
        if (delay >= 10000 && delay <= 25000) {
            console.log("[MR-RECOVERY] Blocking heartbeat interval:", delay);
            return null;
        }
        return oldSetInterval.apply(this, arguments);
    };

    // 4. Interface de Skills
    const forceSkills = () => {
        window.has_skills = true;
        const banner = document.querySelector('.sp-skills-locked-banner');
        if (banner) banner.style.setProperty('display', 'none', 'important');
    };
    setInterval(forceSkills, 1000);

    console.log("[MR-RECOVERY] Motor ativado com sucesso.");
})();
