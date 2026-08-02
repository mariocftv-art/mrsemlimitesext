(() => {
  'use strict';

  let ctx = null;
  function ac() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      return ctx;
    } catch (_) {
      return null;
    }
  }

  function beep(freq, dur, type, vol) {
    const a = ac();
    if (!a) return;
    try {
      if (a.state === 'suspended') a.resume();
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = type || 'sine';
      o.frequency.value = freq;
      g.gain.value = 0;
      o.connect(g);
      g.connect(a.destination);
      const t = a.currentTime;
      g.gain.linearRampToValueAtTime(vol || 0.14, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t);
      o.stop(t + dur + 0.02);
    } catch (_) {}
  }

  const beepShort = () => beep(880, 0.1, 'square', 0.14);
  const beepDone = () => {
    beep(1174, 0.09, 'sine', 0.15);
    setTimeout(() => beep(1568, 0.1, 'sine', 0.14), 90);
  };
  const beepLong = () => {
    beep(523, 0.22, 'square', 0.15);
    setTimeout(() => beep(392, 0.28, 'square', 0.15), 200);
  };

  function inputArea() {
    return document.querySelector('#mainApp .input-area');
  }

  let stateTimer = null;
  function setState(cls, ttl) {
    const el = inputArea();
    if (!el) return;
    el.classList.remove('state-sending', 'state-done', 'state-asking');
    if (cls) el.classList.add(cls);
    clearTimeout(stateTimer);
    if (ttl) stateTimer = setTimeout(() => el.classList.remove(cls), ttl);
  }

  document.addEventListener(
    'click',
    (ev) => {
      const btn = ev.target.closest && ev.target.closest('#sendBtn, .qa-btn, .qa-pro-btn');
      if (!btn) return;
      beepShort();
      setState('state-sending', 45000);
    },
    true,
  );

  document.addEventListener(
    'keydown',
    (ev) => {
      if (ev.key === 'Enter' && !ev.shiftKey && ev.target && ev.target.id === 'message') {
        beepShort();
        setState('state-sending', 45000);
      }
    },
    true,
  );

  try {
    chrome.runtime.onMessage.addListener((msg) => {
      if (!msg) return;
      if (msg.kind === 'coin' || msg.type === 'coin') {
        beepDone();
        setState('state-done', 3500);
      } else if (msg.kind === 'alert' || msg.type === 'alert') {
        beepLong();
        setState('state-asking', 6000);
      }
    });
  } catch (_) {}
})();