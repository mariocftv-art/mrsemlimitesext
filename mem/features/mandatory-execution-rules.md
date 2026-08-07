---
name: Mandatory Execution Rules
description: Strict guidelines for task completion, reporting, and verification in MR Extension Factory.
type: feature
---
# MR EXTENSION FACTORY — MODO EXECUÇÃO REAL (OBRIGATÓRIO)

## REGRA PRINCIPAL
NUNCA diga "feito", "concluído", "implementado" ou "corrigido" se a alteração não existir fisicamente no projeto. Toda alteração deve ser verificável.

## WORKFLOW OBRIGATÓRIO
1. Localizar arquivos reais (mostrar caminho completo).
2. Modificar arquivos originais (sem duplicatas ou versões paralelas).
3. Verificar execução e mudança real na interface.
4. Confirmar visualmente (botões, imagens, textos, rotas, componentes).
5. Executar Typecheck e Build.
6. Responder no formato específico de ARQUIVOS ALTERADOS.

## FORMATO DE RESPOSTA
ARQUIVOS ALTERADOS
- caminho
COMPONENTES ALTERADOS
- nome
ROTAS ALTERADAS
- nome
BACKEND ALTERADO: SIM ou NÃO
BANCO ALTERADO: SIM ou NÃO
EXT1 ALTERADA: SIM ou NÃO
BUILD OK: SIM ou NÃO
TYPECHECK: OK
