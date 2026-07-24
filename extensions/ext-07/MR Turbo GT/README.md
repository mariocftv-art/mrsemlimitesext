# MR Sem Limites — Reformulada 2.1

Central premium de produtividade, animações, componentes, prompts e ferramentas
dentro de uma extensão Chrome (MV3).

> **Rebrand:** nome exibido "MR Sem Limites". Pacote (ZIP): `MR Sem Limites Reformulada 2.1`.

## O que há de novo na 2.1

- Nova navegação por abas: **Home · Chat · Animações · Componentes · Prompts · Ferramentas**
- **Home Dashboard** com status de licença, dias restantes, versão, atalhos rápidos, últimas conversas, favoritos, novidades.
- **Biblioteca de Animações** (36 efeitos) com preview visual, categoria, busca e botão *Usar* que copia um prompt estruturado direto no chat.
- **Biblioteca de Componentes** (18 blocos) com botões *Usar* e *Copiar Prompt*.
- **Prompts Premium** organizados por categoria, com busca, favoritar, copiar e usar.
- **Ferramentas embutidas**: gerador de cores, gradientes, ícones (lucide), fontes, conversor px↔rem, regex tester, JSON formatter, UUID v4, Lorem Ipsum.
- Visual glassmorphism/neon, animações suaves, layout mais rápido e limpo.

## O que continua **exatamente igual**

- Sistema de licença (`lib/license.js`, `background.js`)
- Autenticação e captura de token
- Comunicação com o backend
- Envio de mensagens no chat (fluxo completo: quick actions, otimizar, anexos, mic, publish, download)
- Content scripts (`content/inject.js`, `content/content.js`)
- Service worker (`background.js`) — apenas whitelist de auto-check foi ampliada para aceitar o novo nome do manifest.
- Timers, storage, sessão, `hide-element.js`, `remote-ui.js`.

O botão *Usar* das novas abas **apenas preenche** o textarea do chat (`#message`). O usuário mantém o controle de quando enviar — o envio segue exatamente pelo mesmo botão *Send* e mesmo pipeline da versão anterior.

## Estrutura

```
MR Sem Limites Reformulada 2.1/
├── manifest.json                 (rebrand + versão 2.1.0)
├── background.js                 (whitelist expandida)
├── sidepanel.html                (novas abas + panels; chat existente preservado)
├── sidepanel.js                  (INALTERADO)
├── popup.html/.js                (INALTERADO)
├── content/…                     (INALTERADO)
├── lib/…                         (INALTERADO)
├── ui/
│   └── sidepanel-ui.js           (NOVO — módulo ES das abas 2.1)
├── data/
│   ├── animations.js             (NOVO — 36 animações)
│   ├── components.js             (NOVO — 18 componentes)
│   └── prompts.js                (NOVO — prompts premium)
├── config/ adapters/ interfaces/ (base p/ Fase 2B — já pronta)
└── docs/                         (BACKEND_INTEGRATION, API_CONTRACTS, EXTENSION_STRUCTURE)
```

## Instalação (dev)

1. `chrome://extensions` → Modo desenvolvedor
2. **Carregar sem empacotar** → selecionar esta pasta
