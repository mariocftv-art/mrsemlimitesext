# FASE 2 — Backend definitivo · Proposta para aprovação

Nenhum arquivo da extensão será tocado nesta fase. Só sigo para código depois do seu OK.

**Princípios fixados pelo cliente:**
- Migrar 100% (licença + proxy prompts + upload + auth + config + sessão + storage + logs + auditoria).
- Formato de chave único e imutável: `XXXXX-XXXXX-XXXXX-XXXXX`.
- **Zero hardcoded**: toda configuração vive no banco, por produto.
- Backend único, definitivo, reutilizado por Extensão 1, 2, 3 e futuras.
- Compatibilidade byte-a-byte com contratos que a extensão já consome.

---

## 1. Modelo de dados (tabelas)

Todas em `public`, com GRANTs, RLS e políticas via `has_role`. Roles: `admin`, `staff`, `cliente`.

### 1.1 Identidade / RBAC
- `profiles(id → auth.users, nome, email, telefone, empresa, created_at)`
- `app_role` enum `('admin','staff','cliente')`
- `user_roles(id, user_id, role)` + função `has_role(uuid, app_role)` SECURITY DEFINER

### 1.2 Produtos (uma linha por extensão)
- `products(id, slug, name, logo_url, banner_url, description, category, current_version, status, created_at)`
- `product_versions(id, product_id, version, changelog, zip_path, mandatory, published_at)`
- **`product_license_config(product_id PK)`** — tudo configurável no painel, nada no código:
  - `trial_options jsonb` — presets de teste (ex.: `["30m","1h","12h","24h","3d","7d","15d","30d"]`)
  - `license_options jsonb` — presets definitivos (ex.: `["30d","60d","90d","180d","365d","lifetime","custom"]`)
  - `device_options jsonb` — presets (ex.: `[1,2,3,5,"unlimited"]`)
  - `default_trial`, `default_duration`, `default_max_devices`, `default_max_activations`
  - `msg_activation`, `msg_expiration`, `msg_blocked`, `msg_device_mismatch`, `msg_revoked`
  - `runtime_config jsonb` — payload devolvido em `inject-config.config` (flags/feature toggles por produto)
  - `require_email` bool, `revalidate_interval_min` int, `cache_ttl_sec` int

### 1.3 Clientes
- `customers(id, name, email, phone, company, notes, created_at)`

### 1.4 Licenças e chaves
- `license_type` enum `('trial','definitive')`
- `license_status` enum `('active','expired','revoked','blocked','cancelled','pending')`
- `licenses(id, customer_id, product_id, type, status, starts_at, expires_at, is_lifetime, max_devices, max_activations, notes, created_by, created_at)`
- `license_keys(id, license_id, key_ciphertext, key_hash, key_last4, status, created_at)`
  - `key_hash`: SHA-256 hex — usado nas consultas de validação (índice único).
  - `key_ciphertext`: chave em claro cifrada com `pgsodium`/AES via server function — visível no painel só para admin.
  - Formato gerado: `XXXXX-XXXXX-XXXXX-XXXXX` (25 chars + 3 hífens, alfabeto Crockford Base32).

### 1.5 Dispositivos e sessões
- `devices(id, hwid, license_key_id, os, browser, browser_version, extension_version, first_seen_at, last_seen_at, status, revoked_at)`
  - UNIQUE `(license_key_id, hwid)` — 1 device = 1 par (chave, hwid).
- `device_sessions(id, device_id, session_token_hash, issued_at, expires_at, revoked_at)`

### 1.6 Eventos / observabilidade
- `activations(id, license_key_id, device_id, ip, ua, result, reason, created_at)`
- `heartbeats(id, device_id, ip, payload jsonb, created_at)` — TTL 30 dias
- `blocks(id, license_key_id?, device_id?, reason, actor_id, created_at)`
- `blacklist(id, kind ∈ {'device','ip','key'}, value, reason, actor_id, created_at)`
- `downloads(id, product_version_id, customer_id?, device_id?, ip, ua, created_at)`
- `audit_logs(id, actor_id, action, entity, entity_id, diff jsonb, ip, ua, created_at)`
- `api_logs(id, endpoint, method, status, latency_ms, license_key_id?, device_id?, ip, ua, created_at)` — TTL 90 dias

