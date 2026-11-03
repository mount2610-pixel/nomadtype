// NomadType — шивэлтийн тестийн хөдөлгүүр ба үр дүн.
// Горимууд: time (хугацаа), words (үгийн тоо), quote (эх), zen (чөлөөт), custom (өөрийн текст).
// Тест дуусахад "nt:result" үйл явдал илгээнэ (js/leaderboard.js сонсоно).

(() => {
  "use strict";
  const NT = window.NT;
  const { $, h, t, tr, store, emit, config } = NT;
  const C = k => config.get(k);
  const { WORDS, PASSAGES, QUOTES } = window.NT_DATA;

  const inner = $("wordsInner"), wordsBox = $("words"), caretEl = $("caret"), paceEl = $("paceCaret");
  const input = $("hidden"), stage = $("stage");

  let S = null;            // одоогийн тестийн төлөв
  let lastWords = null;    // давтах тестэд зориулсан үгс
  let lastQuote = null;
  let lesson = null;       // { lang, i } — арван хуруугийн хичээл явагдаж байвал

  // ---------- Туслахууд ----------
  const baseLang = () => C("language").split("_")[0];
  const langName = () => t("langNames")[C("language")] || C("language");
  const now = () => performance.now();
  const rand = n => Math.floor(Math.random() * n);
  const pick = arr => arr[rand(arr.length)];

  // Залхуу горим: ө→о, ү→у, ё→е, өргөлттэй латин үсэг → энгийн.
  const LAZY = { "ө": "о", "Ө": "О", "ү": "у", "Ү": "У", "ё": "е", "Ё": "Е" };
  const strip = ch => LAZY[ch] || ch.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const charOk = (typed, target) => typed === target || (C("lazyMode") && strip(target) === typed);
  const wordOk = (typed, target) => typed.length === target.length && [...typed].every((c, i) => charOk(c, target[i]));
  const prefixOk = (typed, target) => typed.length <= target.length && [...typed].every((c, i) => charOk(c, target[i]));

  function mode2() {
    const m = C("mode");
    return m === "time" ? C("time") : m === "words" ? C("words") : m === "quote" ? C("quoteLength") : m === "custom" ? "custom" : "";
  }

  // ---------- Үг үүсгэх ----------
  function wordPool() {
    const all = WORDS[baseLang()];
    return C("language").endsWith("_short") ? all.filter(w => [...w].length <= 4) : all;
  }

  const capitalize = w => w.charAt(0).toUpperCase() + w.slice(1);

  function genWords(n, prev) {
    const pool = wordPool(), out = [];
    let sentenceStart = !prev || /[.?!]$/.test(prev);
    let last = prev ? prev.toLowerCase() : "";
    for (let i = 0; i < n; i++) {
      let w, tries = 0;
      do { w = pick(pool); } while (w === last && ++tries < 10);
      last = w;
      if (C("numbers") && Math.random() < 0.1) {
        w = String(rand(10 ** (1 + rand(4))));
      } else if (C("punctuation")) {
        if (sentenceStart) w = capitalize(w);
        const r = Math.random();
        if (r < 0.03) w = `"${w}"`;
        else if (r < 0.05) w = `(${w})`;
      }
      sentenceStart = false;
      if (C("punctuation")) {
        const r = Math.random();
        if (r < 0.1) w += ",";
        else if (r < 0.17) { w += "."; sentenceStart = true; }
        else if (r < 0.2) { w += "?"; sentenceStart = true; }
        else if (r < 0.22) { w += "!"; sentenceStart = true; }
        else if (r < 0.24) w += ":";
        else if (r < 0.26 && i < n - 1) { out.push(w); w = "-"; }
      }
      out.push(w);
    }
    return out;
  }

  function pickQuote() {
    const L = baseLang(), len = C("quoteLength");
    const shorts = QUOTES[L].map(text => ({ text, src: L === "mn" ? t("quoteSrcMn") : t("quoteSrcEn") }));
    const mediums = PASSAGES[L].map(text => ({ text, src: t("passageSrc") }));
    const longs = PASSAGES[L].map((p, i, a) => ({ text: p + " " + a[(i + 1) % a.length], src: t("passageSrc") }));
    const pool = len === "short" ? shorts : len === "medium" ? mediums : len === "long" ? longs : shorts.concat(mediums, longs);
    let q, tries = 0;
    do { q = pick(pool); } while (lastQuote && q.text === lastQuote.text && pool.length > 1 && ++tries < 10);
    return q;
  }

  function customWords() {
    const words = (C("customText") || "").replace(/[“”«»]/g, "\"").replace(/[‘’]/g, "'").replace(/[–—]/g, "-").split(/\s+/).filter(Boolean);
    if (!words.length) return ["NomadType"];
    const limit = C("customLimit");
    if (C("customRandom")) {
      const n = limit || words.length;
      return Array.from({ length: n }, () => pick(words));
    }
    if (!limit) return words;
    const out = [];
    while (out.length < limit) out.push(words[out.length % words.length]);
    return out;
  }

  // ---------- Эхлүүлэх / дахин эхлүүлэх ----------
  function restart(opts = {}) {
    if (S && S.timer) clearInterval(S.timer);
    if (S && S.raf) cancelAnimationFrame(S.raf);
    if (S && S.started && !S.done) saveStats(S, false);

    if ("lesson" in opts) lesson = opts.lesson;
    const m = lesson ? "lesson" : C("mode");
    let words, quote = null, repeated = !!opts.repeat && !lesson;
    const sameQuote = !opts.repeat && m === "quote" && C("repeatQuotes") === "typing" && S && S.started && !S.done && S.quote;

    if (opts.repeat && lastWords) { words = lastWords.slice(); quote = S && S.quote; }
    else if (lesson) words = NT.lessons.generate(lesson.lang, lesson.i);
    else if (sameQuote) { quote = S.quote; words = quote.text.split(" "); repeated = true; }
    else if (m === "quote") { quote = pickQuote(); words = quote.text.split(" "); }
    else if (m === "words") words = genWords(C("words"));
    else if (m === "custom") words = customWords();
    else if (m === "zen") words = [""];
    else words = genWords(100);

    if (!opts.repeat && !sameQuote && S && S.done && C("randomTheme")) {
      const names = Object.keys(config.THEMES);
      config.applyTheme(pick(names));
    }

    lastQuote = quote;
    S = {
      mode: m, mode2: lesson ? lesson.i + 1 : mode2(),
      language: lesson ? lesson.lang : C("language"), lang: lesson ? lesson.lang : baseLang(),
      punctuation: C("punctuation") && ["time", "words", "custom"].includes(m),
      numbers: C("numbers") && ["time", "words", "custom"].includes(m),
      words, input: [""], wi: 0, els: [], quote, repeated,
      started: false, done: false, failed: null, lastComplete: false,
      startAt: 0, endAt: 0, keys: 0, correctKeys: 0,
      sec: { chars: 0, errors: 0 }, hist: { wpm: [], raw: [], err: [] }, nextSec: 1,
      burstFrom: 0, bursts: [], lastBurst: 0, offset: 0,
      timer: null, raf: null, pace: lesson ? 0 : paceSpeed(),
    };
    lastWords = words.slice();

    $("warn").textContent = "";
    $("typingTest").hidden = false;
    $("result").hidden = true;
    document.body.classList.remove("typing");
    stage.classList.remove("blur");
    caretEl.classList.add("idle");
    inner.style.transition = "none";
    inner.style.transform = "translateY(0)";
    renderAll();
    updateLive();
    renderKeymap();
    $("zenHint").hidden = m !== "zen";
    $("langBtnText").textContent = langName();
    $("langBtn").hidden = !!lesson;
    $("testConfig").hidden = !!lesson;
    $("lessonBar").hidden = !lesson;
    if (lesson) {
      const L = NT.lessons.LESSONS[lesson.lang][lesson.i];
      $("lessonTitle").textContent = `${t("lesson")} ${lesson.i + 1}/${NT.lessons.LESSONS[lesson.lang].length} · ${tr(L.title)}`;
      $("lessonNeed").textContent = t("lessonNeed")(NT.lessons.target(lesson.lang, lesson.i), NT.lessons.MIN_ACC);
    }
    paceEl.hidden = true;
    emit("nt:restart", { mode: m });
    focus();
  }

  function renderKeymap() {
    if (lesson) NT.keymap.render(S.lang, { mode: "next", fresh: NT.lessons.LESSONS[lesson.lang][lesson.i].keys });
    else NT.keymap.render(S.lang);
    NT.keymap.highlightNext(nextChar());
  }

  // ---------- Зурах ----------
  function renderWord(i) {
    const w = S.words[i] ?? "", typed = S.input[i] ?? "";
    const el = h("div", { class: "word" });
    const len = Math.max(w.length, typed.length);
    const typosReplace = C("indicateTypos") === "replace", typosBelow = C("indicateTypos") === "below";
    for (let k = 0; k < len; k++) {
      let c;
      if (k < w.length) {
        c = h("span", { class: "c" }, w[k]);
        if (k < typed.length) {
          const ok = charOk(typed[k], w[k]);
          c.classList.add(ok ? "ok" : "no");
          if (!ok && typosReplace) c.textContent = typed[k];
          if (!ok && typosBelow) c.dataset.typed = typed[k] === " " ? "_" : typed[k];
        }
      } else {
        c = h("span", { class: "c extra" }, typed[k]);
      }
      el.appendChild(c);
    }
    if (i < S.wi && !wordOk(typed, w)) el.classList.add("error");
    if (i === S.wi) el.classList.add("active");
    if (i < S.wi) el.classList.add("typed");
    return el;
  }

  function renderAll() {
    inner.querySelectorAll(".word").forEach(e => e.remove());
    S.els = [];
    const frag = document.createDocumentFragment();
    S.words.forEach((_, i) => { const el = renderWord(i); S.els.push(el); frag.appendChild(el); });
    inner.insertBefore(frag, caretEl);
    placeCaret();
  }

  function updateWord(i) {
    const old = S.els[i];
    if (!old) return;
    const el = renderWord(i);
    old.replaceWith(el);
    S.els[i] = el;
  }

  function appendWords(list) {
    const start = S.words.length;
    S.words.push(...list);
    const frag = document.createDocumentFragment();
    for (let i = start; i < S.words.length; i++) { const el = renderWord(i); S.els.push(el); frag.appendChild(el); }
    inner.insertBefore(frag, caretEl);
  }

  // Үгийн i-р үсгийн байрлал (wordsInner дотор).
  function posOf(wi, ci) {
    const wEl = S.els[wi];
    if (!wEl) return null;
    const hideExtra = C("hideExtraLetters") || C("blindMode");
    let chars = [...wEl.querySelectorAll(".c")];
    if (hideExtra) { chars = chars.filter(c => !c.classList.contains("extra")); ci = Math.min(ci, chars.length); }
    const lineH = parseFloat(getComputedStyle(inner).lineHeight) || 40;
    if (ci < chars.length) {
      const c = chars[ci];
      return { left: c.offsetLeft, top: c.offsetTop, w: c.offsetWidth, h: c.offsetHeight || lineH, lineH };
    }
    const last = chars[chars.length - 1];
    if (last) return { left: last.offsetLeft + last.offsetWidth, top: last.offsetTop, w: last.offsetWidth, h: last.offsetHeight || lineH, lineH };
    return { left: wEl.offsetLeft, top: wEl.offsetTop, w: 0, h: wEl.offsetHeight || lineH, lineH };
  }

  function setCaret(el, p, style) {
    el.className = `caret caret-${style}` + (el === caretEl && !S.started ? " idle" : "") + (el === paceEl ? " pace" : "");
    el.style.left = p.left + "px";
    el.style.top = p.top + "px";
    el.style.height = p.h + "px";
    el.style.setProperty("--cw", (p.w || 12) + "px");
  }

  function placeCaret() {
    const p = posOf(S.wi, (S.input[S.wi] || "").length);
    if (!p) return;
    caretEl.hidden = C("caretStyle") === "off";
    setCaret(caretEl, p, C("caretStyle"));
    // Гурав дахь мөрөнд хүрвэл нэг мөр дээш гүйлгэнэ.
    const line = Math.round(p.top / p.lineH);
    const offset = Math.max(0, line - 1) * p.lineH;
    if (offset !== S.offset) {
      S.offset = offset;
      inner.style.transition = C("smoothLineScroll") ? "transform .15s ease" : "none";
      inner.style.transform = `translateY(${-offset}px)`;
    }
  }

  // ---------- Хурдны курсор ----------
  function paceSpeed() {
    const p = C("paceCaret");
    if (p === "off") return 0;
    if (p === "custom") return C("paceCaretValue");
    if (p === "pb") { const r = store.get("nt-pbs", {})[pbKey()]; return r ? r.wpm : 0; }
    const hist = store.get("nt-history", []).filter(r => !r.failed).slice(-10);
    return hist.length ? Math.round(hist.reduce((a, r) => a + r.wpm, 0) / hist.length) : 0;
  }

  function paceLoop() {
    if (!S || S.done || !S.pace) return;
    let chars = S.pace * 5 / 60 * ((now() - S.startAt) / 1000);
    let wi = 0;
    while (wi < S.words.length && chars > S.words[wi].length) { chars -= S.words[wi].length + 1; wi++; }
    if (wi < S.words.length && chars >= 0) {
      const p = posOf(wi, Math.floor(chars));
      if (p) { paceEl.hidden = false; setCaret(paceEl, p, C("paceCaretStyle")); }
    } else paceEl.hidden = true;
    S.raf = requestAnimationFrame(paceLoop);
  }

  // ---------- Тооцоо ----------
  // wpmChars: зөв бичсэн үгсийн тэмдэгт + тэдгээрийн дараах зай (Monkeytype-тэй ижил).
  function counts() {
    let wpmChars = 0, rawChars = 0, correct = 0, incorrect = 0, extra = 0, missed = 0;
    const last = S.lastComplete ? S.wi : S.wi - 1;
    for (let i = 0; i <= S.wi && i < S.words.length; i++) {
      const w = S.words[i], typed = S.input[i] ?? "";
      const submitted = i <= last;
      rawChars += typed.length + (i < S.wi ? 1 : 0);
      for (let k = 0; k < Math.max(w.length, typed.length); k++) {
        if (k >= typed.length) { if (submitted) missed++; }
        else if (k >= w.length) extra++;
        else if (charOk(typed[k], w[k])) correct++;
        else incorrect++;
      }
      if (submitted) { if (wordOk(typed, w)) wpmChars += w.length + (i < S.wi ? 1 : 0); }
      else if (prefixOk(typed, w)) wpmChars += typed.length;
    }
    return { wpmChars, rawChars, correct, incorrect, extra, missed };
  }

  const elapsedSec = () => Math.max(((S.done ? S.endAt : now()) - S.startAt) / 1000, 0.001);
  const accNow = () => (S.keys ? (S.correctKeys / S.keys) * 100 : 100);

  function unitVal(wpm) {
    const u = C("typingSpeedUnit");
    return u === "cpm" ? wpm * 5 : u === "wps" ? wpm / 60 : u === "cps" ? wpm * 5 / 60 : wpm;
  }
  function fmtSpeed(wpm) {
    const v = unitVal(wpm), u = C("typingSpeedUnit");
    return C("alwaysShowDecimalPlaces") || u === "wps" || u === "cps" ? v.toFixed(2) : String(Math.round(v));
  }
  const fmtAcc = a => (C("alwaysShowDecimalPlaces") ? a.toFixed(2) : String(Math.floor(a))) + "%";
  const unitName = () => t("units")[C("typingSpeedUnit")];

  // ---------- Цаг ----------
  function start() {
    S.started = true;
    S.startAt = now();
    S.burstFrom = S.startAt;
    caretEl.classList.remove("idle");
    const st = store.get("nt-stats", { started: 0, completed: 0, seconds: 0 });
    st.started++;
    store.set("nt-stats", st);
    S.timer = setInterval(tick, 100);
    if (S.pace) S.raf = requestAnimationFrame(paceLoop);
    if (C("hideUiWhileTyping")) document.body.classList.add("typing");
  }

  function tick() {
    if (!S || S.done) return;
    const el = elapsedSec();
    while (el >= S.nextSec) {
      const c = counts();
      S.hist.wpm.push(Math.round(c.wpmChars / 5 / (S.nextSec / 60)));
      S.hist.raw.push(Math.round(S.sec.chars * 12));
      S.hist.err.push(S.sec.errors);
      S.sec = { chars: 0, errors: 0 };
      S.nextSec++;
      if (C("minWpm") === "custom" && S.nextSec > 5 && c.wpmChars / 5 / (el / 60) < C("minWpmValue")) return fail("minWpm");
      if (C("minAcc") === "custom" && S.keys >= 10 && accNow() < C("minAccValue")) return fail("minAcc");
    }
    if (S.mode === "time" && el >= C("time")) return finish();
    updateLive();
  }

  function updateLive() {
    const prog = $("liveProgress"), wpmEl = $("liveWpm"), accEl = $("liveAcc"), burstEl = $("liveBurst"), bar = $("timerBar");
    const tStyle = C("timerStyle");
    let progText = "", frac = 0;
    if (S.mode === "time") {
      const left = S.started ? Math.max(0, Math.ceil(C("time") - elapsedSec())) : C("time");
      progText = String(left); frac = S.started ? Math.min(1, elapsedSec() / C("time")) : 0;
    } else if (S.mode === "zen") {
      progText = String(S.wi);
    } else {
      progText = `${S.wi}/${S.words.length}`; frac = S.wi / S.words.length;
    }
    prog.textContent = progText;
    prog.hidden = tStyle === "off" || tStyle === "bar";
    prog.className = "live-item " + (tStyle === "text" ? "big" : "mini");
    bar.hidden = tStyle !== "bar" || !S.started;
    bar.style.width = (frac * 100) + "%";

    const show = (el, style, text) => {
      el.hidden = style === "off" || !S.started;
      el.className = "live-item " + (style === "text" ? "big" : "mini");
      el.textContent = text;
    };
    const c = S.started ? counts() : null;
    show(wpmEl, C("liveSpeedStyle"), S.started ? `${fmtSpeed(c.wpmChars / 5 / (elapsedSec() / 60))} ${unitName()}` : "");
    show(accEl, C("liveAccStyle"), S.started ? fmtAcc(accNow()) : "");
    show(burstEl, C("liveBurstStyle"), S.started ? `${fmtSpeed(S.lastBurst)} ↯` : "");
  }

  // ---------- Шивэлт ----------
  const isLatin = ch => /[A-Za-z]/.test(ch);
  const isCyr = ch => /[Ѐ-ӿ]/.test(ch);

  function nextChar() {
    if (!S || S.mode === "zen") return undefined;
    const w = S.words[S.wi] || "", typed = S.input[S.wi] || "";
    return typed.length < w.length ? w[typed.length] : " ";
  }

  function afterChange(i) {
    updateWord(i);
    placeCaret();
    NT.keymap.highlightNext(nextChar());
    updateLive();
  }

  function registerError() {
    S.sec.errors++;
    NT.sound.error();
  }

  function onChar(ch) {
    if (!S || S.done || $("page-test").hidden) return;
    if (ch === "\n" || ch === "\r") return;
    if (!S.started) start();
    NT.sound.click();
    if (C("hideUiWhileTyping")) document.body.classList.add("typing");

    if (C("layoutWarning") && ch !== " ") {
      if (S.lang === "mn" && isLatin(ch)) $("warn").textContent = t("warnLatin");
      else if (S.lang === "en" && isCyr(ch)) $("warn").textContent = t("warnCyr");
      else $("warn").textContent = "";
    }

    if (S.mode === "zen") return zenChar(ch);
    if (ch === " ") return onSpace();

    const w = S.words[S.wi], typed = S.input[S.wi], pos = typed.length;
    const ok = pos < w.length && charOk(ch, w[pos]);
    S.keys++;
    S.sec.chars++;
    NT.keymap.flash(ch, ok);
    if (ok) S.correctKeys++;
    else {
      registerError();
      if (C("difficulty") === "master") { S.input[S.wi] += ch; updateWord(S.wi); return fail("master"); }
      if (C("stopOnError") === "letter") return;
    }
    if (pos >= w.length + 10) return;
    S.input[S.wi] = typed + ch;
    afterChange(S.wi);

    // Сүүлийн үг: зөв бичмэгц (эсвэл quick end үед урт нь хүрмэгц) дуусна.
    if (S.mode !== "time" && S.wi === S.words.length - 1) {
      const cur = S.input[S.wi];
      if (wordOk(cur, w) || (C("quickEnd") && cur.length >= w.length)) {
        if (!wordOk(cur, w) && C("difficulty") !== "normal") return fail("expert");
        S.lastComplete = true;
        recordBurst();
        finish();
      }
    }
  }

  function recordBurst() {
    const t1 = now(), w = S.input[S.wi] || "";
    const min = Math.max((t1 - S.burstFrom) / 60000, 1 / 6000);
    S.lastBurst = Math.round((w.length + 1) / 5 / min);
    S.bursts[S.wi] = S.lastBurst;
    S.burstFrom = t1;
    if (C("minBurst") === "fixed" && S.lastBurst < C("minBurstValue")) { fail("minBurst"); return false; }
    return true;
  }

  function onSpace() {
    const w = S.words[S.wi], typed = S.input[S.wi];
    if (typed === "") {
      if (C("strictSpace")) { S.keys++; S.sec.chars++; registerError(); }
      return;
    }
    const ok = wordOk(typed, w);
    if (!ok && C("stopOnError") === "word") { S.keys++; S.sec.chars++; registerError(); return; }
    S.keys++;
    S.sec.chars++;
    NT.keymap.flash(" ", ok);
    if (ok) S.correctKeys++;
    else {
      registerError();
      if (C("difficulty") !== "normal") { S.wi++; S.input[S.wi] = ""; updateWord(S.wi - 1); return fail(C("difficulty")); }
    }
    if (!recordBurst()) return;
    S.wi++;
    S.input[S.wi] = "";
    updateWord(S.wi - 1);
    if (S.wi >= S.words.length) {
      if (S.mode === "time") appendWords(genWords(50, S.words[S.words.length - 1]));
      else return finish();
    } else if (S.mode === "time" && S.words.length - S.wi < 40) {
      appendWords(genWords(50, S.words[S.words.length - 1]));
    }
    afterChange(S.wi);
  }

  function zenChar(ch) {
    S.keys++; S.correctKeys++; S.sec.chars++;
    if (ch === " ") {
      if (S.input[S.wi] === "") return;
      recordBurst();
      S.wi++;
      S.input[S.wi] = ""; S.words[S.wi] = "";
      updateWord(S.wi - 1);
      const el = renderWord(S.wi);
      S.els.push(el);
      inner.insertBefore(el, caretEl);
      return afterChange(S.wi);
    }
    S.input[S.wi] += ch;
    S.words[S.wi] = S.input[S.wi];
    afterChange(S.wi);
  }

  function onBackspace(wholeWord) {
    if (!S || S.done || $("page-test").hidden) return;
    const cm = C("confidenceMode");
    if (cm === "max") return;
    const typed = S.input[S.wi];
    if (typed.length) {
      S.input[S.wi] = wholeWord ? "" : typed.slice(0, -1);
      if (S.mode === "zen") S.words[S.wi] = S.input[S.wi];
      return afterChange(S.wi);
    }
    if (S.wi === 0 || cm === "on") return;
    const prevOk = wordOk(S.input[S.wi - 1], S.words[S.wi - 1]);
    if (prevOk && !C("freedomMode") && S.mode !== "zen") return;
    if (S.mode === "zen") { S.words.pop(); S.els.pop().remove(); }
    S.input.pop();
    S.wi--;
    if (wholeWord) S.input[S.wi] = "";
    if (S.mode === "zen") S.words[S.wi] = S.input[S.wi];
    if (S.mode !== "zen") updateWord(S.wi + 1);
    afterChange(S.wi);
  }

  // ---------- Дуусгах ----------
  function fail(reason) {
    if (S.done) return;
    S.failed = reason;
    finish();
  }

  function kogasa(cov) {
    return 100 * (1 - Math.tanh(cov + Math.pow(cov, 3) / 3 + Math.pow(cov, 5) / 5));
  }
  function consistency(arr) {
    if (arr.length < 2) return 100;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    if (!mean) return 0;
    const sd = Math.sqrt(arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length);
    return Math.max(0, kogasa(sd / mean));
  }

  function pbKey(s) {
    const m = s ? s.mode : C("mode"), m2 = s ? s.mode2 : mode2(), l = s ? s.language : C("language");
    const p = s ? s.punctuation : C("punctuation"), n = s ? s.numbers : C("numbers");
    return `${m}|${m2}|${l}|${p ? 1 : 0}${n ? 1 : 0}`;
  }

  function saveStats(s, completed) {
    const st = store.get("nt-stats", { started: 0, completed: 0, seconds: 0 });
    if (completed) st.completed++;
    if (s.started) st.seconds += Math.round(((s.done ? s.endAt : now()) - s.startAt) / 1000);
    store.set("nt-stats", st);
  }

  function testLabel(s) {
    if (s.mode === "lesson") return `${t("lesson")} ${s.mode2} · ${t("langNames")[s.language]}`;
    const parts = [`${t(s.mode)}${s.mode === "quote" ? " · " + t("quoteLen")[s.mode2] : s.mode2 && s.mode !== "custom" ? " " + s.mode2 : ""}`, t("langNames")[s.language]];
    if (s.punctuation) parts.push(t("punctuation"));
    if (s.numbers) parts.push(t("numbers"));
    return parts.join(" · ");
  }

  function finish() {
    if (S.done) return;
    S.done = true;
    S.endAt = now();
    clearInterval(S.timer);
    if (S.raf) cancelAnimationFrame(S.raf);
    paceEl.hidden = true;
    document.body.classList.remove("typing");

    let secs = elapsedSec();
    if (S.mode === "time" && !S.failed) secs = Math.min(secs, C("time"));
    const min = secs / 60;
    const c = counts();
    const wpm = c.wpmChars / 5 / min;
    const raw = c.rawChars / 5 / min;
    const acc = accNow();

    // Сүүлийн бүтэн бус секунд.
    const partial = secs - (S.nextSec - 1);
    if (partial > 0.25 || !S.hist.wpm.length) {
      S.hist.wpm.push(Math.round(wpm));
      S.hist.raw.push(Math.round(S.sec.chars / 5 / (Math.max(partial, 0.25) / 60)));
      S.hist.err.push(S.sec.errors);
    }
    const cons = consistency(S.hist.raw);

    const result = {
      wpm, raw, acc, cons, secs, chars: c,
      mode: S.mode, mode2: S.mode2, language: S.language, lang: S.lang,
      punctuation: S.punctuation, numbers: S.numbers, lazy: C("lazyMode"),
      failed: S.failed, repeated: S.repeated, label: testLabel(S), date: Date.now(),
    };
    S.result = result;
    saveStats(S, !S.failed);

    // Дээд амжилт, түүх
    let isPb = false, prevPb = 0;
    const valid = !S.failed && !S.repeated && S.mode !== "zen" && S.mode !== "lesson" && secs >= 1;
    if (valid) {
      const pbs = store.get("nt-pbs", {}), key = pbKey(S), old = pbs[key];
      prevPb = old ? old.wpm : 0;
      if (!old || wpm > old.wpm) {
        pbs[key] = { wpm: +wpm.toFixed(2), acc: +acc.toFixed(2), raw: +raw.toFixed(2), cons: +cons.toFixed(2), date: result.date };
        store.set("nt-pbs", pbs);
        isPb = true;
      }
    }
    if (S.mode !== "zen" || S.wi > 0) {
      const hist = store.get("nt-history", []);
      hist.push({ wpm: +wpm.toFixed(2), raw: +raw.toFixed(2), acc: +acc.toFixed(2), cons: +cons.toFixed(1), mode: S.mode, mode2: S.mode2, language: S.language, punctuation: S.punctuation, numbers: S.numbers, secs: +secs.toFixed(2), failed: S.failed, date: result.date });
      store.set("nt-history", hist.slice(-500));
    }

    showResult(result, isPb, prevPb);
    showLessonResult(result);
    emit("nt:result", {
      lang: S.lang, language: S.language, mode: S.mode, mode2: S.mode2, seconds: S.mode === "time" ? S.mode2 : null,
      punctuation: S.punctuation, numbers: S.numbers, lazy: result.lazy, failed: S.failed,
      wpm: Math.round(wpm), acc: Math.floor(acc), raw: Math.round(raw), label: result.label,
    });
  }

  function showResult(r, isPb, prevPb) {
    $("typingTest").hidden = true;
    $("result").hidden = false;
    $("timerBar").hidden = true;

    $("rUnit").textContent = unitName();
    $("rWpm").textContent = fmtSpeed(r.wpm);
    $("rWpm").title = `${r.wpm.toFixed(2)} wpm`;
    $("rAcc").textContent = fmtAcc(r.acc);
    $("rAcc").title = `${r.acc.toFixed(2)}%`;
    $("rType").textContent = r.label;
    $("rRaw").textContent = fmtSpeed(r.raw);
    $("rChars").textContent = `${r.chars.correct}/${r.chars.incorrect}/${r.chars.extra}/${r.chars.missed}`;
    $("rChars").title = t("charsTip");
    $("rCons").textContent = Math.round(r.cons) + "%";
    $("rTime").textContent = (C("alwaysShowDecimalPlaces") ? r.secs.toFixed(2) : Math.round(r.secs)) + t("sec");

    const other = [];
    if (r.failed) other.push(`${t("failed")}: ${t("failReasons")[r.failed]}`);
    if (r.repeated) other.push(t("repeated"));
    if (r.lazy) other.push(t("lazy"));
    $("rOther").textContent = other.join(" · ");
    $("rOtherWrap").hidden = !other.length;
    $("rWpmWrap").classList.toggle("failed", !!r.failed);

    const pbEl = $("rPb");
    if (isPb) pbEl.textContent = "♛ " + t("newPb");
    else pbEl.textContent = prevPb ? t("pb")(`${fmtSpeed(prevPb)} ${unitName()}`) : "";
    pbEl.classList.toggle("new", isPb);

    const avgMode = C("showAverage"), avgEl = $("rAvg");
    const last10 = store.get("nt-history", []).filter(x => !x.failed).slice(-10);
    if (avgMode !== "off" && last10.length) {
      const aw = last10.reduce((a, x) => a + x.wpm, 0) / last10.length, aa = last10.reduce((a, x) => a + x.acc, 0) / last10.length;
      avgEl.textContent = t("avg10")(avgMode === "acc" ? "–" : `${fmtSpeed(aw)} ${unitName()}`, avgMode === "speed" ? "–" : Math.floor(aa));
      avgEl.hidden = false;
    } else avgEl.hidden = true;

    const src = $("rSrc");
    src.hidden = !S.quote;
    if (S.quote) src.textContent = "— " + S.quote.src;

    const conv = arr => arr.map(v => +unitVal(v).toFixed(C("typingSpeedUnit").endsWith("s") ? 2 : 0));
    NT.chart.draw($("chart"), { wpm: conv(S.hist.wpm), raw: conv(S.hist.raw), err: S.hist.err, zero: C("startGraphsAtZero") });

    renderHistory();
    $("wordsHistory").hidden = !C("alwaysShowWordsHistory");
    $("practiceBtn").hidden = !missedWords().length;
    $("pbLineWrap").hidden = false;
    $("nextBtn").focus();
  }

  // Хичээлийн дүн: тэнцсэн эсэх, од, дараагийн хичээл.
  function showLessonResult(r) {
    const box = $("lessonResult");
    box.hidden = !lesson;
    if (!lesson) return;
    const { lang, i } = lesson;
    const total = NT.lessons.LESSONS[lang].length;
    const res = r.failed ? { stars: 0, passed: false } : NT.lessons.save(lang, i, r.wpm, r.acc);
    $("lrStars").textContent = "★".repeat(res.stars) + "☆".repeat(3 - res.stars);
    $("lrTitle").textContent = res.passed ? t("lessonPassed") : t("lessonFailed");
    $("lrText").textContent = t("lessonNeed")(NT.lessons.target(lang, i), NT.lessons.MIN_ACC);
    box.classList.toggle("passed", res.passed);
    const next = $("lrNext");
    next.hidden = !res.passed || i >= total - 1;
    next.onclick = () => { location.hash = `lesson/${lang}/${i + 2}`; };
    $("lrRetry").onclick = () => restart();
    $("pbLineWrap").hidden = true;
    (res.passed && !next.hidden ? next : $("lrRetry")).focus();
  }

  function renderHistory() {
    const box = $("wordsHistory");
    box.innerHTML = "";
    const last = S.lastComplete ? S.wi : S.wi - 1;
    for (let i = 0; i <= Math.min(S.wi, S.words.length - 1); i++) {
      const typed = S.input[i] ?? "";
      if (i > last && !typed) break;
      const el = renderWord(i);
      el.classList.remove("active");
      if (i <= last && !wordOk(typed, S.words[i])) el.classList.add("error");
      if (S.bursts[i]) el.title = `${fmtSpeed(S.bursts[i])} ${unitName()}`;
      box.appendChild(el);
    }
  }

  function missedWords() {
    if (!S || S.mode === "zen") return [];
    const out = new Set();
    for (let i = 0; i <= Math.min(S.wi, S.words.length - 1); i++) {
      const typed = S.input[i] ?? "";
      if (!typed) continue;
      if (!wordOk(typed, S.words[i]) && !(i === S.wi && prefixOk(typed, S.words[i]))) out.add(S.words[i]);
    }
    return [...out];
  }

  function practice() {
    const missed = missedWords();
    if (!missed.length) return;
    config.set("customText", missed.join(" "), { silent: true });
    config.set("customRandom", true, { silent: true });
    config.set("customLimit", Math.min(100, Math.max(20, missed.length * 5)), { silent: true });
    config.set("mode", "custom", { force: true });
  }

  function copyResult() {
    const r = S && S.result;
    if (!r) return;
    const text = `NomadType — ${r.label}: ${fmtSpeed(r.wpm)} ${unitName()}, ${t("acc")} ${fmtAcc(r.acc)}`;
    const ok = () => { const m = $("copied"); m.hidden = false; setTimeout(() => { m.hidden = true; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok).catch(() => {});
  }

  // ---------- Фокус ----------
  function focus() {
    if ($("page-test").hidden || !S || S.done) return;
    try { input.focus({ preventScroll: true }); } catch { input.focus(); }
    stage.classList.remove("blur");
  }

  input.addEventListener("input", e => {
    const tp = e.inputType || "";
    if (tp === "deleteContentBackward") onBackspace(false);
    else if (tp === "deleteWordBackward") onBackspace(true);
    else if (e.data) for (const ch of e.data) onChar(ch);
    input.value = "";
  });
  input.addEventListener("keydown", e => {
    if (e.key === "Backspace" && input.value === "") { e.preventDefault(); onBackspace(e.ctrlKey || e.altKey || e.metaKey); }
    else if (e.key === "Enter" && e.shiftKey && S && S.mode === "zen" && S.started) { e.preventDefault(); finish(); }
  });
  input.addEventListener("blur", () => {
    if (S && !S.done && !$("page-test").hidden && C("showOutOfFocusWarning")) stage.classList.add("blur");
  });
  input.addEventListener("focus", () => stage.classList.remove("blur"));
  stage.addEventListener("click", focus);
  window.addEventListener("resize", () => { if (S && !S.done) placeCaret(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (S && !S.done) placeCaret(); });

  $("nextBtn").addEventListener("click", () => restart());
  $("repeatBtn").addEventListener("click", () => restart({ repeat: true }));
  $("historyBtn").addEventListener("click", () => { const b = $("wordsHistory"); b.hidden = !b.hidden; });
  $("practiceBtn").addEventListener("click", practice);
  $("copyBtn").addEventListener("click", copyResult);
  $("restartBtn").addEventListener("click", () => restart());

  NT.test = {
    restart, focus, finish: () => S && !S.done && S.started && finish(),
    inLesson: () => !!lesson,
    state: () => S, fmtSpeed, fmtAcc, unitName, pbKey, testLabel,
    rerender() { if (S && !S.done) { renderAll(); renderKeymap(); updateLive(); } },
  };
})();
