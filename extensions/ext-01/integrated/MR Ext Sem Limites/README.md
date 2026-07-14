# MR Ext Sem Limites

Extensão Chrome (MV3) para operar dentro do Lovable.dev, com backend próprio
de licenciamento e proxy.

> Rebrand aplicado na FASE 2A. Toda a lógica de execução permanece idêntica
> à versão original. Somente strings visíveis ao usuário foram trocadas para
> **MR Ext Sem Limites**.

## Estrutura

Veja `docs/EXTENSION_STRUCTURE.md`.

## Backend

Documentação de contratos e migração em:
- `docs/BACKEND_INTEGRATION.md`
- `docs/API_CONTRACTS.md`

Enquanto a FASE 2B (Lovable Cloud) não é executada, a extensão continua
consumindo o backend legado configurado em `lib/constants.js`. A troca será
feita ativando a flag `FEATURE_FLAGS.useNewBackend` em
`config/app.config.js` e implementando o `adapters/backend-adapter.js`.

## Instalação (dev)

1. Abrir `chrome://extensions`
2. Ativar **Modo desenvolvedor**
3. **Carregar sem empacotar** → selecionar esta pasta.