### 1.7 Proxy Lovable (necessário para migrar prompts + upload)
- `proxy_routes(id, product_id, kind ∈ {'prompt','upload'}, upstream_url, method, injected_headers jsonb, allow_body_passthrough bool, enabled bool)`
- `proxy_calls(id, license_key_id, device_id, kind, upstream_status, latency_ms, bytes_in, bytes_out, error, created_at)` — TTL 30 dias

### 1.8 Storage buckets (Cloud)
- `extension-zips` (privado, admin) — ZIPs de versão
- `extension-assets` (público) — logos/banners de produto
- `message-attachments` (privado, políticas por device_session) — substitui `lovable-message-attachments`

---

## 2. Endpoints (rotas server públicas + server functions internas)

Base pública para a extensão: `https://project--<id>.lovable.app/api/public/ext/`
Compatibilidade preservada: paths com `/functions/v1/...` são mantidos, apenas mudam de host.

### 2.1 Consumidos pela extensão (Fase 4 troca só a base URL)
| Path | Método | Body | Resposta | Uso |
|---|---|---|---|---|
| `/api/public/ext/functions/v1/inject-config` | POST | `{ key, email? }` | `{ config, license:{ plan, expires_at, bound_email } }` | validação principal (background) |
| `/api/public/ext/functions/v1/validate-license-v2` | POST | `{ license_key, hwid, device_info }` | `{ session_token, days_remaining, hours_remaining, license_id, status? }` | validação com HWID (sidepanel) |
| `/api/public/ext/functions/v1/proxy/prompt` | POST | passthrough + `{ license_key, email, hwid, session_token }` | passthrough Lovable; `{ …, logout?: true }` | proxy de prompt |
| `/api/public/ext/functions/v1/proxy/upload` | POST | passthrough + `{ license_key, hwid, session_token }` | passthrough; `{ logout?: true }` | proxy de upload |
| `/api/public/ext/storage/v1/object/message-attachments/*` | PUT/GET | binário | binário | anexos (bucket próprio) |
| `/api/public/ext/functions/v1/version?product=slug` | GET | — | `{ version, mandatory, url? }` | opcional (auto-update info) |
| `/api/public/ext/functions/v1/heartbeat` | POST | `{ session_token, payload }` | `{ ok }` | keepalive |

Todos aplicam: validação Zod, rate limit por (IP + hash de chave), HMAC de resposta opcional, gravação em `activations`/`api_logs`/`proxy_calls`, checagem de `blacklist` e `blocks`. `reason` compatível com o mapa da extensão (`revoked`/`expired`/`device_mismatch`/`transient`/`invalid_key`/`post_reset_guard`).

### 2.2 Painel admin (server functions com `requireSupabaseAuth` + `has_role`)
- Produtos: `createProduct`, `updateProduct`, `updateLicenseConfig`, `uploadVersion (zip → bucket)`, `publishVersion`
- Clientes: `createCustomer`, `updateCustomer`
- Licenças: `createLicense (trial|definitive, presets ou custom)`, `renewLicense`, `blockLicense`, `unblockLicense`, `cancelLicense`, `revokeLicense`, `changeExpiry`, `changeMaxDevices`
- Chaves: `generateKey`, `regenerateKey`, `revealKey (admin)`
- Dispositivos: `resetDevice`, `revokeDevice`, `transferDevice`
- Blacklist: `addToBlacklist`, `removeFromBlacklist`
- Auditoria/logs: `listAuditLogs`, `listApiLogs`, `listProxyCalls`

---

## 3. Migrations (ordem)

