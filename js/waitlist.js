// NomadType — "Premium удахгүй — имэйлээ үлдээ" хүлээлгийн жагсаалт (Cloud Firestore).
// Бүтэц: waitlist/{имэйл} → { email, lang, source, createdAt }
// Бүртгүүлсэн имэйлүүдийг Firebase Console → Firestore Database → waitlist хэсгээс харна.
// Firebase тохируулаагүй бол энэ файл юу ч харуулахгүй.

import { firebaseEnabled } from "./firebase-config.js";

if (firebaseEnabled) {
  const { db } = await import("./auth.js");
  const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");

  const NT = window.NT;
  const t = key => NT.t(key);
  const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const isDone = () => NT.store.get("nt-waitlist", false);

  function render(slot) {
    if (!slot) return;
    slot.innerHTML = "";
    const box = NT.h("div", { class: "waitlist" });
    box.appendChild(NT.h("h3", {}, "✦ " + t("wlTitle")));
    box.appendChild(NT.h("p", {}, t("wlDesc")));
    const msg = NT.h("p", { class: "wl-msg", role: "status" });

    if (isDone()) {
      msg.textContent = t("wlDone");
      box.appendChild(msg);
      slot.appendChild(box);
      return;
    }

    const input = NT.h("input", { type: "email", class: "num", placeholder: t("wlPlaceholder"), autocomplete: "email", required: true, maxlength: 200 });
    const btn = NT.h("button", { type: "submit", class: "opt primary" }, t("wlButton"));
    const form = NT.h("form", { class: "wl-form" }, input, btn);
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const email = input.value.trim().toLowerCase();
      if (!EMAIL.test(email) || email.length > 200 || email.includes("/")) { msg.textContent = t("wlBad"); return; }
      btn.disabled = true;
      try {
        await setDoc(doc(db, "waitlist", email), {
          email, lang: NT.ui(), source: slot.dataset.source || "site", createdAt: serverTimestamp(),
        });
        NT.store.set("nt-waitlist", true);
      } catch (err) {
        // Аль хэдийн бүртгүүлсэн имэйл дахин бичигдэхгүй (permission-denied) — энэ нь амжилт гэсэн үг.
        if (!(err && err.code === "permission-denied")) { console.warn("Waitlist:", err && err.code); msg.textContent = t("wlError"); btn.disabled = false; return; }
        NT.store.set("nt-waitlist", true);
      }
      document.querySelectorAll(".waitlist-slot").forEach(render);
    });
    // Бичих үед тестийн товчлол (Tab, Esc) ажиллахгүй байх.
    input.addEventListener("keydown", e => e.stopPropagation());

    box.appendChild(form);
    box.appendChild(msg);
    slot.appendChild(box);
  }

  NT.waitlist = { render };
  document.querySelectorAll(".waitlist-slot").forEach(render);
  window.addEventListener("nt:ui", () => document.querySelectorAll(".waitlist-slot").forEach(render));
}
