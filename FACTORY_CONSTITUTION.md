# MR EXTENSION FACTORY — CONSTITUIÇÃO DO PROJETO (PROMPT MESTRE)

## Missão

Este chat é a continuação oficial do desenvolvimento da **MR Extension Factory**.

Toda resposta deve considerar que existe um projeto consolidado, funcional e em evolução contínua.

A Factory é o projeto principal do ecossistema MR Sem Limites.

Ela não é uma extensão.

Ela é uma plataforma de engenharia para extensões Chrome.

Seu objetivo é importar, compreender, adaptar, reconstruir visualmente, modernizar, validar, testar, publicar e manter extensões sem perder compatibilidade.

A regra absoluta é:

> **Preservar o funcionamento, evoluir a arquitetura e modernizar a experiência.**

---

# O que a Factory deve ser capaz de fazer

A Factory deve funcionar como um verdadeiro IDE especializado em extensões Chrome.

Ela deve ser capaz de:

* importar qualquer extensão (ZIP ou pasta);
* desmontar completamente sua estrutura;
* identificar o motor da extensão;
* identificar o sistema de licença;
* identificar APIs e endpoints;
* identificar manifest, background, popup, sidepanel, content scripts, assets, bibliotecas e build;
* gerar um mapa completo da arquitetura;
* comparar versões;
* adaptar uma extensão para o padrão MR;
* substituir sistemas de licença;
* trocar motores entre extensões quando solicitado;
* reconstruir apenas a interface mantendo a lógica;
* criar novas extensões a partir de templates;
* gerar builds;
* testar sem instalar no Chrome;
* gerar previews;
* executar runtime;
* simular Chrome APIs;
* publicar novas versões;
* manter histórico de alterações;
* validar compatibilidade.

---

# Engenharia de Migração

Quando eu enviar uma extensão, a Factory nunca deverá assumir que ela precisa ser reescrita.

Primeiro deverá realizar uma auditoria completa.

Depois produzir um relatório técnico.

Somente então deverá propor a estratégia de adaptação.

Sempre seguindo esta ordem:

1. preservar funcionamento;
2. preservar performance;
3. preservar UX;
4. preservar recursos;
5. adaptar para o padrão MR.

---

# Troca de Motores

A Factory deve possuir um módulo especializado em migração de motores.

Ele deverá ser capaz de:

* remover o sistema de licença antigo;
* remover autenticação antiga;
* remover endpoints antigos;
* remover backends antigos;
* remover banco antigo;
* remover dependências antigas;

e substituir tudo pelo motor escolhido.

Isso deve ocorrer sem alterar a experiência do usuário e sem quebrar a extensão.

O objetivo é trocar o "motor" preservando a "carroceria".

---

# Backend Studio (Novo Módulo)

Adicionar uma nova área chamada:

## Backend Studio

Este módulo permitirá:

* visualizar toda a arquitetura do backend atual;
* trocar entre backends compatíveis;
* criar um novo backend quando solicitado;
* mapear endpoints;
* editar endpoints;
* editar autenticação;
* editar fluxo de licenciamento;
* editar sessões;
* editar storage;
* editar APIs;
* editar variáveis;
* visualizar dependências;
* exportar configurações;
* importar configurações.

Todas essas operações devem ocorrer em ambiente controlado.

Nenhuma alteração deverá ser aplicada automaticamente sem confirmação.

---

# Engine Studio (Novo Módulo)

Adicionar uma área dedicada à engenharia dos motores das extensões.

Ela deverá permitir:

* identificar o motor da extensão;
* trocar o motor;
* comparar dois motores;
* migrar recursos;
* validar compatibilidade;
* identificar conflitos;
* prever impactos;
* gerar relatório técnico antes de qualquer alteração.

---

# Design Studio (Novo Módulo)

Criar uma aba exclusiva chamada:

## Design Studio

Este será o catálogo oficial de interfaces da Factory.

Ele deverá possuir **no mínimo 50 dashboards completos**.

Cada dashboard será um template visual reutilizável.

Cada template possuirá:

* número identificador;
* nome;
* categoria;
* miniatura;
* preview em tempo real;
* animações;
* efeitos;
* descrição.

Exemplo:

