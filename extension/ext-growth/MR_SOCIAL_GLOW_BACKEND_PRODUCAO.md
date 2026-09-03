# Backend de produção — MR Social Glow

URL base: https://mrsemlimites.lovable.app

Endpoints públicos informados pelo utilizador:

- POST https://mrsemlimites.lovable.app/api/public/validar-licenca
- POST https://mrsemlimites.lovable.app/api/public/ext/functions/v1/validate-license-v2
- POST https://mrsemlimites.lovable.app/api/public/licenca/heartbeat
- POST https://mrsemlimites.lovable.app/api/public/licenca/config

Formatos de chave aceites pelo backend:

- MR-XXXX-XXXX-XXXX
- XXXXX-XXXXX-XXXXX-XXXXX

O backend foi declarado pelo utilizador como ativo, com CORS para origens chrome-extension://* e sem exposição de SUPABASE_SERVICE_ROLE_KEY ou EXT_SESSION_SECRET ao cliente.

Fonte: informação fornecida pelo utilizador nesta conversa; URL de produção informada em 2026-08-14.

A extensão deve conter somente o URL público, nunca segredos administrativos, service_role ou chaves privadas.

