// MR Sem Limites EXT3 — offscreen voice recognition for Manifest V3.
// MV3 blocks inline scripts in extension pages, so this logic must live here.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let silenceTimer = null;
let hardStopTimer = null;
let lastText = '';
const SILENCE_DELAY_MS = 1500;
const HARD_STOP_MS = 12000;

function broadcast(data) {
  try { chrome.runtime.sendMessage(data).catch(() => {}); } catch (_) {}
}

function clearTimers() {
  if (silenceTimer) clearTimeout(silenceTimer);
  if (hardStopTimer) clearTimeout(hardStopTimer);
  silenceTimer = null;
  hardStopTimer = null;
}

function stopCurrent(useAbort = false) {
  clearTimers();
  if (!recognition) return;
  try { useAbort ? recognition.abort() : recognition.stop(); } catch (_) {}
}

function armSilenceTimer() {
  if (silenceTimer) clearTimeout(silenceTimer);
  silenceTimer = setTimeout(() => stopCurrent(false), SILENCE_DELAY_MS);
}

function buildText(finalText, interimText) {
  return [finalText, interimText].map((v) => String(v || '').trim()).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

async function startVoice(msg) {
  stopCurrent(true);
  recognition = null;
  lastText = String(msg?.existingText || '').trim();

  if (!SpeechRecognition) {
    broadcast({ type: 'VOICE_ERROR', error: 'not-supported' });
    return { ok: false, error: 'not-supported' };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
  } catch (err) {
    broadcast({ type: 'VOICE_ERROR', error: err?.name === 'NotFoundError' ? 'audio-capture' : 'not-allowed' });
    return { ok: false, error: 'not-allowed' };
  }

  try {
    const rec = new SpeechRecognition();
    recognition = rec;
    rec.lang = msg?.lang || 'pt-BR';
    rec.continuous = true;
    rec.interimResults = true;

    let finalText = String(msg?.existingText || '').trim();

    rec.onstart = () => {
      clearTimers();
      broadcast({ type: 'VOICE_STATUS', status: 'started' });
      hardStopTimer = setTimeout(() => stopCurrent(false), HARD_STOP_MS);
    };

    rec.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i]?.[0]?.transcript || '';
        if (event.results[i]?.isFinal) finalText = buildText(finalText, transcript);
        else interim = buildText(interim, transcript);
      }
      const text = buildText(finalText, interim);
      if (!text) return;
      lastText = text;
      broadcast({ type: 'VOICE_RESULT', text, finalText });
      armSilenceTimer();
    };

    rec.onerror = (event) => {
      const error = event?.error || 'voice-error';
      if (error !== 'aborted' && error !== 'no-speech') broadcast({ type: 'VOICE_ERROR', error });
    };

    rec.onend = () => {
      clearTimers();
      broadcast({ type: 'VOICE_STATUS', status: 'ended', finalText: lastText });
      if (recognition === rec) recognition = null;
    };

    rec.start();
    return { ok: true };
  } catch (err) {
    clearTimers();
    recognition = null;
    broadcast({ type: 'VOICE_ERROR', error: err?.message || 'start-failed' });
    return { ok: false, error: err?.message || 'start-failed' };
  }
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.target !== 'offscreen') return false;

  if (msg.type === 'OFFSCREEN_VOICE_START') {
    startVoice(msg).then(sendResponse).catch((err) => {
      const error = err?.message || 'voice-start-failed';
      broadcast({ type: 'VOICE_ERROR', error });
      sendResponse({ ok: false, error });
    });
    return true;
  }

  if (msg.type === 'OFFSCREEN_VOICE_STOP') {
    stopCurrent(false);
    recognition = null;
    sendResponse({ ok: true });
    return true;
  }

  return false;
});