export async function handleWebhook(provider: string, request: Request) {
  console.log(`Webhook received for ${provider}`);
  return new Response(JSON.stringify({ ok: true }), { 
    status: 200, 
    headers: { "Content-Type": "application/json" } 
  });
}
