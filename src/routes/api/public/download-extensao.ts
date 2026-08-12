import { createFileRoute } from "@tanstack/react-router";
import currentExtensionAsset from "../../../assets/ext5_v1757_zip.zip.asset.json";

/**
 * Rota de download para a extensão v17.5.7 (MR Sem Limites)
 * Este endpoint resolve o asset hospedado no CDN do Lovable.
 */
const FILENAME = "mr-sem-limites-v17.5.7.zip";

export const Route = createFileRoute("/api/public/download-extensao")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        // O assetUrl deve ser resolvido em relação à origem do request para garantir acesso interno/externo
        const assetUrl = new URL(currentExtensionAsset.url, url.origin).toString();

        const upstream = await fetch(assetUrl);
        if (!upstream.ok) {
          return new Response(
            `Falha ao obter extensão (${upstream.status}) em ${FILENAME}`,
            { status: 502 },
          );
        }

        const buf = await upstream.arrayBuffer();
        const bytes = new Uint8Array(buf);

        // Verificação básica de assinatura ZIP (PK..)
        const isZip =
          bytes.length > 4 &&
          bytes[0] === 0x50 &&
          bytes[1] === 0x4b &&
          bytes[2] === 0x03 &&
          bytes[3] === 0x04;

        if (!isZip) {
          return new Response(
            "Arquivo da extensão inválido no servidor (assinatura ZIP ausente). Publique novamente.",
            { status: 502 },
          );
        }

        return new Response(buf, {
          status: 200,
          headers: {
            "Content-Type": "application/zip",
            "Content-Length": String(buf.byteLength),
            "Content-Disposition": `attachment; filename="${FILENAME}"`,
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
