# Extension Structure — MR Ext Sem Limites

```
MR Ext Sem Limites/
├── manifest.json              # MV3 — nome/descrição rebrandados
├── background.js              # service worker (INALTERADO em lógica)
├── popup.html / popup.js      # popup (INALTERADO em lógica)
├── sidepanel.html / .js       # painel lateral (apenas textos rebrandados)
├── offscreen.html             # voz (INALTERADO)
├── permission.html            # microfone (INALTERADO)
├── content/
│   ├── inject.js              # world MAIN (INALTERADO)
│   ├── content.js             # world ISOLATED (apenas strings visíveis)
│   └── content.css            # (INALTERADO)
├── hide-element.js            # (INALTERADO)
├── remote-ui.js               # (INALTERADO)
├── jszip.min.js               # vendor
├── lib/
│   ├── constants.js           # legado — permanece funcionando
│   ├── storage.js             # legado — permanece funcionando
│   └── license.js             # legado — permanece funcionando
│
├── config/                    # NOVO — configuração central
│   └── app.config.js
├── interfaces/                # NOVO — contratos (JSDoc)
│   └── backend.interface.js
├── adapters/                  # NOVO — adapter do backend (stub)
│   └── backend-adapter.js
├── services/                  # NOVO — reservado (Fase 2B)
├── api/                       # NOVO — reservado (Fase 2B)
├── types/                     # NOVO — reservado
└── docs/                      # NOVO
    ├── BACKEND_INTEGRATION.md
    ├── API_CONTRACTS.md
    └── EXTENSION_STRUCTURE.md
```

## Regras

- Nada em `services/`, `api/`, `adapters/` é chamado ainda pelo runtime.
- O código legado (`lib/`, `background.js`, `sidepanel.js`) continua sendo a
  única fonte de verdade em produção.
- Quando a FASE 2B rodar, o adapter será plugado sem trocar UI nem lógica.
