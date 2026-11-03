// NomadType — товчлуурын дуу. Файл татахгүй, Web Audio API-гаар дууг шууд үүсгэнэ.

(() => {
  "use strict";
  const { config } = window.NT;
  let ctx = null;

  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); } catch { return null; }
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  }

  // Нэг богино дуу: давтамж, долгионы хэлбэр, үргэлжлэх хугацаа, давтамжийн уналт.
  function tone({ freq, type = "sine", dur = 0.05, drop = 0, gain = 0.3, noise = false }) {
    const a = audio();
    if (!a) return;
    const vol = config.get("soundVolume") * gain;
    const now = a.currentTime;
    const g = a.createGain();
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    g.connect(a.destination);

    if (noise) {
      const len = Math.floor(a.sampleRate * dur);
      const buf = a.createBuffer(1, len, a.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = a.createBufferSource();
      src.buffer = buf;
      const f = a.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = freq; f.Q.value = 1.2;
      src.connect(f); f.connect(g);
      src.start(now);
      return;
    }
    const o = a.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, now);
    if (drop) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq - drop), now + dur);
    o.connect(g);
    o.start(now);
    o.stop(now + dur + 0.02);
  }

  const CLICKS = {
    click: () => tone({ freq: 2400, noise: true, dur: 0.03, gain: 0.9 }),
    beep: () => tone({ freq: 880, type: "square", dur: 0.04, gain: 0.12 }),
    pop: () => tone({ freq: 600, type: "sine", dur: 0.06, drop: 400, gain: 0.5 }),
    typewriter: () => { tone({ freq: 1400, noise: true, dur: 0.05, gain: 1 }); tone({ freq: 180, type: "triangle", dur: 0.04, gain: 0.25 }); },
  };
  const ERRORS = {
    damage: () => tone({ freq: 220, type: "sawtooth", dur: 0.12, drop: 120, gain: 0.25 }),
    triangle: () => tone({ freq: 330, type: "triangle", dur: 0.12, gain: 0.4 }),
    square: () => tone({ freq: 200, type: "square", dur: 0.1, gain: 0.15 }),
  };

  window.NT.sound = {
    click() { const f = CLICKS[config.get("playSoundOnClick")]; if (f) f(); },
    error() { const f = ERRORS[config.get("playSoundOnError")]; if (f) f(); },
    preview(kind, name) { const f = (kind === "error" ? ERRORS : CLICKS)[name]; if (f) f(); },
  };
})();
