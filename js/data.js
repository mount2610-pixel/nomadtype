// NomadType — үгс, эхүүд, зүйр үгс. (Интерфейсийн орчуулга js/i18n.js-д байна.)
// Шинэ үг нэмэх бол WORDS.mn эсвэл WORDS.en жагсаалтад зайгаар тусгаарлан бичнэ (давхардвал автоматаар хасагдана).
// Шинэ эх нэмэх бол PASSAGES жагсаалтад нэг мөр нэмнэ.

window.NT_DATA = (() => {
  "use strict";

  const list = s => [...new Set(s.split(/\s+/).filter(Boolean))];

  const WORDS = {
    mn: list(`
      би чи тэр бид та тэд энэ тэдгээр эдгээр өөр өөрөө хүн бүр бүх зарим нэг хоёр гурав дөрөв тав зургаа долоо найм ес арав
      зуу мянга юу хэн хаана хэзээ яагаад яаж ямар хэдэн хаашаа хаанаас аль бол биш байна байсан болно байх болох
      гэж гэсэн гэхдээ харин мөн бас дахин одоо өнөөдөр маргааш өчигдөр нөгөөдөр жил сар долоо_хоног өдөр цаг минут секунд
      эрт оройтох үргэлж заримдаа хааяа ихэвчлэн удахгүй саяхан аль_хэдийн хэзээ_ч одоохондоо урьд дараа өмнө хойно
      дээр доор дотор гадна хажууд дунд урд ард зүүн баруун ойр хол энд тэнд наана цаана
      хүн хүүхэд эр эм эрэгтэй эмэгтэй хөвгүүн охин аав ээж эцэг эх ах эгч дүү өвөө эмээ авга нагац хүргэн бэр гэр_бүл
      найз нөхөр хөрш зочин багш сурагч оюутан эмч жолооч тогооч ажилчин дарга захирал худалдагч цагдаа цэрэг малчин тариачин
      уран_зураач дуучин зохиолч сэтгүүлч инженер программист нягтлан хуульч эмнэлэг сургууль цэцэрлэг их_сургууль номын_сан
      гэр байр байшин өрөө гал_тогоо хаалга цонх хана шал тааз шат дээвэр хашаа гудамж зам талбай хот тосгон сум аймаг
      улс нийслэл хил тал хээр говь цөл уул толгод хад чулуу элс шороо ой мод бут өвс цэцэг навч үндэс үр жимс
      гол мөрөн нуур булаг худаг далай ус мөс цас бороо мөндөр салхи шуурга үүл манан тэнгэр нар сар од гэрэл сүүдэр
      өглөө үд орой шөнө үдэш өвөл хавар зун намар хүйтэн дулаан халуун сэрүүн хуурай чийгтэй
      мал адуу морь үхэр үнээ тугал хонь хурга ямаа ишиг тэмээ ботго нохой муур хулгана туулай чоно үнэг баавгай буга
      шувуу бүргэд шонхор тогоруу хэрээ тахиа загас могой мэлхий зөгий эрвээхэй шоргоолж
      хоол цай сүү тараг айраг цагаан_идээ мах гурил талх будаа гоймон шөл бууз хуушуур банш ногоо төмс лууван сонгино
      алим жимс чихэр давс элсэн_чихэр тос өндөг бяслаг ундаа кофе
      аяга таваг халбага сэрээ хутга тогоо хувин сав шил ширээ сандал ор шүүгээ дэр хөнжил толь
      хувцас дээл малгай гутал цамц өмд хүрэм цув бээлий оймс бүс
      мөнгө төгрөг үнэ төлбөр зардал орлого цалин хадгаламж зээл банк дэлгүүр зах худалдаа бараа ажил хөдөлмөр компани байгууллага
      утас компьютер интернэт сайт програм файл зураг видео дуу хөгжим кино ном сонин сэтгүүл захидал мессеж мэдээ
      машин автобус галт_тэрэг онгоц дугуй замын_хөдөлгөөн аялал жуулчин буудал зочид_буудал
      бие толгой нүүр нүд чих хамар ам шүд хэл үс хүзүү мөр гар хуруу хөл өвдөг зүрх уушиг гэдэс нуруу
      эрүүл өвчин эм эмчилгээ халуурах ханиад амрах унтах нойр хүч чадал
      сайн муу их бага олон цөөн шинэ хуучин том жижиг өндөр нам урт богино өргөн нарийн зузаан нимгэн
      хурдан удаан амар хэцүү хялбар үнэн худал зөв буруу цэвэр бохир хөнгөн хүнд хүчтэй сул сайхан муухай
      баян ядуу залуу хөгшин ухаалаг тэнэг эелдэг хатуу зөөлөн чимээгүй шуугиантай аз_жаргалтай гунигтай
      улаан шар ногоон цэнхэр хөх цагаан хар саарал бор ягаан улбар
      явах ирэх очих гарах орох суух босох хэвтэх зогсох гүйх алхах үсрэх сэлэх нисэх унах
      идэх уух унтах сэрэх угаах хувцаслах харах сонсох үнэрлэх мэдрэх ярих хэлэх асуух хариулах дуудах
      бичих унших сурах заах судлах тоолох бодох санах мартах мэдэх ойлгох итгэх хүсэх хэрэгтэй чадах
      хийх бүтээх засах эвдэх барих нээх хаах өгөх авах худалдах худалдан_авах төлөх хадгалах алдах олох хайх
      эхлэх дуусах үргэлжлүүлэх зогсоох хүлээх туслах дэмжих тоглох инээх уйлах хайрлах дурлах санаа_зовох айх
      амьдрах төрөх үхэх өсөх хөгжих өөрчлөх ялах ялагдах оролдох хичээх бэлтгэх шийдэх сонгох
      монгол хэл бичиг үсэг үг өгүүлбэр эх ном дэвтэр хичээл мэдлэг боловсрол шинжлэх ухаан санаа зорилго
      түүх соёл ёс заншил уламжлал баяр наадам бөх харваа уралдаан ялалт амжилт ирээдүй өнгөрсөн
      эх_орон ард_түмэн нүүдэлчин эрх_чөлөө энх_тайван найрамдал хайр сэтгэл зүрх_сэтгэл итгэл найдвар мөрөөдөл
      асуудал шийдэл арга зам үр_дүн хариу асуулт жишээ дүрэм хууль эрх үүрэг
    `).map(w => w.replace(/_/g, " ")).flatMap(w => w.split(" ")).filter((w, i, a) => a.indexOf(w) === i),

    en: list(`
      the be to of and a in that have it for not on with he as you do at this but his by from they we say her she
      or an will my one all would there their what so up out if about who get which go me when make can like time no
      just him know take people into year your good some could them see other than then now look only come its over
      think also back after use two how our work first well way even new want because any these give day most us
      great small large long little old right big high different place same last early young important few public bad
      able home world life hand part child eye woman man school country family student group problem fact water
      money story month lot book word business issue side kind head house service friend father mother power hour game line
      end member law car city name team minute idea kid body information parent face others level office
      door health person art war history party result change morning reason research girl boy moment air teacher force
      education horse river mountain sky sun moon star wind snow rain winter summer spring autumn road travel nomad steppe
      fast slow learn read write speak listen type key finger practice skill speed letter keyboard screen
      again always never often sometimes today tomorrow yesterday tonight soon later before during while until since
      here where why around between under above below near far inside outside behind across through toward
      food bread rice meat milk tea coffee fruit apple sugar salt egg cheese soup dinner lunch breakfast kitchen table chair
      bed window floor wall room garden street town village market shop store bank station airport hotel hospital
      doctor nurse driver worker farmer artist writer singer engineer manager friend neighbor brother sister baby
      cat dog bird fish cow sheep goat camel wolf bear eagle tree flower grass forest desert lake sea ocean island
      red blue green yellow white black gray brown orange purple pink color light dark bright warm cold hot cool dry wet
      happy sad angry calm quiet loud strong weak easy hard simple clear free busy ready tired hungry rich poor kind
      open close start stop begin finish wait help call show tell ask answer try need feel find keep leave let mean
      move play run walk jump swim fly drive ride sit stand sleep wake eat drink cook wash clean build fix break
      buy sell pay spend save lose win choose decide plan hope dream believe remember forget understand explain
      teach study learn grow live die love like hate laugh smile cry sing dance draw paint watch hear see
      phone computer internet music movie picture photo video song paper pen pencil class lesson test exam
      question answer example rule plan goal future past present minute second week weekend holiday trip journey
      number hundred thousand million first second third half double whole every each both either neither
      always ready together alone another enough quite rather almost already perhaps maybe probably really
    `),
  };

  // Өөрсдийн зохиосон эхүүд.
  const PASSAGES = {
    mn: [
      "Монгол орон бол өргөн уудам тал нутагтай, цэнхэр тэнгэртэй орон. Жилийн ихэнх өдөр нар гардаг тул мөнх хөх тэнгэрийн орон гэж нэрлэдэг. Нүүдэлчин ард түмэн олон мянган жилийн турш мал аж ахуй эрхэлж ирсэн.",
      "Хурдан бичих чадвар нь өдөр бүрийн дадлагаас бий болдог. Эхлээд хурдаас илүү зөв бичихэд анхаарах хэрэгтэй. Хуруугаа гарын үндсэн эгнээнд байрлуулж, гар руугаа харалгүй бичиж сурвал хурд аяндаа нэмэгдэнэ.",
      "Наадам бол монголчуудын хамгийн том баяр юм. Энэ үеэр бөх, морин уралдаан, сур харваа гэсэн эрийн гурван наадам болдог. Хүмүүс хот хөдөөгүй баярлаж, айраг ууж, хуушуур иднэ.",
      "Монгол гэр нь хөнгөн, эвхэгддэг учраас нүүдэлчдэд маш тохиромжтой. Гэрийг хэдхэн цагийн дотор барьж, буулгаж болно. Гэрийн голд зуух байрлах бөгөөд хаалга нь ихэвчлэн урд зүг рүү хардаг.",
      "Монголын өвөл урт бөгөөд хүйтэн байдаг. Харин зун богино ч дулаан, ногоон өнгөөр бүрхэгддэг. Хавар салхи ихтэй, намар сэрүүн, тэнгэр цэлмэг байдаг.",
      "Морь бол монгол хүний хамгийн үнэнч нөхөр. Эрт дээр үед хүмүүс морьтой холын замд явж, мал маллаж, захидал хүргэдэг байв. Өнөөдөр ч хөдөөгийн хүүхдүүд бага наснаасаа морь унаж сурдаг.",
      "Шинэ зүйл сурах нь хэзээ ч оройтдоггүй. Өдөр бүр бага багаар хичээвэл жилийн дараа том өөрчлөлтийг харна. Алдаа гаргахаас бүү ай, алдаа бол сурах замын нэг хэсэг.",
      "Өнөөдөр компьютер, утас бидний амьдралын салшгүй хэсэг болжээ. Ажил, сургууль, харилцаа бүгд дижитал болж байна. Тиймээс гарын бичилтийг хурдан, зөв эзэмших нь чухал ур чадвар юм.",
    ],
    en: [
      "The steppe stretches far beyond the horizon, and the sky above it seems endless. Nomadic families move with the seasons, following fresh grass and clean water for their animals.",
      "Typing quickly is a skill built through daily practice. Focus on accuracy first, and speed will follow. Keep your fingers on the home row and try not to look at the keyboard.",
      "Every journey begins with a single decision to start. Small steps taken each day can lead to remarkable progress over a year. Patience and consistency matter more than talent.",
      "A good habit is easy to build when it is small. Spend ten minutes a day practicing, and you will notice the difference within a few weeks.",
      "Computers have changed the way we work, learn, and communicate. Knowing how to type well saves time and helps you share your ideas clearly.",
      "In winter the wind is cold and the nights are long, but the stars shine brightly over the quiet land. In summer the hills turn green and the rivers run fast.",
      "Reading widely helps you write better. Each new book introduces words, ideas, and ways of thinking that you can use in your own work.",
      "Mistakes are not failures. They show you what to improve next. Slow down, breathe, and try again.",
    ],
  };

  const QUOTES = {
    mn: [
      "Ажил хийвэл ам тосдоно.",
      "Нүд айдас, гар зориг.",
      "Ганц мод гал болдоггүй, ганц хүн айл болдоггүй.",
      "Эхийн сэтгэл үрд, үрийн сэтгэл ууланд.",
      "Ус уувал эхийг нь, үг сонсвол эзнийг нь.",
      "Сурсан эрдэм биеийн чимэг, сувд эрдэнэ хүзүүний чимэг.",
      "Хийх дуртай хүнд ажил олдоно, идэх дуртай хүнд хоол олдоно.",
      "Ам алдвал барьж болдоггүй, агт алдвал барьж болдог.",
      "Мэдэхгүй бол асуу, төөрвөл буц.",
      "Хүний эрхээр жаргахаар өөрийн эрхээр зовсон нь дээр.",
      "Цаг цагаараа байдаггүй, цахилдаг ногоороо байдаггүй.",
      "Яарвал даарна.",
    ],
    en: [
      "Practice makes perfect.",
      "Slow and steady wins the race.",
      "Where there is a will, there is a way.",
      "Actions speak louder than words.",
      "The early bird catches the worm.",
      "Knowledge is power.",
      "A journey of a thousand miles begins with a single step.",
      "Do not count your chickens before they hatch.",
      "Better late than never.",
      "Rome was not built in a day.",
      "Two heads are better than one.",
      "The pen is mightier than the sword.",
      "Honesty is the best policy.",
      "Every cloud has a silver lining.",
    ],
  };

  return { WORDS, PASSAGES, QUOTES };
})();