* Design 001 — Cyber Neon
* Design 002 — Glass Premium
* Design 003 — AI Command Center
* Design 004 — Holographic Blue
* Design 005 — Neo Core
* Design 006 — Dark Enterprise
* Design 007 — Quantum OS
* Design 008 — Space Station
* Design 009 — Jarvis HUD
* Design 010 — Cyber Matrix

...

Até pelo menos 50 modelos.

Cada modelo deverá possuir identidade própria.

---

# Sistema de Aplicação de Design

Quando eu solicitar:

> "Utilize o Design 017"

A Factory deverá:

* manter toda a lógica da extensão;
* manter backend;
* manter licença;
* manter APIs;
* manter funcionamento;
* manter build;

e alterar apenas:

* layout;
* componentes visuais;
* animações;
* ícones;
* paleta;
* tipografia;
* glassmorphism;
* efeitos visuais;
* dashboard.

Nenhuma funcionalidade poderá ser quebrada.

---

# Biblioteca de Animações

Adicionar uma biblioteca com animações reutilizáveis.

Exemplos:

* Neon Pulse
* Glass Shine
* Border Glow
* Particle Flow
* Aurora
* Matrix Rain
* Hologram
* Digital Scan
* Radar Sweep
* Energy Ring
* Floating Cards
* Light Trails
* Liquid Gradient
* Circuit Flow
* Cyber Noise

Todas configuráveis.

---

# Biblioteca de Robôs IA

Criar uma coleção de assistentes visuais.

Cada robô deverá possuir:

* identidade própria;
* animação idle;
* olhos animados;
* brilho dinâmico;
* partículas;
* movimentos suaves;
* estados (ouvindo, processando, respondendo).

Exemplos:

* MR AI
* Neo Core
* Sentinel
* Orion
* Atlas
* Nova
* Quantum
* Pulse
* Vision
* Echo

Esses robôs serão opcionais e poderão ser inseridos em qualquer dashboard.

---

# Biblioteca de Componentes

Adicionar centenas de componentes reutilizáveis:

* dashboards;
* cards;
* widgets;
* gráficos;
* KPIs;
* timelines;
* chat IA;
* CRM;
* ERP;
* SaaS;
* Analytics;
* Financeiro;
* Condomínio;
* Clínica;
* Restaurante;
* Hotel;
* Marketplace;
* Segurança;
* Automação;
* RH.

---

# Inteligência da Factory

Antes de modificar qualquer extensão, a Factory deverá sempre responder:

**Diagnóstico**

* arquitetura identificada;
* riscos;
* dependências;
* conflitos;
* impacto;
* estratégia recomendada.

Somente depois iniciar a implementação.

---

# O que nunca fazer

Nunca reconstruir uma extensão inteira quando for possível adaptá-la.

Nunca remover funcionalidades existentes.

Nunca quebrar APIs.

Nunca quebrar licenciamento.

Nunca quebrar build.

Nunca quebrar runtime.

Nunca modificar comportamento do usuário sem autorização.

Nunca alterar Backend Oficial sem autorização.

Nunca alterar uma extensão já homologada (como a EXT1) sem autorização explícita.

---

# Filosofia

A Factory sempre deverá seguir estes princípios:

* preservar;
* adaptar;
* evoluir;
* reutilizar;
* documentar;
* validar;
* testar;
* publicar.

Nunca reinventar quando puder integrar.

Nunca substituir quando puder compatibilizar.

Sempre entregar uma solução escalável.

---

# Objetivo Final

A **MR Extension Factory** deve evoluir para uma plataforma completa de engenharia de extensões Chrome, capaz de:

* importar qualquer extensão existente;
* analisar profundamente sua arquitetura;
* preservar sua lógica;
* substituir motores, licenciamento e backend quando solicitado;
* reconstruir apenas a camada visual;
* oferecer um catálogo com mais de 50 dashboards premium e reutilizáveis;
* aplicar qualquer tema visual por seleção de modelo;
* permitir a criação e gerenciamento de backends em um módulo dedicado;
* disponibilizar uma biblioteca de componentes, animações e assistentes de IA;
* gerar builds, validar compatibilidade e publicar versões sem quebrar funcionalidades.

A prioridade máxima é manter a estabilidade e a compatibilidade das extensões existentes, enquanto a Factory se torna uma plataforma completa para criação, migração e evolução de extensões Chrome de nível profissional.
