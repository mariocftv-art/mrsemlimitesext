# COMPATIBILITY_CENTER.md — Centro de Compatibilidade

## Objetivo

Comparar cada extensão gerenciada pela Factory (ou uma ZIP/pasta avulsa) contra o
**Padrão da Factory** e apontar exatamente o que precisa ser adaptado — **sem alterar
nenhum arquivo** e sem tocar em backend, licença, build ou segurança.

## Como funciona

### Dois modos de análise

1. **Por cadastro (rápido)** — usa a extensão selecionada em "Minhas Extensões".
   Compara apenas metadados (`manifest`, `assets`, `versão`).
2. **Comparação profunda** — o usuário sobe um ZIP ou pasta pela barra de ações.
   Reaproveita o analisador do Importador (`src/factory/importer.ts`) e adiciona:
   - Arquivos existentes / ausentes / extras
   - Estrutura de pastas
   - Contagem e tamanho por tipo

Nos dois modos, **nada é escrito em disco, nada é convertido, nada é enviado a
backend**. Tudo executa no navegador.

### Padrão da Factory

Definido em `FACTORY_STANDARD` (`src/factory/compat.ts`):

| Item                    | Valor                                                                 |
| ----------------------- | --------------------------------------------------------------------- |
| Manifest Version        | 3                                                                     |
| Arquivos obrigatórios   | `manifest.json`, `popup.html`, `sidepanel.html`, `background.js`, `assets/icon16.png`, `assets/icon48.png`, `assets/icon128.png` |
| Pastas recomendadas     | `assets`, `assets/icons`, `content`, `styles`                         |
| Permissões mínimas      | `storage`                                                             |
| Permissões desencorajadas | `debugger`, `proxy`, `management`, `privacy`                        |
| Host permissions amplas | `<all_urls>`, `*://*/*` (desencorajadas)                              |

### Verificações e categorias

Cada verificação tem categoria (`manifest`, `structure`, `assets`, `permissions`,
`meta`) e um status:

| Status  | Peso | Significado                              |
| ------- | ---- | ---------------------------------------- |
| 🟢 ok   | 1.0  | Alinhado ao padrão                       |
| 🟡 warn | 0.5  | Requer adaptação                         |
| 🔴 bad  | 0.0  | Incompatível com o padrão                |

### Score global

`score = round(soma(pesos) / totalChecks * 100)`

| Faixa   | Rótulo                     | Cor    |
| ------- | -------------------------- | ------ |
| ≥ 95    | Compatibilidade Excelente  | 🟢     |
| ≥ 80    | Alta Compatibilidade       | 🟢     |
| ≥ 60    | Requer adaptação           | 🟡     |
| ≥ 40    | Adaptação significativa    | 🔴     |
| < 40    | Incompatível               | 🔴     |

## Abas

- **Visão geral** — verificações agrupadas por categoria + estatísticas (arquivos/ausentes/extras/pastas).
- **Diferenças** — tabela `Item · Factory · Extensão · Status`.
- **Sugestões** — lista objetiva do que ajustar (gerada a partir dos `warn`/`bad`).
- **Preparação** — passos ordenados que serão executados na fase de adaptação (futura).
- **Arquivos** (só em comparação profunda) — Existentes · Ausentes · Extras.

## Exportar Relatório

- **JSON** — dump completo do `CompatReport` (arquivo `<CODE>-compat.json`).
- **Markdown** — relatório formatado (tabela de checks + sugestões + preparação).
- **PDF** — botão presente, marcado como *Em breve* (estrutura de exportação já pronta;
  a geração binária virá em fase futura para não puxar dependência de PDF agora).

## Interpretando o score

- **≥ 95%** — pronta para as próximas fases sem retrabalho.
- **80–94%** — pequenos ajustes: ícones faltantes, permissões extras, banner.
- **60–79%** — falta popup **ou** sidepanel **ou** background alinhado ao padrão.
- **< 60%** — Manifest V2, estrutura muito diferente ou arquivos essenciais ausentes.
  Marcar como *"Requer refatoração"* antes de qualquer adaptação.

## Preparando uma extensão para adaptação

1. Rode a **Comparação profunda** com o ZIP original.
2. Baixe o relatório em **Markdown** para arquivar como *baseline*.
3. Verifique a aba **Preparação** — cada item vira uma tarefa futura.
4. Não altere a extensão original: o Centro de Compatibilidade é apenas o mapa;
   a adaptação será feita numa fase dedicada, controlada e reversível.

## Arquitetura

```
src/factory/compat.ts        # padrão + comparadores + exportadores
src/routes/compatibility.tsx # UI (score, abas, upload ZIP/pasta, exports)
```

Sem chamadas HTTP. Sem backend. Sem banco. Sem Chrome APIs.
Nenhum arquivo da extensão é modificado, movido ou copiado.
