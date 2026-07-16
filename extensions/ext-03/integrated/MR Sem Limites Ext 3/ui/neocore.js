(() => {
  'use strict';

  const home = document.getElementById('ext3-home');
  if (!home) return;

  const closeHome = document.getElementById('ext3CloseHome');
  const menuBtn = document.getElementById('ext3MenuBtn');
  const openHome = document.getElementById('ext3OpenHome');
  const IA_PICK_KEY = 'mr_ia_pick_v1';

  function showHome() {
    home.classList.remove('hidden');
  }
  function hideHome() {
    home.classList.add('hidden');
  }

  // Botão × agora leva ao Chat (aba real) em vez de esconder a home
  closeHome?.addEventListener('click', () => {
    activateRealTab('chat');
    hideHome();
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
      hideHome();
    });
  });

  // Clique nas abas laterais reais também esconde a home
  document.querySelectorAll('.mr-tab[data-mrtab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.dataset.mrtab === 'home') showHome();
      else hideHome();
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
      u.lang = 'pt-BR'; u.rate = 1.05; u.pitch = 1.05; u.volume = 1;
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

  const TRIGGERS = ['enviar para o lovable','manda pro lovable','manda para o lovable','envia pro lovable','executa','executar','pode enviar','manda ai','manda aí','envia agora'];
  const hasTrigger = (t) => TRIGGERS.some((k) => String(t || '').toLowerCase().includes(k));

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
    if (!promptText || !promptText.trim()) { alert('Digite ou fale um comando primeiro.'); return; }
    // NÃO esconder a home — envia o comando em background e mantém o painel MR visível.
    setOrbState('think', 'WORKING', 'Sending command');
    try {
      if (typeof window.sendDirectLovableMessage === 'function') {
        await window.sendDirectLovableMessage(promptText);
      } else {
        const message = document.getElementById('message');
        const sendBtn = document.getElementById('sendBtn');
        if (!message || !sendBtn) throw new Error('Painel de chat indisponível.');
        message.value = promptText;
        message.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise((r) => setTimeout(r, 250));
        sendBtn.click();
      }
      setOrbState('idle', 'ENVIADO', 'Comando executado');
    } catch (e) {
      setOrbState('idle', 'ERRO', e?.message || 'Falha ao enviar');
    }
  }

  const sendToLovableFromVoice = () => sendPromptRaw(buildPromptFromConversation());

  function handleSpokenText(text) {
    logMsg('u', text);
    conversation.push({ who: 'u', text });
    if (hasTrigger(text)) {
      const msg = 'Perfeito, enviando o plano para o Lovable agora.';
      setOrbState('think', 'WORKING', 'Sending command');
      logMsg('a', msg);
      speak(msg);
      setTimeout(sendToLovableFromVoice, 400);
      return;
    }
    const reply = 'Anotado. Pode continuar falando, ou diga "enviar para o Lovable" quando estiver pronto.';
    setOrbState('listen', 'LISTENING', 'Fale seu comando');
    logMsg('a', reply);
    speak(reply);
    // Re-arma reconhecimento em paralelo (não depende do onend de speak,
    // que costuma falhar em alguns browsers)
    if (orb?.dataset.mode === 'on') {
      setTimeout(() => { if (orb?.dataset.mode === 'on') startRecognition(false); }, 600);
    }
  }

  function startRecognition(intoInput) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      if (intoInput && cmdInput) cmdInput.focus();
      else {
        const text = prompt('Reconhecimento de voz indisponível. Digite o comando para a Orbe:');
        if (text) handleSpokenText(text);
        else setOrbState('idle');
      }
      return;
    }
    if (recognizing) { try { recognition.stop(); } catch (_) {} return; }
    try { recognition && recognition.abort(); } catch (_) {}
    recognition = new SR();
    recognition.lang = 'pt-BR'; recognition.interimResults = false; recognition.continuous = false;
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
        let granted = false;
        try {
          const p = await navigator.permissions.query({ name: 'microphone' });
          granted = p.state === 'granted';
        } catch (_) {}
        if (granted) {
          // Falso positivo — tenta reiniciar sem bloquear
          if (!intoInput && orb?.dataset.mode === 'on') {
            setTimeout(() => { if (orb?.dataset.mode === 'on') startRecognition(false); }, 400);
            return;
          }
          if (!intoInput) setOrbState('listen', 'LISTENING', 'Fale seu comando');
          return;
        }
        setOrbState('idle', 'MIC BLOQUEADO', 'Permita o microfone e tente novamente');
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
      if (!intoInput && orb?.dataset.mode === 'on') {
        // Auto-reinicia enquanto o modo conversa estiver ativo
        setTimeout(() => { if (orb?.dataset.mode === 'on') startRecognition(false); }, 250);
      }
    };
    recognition.onresult = (ev) => {
      const text = ev.results?.[0]?.[0]?.transcript || '';
      if (!text) return;
      if (intoInput && cmdInput) {
        cmdInput.value = cmdInput.value ? `${cmdInput.value} ${text}` : text;
        cmdInput.focus();
      } else {
        handleSpokenText(text);
      }
    };
    try { recognition.start(); } catch (_) {
      // Se start falhar (ex.: já iniciado), tenta novamente em breve
      setTimeout(() => { try { recognition.start(); } catch (_) {} }, 250);
    }
  }

  // Clique na Orbe: ativa/desativa modo conversa
  // IMPORTANTE: startRecognition() DEVE ser chamado SÍNCRONO neste handler
  // para preservar o contexto de gesto do usuário (senão o browser bloqueia).
  orb?.addEventListener('click', () => {
    if (orb.dataset.mode === 'on') {
      orb.dataset.mode = 'off';
      try { recognition && recognition.stop(); } catch (_) {}
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
    // Fala e reconhecimento em paralelo — assim o gesto do usuário
    // ainda está ativo quando SpeechRecognition.start() é chamado.
    speak(msg);
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
    if (recognizing) { try { recognition.stop(); } catch (_) {} cmdMic?.classList.remove('active'); return; }
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
    if (lsVisible) home.classList.add('hidden');
    // NÃO reabrimos automaticamente: se o usuário fechou ou clicou numa aba,
    // a home permanece escondida para não misturar com o painel real.
  }
  setInterval(syncOverlay, 1500);
  syncOverlay();
})();
