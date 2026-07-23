import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — MR Sem Limites" },
      { name: "description", content: "Termos de Uso da extensão MR Sem Limites para publicação de conteúdo no Instagram." },
      { property: "og:title", content: "Termos de Uso — MR Sem Limites" },
      { property: "og:description", content: "Regras de uso da extensão MR Sem Limites." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-neutral-100">
      <h1 className="mb-2 text-4xl font-bold">Termos de Uso</h1>
      <p className="mb-8 text-sm text-neutral-400">Última atualização: 23 de julho de 2026</p>

      <section className="space-y-6 text-neutral-200 leading-relaxed">
        <h2 className="text-2xl font-semibold text-white">1. Aceitação</h2>
        <p>Ao instalar e usar a extensão MR Sem Limites, você concorda com estes Termos. Se não concordar, não utilize o serviço.</p>

        <h2 className="text-2xl font-semibold text-white">2. Descrição do serviço</h2>
        <p>A extensão gera e publica conteúdo (imagens, vídeos, legendas) em contas Instagram Business autorizadas pelo próprio usuário, via API oficial da Meta.</p>

        <h2 className="text-2xl font-semibold text-white">3. Responsabilidades do usuário</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Publicar apenas conteúdo legal e que respeite os direitos autorais.</li>
          <li>Cumprir as <a href="https://help.instagram.com/581066165581870" className="text-amber-400 underline">Diretrizes da Comunidade do Instagram</a>.</li>
          <li>Manter seus tokens de acesso em sigilo.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white">4. Limitação de responsabilidade</h2>
        <p>Não nos responsabilizamos por bloqueios, suspensões ou danos decorrentes de conteúdo publicado pelo usuário. O serviço é fornecido “como está”.</p>

        <h2 className="text-2xl font-semibold text-white">5. Encerramento</h2>
        <p>Podemos suspender o acesso em caso de violação destes Termos ou das políticas da Meta.</p>

        <h2 className="text-2xl font-semibold text-white">6. Contato</h2>
        <p>WhatsApp: <a href="https://wa.me/5511962579428" className="text-amber-400 underline">+55 11 96257-9428</a></p>
      </section>
    </main>
  );
}
