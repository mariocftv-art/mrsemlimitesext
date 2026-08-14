import { createFileRoute } from "@tanstack/react-router";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "content-type": "application/json",
};

export const Route = createFileRoute("/api/public/ext/proxy/reseller-api")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const target = url.searchParams.get("url");
        if (!target) return new Response(JSON.stringify({ error: "No target URL" }), { status: 400, headers: cors });
        
        try {
          const res = await fetch(target, {
            headers: {
              "apikey": request.headers.get("apikey") || "",
              "Authorization": request.headers.get("Authorization") || ""
            }
          });
          const data = await res.json();
          return new Response(JSON.stringify(data), { status: res.status, headers: cors });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
        }
      },
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const target = url.searchParams.get("url");
        if (!target) return new Response(JSON.stringify({ error: "No target URL" }), { status: 400, headers: cors });
        
        try {
          const body = await request.text();
          const res = await fetch(target, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "apikey": request.headers.get("apikey") || "",
              "Authorization": request.headers.get("Authorization") || ""
            },
            body
          });
          const data = await res.json();
          return new Response(JSON.stringify(data), { status: res.status, headers: cors });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
        }
      }
    }
  }
});