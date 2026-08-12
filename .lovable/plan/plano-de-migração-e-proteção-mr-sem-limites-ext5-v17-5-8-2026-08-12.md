# Plano de Migração e Proteção - MR Sem Limites EXT5 v17.5.8

## Objetivo
Sincronizar a **Extensão 5** com o novo banco de dados e backend extraídos do `master-2.zip`, mantendo o motor v17.0 (Castler/Infinito) intacto. Aplicar ofuscação e proteção de código conforme solicitado.

## Etapas Técnicas

### 1. Sincronização de Backend (Supabase/Functions)
- **Migrações:** Aplicar as novas migrações de `master-2.zip` no banco de dados local.
- **Endpoints:** Atualizar `src/routes/api/public/ext/functions.v1.validate-license-v2.ts` para suportar o novo formato de chaves (GPRVN-...) e garantir a compatibilidade com a `licencas-service.ts` atualizada.

### 2. Sanitização e Rebranding da EXT5 (v17.5.8)
- **Manifest:** Atualizar versão para `17.5.8`.
- **UI (sidepanel-templates.js):** Garantir que "MR Sem Limites PRO" seja a única marca visível.
- **Strings Ofuscadas:** Remover qualquer resíduo de "Lovable" ou "LVB" que possa ter retornado nos arquivos do zip.

### 3. Ofuscação e Proteção
- **Camada de Ofuscação:** Aplicar técnica de codificação de strings e inserção de código morto em `lv-core.js` e `sidepanel.js` para dificultar a engenharia reversa sem quebrar a lógica do motor.
- **Integridade:** Adicionar verificação de assinatura básica no carregamento do painel lateral.

### 4. Build e Distribuição
- **ZIP:** Gerar `public/ext5_v1758_zip.zip`.
- **Metadata:** Atualizar `src/factory/seed.ts` e `src/routes/extensions.tsx`.

## Verificação
- Testar ativação com a chave `GPRVN-4RVBW-7ZLGL-FHPK5`.
- Validar se o motor Castler (bypass de créditos) permanece ativo no `Real Test`.