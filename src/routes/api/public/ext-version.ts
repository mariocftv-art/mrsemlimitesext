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
  latest_version: '5.4.18',
  download_url:
    'https://mrsemlimitesext.lovable.app/__l5e/assets-v1/73202dab-08c5-4145-8179-eae18914223a/MR-Sem-Limites-EXT5-v5.4.17.zip',
  notes: [
    'Correção do gerador: agora a aba Instagram chama a IA real de imagem, sem usar a capa local dourada de fallback.',
    'Reels passam a montar o vídeo com cenas únicas vindas da IA, com variação obrigatória a cada geração.',
    'O botão Regerar força nova composição e bloqueia fundos abstratos/bolhas quando o assunto pede foto real.',
    'Descrição, título, roteiro, fala e hashtags continuam profissionais e completos.',
  ],
  hotfix: {
    hotfix_id: '2026-07-23-18',
    caption_style: 'premium-real-image-no-local-poster',
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
