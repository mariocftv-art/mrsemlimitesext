# Plano de Migração: Restauração da Reseller API e Backend MR Sem Limites

O usuário reportou que a "licença deu inválida" e que o backend/banco de dados anterior foi removido. A análise confirmou que os endpoints da extensão (`license-activation.ts`, `license-heartbeat.ts`, `validate-license-v2.ts`) ainda estão tentando usar variáveis do Lovable Cloud (Supabase local) que não estão configuradas, em vez de usar a **Reseller API** externa configurada em `src/lib/reseller-api.functions.ts`.

## Ações Necessárias

### 1. Backend: Integração dos Endpoints da Extensão com a Reseller API
Atualizar os endpoints que a extensão chama para consultar a API externa do MR Sem Limites em vez do banco de dados local.

- **`src/routes/api/public/ext/functions.v1.validate-license-v2.ts`**:
    - Alterar a lógica de busca no Supabase local para uma chamada à Reseller API (`${API_BASE}/v1/licenses`).
    - Validar a chave contra a API externa.
    - Se a chave for válida na API externa, retornar `status: 'valid'`.

- **`src/routes/api/public/ext/license-activation.ts`**:
    - Substituir a verificação do banco local por uma chamada à Reseller API.
    - Garantir que chaves no formato `XXXXX-XXXXX-XXXXX-XXXXX-XXXXX` sejam aceitas.

- **`src/routes/api/public/ext/license-heartbeat.ts`**:
    - Atualizar para validar a sessão contra a API externa ou retornar sucesso se a chave ainda estiver ativa na API.

- **`src/routes/api/public/ext/validate-license.ts`**:
    - Atualmente retorna um mock estático. Deve ser atualizado para consultar a Reseller API se necessário, ou mantido como bypass se for a intenção para EXT5/EXT6.

### 2. Mock Store e Simulação
- **`src/mock/store.ts`**:
    - Garantir que a geração de chaves no mock (`licenseActions.generateKey`) siga o padrão esperado pela Reseller API.
- **`src/factory/lab.tsx`**:
    - Atualizar o estado inicial do storage simulado para usar chaves no formato correto.

### 3. Verificação de Segurança
- Certificar que a `RESELLER_API_KEY` seja lida apenas no servidor (dentro dos handlers ou `createServerFn`).

## Detalhes Técnicos
- **Endpoint Base**: `https://dwpuqewnfibeldegvimp.supabase.co/functions/v1/reseller-api`
- **Autenticação**: Bearer Token via `RESELLER_API_KEY`.
- **Formato da Chave**: `XXXXX-XXXXX-XXXXX-XXXXX-XXXXX` (5 blocos).

Este plano restaura a conexão com o servidor externo do cliente, resolvendo o erro de "licença inválida" causado pela tentativa de usar um banco de dados local inexistente.
