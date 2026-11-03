// NomadType — бүх хэсгийг холбоно: тестийн мөр, хуудас солих, товчлол, цонхнууд.

(() => {
  "use strict";
  const NT = window.NT;
  const { $, h, t, config } = NT;
  const C = k => config.get(k);

  // ---------- Дүрс тэмдэг (SVG) ----------
  const gear = (() => {
    const pts = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2, r = i % 2 ? 7.2 : 9.6;
      const a1 = a - 0.17, a2 = a + 0.17;
      pts.push(`${12 + r * Math.cos(a1)},${12 + r * Math.sin(a1)}`, `${12 + r * Math.cos(a2)},${12 + r * Math.sin(a2)}`);
    }
    return `<polygon points="${pts.map(p => p.split(",").map(n => (+n).toFixed(2)).join(",")).join(" ")}"/><circle cx="12" cy="12" r="3"/>`;
  })();
  const ICONS = {
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    crown: '<path d="M3 18h18M4 16 3 7l5 4 4-6 4 6 5-4-1 9z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    gear,
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    zen: '<path d="M12 4 21 20H3z"/>',
    restart: '<path d="M20.5 15a9 9 0 1 1-2.1-9.4L23 10"/><path d="M23 4v6h-6"/>',
    next: '<path d="m9 18 6-6-6-6"/>',
    repeat: '<path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10"/><path d="M1 4v6h6"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  };
  document.querySelectorAll("[data-icon]").forEach(el => {
    const svg = ICONS[el.dataset.icon];
    if (svg) el.insertAdjacentHTML("afterbegin", `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svg}</svg>`);
  });

  // ---------- Интерфейсийн бичвэр ----------
  function applyTexts() {
    document.documentElement.lang = NT.ui();
    document.querySelectorAll("[data-t]").forEach(el => { const v = t(el.dataset.t); if (typeof v === "string") el.textContent = v; });
    document.querySelectorAll("[data-t-title]").forEach(el => { const v = t(el.dataset.tTitle); el.title = v; el.setAttribute("aria-label", v); });
    document.querySelectorAll("[data-quote]").forEach(b => { b.textContent = t("quoteLen")[b.dataset.quote]; });
    $("cmdInput").placeholder = t("cmdPlaceholder");
    document.querySelectorAll("[data-ui]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.ui === NT.ui())));
    keyTips();
    NT.emit("nt:ui", { ui: NT.ui() });
  }

  function keyTips() {
    const qr = C("quickRestart");
    const restartKey = qr === "off" ? "tab + enter" : qr;
    const cmdKey = qr === "esc" ? "tab" : "esc";
    const el = $("keyTips");
    el.innerHTML = "";
    el.append(
      h("span", {}, h("kbd", {}, restartKey), " — ", t("restartHint")),
      h("span", {}, h("kbd", {}, cmdKey), " ", NT.ui() === "mn" ? "эсвэл" : "or", " ", h("kbd", {}, "ctrl + shift + p"), " — ", t("commandHint")));
    $("themeName").textContent = "◐ " + C("theme");
  }

  // ---------- Тестийн мөр ----------
  function applyToolbar() {
    const m = C("mode");
    const press = (sel, fn) => document.querySelectorAll(sel).forEach(b => b.setAttribute("aria-pressed", String(fn(b))));
    press("[data-toggle]", b => C(b.dataset.toggle));
    press("[data-mode]", b => b.dataset.mode === m);
    press("[data-time]", b => (b.dataset.time === "custom" ? ![15, 30, 60, 120].includes(C("time")) : +b.dataset.time === C("time")));
    press("[data-words]", b => (b.dataset.words === "custom" ? ![10, 25, 50, 100].includes(C("words")) : +b.dataset.words === C("words")));
    press("[data-quote]", b => b.dataset.quote === C("quoteLength"));
    document.querySelectorAll("[data-for]").forEach(g => { g.hidden = g.dataset.for !== m; });
    $("tcExtras").hidden = m === "quote" || m === "zen";
    // Өөрийн утга сонгосон бол ✎ товчин дээр тоог харуулна.
    const ct = document.querySelector('[data-time="custom"]'), cw = document.querySelector('[data-words="custom"]');
    ct.lastChild.textContent = ![15, 30, 60, 120].includes(C("time")) ? C("time") : "✎";
    cw.lastChild.textContent = ![10, 25, 50, 100].includes(C("words")) ? C("words") : "✎";
  }

  document.querySelectorAll("[data-toggle]").forEach(b => b.addEventListener("click", () => config.set(b.dataset.toggle, !C(b.dataset.toggle))));
  document.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => config.set("mode", b.dataset.mode, { force: true })));
  document.querySelectorAll("[data-time]").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.time === "custom") return numberModal(t("customTime"), "time", 1, 3600);
    config.set("time", +b.dataset.time, { force: true });
  }));
  document.querySelectorAll("[data-words]").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.words === "custom") return numberModal(t("customWords"), "words", 1, 1000);
    config.set("words", +b.dataset.words, { force: true });
  }));
  document.querySelectorAll("[data-quote]").forEach(b => b.addEventListener("click", () => config.set("quoteLength", b.dataset.quote, { force: true })));
  document.querySelectorAll("[data-ui]").forEach(b => b.addEventListener("click", () => config.set("uiLang", b.dataset.ui)));
  $("customChange").addEventListener("click", customModal);
  $("langBtn").addEventListener("click", () => NT.commandline.open("language"));

  // ---------- Цонх (modal) ----------
  let modalSubmit = null;
  function openModal(title, body, onSubmit) {
    $("modalTitle").textContent = title;
    const mb = $("modalBody");
    mb.innerHTML = "";
    mb.append(...body);
    modalSubmit = onSubmit;
    $("modal").hidden = false;
    const first = mb.querySelector("input, textarea");
    if (first) first.focus();
  }
  function closeModal() { $("modal").hidden = true; modalSubmit = null; NT.test.focus(); }
  $("modalForm").addEventListener("submit", e => {
    e.preventDefault();
    const fn = modalSubmit;
    $("modal").hidden = true; modalSubmit = null;
    if (fn) fn();
    NT.test.focus();
  });
  $("modalCancel").addEventListener("click", closeModal);
  $("modal").addEventListener("mousedown", e => { if (e.target === $("modal")) closeModal(); });

  function numberModal(title, key, min, max) {
    const inp = h("input", { type: "number", class: "num wide", min, max, value: C(key), required: true });
    openModal(title, [inp], () => {
      const v = Math.round(+inp.value);
      if (v >= min && v <= max) { config.set(key, v, { silent: true }); config.set("mode", key, { force: true }); }
    });
  }

  function customModal() {
    const ta = h("textarea", { class: "json", rows: 6, placeholder: t("customText") });
    ta.value = C("customText");
    const rnd = h("input", { type: "checkbox", id: "cRandom" });
    rnd.checked = C("customRandom");
    const lim = h("input", { type: "number", class: "num", min: 0, max: 5000, value: C("customLimit") });
    openModal(t("customTitle"), [
      ta,
      h("label", { class: "check-row", for: "cRandom" }, rnd, " ", t("customRandom")),
      h("label", { class: "check-row" }, t("customLimit"), " ", lim),
    ], () => {
      config.set("customText", ta.value.slice(0, 20000), { silent: true });
      config.set("customRandom", rnd.checked, { silent: true });
      const n = Math.round(+lim.value);
      if (n >= 0 && n <= 5000) config.set("customLimit", n, { silent: true });
      config.set("mode", "custom", { force: true });
    });
  }

  // ---------- Хуудас солих (#settings, #about, #stats, #leaderboard) ----------
  const PAGES = ["test", "settings", "about", "stats", "leaderboard"];
  let page = "test";
  function route() {
    const want = location.hash.replace("#", "");
    page = PAGES.includes(want) ? want : "test";
    PAGES.forEach(p => { $("page-" + p).hidden = p !== page; });
    document.querySelectorAll(".nav-btn").forEach(a => a.classList.toggle("active", a.dataset.page === page));
    document.body.classList.remove("typing");
    if (page === "settings") NT.pages.renderSettings();
    if (page === "about") NT.pages.renderAbout();
    if (page === "stats") NT.pages.renderStats();
    if (page === "leaderboard") NT.pages.renderBoard();
    if (page === "test") { const s = NT.test.state(); if (!s || !s.started || s.done) NT.test.restart(); else NT.test.focus(); }
  }
  window.addEventListener("hashchange", route);

  // ---------- Тохиргоо солигдоход ----------
  const RESTART_KEYS = new Set(["mode", "time", "words", "quoteLength", "punctuation", "numbers", "language", "customText", "customRandom", "customLimit", "paceCaret", "paceCaretValue", "lazyMode", "*"]);
  window.addEventListener("nt:config", e => {
    const key = e.detail.key;
    if (key === "uiLang" || key === "*") {
      applyTexts();
      if (page === "settings") NT.pages.renderSettings();
      if (page === "about") NT.pages.renderAbout();
      if (page === "stats") NT.pages.renderStats();
      if (page === "leaderboard") NT.pages.renderBoard();
    } else if (page === "settings") NT.pages.refreshSettings();
    if (key === "quickRestart" || key === "theme") keyTips();
    applyToolbar();
    if (RESTART_KEYS.has(key)) {
      if (page === "test") NT.test.restart();
      else if (["mode", "time", "words", "quoteLength", "punctuation", "numbers"].includes(key)) location.hash = "";
    } else {
      NT.test.rerender();
    }
    $("langBtnText").textContent = t("langNames")[C("language")];
  });

  // ---------- Товчлол ----------
  document.addEventListener("keydown", e => {
    if (C("capsLockWarning") && e.getModifierState) $("capsWarn").hidden = !e.getModifierState("CapsLock");
    if (NT.commandline.isOpen()) return;
    if (!$("modal").hidden) { if (e.key === "Escape") closeModal(); return; }

    const qr = C("quickRestart");
    const cmdKey = qr === "esc" ? "Tab" : "Escape";
    if ((e.key === "P" || e.key === "p") && e.ctrlKey && e.shiftKey) { e.preventDefault(); NT.commandline.open(); return; }
    if (e.key === cmdKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); NT.commandline.open(); return; }

    const typingField = e.target.matches && e.target.matches("input:not(#hidden), textarea");
    if (typingField) return;
    const restartKey = { esc: "Escape", tab: "Tab", enter: "Enter" }[qr];
    if (restartKey && e.key === restartKey && !e.shiftKey && page === "test") {
      const s = NT.test.state();
      if (restartKey === "Enter" && s && s.mode === "zen" && s.started && !s.done) return;
      e.preventDefault();
      NT.test.restart();
      return;
    }
    // Үр дүн дээр дурын үсэг дарвал тест рүү буцахгүй; харин тест дээр фокус алдсан бол буцаана.
    if (page === "test" && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1 && document.activeElement !== $("hidden")) {
      const s = NT.test.state();
      if (s && !s.done) NT.test.focus();
    }
  });
  document.addEventListener("keyup", e => { if (C("capsLockWarning") && e.getModifierState) $("capsWarn").hidden = !e.getModifierState("CapsLock"); });

  // Хулгана хөдлөхөд нуусан цэс буцаж гарна.
  let lastMove = 0;
  document.addEventListener("mousemove", e => {
    if (Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0) < 2) return;
    const n = Date.now();
    if (n - lastMove > 100) { lastMove = n; document.body.classList.remove("typing"); }
  });

  // ---------- Эхлүүлэх ----------
  applyTexts();
  applyToolbar();
  route();
})();
