# MR Sem Limite — Manual Completo de Operação

## Vamos usar assim

A extensão funciona como um painel lateral para organizar contatos, preparar mensagens e escolher **para onde** a mensagem será enviada. A regra mais importante é esta:

> **Grupo aberto:** envia dentro do grupo.
>
> **Grupo restrito a administradores:** não envia dentro do grupo; selecione os telefones extraídos e envie uma mensagem individual para cada número.
>
> **Grupo fechado ou excluído:** a extensão não cria acesso nem contorna convite. É necessário convite, link oficial ou aprovação de um administrador.

O fluxo mais comum é: **abrir o WhatsApp Web → extrair os telefones → revisar a lista → marcar os contatos → preparar a mensagem → escolher o destino → confirmar o envio**.

## 1. Instalação

Abra `chrome://extensions` no Chrome. Ative o **Modo de desenvolvedor**, clique em **Carregar sem compactação** e selecione a pasta que foi extraída do ZIP. A pasta correta é aquela que contém o arquivo `manifest.json`.

Depois da instalação, abra o [WhatsApp Web](https://web.whatsapp.com/) em uma aba normal, faça login e aguarde o carregamento completo. Clique no ícone da extensão para abrir o painel lateral. Se quiser manter o painel sempre aberto, use o ícone de fixar do próprio painel lateral do Chrome.

Na versão 7.9.0, use uma aba ativa do WhatsApp Web. Telegram, Instagram e YouTube continuam preservados internamente, mas ficam temporariamente ocultos no painel para concentrar a operação no WhatsApp. A extensão não funciona em páginas `chrome://`, na loja de extensões ou antes de o WhatsApp Web terminar de carregar.

## 2. O cabeçalho e os ícones

| Elemento | O que significa |
|---|---|
| Logo **MR Sem Limite** | Identifica a extensão e indica que o painel está ativo. |
| `MR SOCIAL GROWTH` | Nome do sistema de organização, extração e envio. |
| `CRM lateral` | O painel fica na lateral direita do navegador. |
| Ícone de fixar do Chrome | Mantém o painel lateral aberto enquanto você trabalha. |
| Barra de status | Mostra se a ação está aguardando, funcionando, concluída ou com erro. |
| Barra de progresso | Indica quanto da extração ou do envio já foi processado. |

## 3. As abas principais

| Aba | Para que serve |
|---|---|
| **Controle** | Ações gerais e rotinas autorizadas do WhatsApp. |
| **WA Extração** | Capturar telefones e nomes visíveis no WhatsApp Web. |
| **WA Envio** | Preparar mensagens, escolher contatos, enviar para grupos e fazer upload de mídia. |
| **Módulos sociais** | Telegram, Instagram, YouTube e Growth permanecem preservados no código, mas ficam ocultos temporariamente na versão 7.9.0 para reativação futura. |
| **Esquenta** | Rotina de mensagens apenas para números que autorizaram o contato. |
| **Banco** | Guardar, carregar, renomear, copiar, exportar e apagar listas. |
| **Manual** | Abrir a explicação operacional da extensão. |
| **Agendamento** | Programar um envio para uma data e horário futuros. |

## 4. WA Extração: como capturar os telefones

### Passo a passo

1. Abra o WhatsApp Web.
2. Entre no grupo ou conversa desejada.
3. Aguarde os nomes e telefones aparecerem na tela.
4. Abra a aba **WA Extração**.
5. Escolha o alcance da leitura.

| Botão | Quando usar |
|---|---|
| **Somente grupo / conversa selecionada** | É a opção recomendada para capturar os participantes do grupo aberto. |
| **Tela toda do WhatsApp** | Lê os elementos visíveis de toda a tela. Use quando a informação não está concentrada em um único grupo. |

A extração trabalha com o que está visível no WhatsApp Web. Se o grupo tiver 500 participantes, pode ser necessário rolar a lista para que mais participantes sejam carregados antes de extrair. O resultado pode trazer **nome, telefone e indicação de administrador**, quando essas informações estiverem visíveis.

Depois da extração, a lista aparece na área **Revisão de Contatos**. Cada linha representa um contato. O número é o destino técnico do envio; o nome é usado para mostrar a lista e personalizar a mensagem.

## 5. Revisão de Contatos: selecionar quem receberá

A revisão é a parte mais importante antes do envio. Ela permite conferir os contatos e escolher exatamente quem receberá a mensagem.

| Botão ou controle | Função |
|---|---|
| **Todos** | Marca todos os contatos da lista. |
| **Nenhum** | Desmarca todos. Use antes de selecionar manualmente. |
| **Top 20** | Marca os primeiros 20 contatos. |
| **Last 20** | Marca os últimos 20 contatos. |
| **Inverter** | Troca marcados por desmarcados e vice-versa. |
| **Visíveis** | Marca os contatos que estão aparecendo depois de uma filtragem. |
| **Selecionar Admins** | Marca os contatos identificados como administradores. |
| **Remover Admins** | Desmarca os administradores. |
| **Apagar Sel.** | Remove da lista os contatos atualmente marcados. Use com atenção. |
| **Copiar** | Copia os contatos para a área de transferência. |
| **CSV** | Baixa a lista em formato CSV. |
| **Renomear** | Altera o nome salvo da lista no Banco. |
| **ENVIAR SELECIONADOS** | Envia a mensagem individualmente para os telefones marcados. |

### Exemplo prático com 500 telefones

Vamos usar assim: você extraiu 500 telefones de um grupo. Na Revisão de Contatos, clique em **Top 20**. Confira se aparecem 20 contatos marcados. Prepare a mensagem na aba **WA Envio** e clique em **ENVIAR SELECIONADOS**. A extensão abrirá cada número individualmente e enviará uma mensagem para cada um, respeitando o intervalo configurado.

Esse envio individual **não depende de o grupo permitir mensagens**. Mesmo que o grupo diga “somente administradores”, os telefones selecionados podem ser tratados como destinos individuais, desde que o WhatsApp permita iniciar a conversa e você tenha autorização para contactar essas pessoas.

## 6. WA Envio: preparação da mensagem

### Título / assunto

O campo **Título / assunto** é opcional. Ele pode ser usado como uma primeira linha ou identificação da campanha, dependendo do fluxo. Se não precisar de título, deixe vazio.

### Intervalo

O campo **Intervalo (s)** define o tempo entre os contatos. O valor permitido é de **5 a 120 segundos**. Exemplo: com 15 segundos, a extensão espera aproximadamente 15 segundos antes de passar ao próximo contato.

Um intervalo maior deixa o envio mais lento, mas organiza melhor a sequência. Nunca use a extensão para mensagens não autorizadas ou para tentar contornar limites do WhatsApp.

### Variação do texto

| Modo | Explicação simples |
|---|---|
| **Texto fixo — igual para todos** | Todos recebem exatamente a mesma mensagem, com a personalização de nome aplicada quando houver token. É o modo recomendado para começar. |
| **Texto alternado — sorteia opções** | A mensagem pode ter alternativas entre chaves separadas por `|`. A extensão sorteia uma alternativa para cada envio. |

Exemplo de texto alternado:

```text
{Olá|Bom dia|Boa tarde} {nome}, tudo bem?
```

Uma pessoa poderá receber “Olá Jorge, tudo bem?” e outra “Bom dia Ana, tudo bem?”.

### Personalização com nomes

| Token | Resultado |
|---|---|
| `{nome}` | Primeiro nome, como `Jorge`. |
| `{nome completo}` | Nome inteiro, como `Jorge Silva`. |
| `{primeiro_nome}` | Primeiro nome. |
| `{telefone}` | Número do destinatário. |

Exemplo:

```text
Olá {nome}, tudo bem?
Aqui é da equipe MR Sem Limite.
```

Para Jorge, a mensagem será preparada como:

```text
Olá Jorge, tudo bem?
Aqui é da equipe MR Sem Limite.
```

Se o nome não estiver disponível, a extensão utiliza o telefone como substituto, evitando enviar o texto `{nome}` literalmente.

## 7. Upload de imagem ou vídeo

A extensão aceita **um vídeo de até 60 MB** e **até quatro imagens de até 60 MB cada**.

1. Clique em **Escolher vídeo** e selecione o vídeo, se quiser enviar um.
2. Clique em **Adicionar imagem (+)** para escolher a primeira imagem.
3. Clique novamente no botão **+** para acumular até quatro imagens, sem apagar as anteriores.
4. Aguarde a barra de carregamento terminar.
5. Escreva a descrição com emojis no campo de mensagem.
6. Envie usando o destino escolhido.

Os arquivos são enviados individualmente, em sequência, na mesma conversa. Essa estrutura evita que uma imagem substitua o vídeo no WhatsApp Web.

O botão **Remover arquivo** cancela o anexo selecionado. Também existe um campo para **Link do vídeo/imagem**, usado quando o arquivo está em uma URL pública.

Se o arquivo ultrapassar 60 MB, compacte ou reduza o vídeo antes de tentar novamente.

## 8. Os três destinos de envio

### 8.1 Enviar para telefones extraídos

Use o botão **ENVIAR PARA CONTATOS SELECIONADOS** ou o botão **ENVIAR SELECIONADOS** dentro da Revisão de Contatos.

Esse é o fluxo correto para o seu exemplo de 500 telefones. Marque 20, prepare a mensagem e confirme. A extensão envia para os 20 números, um por vez.

Antes de confirmar, a janela mostra a quantidade, o modo da mensagem e o intervalo. Se a quantidade estiver errada, cancele e volte à Revisão de Contatos.

### 8.2 Enviar somente na conversa aberta

Use **ENVIAR SOMENTE NA CONVERSA ABERTA** quando quiser publicar uma única mensagem na conversa ou grupo que está aberto naquele momento no WhatsApp Web.

Esse botão não usa a lista de 500 telefones. Ele envia apenas no chat atualmente aberto.

### 8.3 Enviar para grupos marcados

1. Clique em **Carregar grupos / comunidades**.
2. Aguarde a lista aparecer.
3. Marque os grupos desejados.
4. Clique em **Enviar para grupos marcados**.
5. Confirme a quantidade.

Esse botão publica dentro de cada grupo escolhido. Se o WhatsApp mostrar “somente admins podem enviar mensagens”, a conta não tem permissão para publicar naquele grupo. Nesse caso, volte para a Revisão de Contatos e use o envio individual para os telefones selecionados.

O checkbox **Listar todos os chats** amplia a leitura para conversas e grupos. Deixe desmarcado quando quiser carregar somente grupos e comunidades.

## 9. Adicionar contatos a grupo aberto

O botão **Adicionar contatos ao grupo aberto** serve para adicionar contatos da sua lista a um grupo que você administra ou onde o WhatsApp autoriza adicionar participantes.

Ele não faz três coisas: não coloca seu número em grupo fechado sem convite, não recupera grupo excluído e não transforma automaticamente um grupo inacessível em grupo aceito. Para entrar em grupo fechado, é necessário convite, link oficial ou aprovação de administrador.

## 10. Banco de Leads Unificado

O Banco guarda as listas localmente no navegador.

| Ação | Resultado |
|---|---|
| **Carregar** | Coloca a lista escolhida na área de revisão. |
| **Renomear** | Troca o nome da lista sem alterar os contatos. |
| **Copiar** | Copia os dados para uso em outro lugar. |
| **CSV** | Exporta a lista para planilha. |
| **Excluir** | Remove a lista salva. |
| **Limpar tudo** | Apaga todas as listas locais. Use somente se tiver certeza. |

Sugestão: salve listas com nomes fáceis, como `Grupo Escola - 500 contatos - 2026-08-10`.

## 11. Agendamento 24/7

O agendamento serve para preparar um envio futuro.

1. Escolha a data.
2. Escolha o horário.
3. Selecione a plataforma.
4. Deixe a lista correta carregada no Banco.
5. Confira a mensagem e o arquivo.
6. Clique em **Agendar disparo em massa**.

O navegador precisa permanecer aberto e o WhatsApp Web precisa continuar conectado. Antes de agendar, verifique se a lista e o destino estão corretos.

## 12. Esquenta: rotina de contato autorizado

A aba Esquenta não deve ser usada para criar contatos aleatórios. Ela serve somente para números que autorizaram a comunicação.

Cole os números, um por linha, escreva a mensagem, marque a confirmação de consentimento e escolha a frequência. O mínimo é 5 minutos. Use **Iniciar rotina** para começar e **Parar rotina** para interromper.

## 13. O que fazer quando algo não funciona

| Mensagem ou situação | O que verificar |
|---|---|
| “Abra o WhatsApp Web” | Abra o WhatsApp Web na aba ativa e aguarde carregar. |
| “Nenhum contato selecionado” | Volte à Revisão e use Top 20, Todos ou marque os contatos manualmente. |
| Enviou para conversa errada | Use o envio para telefones selecionados, não o botão de conversa aberta. |
| “Somente admins podem enviar” | Não tente publicar no grupo. Use os telefones extraídos para envio individual. |
| Nome apareceu como número | O WhatsApp não mostrou o nome; use Buscar nomes dos contatos ou mantenha o número. |
| Vídeo maior que 60 MB | Comprima ou reduza o arquivo. |
| Lista vazia | Carregue a lista pelo Banco ou faça uma nova extração. |
| Ação travou | Recarregue o WhatsApp Web, aguarde e tente novamente com uma quantidade menor. |

## 14. Regra prática para não se confundir

> **Quero falar com cada telefone:** Revisão de Contatos → marcar contatos → **Enviar selecionados**.
>
> **Quero publicar dentro de um grupo:** abrir o grupo → **Enviar somente na conversa aberta**.
>
> **Quero publicar em vários grupos:** carregar grupos → marcar grupos → **Enviar para grupos marcados**.
>
> **O grupo só permite administradores:** não publicar no grupo → usar os telefones extraídos e o envio individual.

## 15. Uso responsável

Use a extensão somente com contatos e grupos para os quais você tenha autorização ou uma base legítima de comunicação. A extensão não garante entrega, não ignora regras do WhatsApp, não libera grupos fechados e não deve ser usada para spam, assédio ou mensagens não solicitadas.

**Versão do manual:** 7.9.0, com modo WhatsApp-only, logo MR Sem Limite em destaque e suporte a um vídeo mais até quatro imagens.
