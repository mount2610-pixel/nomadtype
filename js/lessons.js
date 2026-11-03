// NomadType — арван хуруугаар бичиж сурах шаталсан хичээлүүд (монгол кирилл, англи).
// Хичээл бүр өмнөх хичээлийн үсгүүд дээр шинэ товч нэмнэ. Дасгалын текстийг
// зөвхөн сурсан үсгүүдээс бүтсэн жинхэнэ үгс + богино давталтаас автоматаар үүсгэнэ.
//
// Монгол гарын дунд эгнээ:  й ы б ө а | х р о л д п
//   зүүн гар: чигчий й, ядам ы, дунд б, долоовор ө (+ а)
//   баруун гар: долоовор р (+ х), дунд о, ядам л, чигчий д (+ п)
//   ө ба р товч дээр товгор тэмдэг байдаг.

(() => {
  "use strict";
  const { WORDS } = window.NT_DATA;

  // kind: keys — шинэ товч, review — давталт, words — бүх үсэг, caps — том үсэг, punct — цэг таслал, тоо
  const L = (keys, mn, en, kind = "keys") => ({ keys, title: { mn, en }, kind });

  const LESSONS = {
    mn: [
      L("өр", "Долоовор хуруу: ө р", "Index fingers: ө р"),
      L("бо", "Дунд хуруу: б о", "Middle fingers: б о"),
      L("ыл", "Ядам хуруу: ы л", "Ring fingers: ы л"),
      L("йд", "Чигчий хуруу: й д", "Little fingers: й д"),
      L("ахп", "Сунгах: а х п", "Stretch: а х п"),
      L("", "Дунд эгнээ: давталт", "Home row review", "review"),
      L("жг", "Дээд эгнээ: ж г", "Top row: ж г"),
      L("эн", "Дээд эгнээ: э н", "Top row: э н"),
      L("уш", "Дээд эгнээ: у ш", "Top row: у ш"),
      L("цү", "Дээд эгнээ: ц ү", "Top row: ц ү"),
      L("фзкъ", "Дээд эгнээ: ф з к ъ", "Top row: ф з к ъ"),
      L("ст", "Доод эгнээ: с т", "Bottom row: с т"),
      L("ми", "Доод эгнээ: м и", "Bottom row: м и"),
      L("ёь", "Доод эгнээ: ё ь", "Bottom row: ё ь"),
      L("чв", "Доод эгнээ: ч в", "Bottom row: ч в"),
      L("яю", "Доод эгнээ: я ю", "Bottom row: я ю"),
      L("ещ", "Тоон эгнээ: е щ", "Number row: е щ"),
      L("", "Бүх үсэг: жинхэнэ үгс", "All letters: real words", "words"),
      L("", "Том үсэг (Shift)", "Capital letters (Shift)", "caps"),
      L("", "Цэг таслал, тоо", "Punctuation and numbers", "punct"),
    ],
    en: [
      L("fj", "Долоовор хуруу: f j", "Index fingers: f j"),
      L("dk", "Дунд хуруу: d k", "Middle fingers: d k"),
      L("sl", "Ядам хуруу: s l", "Ring fingers: s l"),
      L("a", "Чигчий хуруу: a", "Little finger: a"),
      L("gh", "Сунгах: g h", "Stretch: g h"),
      L("", "Дунд эгнээ: давталт", "Home row review", "review"),
      L("ru", "Дээд эгнээ: r u", "Top row: r u"),
      L("ty", "Дээд эгнээ: t y", "Top row: t y"),
      L("ei", "Дээд эгнээ: e i", "Top row: e i"),
      L("wo", "Дээд эгнээ: w o", "Top row: w o"),
      L("qp", "Дээд эгнээ: q p", "Top row: q p"),
      L("vm", "Доод эгнээ: v m", "Bottom row: v m"),
      L("bn", "Доод эгнээ: b n", "Bottom row: b n"),
      L("c", "Доод эгнээ: c", "Bottom row: c"),
      L("xz", "Доод эгнээ: x z", "Bottom row: x z"),
      L("", "Бүх үсэг: жинхэнэ үгс", "All letters: real words", "words"),
      L("", "Том үсэг (Shift)", "Capital letters (Shift)", "caps"),
      L("", "Цэг таслал, тоо", "Punctuation and numbers", "punct"),
    ],
  };

  const LENGTH = 30; // нэг дасгалын үгийн тоо

  // Тэнцэх шалгуур: нарийвчлал 95%+, хурд доод хэмжээнээс дээш.
  function target(lang, i) {
    const list = LESSONS[lang], kind = list[i].kind;
    if (kind === "words" || kind === "caps" || kind === "punct") return 20;
    const rowStart = list.findIndex(x => x.kind === "review");
    return i <= rowStart ? 10 : 14;
  }
  const MIN_ACC = 95;

  function stars(lang, i, wpm, acc) {
    const tg = target(lang, i);
    if (acc < MIN_ACC || wpm < tg) return 0;
    return 1 + (wpm >= tg + 10 ? 1 : 0) + (wpm >= tg + 20 && acc >= 98 ? 1 : 0);
  }

  // i-р хичээл хүртэл сурсан бүх үсэг.
  function learned(lang, i) {
    return LESSONS[lang].slice(0, i + 1).map(x => x.keys).join("");
  }

  const rand = n => Math.floor(Math.random() * n);
  const pick = a => a[rand(a.length)];

  // Сурсан үсгүүдээс богино давталт: "өр", "рөө", "бор" г.м. Шинэ товчийг илүү давтана.
  function drill(letters, fresh) {
    const len = 2 + rand(3);
    let w = "";
    for (let k = 0; k < len; k++) w += fresh && Math.random() < 0.55 ? pick(fresh) : pick(letters);
    return w;
  }

  function generate(lang, i) {
    const lesson = LESSONS[lang][i];
    const all = WORDS[lang];
    const out = [];

    if (lesson.kind === "words" || lesson.kind === "caps" || lesson.kind === "punct") {
      const pool = all.filter(w => w.length >= 3);
      let sentenceStart = true;
      for (let k = 0; k < LENGTH; k++) {
        let w = pick(pool);
        const cap = lesson.kind === "caps" ? sentenceStart || Math.random() < 0.4 : lesson.kind === "punct" && sentenceStart;
        if (lesson.kind === "punct" && Math.random() < 0.12) w = String(rand(100));
        else if (cap) w = w.charAt(0).toUpperCase() + w.slice(1);
        sentenceStart = false;
        if (lesson.kind === "punct") {
          const r = Math.random();
          if (r < 0.15) w += ",";
          else if (r < 0.27) { w += "."; sentenceStart = true; }
          else if (r < 0.31) { w += "?"; sentenceStart = true; }
        }
        out.push(w);
      }
      return out;
    }

    const letters = [...new Set(learned(lang, i))];
    const fresh = lesson.kind === "review" ? null : [...lesson.keys];
    const set = new Set(letters);
    const pool = all.filter(w => [...w].every(c => set.has(c)));
    const poolNew = fresh ? pool.filter(w => [...w].some(c => fresh.includes(c))) : pool;

    for (let k = 0; k < LENGTH; k++) {
      let w;
      if (pool.length >= 8 && Math.random() < 0.7) {
        w = poolNew.length >= 3 && Math.random() < 0.6 ? pick(poolNew) : pick(pool);
      } else {
        w = drill(letters, fresh);
      }
      if (out.length && out[out.length - 1] === w) w = drill(letters, fresh);
      out.push(w);
    }
    return out;
  }

  // ---------- Ахиц ----------
  const { store } = window.NT;
  const progress = () => store.get("nt-lessons", { mn: {}, en: {} });
  function save(lang, i, wpm, acc) {
    const p = progress();
    p[lang] = p[lang] || {};
    const prev = p[lang][i];
    const st = stars(lang, i, wpm, acc);
    const best = !prev || st > prev.stars || (st === prev.stars && wpm > prev.wpm);
    if (best) p[lang][i] = { stars: st, wpm: Math.round(wpm), acc: Math.floor(acc) };
    store.set("nt-lessons", p);
    return { stars: st, passed: st > 0, prevStars: prev ? prev.stars : 0 };
  }

  // Дараагийн хийх ёстой хичээл (эхний тэнцээгүй хичээл).
  function nextIndex(lang) {
    const p = progress()[lang] || {};
    const i = LESSONS[lang].findIndex((_, k) => !(p[k] && p[k].stars > 0));
    return i === -1 ? LESSONS[lang].length - 1 : i;
  }

  window.NT.lessons = { LESSONS, generate, target, stars, save, progress, nextIndex, learned, MIN_ACC };
})();
