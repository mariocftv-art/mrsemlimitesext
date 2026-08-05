
# FASE 4 — Backend real com Lovable Cloud

Objetivo: sair 100% do mock e ligar painel + extensão a um backend real, mantendo o formato de chave `XXXXX-XXXXX-XXXXX-XXXXX` e os contratos que a extensão já consome.

## 1. Ativar Lovable Cloud
- `supabase--enable` (cria projeto, injeta env vars, habilita Auth/DB/Storage/Server Functions).
- Nada de Edge Functions: toda API vai em `createServerFn` + rotas `src/routes/api/public/ext/*` (TanStack Start).

## 2. Migrations (schema mínimo viável da Fase 2, enxugado p/ 1ª onda)
Ordem, cada uma com `CREATE TABLE → GRANT → ENABLE RLS → CREATE POLICY`:

1. `0001_roles.sql` — enum `app_role`, `profiles`, `user_roles`, `has_role()`, trigger `handle_new_user`.
2. `0002_products.sql` — `products`, `product_license_config` (mensagens + defaults + `runtime_config`).
3. `0003_customers.sql` — `customers`.
4. `0004_licenses.sql` — enums `license_type` / `license_status`, `licenses`.
5. `0005_license_keys.sql` — `license_keys` (`key_hash` SHA-256 único, `key_last4`, `key_ciphertext` opcional).
6. `0006_devices.sql` — `devices` (UNIQUE `license_key_id + hwid`), `device_sessions` (`session_token_hash`).
7. `0007_events.sql` — `activations`, `heartbeats`, `blocks`, `blacklist`.
8. `0008_audit.sql` — `audit_logs`, `api_logs`.
9. `0009_indexes_rls.sql` — índices + policies definitivas (`admin`/`staff` no painel; público via service-role dentro das rotas).

Sem seeds automáticos. Sem `anon` grant nas tabelas sensíveis.

## 3. Endpoints públicos consumidos pela extensão
Base: `/api/public/ext/functions/v1/...` (mesmos paths de hoje, só muda o host):

| Rota | Descrição |
|---|---|
| `POST inject-config` | valida chave + email, devolve `{ config, license }` |
| `POST validate-license-v2` | valida chave + HWID, cria/atualiza device, devolve `session_token` |
| `POST heartbeat` | keepalive; atualiza `last_seen`, grava evento |
| `POST proxy/prompt` | revalida sessão, repassa ao Lovable, grava `api_logs` |
| `POST proxy/upload` | idem para upload |
| `GET  version?product=slug` | versão atual (opcional, para auto-update) |

Cada rota: Zod, checagem de `blacklist`/`blocks`, rate-limit simples por IP+key_hash, respostas com `reason` compatível (`invalid_key`, `expired`, `revoked`, `device_mismatch`, `transient`).

## 4. Server functions do painel (`createServerFn` + `requireSupabaseAuth` + `has_role('admin'|'staff')`)
- Clientes: create/update/delete/list.
- Licenças: create (trial/definitiva), renew, block, unblock, revoke, changeExpiry, transfer.
- Chaves: generate (formato `XXXXX-XXXXX-XXXXX-XXXXX`, Crockford), regenerate, revealKey (admin).
- Dispositivos: reset, revoke.
- Blacklist: add/remove.
- Logs/auditoria: list.

## 5. Painel — troca do mock pelo real
- Substituir `useStore` (Zustand + localStorage) por hooks TanStack Query que chamam as server functions.
- Rotas admin migram para `src/routes/_authenticated/` (gate gerenciado). Login/logout via Supabase (email/senha; Google opcional depois).
- Primeiro usuário cadastrado recebe role `admin` (função SQL `grant_first_admin`).
- Remover botões “MODO TESTE” e “Limpar dados de teste” do settings — não fazem sentido com dados reais (ou mantê-los apenas em modo dev, atrás de flag).

## 6. Extensão — mudança mínima (Fase 4b)
- Alterar apenas `lib/constants.js` (e `manifest.json` se necessário) para apontar `SUPABASE_URL` → `https://<projeto>.lovable.app`.
- Nenhum outro arquivo da extensão é tocado. Contratos byte-a-byte preservados.

## 7. Segurança
- Chave nunca aparece em log (apenas `key_last4` + `key_hash`).
- `session_token` armazenado como hash.
- RLS restritivo; rotas públicas usam `supabaseAdmin` **somente após** validar entrada.
- `LOVABLE_API_KEY` provisionado; nada exposto no browser.

## 8. Ordem de execução
1. Ativar Cloud.
2. Rodar as 9 migrations.
3. Implementar rotas públicas `/api/public/ext/*` + server functions do painel.
4. Migrar telas do painel (Auth, Clientes, Licenças, Dispositivos, Ativações, Blacklist, Logs, Produtos).
5. Trocar `SUPABASE_URL` na extensão e testar ponta-a-ponta (ativar chave real gerada no painel).
6. Publicar.

## Perguntas antes de começar

1. **Auth do painel**: só email/senha nesta fase, ou já habilito Google também?
2. **Primeiro admin**: crio via SQL fixando um email seu (qual?) ou promovo o primeiro cadastro automaticamente?
3. **Modo TESTE**: removo do painel ou mantenho como toggle dev (não afeta banco real)?
4. **Extensão**: posso já atualizar `lib/constants.js` na pasta `Reformulada 2.1` (a mais nova) ou você prefere tocar só depois que o backend estiver de pé?

Assim que responder, executo na ordem: Cloud → migrations → rotas → painel → extensão.
