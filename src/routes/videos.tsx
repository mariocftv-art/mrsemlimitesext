import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Upload, Play, Pause, Volume2, VolumeX, Maximize2, Download,
  Sparkles, FileAudio, Image as ImageIcon, Loader2, Scissors, Film,
} from "lucide-react";

export const Route = createFileRoute("/videos")({
  component: VideosPage,
  head: () => ({
    meta: [
      { title: "Vídeos IA · MR Sem Limites" },
      { name: "description", content: "Suite completa de vídeo com IA: geração por keyframes, player custom com timeline, transcrição Whisper e thumbnails automáticos." },
      { property: "og:title", content: "Vídeos IA · MR Sem Limites" },
      { property: "og:description", content: "Gere, edite e transcreva vídeos com IA — tudo em um só painel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Thumb = { time: number; url: string };
type Segment = { start?: number; end?: number; text: string };

const ASPECTS: Array<{ id: "16:9" | "9:16" | "1:1"; label: string; w: number; h: number }> = [
  { id: "16:9", label: "16:9 Widescreen", w: 1280, h: 720 },
  { id: "9:16", label: "9:16 Reels", w: 720, h: 1280 },
  { id: "1:1", label: "1:1 Square", w: 900, h: 900 },
];

function fmt(t: number) {
  if (!Number.isFinite(t)) return "0:00";
  const s = Math.max(0, Math.floor(t));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function VideosPage() {
  const [tab, setTab] = useState<"upload" | "generate">("upload");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>("");
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [thumbing, setThumbing] = useState(false);

  const [transcript, setTranscript] = useState<string>("");
  const [segments, setSegments] = useState<Segment[]>([]);
  const [transcribing, setTranscribing] = useState(false);

  // Gerador
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [frames, setFrames] = useState(5);
  const [durationS, setDurationS] = useState(8);
  const [genStatus, setGenStatus] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }, [videoUrl]);

  const loadVideo = useCallback((blob: Blob, name = "video.mp4") => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(blob);
    setVideoUrl(url);
    setVideoBlob(blob);
    setVideoName(name);
    setThumbs([]);
    setTranscript("");
    setSegments([]);
  }, [videoUrl]);

  const onFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) { toast.error("Envie um arquivo de vídeo"); return; }
    loadVideo(f, f.name);
    toast.success(`Vídeo carregado: ${f.name}`);
  };

  // Extrai N thumbnails via <video> off-DOM + canvas
  const generateThumbs = useCallback(async () => {
    if (!videoUrl) return;
    setThumbing(true);
    try {
      const v = document.createElement("video");
      v.crossOrigin = "anonymous";
      v.src = videoUrl;
      v.muted = true;
      v.playsInline = true;
      await new Promise<void>((res, rej) => {
        v.onloadedmetadata = () => res();
        v.onerror = () => rej(new Error("Falha ao carregar vídeo"));
      });
      const d = v.duration;
      const n = 8;
      const canvas = document.createElement("canvas");
      const scale = 160 / v.videoWidth;
      canvas.width = 160;
      canvas.height = Math.round(v.videoHeight * scale);
      const ctx = canvas.getContext("2d")!;
      const out: Thumb[] = [];
      for (let i = 0; i < n; i++) {
        const t = (d * (i + 0.5)) / n;
        await new Promise<void>((res) => {
          const onSeeked = () => { v.removeEventListener("seeked", onSeeked); res(); };
          v.addEventListener("seeked", onSeeked);
          v.currentTime = Math.min(t, Math.max(0, d - 0.05));
        });
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        out.push({ time: t, url: canvas.toDataURL("image/jpeg", 0.7) });
      }
      setThumbs(out);
      toast.success("Thumbnails gerados");
    } catch (e: any) {
      toast.error(e?.message || "Erro ao gerar thumbnails");
    } finally {
      setThumbing(false);
    }
  }, [videoUrl]);

  useEffect(() => { if (videoUrl) { void generateThumbs(); } }, [videoUrl, generateThumbs]);

  const transcribe = async () => {
    if (!videoBlob) { toast.error("Sem vídeo carregado"); return; }
    if (videoBlob.size > 24 * 1024 * 1024) {
      toast.error("Whisper aceita até 24MB. Envie um trecho ou reduza o vídeo.");
      return;
    }
    setTranscribing(true);
    setTranscript(""); setSegments([]);
    try {
      const fd = new FormData();
      fd.append("file", videoBlob, videoName || "video.mp4");
      fd.append("language", "pt");
      const r = await fetch("/api/public/videos-transcribe", { method: "POST", body: fd });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Falha");
      setTranscript(j.text || "");
      const segs = j.raw?.segments;
      if (Array.isArray(segs)) setSegments(segs.map((s: any) => ({ start: s.start, end: s.end, text: s.text })));
      toast.success("Transcrição concluída");
    } catch (e: any) {
      toast.error(e?.message || "Erro na transcrição");
    } finally {
      setTranscribing(false);
    }
  };

  // Montagem de vídeo a partir de keyframes com Ken Burns + crossfade
  const generate = async () => {
    const p = prompt.trim();
    if (!p) { toast.error("Digite um prompt"); return; }
    setGenerating(true);
    setGenStatus("Gerando keyframes com IA…");
    try {
      const r = await fetch("/api/public/videos-keyframes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p, frames, aspect }),
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Falha na geração");
      const imgs: string[] = j.images;
      setGenStatus(`Renderizando ${imgs.length} cenas em vídeo…`);
      const blob = await composeVideo(imgs, aspect, durationS, (msg) => setGenStatus(msg));
      loadVideo(blob, `mr-ia-${Date.now()}.webm`);
      setTab("upload");
      toast.success("Vídeo pronto!");
    } catch (e: any) {
      toast.error(e?.message || "Erro na geração");
    } finally {
      setGenerating(false);
      setGenStatus("");
    }
  };

  const seekTo = (t: number) => {
    const v = videoRef.current; if (!v) return;
    v.currentTime = Math.max(0, Math.min(duration, t));
  };
  const togglePlay = () => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) v.play(); else v.pause();
  };
  const download = () => {
    if (!videoBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(videoBlob);
    a.download = videoName || "video.webm";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  const goFullscreen = () => videoRef.current?.requestFullscreen?.();

  const progressPct = duration ? (current / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 ring-1 ring-amber-400/40">
            <Film className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vídeos IA</h1>
            <p className="text-sm text-muted-foreground">
              Geração por keyframes, player com timeline, transcrição Whisper e thumbnails automáticos.
            </p>
          </div>
        </header>

        <div className="mb-4 inline-flex rounded-xl border border-border bg-card p-1">
          <button
            onClick={() => setTab("upload")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "upload" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Upload className="mr-1 inline h-4 w-4" /> Upload & Player
          </button>
          <button
            onClick={() => setTab("generate")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "generate" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Sparkles className="mr-1 inline h-4 w-4" /> Gerar com IA
          </button>
        </div>

        {tab === "generate" && (
          <section className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <label className="mb-2 block text-sm font-medium">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Ex: pôr do sol dourado sobre montanhas nevadas, câmera aérea cinemática, luz volumétrica"
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Formato</label>
                <select value={aspect} onChange={(e) => setAspect(e.target.value as any)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  {ASPECTS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Keyframes: {frames}</label>
                <input type="range" min={2} max={8} value={frames} onChange={(e) => setFrames(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Duração: {durationS}s</label>
                <input type="range" min={4} max={20} value={durationS} onChange={(e) => setDurationS(Number(e.target.value))} className="w-full" />
              </div>
            </div>
            <button
              onClick={generate}
              disabled={generating}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/20 transition hover:brightness-110 disabled:opacity-60"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? genStatus || "Gerando…" : "Gerar vídeo"}
            </button>
          </section>
        )}

        {/* Uploader / Player */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          {!videoUrl ? (
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0] || null); }}
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border py-16 text-center transition hover:border-primary hover:bg-muted/30"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-medium text-foreground">Clique para enviar</span>
                <span className="text-muted-foreground"> ou arraste um vídeo aqui</span>
              </div>
              <div className="text-xs text-muted-foreground">MP4, WebM, MOV — até 400MB</div>
              <input type="file" accept="video/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] || null)} />
            </label>
          ) : (
            <>
              <div className="relative overflow-hidden rounded-xl bg-black">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="mx-auto block max-h-[60vh] w-full object-contain"
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
                  onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onVolumeChange={(e) => { setMuted(e.currentTarget.muted); setVolume(e.currentTarget.volume); }}
                  onClick={togglePlay}
                />
              </div>

              {/* Timeline com thumbnails */}
              <div className="mt-3">
                <div
                  className="relative h-16 cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/40"
                  onClick={(e) => {
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                    const ratio = (e.clientX - rect.left) / rect.width;
                    seekTo(ratio * duration);
                  }}
                >
                  {thumbs.length > 0 ? (
                    <div className="flex h-full">
                      {thumbs.map((t, i) => (
                        <img key={i} src={t.url} className="h-full flex-1 object-cover opacity-90" alt="" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      {thumbing ? "Extraindo thumbnails…" : "Timeline"}
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-y-0 left-0 bg-primary/25" style={{ width: `${progressPct}%` }} />
                  <div className="pointer-events-none absolute top-0 h-full w-0.5 bg-amber-400 shadow-[0_0_8px_rgba(245,220,140,0.9)]" style={{ left: `${progressPct}%` }} />
                </div>
              </div>

              {/* Controles */}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button onClick={togglePlay} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground hover:brightness-110">
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <span className="tabular-nums text-sm text-muted-foreground">{fmt(current)} / {fmt(duration)}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => { const v = videoRef.current; if (v) v.muted = !v.muted; }} className="text-muted-foreground hover:text-foreground">
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
                    onChange={(e) => { const v = videoRef.current; if (v) { v.muted = false; v.volume = Number(e.target.value); } }}
                    className="w-24" />
                </div>
                <select value={rate} onChange={(e) => { const r = Number(e.target.value); setRate(r); const v = videoRef.current; if (v) v.playbackRate = r; }}
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => <option key={r} value={r}>{r}x</option>)}
                </select>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={goFullscreen} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted">
                    <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
                  </button>
                  <button onClick={download} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted">
                    <Download className="h-3.5 w-3.5" /> Baixar
                  </button>
                  <button onClick={() => { setVideoUrl(null); setVideoBlob(null); setThumbs([]); setTranscript(""); setSegments([]); }}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted">
                    <Scissors className="h-3.5 w-3.5" /> Trocar
                  </button>
                </div>
              </div>

              {/* Transcrição */}
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium"><FileAudio className="h-4 w-4" /> Transcrição (Whisper)</div>
                    <button onClick={transcribe} disabled={transcribing}
                      className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground disabled:opacity-60">
                      {transcribing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                      {transcribing ? "Transcrevendo…" : "Transcrever"}
                    </button>
                  </div>
                  {segments.length > 0 ? (
                    <div className="max-h-64 space-y-1 overflow-y-auto text-sm">
                      {segments.map((s, i) => (
                        <button key={i} onClick={() => typeof s.start === "number" && seekTo(s.start)}
                          className="block w-full rounded px-2 py-1 text-left hover:bg-muted">
                          <span className="mr-2 tabular-nums text-xs text-amber-400">{fmt(s.start || 0)}</span>
                          <span>{s.text}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {transcript || "Clique em Transcrever para gerar o texto do áudio."}
                    </div>
                  )}
                </div>
                <div className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium"><ImageIcon className="h-4 w-4" /> Thumbnails automáticos</div>
                  <div className="grid grid-cols-4 gap-2">
                    {(thumbs.length ? thumbs : Array.from({ length: 8 }).map(() => null)).map((t, i) =>
                      t ? (
                        <button key={i} onClick={() => seekTo(t.time)} className="group relative overflow-hidden rounded-md ring-1 ring-border hover:ring-primary">
                          <img src={t.url} className="aspect-video w-full object-cover" alt="" />
                          <span className="absolute bottom-0.5 right-0.5 rounded bg-black/70 px-1 text-[10px] text-white">{fmt(t.time)}</span>
                        </button>
                      ) : (
                        <div key={i} className="aspect-video animate-pulse rounded-md bg-muted" />
                      )
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

// ---------- Compositor Ken Burns + crossfade ----------
async function composeVideo(
  images: string[],
  aspect: "16:9" | "9:16" | "1:1",
  totalSeconds: number,
  onStatus: (s: string) => void,
): Promise<Blob> {
  const A = ASPECTS.find((a) => a.id === aspect)!;
  const canvas = document.createElement("canvas");
  canvas.width = A.w; canvas.height = A.h;
  const ctx = canvas.getContext("2d")!;

  onStatus("Baixando imagens…");
  const imgs = await Promise.all(images.map(loadImg));

  const fps = 30;
  const stream = (canvas as HTMLCanvasElement).captureStream(fps);
  const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
    ? "video/webm;codecs=vp8"
    : "video/webm";
  const chunks: Blob[] = [];
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_500_000 });
  rec.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
  const done = new Promise<Blob>((res) => (rec.onstop = () => res(new Blob(chunks, { type: "video/webm" }))));
  rec.start(100);

  const perShot = totalSeconds / imgs.length;
  const cross = Math.min(0.6, perShot * 0.25);
  const t0 = performance.now();
  const totalMs = totalSeconds * 1000;

  onStatus("Renderizando frames…");
  await new Promise<void>((resolve) => {
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      if (t >= totalSeconds) { resolve(); return; }
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const idxF = t / perShot;
      const idx = Math.floor(idxF);
      const local = idxF - idx;
      drawKenBurns(ctx, imgs[Math.min(idx, imgs.length - 1)], canvas.width, canvas.height, local, 1);

      // crossfade com próxima
      const localT = local * perShot;
      if (idx < imgs.length - 1 && perShot - localT < cross) {
        const alpha = (cross - (perShot - localT)) / cross;
        drawKenBurns(ctx, imgs[idx + 1], canvas.width, canvas.height, 0, alpha);
      }

      const pct = Math.round((t / totalSeconds) * 100);
      if (pct % 10 === 0) onStatus(`Renderizando… ${pct}%`);

      if (performance.now() - t0 < totalMs) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });

  rec.stop();
  return done;
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("Falha ao carregar imagem"));
    img.src = src;
  });
}

function drawKenBurns(ctx: CanvasRenderingContext2D, img: HTMLImageElement, W: number, H: number, t: number, alpha: number) {
  // t entre 0..1 dentro do shot; zoom lento de 1.0 → 1.12 e leve pan diagonal
  const zoom = 1.0 + 0.12 * t;
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const canvasAR = W / H, imgAR = iw / ih;
  let sw: number, sh: number;
  if (imgAR > canvasAR) { sh = ih / zoom; sw = sh * canvasAR; }
  else { sw = iw / zoom; sh = sw / canvasAR; }
  const panX = (iw - sw) * (0.3 + 0.4 * t);
  const panY = (ih - sh) * (0.4 + 0.3 * t);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, panX, panY, sw, sh, 0, 0, W, H);
  ctx.restore();
}
