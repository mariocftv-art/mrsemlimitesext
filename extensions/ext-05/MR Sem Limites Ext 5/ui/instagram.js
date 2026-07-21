(function () {
  'use strict';

  const STATUS_API = 'https://mrsemlimitesext.lovable.app/api/public/instagram-status';
  const PUBLISH_API = 'https://mrsemlimitesext.lovable.app/api/public/instagram-publish';
  const $ = (id) => document.getElementById(id);

  function setStatus(text, ok) {
    const el = $('mrIgStatus');
    if (!el) return;
    el.textContent = text;
    el.style.color = ok ? '#86efac' : '#fca5a5';
  }

  async function loadInstagramUser() {
    const user = $('mrIgUser');
    if (!user) return;
    user.textContent = 'verificando…';
    try {
      const response = await fetch(STATUS_API, { method: 'GET' });
      const data = await response.json().catch(() => ({}));
      if (data.connected) {
        user.textContent = data.username ? '@' + data.username : 'conectado';
        setStatus('Instagram conectado e pronto para publicar.', true);
      } else {
        user.textContent = 'não conectado';
        setStatus(data.error || 'Token do Instagram ainda não está configurado no servidor.', false);
      }
    } catch (error) {
      user.textContent = 'erro';
      setStatus('Não consegui verificar o Instagram agora.', false);
    }
  }

  async function publishInstagram(btn) {
    const type = $('mrIgType')?.value || 'post';
    const mediaUrl = $('mrIgUrl')?.value?.trim() || '';
    const caption = $('mrIgCaption')?.value || '';

    if (!mediaUrl) {
      setStatus('Informe a URL pública da mídia antes de publicar.', false);
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Publicando…';
    setStatus('Enviando para o Instagram…', true);

    try {
      const response = await fetch(PUBLISH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ use_server_token: true, type, media_url: mediaUrl, caption }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Erro ao publicar');
      setStatus('Publicado com sucesso! ID: ' + data.id, true);
    } catch (error) {
      setStatus('Erro: ' + (error?.message || 'falha ao publicar'), false);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Publicar agora';
    }
  }

  document.addEventListener('DOMContentLoaded', loadInstagramUser);
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.id === 'mrIgPublish') publishInstagram(target);
  });
})();