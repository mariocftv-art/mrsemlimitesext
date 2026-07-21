(function () {
  const btn = document.getElementById('allowBtn');
  const statusEl = document.getElementById('status');

  function setStatus(msg, cls) {
    statusEl.textContent = msg;
    statusEl.className = 'status ' + (cls || '');
  }

  btn.addEventListener('click', async () => {
    setStatus('Solicitando permissão...', '');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus('❌ Este navegador não expõe mediaDevices nesta página.', 'error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setStatus('✅ Permissão concedida! Pode fechar esta aba e voltar à extensão.', 'success');
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.style.cursor = 'default';
    } catch (err) {
      const name = (err && err.name) || 'Error';
      let msg = '❌ Permissão negada.';
      if (name === 'NotAllowedError') {
        msg = '❌ Permissão negada. Abra chrome://settings/content/microphone e permita o site desta extensão, depois recarregue esta aba.';
      } else if (name === 'NotFoundError') {
        msg = '❌ Nenhum microfone encontrado no sistema.';
      } else if (name === 'NotReadableError') {
        msg = '❌ O microfone está sendo usado por outro aplicativo.';
      } else {
        msg = '❌ Erro: ' + name + ' — ' + ((err && err.message) || '');
      }
      setStatus(msg, 'error');
    }
  });
})();
