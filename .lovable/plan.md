# MR MÁXIMA EXTENSIONS — Plano de Construção

Projeto totalmente independente. Backend próprio via **Lovable Cloud** (banco, auth, storage, edge functions). Nenhuma conexão com o projeto "MR Sem Limites".

Este plano cobre a **Fase 0: Fundação** — dashboard premium + backend + schema + API base + estrutura para receber a Extensão 1. As Fases 1–4 (análise e integração de cada extensão) começam somente após você enviar o ZIP da Extensão 1.

---

## 1. Stack e infraestrutura

- Frontend: TanStack Start (já configurado) + Tailwind + shadcn/ui.
- Backend: **Lovable Cloud** (ativar agora) — PostgreSQL + Auth + Storage + Server Functions.
- Design: dark, neon, glass, futurista. Tokens semânticos em `src/styles.css` (sem cores hardcoded).
- Auth: email/senha + Google (padrão Lovable Cloud). Roles via tabela `user_roles` + função `has_role` (admin, staff, cliente).

## 2. Schema do banco (migração inicial)

Todas em `public`, com GRANTs corretos, RLS habilitada e políticas via `has_role`.

- `profiles` (id → auth.users, nome, email, telefone, empresa)
- `app_role` enum ('admin','staff','cliente') + `user_roles`
- `products` (extensões: nome, slug, descrição, categoria, preço, status, ícone, banner)
- `product_versions` (product_id, version, changelog, download_url, mandatory, published_at)
- `customers` (nome, email, telefone, empresa, notes)
- `licenses` (customer_id, tipo: single/multi/all, status, validade, notes)
- `license_products` (licença ↔ produtos permitidos)
- `license_keys` (licença, chave hash, status: active/blocked/cancelled, max_devices, validade)
- `devices` (device_id, license_key_id, so, chrome_version, primeira_ativacao, ultima_sync, status, ativacoes)
- `activations` (license_key_id, device_id, timestamp, ip, resultado)
- `heartbeats` (device_id, timestamp, payload)
- `blacklist` (tipo: device/ip/key, valor, motivo, criado_por)
- `blocks` (license_key_id ou device_id, motivo, criado_por, timestamp)
- `downloads` (product_version_id, customer_id?, device_id?, timestamp, ip)
- `audit_logs` (actor, action, entity, entity_id, diff jsonb, timestamp)
- `api_logs` (endpoint, method, status, latency, key_id?, ip, timestamp)

Storage buckets: `extension-zips` (privado, admin), `extension-assets` (ícones/banners, público read).

## 3. Estrutura de rotas (frontend admin)

Layout `_authenticated` com sidebar premium. Rotas:

```
/auth                       login/signup
/                           dashboard (KPIs, gráficos, logs realtime)
/extensions                 lista de extensões (produtos-extensão)
/extensions/$slug           detalhe + versões + upload ZIP
/products                   catálogo/produtos
/licenses                   licenças + geração de chaves
/licenses/$id               detalhe + histórico + ações (bloquear, renovar, transferir…)
/customers                  clientes + histórico
/customers/$id              perfil completo
/devices                    dispositivos ativos
/activations                log de ativações
/logs                       logs sistema/API em tempo real
/blocks                     bloqueios
/blacklist                  blacklist
/versions                   versões publicadas
/downloads                  downloads
/api                        docs + gerenciamento de API keys
/settings                   configurações gerais
/profile                    perfil do usuário
```

## 4. API pública (server routes `/api/public/*`)

Todos com validação Zod + rate limit + audit log. Autenticação por API key (header `x-api-key`) validada contra tabela de chaves de extensão.

