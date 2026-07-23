import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Suporte — MR Sem Limites" },
      { name: "description", content: "Suporte oficial da extensão MR Sem Limites via WhatsApp." },
      { property: "og:title", content: "Suporte — MR Sem Limites" },
      { property: "og:description", content: "Fale com o suporte oficial pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Support,
});

function Support() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-neutral-100">
      <h1 className="mb-2 text-4xl font-bold">Suporte</h1>
      <p className="mb-8 text-sm text-neutral-400">Atendimento oficial MR Sem Limites</p>

      <section className="space-y-6 text-neutral-200 leading-relaxed">
        <p>Precisa de ajuda com a extensão, integração com Instagram ou publicação de conteúdo? Fale conosco:</p>

        <a
          href="https://wa.me/5511962579428"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-black hover:bg-emerald-400 transition"
        >
          💬 WhatsApp: +55 11 96257-9428
        </a>

        <h2 className="text-2xl font-semibold text-white">Horário</h2>
        <p>Segunda a sexta, das 9h às 18h (horário de Brasília).</p>

        <h2 className="text-2xl font-semibold text-white">Documentos</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><a href="/privacy-policy" className="text-amber-400 underline">Política de Privacidade</a></li>
          <li><a href="/terms-of-service" className="text-amber-400 underline">Termos de Uso</a></li>
          <li><a href="/data-deletion" className="text-amber-400 underline">Exclusão de Dados</a></li>
        </ul>
      </section>
    </main>
  );
}
