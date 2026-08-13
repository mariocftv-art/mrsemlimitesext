import { createFileRoute } from "@tanstack/react-router";

/**
 * Proxy para a Reseller API externa.
 * Centraliza a comunicação para evitar CORS e expor chaves de API.
 */
const EXTERNAL_API = "https://dwpuqewnfibeldegvimp.supabase.co/functions/v1/reseller-api";

export const Route = createFileRoute("/api/public/ext/proxy/reseller-api/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const path = params["_"];
        const url = new URL(request.url);
        const targetUrl = `${EXTERNAL_API}/${path}${url.search}`;
        
        const response = await fetch(targetUrl, {
          method: "GET",
          headers: request.headers,
        });
        
        return new Response(response.body, {
          status: response.status,
          headers: {
            ...Object.fromEntries(response.headers.entries()),
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
      POST: async ({ request, params }) => {
        const path = params["_"];
        const url = new URL(request.url);
        const targetUrl = `${EXTERNAL_API}/${path}${url.search}`;
        
        const response = await fetch(targetUrl, {
          method: "POST",
          headers: request.headers,
          body: request.body,
        });
        
        return new Response(response.body, {
          status: response.status,
          headers: {
            ...Object.fromEntries(response.headers.entries()),
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
      OPTIONS: async () => {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
          },
        });
      },
    },
  },
});
