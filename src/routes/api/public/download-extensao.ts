import { createFileRoute } from "@tanstack/react-router";
import currentExtensionAsset from "../../../assets/ext7_v1785_zip.asset.json";

/**
 * Rota de download para a extensão v17.7.0 (MR Sem Limites EXT7)
 */
const FILENAME = "mr-sem-limites-v17.8.5.zip";

export const Route = createFileRoute("/api/public/download-extensao")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const assetUrl = new URL(currentExtensionAsset.url, url.origin).toString();

        const upstream = await fetch(assetUrl);
        if (!upstream.ok) {
          return new Response(
            `Falha ao obter extensão (${upstream.status}) em ${FILENAME}`,
            { status: 502 },
          );
        }

        const buf = await upstream.arrayBuffer();
        return new Response(buf, {
          status: 200,
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename="${FILENAME}"`,
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
