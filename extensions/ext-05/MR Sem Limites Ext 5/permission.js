// MV3 requires external scripts on extension pages.
document.getElementById('allowBtn')?.addEventListener('click', async () => {
  const statusEl = document.getElementById('status');
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    if (statusEl) {
      statusEl.textContent = '✅ Permissão concedida! Pode fechar esta aba.';
      statusEl.className = 'status success';
    }
  } catch (_) {
    if (statusEl) {
      statusEl.textContent = '❌ Permissão negada. Verifique as configurações do navegador.';
      statusEl.className = 'status error';
    }
  }
});