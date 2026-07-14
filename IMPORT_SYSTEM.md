# IMPORT_SYSTEM.md — Importador de Extensões

## Objetivo

Permitir importar uma extensão pronta (ZIP ou pasta descompactada) para dentro da MR Extension Factory
**sem alterar, mover, converter, copiar ou gerar build** dos arquivos originais. A operação é
**exclusivamente de leitura e análise**.

## Como funciona

### Entrada
- **ZIP** — arquivo `.zip` selecionado pelo usuário (parseado no navegador via `JSZip`).
- **Pasta** — pasta descompactada, selecionada via `<input type="file" webkitdirectory>`.

Ambos os fluxos produzem uma lista normalizada de arquivos (`path`, `size`, `isDir`) e,
quando existe, o conteúdo textual de `manifest.json`.

### Prefixo comum
Se todos os arquivos compartilham uma pasta-raiz (ex.: `minha-ext/…`), o prefixo é
removido para exibir caminhos limpos. `manifest.json` na raiz nunca é escondido.

### Parse do manifest
Comentários `//` e `/* */` são tolerados antes do `JSON.parse`. Se o parse falhar, uma
verificação `missing` é registrada com a mensagem do erro.

### Classificação automática
- **Popup** — `action.default_popup` do manifest ou `*popup*.html`.
- **Sidepanel** — `side_panel.default_path` ou `*sidepanel*/*side_panel*.html`.
- **Background** — `background.service_worker` / `background.scripts` ou `*background*.js`.
- **Content Scripts** — `content_scripts[].js/css` ou `*content-script*.js`.
- **Ícones** — `icon*.(png|jpg|svg|webp)` + `manifest.icons`.
- **Assets** — todas as imagens (`png|jpg|jpeg|svg|webp|gif|ico`).
- **HTML / JS / CSS** — contagem por extensão.
- **Permissões / host_permissions / commands / web_accessible_resources** — lidos do manifest.

### Verificações e nota
Cada verificação é `ok`, `warn` ou `missing`. A nota final é a média ponderada:
`ok = 1`, `warn = 0.5`, `missing = 0`. Faixas:

| Nota      | Rótulo                     |
| --------- | -------------------------- |
| ≥ 90      | Estrutura Excelente        |
| ≥ 75      | Estrutura Boa              |
| ≥ 60      | Necessita adaptação        |
| ≥ 40      | Adaptação significativa    |
| < 40      | Estrutura incompatível     |

Avisos comuns:
- ⚠ **Manifest V2** — obsoleto no Chrome (usar MV3).
- ⚠ **Permissões incomuns** — `debugger`, `proxy`, `management`, etc.
- ⚠ **Host permissions amplas** — `<all_urls>` ou `*://*/*`.
- ⚠ **Arquivos ausentes** — popup / sidepanel / background não declarados.

## Criar Projeto

Ao clicar em **Criar Projeto**, a Factory:

1. Chama `createExtension()` (numera automaticamente EXT2, EXT3, EXT4…).
2. Registra:
   - Nome (do manifest ou nome do arquivo)
   - Versão (do manifest, senão `0.1.0`)
   - Descrição (do manifest ou automática)
   - Manifest analisado (`manifest_version`, `permissions`, `host_permissions`, flags de popup/sidepanel/background/content-scripts)
   - Nota, contagem e tamanho registrados em `notes`
   - Status inicial: `development`

**Nenhum arquivo da extensão importada é copiado, movido ou modificado.**
A extensão original permanece exatamente onde foi selecionada.

## Preparação para fases futuras

A partir do cadastro criado, próximas fases poderão:

- **Fase de adaptação** — copiar arquivos para `extensions/<id>/`, ajustar `manifest.json`
  para o padrão da Factory, ofuscar/minificar.
- **Fase de licença** — plugar o SDK de licença compartilhado no `background` detectado.
- **Fase de build** — reempacotar em ZIP versionado, com histórico em `builds[]`.
- **Fase de publicação** — envio ao Chrome Web Store.

Esta fase deixa o cadastro **pronto para adaptação**, sem alterar nada da extensão de origem.

## Arquitetura

```
src/factory/importer.ts          # analisador puro (ZIP + pasta)
src/factory/importer-dialog.tsx  # UI do dialog + relatório + Criar Projeto
src/routes/extensions.tsx        # botão "Importar Extensão"
```

Sem chamadas HTTP. Sem backend. Sem banco. Sem Chrome APIs.
Tudo executa no navegador do usuário.
