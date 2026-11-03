// NomadType — командын мөр (Esc эсвэл Ctrl + Shift + P).
// Бүх тохиргоо, горим, хуудас руу гараас шууд хүрнэ. Загвар дээр очиход урьдчилан харуулна.

(() => {
  "use strict";
  const NT = window.NT;
  const { $, h, t, tr, config } = NT;
  const C = k => config.get(k);

  const box = $("cmd"), inp = $("cmdInput"), list = $("cmdList");
  let items = [], shown = [], sel = 0, onlyGroup = null, previewing = false;

  function build() {
    const out = [];
    // search: монгол, англи гарчиг болон тохиргооны нэрээр хайж болно.
    const add = (group, groupTitle, label, run, opts = {}) => out.push({ group, title: `${groupTitle}: ${label}`, run, ...opts,
      search: `${groupTitle} ${label} ${group} ${opts.extra || ""}`.toLowerCase() });

    add("action", "▸", t("cmdRestart"), () => NT.test.restart());
    add("punctuation", "@", t("cmdPunct"), () => config.set("punctuation", !C("punctuation")), { active: C("punctuation") });
    add("numbers", "#", t("cmdNums"), () => config.set("numbers", !C("numbers")), { active: C("numbers") });
    for (const m of ["time", "words", "quote", "zen", "custom"]) add("mode", t("cmdMode"), t(m), () => config.set("mode", m), { active: C("mode") === m });
    for (const s of [15, 30, 60, 120]) add("time", t("time"), String(s), () => { config.set("time", s); config.set("mode", "time"); }, { active: C("mode") === "time" && C("time") === s });
    for (const w of [10, 25, 50, 100]) add("words", t("words"), String(w), () => { config.set("words", w); config.set("mode", "words"); }, { active: C("mode") === "words" && C("words") === w });
    for (const q of ["all", "short", "medium", "long"]) add("quoteLength", t("quote"), t("quoteLen")[q], () => { config.set("quoteLength", q); config.set("mode", "quote"); }, { active: C("mode") === "quote" && C("quoteLength") === q });
    for (const [hash, key] of [["", "navTest"], ["settings", "navSettings"], ["stats", "navStats"], ["leaderboard", "navBoard"], ["about", "navAbout"]]) {
      add("page", t("cmdGo"), t(key), () => { location.hash = hash; });
    }
    for (const s of config.SETTINGS) {
      for (const opt of s.options) {
        add(s.key, tr(s.title), config.label(opt, s.key), () => config.set(s.key, opt), {
          active: C(s.key) === opt,
          preview: s.key === "theme" ? () => config.applyTheme(opt) : null,
          extra: `${s.title.en} ${s.title.mn} ${opt}`,
        });
      }
    }
    return out;
  }

  function render() {
    const q = inp.value.trim().toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    shown = items.filter(it => (!onlyGroup || it.group === onlyGroup) && words.every(w => it.search.includes(w)));
    if (sel >= shown.length) sel = Math.max(0, shown.length - 1);
    list.innerHTML = "";
    shown.slice(0, 200).forEach((it, i) => {
      const el = h("div", { class: "cmd-item" + (i === sel ? " sel" : "") + (it.active ? " active" : ""), role: "option", "aria-selected": String(i === sel) },
        h("span", { class: "check" }, it.active ? "✓" : ""), it.title);
      el.addEventListener("mousemove", () => { if (sel !== i) { sel = i; mark(); } });
      el.addEventListener("click", () => { sel = i; exec(); });
      list.appendChild(el);
    });
    mark();
  }

  function mark() {
    [...list.children].forEach((el, i) => { el.classList.toggle("sel", i === sel); el.setAttribute("aria-selected", String(i === sel)); });
    const cur = list.children[sel];
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest" });
    const it = shown[sel];
    if (it && it.preview) { it.preview(); previewing = true; }
    else if (previewing) { config.applyTheme(C("theme")); previewing = false; }
  }

  function open(group) {
    onlyGroup = group || null;
    items = build();
    inp.value = "";
    sel = 0;
    if (onlyGroup) { const i = items.filter(x => x.group === onlyGroup).findIndex(x => x.active); sel = Math.max(0, i); }
    box.hidden = false;
    render();
    inp.focus();
  }

  function close() {
    if (box.hidden) return;
    box.hidden = true;
    if (previewing) { config.applyTheme(C("theme")); previewing = false; }
    NT.test.focus();
  }

  function exec() {
    const it = shown[sel];
    if (!it) return;
    previewing = false;
    box.hidden = true;
    it.run();
    NT.test.focus();
  }

  inp.addEventListener("input", () => { sel = 0; render(); });
  inp.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) { e.preventDefault(); sel = Math.min(shown.length - 1, sel + 1); mark(); }
    else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); }
    else if (e.key === "Enter") { e.preventDefault(); exec(); }
    else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
  });
  box.addEventListener("mousedown", e => { if (e.target === box) close(); });

  NT.commandline = { open, close, isOpen: () => !box.hidden };
})();
