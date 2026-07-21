## Objetivo

Refazer a aba **Instagram** da EXT5 para:
1. Cada usuário conectar a **própria conta** do Instagram (não @linkmrstore).
2. IA gerar a mídia (imagem/vídeo), título, descrição e hashtags — usuário só digita o tema.
3. Mostrar **preview** antes de publicar. Após aprovar, publica no IG do usuário.

---

## O que muda

### 1. Login no painel (novo)
- Ativar auth Email/senha + Google no Lovable Cloud (`supabase--configure_social_auth`).
- Criar `/auth` (login/signup) e mover a home do painel para `_authenticated/`.
- Cada usuário fica com sessão própria → seus tokens IG ficam isolados.

### 2. Instagram OAuth por usuário
- Nova tabela `public.instagram_connections` (server-only, criptografada):
  - `user_id`, `ig_user_id`, `ig_username`, `access_token_ciphertext`, `expires_at`.
- Server functions:
  - `startInstagramConnect` → devolve URL OAuth Meta com `state=userId`.
  - `/api/public/instagram-callback` → recebe code, troca por long-lived token, salva na tabela do usuário logado.
  - `getMyInstagramStatus` → retorna `{connected, username}`.
  - `disconnectInstagram` → apaga registro.
- Segredo `INSTAGRAM_APP_SECRET` (já temos App ID 1985407092142827 e access token global — este último vira legado, só para fallback interno).

### 3. Geração de conteúdo por IA
Server function `generateInstagramContent({tema, tipo})`:
- **Post/Carrossel** → `google/gemini-3.1-flash-image` (Nano Banana 2) gera 1 ou 3-5 imagens.
- **Reel** → gera imagem base + `videogen` (5-10s).
- **Legenda + hashtags** → `google/gemini-2.5-flash` (texto).
- Retorna `{mediaUrls[], caption, hashtags[]}` para o frontend.

### 4. UI Instagram (redesenhada)
Substitui os campos de URL/legenda por:
```
[ Tema/descrição do post ]         (textarea)
[ Post ] [ Reel ] [ Carrossel ]    (tipo)
[ ✨ Gerar com IA ]                (botão)
      ↓
[ Preview: mídia gerada + legenda editável + hashtags ]
[ ✏️ Regerar ]  [ 🚀 Publicar no meu Instagram ]
```
- Sem input de URL, sem "@linkmrstore". Só mostra `@username` do usuário logado.

### 5. Publicação
`publishToMyInstagram({mediaUrls, caption})`:
- Lê token do usuário logado (via `requireSupabaseAuth` + tabela).
- Chama Graph API v20 (`/media` + `/media_publish`) em nome do usuário.
- Retorna link do post publicado.

### 6. Extensão (ZIP)
Atualizar `ui/ig-publisher.js`:
- Botão "Conectar Instagram" → abre popup OAuth (URL vinda do painel).
- Após conectar, mostra `@username` do usuário.
- Formulário passa a ser: tema → gerar → preview → publicar.
- Empacotar como `MR-Sem-Limites-EXT5-v5.1.0.zip`.

---

## Detalhes técnicos

**Criptografia do token IG**: AES-256-GCM com `APP_USER_CONNECTION_KEY_SECRET` (auto-provisionado). Nunca em texto puro no DB.

**Redirect URI OAuth**: `https://mrsemlimitesext.lovable.app/api/public/instagram-callback` (fixo, já autorizado no Meta App).

**Modo Dev do App Meta**: enquanto não passar em App Review, só contas adicionadas como testadoras conseguem conectar. Vou avisar isso na UI.

**Segredos necessários**:
- `INSTAGRAM_APP_ID` = 1985407092142827 (código)
- `INSTAGRAM_APP_SECRET` (secreto — preciso pedir)
- `APP_USER_CONNECTION_KEY_SECRET` (auto)

**Sem quebrar as outras extensões**: mudanças só em `src/routes/api/instagram-*`, `src/routes/_authenticated/`, aba Instagram do painel, e ZIP EXT5. EXT1–EXT4 intactas.

---

## Fora do escopo (desta rodada)
- App Review Meta (você faz depois no dashboard Meta).
- Agendamento de posts.
- Analytics de posts publicados.

Se aprovar, começo pedindo o `INSTAGRAM_APP_SECRET`, ativo auth e sigo os passos 1→6.