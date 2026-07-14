# FACTORY_MASTER.md — MR Extension Factory

Documento mestre da arquitetura. Este projeto passa a ser exclusivamente
uma **fábrica profissional de extensões Chrome**.

> Não conecta a backend, não valida licença, não faz auth, não faz
> heartbeat, não faz pagamento. Estrutura pura.

---

## 1. Visão geral

A Factory gerencia **N extensões independentes**. Cada extensão é
totalmente isolada — arquivos, assets, manifest, builds e histórico.

Exemplos de slots:

- `ext-01` — MR Sem Limites (EXT1)
- `ext-02` — MR Cursor (EXT2)
- `ext-03` — MR Bolt (EXT3)
- `ext-04` — MR Claude (EXT4)
- `ext-05` — MR Gemini (EXT5)

Adicionar uma nova extensão = criar `extensions/ext-NN/` + registrar em
`src/factory/registry.ts`. Nada mais precisa mudar.

---

## 2. Estrutura de pastas

```text
extensions/
  ext-01/
    original/       ZIP intocado (backup obrigatório)
    unpacked/       fonte original extraída (read-only)
    report/         relatório técnico
    integrated/     versão modificada com integrações
  ext-02/           (slot preparado)
  ext-03/           (slot preparado)

src/factory/
  types.ts          tipos canônicos (ExtensionRecord, BuildHistoryEntry, ...)
  registry.ts       lista + lookup + estatísticas
  assets.ts         catálogo de assets (logos, banners, ícones, sons)
  index.ts          barrel — sempre importar daqui

src/routes/        páginas da Factory
  index.tsx          Dashboard
  extensions.tsx     Minhas Extensões (build por extensão)
  editor.tsx         Editor
  build-center.tsx   Build Center
  downloads.tsx      Downloads
  versions.tsx       Versões
  assets.tsx         Assets
  animations.tsx     Animações
  components.tsx     Componentes
  prompts.tsx        Prompts Premium
  tools.tsx          Ferramentas
  security.tsx       Segurança
  settings.tsx       Configurações
  profile.tsx        Perfil
```

---

## 3. Módulos

| Módulo             | Rota              | Responsabilidade                                   |
| ------------------ | ----------------- | -------------------------------------------------- |
| Dashboard          | `/`               | KPIs + últimas builds + status                     |
| Minhas Extensões   | `/extensions`     | Lista, build individual, download ZIP              |
| Editor             | `/editor`         | Metadados, manifest, popup, sidepanel              |
| Build Center       | `/build-center`   | Empacotamento centralizado                         |
| Downloads          | `/downloads`      | Pacotes disponíveis                                |
| Versões            | `/versions`       | Histórico, changelog, rollback (estrutura)         |
| Assets             | `/assets`         | Logos, banners, ícones, imagens, sons              |
| Animações          | `/animations`     | Lottie / CSS reutilizáveis                         |
| Componentes        | `/components`     | UI compartilhável entre extensões                  |
| Prompts Premium    | `/prompts`        | Banco de prompts por extensão                      |
| Ferramentas        | `/tools`          | Utilitários: validação, checksum, diff             |
| Segurança          | `/security`       | Regras da Factory (não afeta segurança da EXT)     |
| Configurações      | `/settings`       | Preferências globais                               |

---

## 4. Contrato de uma extensão

Definido em `src/factory/types.ts`:

```ts
ExtensionRecord {
  id, slug, code, name, description, version, status, tone,
  sourceDir, packagedZip?, assets, manifest,
  builds[], versions[], createdAt, updatedAt
}
```

Cada extensão possui:

- **Identidade** — id, code, name, description, version, tone
- **Assets** — logo, banner, ícones (16/48/128), screenshots
- **Manifest** — versão, permissions, hosts, capacidades (popup, sidepanel, ...)
- **Build** — histórico com id, versão, tamanho, sha256, notas
- **Versões** — changelog estruturado por release

---

## 5. Regras invioláveis

1. **Não conectar backend.** A Factory é 100% local nesta fase.
2. **Extensões nunca se misturam.** Arquivos por slot, sem exceção.
3. **EXT1 permanece intocada** — popup, sidepanel, licença, segurança e
   build da extensão continuam idênticos.
4. **Adição de nova extensão** só via `extensions/ext-NN/` + registro em
   `src/factory/registry.ts`.
5. Toda página consome dados via `@/factory` (barrel) — nunca acessa
   arquivos de extensão diretamente.

---

## 6. Próximas fases (fora do escopo desta)

- Integração real com backend compartilhado
- Upload de assets
- Editor visual funcional
- Rollback de versões
- Publicação em Web Store

Nada disso está implementado agora. Estrutura pronta para receber.
