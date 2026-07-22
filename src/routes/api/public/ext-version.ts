import { createFileRoute } from '@tanstack/react-router'

// Endpoint de "atualização remota" da extensão. A extensão consulta este endpoint
// quando o usuário clica em "Atualizar" no side panel. Aqui devolvemos:
// - latest_version: string (versão mais recente publicada pela fábrica)
// - download_url: link direto do ZIP a instalar
// - notes: notas curtas de atualização
// - hotfix: bloco opcional com ajustes aplicáveis em runtime sem reinstalar
//   (ex.: novos prompts, textos, URLs de backend). A extensão aplica salvando
//   em chrome.storage.local (chave 'mrHotfix') e recarrega o side panel.
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
}

const LATEST = {
  latest_version: '5.4.9',
  download_url:
    'https://mrsemlimitesext.lovable.app/__l5e/assets-v1/94447d9d-fbc1-4568-830e-b0c8c584ea1c/MR-Sem-Limites-EXT5-v5.4.9.zip',
  notes: [
    'Aba IAs agora inclui ElevenLabs e Lovable AI TTS (OpenAI + Gemini) para voz premium.',
    'Novo modo AUTO: a extensão escolhe sempre a melhor IA para o comando pedido.',
    'Acesso rápido reorganizado com atalhos para texto, imagem, vídeo e voz.',
  ],
  // Hotfix aplicado em runtime pela extensão. Incrementar hotfix_id para forçar reaplicação.
  hotfix: {
    hotfix_id: '2026-07-22-03',
    caption_style: 'premium-emoji-viral-video-20s',
    ia_picker_v: 'auto-tts-v1',
  },
}

export const Route = createFileRoute('/api/public/ext-version')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async () => new Response(JSON.stringify(LATEST), { status: 200, headers: cors }),
    },
  },
})
