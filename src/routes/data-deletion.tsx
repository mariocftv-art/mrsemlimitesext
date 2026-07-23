import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/data-deletion")({
  head: () => ({
    meta: [
      { title: "Exclusão de Dados — MR Sem Limites" },
      { name: "description", content: "Como solicitar a exclusão dos seus dados da extensão MR Sem Limites." },
      { property: "og:title", content: "Exclusão de Dados — MR Sem Limites" },
      { property: "og:description", content: "Solicite a exclusão dos seus dados a qualquer momento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DataDeletion,
});

function DataDeletion() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-neutral-100">
      <h1 className="mb-2 text-4xl font-bold">Instruções de Exclusão de Dados</h1>
      <p className="mb-8 text-sm text-neutral-400">Última atualização: 23 de julho de 2026</p>

      <section className="space-y-6 text-neutral-200 leading-relaxed">
        <p>A extensão MR Sem Limites <strong>não armazena dados pessoais em servidores próprios</strong>. Todos os tokens e configurações ficam no <code>chrome.storage.local</code> do seu navegador.</p>

        <h2 className="text-2xl font-semibold text-white">Exclusão automática</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Abra <code>chrome://extensions</code>.</li>
          <li>Localize <strong>MR Sem Limites</strong> e clique em <strong>Remover</strong>.</li>
          <li>Todos os dados locais são apagados imediatamente.</li>
        </ol>

        <h2 className="text-2xl font-semibold text-white">Revogar acesso na Meta</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Acesse <a href="https://www.facebook.com/settings?tab=business_tools" className="text-amber-400 underline">Configurações → Apps e Sites Empresariais</a>.</li>
          <li>Encontre <strong>MR Sem Limites</strong> e clique em <strong>Remover</strong>.</li>
        </ol>

        <h2 className="text-2xl font-semibold text-white">Solicitação manual</h2>
        <p>Envie um pedido de exclusão pelo WhatsApp <a href="https://wa.me/5511962579428" className="text-amber-400 underline">+55 11 96257-9428</a> informando o ID da sua conta Instagram Business. Confirmaremos a exclusão em até 48 horas.</p>
      </section>
    </main>
  );
}
