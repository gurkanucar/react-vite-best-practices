import type { Article } from '@/features/showcases/data/magazine'

/** Culture, travel and food. Written for the showcase; the authors are invented. */
export const magazineArticlesCulture: Article[] = [
  {
    slug: 'slow-train-to-kars',
    topic: 'travel',
    authorId: 'kaan-erdem',
    title: { en: 'The slow train to Kars', tr: 'Kars’a giden yavaş tren' },
    dek: {
      en: 'Roughly a day on the rails from Ankara to the eastern border, and why nobody on board is in a hurry.',
      tr: 'Ankara’dan doğu sınırına rayların üstünde yaklaşık bir gün ve trende neden kimsenin acelesi olmadığı.',
    },
    published: '2026-09-21',
    cover: 'stripes',
    views: 31200,
    featured: true,
    editorsPick: true,
    body: [
      {
        type: 'p',
        text: {
          en: 'The Eastern Express leaves Ankara in the evening and reaches Kars about a day later, after some 1,300 kilometres. You could fly in under two hours. The people who take the train are not trying to get there faster; they are trying to see what lies in between.',
          tr: 'Doğu Ekspresi akşam Ankara’dan kalkar ve yaklaşık 1.300 kilometre sonra, aşağı yukarı bir gün sonra Kars’a varır. Uçakla iki saatten kısa sürerdi. Treni seçenler oraya daha hızlı varmaya çalışmıyor; aradakini görmeye çalışıyor.',
        },
      },
      {
        type: 'h2',
        id: 'the-route',
        text: { en: 'The route', tr: 'Güzergâh' },
      },
      {
        type: 'p',
        text: {
          en: 'The line runs through Kayseri, Sivas, Erzincan and Erzurum. The first night passes over the steppe; morning finds the train in the valleys of the Euphrates, and by afternoon the land rises into the high plateau where snow can arrive early in autumn.',
          tr: 'Hat Kayseri, Sivas, Erzincan ve Erzurum’dan geçer. İlk gece bozkırın üstünden geçilir; sabah tren Fırat vadilerindedir, öğleden sonra ise arazi, sonbaharda karın erken gelebildiği yüksek yaylaya tırmanır.',
        },
      },
      {
        type: 'figure',
        art: 'rails',
        caption: {
          en: 'Ankara to Kars, drawn as a line of stops. Distances are approximate.',
          tr: 'Ankara’dan Kars’a, duraklardan oluşan bir çizgi olarak. Mesafeler yaklaşıktır.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Between Erzincan and Erzurum the line climbs through a narrow gorge, and for a while the river, the road and the tracks share the same thin strip of valley. This is the stretch most passengers wait for. People gather at the windows, phones up, and the carriage goes quiet in a way that has nothing to do with sleep.',
          tr: 'Erzincan ile Erzurum arasında hat dar bir boğazdan tırmanır ve bir süre nehir, yol ve raylar vadinin aynı ince şeridini paylaşır. Yolcuların çoğunun beklediği bölüm budur. İnsanlar telefonları ellerinde pencerelerde toplanır ve vagon, uykuyla hiç ilgisi olmayan bir biçimde sessizleşir.',
        },
      },
      {
        type: 'h2',
        id: 'on-board',
        text: { en: 'Life on board', tr: 'Trende hayat' },
      },
      {
        type: 'p',
        text: {
          en: 'Sleeper compartments turn into small living rooms. People bring tea glasses, fruit and string lights; they swap food with their neighbours and stand in the corridor for hours, watching the river bend beside the tracks. The dining car becomes a meeting place for strangers.',
          tr: 'Yataklı kompartımanlar küçük oturma odalarına dönüşür. İnsanlar çay bardakları, meyve ve ipe dizili ışıklar getirir; komşularıyla yiyecek değiş tokuş eder, koridorda saatlerce durup rayların yanında kıvrılan nehri izler. Yemekli vagon, yabancıların buluşma yerine döner.',
        },
      },
      {
        type: 'quote',
        text: {
          en: 'Nobody asked where I was going. Everybody asked where I had got on.',
          tr: 'Kimse nereye gittiğimi sormadı. Herkes nereden bindiğimi sordu.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Stations are short stops, sometimes only a few minutes. Locals step down to buy simit or cheese from the platform, and everyone keeps one eye on the conductor. Nobody wants to be the story told in the corridor that evening about the passenger left behind in Divriği.',
          tr: 'İstasyonlar kısa duraklardır, bazen yalnızca birkaç dakika. Yerel yolcular perondan simit ya da peynir almak için iner ve herkes bir gözünü kondüktörde tutar. Kimse o akşam koridorda anlatılan, Divriği’de kalan yolcunun hikâyesi olmak istemez.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Kars itself rewards a few days: the Russian-era stone buildings, the castle above the river, and, an hour away, the ruins of Ani on the border. Many travellers who come for the train stay for the town.',
          tr: 'Kars’ın kendisi de birkaç günü hak ediyor: Rus döneminden kalma taş binalar, nehrin üstündeki kale ve bir saat ötede, sınırda Ani harabeleri. Tren için gelen pek çok gezgin şehir için kalıyor.',
        },
      },
      {
        type: 'h3',
        id: 'tips',
        text: { en: 'Before you book', tr: 'Bilet almadan önce' },
      },
      {
        type: 'list',
        items: [
          {
            en: 'Sleeper tickets sell out quickly in winter; check the official railway site early.',
            tr: 'Kışın yataklı biletler hızla tükenir; resmî demiryolu sitesine erkenden bakın.',
          },
          {
            en: 'Timetables change by season, so confirm departure times close to your date.',
            tr: 'Sefer saatleri mevsime göre değişir; kalkış saatini tarihinize yakın doğrulayın.',
          },
          {
            en: 'Pack layers. The compartment is warm; the platform in Erzurum may not be.',
            tr: 'Kat kat giyinin. Kompartıman sıcaktır; Erzurum’daki peron öyle olmayabilir.',
          },
        ],
      },
      {
        type: 'p',
        text: {
          en: 'When the train finally pulls into Kars, it is a little sad to get off. That is how you know the journey was the point.',
          tr: 'Tren sonunda Kars’a girdiğinde inmek insanı biraz hüzünlendirir. Yolculuğun asıl mesele olduğunu böyle anlarsınız.',
        },
      },
    ],
  },
  {
    slug: 'a-weekend-in-mardin-stone',
    topic: 'travel',
    authorId: 'kaan-erdem',
    title: { en: 'A weekend in Mardin stone', tr: 'Mardin taşında bir hafta sonu' },
    dek: {
      en: 'A town built from its own hillside, looking out over the Mesopotamian plain.',
      tr: 'Kendi yamacından yapılmış, Mezopotamya ovasına bakan bir şehir.',
    },
    published: '2026-08-05',
    cover: 'blocks',
    views: 19700,
    body: [
      {
        type: 'p',
        text: {
          en: 'Old Mardin climbs the slope in terraces of honey-coloured limestone. The stone is soft when it is cut and hardens in the air, which is why carvers could give doorways and windows such fine detail. From almost every rooftop the plain stretches south to the horizon.',
          tr: 'Eski Mardin, bal rengi kireçtaşından teraslarla yamaca tırmanır. Taş kesildiğinde yumuşaktır, havayla temas ettikçe sertleşir; ustaların kapılara ve pencerelere bu kadar ince ayrıntı verebilmesinin nedeni budur. Neredeyse her damdan ova, güneyde ufka kadar uzanır.',
        },
      },
      {
        type: 'h2',
        id: 'morning',
        text: { en: 'Saturday morning', tr: 'Cumartesi sabahı' },
      },
      {
        type: 'p',
        text: {
          en: 'Start early, before the day warms the stone. Walk the main street and then leave it: the real town is in the narrow stepped lanes, the covered passages called abbara, and the courtyards you glimpse through half-open doors.',
          tr: 'Güneş taşı ısıtmadan erken başlayın. Ana caddede yürüyün, sonra ondan ayrılın: asıl şehir dar ve basamaklı sokaklarda, abbara denen üstü örtülü geçitlerde ve yarı açık kapılardan görünen avlulardadır.',
        },
      },
      {
        type: 'figure',
        art: 'arches',
        caption: {
          en: 'Arches and carved window frames, repeated street after street.',
          tr: 'Sokak sokak tekrarlanan kemerler ve oymalı pencere çerçeveleri.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Mardin has long been a meeting point of languages and faiths, and you can hear it: Turkish, Arabic, Kurdish and Syriac all have a place in the town’s story. Churches and mosques stand a few streets apart, and many families trace their roots through several of these threads at once.',
          tr: 'Mardin uzun zamandır dillerin ve inançların buluşma noktası ve bunu duyabilirsiniz: Türkçe, Arapça, Kürtçe ve Süryanice şehrin hikâyesinde yer alır. Kiliseler ve camiler birkaç sokak arayla durur ve pek çok aile köklerini aynı anda bu iplerin birkaçına dayandırır.',
        },
      },
      {
        type: 'h2',
        id: 'madrasas',
        text: { en: 'The madrasas', tr: 'Medreseler' },
      },
      {
        type: 'p',
        text: {
          en: 'The town’s medieval madrasas are its landmarks, with courtyards, domes and portals that reward a slow look. Opening hours change, and some buildings close for restoration, so check before you climb the hill.',
          tr: 'Şehrin simgeleri Orta Çağ’dan kalma medreseleridir; avluları, kubbeleri ve taç kapıları yavaş bir bakışı ödüllendirir. Ziyaret saatleri değişebilir, bazı yapılar restorasyon için kapanabilir; tepeye tırmanmadan önce kontrol edin.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Lunch is a good excuse to try the local kitchen. Look for dishes with dried fruit and meat together, and for small bakeries selling crisp, sesame-covered breads. Afterwards, the covered bazaar below the main street is full of spice sellers, coppersmiths and soap made from wild pistachio.',
          tr: 'Öğle yemeği yerel mutfağı denemek için iyi bir bahane. Kuru meyve ile etin birlikte pişirildiği yemeklere ve çıtır, susamlı ekmekler satan küçük fırınlara bakın. Sonrasında ana caddenin altındaki kapalı çarşı baharatçılar, bakırcılar ve bıttım sabunuyla doludur.',
        },
      },
      {
        type: 'h3',
        id: 'evening',
        text: { en: 'An evening on the roofs', tr: 'Damlarda bir akşam' },
      },
      {
        type: 'p',
        text: {
          en: 'As the sun goes down the stone turns from yellow to rose and the lights of the plain come on one by one. Find a terrace, order tea, and do nothing for an hour. It is the best thing to do in Mardin, and it costs almost nothing.',
          tr: 'Güneş batarken taş sarıdan pembeye döner ve ovanın ışıkları tek tek yanar. Bir teras bulun, çay söyleyin ve bir saat hiçbir şey yapmayın. Mardin’de yapılacak en güzel şey budur ve neredeyse hiçbir şeye mal olmaz.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'On Sunday, if you have a car, the monasteries and stone villages in the countryside make a quiet half day. Ask locally about roads and visiting hours; they change with the season and with services.',
          tr: 'Pazar günü arabanız varsa kırsaldaki manastırlar ve taş köyler sakin bir yarım gün sunar. Yollar ve ziyaret saatleri hakkında yerelde sorun; mevsime ve ayinlere göre değişirler.',
        },
      },
      {
        type: 'note',
        text: {
          en: 'Summer afternoons are very hot. Spring and autumn are the easiest seasons for walking.',
          tr: 'Yaz öğleden sonraları çok sıcaktır. Yürümek için en rahat mevsimler ilkbahar ve sonbahardır.',
        },
      },
    ],
  },
  {
    slug: 'the-second-life-of-cassettes',
    topic: 'culture',
    authorId: 'selin-varol',
    title: { en: 'The second life of cassettes', tr: 'Kasetlerin ikinci hayatı' },
    dek: {
      en: 'Hiss, a pencil for rewinding and a format that refuses to disappear.',
      tr: 'Cızırtı, geri sarmak için bir kalem ve kaybolmayı reddeden bir format.',
    },
    published: '2026-08-26',
    cover: 'rings',
    views: 14600,
    body: [
      {
        type: 'p',
        text: {
          en: 'The compact cassette was introduced in 1963 as a convenient format for dictation. It went on to carry music for decades, then seemed to vanish. Yet small labels still release albums on tape, and a new generation buys players for music they could stream for free.',
          tr: 'Kompakt kaset 1963’te dikte için pratik bir format olarak tanıtıldı. On yıllarca müzik taşıdı, sonra ortadan kalkmış gibi göründü. Yine de küçük plak şirketleri hâlâ kasete albüm basıyor ve yeni bir kuşak, ücretsiz dinleyebileceği müzik için kasetçalar alıyor.',
        },
      },
      {
        type: 'h2',
        id: 'why-now',
        text: { en: 'Why now', tr: 'Neden şimdi' },
      },
      {
        type: 'p',
        text: {
          en: 'A cassette is cheap to make in small runs, small to post and impossible to skip through quickly. That last part is the point for many listeners: an album on tape is heard in order, start to finish, the way it was sequenced.',
          tr: 'Kaset az sayıda üretmek için ucuzdur, postalaması kolaydır ve hızla atlanması imkânsızdır. Pek çok dinleyici için mesele tam da bu son kısım: kasetteki bir albüm, sıralandığı gibi baştan sona dinlenir.',
        },
      },
      {
        type: 'figure',
        art: 'tape',
        caption: {
          en: 'Two reels, one direction. The format itself asks you to listen.',
          tr: 'İki makara, tek yön. Format sizden dinlemenizi ister.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'The format has real limits. Tape wears with every play, high frequencies fade, and a player that eats a tape can ruin an afternoon. Enthusiasts accept all of this, and some even like it. The hiss is a reminder that the music is physically there, moving past a head at a little under five centimetres a second.',
          tr: 'Formatın gerçek sınırları var. Bant her çalışta aşınır, tizler solar ve bandı yiyen bir kasetçalar bir öğleden sonrayı mahvedebilir. Meraklılar bunların hepsini kabul ediyor, hatta bazıları seviyor. Cızırtı, müziğin fiziksel olarak orada olduğunu, saniyede beş santimetreden biraz az bir hızla bir kafanın önünden geçtiğini hatırlatır.',
        },
      },
      {
        type: 'h2',
        id: 'mixtape',
        text: { en: 'The mixtape as a letter', tr: 'Bir mektup olarak karışık kaset' },
      },
      {
        type: 'p',
        text: {
          en: 'A playlist takes a minute to share. A mixtape takes an evening to record, in real time, with your hand on the pause button. People who received one decades ago still remember the handwriting on the insert.',
          tr: 'Bir çalma listesini paylaşmak bir dakika sürer. Karışık bir kaset kaydetmek ise elinizi duraklatma tuşunda tutarak, gerçek zamanlı bir akşam sürer. On yıllar önce birinden kaset alanlar kapak kâğıdındaki el yazısını hâlâ hatırlar.',
        },
      },
      {
        type: 'quote',
        text: {
          en: 'You cannot shuffle a gift that somebody spent a whole evening putting in order.',
          tr: 'Birinin bütün bir akşamını sıraya koymaya harcadığı bir hediyeyi karıştırarak dinleyemezsiniz.',
        },
        cite: { en: 'A shop owner in Kadıköy', tr: 'Kadıköy’de bir dükkân sahibi' },
      },
      {
        type: 'h2',
        id: 'repair',
        text: { en: 'A small repair culture', tr: 'Küçük bir tamir kültürü' },
      },
      {
        type: 'p',
        text: {
          en: 'With few new decks being made, old ones are repaired rather than replaced. Belts are swapped, heads are cleaned with a cotton bud and alcohol, and online forums trade advice on which models are worth saving. It is a small economy of care around an object that was once thrown away without a thought.',
          tr: 'Yeni kasetçalar pek az üretildiği için eskileri değiştirilmek yerine tamir ediliyor. Kayışlar değiştiriliyor, kafalar kulak çubuğu ve alkolle temizleniyor, çevrimiçi forumlarda hangi modellerin kurtarılmaya değer olduğuna dair öneriler paylaşılıyor. Bir zamanlar hiç düşünmeden atılan bir nesnenin etrafında küçük bir özen ekonomisi bu.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'The cassette will not replace anything. It does not need to. It has become what vinyl became before it: a way of choosing to pay attention.',
          tr: 'Kaset hiçbir şeyin yerini almayacak. Buna gerek de yok. Kendisinden önce plağın olduğu şeye dönüştü: dikkat etmeyi seçmenin bir yolu.',
        },
      },
    ],
  },
  {
    slug: 'libraries-after-dark',
    topic: 'culture',
    authorId: 'selin-varol',
    title: { en: 'Libraries after dark', tr: 'Karanlık çöktükten sonra kütüphaneler' },
    dek: {
      en: 'Late opening hours are turning reading rooms into the quietest social spaces in the city.',
      tr: 'Geç saatlere kadar açık kalmak, okuma salonlarını şehrin en sessiz sosyal alanlarına dönüştürüyor.',
    },
    published: '2026-07-08',
    cover: 'grid',
    views: 10400,
    body: [
      {
        type: 'p',
        text: {
          en: 'At ten in the evening the reading room is full. Students with exams, a retired teacher with a crossword, two friends sharing headphones. Nobody is talking, and yet it feels like being among people.',
          tr: 'Akşam onda okuma salonu dolu. Sınavı olan öğrenciler, bulmaca çözen emekli bir öğretmen, kulaklığı paylaşan iki arkadaş. Kimse konuşmuyor ama insanların arasında olmak gibi hissettiriyor.',
        },
      },
      {
        type: 'h2',
        id: 'third-place',
        text: {
          en: 'A third place that asks for nothing',
          tr: 'Hiçbir şey istemeyen üçüncü bir yer',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Sociologists call the spaces between home and work "third places": cafés, barbershops, parks. Most of them expect you to buy something. A library is one of the few that lets you stay for hours without spending anything at all.',
          tr: 'Sosyologlar ev ile iş arasındaki alanlara "üçüncü yerler" der: kafeler, berberler, parklar. Çoğu sizden bir şey almanızı bekler. Kütüphane, hiç para harcamadan saatlerce kalabileceğiniz az sayıdaki yerden biridir.',
        },
      },
      {
        type: 'figure',
        art: 'shelves',
        caption: {
          en: 'Lamps on, shelves full, a seat by the window still free.',
          tr: 'Lambalar yanık, raflar dolu, cam kenarında hâlâ boş bir koltuk.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Libraries also hold things that are hard to find anywhere else: a warm room, reliable internet, a printer, and a librarian who can help with a form. For many people these matter as much as the books.',
          tr: 'Kütüphaneler başka yerde bulunması zor şeyleri de sunar: sıcak bir oda, güvenilir internet, bir yazıcı ve bir formu doldurmaya yardım edebilecek bir kütüphaneci. Pek çok insan için bunlar kitaplar kadar önemlidir.',
        },
      },
      {
        type: 'h2',
        id: 'what-changes',
        text: { en: 'What changes at night', tr: 'Gece ne değişiyor' },
      },
      {
        type: 'list',
        items: [
          {
            en: 'People who work during the day can finally come.',
            tr: 'Gündüz çalışanlar nihayet gelebiliyor.',
          },
          {
            en: 'Homes that are crowded or cold have an alternative.',
            tr: 'Kalabalık ya da soğuk evlerin bir alternatifi oluyor.',
          },
          {
            en: 'The mood shifts from errands to concentration.',
            tr: 'Hava, ayak işlerinden odaklanmaya dönüyor.',
          },
        ],
      },
      {
        type: 'p',
        text: {
          en: 'Staying open late costs money: staff, heating, security. The libraries that manage it often start with a few evenings a week around exam season and grow from there, following the demand they can see in the queue at the door.',
          tr: 'Geç saate kadar açık kalmanın bir maliyeti var: personel, ısınma, güvenlik. Bunu başaran kütüphaneler çoğu zaman sınav dönemlerinde haftada birkaç akşamla başlıyor ve kapıdaki kuyrukta gördükleri talebe göre büyüyor.',
        },
      },
      {
        type: 'h2',
        id: 'rules',
        text: { en: 'Unwritten rules', tr: 'Yazılı olmayan kurallar' },
      },
      {
        type: 'p',
        text: {
          en: 'Every reading room develops its own etiquette. Some tables are for silent work, others tolerate whispering. Regulars leave a jacket to hold a seat and return it for others at closing time. Nobody writes these rules down, and yet newcomers learn them within an evening.',
          tr: 'Her okuma salonu kendi görgü kurallarını geliştirir. Bazı masalar sessiz çalışma içindir, bazıları fısıltıya göz yumar. Müdavimler yer tutmak için bir ceket bırakır, kapanışta başkaları için boşaltır. Kimse bu kuralları yazmaz ama yeni gelenler onları bir akşamda öğrenir.',
        },
      },
      {
        type: 'quote',
        text: {
          en: 'I do not come for the books. I come because everyone here is trying.',
          tr: 'Kitaplar için gelmiyorum. Buradaki herkes çabaladığı için geliyorum.',
        },
      },
    ],
  },
  {
    slug: 'the-patience-of-sourdough',
    topic: 'food',
    authorId: 'ayla-demirci',
    title: { en: 'The patience of sourdough', tr: 'Ekşi mayanın sabrı' },
    dek: {
      en: 'Flour, water and time. The rest is done by creatures too small to see.',
      tr: 'Un, su ve zaman. Gerisini görülemeyecek kadar küçük canlılar yapar.',
    },
    published: '2026-09-02',
    cover: 'dots',
    views: 23900,
    editorsPick: true,
    body: [
      {
        type: 'p',
        text: {
          en: 'A sourdough starter is a jar of flour and water that has been left alone long enough to come alive. Wild yeasts and lactic acid bacteria from the flour, the air and your hands settle in and start to eat. Feed them regularly and they will raise your bread for years.',
          tr: 'Ekşi maya, canlanacak kadar kendi hâline bırakılmış bir kavanoz un ve sudur. Undan, havadan ve ellerinizden gelen yabani mayalar ve laktik asit bakterileri yerleşir ve beslenmeye başlar. Onları düzenli besleyin, yıllarca ekmeğinizi kabartsınlar.',
        },
      },
      {
        type: 'h2',
        id: 'who-does-what',
        text: { en: 'Who does what', tr: 'Kim ne yapıyor' },
      },
      {
        type: 'p',
        text: {
          en: 'The yeasts produce carbon dioxide, the gas that fills the dough with bubbles. The bacteria produce lactic and acetic acids, which give the bread its tang and help it keep longer. A slow, cool rise gives the acids more time, so the flavour gets deeper.',
          tr: 'Mayalar hamuru kabarcıklarla dolduran gaz olan karbondioksiti üretir. Bakteriler ise ekmeğe ekşiliğini veren ve daha uzun dayanmasına yardım eden laktik ve asetik asidi üretir. Yavaş ve serin bir mayalanma asitlere daha çok zaman tanır; tat derinleşir.',
        },
      },
      {
        type: 'figure',
        art: 'starter',
        caption: {
          en: 'Fed in the morning, doubled by the afternoon: a starter ready to use.',
          tr: 'Sabah beslenmiş, öğleden sonra iki katına çıkmış: kullanıma hazır bir maya.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Temperature is the dial you control most. Warm dough ferments fast and tends to taste milder; cool dough ferments slowly and grows more sour. That is why many bakers mix during the day and let the shaped loaf rest overnight in the fridge: the timing becomes convenient and the flavour improves at the same time.',
          tr: 'En çok kontrol edebildiğiniz ayar sıcaklıktır. Ilık hamur hızlı mayalanır ve daha yumuşak tatlanır; serin hamur yavaş mayalanır ve daha ekşi olur. Pek çok fırıncının gündüz yoğurup şekil verilmiş somunu gece buzdolabında dinlendirmesinin nedeni budur: zamanlama kolaylaşır, tat da aynı anda iyileşir.',
        },
      },
      {
        type: 'h2',
        id: 'a-schedule',
        text: { en: 'A weekend schedule', tr: 'Bir hafta sonu planı' },
      },
      {
        type: 'list',
        ordered: true,
        items: [
          { en: 'Friday night: feed the starter.', tr: 'Cuma gecesi: mayayı besleyin.' },
          {
            en: 'Saturday morning: mix the dough, then fold it every half hour for two hours.',
            tr: 'Cumartesi sabahı: hamuru karıştırın, sonra iki saat boyunca yarım saatte bir katlayın.',
          },
          {
            en: 'Saturday afternoon: shape it and leave it in the fridge overnight.',
            tr: 'Cumartesi öğleden sonra: şekil verin ve gece boyunca buzdolabında bekletin.',
          },
          {
            en: 'Sunday morning: bake in a very hot covered pot, then uncover to brown.',
            tr: 'Pazar sabahı: çok sıcak, kapaklı bir tencerede pişirin, sonra kapağı açıp kızartın.',
          },
        ],
      },
      {
        type: 'p',
        text: {
          en: 'Weigh everything. Cups and spoons vary too much for bread, and a kitchen scale turns guesswork into a recipe you can repeat and adjust one variable at a time.',
          tr: 'Her şeyi tartın. Bardak ve kaşık ölçüleri ekmek için fazla değişkendir; bir mutfak terazisi tahmini, tekrarlanabilen ve her seferinde tek bir değişkenle ayarlanabilen bir tarife dönüştürür.',
        },
      },
      {
        type: 'h3',
        id: 'when-it-fails',
        text: { en: 'When it does not rise', tr: 'Kabarmadığında' },
      },
      {
        type: 'p',
        text: {
          en: 'Usually the kitchen is cold or the starter was used before it peaked. Put the jar somewhere warmer, feed it twice a day for a few days, and use it when it has doubled and smells pleasantly sour rather than sharp.',
          tr: 'Genellikle mutfak soğuktur ya da maya zirvesine ulaşmadan kullanılmıştır. Kavanozu daha sıcak bir yere koyun, birkaç gün boyunca günde iki kez besleyin ve iki katına çıkıp keskin değil hoş bir ekşilikle koktuğunda kullanın.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'A starter that has been neglected in the fridge for weeks usually recovers. Pour off the grey liquid on top, feed it, and give it a few days. It is more forgiving than its reputation.',
          tr: 'Buzdolabında haftalarca ihmal edilmiş bir maya genellikle kendine gelir. Üstteki gri sıvıyı dökün, besleyin ve birkaç gün tanıyın. Ününden çok daha bağışlayıcıdır.',
        },
      },
      {
        type: 'quote',
        text: {
          en: 'You do not make sourdough. You make the conditions for it, and then you wait.',
          tr: 'Ekşi maya yapılmaz. Onun için koşulları hazırlarsınız, sonra beklersiniz.',
        },
      },
    ],
  },
  {
    slug: 'forty-years-of-a-cup-of-coffee',
    topic: 'food',
    authorId: 'ayla-demirci',
    title: {
      en: 'Forty years of a cup of coffee',
      tr: 'Bir fincan kahvenin kırk yılı',
    },
    dek: {
      en: 'Turkish coffee is a drink, a ritual and, since 2013, part of UNESCO’s intangible heritage list.',
      tr: 'Türk kahvesi bir içecek, bir ritüel ve 2013’ten beri UNESCO’nun somut olmayan miras listesinde.',
    },
    published: '2026-06-30',
    cover: 'sun',
    views: 17800,
    body: [
      {
        type: 'p',
        text: {
          en: 'A Turkish saying holds that a single cup of coffee is remembered for forty years. The drink arrived in Istanbul in the mid sixteenth century, and coffeehouses quickly became places for news, games and long conversations.',
          tr: 'Bir Türk atasözüne göre bir fincan kahvenin kırk yıl hatırı vardır. Kahve on altıncı yüzyılın ortalarında İstanbul’a ulaştı ve kahvehaneler kısa sürede haber, oyun ve uzun sohbet yerlerine dönüştü.',
        },
      },
      {
        type: 'h2',
        id: 'the-method',
        text: { en: 'The method', tr: 'Yöntem' },
      },
      {
        type: 'p',
        text: {
          en: 'The coffee is ground to a fine powder and brewed slowly in a small pot called a cezve, with cold water and sugar if wanted. It is never filtered. The grounds settle at the bottom of the cup and the foam on top is the sign of a well made cup.',
          tr: 'Kahve ince bir toz hâlinde öğütülür ve cezve denen küçük bir kapta, soğuk su ve istenirse şekerle yavaşça pişirilir. Asla süzülmez. Telvesi fincanın dibine çöker; üstteki köpük iyi pişmiş bir kahvenin işaretidir.',
        },
      },
      {
        type: 'figure',
        art: 'cezve',
        caption: {
          en: 'Low heat, no stirring once it warms, and the foam shared between the cups.',
          tr: 'Kısık ateş, ısındıktan sonra karıştırmak yok ve köpük fincanlar arasında paylaştırılır.',
        },
      },
      {
        type: 'list',
        ordered: true,
        items: [
          {
            en: 'One heaped teaspoon of coffee and one cup of cold water per person.',
            tr: 'Kişi başı bir tepeleme tatlı kaşığı kahve ve bir fincan soğuk su.',
          },
          {
            en: 'Stir once, then leave it on a low flame.',
            tr: 'Bir kez karıştırın, sonra kısık ateşe bırakın.',
          },
          {
            en: 'When the foam rises, spoon some into each cup, then pour the rest.',
            tr: 'Köpük yükselince her fincana biraz paylaştırın, sonra kalanını dökün.',
          },
        ],
      },
      {
        type: 'p',
        text: {
          en: 'Sugar is decided before brewing, not after, because the coffee is never stirred in the cup. Hosts ask how each guest takes it: plain, with a little sugar, medium or sweet. Getting it right for every person at the table is a small act of attention that guests notice.',
          tr: 'Şeker sonra değil pişirmeden önce belirlenir, çünkü kahve fincanda karıştırılmaz. Ev sahibi her misafire nasıl içtiğini sorar: sade, az şekerli, orta ya da şekerli. Masadaki herkes için doğru yapmak, misafirlerin fark ettiği küçük bir özen biçimidir.',
        },
      },
      {
        type: 'h2',
        id: 'ritual',
        text: { en: 'More than a drink', tr: 'Bir içecekten fazlası' },
      },
      {
        type: 'p',
        text: {
          en: 'It is served with a glass of water, often with something sweet, and it sets the pace of a visit. In traditional marriage requests the prospective bride prepares coffee for the guests, and a pinch of salt in the groom’s cup has become a well known joke.',
          tr: 'Yanında bir bardak suyla, çoğu zaman tatlı bir şeyle ikram edilir ve bir ziyaretin temposunu belirler. Geleneksel kız isteme ziyaretlerinde kahveyi gelin adayı yapar; damadın fincanına atılan bir tutam tuz da bilinen bir şakaya dönüşmüştür.',
        },
      },
      {
        type: 'h2',
        id: 'after',
        text: { en: 'After the last sip', tr: 'Son yudumdan sonra' },
      },
      {
        type: 'p',
        text: {
          en: 'When the cup is empty, some turn it upside down on the saucer and wait for it to cool, so that a friend can read shapes in the grounds. Few take the fortune seriously. The reading is another reason to stay at the table a little longer, which was always the point.',
          tr: 'Fincan boşaldığında bazıları onu tabağın üstüne ters kapatıp soğumasını bekler; bir arkadaş telvedeki şekillere bakıp fal okusun diye. Pek az kişi falı ciddiye alır. Fal, masada biraz daha kalmak için bir başka bahanedir; zaten mesele hep buydu.',
        },
      },
      {
        type: 'quote',
        text: {
          en: 'The coffee is only the excuse. The conversation is the reason.',
          tr: 'Kahve sadece bahane. Asıl sebep sohbet.',
        },
      },
    ],
  },
]
