# MR Social Growth — Versão 7.3.0 · Novidades

Esta versão implementa as duas solicitações: **exibir o nome do contato junto ao telefone** na revisão de contatos e **enviar mensagens usando o nome cadastrado no WhatsApp** do destinatário.

## 1. Nomes na Revisão de Contatos

O projeto já armazenava cada contato como um par `{ nome, telefone }`, mas o nome só era capturado quando estava visível na tela no momento da extração. Na versão 7.3 a extração ficou mais inteligente:

- A varredura do grupo agora lê **linhas inteiras** (`listitem`/`row`) procurando pares nome+número dentro da lista de participantes. Mesmo contatos que você não tem na sua agenda aparecem com o **nome exibido no perfil deles** no WhatsApp Web.
- A lista de participantes continua capturando o badge **👑 Admin** para quem é administrador do grupo (a detecção acontece por linha, então o problema do administrador sem nome na versão anterior foi corrigido).
- **Novo botão "🔍 BUSCAR NOMES DOS CONTATOS (WhatsApp)"** (aba WA Envio): após extrair uma lista, clique nele com o WhatsApp Web aberto na mesma janela. A extensão varre a sua lista de conversas (onde o WhatsApp mostra o nome salvo na sua agenda) e resolve os nomes que faltavam, linha por linha.

Na Revisão de Contatos, cada linha agora mostra `Nome — telefone`, exatamente como o WhatsApp apresenta. Quando o nome não é encontrado, aparece apenas o número.

## 2. Envio com o Nome do Destinatário

As mensagens agora suportam **tokens de personalização**. Escreva na mensagem e a extensão substitui automaticamente por contato:

| Token | Resultado |
|---|---|
| `{nome}` | Primeiro nome (ex.: "Jorge") |
| `{nome completo}` | Nome inteiro (ex.: "Jorge Silva") |
| `{primeiro_nome}` | Primeiro nome |
| `{telefone}` | Número do destinatário |

Exemplo:

> Olá {nome}, tudo bem? 👋 Aqui é uma oferta exclusiva para você!

Será enviada como "Olá Jorge, tudo bem? 👋 …" para o Jorge, "Olá Ana, tudo bem? 👋 …" para a Ana, e assim por diante.

A personalização funciona nos três caminhos de envio:

1. **Disparo sequencial WhatsApp** (`ui/panel.js` → `sendWhatsAppSequential`)
2. **Envios Telegram/Instagram** (mesmo fluxo de disparo individual)
3. **Agendamento 24/7** (`scripts/background.js` → `runScheduledDispatch`) — o agendador agora também interpola o nome e junta o título personalizado

Se o token `{nome}` for usado mas o contato não tiver nome cadastrado, a extensão usa o número como substituto seguro (nunca envia "{nome}" literal).

## 3. Observações importantes

- O WhatsApp Web só exibe o nome do contato se **ele estiver salvo na SUA agenda** ou se o perfil dele mostrar o nome na lista. Contatos com configurações de privacidade restritas podem aparecer apenas com número. O botão de busca de nomes maximiza a recuperação usando a lista de conversas como fonte.
- A extração captura também o **nome exibido no perfil** (o que aparece com as iniciais no app), atendendo ao caso descrito (ex.: "Jorge" aparecendo junto do número).
- Arquivo novo: `scripts/name-resolver.js` (biblioteca de resolução de nomes, usada pelo painel).
- Versão bumpada de 7.2.0 para **7.3.0** no `manifest.json`.

## Como instalar a atualização

1. Remova a extensão antiga em `chrome://extensions` (ou apenas clique em "Atualizar" no cartão dela).
2. Ative o "Modo desenvolvedor".
3. Clique em "Carregar sem compactação" e selecione a pasta do novo ZIP extraído.
4. Abra o WhatsApp Web e o painel da extensão.
