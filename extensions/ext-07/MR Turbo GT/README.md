# MR Turbo GT (EXT7) — v7.1.0

Extensão premium unificando o melhor das EXT1/2/3/5/6 (sem a Orbe).

## v7.1.0
- Cockpit Sliding Dock arrastável, nasce perto da seta de envio do Ask Lovable.
- LED sólido: vermelho inativo, verde quando o Ask Lovable está armado.
- Instagram corrigido: sintaxe do módulo, geração real de imagem/Reel, preview sincronizado e upload direto do MP4.

## Motor
- **Chassi:** EXT3 (CSP fechado, Painel Remoto seguro)
- **Carroceria:** EXT6 (HOLO GRID — glass/neon cyan-violeta-magenta)
- **Motor V12:** EXT5 (Instagram Graph API + Lovable AI Gateway + 50 Skills)
- **Backend:** mesmo das EXT5/EXT6 (chave/licença única MR Sem Limites)

## 50 Skills profissionais
Build (7), UI (6), Backend (6), Growth (4), Fix (4), Content (4), Automação/n8n/WhatsApp (11), IA/Agents (8).

Destaques:
- **n8n:** Setup completo, Atendimento WhatsApp 24/7, Leads Instagram → CRM,
  Agendador Google Calendar, Relatório Diário, ERP↔E-commerce, Pipeline
  de Conteúdo multi-plataforma.
- **WhatsApp:** Cloud API direto, Broadcast por Template, Orçamento
  Automático.
- **IA:** Chatbot streaming, RAG, Agente com tools, Gerador de Imagens,
  Resumo de Vídeos, Qualificador de Leads BANT, Code Review, TTS.

## Segurança — Anti-Inspeção (F12)
- Detecta abertura de DevTools (F12, Ctrl+Shift+I/J, Ctrl+U, resize).
- Overlay **VERMELHO** com "⚠ VIOLAÇÃO DE EXTENSÃO".
- Se o usuário fechar o DevTools, o alerta some.
- Se persistir, inicia **contagem regressiva de 60s**.
- Ao zerar: extensão bloqueada, sessão limpa, painel MR Sem Limites
  notificado em `/api/public/security-alert`.

## Instalação
1. Baixe o ZIP no painel `/extensions`.
2. Descompacte.
3. `chrome://extensions` → **Modo desenvolvedor** → **Carregar sem
   empacotar** → selecione a pasta.
