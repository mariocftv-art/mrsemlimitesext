# Plano de Integração: Checkout e API de Revendedor (Extensão 7)

Este plano detalha a implementação do sistema de vendas e o painel administrativo para a nova Extensão 7, utilizando a API de Revendedor externa.

## Usuário
- **Objetivo**: Vender licenças automaticamente e gerenciar saldo/revendedores.
- **Fluxo**: Checkout -> Webhook -> Entrega de Chave -> Painel Admin.

## Técnico

### Fase 1: Infraestrutura e Segurança
- Adicionar `RESELLER_API_KEY` aos segredos do projeto.
- Validar conectividade com o endpoint `https://dwpuqewnfibeldegvimp.supabase.co/functions/v1/reseller-api`.

### Fase 2: Checkout e Webhooks
- Criar `src/routes/checkout.tsx`: Formulário de compra integrado com Mercado Pago/Kiwify.
- Criar `src/routes/api/public/webhook-pagamento.ts`: Processar notificações de pagamento e chamar `createLicense` da API de Revendedor.
- Implementar envio de e-mail com a chave gerada.

### Fase 3: Painel Administrativo
- Criar `src/routes/admin/reseller.tsx`: Visualizar saldo atual e histórico de chaves geradas.
- Adicionar ferramentas de suporte: Reset de HWID e consulta de status de licença via API.

### Fase 4: Portal do Cliente
- Criar `src/routes/minha-licenca.tsx`: Área simples para o cliente consultar sua chave e realizar reset de HWID (limitado).

## Riscos
- **Segurança**: Garantir que a `RESELLER_API_KEY` nunca vaze para o frontend.
- **Conectividade**: Tratar erros 402 (Saldo Insuficiente) na API de Revendedor de forma amigável no checkout.
