import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/instagram-preview')({
  head: () => ({
    meta: [
      { title: 'Prévia Instagram — MR Sem Limites' },
      { name: 'description', content: 'Prévia grande do post/reel gerado pela EXT5 antes de publicar no Instagram.' },
      { property: 'og:title', content: 'Prévia Instagram — MR Sem Limites' },
      { property: 'og:description', content: 'Revise mídia, título, legenda e hashtags antes de publicar.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: InstagramPreviewPage,
})

function useQuery() {
  return useMemo(() => {
    if (typeof window === 'undefined') return {} as Record<string, string>
    const sp = new URLSearchParams(window.location.search)
    const out: Record<string, string> = {}
    sp.forEach((v, k) => { out[k] = v })
    return out
  }, [])
}

function InstagramPreviewPage() {
  const q = useQuery()
  const media = q.media || ''
  const type = (q.type || 'post').toLowerCase()
  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(media) || type === 'reel'
  const [title, setTitle] = useState(q.title || '')
  const [caption, setCaption] = useState(q.caption || '')
  const [copied, setCopied] = useState<string>('')

  const fullText = [title, caption].filter(Boolean).join('\n\n')

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(''), 1600)
    } catch {}
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-serif text-amber-400">Prévia indisponível</h1>
          <p className="text-neutral-400 text-sm">
            Abra esta página a partir da extensão MR Sem Limites depois de clicar em <b>Gerar</b>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-neutral-100">
      <header className="border-b border-amber-500/20 bg-black/40 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-serif text-amber-400 tracking-wide">Prévia Instagram</h1>
            <p className="text-xs text-neutral-400">Revise antes de publicar pela extensão</p>
          </div>
          <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
            {type === 'reel' ? 'Reel' : type === 'carousel' ? 'Carrossel' : 'Post'}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8">
        <section className="space-y-3">
          <div className="rounded-2xl overflow-hidden bg-black border border-amber-500/20 shadow-2xl shadow-amber-900/20">
            {isVideo ? (
              <video
                src={media}
                controls
                autoPlay
                loop
                playsInline
                className="w-full block bg-black"
                style={{ maxHeight: '82vh', objectFit: 'contain' }}
              />
            ) : (
              <img
                src={media}
                alt="Prévia da mídia gerada"
                className="w-full block"
                style={{ maxHeight: '82vh', objectFit: 'contain' }}
              />
            )}
          </div>
          <div className="flex gap-2">
            <a
              href={media}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center text-sm py-2 rounded-lg border border-neutral-700 hover:border-amber-500/50 text-neutral-200 hover:text-amber-300 transition"
            >
              Abrir mídia original
            </a>
            <button
              onClick={() => copy(media, 'link')}
              className="flex-1 text-sm py-2 rounded-lg border border-neutral-700 hover:border-amber-500/50 text-neutral-200 hover:text-amber-300 transition"
            >
              {copied === 'link' ? '✓ Copiado' : 'Copiar link da mídia'}
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-amber-400/80">Título / gancho</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-black/60 border border-neutral-800 focus:border-amber-500/60 outline-none text-neutral-100"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-amber-400/80">Legenda + hashtags</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={16}
              className="mt-1 w-full px-3 py-3 rounded-lg bg-black/60 border border-neutral-800 focus:border-amber-500/60 outline-none text-neutral-100 text-[15px] leading-relaxed resize-vertical"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => copy(fullText, 'texto')}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-medium transition"
            >
              {copied === 'texto' ? '✓ Legenda copiada' : 'Copiar título + legenda'}
            </button>
            <button
              onClick={() => copy(caption, 'legenda')}
              className="px-4 py-2 rounded-lg border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 transition"
            >
              {copied === 'legenda' ? '✓ Copiado' : 'Só a legenda'}
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100/80">
            <b className="text-amber-300">Como publicar:</b> volte para a extensão MR Sem Limites, cole aqui qualquer ajuste que fizer nesta tela (se editou o texto) e clique em <b>Publicar</b> na aba Instagram. A publicação real acontece pela extensão porque é lá que fica sua conta autenticada.
          </div>
        </section>
      </main>

    </div>
  )
}
