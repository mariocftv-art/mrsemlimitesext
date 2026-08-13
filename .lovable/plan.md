# Plano de Integração: Checkout e API de Revendedor (Extensão 7)

Este plano descreve a implementação do sistema de vendas e integração com a API de Revendedor Supabase para a Extensão 7.

## 1. Infraestrutura e Segurança
- Adicionar segredo `RESELLER_API_KEY` ao workspace (necessário ação do usuário).
- Centralizar chamadas da API em `src/lib/reseller-api.functions.ts`.
- Validar todos os inputs com Zod para prevenir injeções.

## 2. Fluxo de Checkout
- **Rota**: `src/routes/checkout.tsx`.
- Interface limpa com formulário de Nome e E-mail.
- Escolha entre PIX e Cartão (simulado).
- Chamada para `purchaseLicense` que invoca a API de Revendedor.
- Tela de sucesso exibindo a `license_key` gerada.

## 3. Painel Administrativo (Extensão 7)
- Exibir saldo de créditos recuperado da API (`getBalance`).
- Listagem de licenças geradas através da API.
- Botão para reset de HWID chamando o endpoint de reset da API.

## 4. Integração com a Extensão
- Garantir que a EXT7 use o formato de chave `XXXXX-XXXXX-XXXXX-XXXXX-XXXXX`.
- Configurar `lv-core.js` da EXT7 para validar contra o endpoint correto.

## Detalhes Técnicos
- **Endpoint**: `https://dwpuqewnfibeldegvimp.supabase.co/functions/v1/reseller-api`.
- **Formato de Chave**: 5 blocos de 5 caracteres.
- **Segurança**: Chave de API mantida apenas no servidor via `createServerFn`.
