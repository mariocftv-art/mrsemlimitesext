# MR Sem Limite — autorização e integração futura

## Autorização autoral

A extensão **MR Social Growth — MR Sem Limite** é uma obra de propriedade e distribuição autorizada por **MR Sem Limite**. O código, a interface, os textos, o manual, a identidade visual e os fluxos de operação não devem ser copiados, redistribuídos, revendidos ou incorporados a outro produto sem autorização expressa do titular.

Esta declaração identifica a autoria e a licença de uso, mas não transforma o código entregue ao navegador em um segredo impossível de examinar. A distribuição protegida usa compactação/ofuscação para dificultar cópias casuais; a proteção efetiva de acesso deve ser feita pelo backend.

## Chave de desenvolvimento

`MRSL-DEV-REPLACE-IN-LOVABLE`

Esse valor é apenas um marcador de desenvolvimento. Ele não é uma chave secreta, não libera produção e deve ser substituído pelo sistema de licenças do projeto Lovable.

## Contrato recomendado do backend

O backend deverá oferecer um endpoint HTTPS, por exemplo `POST /api/license/validate`, que receba uma chave de licença e informações mínimas do cliente. A resposta deve conter `valid`, `product`, `expiresAt`, `installationId` e um token temporário assinado. A extensão deve guardar somente o token temporário e a chave pública de verificação; segredos de assinatura, credenciais de banco e tokens administrativos permanecem no servidor.

O painel do Lovable deverá permitir criar, suspender, revogar e renovar chaves. A validação deve ocorrer novamente em intervalos definidos pelo backend, com tolerância limitada para indisponibilidade temporária. A licença não deve ser considerada válida apenas porque alguém alterou um valor local no ZIP.

## Ativação futura

1. Substituir `licenseApiBaseUrl` pela URL real do backend Lovable.
2. Inserir somente a chave pública usada para verificar a assinatura do token.
3. Fazer a extensão solicitar a chave de licença na primeira abertura.
4. Associar a licença a um identificador de instalação não invasivo e aplicar o limite definido pelo proprietário.
5. Liberar os módulos somente após validação do backend.

Não coloque uma senha mestra, segredo do banco ou chave privada dentro da extensão. Qualquer segredo entregue ao navegador pode ser extraído.
