# EXTENSION_FACTORY_GUIDE.md — Guia da Fábrica

Guia prático para operar a **MR Extension Factory**: como criar novas
extensões, como organizar arquivos, como o Build funciona e como o cadastro
é persistido.

---

## 1. Como criar uma nova extensão

1. Abra **Minhas Extensões** (menu lateral → Fábrica → Minhas Extensões).
2. Clique em **Nova Extensão**.
3. Preencha o assistente (6 etapas):
   1. **Nome** — como aparecerá na loja e no popup.
   2. **Código** — opcional (`EXT2`, `EXT3`...); se vazio, é atribuído automaticamente.
   3. **Logo** — PNG/SVG (opcional).
   4. **Cor** — tom neon do card e realce do sidepanel.
   5. **Descrição** — resumo curto.
   6. **Estrutura** — revisão + confirmação.
4. Ao concluir, a extensão aparece imediatamente no gerenciador com
   status **🟡 Desenvolvimento**.

> Nada de EXT1 é copiado. A extensão nasce **vazia**, isolada.

---

## 2. Organização de arquivos

Cada extensão vive em uma pasta isolada:

```text
extensions/
  ext-01/    (EXT1 — MR Sem Limites, seed)
  ext-02/    (nova extensão criada via Wizard)
    assets/
    icons/
    build/
    docs/
    manifest/
    popup/
    sidepanel/
```

Regras:

- **Nunca** misturar arquivos entre extensões.
- **Nunca** copiar código da EXT1 para outra extensão sem autorização.
- Assets, ícones e sons ficam sempre dentro da pasta da própria extensão.
- `docs/` guarda notas técnicas e changelog local.

> A estrutura física em disco deve ser criada manualmente (ou por script
> dedicado) a partir da CLI. O gerenciador registra os metadados; o
> ambiente do navegador não escreve no filesystem local do projeto.

---

## 3. Como funciona o Build

O Build atual **não foi alterado**. Cada extensão continua com seu próprio
sistema de empacotamento em `extensions/<id>/build/`.

Fluxo padrão:

1. A extensão prepara os arquivos em `integrated/`.
2. O motor de build (por ex. `build.mjs` da EXT1) gera o ZIP.
3. O ZIP fica disponível em `public/` para download.
4. A UI mostra tamanho, SHA-256 e histórico.

Para novas extensões, o Build ficará vazio até que exista fonte compilável.
A página **Build Center** já lista todas as extensões registradas — cada
uma será acionada individualmente quando o motor de build for anexado.

---

## 4. Como funciona o cadastro

- **Fonte de verdade** — `src/factory/storage.ts` (localStorage do navegador).
- **Seed em disco** — `src/factory/seed.ts` (contém a EXT1).
- **Tipos** — `src/factory/types.ts`.
- **Barrel** — sempre importar de `@/factory`.

APIs disponíveis:

```ts
import {
  getAllExtensions,
  getExtensionById,
  createExtension,
  updateExtension,
  archiveExtension,
  restoreExtension,
  duplicateExtension,
  deleteCustomExtension,
  subscribe,          // reatividade (useSyncExternalStore)
  factoryStats,
} from "@/factory";
```

Regras do storage:

- A EXT1 **não pode ser excluída** (protegida como seed).
- Edições em qualquer extensão (inclusive EXT1) ficam salvas como overlay
  no localStorage — a fonte física continua intocada.
- `resetFactoryStore()` limpa apenas o overlay/custom, voltando ao seed.

---

## 5. Status disponíveis

| Ícone | Status         | Uso                                                 |
| ----- | -------------- | --------------------------------------------------- |
| 🟢    | Produção       | Publicada e estável                                 |
| 🟡    | Desenvolvimento| Ainda em construção (padrão para novas extensões)   |
| 🔵    | Testes         | Em validação interna                                |
| ⚪    | Arquivada      | Não aparece nos filtros padrão de trabalho          |

---

## 6. Filtros, busca e ordenação

Na tela **Minhas Extensões**:

- **Filtros**: Todas · Produção · Desenvolvimento · Testes · Arquivadas.
- **Busca**: nome, código (`EXT2`) ou slug.
- **Ordenação**: Última atualização (padrão) · Nome · Versão · Status.

---

## 7. O que NÃO foi alterado

- Nada em `extensions/ext-01/`.
- Nenhum popup, sidepanel, script de licença ou segurança da EXT1.
- Nenhum sistema de build da EXT1.
- Nenhuma conexão com backend, autenticação ou heartbeat.

Se algum destes precisar mudar, será em fase separada e explicitamente aprovada.
