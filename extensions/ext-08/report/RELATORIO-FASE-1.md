# EXT8 — Relatório Técnico (Fase 1)

**Origem:** `lov-qyron-6.1.1_extensão.zip`
**Nome original:** LOV QYRON — Premium AI Assistant `v6.1.1`
**Backup intocado:** `extensions/ext-08/original/`
**Código-fonte de referência:** `extensions/ext-08/unpacked/` (somente leitura)
**Versão integrada:** `extensions/ext-08/integrated/MR Sem Limites Ext 8/`

---

## 1. Estrutura (9 arquivos)

| Arquivo | Tam. | Papel |
|---|---|---|
| `manifest.json` | 1.8 KB | MV3, side panel, 2 content scripts (MAIN + ISOLATED) |
| `background.js` | 43 KB | Service worker — chat de IA, alarms, storage |
| `content.bundle.js` | 392 KB | Motor injetado no Lovable (ofuscado) |
| `page-injected.js` | 13 KB | Hook em MAIN world, `document_start` |
| `popup.bundle.js` | 346 KB | Sidepanel + sistema de licenças (ofuscado) |
| `popup.html` | 1.2 MB | UI completa inline |
| `popup-migrate.js` | 7 KB | Ferramenta manual de migração (Supabase) — inerte |
| `jszip.min.js` | 98 KB | Lib de terceiros |
| `icon.png` | 4 KB | Ícone |

Todo o JS de negócio está ofuscado (javascript-obfuscator, string array + RC4).

## 2. Backend antigo detectado

Host base: `https://qyrondev.lovable.app` (também em `host_permissions`),
sobrescrevível por `localStorage["qyron_dashboard_url"]`.

| Endpoint | Método | Payload | Resposta usada |
|---|---|---|---|
| `/api/public/validate-license?code=` | GET | — | `valid`, `expires_at`, `days_remaining` |
| `/api/public/validate-license` | POST | `{code, machine_id}` | `ok`, `error` |
| `/api/public/license-activation` | POST | `{code, machine_id, user_agent}` | `ok`, `error` |
| `/api/public/license-heartbeat` | POST | `{code, machine_id}` | `ok` |
| `/api/public/license-deactivate` | POST | `{code, machine_id}` | — |
| `/api/public/qyron-ai-chat` | POST | `{model, messages}` + `X-Qyron-License` | SSE OpenAI (`choices[].delta.content`) |

## 3. Autenticação / licença

- Chaves em `localStorage`: `qyron_license_code`, `qyron_license_active`,
  `qyron_license_status`, `qyron_machine_id`, `qyron_authenticated`,
  `qyron_last_validation`, `qyron_dashboard_url`.
- Validação periódica (10 min), heartbeat (10 min), checagem de expiração (60 s).
- Logout automático em licença inválida, bloqueada ou expirada.

## 4. Pontos de proteção existentes

- Ofuscação pesada em `background.js`, `content.bundle.js`, `popup.bundle.js`.
- Nenhum manifesto de integridade e nenhum anti-inspeção nativos.

## 5. Alterações aplicadas (somente backend)

1. Host `qyrondev.lovable.app` → `mrsemlimitesext.lovable.app` (substituição
   literal nos 3 bundles; **paths e payloads preservados**).
2. Novo `mr-backend-shim.js` — camada aditiva que reescreve, em tempo de
   execução, qualquer chamada residual (fetch/XHR) e fixa a base do
   dashboard. Falhas são engolidas: a extensão nunca piora por causa dele.
3. `mr-security-pro.js` compartilhado (mesmo módulo das EXT1–EXT7) carregado
   no content script e no sidepanel.
4. `manifest.json`: nome `MR Sem Limites Ext 8`, versão `8.0.0`,
   `host_permissions` do backend MR, `qyrondev` removido.
5. `.ai-deny` + `SECURITY_RULES.md` (bloqueio de IA, igual às demais).

**Não alterado:** UI, prompts, motor, voz, vibe coding, remover marca,
fluxo de licença, `page-injected.js`, `popup-migrate.js`, `jszip`, ícone.

## 6. Rotas criadas no backend MR (isoladas da EXT1–EXT7)

`src/routes/api/public/`: `validate-license.ts`, `license-activation.ts`,
`license-heartbeat.ts`, `license-deactivate.ts`, `qyron-ai-chat.ts`
(+ helper `src/lib/ext8-license.server-shared.ts`).

Licença opera em modo passthrough (sem tabela ainda), aceitando sufixo
`-30D` / `-365D` no código para definir a validade real. O chat usa o
Lovable AI Gateway com streaming SSE compatível.