```
0001_roles.sql              app_role, user_roles, has_role(), profiles, trigger handle_new_user
0002_products.sql           products, product_versions, product_license_config
0003_customers.sql          customers
0004_licenses.sql           enums license_type/license_status, licenses
0005_license_keys.sql       license_keys (+ crypto helpers pgcrypto/pgsodium)
0006_devices.sql            devices, device_sessions
0007_events.sql             activations, heartbeats, blocks, blacklist, downloads
0008_audit.sql              audit_logs, api_logs
0009_proxy.sql              proxy_routes, proxy_calls
0010_indexes_grants_rls.sql índices, GRANTs por tabela, RLS + policies via has_role
0011_seed_admin.sql         (opcional) grant admin ao primeiro usuário via script separado
```

Cada migration segue a regra obrigatória: `CREATE TABLE` → `GRANT` → `ENABLE RLS` → `CREATE POLICY`. Nenhum GRANT em `anon` para tabelas de licença/dispositivo (só `authenticated` + `service_role`); apenas as rotas `/api/public/ext/*` (com service-role via server) leem/gravam esses dados após validação.

---

## 4. Fluxos garantidos

**Ativação:** popup → `VALIDATE_LICENSE` → background → `POST inject-config` + `POST validate-license-v2` → cria `device` + `activation` + `device_session` → devolve `session_token` (hash guardado) + `config` do produto. Cache de 1 min (respeitando `LICENSE_CACHE_TTL_MS` da extensão).

**Uso contínuo:** alarms 5 min (`license-revalidate`, `license-expiry-watch`) chamam `inject-config` → decide `valid/expired/revoked/device_mismatch/transient`. Nada muda no client.

**Prompt/Upload:** background envia `{license_key, hwid, email, session_token}` para `/proxy/prompt` ou `/proxy/upload`. O backend revalida antes de repassar, aplica blacklist/blocks, grava em `proxy_calls`. Se cair, responde `{ logout: true }` — a extensão já sabe tratar.

**Renovação/bloqueio/reset (painel):** server functions autenticadas → gravam em `licenses`/`blocks`/`audit_logs`. Próxima revalidação (≤5 min) reflete no client — sem push, comportamento igual ao atual.

**Compatibilidade da troca:** único ponto de mudança na extensão é `SUPABASE_URL` em `lib/constants.js` (e, se preciso, um novo host em `manifest.json`). Nada mais é tocado.

---

## 5. Segurança mínima (Fase 2, sem ofuscação)

- Chave nunca trafega em log — só `key_last4` e `key_hash`.
- `session_token` guardado como hash SHA-256; validade curta (config por produto).
- Rate limit: 60 req/min por (IP + key_hash) nos endpoints públicos; 10/min em `inject-config` sem chave válida.
- HMAC opcional (`X-MRX-Sig`) por produto — configurável em `product_license_config.runtime_config`.
- RLS: dados de cliente/licença acessíveis apenas por `admin`/`staff` autenticado no painel.
- Auditoria de toda ação admin em `audit_logs` com diff.

---

## 6. O que NÃO faz parte desta fase

- Não mexer em nenhum arquivo da extensão (Fase 4).
- Não implementar ofuscação/hardening extra (fica para depois das 3 extensões).
- Não subir chaves reais em migrations.
- Não criar contas/produtos automaticamente — só o schema pronto.

---

## Perguntas de aprovação

1. Aprova o modelo de dados (17 tabelas + 3 buckets acima)?
2. Aprova os endpoints públicos com esses paths exatos (mantendo `/functions/v1/…` para compatibilidade)?
3. Aprova migrar o bucket de anexos de `lovable-message-attachments` para `message-attachments` (bucket próprio)?
4. Google login habilitado no painel desde já, ou só email/senha nesta fase?
5. Alguma configuração extra em `product_license_config` que queira já prever (ex.: whitelist de IPs, geo-restrição, limite de req/min por licença)?

Assim que aprovar, executo Fase 2 na ordem: ativar Lovable Cloud → migrations → server functions/rotas → painel plugado. Só depois, com seu novo OK, sigo para Fase 4 (troca das 1–2 constantes na extensão).
