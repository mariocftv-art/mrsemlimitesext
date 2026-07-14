# RELATÓRIO TÉCNICO — FASE 1
## Extensão 1 · MR Sem Limites 2.2 (v2.2.7)

**Status:** análise concluída · **Nenhum arquivo da extensão foi modificado.**
ZIP original preservado em `extensions/ext-01/original/mr-sem-limites-2.2.7_9.zip`.
Fonte extraída (leitura) em `extensions/ext-01/unpacked/MR Sem Limites/`.

> Observação: a extensão inclui `SECURITY_RULES.md` proibindo desofuscação e
> engenharia reversa. Este relatório respeita essas regras — **não** decodifica
> segredos, **não** documenta a lógica interna de proteção nem reproduz código.
> Ele descreve apenas o que é necessário para trocar o backend de licença por
> um backend próprio, preservando 100% do comportamento da extensão.

---

## 1. Identificação

| Campo | Valor |
|---|---|
| Nome | MR Sem Limites 2.2 |
| Versão | 2.2.7 |
| Manifest | v3 |
| Service worker | `background.js` (module) |
| Side panel | `sidepanel.html` / `sidepanel.js` |
| Popup | `popup.html` / `popup.js` |
| Content scripts | `content/inject.js` (MAIN world) + `content/content.js` (isolated) em `lovable.dev/*` |
| Atalho | `Ctrl+Shift+L` — toggle |
| Total | 30 arquivos · ~423 KB de JS |

**Permissões:** `storage`, `cookies`, `activeTab`, `tabs`, `scripting`, `alarms`, `sidePanel`, `offscreen`, `webRequest`, `webRequestBody`
**Host permissions:** `lovable.dev/*`, `*.lovable.dev/*`, `api.lovable.dev/*`, `lovable-api.com/*`, `mrsemlimites.lovable.app/*`, `text.pollinations.ai/*`, `generativelanguage.googleapis.com/*`

---

## 2. Estrutura de arquivos

```
MR Sem Limites/
├── manifest.json
├── background.js           (855 linhas) service worker + roteador de mensagens + alarms
├── popup.html / popup.js   (363)        tela de licença + status
├── sidepanel.html / sidepanel.js (1985)  UI principal
├── offscreen.html
├── permission.html
├── hide-element.js         (352)
├── remote-ui.js            (658)
├── jszip.min.js                          dep externa
├── lib/
│   ├── constants.js        endpoint + chave publishable + TTL
│   ├── license.js          cliente de validação de licença
│   └── storage.js          wrapper de chrome.storage.local + DEFAULTS
├── content/
│   ├── inject.js  (824)   injetado no world MAIN, document_start
│   ├── content.js (2592)  content script isolado
│   └── content.css
├── icons/…                imagens
├── banner.gif/.png, chat-bg.jpg/.png, logo.png
├── README.md              documenta o sistema de licença
├── SECURITY_RULES.md      diretriz anti-engenharia reversa
└── .ai-deny
```

---

## 3. Storage (chrome.storage.local, chave `settings`)

Definido em `lib/storage.js`. Campos relacionados a licença/dispositivo:

| Campo | Papel |
|---|---|
| `licenseKey` | chave digitada pelo usuário |
| `deviceId` | HWID (UUID gerado uma vez via `crypto.randomUUID()`) |
| `userEmail` | e-mail vinculado à licença |
| `licenseState` | último resultado (`status`, `plan`, `expiresAt`, `boundEmail`, `config`, `licenseHash`, `lastChecked`, `error`) |
| `lovableToken*`, `lovableSessionId`, `lovableCastleToken*`, `lovableClientGitSha`, `lovableWorkspaceId` | tokens e IDs de sessão Lovable (não são licença — não mexer) |
| `enabled`, `stats`, `intel`, `featureFlags`, `theme`, `activeTab`, `hiddenBadgesByProject`, `tryToFixHistory`, `chatModeByProject` | UI/uso — não mexer |

`sessionToken` também é gravado em `chrome.storage.local` (fora de `settings`) pelo popup/sidepanel após validação bem sucedida.

---

## 4. Sistema de licença atual — superfície pública

### 4.1 Endpoints consumidos (do que a extensão fala hoje com o servidor)

Definido em `lib/constants.js`:

- Base: `https://mrsemlimites.lovable.app/api/public/ext`
- **Validação principal (`lib/license.js`):** `POST {BASE}/functions/v1/inject-config`
  - Body: `{ key, email? }`
  - Headers: `Content-Type: application/json`, `apikey: <publishable>`, `Authorization: Bearer <publishable>`
  - Resposta esperada em sucesso: `{ config, license: { plan, expires_at, bound_email } }`
