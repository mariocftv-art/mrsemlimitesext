# Plano de Migração: MR Sem Limites v17.5.0 (Definitiva)

Este plano detalha a migração da Extensão 5 para a versão **17.5.0**, integrando o novo motor v17.0 desofuscado com o Master Kit de backend atualizado.

## Objetivos
1. **Preservação do Motor:** Manter `content.js`, `pageHook.js` e `castle-capture.js` do arquivo `LOVABLE_V17_DESOFUSCADO_ANALISE.zip`.
2. **Infraestrutura:** Instalar o novo backend contido no `master.zip`.
3. **Rebranding:** Aplicar a nova identidade visual "Neon" e substituir referências residuais de "Lovable".
4. **Licenciamento:** Configurar suporte para chaves no formato `MR-XXXX-XXXX-XXXX`.

## Ações Técnicas

### 1. Backend & API
- Extrair `master.zip` e aplicar os novos arquivos de rota em `src/routes/api/public/ext/`.
- Garantir que `validate-license-v2.ts` suporte o novo formato de chave dual.

### 2. Extensão (Fonte)
- Criar novo diretório: `extensions/ext-05/integrated/mr-sem-limites-v17-5`.
- Extrair `LOVABLE_V17_DESOFUSCADO_ANALISE.zip` para este diretório.
- **Sanitização:** Substituir strings "Lovable" por "MR Sem Limites" em `i18n.js` e `sidepanel-templates.js`.
- **Identidade Visual:** Atualizar `sidepanel.css` e templates para o estilo "Neon/Futurista".
- **Marca d'Água:** Inserir a logo como marca d'água no Login Gate.

### 3. Build & Entrega
- Incrementar versão para **17.5.0** em `manifest.json`.
- Gerar novo pacote físico: `public/ext5_v1750_zip.zip`.
- Atualizar `src/factory/seed.ts` para apontar para a nova versão e diretório.

## Validação
- Verificar logs do servidor para garantir que as novas rotas de API estão ativas.
- Testar a geração do ZIP e verificar se os arquivos internos refletem a versão 17.5.0.
