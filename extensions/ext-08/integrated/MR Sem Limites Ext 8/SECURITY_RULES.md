# SECURITY RULES — EXT8 (MR Sem Limites Ext 8)

## Propriedade
Extensão da MR Sem Limites. Distribuição, cópia ou engenharia reversa
não autorizada são proibidas.

## Bloqueio de IA
Ver `.ai-deny`. Nenhuma IA pode desofuscar, reescrever ou reestruturar
os bundles (`background.js`, `content.bundle.js`, `popup.bundle.js`).

## Regras de manutenção
1. **Não misturar com EXT1–EXT7.** A EXT8 tem pasta, manifest, rotas e
   assets próprios. O único ponto em comum é o backend oficial.
2. **Backend único:** `https://mrsemlimitesext.lovable.app`. Nenhum outro
   host pode ser adicionado.
3. **Não alterar UI, prompts, motor, voz ou fluxo de licença.** Ajustes
   permitidos são apenas de backend/segurança.
4. **Camadas aditivas apenas.** `mr-backend-shim.js` e `mr-security-pro.js`
   engolem os próprios erros; se falharem, a extensão continua igual.
5. O ZIP original em `../../original/` nunca pode ser sobrescrito.

## Endpoints autorizados
- `/api/public/validate-license` (GET/POST)
- `/api/public/license-activation`
- `/api/public/license-heartbeat`
- `/api/public/license-deactivate`
- `/api/public/mr-ai-chat`
