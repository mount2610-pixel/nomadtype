// NomadType — тохиргоо: бүх тохиргооны жагсаалт, загварууд (theme), фонтууд.
// Тохиргооны хуудас (js/settings.js) болон командын мөр (js/commandline.js) хоёулаа
// SETTINGS жагсаалтаас автоматаар үүснэ. Шинэ тохиргоо нэмэх бол энд нэг мөр нэмнэ.

(() => {
  "use strict";
  const { store, emit } = window.NT;

  // ---------- Загварууд ----------
  // bg: дэвсгэр, main: гол өнгө, caret: курсор, sub: бүдэг текст, subAlt: самбар,
  // text: бичсэн текст, error: алдаа, errorExtra: илүү үсэг
  const THEMES = {
    nomad:    { bg: "#161A27", main: "#E8B04B", caret: "#E8B04B", sub: "#5E6787", subAlt: "#1D2233", text: "#E7EAF3", error: "#E5675C", errorExtra: "#9C4A44" },
    steppe:   { bg: "#F4EFE4", main: "#B5772A", caret: "#B5772A", sub: "#A39882", subAlt: "#E8E0CF", text: "#3A3328", error: "#C2453A", errorExtra: "#8E3A32" },
    gobi:     { bg: "#2B2420", main: "#F2A65A", caret: "#F2A65A", sub: "#7D6B5D", subAlt: "#352D28", text: "#EDE0D4", error: "#E05D5D", errorExtra: "#A04545" },
    khuvsgul: { bg: "#0F2233", main: "#4FC3F7", caret: "#4FC3F7", sub: "#4A6A85", subAlt: "#16304A", text: "#DDEFFC", error: "#FF6B6B", errorExtra: "#B34B4B" },
    altai:    { bg: "#1B2620", main: "#8BC34A", caret: "#8BC34A", sub: "#5B7363", subAlt: "#223129", text: "#E3EFE6", error: "#E57373", errorExtra: "#A35252" },
    naadam:   { bg: "#1E1B2E", main: "#FF5C8A", caret: "#FF5C8A", sub: "#6B6488", subAlt: "#26223A", text: "#F1EDFF", error: "#FFB86C", errorExtra: "#B5834F" },
    snow:     { bg: "#FFFFFF", main: "#2F6FDE", caret: "#2F6FDE", sub: "#A8A8A8", subAlt: "#F0F0F0", text: "#262626", error: "#D64545", errorExtra: "#9E3434" },
    night:    { bg: "#000000", main: "#FFFFFF", caret: "#FFFFFF", sub: "#555555", subAlt: "#141414", text: "#CCCCCC", error: "#FF5555", errorExtra: "#AA3B3B" },
    dracula:  { bg: "#282A36", main: "#BD93F9", caret: "#F8F8F2", sub: "#6272A4", subAlt: "#343746", text: "#F8F8F2", error: "#FF5555", errorExtra: "#F1FA8C" },
    nord:     { bg: "#2E3440", main: "#88C0D0", caret: "#ECEFF4", sub: "#4C566A", subAlt: "#3B4252", text: "#ECEFF4", error: "#BF616A", errorExtra: "#8C4A52" },
    matrix:   { bg: "#000000", main: "#15FF00", caret: "#15FF00", sub: "#006500", subAlt: "#031003", text: "#D1FFCD", error: "#DA3333", errorExtra: "#791717" },
  };

  // Google Fonts дээрх кирилл (ө, ү) дэмждэг фонтууд.
  const FONTS = ["JetBrains Mono", "Roboto Mono", "Fira Code", "Source Code Pro", "IBM Plex Mono", "Ubuntu Mono", "system"];

  // Товчлуурын шошго: [монгол, english]. Энд байхгүй утга өөрөөрөө харагдана.
  const LABELS = {
    false: ["унтраах", "off"], true: ["асаах", "on"], off: ["унтраах", "off"], on: ["асаах", "on"],
    normal: ["энгийн", "normal"], expert: ["эксперт", "expert"], master: ["мастер", "master"],
    typing: ["бичиж байхад", "typing"], custom: ["өөрийн", "custom"], fixed: ["тогтмол", "fixed"],
    letter: ["үсэг", "letter"], word: ["үг", "word"], max: ["хамгийн их", "max"],
    below: ["доор нь", "below"], replace: ["орлуулах", "replace"],
    click: ["товш", "click"], beep: ["бийп", "beep"], pop: ["поп", "pop"], typewriter: ["бичгийн машин", "typewriter"],
    damage: ["цохилт", "damage"], triangle: ["гурвалжин", "triangle"], square: ["дөрвөлжин", "square"],
    slow: ["удаан", "slow"], medium: ["дунд", "medium"], fast: ["хурдан", "fast"],
    line: ["зураас", "line"], block: ["дөрвөлжин", "block"], outline: ["хүрээ", "outline"], underline: ["доогуур зураас", "underline"],
    average: ["дундаж", "average"], pb: ["дээд амжилт", "pb"],
    bar: ["зурвас", "bar"], text: ["том", "text"], mini: ["жижиг", "mini"],
    static: ["тогтмол", "static"], react: ["дарахад", "react"], next: ["дараагийн", "next"],
    lowercase: ["жижиг үсэг", "lowercase"], uppercase: ["том үсэг", "uppercase"], blank: ["хоосон", "blank"],
    speed: ["хурд", "speed"], acc: ["нарийвчлал", "accuracy"], both: ["хоёулаа", "both"],
    mn: ["монгол", "mongolian"], en: ["english", "english"],
    mn_short: ["монгол · богино", "mongolian · short"], en_short: ["english · богино", "english · short"],
    system: ["системийн", "system"],
  };

  const B = [false, true];
  // type: "buttons" (сонголтууд), "themes", "fonts". number: хамт харагдах тоон тохиргоо.
  const SETTINGS = [
    // ----- үйлдэл -----
    { key: "uiLang", group: "behavior", options: ["mn", "en"], title: { mn: "интерфейсийн хэл", en: "interface language" }, desc: { mn: "Цэс, товчлуурын хэл.", en: "Language of menus and buttons." } },
    { key: "language", group: "behavior", wide: true, options: ["mn", "mn_short", "en", "en_short"], title: { mn: "бичих хэл", en: "test language" }, desc: { mn: "Тестийн үгсийн хэл. \"Богино\" нь 4 хүртэл үсэгтэй үгс — эхлэгчдэд тохиромжтой.", en: "Language of the test words. \"Short\" uses words up to 4 letters — good for beginners." } },
    { key: "difficulty", group: "behavior", options: ["normal", "expert", "master"], title: { mn: "хүндрэл", en: "difficulty" }, desc: { mn: "Энгийн — ердийн тест. Эксперт — буруу үг илгээвэл (зай дарвал) тест унана. Мастер — ганц буруу товч дарахад унана (100% нарийвчлал).", en: "Normal is the classic test. Expert fails the test if you submit (press space) an incorrect word. Master fails if you press a single incorrect key (100% accuracy)." } },
    { key: "quickRestart", group: "behavior", options: ["off", "esc", "tab", "enter"], title: { mn: "хурдан дахин эхлэх", en: "quick restart" }, desc: { mn: "Tab, Esc эсвэл Enter дарж тестийг шууд шинээр эхлүүлнэ. \"esc\" сонговол командын мөр Tab товч руу шилжинэ.", en: "Press tab, esc or enter to quickly restart the test. Choosing \"esc\" moves the command line to the tab key." } },
    { key: "repeatQuotes", group: "behavior", options: ["off", "typing"], title: { mn: "эхийг давтах", en: "repeat quotes" }, desc: { mn: "\"Бичиж байхад\" сонговол эх горимд бичиж байхдаа дахин эхлүүлэхэд ижил эх гарна.", en: "With \"typing\", restarting while typing in quote mode repeats the same quote." } },
    { key: "blindMode", group: "behavior", options: B, title: { mn: "сохор горим", en: "blind mode" }, desc: { mn: "Алдаа, буруу үгийг тодруулахгүй. Зөвхөн хурдандаа анхаарна.", en: "No errors or incorrect words are highlighted. Helps you focus on raw speed." } },
    { key: "alwaysShowWordsHistory", group: "behavior", options: B, title: { mn: "бичсэн үгсийг үргэлж харуулах", en: "always show words history" }, desc: { mn: "Тест дуусахад бичсэн үгсийн түүхийг автоматаар харуулна.", en: "Automatically shows the words history at the end of the test." } },
    { key: "minWpm", group: "behavior", options: ["off", "custom"], number: "minWpmValue", title: { mn: "доод хурд", en: "min speed" }, desc: { mn: "Хурд энэ хязгаараас буурвал тест автоматаар унана.", en: "Automatically fails a test if your speed falls below a threshold." } },
    { key: "minAcc", group: "behavior", options: ["off", "custom"], number: "minAccValue", title: { mn: "доод нарийвчлал", en: "min accuracy" }, desc: { mn: "Нарийвчлал энэ хувиас буурвал тест автоматаар унана.", en: "Automatically fails a test if your accuracy falls below a threshold." } },
    { key: "minBurst", group: "behavior", options: ["off", "fixed"], number: "minBurstValue", title: { mn: "үгийн доод хурд", en: "min burst" }, desc: { mn: "Аль нэг үгийг энэ хурднаас удаан бичвэл тест унана.", en: "Fails the test if any single word is typed slower than this speed." } },

    // ----- оролт -----
    { key: "freedomMode", group: "input", options: B, title: { mn: "чөлөөт горим", en: "freedom mode" }, desc: { mn: "Зөв бичсэн үг рүүгээ ч гэсэн буцаж устгах боломжтой.", en: "Allows you to delete any word, even if it was typed correctly." } },
    { key: "strictSpace", group: "input", options: B, title: { mn: "хатуу зай", en: "strict space" }, desc: { mn: "Үгийн эхэнд зай дарвал алдаа гэж тооцно.", en: "Pressing space at the beginning of a word counts as an error." } },
    { key: "stopOnError", group: "input", options: ["off", "letter", "word"], title: { mn: "алдаан дээр зогсох", en: "stop on error" }, desc: { mn: "Үсэг — буруу үсэг бичигдэхгүй. Үг — үгээ зөв бичихээс нааш дараагийн үг рүү шилжихгүй.", en: "Letter stops input on a wrong letter. Word stops you from moving on until the word is correct." } },
    { key: "confidenceMode", group: "input", options: ["off", "on", "max"], title: { mn: "итгэлийн горим", en: "confidence mode" }, desc: { mn: "Асаах — өмнөх үг рүү буцаж болохгүй. Хамгийн их — Backspace огт ажиллахгүй.", en: "On stops you from going back to previous words. Max disables backspace completely." } },
    { key: "quickEnd", group: "input", options: B, title: { mn: "хурдан дуусгах", en: "quick end" }, desc: { mn: "Үг, эх, өөрийн текст горимд сүүлийн үгийг (буруу ч гэсэн) бичмэгц тест дуусна.", en: "In words, quote and custom modes the test ends as soon as the last word is typed, even if incorrect." } },
    { key: "indicateTypos", group: "input", options: ["off", "below", "replace"], title: { mn: "алдааг заах", en: "indicate typos" }, desc: { mn: "Буруу бичсэн үсгээ зөв үсгийн доор харуулах, эсвэл оронд нь харуулах.", en: "Shows the letter you typed below the correct one, or in its place." } },
    { key: "hideExtraLetters", group: "input", options: B, title: { mn: "илүү үсгийг нуух", en: "hide extra letters" }, desc: { mn: "Үгийн уртаас илүү бичсэн үсгүүдийг харуулахгүй.", en: "Hides extra letters typed past the end of a word." } },
    { key: "lazyMode", group: "input", options: B, title: { mn: "залхуу горим", en: "lazy mode" }, desc: { mn: "ө-г о, ү-г у, ё-г е гэж бичихийг зөв гэж тооцно (англид өргөлттэй үсэг). Жагсаалтад орохгүй.", en: "Accepts о for ө, у for ү, е for ё (and plain letters for accented ones). Not counted on leaderboards." } },
    { key: "layoutWarning", group: "input", options: B, title: { mn: "гарын байрлалын анхааруулга", en: "layout warning" }, desc: { mn: "Монгол тестэд латин, англи тестэд кирилл үсэг бичвэл анхааруулна.", en: "Warns when you type Latin letters in a Mongolian test or Cyrillic in an English test." } },

    // ----- дуу -----
    { key: "soundVolume", group: "sound", options: [0.1, 0.5, 1], title: { mn: "дууны хэмжээ", en: "sound volume" }, desc: { mn: "Товчлуурын дууны чанга сул.", en: "Volume of key sounds." } },
    { key: "playSoundOnClick", group: "sound", options: ["off", "click", "beep", "pop", "typewriter"], title: { mn: "товч дарахад дуу гаргах", en: "play sound on click" }, desc: { mn: "Товч бүр дээр дуу гаргана.", en: "Plays a short sound on every key press." } },
    { key: "playSoundOnError", group: "sound", options: ["off", "damage", "triangle", "square"], title: { mn: "алдаа гарахад дуу гаргах", en: "play sound on error" }, desc: { mn: "Буруу товч дарахад дуу гаргана.", en: "Plays a sound when you press an incorrect key." } },

    // ----- курсор -----
    { key: "smoothCaret", group: "caret", options: ["off", "slow", "medium", "fast"], title: { mn: "зөөлөн курсор", en: "smooth caret" }, desc: { mn: "Курсор үсгээс үсэг рүү гулсаж шилжинэ.", en: "The caret moves smoothly between letters." } },
    { key: "caretStyle", group: "caret", options: ["off", "line", "block", "outline", "underline"], title: { mn: "курсорын хэлбэр", en: "caret style" }, desc: { mn: "Курсорын харагдах хэлбэр.", en: "Change the style of the caret during the test." } },
    { key: "paceCaret", group: "caret", options: ["off", "average", "pb", "custom"], number: "paceCaretValue", title: { mn: "хурдны курсор", en: "pace caret" }, desc: { mn: "Тогтсон хурдаар явах хоёр дахь курсор. Дундаж эсвэл дээд амжилттайгаа уралдана.", en: "A second caret that moves at a set speed. Race your average, your personal best or a custom speed." } },
    { key: "paceCaretStyle", group: "caret", options: ["line", "block", "outline", "underline"], title: { mn: "хурдны курсорын хэлбэр", en: "pace caret style" }, desc: { mn: "Хурдны курсорын хэлбэр.", en: "Change the style of the pace caret." } },

    // ----- харагдах байдал -----
    { key: "timerStyle", group: "appearance", options: ["off", "bar", "text", "mini"], title: { mn: "цаг / явц", en: "timer/progress style" }, desc: { mn: "Үлдсэн хугацаа эсвэл явцыг хэрхэн харуулах.", en: "How the time left or progress is shown." } },
    { key: "liveSpeedStyle", group: "appearance", options: ["off", "text", "mini"], title: { mn: "шууд хурд", en: "live speed" }, desc: { mn: "Бичиж байх үеийн хурдыг харуулна.", en: "Shows your speed while typing." } },
    { key: "liveAccStyle", group: "appearance", options: ["off", "text", "mini"], title: { mn: "шууд нарийвчлал", en: "live accuracy" }, desc: { mn: "Бичиж байх үеийн нарийвчлалыг харуулна.", en: "Shows your accuracy while typing." } },
    { key: "liveBurstStyle", group: "appearance", options: ["off", "text", "mini"], title: { mn: "шууд үгийн хурд", en: "live burst" }, desc: { mn: "Сүүлд бичсэн үгийн хурдыг харуулна.", en: "Shows the speed of the last typed word." } },
    { key: "typingSpeedUnit", group: "appearance", options: ["wpm", "cpm", "wps", "cps"], title: { mn: "хурдны нэгж", en: "typing speed unit" }, desc: { mn: "үг/мин, тэмдэгт/мин, үг/сек, тэмдэгт/сек.", en: "Words or characters per minute or second." } },
    { key: "alwaysShowDecimalPlaces", group: "appearance", options: B, title: { mn: "аравтын орон", en: "always show decimal places" }, desc: { mn: "Хурд, нарийвчлалыг аравтын 2 оронтой харуулна.", en: "Always shows speed and accuracy with two decimal places." } },
    { key: "startGraphsAtZero", group: "appearance", options: B, title: { mn: "графикийг 0-ээс эхлүүлэх", en: "start graphs at zero" }, desc: { mn: "Үр дүнгийн графикийн босоо тэнхлэг 0-ээс эхэлнэ.", en: "The result chart's y axis starts at zero." } },
    { key: "smoothLineScroll", group: "appearance", options: B, title: { mn: "мөрийг зөөлөн гүйлгэх", en: "smooth line scroll" }, desc: { mn: "Шинэ мөр рүү шилжихэд зөөлөн гүйлгэнэ.", en: "Scrolls smoothly when moving to the next line." } },
    { key: "fontSize", group: "appearance", options: [0.85, 1, 1.25, 1.5, 2], title: { mn: "үсгийн хэмжээ", en: "font size" }, desc: { mn: "Тестийн үсгийн хэмжээ.", en: "Size of the test text." } },
    { key: "fontFamily", group: "appearance", type: "fonts", options: FONTS, title: { mn: "фонт", en: "font family" }, desc: { mn: "Бүх фонт монгол ө, ү үсгийг дэмжинэ.", en: "All fonts support Mongolian ө and ү." } },
    { key: "keymapMode", group: "appearance", options: ["off", "static", "react", "next"], title: { mn: "гарын зураг", en: "keymap" }, desc: { mn: "Тестийн доор гарын зураг гаргана. \"Дараагийн\" нь дарах ёстой товчийг тодруулна — арван хуруугаар сурахад тустай.", en: "Shows a keyboard below the test. \"Next\" highlights the key to press — great for learning touch typing." } },
    { key: "keymapLegendStyle", group: "appearance", options: ["lowercase", "uppercase", "blank"], title: { mn: "гарын зургийн үсэг", en: "keymap legend style" }, desc: { mn: "Гарын зураг дээрх үсгийн хэлбэр.", en: "How letters are shown on the keymap." } },

    // ----- загвар -----
    { key: "theme", group: "theme", type: "themes", options: Object.keys(THEMES), title: { mn: "загвар", en: "theme" }, desc: { mn: "Сайтын өнгө.", en: "Site colors." } },
    { key: "randomTheme", group: "theme", options: B, title: { mn: "санамсаргүй загвар", en: "randomize theme" }, desc: { mn: "Тест бүрийн дараа загвар санамсаргүй солигдоно.", en: "Picks a random theme after every test." } },
    { key: "flipTestColors", group: "theme", options: B, title: { mn: "өнгийг эсрэгээр", en: "flip test colors" }, desc: { mn: "Бичээгүй үгс тод, бичсэн үгс бүдэг харагдана.", en: "Untyped words are bright and typed words are dim." } },
    { key: "colorfulMode", group: "theme", options: B, title: { mn: "өнгөлөг горим", en: "colorful mode" }, desc: { mn: "Зөв бичсэн үсэг гол өнгөөр харагдана.", en: "Correct letters use the main color." } },

    // ----- нуух -----
    { key: "showKeyTips", group: "hide", options: B, title: { mn: "товчлолын зөвлөгөө", en: "key tips" }, desc: { mn: "Доор Tab, Esc товчлолын зөвлөгөөг харуулна.", en: "Shows the keyboard shortcut tips." } },
    { key: "showOutOfFocusWarning", group: "hide", options: B, title: { mn: "фокус алдсан анхааруулга", en: "out of focus warning" }, desc: { mn: "Тестийн талбараас гарахад анхааруулга харуулна.", en: "Shows a warning when the test loses focus." } },
    { key: "capsLockWarning", group: "hide", options: B, title: { mn: "Caps Lock анхааруулга", en: "caps lock warning" }, desc: { mn: "Caps Lock асаалттай бол анхааруулна.", en: "Warns when Caps Lock is on." } },
    { key: "showAverage", group: "hide", options: ["off", "speed", "acc", "both"], title: { mn: "дундажийг харуулах", en: "show average" }, desc: { mn: "Үр дүнд сүүлийн 10 тестийн дундажийг харуулна.", en: "Shows the average of your last 10 tests on the result screen." } },
    { key: "hideUiWhileTyping", group: "hide", options: B, title: { mn: "бичих үед цэс нуух", en: "focus mode" }, desc: { mn: "Бичиж байх үед цэс, тохиргоог бүдгэрүүлнэ. Хулганаа хөдөлгөхөд буцаж гарна.", en: "Fades the menus while you type. Move the mouse to bring them back." } },
  ];

  const DEFAULTS = {
    // тестийн мөр
    mode: "time", time: 30, words: 25, quoteLength: "all", punctuation: false, numbers: false,
    customText: "", customRandom: false, customLimit: 0,
    // тоон утгууд
    minWpmValue: 60, minAccValue: 90, minBurstValue: 50, paceCaretValue: 80,
    // тохиргооны хуудас
    uiLang: "mn", language: "mn", difficulty: "normal", quickRestart: "tab", repeatQuotes: "off",
    blindMode: false, alwaysShowWordsHistory: false, minWpm: "off", minAcc: "off", minBurst: "off",
    freedomMode: false, strictSpace: false, stopOnError: "off", confidenceMode: "off", quickEnd: false,
    indicateTypos: "off", hideExtraLetters: false, lazyMode: false, layoutWarning: true,
    soundVolume: 0.5, playSoundOnClick: "off", playSoundOnError: "off",
    smoothCaret: "medium", caretStyle: "line", paceCaret: "off", paceCaretStyle: "line",
    timerStyle: "mini", liveSpeedStyle: "mini", liveAccStyle: "off", liveBurstStyle: "off",
    typingSpeedUnit: "wpm", alwaysShowDecimalPlaces: false, startGraphsAtZero: true, smoothLineScroll: false,
    fontSize: 1, fontFamily: "JetBrains Mono", keymapMode: "off", keymapLegendStyle: "lowercase",
    theme: "nomad", randomTheme: false, flipTestColors: false, colorfulMode: false,
    showKeyTips: true, showOutOfFocusWarning: true, capsLockWarning: true, showAverage: "off", hideUiWhileTyping: true,
  };

  // Нэг тохиргооны утга зөв эсэх.
  const NUMBER_RANGES = { time: [1, 3600], words: [1, 1000], customLimit: [0, 5000], minWpmValue: [1, 300], minAccValue: [1, 100], minBurstValue: [1, 300], paceCaretValue: [1, 300] };
  function valid(key, v) {
    if (!(key in DEFAULTS)) return false;
    const s = SETTINGS.find(x => x.key === key);
    if (s) return s.options.some(o => o === v);
    if (key in NUMBER_RANGES) { const [a, b] = NUMBER_RANGES[key]; return Number.isInteger(v) && v >= a && v <= b; }
    if (key === "mode") return ["time", "words", "quote", "zen", "custom"].includes(v);
    if (key === "quoteLength") return ["all", "short", "medium", "long"].includes(v);
    if (key === "customText") return typeof v === "string" && v.length <= 20000;
    return typeof v === typeof DEFAULTS[key];
  }

  // ---------- Ачаалах ----------
  const cfg = { ...DEFAULTS };
  const saved = store.get("nt-config", null);
  if (saved && typeof saved === "object") {
    for (const [k, v] of Object.entries(saved)) if (valid(k, v)) cfg[k] = v;
  } else {
    // Өмнөх хувилбарын тохиргоог ("nt-settings") шилжүүлнэ.
    const old = store.get("nt-settings", {});
    if (old.ui === "en") cfg.uiLang = "en";
    if (old.lang === "en") cfg.language = "en";
    if ([15, 30, 60].includes(old.seconds)) cfg.time = old.seconds;
  }

  function save() { store.set("nt-config", cfg); }

  // ---------- Харагдах байдлыг хэрэглэх ----------
  const loadedFonts = new Set(["JetBrains Mono"]);
  function loadFont(name) {
    if (name === "system" || loadedFonts.has(name)) return;
    loadedFonts.add(name);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%20/g, "+")}:wght@400;600&display=swap`;
    document.head.appendChild(link);
  }

  function applyTheme(name) {
    const th = THEMES[name] || THEMES.nomad;
    const root = document.documentElement.style;
    const map = { bg: "--bg", main: "--main", caret: "--caret", sub: "--sub", subAlt: "--sub-alt", text: "--text", error: "--error", errorExtra: "--error-extra" };
    for (const [k, v] of Object.entries(map)) root.setProperty(v, th[k]);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", th.bg);
  }

  function applyAppearance() {
    applyTheme(cfg.theme);
    const root = document.documentElement;
    root.style.setProperty("--font-scale", String(cfg.fontSize));
    if (cfg.fontFamily !== "system") loadFont(cfg.fontFamily);
    root.style.setProperty("--f-mono", cfg.fontFamily === "system"
      ? "ui-monospace, Menlo, Consolas, monospace"
      : `"${cfg.fontFamily}", ui-monospace, Menlo, Consolas, monospace`);
    const speeds = { off: "0s", slow: ".15s", medium: ".1s", fast: ".05s" };
    root.style.setProperty("--caret-speed", speeds[cfg.smoothCaret] || "0s");

    const b = document.body;
    if (!b) return;
    const flags = {
      "cfg-flip": cfg.flipTestColors, "cfg-colorful": cfg.colorfulMode, "cfg-blind": cfg.blindMode,
      "cfg-typos-below": cfg.indicateTypos === "below", "cfg-typos-replace": cfg.indicateTypos === "replace",
      "cfg-hide-extra": cfg.hideExtraLetters, "cfg-no-tips": !cfg.showKeyTips, "cfg-no-focus-warn": !cfg.showOutOfFocusWarning,
      "cfg-smooth-scroll": cfg.smoothLineScroll,
    };
    for (const [c, on] of Object.entries(flags)) b.classList.toggle(c, !!on);
  }

  // ---------- API ----------
  function set(key, value, opts = {}) {
    if (!valid(key, value)) return false;
    if (cfg[key] === value && !opts.force) return true;
    cfg[key] = value;
    save();
    applyAppearance();
    if (!opts.silent) emit("nt:config", { key, value });
    return true;
  }

  window.NT.config = {
    SETTINGS, THEMES, FONTS, LABELS, DEFAULTS,
    get: k => cfg[k],
    all: () => ({ ...cfg }),
    set,
    label(v, key) {
      const i = window.NT.ui() === "en" ? 1 : 0;
      if (key === "soundVolume") return ({ 0.1: ["сул", "quiet"], 0.5: ["дунд", "medium"], 1: ["чанга", "loud"] })[v][i];
      if (typeof v === "number") return String(v);
      const l = LABELS[String(v)];
      return l ? l[i] : String(v);
    },
    reset() { Object.assign(cfg, DEFAULTS); save(); applyAppearance(); emit("nt:config", { key: "*" }); },
    import(obj) {
      if (!obj || typeof obj !== "object") return false;
      let n = 0;
      for (const [k, v] of Object.entries(obj)) if (valid(k, v)) { cfg[k] = v; n++; }
      save(); applyAppearance(); emit("nt:config", { key: "*" });
      return n > 0;
    },
    applyAppearance, applyTheme,
  };

  applyAppearance();
  document.addEventListener("DOMContentLoaded", applyAppearance);
})();
