# Camada de Backend Compartilhado

Este projeto **não possui backend próprio**. Toda comunicação será feita
com um backend já existente em outro projeto Lovable / Supabase.

Esta pasta contém **apenas a arquitetura** — nenhuma chamada real é feita
enquanto `FEATURE_FLAGS.useSharedBackend` estiver `false` e
`APP_CONFIG.API_BASE_URL` estiver vazio.

## Estrutura

```
src/backend/
├── config/
│   ├── app.config.ts         # API_BASE_URL, API_VERSION, EXTENSION_ID, PRODUCT_ID, CLIENT_VERSION
│   └── feature-flags.ts      # useSharedBackend, enableHeartbeat, ...
├── interfaces/
│   └── backend.interface.ts  # Contrato IBackendAdapter
├── types/
│   └── index.ts              # DTOs de request/response
├── api/
│   └── api-client.ts         # Cliente HTTP genérico (fetch)
├── adapters/
│   └── backend-adapter.ts    # ÚNICO ponto de acesso ao backend
├── services/                 # Serviços de negócio (consomem o adapter)
│   ├── license.service.ts
│   ├── session.service.ts
│   ├── version.service.ts
│   ├── activation.service.ts
│   ├── logs.service.ts
│   ├── download.service.ts
│   └── config.service.ts
└── index.ts                  # Barrel — importe SOMENTE daqui
```

## Regra de ouro

- UI, hooks, rotas e a extensão consomem **services** ou o `backendAdapter`.
- **Nunca** importar `ApiClient` fora desta pasta.
- **Nunca** montar URL de endpoint manualmente fora do adapter.

## Como ligar quando o backend compartilhado estiver disponível

1. Preencher em `src/backend/config/app.config.ts`:
   - `API_BASE_URL` — URL pública do projeto backend.
   - `EXTENSION_ID` — ID publicado da extensão.
   - `PRODUCT_ID` / `CLIENT_VERSION` — se mudarem.
2. Ativar em `src/backend/config/feature-flags.ts`:
   - `useSharedBackend: true`
   - flags específicas conforme necessidade (`enableHeartbeat`, etc).
3. Implementar `ApiClient.request()` em `src/backend/api/api-client.ts`
   (fetch + timeout + tratamento de erros).
4. Trocar os `throw new Error(NOT_READY)` de
   `src/backend/adapters/backend-adapter.ts` pelas chamadas reais já
   comentadas em cada método.
5. Migrar consumidores (painel/extensão) para chamar `services/*` no
   lugar do mock atual (`src/mock/*`).

Nada acima foi feito nesta fase — apenas a estrutura.
