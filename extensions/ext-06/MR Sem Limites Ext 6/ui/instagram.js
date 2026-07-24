/* MR Sem Limites EXT5 — Instagram Publisher
 * OAuth via Meta Graph API. Backend em /api/public/instagram-* (mrsemlimitesext.lovable.app)
 */
(function(){
  const API_BASE = 'https://mrsemlimitesext.lovable.app';
  const STORAGE_KEY = 'mrsl_ig_account';
  let currentType = 'post';

  function $(id){ return document.getElementById(id); }
  function log(msg, ok){
    const el = $('igPublishLog'); if(!el) return;
    const c = ok===true?'#7CFFB2':ok===false?'#ff6b6b':'#e8faff';
    el.innerHTML = `<div style="color:${c}">• ${msg}</div>` + el.innerHTML;
  }

  async function loadAccount(){
    return new Promise(r => chrome.storage.local.get([STORAGE_KEY], d => r(d[STORAGE_KEY]||null)));
  }
  async function saveAccount(a){
    return new Promise(r => chrome.storage.local.set({[STORAGE_KEY]: a}, r));
  }
  async function clearAccount(){
    return new Promise(r => chrome.storage.local.remove([STORAGE_KEY], r));
  }

  function renderStatus(acc){
    const st = $('igStatusText'); const info = $('igAccountInfo');
    const pub = $('igPublishCard'); const btnC = $('igConnectBtn'); const btnD = $('igDisconnectBtn');
    if(!st) return;
    if(acc){
      st.textContent = '🟢 Conectado';
      info.style.display = 'block';
      info.innerHTML = `@${acc.username||'—'} • ID: ${acc.ig_user_id||'—'}`;
      pub.style.display = 'block';
      btnC.style.display = 'none';
      btnD.style.display = 'block';
    } else {
      st.textContent = '🔴 Não conectado';
      info.style.display = 'none';
      pub.style.display = 'none';
      btnC.style.display = 'block';
      btnD.style.display = 'none';
    }
  }

  async function startOAuth(){
    // Abre a página do backend que redireciona para o Facebook OAuth
    const returnUrl = chrome.runtime.getURL('sidepanel.html');
    const url = `${API_BASE}/api/public/instagram-oauth-start?ext_return=${encodeURIComponent(returnUrl)}`;
    // Abrir janela popup para o usuário fazer login
    const w = window.open(url, 'ig_oauth', 'width=560,height=720');
    // Ouvir mensagens da janela de callback
    const handler = async (ev) => {
      if(!ev.data || ev.data.type !== 'MRSL_IG_CONNECTED') return;
      window.removeEventListener('message', handler);
      const acc = ev.data.account;
      await saveAccount(acc);
      renderStatus(acc);
      try{ w && w.close(); }catch(_){}
    };
    window.addEventListener('message', handler);
    // Fallback: polling do storage caso o postMessage falhe (janela em outra origem)
    const poll = setInterval(async ()=>{
      try{
        const r = await fetch(`${API_BASE}/api/public/instagram-poll?ext_id=${chrome.runtime.id}`);
        if(!r.ok) return;
        const d = await r.json();
        if(d && d.account){
          clearInterval(poll);
          await saveAccount(d.account);
          renderStatus(d.account);
          try{ w && w.close(); }catch(_){}
        }
      }catch(_){}
    }, 2500);
    setTimeout(()=>clearInterval(poll), 5*60*1000);
  }

  async function publish(){
    const acc = await loadAccount();
    if(!acc){ log('Conecte sua conta primeiro.', false); return; }
    const mediaUrl = $('igMediaUrl').value.trim();
    const caption = $('igCaption').value.trim();
    if(!mediaUrl){ log('Informe a URL da mídia.', false); return; }
    log('Enviando para o Instagram…');
    try{
      const r = await fetch(`${API_BASE}/api/public/instagram-publish`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          access_token: acc.access_token,
          ig_user_id: acc.ig_user_id,
          type: currentType,
          media_url: mediaUrl,
          caption
        })
      });
      const d = await r.json();
      if(r.ok && d.id){ log(`✅ Publicado! ID: ${d.id}`, true); }
      else { log(`❌ ${d.error||'Falha na publicação'}`, false); }
    }catch(e){ log(`❌ ${e.message}`, false); }
  }

  function bind(){
    if(!$('igConnectBtn')) return false;
    $('igConnectBtn').addEventListener('click', startOAuth);
    $('igDisconnectBtn').addEventListener('click', async ()=>{ await clearAccount(); renderStatus(null); });
    $('igPublishBtn').addEventListener('click', publish);
    document.querySelectorAll('.igTypeBtn').forEach(b=>{
      b.addEventListener('click', ()=>{
        document.querySelectorAll('.igTypeBtn').forEach(x=>{
          x.classList.remove('active');
          x.style.background='transparent';
          x.style.border='1px solid rgba(255,255,255,.1)';
        });
        b.classList.add('active');
        b.style.background='rgba(225,48,108,.15)';
        b.style.border='1px solid rgba(225,48,108,.4)';
        currentType = b.dataset.type;
      });
    });
    loadAccount().then(renderStatus);
    return true;
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bind);
  } else { bind(); }
})();