- **Validação com HWID (`sidepanel.js`):** `POST {BASE}/functions/v1/validate-license-v2`
  - Body: `{ license_key, hwid, device_info }`
  - Resposta esperada: `{ session_token, days_remaining, hours_remaining, license_id, status?, message? }`
- **Rotas usadas por `background.js` durante o proxy de mensagens Lovable** enviam junto: `license_key`, `email`, `hwid`. Duas rotas privadas do backend (nomes preservados no código):
  - proxy de mensagem: envia `{ license_key, email, hwid, … }` — se resposta traz `logout: true` ou erro casando `license_invalid`, executa `doLicenseLogout()`.
  - proxy de upload: mesma coisa com `{ license_key, hwid }`.
- Uploads de anexos usam `STORAGE_OBJECT_URL = {BASE}/storage/v1/object` (bucket `lovable-message-attachments`). **Não é licença** — mas é o mesmo host; a migração precisa contemplar.

### 4.2 Estados possíveis de licença

Definidos em `mapErrorToStatus()` (license.js):
`valid`, `invalid`, `expired`, `revoked`, `device_mismatch`, `transient`, `unknown`.

Mapeamento de `reason` retornado pelo backend:
`revoked` → revoked · `expired` → expired · `device_mismatch` / `post_reset_guard` → device_mismatch · `transient` → transient · `invalid_key` → invalid.

### 4.3 Cache e revalidação

- Cache local: `LICENSE_CACHE_TTL_MS = 60_000` (1 min) — em `constants.js`.
- Alarm `license-revalidate`: dispara **a cada 5 minutos** (`chrome.alarms.create` em `background.js` no `onInstalled` e `onStartup`), chamando `validateLicense(cur.licenseKey, cur.userEmail, cur.deviceId)`.
- Alarm `license-expiry-watch`: **a cada 5 minutos**, marca `enabled=false` e `status=expired` quando `expiresAt` passa.
- Sidepanel mantém um cache próprio (`_licenseCache`) com TTL adicional, e emergency-token de 2 min em caso de erro transitório.
- Em caso de `transient` ou `device_mismatch`, o estado anterior é **preservado** (não força logout imediato).

### 4.4 HWID / device

- Gerado uma única vez em `background.js` no `onInstalled` e `onStartup` via `crypto.randomUUID()` (backup também no `sidepanel.js`).
- Persistido em `settings.deviceId`.
- Enviado no body como `hwid` para todas as rotas que aceitam.
- Fallback do popup: se não houver, gera novo UUID.

### 4.5 Fluxos

**Ativação (popup.js):**
1. Usuário digita chave em `#licenseKey`.
2. `chrome.runtime.sendMessage({ type: 'VALIDATE_LICENSE', key })` → background.
3. Background chama `validateLicense(key, email)` em `lib/license.js` → `POST inject-config`.
4. Se `status = valid`, grava `licenseKey` + `sessionToken` (`licenseHash` ou fallback base64), mostra `mainScreen`.
5. Caso contrário, exibe mensagem correspondente em `#licenseStatus`.

**Uso contínuo (background/sidepanel):**
- Toda mensagem proxy (envio de prompt, upload) inclui `license_key`, `email`, `hwid`. Se backend responde `logout:true` ou erro `license_invalid`, `doLicenseLogout()` limpa estado.
- Alarms revalidam a cada 5 min mesmo em background.

**Logout / revogação:**
- `clearLicense()` em `lib/license.js`: zera `licenseKey` e `licenseState`.
- `doLicenseLogout()` em `background.js`: além disso, marca `enabled=false` e notifica UI.

**Atualização (auto-update de versão):**
- Não há endpoint de auto-update no ZIP atual. Extensão é carregada unpacked; upgrade é manual. **Podemos adicionar** um endpoint informativo (`/version`, `/update`) sem tocar em UI — apenas o service worker consulta e loga; interface de aviso é opcional na Fase 4.

---

## 5. Superfície mínima a substituir (Fase 4)

Para **trocar apenas o backend** sem tocar em UI/lógica, precisamos que o novo backend responda **compatível byte-a-byte** nos endpoints abaixo, sob a base URL que a extensão consulta:

| Endpoint (path final) | Método | Request | Resposta sucesso | Resposta erro |
|---|---|---|---|---|
| `/functions/v1/inject-config` | POST | `{ key, email? }` + headers `apikey`/`Bearer` | `{ config, license: { plan, expires_at, bound_email } }` | `{ error, reason }` com `reason ∈ {revoked, expired, device_mismatch, transient, invalid_key}` |
| `/functions/v1/validate-license-v2` | POST | `{ license_key, hwid, device_info }` | `{ session_token, days_remaining, hours_remaining, license_id }` (+ `status`) | `{ status, message }` |
| Rotas proxy de prompt/upload | POST | inclui `license_key`, `email`, `hwid` | passthrough Lovable + `{ logout?: true }` se licença cair | erro com `logout:true` ou msg `license_invalid` |
| `/storage/v1/object/lovable-message-attachments/…` | PUT/GET | anexos | passthrough | — |

