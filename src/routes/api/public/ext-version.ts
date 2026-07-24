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
  latest_version: '5.4.19',
  download_url:
    'https://mrsemlimitesext.lovable.app/MR-Sem-Limites-EXT5-v5.4.19.zip',
  notes: [
    'Correção do erro HTTP 402: se os créditos do Gateway falharem, a extensão usa fallback de imagem sem travar.',
    'Imagens agora são fotorrealistas do assunto pedido, sem capa local dourada/bolhas.',
    'Reels aceitam duração de 10 segundos até 10 minutos e montam cenas únicas.',
    'Descrição, título, roteiro, fala e hashtags saem completos mesmo sem crédito de IA.',
  ],
  hotfix: {
    hotfix_id: '2026-07-24-19',
    caption_style: 'premium-real-image-no-credit-fallback',
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
