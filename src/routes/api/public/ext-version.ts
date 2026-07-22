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
  latest_version: '5.4.10',
  download_url:
    'https://mrsemlimitesext.lovable.app/__l5e/assets-v1/d3c90299-7f9e-45bc-80f8-5b0374a12e75/MR-Sem-Limites-EXT5-v5.4.10.zip',
  notes: [
    'Modal de atualização com passo a passo (sem depender do popup do Chrome).',
    'Download automático ao apertar ⟳ quando houver nova versão.',
    'ElevenLabs + Lovable TTS + modo AUTO já embutidos.',
  ],
  // Hotfix aplicado em runtime pela extensão. Incrementar hotfix_id para forçar reaplicação.
  hotfix: {
    hotfix_id: '2026-07-22-04',
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
