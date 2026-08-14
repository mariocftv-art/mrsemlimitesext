# Plano de Correção: Extensão 8 e Download

O usuário relatou erros de download e falha na implementação da Extensão 8 (Lovable Oito Ultra). A análise identificou que as rotas de download em `src/routes/extensions.tsx` estão usando caminhos inconsistentes e o backend de download precisa de sincronização com os arquivos físicos.

## Ações Técnicas

1. **Sincronização de Arquivos**: Garantir que o ZIP da Extensão 8 esteja no caminho esperado pelo handler unificado.
2. **Padronização de Rotas**: Atualizar `src/routes/extensions.tsx` para usar o handler unificado `/api/public/ext/download/` para todas as extensões, garantindo consistência.
3. **Correção do Handler EXT8**: Atualizar `/api/public/download-extensao` para apontar para o ZIP correto da v17.8.8.
4. **Verificação de Branding**: Garantir que a Extensão 8 não contenha referências ao "LVB" e use o novo banco de dados.

## Detalhes de Implementação

### 1. Atualizar Rotas de Download
Modificar `src/routes/extensions.tsx` para que os métodos `downloadExt7` e `downloadExt8` usem caminhos que o handler unificado consiga encontrar:
- EXT7: `/api/public/ext/download/extensions/ext-07/integrated/ext7_v1786_zip.zip`
- EXT8: `/api/public/ext/download/extensions/ext-08/integrated/ext8_v1788_zip.zip`

### 2. Atualizar Handler de Download Dedicado
Atualizar `src/routes/api/public/download-extensao.ts` para servir o ZIP da EXT8 por padrão, já que é a versão "Ultra" solicitada.

### 3. Ajuste no Seed
Confirmar que `src/factory/seed.ts` reflete as versões corretas para evitar confusão no painel.
