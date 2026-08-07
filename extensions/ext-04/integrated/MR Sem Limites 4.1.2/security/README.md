# MR Sem Limites — Segurança e Proteção (Fase 3.1)

Toda a estrutura é **dormente**. Nada é executado enquanto
`PROTECTION_MODE = 'off'` em `security/protection.js`.

## Modos

| Modo | Efeito |
|------|--------|
| `off` (atual) | Nenhuma verificação. Comportamento inalterado. |
| `report` | Roda `runIntegrityCheck`, apenas registra os problemas. Não bloqueia. |
| `enforce` | Além de reportar, dispara `enforceTamperResponse` → limpa licença, limpa `chrome.storage.local`, sinaliza `MRSL_TAMPER_DETECTED`. |

Só será alterado para `report`/`enforce` quando o usuário disser
**"ATIVAR BUILD FINAL"**.

## Builds

```bash
# desenvolvimento — código legível, sem obfuscação
npm run build:dev

# produção — Terser + javascript-obfuscator + integrity map
npm run build:prod
```

Ambos gravam:
- `dist/MR Sem Limites EXT1/`   (carregável como "unpacked")
- `dist/MR Sem Limites EXT1.zip`

## O que cada mecanismo cobre

1. **Obfuscação/minificação (prod)** — `terser` remove comentários, encurta nomes;
   `javascript-obfuscator` reescreve strings/identificadores. Reservados
   `chrome` e `browser` para não quebrar APIs MV3.
2. **Integrity map** — o build calcula SHA-256 de todos os arquivos e grava
   `security/integrity.map.json`. `runIntegrityCheck` recalcula em runtime.
3. **Detecção de adulteração** — cobre: arquivo alterado, arquivo removido,
   manifest sem MV3, `mrsl_namespace` ausente, ausência de módulos críticos
   (licença, HWID em `background.js`, content-script, sidepanel).
4. **Resposta a adulteração (enforce)** — `clearLicense()` + `chrome.storage.local.clear()` + broadcast.
5. **Telemetria futura** — `TAMPER_REPORT_ENDPOINT` reservado para a Fase 3.x
   (backend). Enquanto `null`, nada é enviado.

## O que **não** foi alterado

- Nenhum arquivo de runtime existente foi modificado.
- Chat, licença, HWID, uploads, prompts, sons, autenticação, background,
  content scripts e comunicação com o painel permanecem intactos.
- Manifest permanece MV3 sem novas permissões.
