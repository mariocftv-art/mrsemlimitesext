import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/ext/functions/v1/download-zip")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const version = url.searchParams.get("v") || "2.9";
        const ext = url.searchParams.get("ext") || "1";
        
        console.log(`[Download] Request for EXT${ext} v${version}`);

        // Redireciona para o asset real no bucket (exemplo de fallback estável)
        // No futuro isso pode servir o binário diretamente via streams do sandbox
        const fallbackUrl = "https://storage.googleapis.com/gpt-engineer-file-uploads/dG4KLRailvgZ5C10HZJJbpmtVz13/MR_Sem_Limites_EXT1_v28.zip";
        
        return Response.redirect(fallbackUrl, 302);
      },
    },
  },
});
