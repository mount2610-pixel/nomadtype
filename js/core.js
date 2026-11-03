// NomadType — бусад бүх скриптийн ашигладаг жижиг туслахууд.
//   NT.store  — localStorage (алдаа гарвал чимээгүй алгасна)
//   NT.$      — getElementById
//   NT.h      — элемент үүсгэх
//   NT.emit   — window дээр CustomEvent илгээх
//   NT.t      — орчуулга авах (интерфейсийн хэлийг config-оос уншина)

window.NT = (() => {
  "use strict";

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* хадгалах боломжгүй */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* */ } },
  };

  const $ = id => document.getElementById(id);

  // h("button", { class: "x", onclick: fn, dataset: { a: 1 } }, "текст", childEl)
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "dataset") Object.assign(el.dataset, v);
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (k === "text") el.textContent = v;
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      el.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    }
    return el;
  }

  const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

  const ui = () => (window.NT.config ? window.NT.config.get("uiLang") : "mn");
  function t(key) {
    const L = window.NT_I18N;
    const v = L[ui()] && L[ui()][key];
    return v === undefined ? (L.en[key] === undefined ? key : L.en[key]) : v;
  }

  // Хоёр хэлтэй объектоос ({ mn, en }) одоогийн хэлийг сонгох.
  const tr = obj => (obj && typeof obj === "object" ? (obj[ui()] ?? obj.en) : obj);

  return { store, $, h, emit, t, tr, ui };
})();
