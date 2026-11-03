// NomadType — account-ын өгөгдлийг Cloud Firestore-д хадгалах.
// Нэвтэрсэн хэрэглэгчийн дээд амжилт, тестийн түүх, хичээлийн ахиц, нийт статистик
// users/{uid} баримтад хадгалагдаж, ямар ч төхөөрөмжөөс нэвтрэхэд харагдана.
//
// Нэвтрэх үед: төхөөрөмж дээрх өгөгдөл + account дээрх өгөгдлийг нэгтгэнэ (шилдгийг нь авна).
// Тест дуусах бүрд: account руу шинэчилнэ.
// Гарах үед: энэ төхөөрөмж дээрх хувийн өгөгдлийг цэвэрлэнэ (account дээрээ хадгалагдсан хэвээр).

import { firebaseEnabled } from "./firebase-config.js";

if (firebaseEnabled) {
  const { db, onUser, displayName } = await import("./auth.js");
  const { doc, getDoc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");

  const NT = window.NT, store = NT.store;
  const KEYS = ["nt-pbs", "nt-lessons", "nt-history", "nt-stats"];
  const CLOUD_HISTORY = 100;  // account дээр хадгалах сүүлийн тестийн тоо

  // ---------- Нэгтгэх ----------
  function mergePbs(a = {}, b = {}) {
    const out = { ...a };
    for (const [k, v] of Object.entries(b)) if (v && (!out[k] || v.wpm > out[k].wpm)) out[k] = v;
    return out;
  }
  function mergeLessons(a = {}, b = {}) {
    const out = { mn: { ...(a.mn || {}) }, en: { ...(a.en || {}) } };
    for (const lang of ["mn", "en"]) {
      for (const [i, v] of Object.entries((b && b[lang]) || {})) {
        const cur = out[lang][i];
        if (!cur || v.stars > cur.stars || (v.stars === cur.stars && v.wpm > cur.wpm)) out[lang][i] = v;
      }
    }
    return out;
  }
  function mergeHistory(a = [], b = []) {
    const map = new Map();
    for (const r of [...a, ...b]) if (r && r.date) map.set(r.date, r);
    return [...map.values()].sort((x, y) => x.date - y.date).slice(-500);
  }
  function mergeStats(a = {}, b = {}) {
    const out = {};
    for (const k of ["started", "completed", "seconds"]) out[k] = Math.max(a[k] || 0, b[k] || 0);
    return out;
  }

  const local = () => ({
    pbs: store.get("nt-pbs", {}), lessons: store.get("nt-lessons", { mn: {}, en: {} }),
    history: store.get("nt-history", []), stats: store.get("nt-stats", { started: 0, completed: 0, seconds: 0 }),
  });

  let user = null, timer = null, prevUid = null;

  async function push() {
    if (!user) return;
    const d = local();
    try {
      await setDoc(doc(db, "users", user.uid), {
        name: displayName(user), pbs: d.pbs, lessons: d.lessons, stats: d.stats,
        history: d.history.slice(-CLOUD_HISTORY), updatedAt: serverTimestamp(),
      });
    } catch (err) { console.warn("Sync push:", err && err.code); }
  }
  const pushSoon = () => { clearTimeout(timer); timer = setTimeout(push, 1200); };

  async function pull() {
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      const c = snap.exists() ? snap.data() : {};
      const l = local();
      store.set("nt-pbs", mergePbs(l.pbs, c.pbs));
      store.set("nt-lessons", mergeLessons(l.lessons, c.lessons));
      store.set("nt-history", mergeHistory(l.history, c.history));
      store.set("nt-stats", mergeStats(l.stats, c.stats));
      await push();
      NT.emit("nt:synced", { uid: user.uid });
    } catch (err) { console.warn("Sync pull:", err && err.code); }
  }

  onUser(u => {
    user = u;
    NT.account = u ? { uid: u.uid, name: displayName(u) } : null;
    if (u && u.uid !== prevUid) pull();
    else if (u) pushSoon(); // нэр солигдсон (бүртгүүлэх үед) — account-ыг шинэчилнэ
    if (!u && prevUid) {
      // Гарсан: энэ төхөөрөмж дээрх хувийн өгөгдлийг цэвэрлэнэ.
      KEYS.forEach(k => store.del(k));
      NT.emit("nt:synced", { uid: null });
    }
    prevUid = u ? u.uid : null;
    NT.emit("nt:account", { signedIn: !!u });
  });

  window.addEventListener("nt:result", () => { if (user) pushSoon(); });
  // Хуудсыг хаахаас өмнө хүлээгдэж буй өөрчлөлтийг илгээнэ.
  window.addEventListener("pagehide", () => { if (timer) { clearTimeout(timer); push(); } });
}
