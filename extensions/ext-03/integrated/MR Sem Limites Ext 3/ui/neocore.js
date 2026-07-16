(() => {
  'use strict';

  const home = document.getElementById('ext3-home');
  if (!home) return;

  const closeHome = document.getElementById('ext3CloseHome');
  const menuBtn = document.getElementById('ext3MenuBtn');
  const openHome = document.getElementById('ext3OpenHome');
  const pinBtn = document.querySelector('.nc-iconbtn[title="Fixar"]');
  const minBtn = document.querySelector('.nc-iconbtn[title="Minimizar"]');
  const IA_PICK_KEY = 'mr_ia_pick_v1';

  function showHome() {
    home.dataset.userDismissed = '';
    home.classList.remove('hidden');
  }

  function hideHome() {
    home.dataset.userDismissed = '1';
    home.classList.add('hidden');
  }

  closeHome?.addEventListener('click', hideHome);
  minBtn?.addEventListener('click', hideHome);
  menuBtn?.addEventListener('click', showHome);
  openHome?.addEventListener('click', showHome);
  pinBtn?.addEventListener('click', () => {
    home.dataset.pinned = home.dataset.pinned === '1' ? '' : '1';
    pinBtn.classList.toggle('active', home.dataset.pinned === '1');
  });

  function activateRealTab(tabName) {
    const tab = document.querySelector(`.mr-tab[data-mrtab="${tabName}"]`);
    if (tab) tab.click();
  }

  document.querySelectorAll('.nc-nav').forEach((el) => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.nc-nav').forEach((n) => n.classList.remove('active'));
      el.classList.add('active');
      if (el.dataset.tab) {
        activateRealTab(el.dataset.tab);
        hideHome();
        return;
      }
      setOrbState('idle', 'TOQUE PARA FALAR');
    });
  });

  const clockEl = document.getElementById('ncClock');
  const dateEl = document.getElementById('ncDate');
  const DAYS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const pad = (n) => String(n).padStart(2, '0');

  function tickClock() {
    const d = new Date();
    if (clockEl) clockEl.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    if (dateEl) dateEl.textContent = `${DAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
  }

  tickClock();
  setInterval(tickClock, 1000);

  const timerEl = document.getElementById('ncTimer');
  let timerSeconds = 0;
  let timerRemaining = 0;
  let timerInt = null;
  let timerRunning = false;

  function fmt(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${pad(h)}:${pad(m)}:${pad(sec)}`;
  }

  function renderTimer() {
    if (timerEl) timerEl.textContent = fmt(Math.max(0, timerRemaining));
  }

  function setTimerMinutes(min) {
    clearInterval(timerInt);
    timerRunning = false;
    timerSeconds = Math.max(1, Math.floor(Number(min) * 60));
    timerRemaining = timerSeconds;
    renderTimer();
  }

  function parseDuration(raw) {
    const text = String(raw || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const colon = text.match(/(\d+)\s*:\s*(\d+)/);
    if (colon) return parseInt(colon[1], 10) * 60 + parseInt(colon[2], 10);
    const hours = [...text.matchAll(/(\d+)\s*(h|hora|horas)/g)].reduce((sum, m) => sum + parseInt(m[1], 10), 0);
    const mins = [...text.matchAll(/(\d+)\s*(m|min|minuto|minutos)/g)].reduce((sum, m) => sum + parseInt(m[1], 10), 0);
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
    const total = parseDuration(raw);
    if (!total || total <= 0) {
      alert('Valor inválido');
      return;
    }
    setTimerMinutes(total);
  });
  document.getElementById('ncTimerStart')?.addEventListener('click', () => {
    if (timerRunning || timerRemaining <= 0) return;
    timerRunning = true;
    timerInt = setInterval(() => {
      timerRemaining -= 1;
      renderTimer();
      if (timerRemaining <= 0) {
        clearInterval(timerInt);
        timerRunning = false;
        finishBeep();
        speak('Tempo esgotado. Bom trabalho!');
        setTimeout(() => alert('⏰ Timer finalizado!'), 120);
      }
    }, 1000);
  });
  document.getElementById('ncTimerStop')?.addEventListener('click', () => {
    clearInterval(timerInt);
    timerRunning = false;
    timerRemaining = timerSeconds;
    renderTimer();
  });

  let audioCtx = null;
  function ac() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (_) {}
    }
    return audioCtx;
  }

  function beep(freq, dur, type) {
    const c = ac();
    if (!c) return;
    try {
      if (c.state === 'suspended') c.resume();
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type || 'sine';
      o.frequency.value = freq;
      o.connect(g);
      g.connect(c.destination);
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.22, c.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
      o.start();
      o.stop(c.currentTime + dur + 0.02);
    } catch (_) {}
  }

  function finishBeep() {
    beep(880, 0.25);
    setTimeout(() => beep(1320, 0.5), 260);
  }

  const orb = document.getElementById('ncOrb');
  const orbStatus = document.getElementById('ncOrbStatus');
  const voiceLog = document.getElementById('ncVoiceLog');
  let recognition = null;
  let recognizing = false;
  let conversation = [];

  function setOrbState(s, text) {
    if (!orb || !orbStatus) return;
    orb.classList.remove('listening', 'thinking');
    orbStatus.classList.remove('listen', 'think');
    if (s === 'listen') {
      orb.classList.add('listening');
      orbStatus.classList.add('listen');
    }
    if (s === 'think') {
      orb.classList.add('thinking');
      orbStatus.classList.add('think');
    }
    orbStatus.textContent = text || (s === 'listen' ? 'OUVINDO' : s === 'think' ? 'PENSANDO' : 'CONECTADO');
  }

  function safeText(text) {
    const div = document.createElement('div');
    div.textContent = String(text || '');
    return div.innerHTML;
  }

  function logMsg(who, text) {
    if (!voiceLog) return;
    voiceLog.classList.add('show');
    const div = document.createElement('div');
    div.innerHTML = `<span class="${who === 'u' ? 'u' : 'a'}">${who === 'u' ? '▸ Você: ' : '◂ MR: '}</span>${safeText(text)}`;
    voiceLog.appendChild(div);
    voiceLog.scrollTop = voiceLog.scrollHeight;
  }

  function speak(text, onEnd) {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'pt-BR';
      u.rate = 1.04;
      u.pitch = 1;
      if (onEnd) u.onend = onEnd;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (_) {
      if (onEnd) setTimeout(onEnd, 300);
    }
  }

  const TRIGGERS = ['enviar para o lovable', 'manda pro lovable', 'manda para o lovable', 'envia pro lovable', 'executa', 'executar', 'pode enviar', 'manda ai', 'manda aí', 'envia agora'];
  function hasTrigger(t) {
    const s = String(t || '').toLowerCase();
    return TRIGGERS.some((k) => s.includes(k));
  }

  function getIaDirective() {
    try {
      const pick = JSON.parse(localStorage.getItem(IA_PICK_KEY) || 'null');
      return pick?.directive ? `[MR SEM LIMITES — DIRECIONAMENTO IA]\n${pick.directive}\n\n` : '';
    } catch (_) {
      return '';
    }
  }

  function buildPrompt() {
    const userTurns = conversation
      .filter((c) => c.who === 'u' && !hasTrigger(c.text))
      .map((c) => c.text.trim())
      .filter(Boolean);
    return `${getIaDirective()}Baseado na nossa conversa com a Orbe IA, monte e execute o plano abaixo usando o mesmo fluxo de comandos da extensão:\n\n- ${userTurns.join('\n- ')}`;
  }

  async function sendToLovable() {
    const promptText = buildPrompt();
    if (!promptText.trim()) {
      alert('Fale primeiro o que deseja montar.');
      return;
    }
    hideHome();
    setOrbState('think', 'ENVIANDO');
    try {
      if (typeof window.sendDirectLovableMessage === 'function') {
        await window.sendDirectLovableMessage(promptText);
      } else {
        const message = document.getElementById('message');
        const sendBtn = document.getElementById('sendBtn');
        if (!message || !sendBtn) throw new Error('Painel de chat indisponível.');
        message.value = promptText;
        message.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise((resolve) => setTimeout(resolve, 250));
        sendBtn.click();
      }
      setOrbState('idle', 'ENVIADO');
    } catch (e) {
      setOrbState('idle', 'ERRO NO ENVIO');
      alert(e?.message || 'Falha ao enviar para o Lovable.');
    }
  }

  function handleSpokenText(text) {
    logMsg('u', text);
    conversation.push({ who: 'u', text });
    if (hasTrigger(text)) {
      const msg = 'Perfeito, enviando o plano para o Lovable agora.';
      setOrbState('think', 'ENVIANDO');
      logMsg('a', msg);
      speak(msg, () => setTimeout(sendToLovable, 250));
      return;
    }
    const reply = 'Anotado. Pode continuar falando, ou diga "enviar para o Lovable" quando estiver pronto.';
    setOrbState('think', 'PENSANDO');
    logMsg('a', reply);
    speak(reply, () => {
      if (orb?.dataset.mode === 'on') setTimeout(startRecognition, 300);
    });
  }

  function textFallback() {
    const text = prompt('Reconhecimento de voz indisponível. Digite o comando para a Orbe:');
    if (!text) {
      setOrbState('idle', 'TOQUE PARA FALAR');
      return;
    }
    handleSpokenText(text);
  }

  function startRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      textFallback();
      return;
    }
    if (recognizing) return;
    recognition = new SR();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => {
      recognizing = true;
      setOrbState('listen', 'OUVINDO');
      beep(660, 0.12);
    };
    recognition.onerror = (e) => {
      recognizing = false;
      setOrbState('idle', `ERRO: ${e.error || ''}`);
    };
    recognition.onend = () => {
      recognizing = false;
      if (orb?.dataset.mode === 'on') setOrbState('idle', 'TOQUE PARA FALAR');
    };
    recognition.onresult = (ev) => {
      const text = ev.results?.[0]?.[0]?.transcript || '';
      if (text) handleSpokenText(text);
    };
    try {
      recognition.start();
    } catch (_) {}
  }

  orb?.addEventListener('click', () => {
    if (orb.dataset.mode === 'on') {
      orb.dataset.mode = 'off';
      try {
        recognition && recognition.stop();
      } catch (_) {}
      setOrbState('idle', 'CONECTADO');
      beep(440, 0.15);
      return;
    }
    orb.dataset.mode = 'on';
    conversation = [];
    if (voiceLog) {
      voiceLog.innerHTML = '';
      voiceLog.classList.remove('show');
    }
    const msg = 'Modo conversa ativo. Pode falar.';
    logMsg('a', msg);
    setOrbState('listen', 'ATIVANDO');
    speak(msg, startRecognition);
  });

  function syncOverlay() {
    const ls = document.getElementById('licenseScreen');
    const app = document.getElementById('mainApp');
    const lsVisible = ls && getComputedStyle(ls).display !== 'none';
    if (lsVisible) {
      home.classList.add('hidden');
      return;
    }
    if (app && !home.dataset.userDismissed && home.dataset.pinned !== '1') home.classList.remove('hidden');
  }

  setOrbState('idle', 'CONECTADO');
  setInterval(syncOverlay, 800);
  syncOverlay();
})();