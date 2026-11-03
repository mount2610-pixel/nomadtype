// NomadType — тохиргоо, тухай, миний амжилт, жагсаалт хуудсууд.
// Тохиргооны хуудас config.js доторх SETTINGS жагсаалтаас автоматаар зурагдана.

(() => {
  "use strict";
  const NT = window.NT;
  const { $, h, t, tr, store, config } = NT;
  const C = k => config.get(k);

  // ---------- Тохиргоо ----------
  const GROUPS = ["behavior", "input", "sound", "caret", "appearance", "theme", "hide", "danger"];

  function optButton(s, opt) {
    const b = h("button", { type: "button", class: "opt", "aria-pressed": String(C(s.key) === opt), dataset: { key: s.key, val: JSON.stringify(opt) } }, config.label(opt, s.key));
    b.addEventListener("click", () => {
      config.set(s.key, opt);
      if (s.key === "playSoundOnClick") NT.sound.preview("click", opt);
      if (s.key === "playSoundOnError") NT.sound.preview("error", opt);
    });
    return b;
  }

  function control(s) {
    const box = h("div", { class: "controls" + (s.type === "themes" ? " themes" : "") + (s.options.length > 4 && !s.type ? " many" : "") + (s.wide ? " two" : "") });
    if (s.number) {
      const inp = h("input", { type: "number", class: "num", min: 1, max: 300, value: C(s.number), "aria-label": tr(s.title), dataset: { num: s.number } });
      inp.addEventListener("change", () => {
        const v = Math.round(+inp.value);
        if (config.set(s.number, v)) { if (C(s.key) === "off") config.set(s.key, s.options[1]); }
        else inp.value = C(s.number);
      });
      box.appendChild(inp);
    }
    if (s.type === "themes") {
      for (const name of s.options) {
        const th = config.THEMES[name];
        const b = h("button", { type: "button", class: "theme-btn", "aria-pressed": String(C("theme") === name), dataset: { key: "theme", val: JSON.stringify(name) }, style: `background:${th.bg};color:${th.main}` },
          h("span", { class: "dots" }, h("i", { style: `background:${th.main}` }), h("i", { style: `background:${th.sub}` }), h("i", { style: `background:${th.text}` })),
          name);
        b.addEventListener("click", () => config.set("theme", name));
        box.appendChild(b);
      }
      return box;
    }
    for (const opt of s.options) box.appendChild(optButton(s, opt));
    return box;
  }

  function row(titleText, descText, ctl, key) {
    return h("div", { class: "setting", dataset: { search: `${titleText} ${descText} ${key || ""}`.toLowerCase() } },
      h("div", { class: "s-text" }, h("h3", {}, titleText), h("p", {}, descText)),
      ctl);
  }

  function dangerRows() {
    const msg = h("p", { class: "s-msg", role: "status" });
    const flash = text => { msg.textContent = text; setTimeout(() => { msg.textContent = ""; }, 2500); };

    // Хоёр удаа дарж баталгаажуулдаг товч.
    const confirmBtn = (label, fn) => {
      const b = h("button", { type: "button", class: "opt danger" }, label);
      let armed = false, timer = null;
      b.addEventListener("click", () => {
        if (!armed) { armed = true; b.textContent = t("confirmReset"); timer = setTimeout(() => { armed = false; b.textContent = label; }, 4000); return; }
        clearTimeout(timer); armed = false; b.textContent = label; fn(); flash(t("done"));
      });
      return b;
    };

    const exportArea = h("textarea", { class: "json", rows: 4, readonly: true, hidden: true });
    const exportBtn = h("button", { type: "button", class: "opt" }, t("exportBtn"));
    exportBtn.addEventListener("click", () => {
      exportArea.value = JSON.stringify(config.all());
      exportArea.hidden = false; exportArea.select();
      if (navigator.clipboard) navigator.clipboard.writeText(exportArea.value).then(() => flash(t("copied"))).catch(() => {});
    });

    const importArea = h("textarea", { class: "json", rows: 4, placeholder: "{ … }" });
    const importBtn = h("button", { type: "button", class: "opt" }, t("importBtn"));
    importBtn.addEventListener("click", () => {
      try { if (!config.import(JSON.parse(importArea.value))) throw new Error(); importArea.value = ""; flash(t("done")); }
      catch { flash(t("importBad")); }
    });

    return [
      row(t("exportTitle"), t("exportDesc"), h("div", { class: "controls col" }, exportBtn, exportArea), "export"),
      row(t("importTitle"), t("importDesc"), h("div", { class: "controls col" }, importArea, importBtn), "import"),
      row(t("resetSettingsTitle"), t("resetSettingsDesc"), h("div", { class: "controls" }, confirmBtn(t("resetSettings"), () => config.reset())), "reset"),
      row(t("resetPbsTitle"), t("resetPbsDesc"), h("div", { class: "controls" }, confirmBtn(t("resetPbs"), () => store.del("nt-pbs"))), "reset pb"),
      row(t("resetHistoryTitle"), t("resetHistoryDesc"), h("div", { class: "controls" }, confirmBtn(t("resetHistory"), () => { store.del("nt-history"); store.del("nt-stats"); })), "reset history"),
      msg,
    ];
  }

  function renderSettings() {
    const root = $("settingsBody");
    const search = $("settingsSearch");
    const q = search ? search.value : "";
    root.innerHTML = "";

    const nav = h("nav", { class: "s-nav", "aria-label": t("settingsTitle") });
    for (const g of GROUPS) {
      nav.appendChild(h("button", { type: "button", class: g === "danger" ? "danger" : "", onclick: () => { const el = $("sg-" + g); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); } }, t("groups")[g]));
    }
    root.appendChild(nav);
    root.appendChild(h("p", { class: "s-tip" }, t("tipCmd")));
    const inp = h("input", { type: "search", id: "settingsSearch", class: "s-search", placeholder: t("searchSettings"), value: q, autocomplete: "off" });
    inp.addEventListener("input", filter);
    root.appendChild(inp);

    for (const g of GROUPS) {
      const sec = h("section", { class: "s-group", id: "sg-" + g }, h("h2", { class: g === "danger" ? "danger" : "" }, t("groups")[g]));
      if (g === "danger") dangerRows().forEach(r => sec.appendChild(r));
      else config.SETTINGS.filter(s => s.group === g).forEach(s => sec.appendChild(row(tr(s.title), tr(s.desc), control(s), s.key)));
      root.appendChild(sec);
    }
    filter();
  }

  function filter() {
    const inp = $("settingsSearch");
    const q = inp ? inp.value.trim().toLowerCase() : "";
    document.querySelectorAll("#settingsBody .setting").forEach(r => { r.hidden = !!q && !r.dataset.search.includes(q); });
    document.querySelectorAll("#settingsBody .s-group").forEach(g => { g.hidden = !!q && !g.querySelector(".setting:not([hidden])"); });
  }

  // Утга солигдоход зөвхөн дарагдсан төлөвийг шинэчилнэ (хайлт, гүйлгэлт хэвээр).
  function refreshSettings() {
    document.querySelectorAll("#settingsBody [data-key]").forEach(b => {
      b.setAttribute("aria-pressed", String(JSON.stringify(C(b.dataset.key)) === b.dataset.val));
    });
    document.querySelectorAll("#settingsBody input.num").forEach(inp => {
      if (document.activeElement !== inp) inp.value = C(inp.dataset.num);
    });
  }

  // ---------- Тухай ----------
  function renderAbout() {
    const root = $("aboutBody");
    root.innerHTML = "";
    root.appendChild(h("h2", {}, t("aboutTitle")));
    t("aboutBody").forEach(p => root.appendChild(h("p", {}, p)));
    root.appendChild(h("p", {}, t("aboutWords")(window.NT_DATA.WORDS.mn.length, window.NT_DATA.WORDS.en.length)));
    root.appendChild(h("h3", {}, t("aboutKeys")));
    const keys = [
      ["Tab", t("restartHint")], ["Esc · Ctrl + Shift + P", t("commandHint")],
      ["Shift + Enter", t("zen")], ["Ctrl + Backspace", t("words") + " ⌫"],
    ];
    root.appendChild(h("ul", { class: "keys" }, keys.map(([k, d]) => h("li", {}, h("kbd", {}, k), " — ", d))));
  }

  // ---------- Миний амжилт ----------
  function renderStats() {
    const root = $("statsBody");
    root.innerHTML = "";
    const fmt = NT.test.fmtSpeed, unit = NT.test.unitName();
    const st = store.get("nt-stats", { started: 0, completed: 0, seconds: 0 });
    const hh = Math.floor(st.seconds / 3600), mm = Math.floor(st.seconds / 60) % 60, ss = st.seconds % 60;
    const pad = n => String(n).padStart(2, "0");
    root.appendChild(h("h2", {}, t("statsTitle")));
    // Account-ын төлөв (Firebase тохируулсан үед).
    if (window.NT_FIREBASE_ON) {
      const acc = NT.account;
      root.appendChild(h("div", { class: "account-box" + (acc ? " on" : "") },
        h("span", {}, acc ? t("syncOn")(acc.name) : t("syncOff")),
        acc ? null : h("button", { type: "button", class: "opt primary", onclick: () => $("authBtn").click() }, t("signIn"))));
    }
    root.appendChild(h("div", { class: "stat-row" },
      [[t("started"), st.started], [t("completed"), st.completed], [t("typingTime"), `${pad(hh)}:${pad(mm)}:${pad(ss)}`]]
        .map(([k, v]) => h("div", { class: "stat" }, h("div", { class: "k" }, k), h("div", { class: "v" }, String(v))))));

    const pbs = store.get("nt-pbs", {});
    const lang = C("language");
    const table = (mode, list) => h("div", { class: "pb-box" },
      h("h3", {}, `${t(mode)} · ${t("langNames")[lang]}`),
      h("div", { class: "pb-grid" }, list.map(m2 => {
        const r = pbs[`${mode}|${m2}|${lang}|00`];
        return h("div", { class: "pb-cell" }, h("div", { class: "k" }, String(m2)),
          h("div", { class: "v" }, r ? fmt(r.wpm) : "–"), h("div", { class: "k" }, r ? `${Math.floor(r.acc)}%` : ""));
      })));
    root.appendChild(h("h3", { class: "sub" }, `${t("pbTable")} (${unit})`));
    root.appendChild(h("div", { class: "pb-wrap" }, table("time", [15, 30, 60, 120]), table("words", [10, 25, 50, 100])));

    const hist = store.get("nt-history", []).slice(-10).reverse();
    root.appendChild(h("h3", { class: "sub" }, t("recent")));
    if (!hist.length) { root.appendChild(h("p", { class: "muted" }, t("noData"))); return; }
    const head = h("tr", {}, [unit, t("raw"), t("acc"), t("consistency"), t("colTest"), t("colDate")].map(x => h("th", {}, x)));
    const rows = hist.map(r => h("tr", { class: r.failed ? "failed" : "" },
      h("td", {}, fmt(r.wpm)), h("td", {}, fmt(r.raw)), h("td", {}, `${Math.floor(r.acc)}%`), h("td", {}, `${Math.round(r.cons)}%`),
      h("td", {}, NT.test.testLabel(r)), h("td", {}, new Date(r.date).toLocaleString(NT.ui() === "mn" ? "mn-MN" : "en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }))));
    root.appendChild(h("div", { class: "table-wrap" }, h("table", { class: "hist" }, h("thead", {}, head), h("tbody", {}, rows))));
  }

  // ---------- Жагсаалт ----------
  let lb = { lang: "mn", seconds: 15 };
  function renderBoard() {
    const root = $("lbBody");
    root.innerHTML = "";
    root.appendChild(h("h2", {}, t("boardPageTitle")));
    const pressed = (k, v) => String(lb[k] === v);
    const bar = h("div", { class: "lb-bar" },
      ["mn", "en"].map(l => h("button", { type: "button", class: "opt", "aria-pressed": pressed("lang", l), onclick: () => { lb.lang = l; renderBoard(); } }, t("langNames")[l])),
      h("span", { class: "sep" }),
      [15, 30, 60].map(s => h("button", { type: "button", class: "opt", "aria-pressed": pressed("seconds", s), onclick: () => { lb.seconds = s; renderBoard(); } }, `${s} ${t("sec")}`)));
    root.appendChild(bar);
    root.appendChild(h("p", { class: "board-note", id: "lbNote" }, window.NT_FIREBASE_ON ? "" : t("boardOff")));
    root.appendChild(h("ol", { class: "board-list", id: "lbList" }));
    if (window.NT_FIREBASE_ON) NT.emit("nt:lb-open", { ...lb, label: `${t("langNames")[lb.lang]} · ${lb.seconds}` });
  }

  // ---------- Арван хуруугаар сурах ----------
  let learnLang = null;
  function renderLearn() {
    const root = $("learnBody"), L = NT.lessons;
    if (!learnLang) learnLang = C("language").split("_")[0];
    root.innerHTML = "";
    root.appendChild(h("h2", {}, t("learnTitle")));
    t("learnIntro").forEach(p => root.appendChild(h("p", {}, p)));

    root.appendChild(h("div", { class: "lb-bar" }, ["mn", "en"].map(l =>
      h("button", { type: "button", class: "opt", "aria-pressed": String(learnLang === l), onclick: () => { learnLang = l; renderLearn(); } },
        t(l === "mn" ? "courseMn" : "courseEn")))));

    const list = L.LESSONS[learnLang], prog = L.progress()[learnLang] || {};
    const done = list.filter((_, i) => prog[i] && prog[i].stars > 0).length;
    const starSum = list.reduce((a, _, i) => a + (prog[i] ? prog[i].stars : 0), 0);
    const nextI = L.nextIndex(learnLang);

    root.appendChild(h("div", { class: "learn-progress" },
      h("div", { class: "lp-text" }, t("lessonProgress")(done, list.length, starSum, list.length * 3)),
      h("div", { class: "lp-bar" }, h("i", { style: `width:${(done / list.length) * 100}%` })),
      h("a", { class: "opt primary", href: `#lesson/${learnLang}/${nextI + 1}` }, done ? t("lessonContinue") : t("lessonStart"))));

    const grid = h("div", { class: "lesson-grid" });
    list.forEach((x, i) => {
      const p = prog[i], st = p ? p.stars : 0;
      const chips = x.keys ? [...x.keys].map(k => h("kbd", {}, k)) : [h("span", { class: "muted" }, x.kind === "caps" ? "Shift" : x.kind === "punct" ? ", . ? 0–9" : "…")];
      grid.appendChild(h("a", { class: "lesson-card" + (st ? " passed" : "") + (i === nextI && !st ? " next" : ""), href: `#lesson/${learnLang}/${i + 1}` },
        h("div", { class: "lc-top" }, h("span", { class: "lc-num" }, String(i + 1)), h("span", { class: "lc-stars" }, "★".repeat(st) + "☆".repeat(3 - st))),
        h("div", { class: "lc-title" }, tr(x.title)),
        h("div", { class: "lc-keys" }, chips),
        h("div", { class: "lc-best" }, p ? `${p.wpm} ${t("wpm")} · ${p.acc}%` : i === nextI ? t("lessonNextTag") : "")));
    });
    root.appendChild(grid);

    const slot = h("div", { class: "waitlist-slot", dataset: { source: "learn" } });
    root.appendChild(slot);
    if (NT.waitlist) NT.waitlist.render(slot);
  }

  NT.pages = { renderSettings, refreshSettings, renderAbout, renderStats, renderBoard, renderLearn };
})();
