# Backend Integration — MR Ext Sem Limites

## Estado atual (FASE 2A)

- Extensão continua consumindo o backend legado que já estava configurado.
- Toda comunicação está pronta para ser interceptada pelo `backendAdapter`.
- Nenhuma URL foi movida; apenas centralizamos as constantes em
  `config/app.config.js`.
- Feature flag `useNewBackend = false` mantém o comportamento antigo.

## Estado alvo (FASE 2B — após ativação do Lovable Cloud)

1. Ativar `FEATURE_FLAGS.useNewBackend = true` em `config/app.config.js`.
2. Substituir `API.BASE_URL` pelo domínio deste projeto:
   `https://<projeto>.lovable.app/api/public/ext`.
3. Implementar de fato as funções do `adapters/backend-adapter.js` chamando
   os endpoints listados em `API_CONTRACTS.md`.
4. Substituir as chamadas diretas em `background.js`, `sidepanel.js`,
   `lib/license.js` pelo `backendAdapter` — sem mudar UI/lógica.

## Pontos de integração conhecidos

| Arquivo             | Responsabilidade atual                  | Migração alvo                              |
| ------------------- | ---------------------------------------- | ------------------------------------------ |
| `lib/constants.js`  | URL e chave anon do backend legado       | ler de `config/app.config.js`              |
| `lib/license.js`    | Validação/cache de licença               | `backendAdapter.validateLicense()`         |
| `background.js`     | Polling e sessão                         | `backendAdapter.heartbeat()`               |
| `sidepanel.js`      | Envio de mensagens + upload              | `backendAdapter.proxyPrompt()` / `upload`  |

Nenhuma dessas trocas foi executada na FASE 2A.
