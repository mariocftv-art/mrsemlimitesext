# API Contracts — MR Ext Sem Limites

Base: `${API.BASE_URL}` (definido em `config/app.config.js`).

## POST `/functions/v1/validate-license`
Req: `{ license_key, hwid, device_name, product_slug, extension_version }`
Res: `{ status: 'valid'|'expired'|'revoked'|'device_mismatch'|'not_found', days_remaining?, session_token?, config?, message? }`

## GET `/functions/v1/inject-config`
Res: `{ feature_flags, ui, limits }`

## POST `/functions/v1/heartbeat`
Req: `{ session_token, hwid }` — Res: `{ ok: boolean }`

## POST `/functions/v1/proxy/prompt`
Req: `{ session_token, prompt, attachments?, chat_mode? }`
Res: `{ ok, message?, meta? }`

## POST `/functions/v1/proxy/upload`
Multipart: `file`, `session_token`, `meta` — Res: `{ url, path, size }`

## GET `/functions/v1/version?product=<slug>`
Res: `{ version, url? }`

## Storage
`GET/POST /storage/v1/object/{bucket}/{path}` — bucket padrão em `BUCKETS.attachments`.

Contratos válidos para as duas fases. A FASE 2B só implementa; não altera assinatura.
