
# Lovable Security PRO — Plano de Implementação

Regra de ouro: **camada 100% aditiva**. Nada de código existente é reescrito, renomeado ou removido. Se um módulo de segurança falhar, ele se desliga sozinho e a extensão continua igual.

Escopo: EXT1, EXT2, EXT3, EXT4, EXT6, EXT7. **EXT5 (Manus) fica intocada** — sem arquivos novos lá dentro.

---

## O que muda em cada extensão (arquivos NOVOS apenas)

Dentro de cada pasta de extensão alvo, cria-se um diretório isolado `security/` com módulos independentes:

```
<extensão>/security/
  ├─ integrity.js      # hash SHA-256 dos arquivos críticos, sem bloquear UI
  ├─ tamper-guard.js   # detecta devtools/edição, oculta apenas dados sensíveis
  ├─ secure-client.js  # wrapper HTTPS + assinatura HMAC + validação de resposta
  ├─ logs.js           # buffer local + envio best-effort ao backend
  └─ boot.js           # inicializa tudo em modo "silencioso/tolerante a falha"
```

`boot.js` é carregado ao final do `background.js` / `sidepanel.js` via `try { importScripts('security/boot.js') } catch {}` — se qualquer coisa quebrar, o `catch` engole e a extensão segue.

Nenhum arquivo existente muda de comportamento; só se acrescenta **uma linha guardada por try/catch** no fim de cada entrypoint.

---

## Fases

### FASE 1 — Proteção do código (build de produção)
- Novo script `security/build/harden.mjs` (fora da extensão, no repositório) que, quando invocado por `--mode=prod` no `build.mjs` existente, roda `terser` + `javascript-obfuscator` em cima do `dist/` **já gerado**. O `build.mjs` original **não é editado**; a Factory chama o harden como pós-processo opcional.
- Remove `.map` do `dist/`.
- Modo `dev` fica idêntico ao atual.

### FASE 2 — Integridade
- Em cada extensão, `security/integrity.js` guarda um `manifest.integrity.json` gerado no build com SHA-256 dos arquivos críticos (`background.js`, `sidepanel.js`, `content/*.js`, `lib/*.js`).
- Em runtime, valida on-demand antes de chamar funções protegidas do backend. Se falhar: bloqueia **apenas** a chamada protegida, registra o evento e mostra toast discreto "Integridade comprometida". UI permanece 100%.

### FASE 3 — Motor seguro (backend)
Novas rotas TSS em `src/routes/api/public/`:
- `security-validate-license.ts` — valida licença + HWID + plano
- `security-permissions.ts` — retorna permissões efetivas do usuário
- `security-prompts.ts` — devolve prompts premium sob demanda (não mais embutidos)
- `security-engine-config.ts` — regras/config do motor
- `security-session.ts` — emite/renova token curto (JWT-like assinado com `SECURITY_SIGNING_SECRET`)

Extensões passam a **buscar** esses dados via `secure-client.js`. Os arquivos de prompts/regras existentes **continuam presentes** como fallback local (para não quebrar nada); o cliente só prefere a versão remota quando disponível.

### FASE 4 — Comunicação segura
- `secure-client.js`: HTTPS obrigatório, header `X-MR-Signature` (HMAC-SHA256 do body com token de sessão), header `X-MR-Token`, header `X-MR-License`.
- Servidor valida assinatura; respostas também assinadas (`X-MR-Response-Sig`), cliente descarta se não bater.

### FASE 5 — Anti-engenharia reversa
`tamper-guard.js`: detecta devtools (timing + `debugger` trap leve, sem loop pesado), mudanças em `Function.prototype.toString`, `chrome.runtime.id` alterado. Ao detectar: **não quebra UI**, apenas apaga em memória tokens/prompts sensíveis já carregados e força re-fetch via backend na próxima ação.

### FASE 6 — Área administrativa
- Nova rota `/admin-secure` no painel Factory (separada da `/security` atual, que fica intocada). Autenticação exclusivamente contra `security-admin-login.ts` no backend (Supabase auth já existente). Zero credencial armazenada na extensão.
- Permissões vêm da tabela `admin_permissions` (nova migração com GRANTs + RLS).

### FASE 7 — Atualizações autorizadas
- `security-version.ts` retorna versão mínima permitida + assinatura. `boot.js` compara com `chrome.runtime.getManifest().version`; se local não autorizada, desativa funções protegidas (UI segue).

### FASE 8 — Logs
- `logs.js` bufferiza eventos (`tamper`, `license_fail`, `auth_fail`, `integrity_fail`) e envia em batch para `security-logs.ts`. Falha de rede: descarta silenciosamente.

### FASE 9 — Compatibilidade
- Aplicado em EXT1, 2, 3, 4, 6, 7. EXT5 **não recebe nenhum arquivo novo**.
- Test-matrix: para cada extensão, verificar (a) sidepanel abre, (b) chat funciona, (c) skills executam, (d) console sem novos erros, (e) Anti-Inspeção (EXT7) segue condicional ao LED.

---

## Detalhes técnicos

**Backend (TSS + Lovable Cloud)**
- Todas as rotas em `src/routes/api/public/security-*.ts` com validação Zod + verificação HMAC no handler.
- Segredos: `SECURITY_SIGNING_SECRET` (gerado com `generate_secret`, 64 chars), `SECURITY_ADMIN_JWT_SECRET` (idem).
- Nova migração: tabelas `security_events`, `security_licenses` (se ainda não houver), `admin_permissions`, `extension_versions` — todas com GRANTs corretos + RLS.

**Frontend Factory**
- Rota `/admin-secure` nova. `/security` existente **não é tocada**.

**Extensões**
- Cada entrypoint (`background.js`, `sidepanel.js`) ganha **uma linha no final**:
  ```js
  try { importScripts('security/boot.js'); } catch(_) {}
  ```
  (ou `<script src="security/boot.js" defer>` no HTML, dependendo do contexto). Nada mais é alterado.

**Build**
- `build.mjs` de cada extensão **permanece intacto**. O hardening prod é um passo opcional chamado pela Factory (`src/lib/build-runner.functions.ts`) via flag `--harden`, que roda `security/build/harden.mjs` após o zip.

**Rollback**
- Deletar a pasta `security/` e a linha `importScripts` no fim do entrypoint devolve o estado atual bit-a-bit.

---

## Critérios de aceite verificáveis
1. Diff nos arquivos existentes = **apenas 1 linha adicionada** no fim de cada entrypoint, envolvida em try/catch.
2. `console.log` limpo em cada extensão após instalar (sem novos warnings).
3. Desligar rede → extensão continua funcionando com fallback local (não trava).
4. Modificar 1 byte de `background.js` → chamada protegida bloqueia, UI continua, evento vai pro log.
5. EXT5 sem nenhum arquivo novo.

---

## Ordem de execução proposta
1. Backend: segredos + migração + rotas `security-*` (todas com HMAC).
2. Módulos `security/*.js` em EXT7 (piloto).
3. Validar EXT7 ponta a ponta.
4. Replicar em EXT1, 2, 3, 4, 6.
5. Rota Factory `/admin-secure`.
6. Passo `--harden` opcional no build-runner.

Confirma que posso seguir exatamente por esse caminho (aditivo, EXT5 fora, sem tocar em UI/prompts/motor) que eu começo pela Fase 1+3 backend e depois piloto na EXT7?
