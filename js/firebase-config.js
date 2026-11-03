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
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