- `POST /api/public/ext/login` — troca chave por token de sessão de dispositivo
- `POST /api/public/ext/validate` — valida chave + device
- `POST /api/public/ext/activate` — primeira ativação (registra device)
- `POST /api/public/ext/heartbeat` — sinal periódico
- `GET  /api/public/ext/version?product=slug` — versão atual + mandatory flag
- `GET  /api/public/ext/update?product=slug&current=x` — info de atualização
- `POST /api/public/ext/renew` — renovação
- `POST /api/public/ext/block` — bloqueio (admin/staff via server fn interno)
- `GET  /api/public/ext/blacklist-check`

Server functions internas (`createServerFn` + `requireSupabaseAuth` + checagem `has_role`):
- gerar/renovar/bloquear/desbloquear/cancelar/mover/transferir/duplicar chaves
- resetar dispositivo, alterar validade
- upload de nova versão (ZIP → storage) + publicação
- CRUD de clientes, produtos, licenças

## 5. Dashboard premium (visual)

Tema dark neon/glass. Tokens em `src/styles.css`:
- Fundo escuro profundo, superfícies com blur/glass, acentos neon (ciano/violeta/magenta configuráveis).
- Cards KPI com gradient + glow, gráficos (recharts), mapa mundial de ativações (simples SVG), stream de logs em tempo real (subscribe realtime da Cloud).
- Sidebar collapsível com ícones lucide, rota ativa destacada.

Home mostra: total extensões, ativas, licenças, clientes, dispositivos, ativações hoje, bloqueios, licenças expirando (7/30 dias), versões publicadas, downloads, gráficos (ativações/dia, downloads/dia), mapa e feed de logs.

## 6. Estrutura para receber extensões

Convenção de pastas:

```
extensions/
  ext-01/
    original/        <- ZIP intocado (backup obrigatório)
    unpacked/        <- código-fonte extraído (somente leitura até análise concluída)
    report/          <- relatório técnico gerado
    integrated/      <- versão modificada com integração ao backend
  ext-02/            (vazio, pronto)
  ext-03/            (vazio, pronto)
```

Regras aplicadas no fluxo:
- ZIP original nunca é sobrescrito.
- Nenhuma modificação antes do relatório técnico completo (estrutura, manifest, auth, comunicação, storage, pontos de proteção/licença).
- Cada extensão em espaço isolado; arquivos nunca se misturam.
- Todas compartilham o mesmo backend deste projeto.

## 7. Segurança / proteção (preparação, sem ofuscação)

Implementado agora: validação online, device lock, heartbeat, tokens (JWT curto por device), assinaturas HMAC de resposta, logs, auditoria, blacklist, rate limit por IP+chave.

Não implementado agora (por sua diretriz): ofuscação/hardening pesado — feito só quando todas as extensões estiverem prontas.

## 8. Critérios de aceite desta fase

- [x] Projeto independente (novo, sem qualquer link com MR Sem Limites)
- [x] Lovable Cloud ativado (backend + banco próprios)
- [x] Auth próprio (email/senha + Google) + roles
- [x] Schema completo (produtos, licenças, chaves, clientes, dispositivos, versões, logs, blacklist)
- [x] Dashboard premium dark/neon/glass com todas as rotas listadas
- [x] API pública `/api/public/ext/*` com endpoints preparados
- [x] Estrutura `extensions/ext-01..03/` pronta para receber ZIPs
- [x] Regras de preservação (backup original, sem modificação pré-análise) documentadas no README de `extensions/`

Após conclusão desta fase, **aguardo o ZIP da Extensão 1** para iniciar a Fase 1 (análise + relatório, sem alterações).

---

## Perguntas rápidas antes de iniciar

1. **Paleta neon**: prefere ciano+violeta, verde+magenta, ou escolho eu?
2. **Login Google** ativado desde já, ou só email/senha nesta fase?
3. **Preço dos produtos**: só campo informativo por enquanto, ou já quer integração de pagamento (Stripe) preparada?
4. **Idioma da UI**: PT-BR em tudo?

Se preferir, respondo "toca ficha" e sigo com defaults sensatos (ciano+violeta, Google ativado, preço só informativo, PT-BR).