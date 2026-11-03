// NomadType — интерфейсийн орчуулга (монгол / english).
// Тохиргооны гарчиг, тайлбарууд js/config.js доторх SETTINGS жагсаалтад байна.

window.NT_I18N = {
  mn: {
    tagline: "монгол · english хурдан шивэлт",
    footer: "Тохиргоо, дээд амжилт таны хөтөч дээр хадгалагдана.",

    // Тестийн мөр
    punctuation: "цэг таслал", numbers: "тоо",
    time: "хугацаа", words: "үг", quote: "эх", zen: "зэн", custom: "өөрийн",
    quoteLen: { all: "бүгд", short: "зүйр үг", medium: "дунд", long: "урт" },
    change: "засах", customTime: "Хэдэн секунд вэ?", customWords: "Хэдэн үг вэ?",
    langNames: { mn: "монгол", mn_short: "монгол · богино үг", en: "english", en_short: "english · short words" },

    // Тест
    clickToFocus: "Энд дарж үргэлжлүүлнэ үү",
    restartHint: "шинээр эхлэх", commandHint: "командын мөр",
    zenHint: "Чөлөөтэй бич. Дуусгах: Shift + Enter",
    capsLock: "Caps Lock асаалттай байна",
    layoutMn: "Гараа Монгол (кирилл) байрлалд шилжүүлнэ үү", layoutEn: "Гараа English (US) байрлалд шилжүүлнэ үү",
    warnLatin: "Латин үсэг бичигдэж байна. Гараа Монгол (кирилл) байрлалд шилжүүлнэ үү.",
    warnCyr: "Кирилл үсэг бичигдэж байна. Гараа English байрлалд шилжүүлнэ үү.",

    // Үр дүн
    units: { wpm: "үг/мин", cpm: "тэмдэгт/мин", wps: "үг/сек", cps: "тэмдэгт/сек" },
    wpm: "үг/мин", acc: "нарийвчлал", raw: "түүхий", characters: "тэмдэгт", consistency: "тогтвортой байдал",
    timeLabel: "хугацаа", testType: "тест", other: "бусад", sec: "сек",
    charsTip: "зөв / буруу / илүү / орхисон",
    failed: "амжилтгүй", failReasons: {
      master: "мастер: нэг ч алдаа гаргаж болохгүй", expert: "эксперт: буруу үг илгээсэн",
      minWpm: "хурд доод хязгаараас бага", minAcc: "нарийвчлал доод хязгаараас бага", minBurst: "үгийн хурд доод хязгаараас бага",
    },
    repeated: "давтсан тест", lazy: "залхуу горим",
    newPb: "Шинэ дээд амжилт!", pb: n => `Дээд амжилт: ${n}`, avg10: (w, a) => `Сүүлийн 10-ын дундаж: ${w} · ${a}%`,
    next: "Дараагийн тест", repeat: "Энэ тестийг давтах", history: "Бичсэн үгс", practice: "Алдсан үгсээ давтах",
    copy: "Дүнгээ хуулах", copied: "Хууллаа",
    quoteSrcMn: "Ардын зүйр үг", quoteSrcEn: "English proverb", passageSrc: "NomadType эх",
    chartWpm: "хурд", chartRaw: "түүхий", chartErr: "алдаа",

    // Цэс
    navTest: "Тест", navBoard: "Жагсаалт", navAbout: "Тухай", navSettings: "Тохиргоо", navStats: "Миний амжилт",

    // Тохиргоо
    settingsTitle: "Тохиргоо", searchSettings: "тохиргоо хайх",
    groups: { behavior: "үйлдэл", input: "оролт", sound: "дуу", caret: "курсор", appearance: "харагдах байдал", theme: "загвар", hide: "нуух", danger: "аюултай бүс" },
    tipCmd: "Зөвлөгөө: Esc эсвэл Ctrl + Shift + P дарж командын мөрөөр тохиргоогоо хурдан солино.",
    exportBtn: "экспорт", importBtn: "импорт", resetSettings: "тохиргоог цэвэрлэх", resetPbs: "дээд амжилтыг устгах", resetHistory: "түүхийг устгах",
    exportTitle: "Тохиргоогоо экспортлох", exportDesc: "Тохиргоогоо JSON хэлбэрээр хуулж авна.",
    importTitle: "Тохиргоо импортлох", importDesc: "Өмнө нь экспортолсон JSON-оо энд хуулж оруулна.",
    resetSettingsTitle: "Тохиргоог анхны байдалд", resetSettingsDesc: "Бүх тохиргоог анхны утгаар нь буцаана.",
    resetPbsTitle: "Дээд амжилт устгах", resetPbsDesc: "Таны хөтөч дээрх бүх дээд амжилтыг устгана.",
    resetHistoryTitle: "Түүх устгах", resetHistoryDesc: "Хадгалсан бүх тестийн түүхийг устгана.",
    confirmReset: "Итгэлтэй байна уу? Буцаах боломжгүй.", done: "Боллоо", importBad: "JSON буруу байна.",
    apply: "Хэрэглэх", cancel: "Болих", custom2: "өөрийн утга",
    on: "асаах", off: "унтраах",

    // Өөрийн текст
    customTitle: "Өөрийн текст", customText: "Бичих текстээ энд оруулна", customRandom: "Үгсийг холих",
    customLimit: "Үгийн тоо (0 = бүгд)",

    // Командын мөр
    cmdPlaceholder: "Команд хайх…", cmdRestart: "Тестийг шинээр эхлүүлэх", cmdUi: "Интерфейсийн хэл",
    cmdMode: "Горим", cmdLang: "Хэл", cmdPunct: "Цэг таслал асаах/унтраах", cmdNums: "Тоо асаах/унтраах",
    cmdGo: "Хуудас нээх",

    // Тухай
    aboutTitle: "NomadType гэж юу вэ?",
    aboutBody: [
      "NomadType бол монгол кирилл болон англи хэлээр хурдан, зөв шивж сурахад зориулсан үнэгүй сайт. Зар сурталчилгаагүй, бүртгэлгүйгээр шууд ашиглана.",
      "Хурдыг үг/минутаар хэмжинэ: зөв бичсэн тэмдэгтийн тоог (зайг оруулаад) 5-д хувааж, минутад шилжүүлнэ. Нарийвчлал нь зөв дарсан товчлуурын хувь.",
      "Горимууд: хугацаа (15–120 сек), үгийн тоо, эх (зүйр үг, дунд, урт өгүүллэг), зэн (чөлөөт бичих), өөрийн текст. Цэг таслал, тоо нэмж хүндрүүлж болно.",
      "Арван хуруугаар бичиж сурахын тулд Тохиргоо → харагдах байдал → гарын зураг-ийг асааж, дараагийн товчийг хараарай.",
    ],
    aboutKeys: "Товчлол", aboutWords: (m, e) => `Үгийн сан: монгол ${m}, англи ${e} үг.`,

    // Миний амжилт
    statsTitle: "Миний амжилт", started: "эхэлсэн тест", completed: "дуусгасан тест", typingTime: "нийт бичсэн хугацаа",
    pbTable: "Дээд амжилтууд", recent: "Сүүлийн тестүүд", noData: "Одоогоор тест хийгээгүй байна.",
    colDate: "огноо", colTest: "тест",

    // Нэвтрэх, жагсаалт
    signIn: "Нэвтрэх / Бүртгүүлэх",
    authSignIn: "Нэвтрэх", authSignUp: "Бүртгүүлэх", authAccount: "Миний account", authResetTitle: "Нууц үг сэргээх",
    authName: "Нэр (жагсаалтад харагдана)", authEmail: "Имэйл", authPass: "Нууц үг", authPass2: "Нууц үгээ давтах",
    authForgot: "Нууц үгээ мартсан уу?", authBack: "← Нэвтрэх рүү буцах", authOr: "эсвэл", authGoogle: "Google-ээр үргэлжлүүлэх",
    authResetHint: "Бүртгүүлсэн имэйлээ оруулна уу. Нууц үгээ шинэчлэх холбоосыг тань руу илгээнэ.",
    authResetSend: "Сэргээх холбоос илгээх",
    authResetSent: "Илгээлээ! Имэйлээ шалгана уу (Spam хавтсыг ч шалгаарай). Холбоос дээр дарж шинэ нууц үг тохируулна.",
    authSynced: "Таны амжилт, хичээлийн ахиц энэ account дээр хадгалагдаж байна.", authSignOut: "Гарах",
    errEmail: "Имэйл хаяг буруу байна.", errInUse: "Энэ имэйлээр аль хэдийн бүртгүүлсэн байна. \"Нэвтрэх\" таб руу орно уу.",
    errWeak: "Нууц үг хамгийн багадаа 6 тэмдэгт байна.", errMismatch: "Хоёр нууц үг таарахгүй байна.",
    errName: "Нэрээ 2–40 тэмдэгтээр бичнэ үү.", errWrong: "Имэйл эсвэл нууц үг буруу байна.",
    errMany: "Хэт олон удаа оролдлоо. Хэсэг хүлээгээд дахин оролдоно уу.", errNet: "Интернэт холболтоо шалгана уу.",
    errDisabled: "Энэ нэвтрэх арга идэвхгүй байна (Firebase → Sign-in method).", errPopup: "Хөтөч popup цонхыг хаасан байна. Зөвшөөрөөд дахин оролдоно уу.",
    errDomain: "Энэ домэйн Firebase-д зөвшөөрөгдөөгүй байна (Authorized domains).", errOther: "Алдаа гарлаа. Дахин оролдоно уу.", signOut: name => `${name} · гарах`,
    boardTitle: label => `Шилдэг 10 · ${label}`,
    boardLoading: "Жагсаалтыг ачаалж байна…", boardEmpty: "Одоогоор хэн ч бүртгэгдээгүй. Эхнийх нь болоорой!",
    boardError: "Жагсаалтыг ачаалж чадсангүй.",
    boardOff: "Дэлхийн жагсаалт ажиллуулахын тулд js/firebase-config.js-д Firebase тохиргоо оруулна (README-г үзнэ үү).",
    noteSignIn: "Нэвтэрвэл таны дүн энэ жагсаалтад орно.",
    noteSaved: "Таны шинэ дээд амжилт жагсаалтад хадгалагдлаа.",
    noteNotBetter: "Таны жагсаалтад байгаа дүн үүнээс өндөр байна.",
    noteLowAcc: "Жагсаалтад орохын тулд нарийвчлал 90%-иас дээш байх ёстой.",
    noteQuote: "Жагсаалтад зөвхөн \"хугацаа\" горимын 15/30/60 сек, цэг таслал, тоогүй, залхуу горимгүй тест орно.",
    boardPageTitle: "Дэлхийн жагсаалт",

    // Хичээл
    navLearn: "Арван хуруугаар сурах", lesson: "хичээл",
    learnTitle: "Арван хуруугаар бичиж сурах",
    learnIntro: [
      "Гар руугаа харалгүй, арван хуруугаараа бичиж сурвал хурд тань хэд дахин нэмэгдэнэ. Хичээл бүр хэдхэн шинэ товч заана.",
      "Монгол гар: зүүн гарын хуруунууд й ы б ө, баруун гарынх р о л д дээр байрлана. Долоовор хуруунууд товгор тэмдэгтэй ө ба р товч дээр. Эрхий хуруугаар зай дарна.",
      "Хичээл бүрт гарын зураг дараагийн дарах товчийг шараар, шинэ товчнуудыг хүрээгээр тодруулна. Тэнцэхийн тулд нарийвчлал 95%-иас дээш байх ёстой — эхлээд зөв, дараа нь хурдан.",
    ],
    lessonNeed: (w, a) => `Тэнцэх: ${w}+ үг/мин, ${a}%+ нарийвчлал`,
    lessonPassed: "Тэнцлээ!", lessonFailed: "Дахиад нэг оролдоё",
    lessonRetry: "Дахин", lessonNext: "Дараагийн хичээл →", lessonList: "Бүх хичээл", lessonBack: "← Хичээлүүд",
    lessonProgress: (d, n, s, m) => `${n}-аас ${d} хичээл тэнцсэн · ★ ${s}/${m}`,
    lessonNextTag: "дараагийн", lessonStart: "Эхлэх", lessonContinue: "Үргэлжлүүлэх",
    courseMn: "Монгол гар (кирилл)", courseEn: "Англи гар (QWERTY)",

    // Premium хүлээлгийн жагсаалт
    wlTitle: "NomadType Premium удахгүй",
    wlDesc: "Өдөр бүрийн сургалтын төлөвлөгөө, алдаатай товчлуурын шинжилгээ, ахицын дэлгэрэнгүй статистик, тэмцээн. Имэйлээ үлдээвэл нээгдэхэд хамгийн түрүүнд мэдэгдэж, эхний хэрэглэгчийн хөнгөлөлт авна.",
    syncOn: n => `✓ ${n} — таны амжилт account дээр хадгалагдаж, бүх төхөөрөмж дээр харагдана.`,
    syncOff: "Нэвтэрвэл амжилт тань account дээр хадгалагдаж, утас, компьютер аль алинаас харагдана. Дэлхийн жагсаалтад нэр тань гарна.",
    wlPlaceholder: "таны имэйл", wlButton: "Мэдэгдэл авах",
    wlDone: "Баярлалаа! Premium нээгдэхэд танд имэйлээр мэдэгдэнэ.", wlBad: "Имэйл хаяг буруу байна.", wlError: "Хадгалж чадсангүй. Дахин оролдоно уу.",
  },

  en: {
    tagline: "mongolian · english typing test",
    footer: "Settings and personal bests are stored in your browser.",

    punctuation: "punctuation", numbers: "numbers",
    time: "time", words: "words", quote: "quote", zen: "zen", custom: "custom",
    quoteLen: { all: "all", short: "short", medium: "medium", long: "long" },
    change: "change", customTime: "How many seconds?", customWords: "How many words?",
    langNames: { mn: "mongolian", mn_short: "mongolian · short words", en: "english", en_short: "english · short words" },

    clickToFocus: "Click here to continue",
    restartHint: "restart test", commandHint: "command line",
    zenHint: "Type freely. Finish with Shift + Enter",
    capsLock: "Caps Lock is on",
    layoutMn: "Switch your keyboard to Mongolian (Cyrillic)", layoutEn: "Switch your keyboard to English (US)",
    warnLatin: "You are typing Latin letters. Switch your keyboard to Mongolian (Cyrillic).",
    warnCyr: "You are typing Cyrillic letters. Switch your keyboard to English.",

    units: { wpm: "wpm", cpm: "cpm", wps: "wps", cps: "cps" },
    wpm: "wpm", acc: "acc", raw: "raw", characters: "characters", consistency: "consistency",
    timeLabel: "time", testType: "test type", other: "other", sec: "s",
    charsTip: "correct / incorrect / extra / missed",
    failed: "failed", failReasons: {
      master: "master: a single mistake fails the test", expert: "expert: submitted an incorrect word",
      minWpm: "speed below minimum", minAcc: "accuracy below minimum", minBurst: "word burst below minimum",
    },
    repeated: "repeated", lazy: "lazy mode",
    newPb: "New personal best!", pb: n => `Personal best: ${n}`, avg10: (w, a) => `Last 10 average: ${w} · ${a}%`,
    next: "Next test", repeat: "Repeat test", history: "Words history", practice: "Practice missed words",
    copy: "Copy result", copied: "Copied",
    quoteSrcMn: "Mongolian folk proverb", quoteSrcEn: "English proverb", passageSrc: "NomadType text",
    chartWpm: "wpm", chartRaw: "raw", chartErr: "errors",

    navTest: "Test", navBoard: "Leaderboard", navAbout: "About", navSettings: "Settings", navStats: "My stats",

    settingsTitle: "Settings", searchSettings: "search settings",
    groups: { behavior: "behavior", input: "input", sound: "sound", caret: "caret", appearance: "appearance", theme: "theme", hide: "hide elements", danger: "danger zone" },
    tipCmd: "Tip: press Esc or Ctrl + Shift + P to change settings quickly from the command line.",
    exportBtn: "export", importBtn: "import", resetSettings: "reset settings", resetPbs: "reset personal bests", resetHistory: "reset history",
    exportTitle: "Export settings", exportDesc: "Copy your settings as JSON.",
    importTitle: "Import settings", importDesc: "Paste settings JSON you exported before.",
    resetSettingsTitle: "Reset settings", resetSettingsDesc: "Resets all settings to their defaults.",
    resetPbsTitle: "Reset personal bests", resetPbsDesc: "Deletes all personal bests stored in this browser.",
    resetHistoryTitle: "Reset history", resetHistoryDesc: "Deletes all saved test results.",
    confirmReset: "Are you sure? This cannot be undone.", done: "Done", importBad: "That JSON is not valid.",
    apply: "Apply", cancel: "Cancel", custom2: "custom",
    on: "on", off: "off",

    customTitle: "Custom text", customText: "Paste the text you want to type", customRandom: "Shuffle words",
    customLimit: "Word count (0 = all)",

    cmdPlaceholder: "Search commands…", cmdRestart: "Restart test", cmdUi: "Interface language",
    cmdMode: "Mode", cmdLang: "Language", cmdPunct: "Toggle punctuation", cmdNums: "Toggle numbers",
    cmdGo: "Go to page",

    aboutTitle: "What is NomadType?",
    aboutBody: [
      "NomadType is a free site for learning to type fast and accurately in Mongolian Cyrillic and English. No ads, and no account needed.",
      "Speed is measured in words per minute: correctly typed characters (including spaces) divided by 5, per minute. Accuracy is the share of correct keystrokes.",
      "Modes: time (15–120 s), word count, quote (proverbs, medium and long texts), zen (free typing) and custom text. Add punctuation and numbers to make it harder.",
      "To learn touch typing, turn on Settings → appearance → keymap and follow the next key.",
    ],
    aboutKeys: "Shortcuts", aboutWords: (m, e) => `Word lists: ${m} Mongolian and ${e} English words.`,

    statsTitle: "My stats", started: "tests started", completed: "tests completed", typingTime: "time typing",
    pbTable: "Personal bests", recent: "Recent tests", noData: "No tests yet.",
    colDate: "date", colTest: "test",

    signIn: "Sign in / Sign up",
    authSignIn: "Sign in", authSignUp: "Sign up", authAccount: "My account", authResetTitle: "Reset password",
    authName: "Name (shown on leaderboards)", authEmail: "Email", authPass: "Password", authPass2: "Repeat password",
    authForgot: "Forgot your password?", authBack: "← Back to sign in", authOr: "or", authGoogle: "Continue with Google",
    authResetHint: "Enter the email you signed up with and we'll send you a link to set a new password.",
    authResetSend: "Send reset link",
    authResetSent: "Sent! Check your inbox (and the Spam folder) and follow the link to set a new password.",
    authSynced: "Your results and lesson progress are saved to this account.", authSignOut: "Sign out",
    errEmail: "That email address is not valid.", errInUse: "This email is already registered. Use the \"Sign in\" tab.",
    errWeak: "Password must be at least 6 characters.", errMismatch: "The two passwords don't match.",
    errName: "Please enter a name of 2–40 characters.", errWrong: "Wrong email or password.",
    errMany: "Too many attempts. Please wait a moment and try again.", errNet: "Check your internet connection.",
    errDisabled: "This sign-in method is not enabled (Firebase → Sign-in method).", errPopup: "The browser blocked the popup. Allow it and try again.",
    errDomain: "This domain is not authorized in Firebase (Authorized domains).", errOther: "Something went wrong. Please try again.", signOut: name => `${name} · sign out`,
    boardTitle: label => `Top 10 · ${label}`,
    boardLoading: "Loading leaderboard…", boardEmpty: "No scores yet. Be the first!",
    boardError: "Could not load the leaderboard.",
    boardOff: "To enable global leaderboards, add your Firebase config to js/firebase-config.js (see README).",
    noteSignIn: "Sign in to put your score on this leaderboard.",
    noteSaved: "Your new best was saved to the leaderboard.",
    noteNotBetter: "Your leaderboard score is already higher.",
    noteLowAcc: "Accuracy must be above 90% to enter the leaderboard.",
    noteQuote: "Leaderboards only count \"time\" mode 15/30/60 s tests without punctuation, numbers or lazy mode.",
    boardPageTitle: "Leaderboards",

    navLearn: "Learn touch typing", lesson: "lesson",
    learnTitle: "Learn touch typing",
    learnIntro: [
      "Typing with all ten fingers, without looking at the keyboard, can make you several times faster. Each lesson teaches just a few new keys.",
      "Mongolian layout: left fingers rest on й ы б ө and right fingers on р о л д. Your index fingers sit on ө and р, the keys with small bumps. Press space with your thumb.",
      "During a lesson the keymap highlights the next key and outlines the new keys. To pass you need at least 95% accuracy — accuracy first, speed second.",
    ],
    lessonNeed: (w, a) => `To pass: ${w}+ wpm, ${a}%+ accuracy`,
    lessonPassed: "Passed!", lessonFailed: "Let's try once more",
    lessonRetry: "Retry", lessonNext: "Next lesson →", lessonList: "All lessons", lessonBack: "← Lessons",
    lessonProgress: (d, n, s, m) => `${d} of ${n} lessons passed · ★ ${s}/${m}`,
    lessonNextTag: "next", lessonStart: "Start", lessonContinue: "Continue",
    courseMn: "Mongolian (Cyrillic)", courseEn: "English (QWERTY)",

    wlTitle: "NomadType Premium is coming",
    wlDesc: "Daily practice plans, weak-key analysis, detailed progress stats and competitions. Leave your email to hear first when it opens and get an early-user discount.",
    syncOn: n => `✓ ${n} — your results are saved to your account and visible on every device.`,
    syncOff: "Sign in to save your results to your account, see them on any device and get your name on the global leaderboard.",
    wlPlaceholder: "your email", wlButton: "Notify me",
    wlDone: "Thank you! We'll email you when Premium opens.", wlBad: "That email address is not valid.", wlError: "Could not save. Please try again.",
  },
};