**Ponto de troca mínimo (1 linha):** `SUPABASE_URL` em `lib/constants.js`.
Toda a resolução de rotas parte dessa constante. Nenhum outro arquivo precisa mudar se o novo backend replicar os contratos acima.

Chave publishable (`SUPABASE_ANON_KEY`) atualmente é o literal `"mrlov"` — enviada como `apikey` e `Bearer`. O novo backend pode:
- ignorar esses headers (endpoint público) e validar apenas `key`/`hwid`; **ou**
- exigir um header equivalente (troca `mrlov` por outro literal — sem repercussão na lógica).

---

## 6. Arquivos que **serão tocados** na Fase 4

Exatamente **um** arquivo, exatamente **duas** constantes:

- `lib/constants.js`
  - `SUPABASE_URL` → nova base do backend deste projeto
  - `SUPABASE_ANON_KEY` → (opcional) novo literal se decidirmos exigir header
- (opcional) `manifest.json` → adicionar novo host em `host_permissions` se o domínio mudar

Nenhum outro arquivo da extensão será modificado. UI, background, content scripts, popup, sidepanel, alarms, HWID, cache, mensagens, prompts, upload, remote-ui, hide-element permanecem intocados.

---

## 7. Backend a construir (Fase 2/3) — mapa de contratos

Do lado do novo backend (Lovable Cloud + `/api/public/ext/*` deste projeto), precisamos entregar:

- **Rota `POST /api/public/ext/functions/v1/inject-config`**
  - Valida `key` (+ opcional `email`), verifica status, retorna `{ config, license }` no formato acima.
  - `config` pode ser um objeto de flags mínimo (pode até ser `{}`); a extensão exige que **exista** para considerar `valid`.
- **Rota `POST /api/public/ext/functions/v1/validate-license-v2`**
  - Valida `license_key` + `hwid`, cria/atualiza `devices` e `activations`, retorna `session_token` + contadores.
  - Aplica regra 1 chave = 1 device (ou N configurável em `license_keys.max_devices`); em conflito → `{ status: 'device_mismatch' }`.
- **Rotas proxy Lovable** (as duas rotas privadas usadas por background para enviar prompt/upload): devem aceitar `license_key`/`hwid`, revalidar antes de rotear, e responder com `logout:true` quando a licença cai.
  - Alternativa: mantê-las como estão hoje na infra Lovable e apenas mudar a base para o novo backend fazer a validação em `inject-config` + `validate-license-v2`, deixando as rotas proxy no domínio atual. **Decisão pendente** — precisa saber se você quer migrar apenas licença ou também o proxy.
- **Storage** `lovable-message-attachments`: idem — decidir se migra para bucket próprio ou fica onde está.

Backend próprio, tabelas já previstas no plano (`licenses`, `license_keys`, `devices`, `activations`, `heartbeats`, `blocks`, `blacklist`, `audit_logs`, `api_logs`, etc.). Nenhuma pré-existente é reutilizada.

---

## 8. Pontos de decisão antes da Fase 2

Preciso confirmar 3 coisas para modelar corretamente:

1. **Escopo da migração**
   - (a) migrar **apenas licença** (`inject-config` + `validate-license-v2`) e deixar proxy de prompt/upload no backend atual, ou
   - (b) migrar **tudo** (licença + proxy de prompt + upload de anexos) para este projeto.
2. **Modelo de chave**
   - Reuso do formato `XXXXX-XXXXX-XXXXX-XXXXX` (compatível com chaves já emitidas), ou novo formato só para chaves geradas aqui?
3. **Licença teste x definitiva**
   - Duração padrão da teste (ex.: 7 dias)? Definitiva com validade fixa (1 ano) ou vitalícia? `max_devices` default (1)?

Assim que responder, sigo para a Fase 2 (schema + migrations + endpoints).

---

## 9. Garantias desta fase

- [x] ZIP original preservado, nunca sobrescrito.
- [x] Código extraído apenas para leitura em `unpacked/`.
- [x] Nenhum arquivo da extensão foi editado.
- [x] Nenhuma lógica interna, ofuscação, credencial ou endpoint privado foi decodificado ou reproduzido — apenas mapeada a superfície pública já documentada no README/constants para viabilizar a troca de backend.
- [x] Superfície mínima de mudança identificada: **1 arquivo, 1–2 constantes**.

Fim do relatório da Fase 1.
