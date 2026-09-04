import { createFileRoute } from "@tanstack/react-router";
import { Download, Image as ImageIcon, Video, Users, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/ext-growth")({
  component: ExtGrowth,
  head: () => ({
    meta: [
      { title: "EXT Growth v7.19 · MR Social Growth" },
      {
        name: "description",
        content:
          "EXT Growth v7.19: CRM lateral multi-plataforma com envio de vídeo compatível, até 4 imagens por disparo e suporte a WhatsApp, Facebook, Telegram, Instagram e YouTube.",
      },
      { property: "og:title", content: "EXT Growth v7.19 · MR Social Growth" },
      {
        property: "og:description",
        content:
          "Pacote ZIP da extensão EXT Growth com correções de vídeo, múltiplas imagens e Facebook habilitado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const FILE = "ext_growth_v719_zip.zip";

const fixes = [
  {
    icon: Video,
    title: "Vídeo compatível com qualquer formato",
    body: "MP4/WebM seguem pelo fluxo normal de Fotos e vídeos. MOV, AVI, MKV, WMV, 3GP, FLV, MPEG e M4V são detectados no painel e enviados automaticamente como documento (arquivo íntegro, até 60 MB), em vez de falhar com \"incompatível\".",
  },
  {
    icon: ImageIcon,
    title: "Até 4 imagens + vídeo no mesmo disparo",
    body: "Cada mídia é anexada e enviada isoladamente, com legenda no primeiro item. Se um arquivo falhar, os demais continuam — e o painel informa quantos foram enviados de quantos.",
  },
  {
    icon: Users,
    title: "Facebook e Messenger habilitados",
    body: "facebook.com e messenger.com entraram nas permissões e no content script, junto de WhatsApp, Telegram, Instagram e YouTube.",
  },
  {
    icon: ShieldCheck,
    title: "Motor preservado",
    body: "Nenhuma alteração no motor de extração, licenciamento ou backend MR Sem Limites. Apenas as rotas de mídia e o manifesto foram ajustados.",
  },
];

function ExtGrowth() {
  const handleDownload = () => {
    // cache-bust para garantir sempre o pacote mais recente
    window.location.href = `/api/public/ext/download/${FILE}?t=${Date.now()}`;
  };

  return (
    <AppShell
      title="EXT Growth v7.19"
      subtitle="MR Social Growth com envio de mídia corrigido e multi-plataforma."
    >
      <div className="space-y-6">
        <section className="glass rounded-lg border border-border/60 p-6">
          <h2 className="text-sm font-bold">Pacote pronto para teste</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Baixe o ZIP, descompacte, abra <code className="rounded bg-secondary/30 px-1">chrome://extensions</code>,
            ative o Modo do desenvolvedor e use “Carregar sem compactação” apontando para a pasta.
          </p>
          <code className="mt-3 block truncate rounded bg-secondary/30 px-2 py-1 text-[10px] text-muted-foreground">
            {FILE}
          </code>
          <button
            onClick={handleDownload}
            className="mt-5 flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="h-4 w-4" /> Baixar EXT Growth v7.19
          </button>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          {fixes.map((f) => (
            <div key={f.title} className="glass rounded-lg border border-border/60 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold leading-tight">{f.title}</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
