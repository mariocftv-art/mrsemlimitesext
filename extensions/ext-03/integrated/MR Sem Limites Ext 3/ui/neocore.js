(() => {
  'use strict';

  const home = document.getElementById('ext3-home');
  if (!home) return;

  const closeHome = document.getElementById('ext3CloseHome');
  const menuBtn = document.getElementById('ext3MenuBtn');
  const openHome = document.getElementById('ext3OpenHome');
  const IA_PICK_KEY = 'mr_ia_pick_v1';
  let userLeftHome = false;

  function showHome() {
    userLeftHome = false;
    home.classList.remove('hidden');
  }
  function hideHome(fromUser) {
    if (fromUser) userLeftHome = true;
    home.classList.add('hidden');
  }

  // Botão × agora leva ao Chat (aba real) em vez de esconder a home
  closeHome?.addEventListener('click', () => {
    activateRealTab('chat');
    hideHome(true);
  });
  menuBtn?.addEventListener('click', () => {
    home.scrollTo({ top: 0, behavior: 'smooth' });
  });
  openHome?.addEventListener('click', showHome);

  // ---------- Navegação para abas reais da extensão ----------
  function activateRealTab(tabName) {
    const tab = document.querySelector(`.mr-tab[data-mrtab="${tabName}"]`);
    if (tab) tab.click();
  }

  document.querySelectorAll('.nc-item').forEach((el) => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.nc-item').forEach((n) => n.classList.remove('active'));
      el.classList.add('active');
      const t = el.dataset.tab;
      if (!t) return;
      if (t === 'home') { showHome(); return; }
      activateRealTab(t);
      hideHome(true);
    });
  });

  // Clique nas abas laterais reais também esconde a home
  document.querySelectorAll('.mr-tab[data-mrtab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.mrtab === 'home') showHome();
      else hideHome(true);
    });
  });

  // ---------- Relógio em tempo real ----------
  const clockEl = document.getElementById('ncClock');
  const dateEl = document.getElementById('ncDate');
  const DAYS = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const pad = (n) => String(n).padStart(2, '0');

  function tickClock() {
    const d = new Date();
    if (clockEl) clockEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    if (dateEl) dateEl.textContent = `${DAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]} · Horário Atual`;
  }
  tickClock();
  setInterval(tickClock, 1000);

  // ---------- Timer ----------
  const timerEl = document.getElementById('ncTimer');
  let timerSeconds = 0, timerRemaining = 0, timerInt = null, timerRunning = false;

  const fmt = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${pad(h)}:${pad(m)}:${pad(sec)}`;
  };
  const renderTimer = () => { if (timerEl) timerEl.textContent = fmt(Math.max(0, timerRemaining)); };
  function setTimerMinutes(min) {
    clearInterval(timerInt); timerRunning = false;
    timerSeconds = Math.max(1, Math.floor(Number(min) * 60));
    timerRemaining = timerSeconds; renderTimer();
  }
  function parseDuration(raw) {
    const text = String(raw || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const colon = text.match(/(\d+)\s*:\s*(\d+)/);
    if (colon) return parseInt(colon[1], 10) * 60 + parseInt(colon[2], 10);
    const hours = [...text.matchAll(/(\d+)\s*(h|hora|horas)/g)].reduce((a, m) => a + parseInt(m[1], 10), 0);
    const mins = [...text.matchAll(/(\d+)\s*(m|min|minuto|minutos)/g)].reduce((a, m) => a + parseInt(m[1], 10), 0);
    if (hours || mins) return hours * 60 + mins;
    const n = parseInt(text, 10);
    return Number.isFinite(n) ? n : 0;
  }

  setTimerMinutes(10);
  document.querySelectorAll('.nc-preset[data-min]').forEach((b) => {
    b.addEventListener('click', () => setTimerMinutes(parseInt(b.dataset.min, 10)));
  });
  document.getElementById('ncPresetCustom')?.addEventListener('click', () => {
    const raw = prompt('Tempo do timer (ex.: "3h 45m", "3 horas e 45 minutos", "90m", "2:30"):', '3h 45m');
    if (raw === null) return;
    const total = parseDuration(raw);
    if (!total || total <= 0) { alert('Valor inválido'); return; }
    setTimerMinutes(total);
  });
  document.getElementById('ncTimerStart')?.addEventListener('click', () => {
    if (timerRunning || timerRemaining <= 0) return;
    timerRunning = true;
    timerInt = setInterval(() => {
      timerRemaining -= 1; renderTimer();
      if (timerRemaining <= 0) {
        clearInterval(timerInt); timerRunning = false;
        finishBeep();
        speak('Tempo esgotado. Bom trabalho!');
        setTimeout(() => alert('⏰ Timer finalizado!'), 120);
      }
    }, 1000);
  });
  document.getElementById('ncTimerStop')?.addEventListener('click', () => {
    clearInterval(timerInt); timerRunning = false;
    timerRemaining = timerSeconds; renderTimer();
    try { window.speechSynthesis.cancel(); } catch (_) {}
  });

  // ---------- Áudio ----------
  let audioCtx = null;
  function ac() {
    if (!audioCtx) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {} }
    return audioCtx;
  }
  function beep(freq, dur, type) {
    const c = ac(); if (!c) return;
    try {
      if (c.state === 'suspended') c.resume();
      const o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.value = freq;
      o.connect(g); g.connect(c.destination);
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.22, c.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      o.start(); o.stop(c.currentTime + dur + 0.02);
    } catch (_) {}
  }
  function finishBeep() { beep(880, 0.25); setTimeout(() => beep(1320, 0.5), 260); }

  // ---------- Orbe + comandos ----------
  const orb = document.getElementById('ncOrb');
  const orbTitle = document.getElementById('ncOrbTitle');
  const orbStatus = document.getElementById('ncOrbStatus');
  const orbCaption = document.getElementById('ncOrbCaption');
  const voiceLog = document.getElementById('ncVoiceLog');
  const cmdBar = document.getElementById('ncCmdBar');
  const cmdInput = document.getElementById('ncCmdInput');
  const cmdSend = document.getElementById('ncCmdSend');
  const cmdMic = document.getElementById('ncCmdMic');
  const cmdAttach = document.getElementById('ncCmdAttach');
  let recognition = null, recognizing = false, conversation = [];
  let voiceMode = null, voiceText = '', voiceTimer = null, bridgeVoice = false;

  function setOrbState(s, title, subtitle) {
    if (!orb) return;
    orb.classList.remove('listening', 'thinking');
    orbCaption?.classList.remove('listen', 'think');
    if (s === 'listen') { orb.classList.add('listening'); orbCaption?.classList.add('listen'); }
    if (s === 'think')  { orb.classList.add('thinking');  orbCaption?.classList.add('think'); }
    if (orbTitle)  orbTitle.textContent  = title || (s === 'listen' ? 'LISTENING' : s === 'think' ? 'WORKING' : 'STANDBY');
    if (orbStatus) orbStatus.textContent = subtitle || (s === 'listen' ? 'Fale seu comando' : s === 'think' ? 'Sending command' : 'Clique na Orbe para ativar');
    // Mostra/oculta command bar: aparece quando desativada
    if (cmdBar) {
      if (orb.dataset.mode === 'on') cmdBar.classList.add('hidden');
      else cmdBar.classList.remove('hidden');
    }
  }

  const safeText = (t) => { const d = document.createElement('div'); d.textContent = String(t || ''); return d.innerHTML; };
  function logMsg(who, text) {
    if (!voiceLog) return;
    voiceLog.classList.add('show');
    const div = document.createElement('div');
    div.innerHTML = `<span class="${who === 'u' ? 'u' : 'a'}">${who === 'u' ? '▸ Você: ' : '◂ MR: '}</span>${safeText(text)}`;
    voiceLog.appendChild(div);
    voiceLog.scrollTop = voiceLog.scrollHeight;
  }
  let ptVoice = null;
  function pickVoice() {
    try {
      const voices = window.speechSynthesis.getVoices() || [];
      ptVoice =
        voices.find(v => /pt[-_]BR/i.test(v.lang) && /google/i.test(v.name)) ||
        voices.find(v => /pt[-_]BR/i.test(v.lang)) ||
        voices.find(v => /^pt/i.test(v.lang)) || null;
    } catch (_) {}
  }
  pickVoice();
  try { window.speechSynthesis.onvoiceschanged = pickVoice; } catch (_) {}

  function speak(text, onEnd) {
    let done = false;
    const finish = () => { if (done) return; done = true; try { onEnd && onEnd(); } catch (_) {} };
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'pt-BR'; u.rate = 0.96; u.pitch = 1.08; u.volume = 0.9;
      if (ptVoice) u.voice = ptVoice;
      u.onend = finish;
      u.onerror = finish;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      // Fallback: alguns browsers não disparam onend
      const est = Math.max(1500, Math.min(12000, text.length * 90));
      setTimeout(finish, est + 800);
    } catch (_) { setTimeout(finish, 400); }
  }

  const TRIGGERS = ['enviar para o lovable','manda pro lovable','manda para o lovable','envia pro lovable','executa','executar','pode enviar','manda ai','manda aí','envia agora','responde','responder','manda','enviar'];
  const hasTrigger = (t) => TRIGGERS.some((k) => String(t || '').toLowerCase().includes(k));
  const WAKE_WORDS = ['standby', 'stand by', 'ativar ia', 'ativa ia', 'orbe', 'mr'];
  const hasWakeWord = (t) => WAKE_WORDS.some((k) => String(t || '').toLowerCase().includes(k));
  const stripWakeWords = (t) => {
    let out = String(t || '').trim();
    WAKE_WORDS.forEach((k) => {
      out = out.replace(new RegExp(`(^|\\s)${k.replace(/\s+/g, '\\s+')}(?=\\s|,|:|-|$)`, 'ig'), ' ');
    });
    return out.replace(/^[\s,.:;-]+|[\s,.:;-]+$/g, '').replace(/\s{2,}/g, ' ').trim();
  };

  function canUseExtensionVoiceBridge() {
    return !!(window.chrome?.runtime?.sendMessage);
  }

  function startBridgeRecognition(intoInput) {
    if (!canUseExtensionVoiceBridge()) return false;
    bridgeVoice = true;
    voiceMode = intoInput ? 'input' : 'orb';
    voiceText = '';
    recognizing = true;
    if (intoInput) cmdMic?.classList.add('active');
    else setOrbState('listen', 'LISTENING', 'Fale seu comando');
    try {
      chrome.runtime.sendMessage({
        type: 'VOICE_START',
        lang: 'pt-BR',
        existingText: intoInput ? (cmdInput?.value || '') : ''
      }, () => void chrome.runtime.lastError);
      return true;
    } catch (_) {
      bridgeVoice = false;
      recognizing = false;
      cmdMic?.classList.remove('active');
      return false;
    }
  }

  function stopRecognition(silent) {
    clearTimeout(voiceTimer);
    voiceTimer = null;
    try { recognition && recognition.stop(); } catch (_) {}
    if (bridgeVoice) {
      try { chrome.runtime.sendMessage({ type: 'VOICE_STOP' }, () => void chrome.runtime.lastError); } catch (_) {}
    }
    recognition = null;
    recognizing = false;
    bridgeVoice = false;
    voiceMode = null;
    voiceText = '';
    cmdMic?.classList.remove('active');
    if (!silent && orb?.dataset.mode !== 'on') setOrbState('idle', 'STANDBY', 'Clique na Orbe para ativar');
  }

  function getIaDirective() {
    try {
      const pick = JSON.parse(localStorage.getItem(IA_PICK_KEY) || 'null');
      return pick?.directive ? `[MR SEM LIMITES — DIRECIONAMENTO IA]\n${pick.directive}\n\n` : '';
    } catch (_) { return ''; }
  }

  function buildPromptFromConversation() {
    const turns = conversation.filter((c) => c.who === 'u' && !hasTrigger(c.text)).map((c) => c.text.trim()).filter(Boolean);
    return `${getIaDirective()}Baseado na nossa conversa com a Orbe IA, monte e execute o plano abaixo usando o mesmo fluxo de comandos da extensão:\n\n- ${turns.join('\n- ')}`;
  }

  async function sendPromptRaw(promptText) {
    const cleanPrompt = String(promptText || '').trim();
    if (!cleanPrompt) { alert('Digite ou fale um comando primeiro.'); return; }
    // NÃO esconder a home — envia o comando em background e mantém o painel MR visível.
    setOrbState('think', 'WORKING', 'Sending command');
    try { window.mrPromptHistory?.push(cleanPrompt, 'orb'); } catch (_) {}
    try { window.mrAppendPromptToChat?.(cleanPrompt, 'user'); } catch (_) {}
    try {
      if (typeof window.sendDirectLovableMessage === 'function') {
        await window.sendDirectLovableMessage(cleanPrompt);
      } else {
        const message = document.getElementById('message');
        const sendBtn = document.getElementById('sendBtn');
        if (!message || !sendBtn) throw new Error('Painel de chat indisponível.');
        message.value = cleanPrompt;
        message.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise((r) => setTimeout(r, 250));
        sendBtn.click();
      }
      try { window.mrAppendPromptToChat?.('✅ Prompt enviado para o Lovable.', 'bot'); } catch (_) {}
      setOrbState('idle', 'ENVIADO', 'Comando executado');
    } catch (e) {
      try { window.mrAppendPromptToChat?.('❌ ' + (e?.message || 'Falha ao enviar'), 'bot'); } catch (_) {}
      setOrbState('idle', 'ERRO', e?.message || 'Falha ao enviar');
    }
  }

  const sendToLovableFromVoice = () => sendPromptRaw(buildPromptFromConversation());

  function handleSpokenText(text) {
    const rawText = String(text || '').trim();
    const cleanText = stripWakeWords(rawText);
    if (!cleanText && hasWakeWord(rawText)) {
      const reply = 'Estou ouvindo. Fale o comando agora.';
      logMsg('a', reply);
      setOrbState('listen', 'LISTENING', 'Fale seu comando');
      setTimeout(() => { if (orb?.dataset.mode === 'on') startRecognition(false); }, 350);
      return;
    }

    const finalText = cleanText || rawText;
    logMsg('u', finalText);
    conversation.push({ who: 'u', text: finalText });
    if (hasTrigger(finalText)) {
      const msg = 'Perfeito, enviando o plano para o Lovable agora.';
      setOrbState('think', 'WORKING', 'Sending command');
      logMsg('a', msg);
      speak(msg);
      setTimeout(sendToLovableFromVoice, 400);
      return;
    }
    const reply = 'Comando recebido. Enviando para o Lovable.';
    logMsg('a', reply);
    sendPromptRaw(`${getIaDirective()}${finalText}`).finally(() => {
      if (orb?.dataset.mode === 'on') {
        setTimeout(() => { if (orb?.dataset.mode === 'on' && !recognizing) startRecognition(false); }, 900);
      }
    });
  }

  function startRecognition(intoInput) {
    if (recognizing) { stopRecognition(true); return; }
    voiceMode = intoInput ? 'input' : 'orb';
    voiceText = '';
    bridgeVoice = false;
    startLocalRecognition(intoInput);
  }

  function startLocalRecognition(intoInput) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      if (startBridgeRecognition(intoInput)) return;
      if (intoInput && cmdInput) cmdInput.focus();
      else {
        const text = prompt('Reconhecimento de voz indisponível. Digite o comando para a Orbe:');
        if (text) handleSpokenText(text);
        else setOrbState('idle');
      }
      return;
    }
    try { recognition && recognition.abort(); } catch (_) {}
    recognition = new SR();
    let heardText = '';
    recognition.lang = 'pt-BR'; recognition.interimResults = true; recognition.continuous = false;
    recognition.onstart = () => {
      recognizing = true;
      if (intoInput) { cmdMic?.classList.add('active'); }
      else setOrbState('listen', 'LISTENING', 'Fale seu comando');
      beep(660, 0.12);
    };
    recognition.onerror = async (ev) => {
      recognizing = false;
      cmdMic?.classList.remove('active');
      const err = ev?.error || '';
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        // Verifica de verdade se o navegador permite antes de bloquear
        let state = 'unknown';
        try {
          const p = await navigator.permissions.query({ name: 'microphone' });
          state = p.state || 'unknown';
        } catch (_) {}
        if (state !== 'denied') {
          // Falso positivo comum em extension sidepanel: tenta pelo offscreen e nunca desliga a Orbe.
          if (startBridgeRecognition(intoInput)) return;
          if (!intoInput) setOrbState('listen', 'LISTENING', 'Toque novamente e fale');
          return;
        }
        setOrbState('idle', 'MIC OFF', 'Permita o microfone e toque novamente');
        if (orb) orb.dataset.mode = 'off';
        return;
      }
      if (err === 'no-speech' || err === 'aborted') {
        if (!intoInput && orb?.dataset.mode === 'on') {
          setTimeout(() => { if (orb?.dataset.mode === 'on') startRecognition(false); }, 300);
          return;
        }
      }
      if (!intoInput) setOrbState('idle', 'STANDBY', 'Toque a Orbe para falar');
    };
    recognition.onend = () => {
      recognizing = false;
      cmdMic?.classList.remove('active');
      const finalHeard = heardText.trim();
      if (finalHeard) {
        if (intoInput && cmdInput) {
          cmdInput.value = cmdInput.value ? `${cmdInput.value} ${finalHeard}` : finalHeard;
          cmdInput.dispatchEvent(new Event('input', { bubbles: true }));
          cmdInput.focus();
        } else {
          handleSpokenText(finalHeard);
        }
        return;
      }
      if (!intoInput && orb?.dataset.mode === 'on') {
        // Auto-reinicia enquanto o modo conversa estiver ativo
        setTimeout(() => { if (orb?.dataset.mode === 'on') startRecognition(false); }, 250);
      }
    };
    recognition.onresult = (ev) => {
      let text = '';
      for (let i = ev.resultIndex || 0; i < (ev.results?.length || 0); i++) {
        text += ev.results[i]?.[0]?.transcript || '';
      }
      heardText = text.trim() || heardText;
      if (!text) return;
    };
    try { recognition.start(); } catch (_) {
      if (startBridgeRecognition(intoInput)) return;
      // Se start falhar (ex.: já iniciado), tenta novamente em breve
      setTimeout(() => { try { recognition.start(); } catch (_) {} }, 250);
    }
  }

  try {
    chrome.runtime?.onMessage?.addListener((msg) => {
      if (!bridgeVoice || !msg || !voiceMode) return;
      if (msg.type === 'VOICE_STATUS') {
        if (msg.status === 'started') {
          recognizing = true;
          if (voiceMode === 'input') cmdMic?.classList.add('active');
          else setOrbState('listen', 'LISTENING', 'Fale seu comando');
        }
        if (msg.status === 'ended') {
          if (voiceMode === 'input') cmdMic?.classList.remove('active');
          recognizing = false;
          if (voiceMode === 'orb' && orb?.dataset.mode === 'on' && !voiceText.trim()) {
            setOrbState('listen', 'LISTENING', 'Fale seu comando');
            setTimeout(() => { if (orb?.dataset.mode === 'on' && !recognizing) startRecognition(false); }, 450);
          }
        }
        return;
      }
      if (msg.type === 'VOICE_RESULT') {
        const text = String(msg.text || '').trim();
        if (!text) return;
        if (voiceMode === 'input') {
          if (cmdInput) {
            cmdInput.value = text;
            cmdInput.focus();
          }
          return;
        }
        voiceText = text;
        setOrbState('listen', 'OUVINDO', 'Continue falando');
        clearTimeout(voiceTimer);
        voiceTimer = setTimeout(() => {
          const finalText = voiceText.trim();
          stopRecognition(true);
          if (finalText) handleSpokenText(finalText);
        }, 1250);
        return;
      }
      if (msg.type === 'VOICE_ERROR') {
        const err = String(msg.error || '');
        const currentMode = voiceMode;
        const canRetry = /no-speech|aborted|Content script|respondeu/i.test(err);
        stopRecognition(true);
        if (!currentMode || currentMode === 'input') return;
        if (canRetry && orb?.dataset.mode === 'on') {
          setOrbState('listen', 'LISTENING', 'Fale seu comando');
          setTimeout(() => { if (orb?.dataset.mode === 'on') startRecognition(false); }, 650);
          return;
        }
        if (/Abra o lovable|primeiro/i.test(err)) {
          setOrbState('idle', 'ABRA O LOVABLE', 'Deixe um projeto Lovable aberto');
          if (orb) orb.dataset.mode = 'off';
          return;
        }
        if (/not-allowed|service-not-allowed/i.test(err)) {
          setOrbState('listen', 'LISTENING', 'Microfone liberado? toque novamente');
          return;
        }
        setOrbState('idle', 'MIC OFF', 'Permita o microfone e toque novamente');
        if (orb) orb.dataset.mode = 'off';
      }
    });
  } catch (_) {}

  // Clique na Orbe: ativa/desativa modo conversa
  // IMPORTANTE: startRecognition() DEVE ser chamado SÍNCRONO neste handler
  // para preservar o contexto de gesto do usuário (senão o browser bloqueia).
  orb?.addEventListener('click', () => {
    if (orb.dataset.mode === 'on') {
      orb.dataset.mode = 'off';
      stopRecognition(true);
      try { window.speechSynthesis.cancel(); } catch (_) {}
      setOrbState('idle', 'STANDBY', 'Clique na Orbe para ativar');
      beep(440, 0.15);
      return;
    }
    orb.dataset.mode = 'on';
    conversation = [];
    if (voiceLog) { voiceLog.innerHTML = ''; voiceLog.classList.remove('show'); }
    const msg = 'Modo conversa ativo. Pode falar.';
    logMsg('a', msg);
    setOrbState('listen', 'LISTENING', 'Fale seu comando');
    // Não fala por cima do microfone: mostra o status e já começa a ouvir.
    startRecognition(false);
  });

  // Command bar
  cmdSend?.addEventListener('click', () => {
    const text = (cmdInput?.value || '').trim();
    if (!text) { cmdInput?.focus(); return; }
    const finalPrompt = `${getIaDirective()}${text}`;
    cmdInput.value = '';
    sendPromptRaw(finalPrompt);
  });
  cmdInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); cmdSend?.click(); }
  });
  cmdMic?.addEventListener('click', () => {
    // Se já está gravando, para. Senão, dispara reconhecimento no input.
    if (recognizing) { stopRecognition(true); return; }
    startRecognition(true);
  });

  // Attach: reaproveita input de arquivo original da extensão se existir
  cmdAttach?.addEventListener('click', () => {
    const nativeAttach =
      document.getElementById('attachBtn') ||
      document.querySelector('[data-attach], .attach-btn, .file-attach');
    if (nativeAttach) { nativeAttach.click(); return; }
    const fi = document.querySelector('input[type="file"]');
    if (fi) { fi.click(); return; }
    alert('Anexo indisponível no momento — abra o Chat para enviar arquivos.');
  });

  // Estado inicial da orbe
  setOrbState('idle', 'STANDBY', 'Clique na Orbe para ativar');

  function syncOverlay() {
    const ls = document.getElementById('licenseScreen');
    const lsVisible = ls && getComputedStyle(ls).display !== 'none';
    const app = document.getElementById('mainApp');
    const appVisible = app && getComputedStyle(app).display !== 'none';
    if (lsVisible) {
      home.classList.add('hidden');
      return;
    }
    // Depois da licença, a tela principal correta é a Home Neo-Core (print novo).
    // Só não reabre se o usuário saiu dela clicando em uma aba real.
    if (appVisible && !userLeftHome) home.classList.remove('hidden');
  }
  setInterval(syncOverlay, 1500);
  try {
    const app = document.getElementById('mainApp');
    if (app) new MutationObserver(syncOverlay).observe(app, { attributes: true, attributeFilter: ['style', 'class'] });
  } catch (_) {}
  syncOverlay();

  // ---------- Prompt history store (global, persistido) ----------
  const HIST_KEY = 'mr_prompt_history_v1';
  const HIST_MAX = 200;
  const listeners = new Set();
  let historyCache = [];
  function loadHistory(cb) {
    try {
      chrome.storage?.local?.get([HIST_KEY], (r) => {
        historyCache = Array.isArray(r?.[HIST_KEY]) ? r[HIST_KEY] : [];
        cb && cb();
        listeners.forEach((fn) => { try { fn(historyCache); } catch (_) {} });
      });
    } catch (_) { cb && cb(); }
  }
  function saveHistory() {
    try { chrome.storage?.local?.set({ [HIST_KEY]: historyCache }); } catch (_) {}
  }
  function pushHistory(text, source) {
    const clean = String(text || '').trim();
    if (!clean) return;
    historyCache.unshift({ text: clean, source: source || 'chat', ts: Date.now() });
    if (historyCache.length > HIST_MAX) historyCache.length = HIST_MAX;
    saveHistory();
    listeners.forEach((fn) => { try { fn(historyCache); } catch (_) {} });
  }
  window.mrPromptHistory = {
    get: () => historyCache.slice(),
    push: pushHistory,
    subscribe: (fn) => { listeners.add(fn); fn(historyCache); return () => listeners.delete(fn); },
    clear: () => { historyCache = []; saveHistory(); listeners.forEach((fn) => fn(historyCache)); },
  };
  loadHistory();

  // Grava prompts enviados pela orbe/command bar
  const _origSendRaw = sendPromptRaw;
  window.mrSendPrompt = async (text, source) => {
    pushHistory(text, source || 'tab');
    return _origSendRaw(text);
  };
  // Também intercepta envio direto (usado pelo painel real)
  try {
    const orig = window.sendDirectLovableMessage;
    if (typeof orig === 'function' && !orig.__mrWrapped) {
      const wrapped = async function (text) {
        pushHistory(text, 'lovable');
        return orig.apply(this, arguments);
      };
      wrapped.__mrWrapped = true;
      window.sendDirectLovableMessage = wrapped;
    } else {
      // Se ainda não existe, aguarda e envolve depois
      const iv = setInterval(() => {
        const fn = window.sendDirectLovableMessage;
        if (typeof fn === 'function' && !fn.__mrWrapped) {
          const wrapped = async function (text) {
            pushHistory(text, 'lovable');
            return fn.apply(this, arguments);
          };
          wrapped.__mrWrapped = true;
          window.sendDirectLovableMessage = wrapped;
          clearInterval(iv);
        }
      }, 400);
      setTimeout(() => clearInterval(iv), 15000);
    }
  } catch (_) {}

  // Registra prompt da command bar da orbe ANTES do handler limpar o input
  cmdSend?.addEventListener('click', () => {
    const t = (cmdInput?.value || '').trim();
    if (t) pushHistory(t, 'orb');
  }, true);
})();
