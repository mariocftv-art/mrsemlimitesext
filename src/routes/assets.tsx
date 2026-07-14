import { createFileRoute, Link } from "@tanstack/react-router";
import { FileCode, ImageIcon, Volume2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllExtensions,
  scanExtension,
  type FileEntry,
} from "@/factory";

export const Route = createFileRoute("/assets")({ component: AssetsPage });

function AssetsPage() {
  const exts = getAllExtensions();
  return (
    <AppShell
      title="Assets"
      subtitle="Todos os arquivos de mídia detectados diretamente nas pastas das extensões."
    >
      <div className="space-y-8">
        {exts.map((e) => {
          const scan = scanExtension(e.sourceDir);
          const images = [
            ...scan.assets.icons,
            ...scan.assets.images,
          ].filter((f, i, arr) => arr.findIndex((x) => x.path === f.path) === i);
          const sounds = scan.assets.sounds;
          const fonts = scan.assets.fonts;
          const others = scan.files.filter(
            (f) =>
              !["icon", "image", "sound", "font"].includes(f.category) &&
              /\.(json|css|html|js|mjs|txt|md|svg|webp|ico|gif)$/i.test(f.name),
          );

          return (
            <section key={e.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-background/40">
                  {scan.assets.logo ? (
                    <img src={scan.assets.logo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <Link
                    to="/preview/$id"
                    params={{ id: e.id }}
                    className="font-semibold hover:text-primary"
                  >
                    {e.name}
                  </Link>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {e.code} · {scan.files.length} arquivo(s) no total
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <AssetGroup title="Imagens & Ícones" count={images.length}>
                  <ImageStrip files={images} />
                </AssetGroup>
                <AssetGroup title="Sons" count={sounds.length}>
                  {sounds.length === 0 ? (
                    <Empty label="Sem áudio detectado" />
                  ) : (
                    <ul className="space-y-2">
                      {sounds.map((f) => (
                        <li
                          key={f.path}
                          className="flex items-center gap-2 text-xs"
                        >
                          <Volume2 className="h-3.5 w-3.5 text-primary" />
                          <span className="truncate font-mono">{f.path}</span>
                          <audio controls src={f.url} className="ml-auto h-7" />
                        </li>
                      ))}
                    </ul>
                  )}
                </AssetGroup>
                <AssetGroup title="Fontes" count={fonts.length}>
                  {fonts.length === 0 ? (
                    <Empty label="Sem fontes" />
                  ) : (
                    <ul className="space-y-1 text-xs font-mono">
                      {fonts.map((f) => (
                        <li key={f.path}>{f.path}</li>
                      ))}
                    </ul>
                  )}
                </AssetGroup>
                <AssetGroup title="Outros arquivos servíveis" count={others.length}>
                  {others.length === 0 ? (
                    <Empty label="—" />
                  ) : (
                    <ul className="space-y-1 text-xs">
                      {others.slice(0, 40).map((f) => (
                        <li key={f.path} className="flex items-center gap-2">
                          <FileCode className="h-3 w-3 text-muted-foreground" />
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noreferrer"
                            className="truncate font-mono hover:text-primary"
                          >
                            {f.path}
                          </a>
                          <Badge
                            variant="outline"
                            className="ml-auto border-border/40 px-1 py-0 text-[9px]"
                          >
                            {f.ext}
                          </Badge>
                        </li>
                      ))}
                      {others.length > 40 && (
                        <li className="pt-1 text-[10px] text-muted-foreground">
                          + {others.length - 40} arquivo(s)…
                        </li>
                      )}
                    </ul>
                  )}
                </AssetGroup>
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}

function AssetGroup({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Card className="glass border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <Badge variant="outline" className="border-border/60 text-[10px]">
          {count}
        </Badge>
      </CardHeader>
      <CardContent className="text-xs">{children}</CardContent>
    </Card>
  );
}

function ImageStrip({ files }: { files: FileEntry[] }) {
  if (files.length === 0) return <Empty label="Sem imagens" />;
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {files.slice(0, 24).map((f) => (
        <div
          key={f.path}
          className="flex flex-col items-center gap-1 rounded border border-border/40 bg-background/40 p-1.5"
          title={f.path}
        >
          <div className="flex h-14 w-full items-center justify-center overflow-hidden rounded bg-background/60">
            <img src={f.url} alt="" className="h-full w-full object-contain" />
          </div>
          <p className="w-full truncate text-[9px]">{f.name}</p>
        </div>
      ))}
      {files.length > 24 && (
        <p className="col-span-full text-[10px] text-muted-foreground">
          + {files.length - 24} imagem(ns)…
        </p>
      )}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <p className="text-muted-foreground">{label}</p>;
}
