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
  latest_version: '5.4.15',
  download_url:
    'https://mrsemlimitesext.lovable.app/__l5e/assets-v1/3a8f533f-6629-4617-ad11-aa1871d04a07/MR-Sem-Limites-EXT5-v5.4.15.zip',
  notes: [
    'Multi-contas Instagram: conecte várias contas @ e escolha em qual publicar antes de cada post.',
    'Novo botão "➕ Adicionar outra conta" no painel Instagram.',
    'Dropdown "📱 Publicar em:" aparece automaticamente quando há mais de uma conta conectada.',
    'Nenhuma alteração no fluxo de geração de mídia ou publicação — tudo continua funcionando como antes.',
  ],
  hotfix: {
    hotfix_id: '2026-07-22-07',
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
