// NomadType — Firebase тохиргоо.
//
// Жагсаалт (leaderboard), Google-ээр нэвтрэх боломжийг ашиглах бол:
//   1. https://console.firebase.google.com дээр шинэ төсөл үүсгэнэ.
//   2. Project settings → Your apps → Web app (</>) нэмнэ.
//   3. Гарч ирсэн firebaseConfig-ийн утгуудыг доор хуулна.
// Хоосон үлдээвэл сайт жагсаалтгүйгээр хэвийн ажиллана.
//
// Эдгээр утгууд нууц биш (вэб апп бүрт харагддаг). Аюулгүй байдлыг firestore.rules хамгаална.

export const firebaseConfig = {
  apiKey: "AIzaSyAbTWr7NgYcAbjjN4fnx60rdsvdm2UIYKI",
  authDomain: "nomadtype-9214c.firebaseapp.com",
  projectId: "nomadtype-9214c",
  storageBucket: "nomadtype-9214c.firebasestorage.app",
  messagingSenderId: "297243933634",
  appId: "1:297243933634:web:a02fca001762111f4df45b",
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
