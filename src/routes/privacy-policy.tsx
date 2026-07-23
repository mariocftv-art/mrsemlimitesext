import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — MR Sem Limites" },
      { name: "description", content: "Política de Privacidade da extensão MR Sem Limites para publicação no Instagram via Meta Graph API." },
      { property: "og:title", content: "Política de Privacidade — MR Sem Limites" },
      { property: "og:description", content: "Como tratamos seus dados na extensão MR Sem Limites." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-neutral-100">
      <h1 className="mb-2 text-4xl font-bold">Política de Privacidade</h1>
      <p className="mb-8 text-sm text-neutral-400">Última atualização: 23 de julho de 2026</p>

      <section className="space-y-6 text-neutral-200 leading-relaxed">
        <p>
          A extensão <strong>MR Sem Limites</strong> (“nós”, “nosso”) respeita sua privacidade.
          Esta política descreve quais dados coletamos, como usamos e como você pode controlá-los.
        </p>

        <h2 className="text-2xl font-semibold text-white">1. Dados que coletamos</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Token de acesso do Instagram/Facebook</strong>: armazenado localmente no seu navegador (chrome.storage) para publicar em sua conta.</li>
          <li><strong>ID da conta do Instagram Business</strong>: usado exclusivamente para enviar mídia via Meta Graph API.</li>
          <li><strong>Conteúdo gerado (imagens, vídeos, textos)</strong>: processado para publicação e não é armazenado em nossos servidores após o envio.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white">2. Como usamos seus dados</h2>
        <p>Usamos os dados exclusivamente para: (a) autenticar você na Meta; (b) publicar o conteúdo que você criar na sua conta do Instagram; (c) exibir prévias no painel da extensão.</p>

        <h2 className="text-2xl font-semibold text-white">3. Compartilhamento</h2>
        <p>Não vendemos nem compartilhamos seus dados com terceiros. A comunicação ocorre diretamente entre sua extensão e a API oficial da Meta.</p>

        <h2 className="text-2xl font-semibold text-white">4. Armazenamento local</h2>
        <p>Tokens e configurações ficam no <code>chrome.storage.local</code> do seu navegador. Ao remover a extensão, esses dados são apagados automaticamente.</p>

        <h2 className="text-2xl font-semibold text-white">5. Exclusão de dados</h2>
        <p>Você pode solicitar exclusão a qualquer momento em <a href="/data-deletion" className="text-amber-400 underline">/data-deletion</a>.</p>

        <h2 className="text-2xl font-semibold text-white">6. Contato</h2>
        <p>WhatsApp: <a href="https://wa.me/5511962579428" className="text-amber-400 underline">+55 11 96257-9428</a></p>
      </section>
    </main>
  );
}
