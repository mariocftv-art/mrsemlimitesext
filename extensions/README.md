# Extensions Workspace — MR MÁXIMA EXTENSIONS

Cada extensão vive em seu próprio diretório isolado. **Arquivos nunca se misturam entre extensões.** Todas compartilham o mesmo backend do projeto.

## Estrutura

```
extensions/
  ext-01/
    original/     ZIP intocado enviado pelo usuário (backup obrigatório, nunca sobrescrever)
    unpacked/     Código-fonte extraído para análise
    report/       Relatório técnico gerado ANTES de qualquer modificação
    integrated/   Versão modificada com integração ao backend
  ext-02/         (aguardando)
  ext-03/         (aguardando)
```

## Regras rígidas

1. **NUNCA modificar arquivos antes do relatório técnico completo.**
2. **NUNCA sobrescrever o ZIP original** em `original/`.
3. Análise obrigatória cobre: estrutura, `manifest.json`, autenticação, comunicação, storage, pontos de proteção, pontos de licença.
4. Modificações vão sempre em `integrated/`, preservando `unpacked/` como referência.
5. Uma extensão por vez. Só avança para a próxima quando a atual estiver 100% aprovada.

## Fluxo por extensão

1. Usuário envia ZIP → salvo em `ext-NN/original/`.
2. Extrair para `ext-NN/unpacked/` (somente leitura).
3. Gerar relatório técnico em `ext-NN/report/`.
4. Aguardar aprovação do relatório.
5. Copiar de `unpacked/` para `integrated/` e integrar ao backend.
6. Testar, corrigir, finalizar.
7. Arquivar. Abrir próxima extensão.
