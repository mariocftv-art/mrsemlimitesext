import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/downloads")({ component: Downloads });

function Downloads() {
  const downloads = [
    { name: "MR Sem Limites EXT8 v17.8.8 ULTRA (Recomendado)", file: "ext8_v1788_zip.zip", version: "17.8.8", tone: "cyan", description: "Versão Ultra com nova logo e motor otimizado." },
    { name: "MR Sem Limites EXT7 v17.8.6", file: "ext7_v1786_zip.zip", version: "17.8.6", tone: "cyan", description: "Master Kit v3.5 com backend sincronizado." },
    { name: "MR Sem Limites EXT5 v17.5.9", file: "ext5_v1759_zip.zip", version: "17.5.9", tone: "cyan", description: "Motor Infinito v17.0 com backend Neon." },
    { name: "MR Sem Limites EXT2 v4.1.5", file: "ext2_v415_zip.zip", version: "4.1.5", tone: "violet", description: "Modo Admin Master Vitalício ativado." },
    { name: "MR Sem Limites EXT4 v4.1.2", file: "ext4_v412_zip.zip", version: "4.1.2", tone: "lime", description: "Híbrido Build v5 + Motor Castler." },
    { name: "MR Sem Limites EXT1 v3.7.0", file: "ext1_v37.zip", version: "3.7.0", tone: "cyan", description: "Original Factory com licenciamento v3.7." },
    { name: "MR Sem Limites EXT3 v2.9", file: "ext3_v29_zip.zip", version: "2.9", tone: "magenta", description: "Backend sincronizado e chaves dinâmicas." },
  ];

  const handleDownload = (file: string) => {
    const url = `/api/public/ext/download/${file}`;
    window.location.href = url;
  };

  return (
    <AppShell title="Central de Downloads" subtitle="Acesse todos os pacotes ZIP das extensões em um só lugar.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {downloads.map((d) => (
          <div key={d.file} className="glass group flex flex-col justify-between rounded-lg border border-border/60 p-5 transition-all hover:border-primary/50">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">{d.name}</h3>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">v{d.version}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{d.description}</p>
              <code className="mt-3 block truncate rounded bg-secondary/30 px-2 py-1 text-[10px] text-muted-foreground">
                {d.file}
              </code>
            </div>
            <button
              onClick={() => handleDownload(d.file)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4" /> Baixar Pacote ZIP
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}


