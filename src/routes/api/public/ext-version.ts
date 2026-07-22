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
  latest_version: '5.4.8',
  download_url:
    'https://mrsemlimitesext.lovable.app/__l5e/assets-v1/b46b531c-b2c1-44a6-a2ae-e5ecc1dbcf91/MR-Sem-Limites-EXT5-v5.4.8.zip',
  notes: [
    'Imagem convertida obrigatoriamente para JPEG antes da publicação.',
    'Reels agora exigem no mínimo 20s, com roteiro, fala/locução e trilha configurável.',
    'Prévia grande ampliada para vídeo vertical e post.',
  ],
  // Hotfix aplicado em runtime pela extensão. Incrementar hotfix_id para forçar reaplicação.
  hotfix: {
    hotfix_id: '2026-07-22-02',
    caption_style: 'premium-emoji-viral-video-20s',
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
