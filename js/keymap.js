// NomadType — гарын зураг (keymap) ба хурууны байрлал.
// Англи (US QWERTY) ба Монгол (кирилл) байрлал. Товч бүр: "энгийн|shift".
// Товч бүрийг аль хуруугаар дарахыг FINGERS-ээр өнгөөр ялгаж, доор нь хоёр гарын зураг гаргана.
// Тохиргоо: appearance → keymap, хурууны өнгө.

(() => {
  "use strict";
  const { $, h, t, config } = window.NT;

  const LAYOUTS = {
    en: [
      ["`|~", "1|!", "2|@", "3|#", "4|$", "5|%", "6|^", "7|&", "8|*", "9|(", "0|)", "-|_", "=|+"],
      ["q|Q", "w|W", "e|E", "r|R", "t|T", "y|Y", "u|U", "i|I", "o|O", "p|P", "[|{", "]|}", "\\||"],
      ["a|A", "s|S", "d|D", "f|F", "g|G", "h|H", "j|J", "k|K", "l|L", ";|:", "'|\""],
      ["z|Z", "x|X", "c|C", "v|V", "b|B", "n|N", "m|M", ",|<", ".|>", "/|?"],
    ],
    mn: [
      ["=|+", "№|1", "-|2", "\"|3", "₮|4", ":|5", ".|6", "_|7", ",|8", "%|9", "?|0", "е|Е", "щ|Щ"],
      ["ф|Ф", "ц|Ц", "у|У", "ж|Ж", "э|Э", "н|Н", "г|Г", "ш|Ш", "ү|Ү", "з|З", "к|К", "ъ|Ъ", "\\||"],
      ["й|Й", "ы|Ы", "б|Б", "ө|Ө", "а|А", "х|Х", "р|Р", "о|О", "л|Л", "д|Д", "п|П"],
      ["я|Я", "ч|Ч", "ё|Ё", "с|С", "м|М", "и|И", "т|Т", "ь|Ь", "в|В", "ю|Ю"],
    ],
  };

  // Байрлал бүрийг аль хуруугаар дарах (хоёр хэлэнд ижил — товчны физик байрлалаар).
  // lp/lr/lm/li — зүүн чигчий/ядам/дунд/долоовор, ri/rm/rr/rp — баруун, th — эрхий.
  const FINGERS = [
    ["lp", "lp", "lr", "lm", "li", "li", "ri", "ri", "rm", "rr", "rp", "rp", "rp"],
    ["lp", "lr", "lm", "li", "li", "ri", "ri", "rm", "rr", "rp", "rp", "rp", "rp"],
    ["lp", "lr", "lm", "li", "li", "ri", "ri", "rm", "rr", "rp", "rp"],
    ["lp", "lr", "lm", "li", "li", "ri", "ri", "rm", "rr", "rp"],
  ];
  // Дунд эгнээн дээр хуруу тавих "гэр" товчнууд (A S D F · J K L ;).
  const HOME = [0, 1, 2, 3, 6, 7, 8, 9];

  let current = null;     // { lang, keys: Map(char → {el, shift, finger}), shiftL, shiftR, root }
  let nextEls = [];
  let forced = null;      // хичээлийн үед тохиргоог үл харгалзан "next" горим + хурууны өнгө

  const mode = () => (forced ? forced.mode : config.get("keymapMode"));
  const fingersOn = () => (forced ? true : config.get("keymapFingers"));

  // ---------- Хоёр гарын зураг (SVG) ----------
  const SVG = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }
  // Зүүн гарын хуруунууд: [хуруу, x, дээд y, өндөр]. Баруун гар нь толин тусгал.
  const LEFT = [["lp", 22, 62, 70], ["lr", 58, 36, 96], ["lm", 94, 24, 108], ["li", 130, 40, 92]];
  function hands() {
    const svg = svgEl("svg", { viewBox: "0 0 480 190", class: "km-hands", "aria-hidden": "true" });
    const W = 30;
    const mirror = (f, x) => [f.replace(/^l/, "r"), 480 - x - W];
    for (const side of ["l", "r"]) {
      const g = svgEl("g", {});
      const palmX = side === "l" ? 22 : 480 - 22 - 138;
      g.appendChild(svgEl("rect", { x: palmX, y: 118, width: 138, height: 64, rx: 26, class: "palm" }));
      for (const [f0, x0, y, hgt] of LEFT) {
        const [f, x] = side === "l" ? [f0, x0] : mirror(f0, x0);
        g.appendChild(svgEl("rect", { x, y, width: W, height: hgt + 30, rx: 15, class: `finger fc-${f}`, "data-f": f }));
      }
      // Эрхий хуруу (зай дарна)
      const tx = side === "l" ? 166 : 480 - 166 - 70;
      g.appendChild(svgEl("rect", { x: tx, y: 150, width: 70, height: 26, rx: 13, class: "finger fc-th", "data-f": "th", transform: `rotate(${side === "l" ? -28 : 28} ${tx + 35} 163)` }));
      svg.appendChild(g);
    }
    return svg;
  }

  // ---------- Гарын зураг зурах ----------
  function build(root, lang, { fresh = "", fingers = true, legend = "lowercase", guide = false } = {}) {
    const state = { lang, keys: new Map(), root };
    const board = h("div", { class: "km-board" + (fingers ? " fingers" : "") });
    LAYOUTS[lang].forEach((row, r) => {
      const rowEl = h("div", { class: `km-row km-r${r}` });
      if (r === 3) { state.shiftL = h("div", { class: "km-key km-shift fc-lp" }, "Shift"); rowEl.appendChild(state.shiftL); }
      row.forEach((def, c) => {
        const sep = def.lastIndexOf("|");
        const lo = def.slice(0, sep), up = def.slice(sep + 1);
        const finger = FINGERS[r][c];
        const shown = legend === "blank" ? "" : legend === "uppercase" ? lo.toUpperCase() : lo;
        const el = h("div", { class: `km-key fc-${finger}` }, shown);
        if (r === 2 && (c === 3 || c === 6)) el.classList.add("bump");
        if (guide && r === 2 && HOME.includes(c)) el.classList.add("home");
        if (fresh.includes(lo)) el.classList.add("fresh");
        rowEl.appendChild(el);
        state.keys.set(lo, { el, shift: false, finger });
        if (!state.keys.has(up)) state.keys.set(up, { el, shift: true, finger });
      });
      if (r === 3) { state.shiftR = h("div", { class: "km-key km-shift fc-rp" }, "Shift"); rowEl.appendChild(state.shiftR); }
      board.appendChild(rowEl);
    });
    const space = h("div", { class: "km-key km-space fc-th" }, legend === "blank" ? "" : lang === "mn" ? "зай" : "space");
    state.keys.set(" ", { el: space, shift: false, finger: "th" });
    board.appendChild(h("div", { class: "km-row km-r4" }, space));
    root.appendChild(board);
    if (fingers) {
      state.hands = hands();
      root.appendChild(state.hands);
      state.hint = h("p", { class: "km-hint" });
      if (!guide) root.appendChild(state.hint);
    }
    return state;
  }

  // opts.mode — тохиргоог дарж тогтоох горим (хичээлд "next"), opts.fresh — тодруулах шинэ үсгүүд
  function render(lang, opts = {}) {
    const root = $("keymap");
    if (!root) return;
    forced = opts.mode ? { mode: opts.mode } : null;
    root.innerHTML = "";
    nextEls = [];
    current = null;
    root.hidden = mode() === "off";
    if (mode() === "off") return;
    current = build(root, lang, { fresh: opts.fresh || "", fingers: fingersOn(), legend: config.get("keymapLegendStyle") });
  }

  function find(ch) { return current && ch !== undefined && current.keys.get(ch); }

  function fingerName(f) { return t("fingerNames")[f] || f; }

  function setHands(active) {
    if (!current || !current.hands) return;
    current.hands.classList.toggle("has-active", active.length > 0);
    current.hands.querySelectorAll(".finger").forEach(el => el.classList.toggle("active", active.includes(el.dataset.f)));
  }

  function highlightNext(ch) {
    nextEls.forEach(e => e.classList.remove("next"));
    nextEls = [];
    if (!current) return;
    const k = mode() === "next" || fingersOn() ? find(ch) : null;
    if (!k) { setHands([]); if (current.hint) current.hint.textContent = ""; return; }
    // Том үсэг: нөгөө гарын чигчийгээр Shift дарна.
    const shiftEl = k.shift ? (k.finger.startsWith("l") ? current.shiftR : current.shiftL) : null;
    const shiftFinger = k.shift ? (k.finger.startsWith("l") ? "rp" : "lp") : null;
    if (mode() === "next") {
      k.el.classList.add("next"); nextEls.push(k.el);
      if (shiftEl) { shiftEl.classList.add("next"); nextEls.push(shiftEl); }
    }
    setHands(shiftFinger ? [k.finger, shiftFinger] : [k.finger]);
    if (current.hint) {
      const label = ch === " " ? (current.lang === "mn" ? "зай" : "space") : ch;
      current.hint.textContent = `${label} → ${fingerName(k.finger)}` + (shiftFinger ? ` + Shift (${fingerName(shiftFinger)})` : "");
    }
  }

  function flash(ch, ok) {
    if (mode() !== "react") return;
    const k = find(ch);
    if (!k) return;
    const cls = ok ? "hit" : "miss";
    k.el.classList.remove("hit", "miss");
    void k.el.offsetWidth; // анимацийг дахин эхлүүлэх
    k.el.classList.add(cls);
    setTimeout(() => k.el.classList.remove(cls), 160);
  }

  // "Сурах" хуудсанд: бүх хурууны өнгөтэй, гэр товчнууд тодорсон тогтмол зураг.
  function guide(lang) {
    const root = h("div", { class: "keymap km-guide" });
    build(root, lang, { fingers: true, guide: true });
    return root;
  }

  window.NT.keymap = { render, highlightNext, flash, guide, LAYOUTS, FINGERS };
})();
