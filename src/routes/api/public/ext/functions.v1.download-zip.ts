import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/ext/functions/v1/download-zip")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const version = url.searchParams.get("v") || "2.9";
        const ext = url.searchParams.get("ext") || "1";
        
        console.log(`[Download] Request for EXT${ext} v${version}`);

        // Servir os arquivos locais da pasta public
        const baseUrl = new URL(request.url).origin;
        let file = "ext1_v37.zip";
        
        if (ext === "8") file = "extensions/ext-08/integrated/ext8_v1788_zip.zip";
        else if (ext === "7") file = "extensions/ext-07/integrated/ext7_v1786_zip.zip";
        else if (ext === "6") file = "ext6_v1765_zip.zip";
        else if (ext === "5") file = "ext5_v1759_zip.zip";
        else if (ext === "4") file = "ext4_v412_zip.zip";
        else if (ext === "3") file = "ext3_v29_zip.zip";
        else if (ext === "2") file = "ext2_v415_zip.zip";
        
        return Response.redirect(`${baseUrl}/${file}`, 302);
      },
    },
  },
});
