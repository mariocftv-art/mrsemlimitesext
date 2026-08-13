# Plano de Migração: Atualização de Versão para MR Sem Limites v17.8.5 (EXT7)

O usuário solicitou uma atualização da versão da extensão 7, que está travada na 17.7.0 no painel. O objetivo é atualizar toda a numeração para **17.8.5** (seguindo a sequência lógica e as solicitações anteriores) e garantir que a interface reflita essa mudança.

## Alterações Técnicas

### 1. Atualização de Metadados (Seed)
*   Modificar `src/factory/seed.ts` para atualizar a versão da **EXT7** de `17.7.0` para `17.8.5`.
*   Atualizar o nome e a descrição da extensão no seed.
*   Adicionar um novo registro no histórico de versões para a `17.8.5`.

### 2. Atualização da Interface (Frontend)
*   Modificar `src/routes/extensions.tsx` para atualizar o texto do card da Extensão 7 (de `17.7.5` ou `17.7.0` para `17.8.5`).
*   Ajustar a função `downloadExt7` para refletir o novo nome do arquivo ZIP no download (embora o arquivo físico possa permanecer o mesmo, o nome sugerido ao usuário será atualizado).
*   Modificar `src/routes/checkout.tsx` para atualizar a referência da versão no resumo do pedido.

### 3. Sincronização de Backend (Download)
*   Modificar `src/routes/api/public/download-extensao.ts` para atualizar a constante `FILENAME` para a nova versão.

### 4. Manutenção de Arquivos
*   Manter o vínculo com o arquivo ZIP funcional existente (`extensions/ext-07/integrated/ext7_v1775_zip.zip`) para evitar quebras de download, mas rotulá-lo como v17.8.5 na interface conforme solicitado.

## Validação
*   Verificar na página "Minhas Extensões" se a Extensão 7 exibe "17.8.5".
*   Verificar na página de Checkout se o motor aparece como "v17.8.5".
*   Testar o clique no download para garantir que o arquivo é entregue com o nome correto.
