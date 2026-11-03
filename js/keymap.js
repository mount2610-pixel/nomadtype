// NomadType — гарын зураг (keymap). Англи (US QWERTY) ба Монгол (кирилл) байрлал.
// Товч бүр: "энгийн|shift". Тохиргоо: appearance → keymap.

(() => {
  "use strict";
  const { $, h, config } = window.NT;

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

  let current = null;     // { lang, keys: Map(char → {el, shift}) }
  let nextEl = [];
  let forced = null;      // хичээлийн үед тохиргоог үл харгалзан "next" горим

  const mode = () => forced || config.get("keymapMode");

  // opts.mode — тохиргоог дарж тогтоох горим, opts.fresh — тодруулах шинэ үсгүүд (хичээлд)
  function render(lang, opts = {}) {
    const root = $("keymap");
    if (!root) return;
    forced = opts.mode || null;
    const fresh = opts.fresh || "";
    const mode = forced || config.get("keymapMode");
    root.hidden = mode === "off";
    root.innerHTML = "";
    current = { lang, keys: new Map() };
    if (mode === "off") return;
    const legend = config.get("keymapLegendStyle");

    LAYOUTS[lang].forEach((row, r) => {
      const rowEl = h("div", { class: `km-row km-r${r}` });
      row.forEach(def => {
        const sep = def.lastIndexOf("|");
        const lo = def.slice(0, sep), up = def.slice(sep + 1);
        const shown = legend === "blank" ? "" : legend === "uppercase" ? lo.toUpperCase() : lo;
        const el = h("div", { class: "km-key" + ((lang === "en" && (lo === "f" || lo === "j")) || (lang === "mn" && (lo === "ө" || lo === "р")) ? " bump" : "") }, shown);
        if (fresh.includes(lo)) el.classList.add("fresh");
        rowEl.appendChild(el);
        current.keys.set(lo, { el, shift: false });
        if (!current.keys.has(up)) current.keys.set(up, { el, shift: true });
      });
      root.appendChild(rowEl);
    });
    const space = h("div", { class: "km-key km-space" }, legend === "blank" ? "" : lang === "mn" ? "зай" : "space");
    current.keys.set(" ", { el: space, shift: false });
    root.appendChild(h("div", { class: "km-row km-r4" }, space));
  }

  function find(ch) { return current && ch !== undefined && current.keys.get(ch); }

  function highlightNext(ch) {
    nextEl.forEach(e => e.classList.remove("next"));
    nextEl = [];
    if (mode() !== "next") return;
    const k = find(ch);
    if (!k) return;
    k.el.classList.add("next");
    nextEl.push(k.el);
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

  window.NT.keymap = { render, highlightNext, flash, LAYOUTS };
})();
