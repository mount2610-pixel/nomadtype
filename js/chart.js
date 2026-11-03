// NomadType — үр дүнгийн график (canvas). Секунд бүрийн хурд, түүхий хурд, алдааг зурна.
// NT.chart.draw(canvas, { wpm: [], raw: [], err: [], unit: "wpm", zero: true })

(() => {
  "use strict";
  const { t } = window.NT;

  const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";

  // Тэнхлэгийн дээд утга: 4 тэнцүү бүхэл алхамд хуваагдах.
  function niceMax(v, min) {
    const range = Math.max(v - min, 1);
    const step = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000].find(s => s * 4 >= range) || 1000;
    return min + step * 4;
  }

  let lastData = null, lastCanvas = null, hoverIdx = -1;

  function draw(canvas, data) {
    if (!canvas || !canvas.getContext) return;
    lastData = data; lastCanvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth || 600, H = canvas.clientHeight || 200;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const n = data.wpm.length;
    if (!n) return;
    const pad = { l: 40, r: 34, t: 10, b: 24 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const all = data.wpm.concat(data.raw);
    const min = data.zero ? 0 : Math.max(0, Math.floor(Math.min(...all) / 10) * 10 - 10);
    const max = niceMax(Math.max(...all, 1), min);
    const errMax = Math.max(1, ...data.err);
    const x = i => pad.l + (n === 1 ? cw / 2 : (i / (n - 1)) * cw);
    const y = v => pad.t + ch - ((v - min) / (max - min || 1)) * ch;

    const sub = css("--sub"), main = css("--main"), err = css("--error"), subAlt = css("--sub-alt");
    ctx.font = `11px ${css("--f-mono") || "monospace"}`;

    // Тор, тэнхлэгийн тоо
    ctx.strokeStyle = subAlt; ctx.fillStyle = sub; ctx.lineWidth = 1;
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (let k = 0; k <= 4; k++) {
      const v = min + (max - min) * k / 4, yy = y(v);
      ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(W - pad.r, yy); ctx.stroke();
      ctx.fillText(String(Math.round(v)), pad.l - 6, yy);
    }
    ctx.textAlign = "left";
    ctx.fillText(String(errMax), W - pad.r + 6, pad.t + 4);
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    const stepX = Math.max(1, Math.ceil(n / 10));
    for (let i = 0; i < n; i += stepX) ctx.fillText(String(i + 1), x(i), H - pad.b + 6);

    // Шугамууд
    const line = (arr, color, width, dash) => {
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []);
      ctx.beginPath();
      arr.forEach((v, i) => (i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v))));
      ctx.stroke(); ctx.setLineDash([]);
    };
    line(data.raw, sub, 2, [4, 4]);
    line(data.wpm, main, 3);

    // Алдаа: улаан загалмай
    ctx.strokeStyle = err; ctx.lineWidth = 2;
    data.err.forEach((e, i) => {
      if (!e) return;
      const xx = x(i), yy = pad.t + ch - (e / errMax) * ch, s = 3.5;
      ctx.beginPath(); ctx.moveTo(xx - s, yy - s); ctx.lineTo(xx + s, yy + s); ctx.moveTo(xx + s, yy - s); ctx.lineTo(xx - s, yy + s); ctx.stroke();
    });

    // Хулганаар заасан цэг
    if (hoverIdx >= 0 && hoverIdx < n) {
      const i = hoverIdx, xx = x(i);
      ctx.strokeStyle = sub; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(xx, pad.t); ctx.lineTo(xx, pad.t + ch); ctx.stroke();
      const lines = [
        `${i + 1} ${t("sec")}`,
        `${t("chartWpm")}: ${data.wpm[i]}`,
        `${t("chartRaw")}: ${data.raw[i]}`,
        `${t("chartErr")}: ${data.err[i]}`,
      ];
      const bw = 120, bh = 16 * lines.length + 10;
      const bx = Math.min(xx + 10, W - bw - 4), by = pad.t + 4;
      ctx.fillStyle = css("--bg"); ctx.strokeStyle = subAlt;
      ctx.fillRect(bx, by, bw, bh); ctx.strokeRect(bx, by, bw, bh);
      ctx.fillStyle = css("--text"); ctx.textAlign = "left"; ctx.textBaseline = "top";
      lines.forEach((s, k) => ctx.fillText(s, bx + 8, by + 6 + k * 16));
    }

    canvas._geom = { pad, cw, n };
  }

  function bind(canvas) {
    if (!canvas || canvas._bound) return;
    canvas._bound = true;
    canvas.addEventListener("mousemove", e => {
      const g = canvas._geom;
      if (!g || !lastData) return;
      const r = canvas.getBoundingClientRect();
      const rel = (e.clientX - r.left - g.pad.l) / (g.cw || 1);
      const i = Math.round(rel * (g.n - 1));
      const ni = Math.max(0, Math.min(g.n - 1, i));
      if (ni !== hoverIdx) { hoverIdx = ni; draw(canvas, lastData); }
    });
    canvas.addEventListener("mouseleave", () => { hoverIdx = -1; if (lastData) draw(canvas, lastData); });
  }

  window.addEventListener("resize", () => { if (lastCanvas && lastData && lastCanvas.offsetParent) draw(lastCanvas, lastData); });

  window.NT.chart = { draw: (c, d) => { bind(c); hoverIdx = -1; draw(c, d); } };
})();
