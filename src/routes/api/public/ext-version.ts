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
  latest_version: '5.4.11',
  download_url:
    'https://mrsemlimitesext.lovable.app/__l5e/assets-v1/fe13e8cc-d9aa-4daa-b490-ae293010867b/MR-Sem-Limites-EXT5-v5.4.11.zip',
  notes: [
    'Correção de abertura no Chrome Manifest V3.',
    'Scripts de microfone externalizados para não quebrar a política de segurança.',
    'Modo AUTO mantido para escolher a melhor IA do sistema da extensão.',
  ],
  // Hotfix aplicado em runtime pela extensão. Incrementar hotfix_id para forçar reaplicação.
  hotfix: {
    hotfix_id: '2026-07-22-05',
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
