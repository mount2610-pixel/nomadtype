// NomadType — Google-ээр нэвтрэх (Firebase Authentication).
// Энэ файлыг js/leaderboard.js зөвхөн Firebase тохируулсан үед ачаална.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

let currentUser = null;
const listeners = new Set();

/** Нэвтэрсэн хэрэглэгч солигдох бүрд дуудагдана. */
export function onUser(cb) {
  listeners.add(cb);
  cb(currentUser);
  return () => listeners.delete(cb);
}

export const getUser = () => currentUser;

/** Жагсаалтад харагдах нэр (имэйл хэзээ ч харуулахгүй). */
export function displayName(user) {
  const name = (user && user.displayName) || "Nomad";
  return name.slice(0, 40);
}

// ---------- Толгой хэсгийн товч ----------
const btn = document.getElementById("authBtn");
const t = key => window.NT.t(key);

function renderButton() {
  btn.hidden = false;
  btn.textContent = currentUser ? t("signOut")(displayName(currentUser)) : t("signIn");
}

btn.addEventListener("click", async () => {
  try {
    if (currentUser) await signOut(auth);
    else await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (err) {
    // Цонхыг хаасан, эсвэл popup хаагдсан бол юу ч хийхгүй.
    console.warn("Auth:", err && err.code);
  }
});

window.addEventListener("nt:ui", renderButton);

onAuthStateChanged(auth, user => {
  currentUser = user;
  renderButton();
  listeners.forEach(cb => cb(user));
});

renderButton();
