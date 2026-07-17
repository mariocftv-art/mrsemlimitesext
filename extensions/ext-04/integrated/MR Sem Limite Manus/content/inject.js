(function() {
    if (!/(manus\.im|manus\.ai|lovable\.dev)/.test(location.hostname)) return;

    console.log('🔥 [MR SEM LIMITE] LEGACY REBORN ACTIVE...');

    // 1. Estilos Visuais (A Moldura Colorida que sumiu)
    const style = document.createElement('style');
    style.innerHTML = `
        /* Borda Neon na área de texto */
        div[contenteditable="true"], textarea, [class*="chat-input"] {
            border: 2px solid transparent !important;
            background-image: linear-gradient(var(--bg, #0a0c1c), var(--bg, #0a0c1c)), 
                              linear-gradient(90deg, #FF0000, #FF8000, #FF0000) !important;
            background-origin: border-box !important;
            background-clip: padding-box, border-box !important;
            box-shadow: 0 0 15px rgba(255, 77, 0, 0.2) !important;
            transition: all 0.3s ease !important;
        }
        div[contenteditable="true"]:focus, textarea:focus {
            box-shadow: 0 0 25px rgba(255, 77, 0, 0.4) !important;
            border-width: 2.5px !important;
        }
        /* Badge flutuante */
        .mr-legacy-badge {
            position: fixed; bottom: 15px; left: 15px;
            background: linear-gradient(135deg, #FF0000, #FF8000);
            color: white; padding: 8px 15px; border-radius: 20px;
            font-size: 10px; font-weight: 900; z-index: 1000000;
            box-shadow: 0 4px 15px rgba(255, 0, 0, 0.5);
            text-transform: uppercase; letter-spacing: 1px;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    const badge = document.createElement('div');
    badge.className = 'mr-legacy-badge';
    badge.innerText = '🛡️ MR MANUS LEGACY REBORN';
    document.body.appendChild(badge);

    // 2. Escuta de Comandos (Correção do erro de comunicação)
    window.addEventListener('message', (e) => {
        if (e.data.type === 'TYPE_AND_SEND_IN_LOVABLE') {
            const text = e.data.text;
            const input = document.querySelector('div[contenteditable="true"], textarea');
            if (input) {
                input.focus();
                document.execCommand('insertText', false, text);
                setTimeout(() => {
                    const btn = document.querySelector('button[class*="send"], button[type="submit"], .rounded-full');
                    if (btn) btn.click();
                }, 100);
            }
        }
    });

    // 3. DEEP-SHADOW HUNTER (Caçar e Congelar o Contador de Créditos)
    const huntAndFreeze = () => {
        // Procura em todo o documento, incluindo Shadow DOMs
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            // Se o texto contém números e palavras de crédito/saldo
            if (/(credit|saldo|balance|token|cota)/i.test(el.innerText) && /\d+/.test(el.innerText)) {
                if (!el.dataset.frozen) {
                    console.log('❄️ [HUNTER] Congelando elemento de saldo:', el);
                    el.style.opacity = '0.5';
                    el.style.filter = 'grayscale(1)';
                    el.title = 'CONGELADO PELO MR MANUS';
                    el.dataset.frozen = 'true';
                    // Impede atualizações de texto
                    const observer = new MutationObserver((m) => {
                        m.forEach(record => {
                            if (record.type === 'characterData' || record.type === 'childList') {
                                observer.disconnect();
                                el.innerText = 'BLOQUEADO';
                                observer.observe(el, { childList: true, characterData: true, subtree: true });
                            }
                        });
                    });
                    observer.observe(el, { childList: true, characterData: true, subtree: true });
                }
            }
        });
    };

    setInterval(huntAndFreeze, 2000);
    console.log('✅ [MR SEM LIMITE] Protocolo Rigoroso Ativado.');
})();
