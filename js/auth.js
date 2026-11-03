// NomadType — нэвтрэх систем (Firebase Authentication).
//   • Имэйл (Gmail г.м.) + нууц үгээр бүртгүүлэх, нэвтрэх
//   • Нууц үгээ мартсан бол имэйлээр сэргээх холбоос авах
//   • Google-ээр нэг товшилтоор нэвтрэх
// Энэ файлыг js/leaderboard.js, js/sync.js, js/waitlist.js зөвхөн Firebase тохируулсан үед ачаална.
// Firebase Console → Authentication → Sign-in method дээр "Email/Password" ба "Google"-ийг асаасан байх ёстой.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

let currentUser = null;
const listeners = new Set();
const notify = () => listeners.forEach(cb => cb(currentUser));

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
  return name.trim().slice(0, 40) || "Nomad";
}

// ---------- Цонх (modal) ----------
const $ = id => document.getElementById(id);
const t = key => window.NT.t(key);
const btn = $("authBtn"), modal = $("authModal"), form = $("authForm"), msg = $("afMsg");
const fields = { name: $("afName"), email: $("afEmail"), pass: $("afPass"), pass2: $("afPass2") };
let mode = "signin"; // signin | signup | reset | account

function show(m) {
  mode = m;
  const signedIn = m === "account";
  modal.querySelectorAll("[data-auth-tab]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.authTab === m)));
  $("afTabs").hidden = signedIn || m === "reset";
  form.hidden = signedIn;
  $("afGoogleWrap").hidden = signedIn || m === "reset";
  $("afAccount").hidden = !signedIn;
  $("afNameRow").hidden = m !== "signup";
  $("afPassRow").hidden = m === "reset";
  $("afPass2Row").hidden = m !== "signup";
  $("afForgot").hidden = m !== "signin";
  $("afBack").hidden = m !== "reset";
  $("afTitle").textContent = t({ signin: "authSignIn", signup: "authSignUp", reset: "authResetTitle", account: "authAccount" }[m]);
  $("afSubmit").textContent = t({ signin: "authSignIn", signup: "authSignUp", reset: "authResetSend" }[m] || "authSignIn");
  $("afResetHint").hidden = m !== "reset";
  fields.pass.autocomplete = m === "signup" ? "new-password" : "current-password";
  if (signedIn && currentUser) {
    $("afWho").textContent = displayName(currentUser);
    $("afWhoEmail").textContent = currentUser.email || "";
  }
  setMsg("");
}

function open(m) {
  show(m || (currentUser ? "account" : "signin"));
  modal.hidden = false;
  const first = [fields.name, fields.email].find(el => !el.closest("[hidden]"));
  if (first) first.focus();
}
function close() {
  modal.hidden = true;
  if (window.NT.test) window.NT.test.focus();
}
function setMsg(text, ok = false) {
  msg.textContent = text;
  msg.classList.toggle("ok", ok);
}

// Firebase-ийн алдааг ойлгомжтой бичвэр болгох.
function errorText(err) {
  const code = (err && err.code) || "";
  const map = {
    "auth/invalid-email": "errEmail", "auth/missing-email": "errEmail",
    "auth/email-already-in-use": "errInUse", "auth/weak-password": "errWeak", "auth/missing-password": "errWeak",
    "auth/invalid-credential": "errWrong", "auth/wrong-password": "errWrong", "auth/user-not-found": "errWrong",
    "auth/invalid-login-credentials": "errWrong", "auth/too-many-requests": "errMany",
    "auth/network-request-failed": "errNet", "auth/operation-not-allowed": "errDisabled",
    "auth/popup-blocked": "errPopup", "auth/unauthorized-domain": "errDomain",
  };
  return t(map[code] || "errOther");
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const email = fields.email.value.trim();
  const pass = fields.pass.value;
  const submit = $("afSubmit");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setMsg(t("errEmail"));
  auth.languageCode = window.NT.ui();
  submit.disabled = true;
  try {
    if (mode === "reset") {
      await sendPasswordResetEmail(auth, email);
      setMsg(t("authResetSent"), true);
    } else if (mode === "signup") {
      const name = fields.name.value.trim();
      if (name.length < 2 || name.length > 40) throw { code: "nt/name" };
      if (pass.length < 6) throw { code: "auth/weak-password" };
      if (pass !== fields.pass2.value) throw { code: "nt/mismatch" };
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      currentUser = auth.currentUser;
      notify(); // шинэ нэрийг бусад хэсэгт (жагсаалт, account) мэдэгдэнэ
      renderButton();
      close();
    } else {
      await signInWithEmailAndPassword(auth, email, pass);
      close();
    }
  } catch (err) {
    if (err && err.code === "nt/name") setMsg(t("errName"));
    else if (err && err.code === "nt/mismatch") setMsg(t("errMismatch"));
    else { console.warn("Auth:", err && err.code); setMsg(errorText(err)); }
  } finally {
    submit.disabled = false;
  }
});

$("afGoogle").addEventListener("click", async () => {
  try {
    auth.languageCode = window.NT.ui();
    await signInWithPopup(auth, new GoogleAuthProvider());
    close();
  } catch (err) {
    if (err && (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request")) return;
    console.warn("Auth:", err && err.code);
    setMsg(errorText(err));
  }
});

$("afSignOut").addEventListener("click", async () => { await signOut(auth); close(); });
$("afForgot").addEventListener("click", () => show("reset"));
$("afBack").addEventListener("click", () => show("signin"));
$("afClose").addEventListener("click", close);
modal.querySelectorAll("[data-auth-tab]").forEach(b => b.addEventListener("click", () => show(b.dataset.authTab)));
modal.addEventListener("mousedown", e => { if (e.target === modal) close(); });
modal.addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Escape") close(); });

// ---------- Толгой хэсгийн товч ----------
function renderButton() {
  btn.hidden = false;
  btn.textContent = currentUser ? "● " + displayName(currentUser) : t("signIn");
  btn.classList.toggle("signed-in", !!currentUser);
}
btn.addEventListener("click", () => open());
window.addEventListener("nt:ui", () => { renderButton(); if (!modal.hidden) show(mode); });

// Бусад скрипт (жишээ нь "Миний амжилт" хуудасны товч) цонхыг нээх.
window.NT.openAuth = open;

onAuthStateChanged(auth, user => {
  currentUser = user;
  renderButton();
  notify();
});

renderButton();
