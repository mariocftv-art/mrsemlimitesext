# Plano de Integração: Checkout e API de Revendedor (Extensão 7)

Este plano descreve a implementação do sistema de vendas, licenciamento via API externa e o painel de administração sincronizado para a nova Extensão 7.

## 1. Infraestrutura e Conectividade
*   **API de Revendedor:** Utilizar o endpoint `https://dwpuqewnfibeldegvimp.supabase.co/functions/v1/reseller-api` para todas as operações de licença.
*   **Segurança:** Armazenar a API Key (`lsl_live_...`) exclusivamente no servidor usando `secrets--add_secret`.
*   **Extensão 7:** Finalizar a sincronização da v17.7.0 no painel "Minhas Extensões".

## 2. Fluxo de Compra e Checkout
*   **Frontend:** Criar a rota `src/routes/checkout.tsx` com formulário de cliente (Nome, Email).
*   **Integração de Pagamento:** Implementar simulação/webhook para Mercado Pago/Pix.
*   **Processamento Backend:** Criar `src/routes/api/comprar-licenca.ts` para:
    *   Validar o pagamento.
    *   Chamar a API de Revendedor (`POST /v1/licenses`) com os dados do cliente.
    *   Retornar a chave gerada e disparar email (mocked).

## 3. Painel Administrativo e Cliente
*   **Painel Admin:** Atualizar `src/routes/admin/dashboard.tsx` para exibir o saldo de créditos (`GET /v1/balance`) e o histórico de licenças.
*   **Gestão de Licenças:** Adicionar funcionalidades de bloqueio, reset de HWID e edição de dados no painel admin, chamando as rotas correspondentes da API de Revendedor.
*   **Painel Cliente:** Criar uma área simples para o cliente visualizar sua chave e solicitar reset de HWID.

## 4. Finalização da Extensão 7
*   **Build Final:** Gerar o ZIP `ext7_v1770_zip.zip` com branding 100% "MR Sem Limites" e motor sincronizado.
*   **Distribuição:** Garantir que a rota `/api/public/download-extensao` sirva a versão 17.7.0.

## Detalhes Técnicos
*   **Secrets:** Adicionar `RESELLER_API_KEY` via ferramenta de segredos.
*   **Serviços:** Criar `src/lib/reseller-api.server.ts` para centralizar as chamadas HTTP para o Supabase externo.
*   **Sync:** Corrigir os erros de importação e tipagem no arquivo `src/routes/extensions.tsx`.
