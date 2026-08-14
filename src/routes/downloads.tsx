import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PagePlaceholder } from "@/components/layout/kpi-card";

export const Route = createFileRoute("/downloads")({ component: Downloads });

function Downloads() {
  const downloads = [
    { name: "MR Sem Limites EXT8 v17.8.8 ULTRA (Recomendado)", file: "ext8_v1788_zip.zip", version: "17.8.8", tone: "cyan" },
    { name: "MR Sem Limites EXT7 v17.8.6", file: "ext7_v1786_zip.zip", version: "17.8.6", tone: "cyan" },
    { name: "MR Sem Limites EXT5 v17.5.9", file: "ext5_v1759_zip.zip", version: "17.5.9", tone: "cyan" },
    { name: "MR Sem Limites EXT2 v4.1.5 (Admin Master)", file: "ext2_v415_zip.zip", version: "4.1.5", tone: "violet" },
    { name: "MR Sem Limites EXT4 v4.1.2", file: "ext4_v412_zip.zip", version: "4.1.2", tone: "lime" },
    { name: "MR Sem Limites EXT1 v3.7.0", file: "ext1_v37.zip", version: "3.7.0", tone: "cyan" },
    { name: "MR Sem Limites EXT3 v2.9", file: "ext3_v29_zip.zip", version: "2.9", tone: "magenta" },
  ];

  const handleDownload = (file: string) => {
    const a = document.createElement("a");
    a.href = `/api/public/ext/download/${file}`;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AppShell title="Central de Downloads" subtitle="Baixe os pacotes ZIP das extensões diretamente aqui.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {downloads.map((d) => (
          <div key={d.file} className="glass flex flex-col justify-between rounded-lg border border-border/60 p-4">
            <div>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-sm">{d.name}</h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground italic">{d.file}</p>
            </div>
            <button
              onClick={() => handleDownload(d.file)}
              className="mt-4 w-full rounded-md bg-primary py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Baixar Agora
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

