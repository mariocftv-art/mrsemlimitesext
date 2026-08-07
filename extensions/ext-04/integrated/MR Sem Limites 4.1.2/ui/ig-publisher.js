/**
 * MR Sem Limites EXT5 — Instagram Publisher (server-side token)
 * Não abre login do Facebook. Usa o token @linkmrstore salvo no Lovable Cloud.
 */
(function () {
  const BASE = 'https://mrsemlimitesext.lovable.app';
  const STATUS_URL = BASE + '/api/public/instagram-status';
  const PUBLISH_URL = BASE + '/api/public/instagram-publish';

  const $ = (id) => document.getElementById(id);
  const log = (m, ok) => {
    const el = $('igPublishLog'); if (!el) return;
    const c = ok === true ? '#4ade80' : ok === false ? '#f87171' : '#fff';
    el.innerHTML = `<div style="color:${c}">${m}</div>` + el.innerHTML;
  };

  let currentType = 'post';

  async function refreshStatus() {
    const st = $('igStatusText'), info = $('igAccountInfo'), pub = $('igPublishCard');
    const bc = $('igConnectBtn'), bd = $('igDisconnectBtn');
    try {
      const r = await fetch(STATUS_URL, { cache: 'no-store' });
      const d = await r.json();
      if (d.connected) {
        st.textContent = '🟢 Conectado';
        info.style.display = 'block';
        info.innerHTML = `<b>@${d.username || '-'}</b> · ${d.account_type || 'IG'}<br><span style="opacity:.6">ID ${d.id}</span>`;
        if (pub) pub.style.display = 'block';
        if (bc) { bc.textContent = '✓ Conectado via servidor'; bc.disabled = true; bc.style.opacity = '.6'; bc.style.cursor = 'default'; }
        if (bd) bd.style.display = 'none';
      } else {
        st.textContent = '🔴 Não conectado';
        info.style.display = 'block';
        info.textContent = d.error || 'Token não configurado';
        if (pub) pub.style.display = 'none';
      }
    } catch (e) {
      st.textContent = '⚠️ Erro ao verificar';
      info.style.display = 'block';
      info.textContent = String(e?.message || e);
    }
  }

  async function publish() {
    const media_url = ($('igMediaUrl')?.value || '').trim();
    const caption = ($('igCaption')?.value || '').trim();
    if (!media_url) return log('❌ Informe a URL da mídia', false);
    log('⏳ Publicando ' + currentType + '…');
    try {
      const r = await fetch(PUBLISH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ use_server_token: true, type: currentType, media_url, caption }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      log(`✅ Publicado! ID ${d.id}`, true);
      $('igMediaUrl').value = ''; $('igCaption').value = '';
    } catch (e) {
      log('❌ ' + (e?.message || e), false);
    }
  }

  function wire() {
    if (!$('igConnectBtn')) return false;
    $('igConnectBtn').addEventListener('click', refreshStatus);
    const bd = $('igDisconnectBtn'); if (bd) bd.style.display = 'none';
    document.querySelectorAll('.igTypeBtn').forEach((b) => {
      b.addEventListener('click', () => {
        currentType = b.dataset.type;
        document.querySelectorAll('.igTypeBtn').forEach((x) => {
          x.classList.remove('active');
          x.style.background = 'transparent';
          x.style.border = '1px solid rgba(255,255,255,.1)';
        });
        b.classList.add('active');
        b.style.background = 'rgba(225,48,108,.15)';
        b.style.border = '1px solid rgba(225,48,108,.4)';
      });
    });
    $('igPublishBtn')?.addEventListener('click', publish);
    refreshStatus();
    return true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { if (!wire()) setTimeout(wire, 500); });
  } else {
    if (!wire()) setTimeout(wire, 500);
  }
})();
