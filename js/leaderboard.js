// NomadType — дэлхийн жагсаалт (Cloud Firestore).
// Бүтэц: leaderboards/{хэл_секунд}/scores/{uid} → { uid, name, wpm, acc, updatedAt }
// Хэрэглэгч бүр тест бүрт ганц мөртэй, зөвхөн өөрийн дээд амжилтаа шинэчилнэ.

import { firebaseEnabled } from "./firebase-config.js";

if (firebaseEnabled) {
  window.NT_FIREBASE_ON = true;
  const { db, onUser, getUser, displayName } = await import("./auth.js");
  const {
    collection, doc, getDoc, getDocs, setDoc, query, orderBy, limit, serverTimestamp,
  } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");

  const MIN_ACC = 90;     // жагсаалтад орох доод нарийвчлал
  const MAX_WPM = 250;    // үүнээс өндөр дүнг хүлээж авахгүй (firestore.rules-тэй ижил)

  const $ = id => document.getElementById(id);
  const t = key => window.NT.t(key);
  const boardEl = $("board"), titleEl = $("boardTitle"), noteEl = $("boardNote"), listEl = $("boardList");

  let last = null;       // сүүлийн тестийн дүн
  let noteKey = "";      // одоо харуулж буй тайлбар

  const boardId = r => `${r.lang}_${r.seconds}`;
  const scoresRef = r => collection(db, "leaderboards", boardId(r), "scores");

  function setNote(key) {
    noteKey = key;
    noteEl.textContent = key ? t(key) : "";
  }

  // Жагсаалтад орох тест: "хугацаа" горим 15/30/60, цэг таслал, тоо, залхуу горимгүй, бүтэн үгийн сан.
  const eligible = r => r.mode === "time" && [15, 30, 60].includes(r.seconds) && ["mn", "en"].includes(r.language)
    && !r.punctuation && !r.numbers && !r.lazy && !r.failed;

  function renderRows(rows, list = listEl) {
    list.innerHTML = "";
    if (!rows.length) {
      const li = document.createElement("li");
      li.textContent = t("boardEmpty");
      list.appendChild(li);
      return;
    }
    const me = getUser();
    rows.forEach((r, i) => {
      const li = document.createElement("li");
      if (me && r.uid === me.uid) li.classList.add("me");
      const cells = [
        ["rank", `${i + 1}.`],
        ["name", r.name || "Nomad"],
        ["wpm", `${r.wpm} ${t("wpm")}`],
        ["acc", `${r.acc}%`],
      ];
      for (const [cls, text] of cells) {
        const span = document.createElement("span");
        span.className = cls;
        span.textContent = text; // textContent тул нэрэнд HTML оруулж чадахгүй
        li.appendChild(span);
      }
      list.appendChild(li);
    });
  }

  async function loadTop(r, list = listEl, title = titleEl) {
    if (title) title.textContent = t("boardTitle")(r.label);
    list.innerHTML = "";
    const loading = document.createElement("li");
    loading.textContent = t("boardLoading");
    list.appendChild(loading);
    try {
      const snap = await getDocs(query(scoresRef(r), orderBy("wpm", "desc"), limit(10)));
      renderRows(snap.docs.map(d => d.data()), list);
    } catch (err) {
      console.warn("Leaderboard:", err && err.code);
      list.innerHTML = "";
      const li = document.createElement("li");
      li.textContent = t("boardError");
      list.appendChild(li);
    }
  }

  // "Жагсаалт" хуудас (js/pages.js) нээгдэхэд.
  window.addEventListener("nt:lb-open", e => {
    const list = $("lbList");
    if (list) loadTop(e.detail, list, null);
  });

  async function submit(r) {
    const user = getUser();
    if (!user) return setNote("noteSignIn");
    if (r.acc < MIN_ACC) return setNote("noteLowAcc");
    if (r.wpm > MAX_WPM) return setNote("");
    try {
      const ref = doc(scoresRef(r), user.uid);
      const prev = await getDoc(ref);
      if (prev.exists() && prev.data().wpm >= r.wpm) return setNote("noteNotBetter");
      await setDoc(ref, {
        uid: user.uid,
        name: displayName(user),
        wpm: Math.round(r.wpm),
        acc: Math.round(r.acc),
        updatedAt: serverTimestamp(),
      });
      setNote("noteSaved");
    } catch (err) {
      console.warn("Save score:", err && err.code);
      setNote("boardError");
    }
  }

  window.addEventListener("nt:result", async e => {
    last = e.detail;
    boardEl.hidden = false;
    if (!eligible(last)) {
      titleEl.textContent = "";
      listEl.innerHTML = "";
      return setNote("noteQuote");
    }
    setNote("");
    await submit(last);
    await loadTop(last);
  });

  // Хэл солигдоход гарчиг, тайлбарыг шинэчилнэ.
  window.addEventListener("nt:ui", () => {
    if (!last) return;
    if (eligible(last)) titleEl.textContent = t("boardTitle")(last.label);
    if (noteKey) noteEl.textContent = t(noteKey);
  });

  // Дүн гарсны дараа нэвтэрвэл тэр дүнг шууд хадгална.
  onUser(async user => {
    if (user && last && eligible(last) && !$("result").hidden) {
      await submit(last);
      await loadTop(last);
    }
  });

  // Хуудас "Жагсаалт" дээр нээгдсэн бол Firebase ачаалсны дараа дахин зурна.
  if (location.hash === "#leaderboard" && window.NT.pages) window.NT.pages.renderBoard();
}
