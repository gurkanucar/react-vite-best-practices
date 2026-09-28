import type { Article } from '@/features/showcases/data/magazine'

/** Technology, design and science. Written for the showcase; the authors are invented. */
export const magazineArticlesTech: Article[] = [
  {
    slug: 'the-quiet-cost-of-a-spinner',
    topic: 'technology',
    authorId: 'deniz-aksoy',
    title: {
      en: 'The quiet cost of a loading spinner',
      tr: 'Yükleme simgesinin sessiz bedeli',
    },
    dek: {
      en: 'Waiting is not only about milliseconds. It is about what the screen tells you while you wait.',
      tr: 'Beklemek yalnızca milisaniyelerle ilgili değil. Mesele, siz beklerken ekranın size ne söylediği.',
    },
    published: '2026-09-24',
    cover: 'rings',
    views: 18400,
    editorsPick: true,
    body: [
      {
        type: 'p',
        text: {
          en: 'Every app has a moment when it has nothing to show. The network is slow, the data is large, or the server is thinking. What we put on the screen in that moment decides whether the wait feels like a pause or like a failure.',
          tr: 'Her uygulamanın gösterecek hiçbir şeyi olmadığı bir anı vardır. Ağ yavaştır, veri büyüktür ya da sunucu düşünmektedir. O anda ekrana koyduğumuz şey, beklemenin bir mola gibi mi yoksa bir arıza gibi mi hissettireceğine karar verir.',
        },
      },
      {
        type: 'h2',
        id: 'three-limits',
        text: { en: 'Three limits worth remembering', tr: 'Akılda tutulacak üç sınır' },
      },
      {
        type: 'p',
        text: {
          en: 'Usability researchers have described the same three thresholds for decades. Around a tenth of a second feels instant. Around one second keeps your train of thought, even if you notice the delay. Beyond ten seconds, attention drifts and people start doing something else.',
          tr: 'Kullanılabilirlik araştırmacıları on yıllardır aynı üç eşiği tarif ediyor. Saniyenin onda biri civarı anlık hissettirir. Bir saniye civarı, gecikmeyi fark etseniz bile düşünce akışınızı korur. On saniyenin ötesinde dikkat dağılır ve insanlar başka bir şeyle uğraşmaya başlar.',
        },
      },
      {
        type: 'list',
        items: [
          {
            en: 'Under 100 ms: show the result, no indicator needed.',
            tr: '100 ms altı: sonucu gösterin, göstergeye gerek yok.',
          },
          {
            en: 'Up to about 1 s: a subtle change, like a pressed button, is enough.',
            tr: 'Yaklaşık 1 sn’ye kadar: basılmış bir düğme gibi küçük bir değişiklik yeterli.',
          },
          {
            en: 'Longer: show structure or progress, and let people keep working.',
            tr: 'Daha uzun: yapıyı ya da ilerlemeyi gösterin ve insanların çalışmaya devam etmesine izin verin.',
          },
        ],
      },
      {
        type: 'p',
        text: {
          en: 'Those limits are about perception, not engineering. A request that takes 400 milliseconds feels fine if the button reacts at once, and awful if nothing moves until the answer arrives. The first job of any interface is to acknowledge the tap, even when it cannot finish the work yet.',
          tr: 'Bu sınırlar mühendislikle değil algıyla ilgili. 400 milisaniye süren bir istek, düğme hemen tepki verirse sorun olmaz; yanıt gelene kadar hiçbir şey kıpırdamazsa berbat hissettirir. Her arayüzün ilk işi, işi henüz bitiremese bile dokunuşu fark ettiğini göstermektir.',
        },
      },
      {
        type: 'h2',
        id: 'skeletons',
        text: { en: 'Skeletons instead of spinners', tr: 'Döner simge yerine iskelet' },
      },
      {
        type: 'p',
        text: {
          en: 'A spinner says "something is happening" and nothing else. A skeleton, the grey outline of the page that is about to appear, says what is coming and where. The eye settles on the layout before the words arrive, so the page does not jump when they do.',
          tr: 'Dönen bir simge yalnızca "bir şeyler oluyor" der. İskelet ise, yani birazdan gelecek sayfanın gri taslağı, neyin nereye geleceğini söyler. Göz, kelimeler gelmeden düzene alışır; böylece geldiklerinde sayfa zıplamaz.',
        },
      },
      {
        type: 'figure',
        art: 'skeleton',
        caption: {
          en: 'The same card while loading and once loaded. The outline keeps its size, so nothing moves.',
          tr: 'Aynı kart yüklenirken ve yüklendikten sonra. Taslak boyutunu koruduğu için hiçbir şey kaymaz.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'The trick is to make the skeleton honest. If the real card has two lines of text, draw two lines, not five. A skeleton that promises more than it delivers is just a slower spinner.',
          tr: 'Püf noktası iskeleti dürüst tutmak. Gerçek kartta iki satır metin varsa beş değil iki satır çizin. Vaat ettiğinden fazlasını gösteren bir iskelet, yalnızca daha yavaş bir döner simgedir.',
        },
      },
      {
        type: 'code',
        language: 'css',
        code: `.skeleton {
  background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
}`,
        caption: {
          en: 'A shimmer that stops for people who asked for less motion.',
          tr: 'Daha az hareket isteyenler için duran bir parıltı.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Skeletons have a cost too. Shown for a request that finishes in 80 milliseconds, they flash on and off and make a fast page feel nervous. A common fix is to wait around 300 milliseconds before showing any loading state at all, and, once it appears, to keep it for a moment so it does not flicker.',
          tr: 'İskeletlerin de bir bedeli var. 80 milisaniyede biten bir istek için gösterildiklerinde yanıp söner ve hızlı bir sayfayı tedirgin gösterirler. Yaygın bir çözüm, herhangi bir yükleme durumu göstermeden önce 300 milisaniye civarında beklemek ve göründükten sonra titremesin diye bir süre ekranda tutmaktır.',
        },
      },
      {
        type: 'h2',
        id: 'optimistic',
        text: { en: 'Answering before the server does', tr: 'Sunucudan önce yanıt vermek' },
      },
      {
        type: 'p',
        text: {
          en: 'The fastest wait is the one you skip. When you like a post or tick a task, the app can show the result immediately and confirm it in the background. If the request fails, it quietly rolls back and says so. Most of the time it does not fail, and the interface simply feels quick.',
          tr: 'En hızlı bekleme, hiç yaşanmayanıdır. Bir gönderiyi beğendiğinizde ya da bir görevi işaretlediğinizde uygulama sonucu hemen gösterip arka planda onaylayabilir. İstek başarısız olursa sessizce geri alır ve bunu söyler. Çoğu zaman başarısız olmaz ve arayüz yalnızca hızlı hissettirir.',
        },
      },
      {
        type: 'quote',
        text: {
          en: 'People forgive a slow app that keeps them informed far more easily than a fast one that goes silent.',
          tr: 'İnsanlar, kendilerini bilgilendiren yavaş bir uygulamayı, sessizleşen hızlı bir uygulamadan çok daha kolay affeder.',
        },
      },
      {
        type: 'h3',
        id: 'measure',
        text: { en: 'Measure what people feel', tr: 'İnsanların hissettiğini ölçün' },
      },
      {
        type: 'p',
        text: {
          en: 'Server timings tell you how long the work took. They do not tell you how long someone stared at an empty screen. Record when the first useful content appears and when the page responds to input, on real devices and slow networks, and you will find the waits worth designing for.',
          tr: 'Sunucu süreleri işin ne kadar sürdüğünü söyler. Birinin boş bir ekrana ne kadar baktığını söylemez. İlk işe yarar içeriğin ne zaman göründüğünü ve sayfanın girdiye ne zaman yanıt verdiğini gerçek cihazlarda ve yavaş ağlarda kaydedin; tasarlamaya değer beklemeleri böyle bulursunuz.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'None of this replaces real speed. But the time you cannot remove, you can at least make readable.',
          tr: 'Bunların hiçbiri gerçek hızın yerini tutmaz. Ama ortadan kaldıramadığınız süreyi en azından okunur kılabilirsiniz.',
        },
      },
    ],
  },
  {
    slug: 'apps-that-expect-to-be-offline',
    topic: 'technology',
    authorId: 'deniz-aksoy',
    title: {
      en: 'Writing apps that expect to be offline',
      tr: 'Çevrimdışı olmayı bekleyen uygulamalar yazmak',
    },
    dek: {
      en: 'Treating the network as a bonus rather than a requirement changes almost every decision you make.',
      tr: 'Ağı bir zorunluluk değil bir ikram gibi görmek, verdiğiniz neredeyse her kararı değiştirir.',
    },
    published: '2026-08-12',
    cover: 'waves',
    views: 12100,
    body: [
      {
        type: 'p',
        text: {
          en: 'Most web apps are built as if the connection were a law of nature. Open a tunnel, board a ferry or sit in a basement café and the illusion breaks: buttons spin, forms lose what you typed, and the app forgets that it knew anything at all.',
          tr: 'Çoğu web uygulaması, bağlantı bir doğa yasasıymış gibi yazılır. Bir tünele girin, vapura binin ya da bodrum katındaki bir kafeye oturun, yanılsama bozulur: düğmeler döner, formlar yazdıklarınızı kaybeder ve uygulama bir şey bildiğini tamamen unutur.',
        },
      },
      {
        type: 'h2',
        id: 'local-first',
        text: { en: 'The local copy is the real one', tr: 'Asıl kopya yereldeki' },
      },
      {
        type: 'p',
        text: {
          en: 'An offline-first app writes to a local store first and syncs later. Reading and editing never wait for a server. The network becomes a background job that moves changes back and forth whenever it can.',
          tr: 'Çevrimdışı öncelikli bir uygulama önce yerel bir depoya yazar, sonra eşitler. Okumak ve düzenlemek hiçbir zaman sunucuyu beklemez. Ağ, fırsat buldukça değişiklikleri iki yöne taşıyan bir arka plan işine dönüşür.',
        },
      },
      {
        type: 'figure',
        art: 'sync',
        caption: {
          en: 'Edits land locally at once and travel to the server in a queue.',
          tr: 'Düzenlemeler hemen yerele yazılır ve bir kuyrukla sunucuya gider.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'This sounds like a lot of machinery, and for a to-do list it can be. But browsers now ship the pieces: IndexedDB stores structured data on the device, service workers can answer requests without a network, and the storage manager can ask the browser not to clear your data when space runs low.',
          tr: 'Bu kulağa çok fazla düzenek gibi gelebilir ve bir yapılacaklar listesi için öyle de olabilir. Ama tarayıcılar artık parçaları hazır getiriyor: IndexedDB yapılandırılmış veriyi cihazda saklar, service worker’lar ağ olmadan isteklere yanıt verebilir ve depolama yöneticisi, yer azaldığında tarayıcıdan verinizi silmemesini isteyebilir.',
        },
      },
      {
        type: 'h2',
        id: 'queue',
        text: { en: 'A queue of intentions', tr: 'Niyetlerden oluşan bir kuyruk' },
      },
      {
        type: 'p',
        text: {
          en: 'Instead of sending requests directly, the app records what the user meant to do. Each entry is small and can be retried safely. When the connection returns, the queue drains in order.',
          tr: 'Uygulama istekleri doğrudan göndermek yerine kullanıcının ne yapmak istediğini kaydeder. Her kayıt küçüktür ve güvenle tekrar denenebilir. Bağlantı geri geldiğinde kuyruk sırasıyla boşalır.',
        },
      },
      {
        type: 'code',
        language: 'ts',
        code: `type Change = { id: string; op: 'rename'; noteId: string; title: string }

async function flush(queue: Change[]) {
  for (const change of queue) {
    // The server ignores an id it has already applied.
    await api.apply(change)
    queue.shift()
  }
}`,
        caption: {
          en: 'Every change carries an id, so sending it twice does no harm.',
          tr: 'Her değişiklik bir kimlik taşır; iki kez gönderilmesi zarar vermez.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Order matters more than speed. If someone renames a note and then deletes it, those two changes must reach the server in that sequence. A single queue per device, drained one entry at a time, is slower than firing requests in parallel, but it never surprises anyone.',
          tr: 'Sıra, hızdan daha önemli. Biri bir notun adını değiştirip sonra onu silerse, bu iki değişiklik sunucuya bu sırayla ulaşmalı. Cihaz başına tek bir kuyruk ve her seferinde bir kaydın gönderilmesi, istekleri paralel atmaktan yavaştır ama kimseyi şaşırtmaz.',
        },
      },
      {
        type: 'h3',
        id: 'conflicts',
        text: { en: 'When two edits collide', tr: 'İki düzenleme çakıştığında' },
      },
      {
        type: 'p',
        text: {
          en: 'Conflicts are rarer than people fear, but they happen. "Last write wins" is simple and often fine for a title. For a shared list, merge the operations instead of the results: two people adding items should end up with both items.',
          tr: 'Çakışmalar sanıldığından daha seyrek ama oluyor. "Son yazan kazanır" basittir ve bir başlık için çoğu zaman yeterlidir. Paylaşılan bir liste içinse sonuçları değil işlemleri birleştirin: iki kişi öğe eklediyse ikisinin öğesi de kalmalı.',
        },
      },
      {
        type: 'note',
        text: {
          en: 'Tell people what state they are in. A small "saved on this device" label is more reassuring than any spinner.',
          tr: 'İnsanlara hangi durumda olduklarını söyleyin. Küçük bir "bu cihaza kaydedildi" etiketi her döner simgeden daha güven vericidir.',
        },
      },
      {
        type: 'h2',
        id: 'start-small',
        text: { en: 'Where to start', tr: 'Nereden başlamalı' },
      },
      {
        type: 'p',
        text: {
          en: 'You do not have to rebuild an app to benefit. Start by keeping the last loaded data on the device and showing it immediately on the next visit, with a small note that it may be out of date. Then save drafts locally. Each step makes the app calmer, even if full offline editing never arrives.',
          tr: 'Fayda görmek için uygulamayı baştan yazmanız gerekmiyor. Son yüklenen veriyi cihazda tutup bir sonraki ziyarette, güncel olmayabileceğine dair küçük bir notla hemen göstererek başlayın. Sonra taslakları yerelde kaydedin. Tam çevrimdışı düzenleme hiç gelmese bile her adım uygulamayı daha sakin kılar.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'The surprise, for most teams, is that the app becomes faster online too. When nothing waits for the network, everything feels immediate.',
          tr: 'Çoğu ekip için sürpriz, uygulamanın çevrimiçiyken de hızlanması. Hiçbir şey ağı beklemediğinde her şey anlık hissettirir.',
        },
      },
    ],
  },
  {
    slug: 'keyboard-shortcuts-are-a-language',
    topic: 'technology',
    authorId: 'deniz-aksoy',
    title: {
      en: 'Keyboard shortcuts are a language',
      tr: 'Klavye kısayolları bir dildir',
    },
    dek: {
      en: 'Good shortcuts have grammar: verbs, objects and a few rules you only need to learn once.',
      tr: 'İyi kısayolların bir dilbilgisi vardır: fiiller, nesneler ve bir kez öğrenmeniz yeten birkaç kural.',
    },
    published: '2026-06-18',
    cover: 'grid',
    views: 7600,
    body: [
      {
        type: 'p',
        text: {
          en: 'Watch someone fluent in a text editor and it looks like magic. It is closer to speaking. They are not remembering hundreds of combinations; they are composing a few words into sentences.',
          tr: 'Bir metin düzenleyicisini akıcı kullanan birini izlediğinizde sihir gibi görünür. Aslında konuşmaya daha yakındır. Yüzlerce kombinasyonu ezberlemiyorlar; birkaç kelimeyi cümlelere dönüştürüyorlar.',
        },
      },
      {
        type: 'h2',
        id: 'grammar',
        text: { en: 'Verbs and objects', tr: 'Fiiller ve nesneler' },
      },
      {
        type: 'p',
        text: {
          en: 'In the old editor vi, "d" means delete and "w" means word, so "dw" deletes a word. Learn "c" for change and you already know "cw". Each new key multiplies what you can say instead of adding one more thing to memorise.',
          tr: 'Eski düzenleyici vi’de "d" silmek, "w" kelime demektir; yani "dw" bir kelimeyi siler. Değiştirmek için "c"yi öğrendiğinizde "cw"yi de zaten bilirsiniz. Her yeni tuş ezberlenecek bir şey daha eklemek yerine söyleyebileceklerinizi katlar.',
        },
      },
      {
        type: 'figure',
        art: 'keys',
        caption: {
          en: 'A verb and an object make a command. Three verbs and three objects make nine.',
          tr: 'Bir fiil ve bir nesne bir komut oluşturur. Üç fiil ve üç nesne dokuz eder.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'The same idea appears far from programmers’ editors. Many email apps use single letters for the most common actions: one key to archive, one to reply, one to move to the next message. People who learn five of them rarely go back, because their hands no longer have to leave the keyboard to finish a thought.',
          tr: 'Aynı fikir, programcıların düzenleyicilerinden çok uzakta da karşımıza çıkar. Pek çok e-posta uygulaması en sık yapılan işler için tek harf kullanır: arşivlemek için bir tuş, yanıtlamak için bir tuş, sonraki iletiye geçmek için bir tuş. Beşini öğrenenler nadiren geri döner, çünkü bir düşünceyi bitirmek için ellerini klavyeden kaldırmaları gerekmez.',
        },
      },
      {
        type: 'h2',
        id: 'rules',
        text: { en: 'Rules for designing your own', tr: 'Kendi kısayollarınız için kurallar' },
      },
      {
        type: 'list',
        ordered: true,
        items: [
          {
            en: 'Show the shortcut next to the action, where people already look.',
            tr: 'Kısayolu, insanların zaten baktığı yere, eylemin yanına yazın.',
          },
          {
            en: 'Keep one key per idea across the whole app: if "e" edits here, it edits everywhere.',
            tr: 'Bütün uygulamada her fikre tek tuş: "e" burada düzenliyorsa her yerde düzenlesin.',
          },
          {
            en: 'Never steal the browser’s own shortcuts, and never fire them while someone is typing.',
            tr: 'Tarayıcının kendi kısayollarını asla çalmayın ve biri yazarken asla tetiklemeyin.',
          },
          {
            en: 'Offer a list behind "?" so the language can be learned at the reader’s pace.',
            tr: 'Dilin okurun hızında öğrenilebilmesi için "?" arkasında bir liste sunun.',
          },
        ],
      },
      {
        type: 'code',
        language: 'ts',
        code: `window.addEventListener('keydown', (event) => {
  const typing = (event.target as HTMLElement).closest('input, textarea, [contenteditable]')
  if (typing || event.metaKey || event.ctrlKey) return
  if (event.key === 'j') focusNext()
  if (event.key === 'k') focusPrevious()
})`,
      },
      {
        type: 'h2',
        id: 'palette',
        text: { en: 'The command palette', tr: 'Komut paleti' },
      },
      {
        type: 'p',
        text: {
          en: 'A command palette, a search box for actions usually opened with a shortcut, is the bridge between the two worlds. Newcomers type what they want in plain words; the palette shows the action and its shortcut next to it. Every search is a small lesson, and after a few weeks the shortcut replaces the search.',
          tr: 'Genellikle bir kısayolla açılan, eylemler için bir arama kutusu olan komut paleti, iki dünya arasındaki köprüdür. Yeni başlayanlar ne istediklerini düz kelimelerle yazar; palet eylemi ve yanında kısayolunu gösterir. Her arama küçük bir derstir ve birkaç hafta sonra kısayol aramanın yerini alır.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Shortcuts are an invitation, not a requirement. The mouse path must still work, and the shortcut should be the quicker way to do the same thing, never the only way.',
          tr: 'Kısayollar bir davettir, zorunluluk değil. Fareyle yapılan yol yine çalışmalı; kısayol aynı işi yapmanın daha hızlı yolu olmalı, tek yolu değil.',
        },
      },
    ],
  },
  {
    slug: 'a-grid-is-a-promise',
    topic: 'design',
    authorId: 'mira-coskun',
    title: { en: 'A grid is a promise', tr: 'Grid bir sözdür' },
    dek: {
      en: 'Columns are not decoration. They tell the reader where the next thing will be.',
      tr: 'Sütunlar süs değildir. Okura bir sonraki şeyin nerede olacağını söyler.',
    },
    published: '2026-09-17',
    cover: 'blocks',
    views: 15300,
    editorsPick: true,
    body: [
      {
        type: 'p',
        text: {
          en: 'Open a newspaper and your eyes know where to go before you read a word. That is the grid at work: a quiet agreement between the designer and the reader about where things begin and end.',
          tr: 'Bir gazete açın; tek kelime okumadan gözünüz nereye gideceğini bilir. Bu, işbaşındaki grid’dir: tasarımcı ile okur arasında, şeylerin nerede başlayıp nerede bittiğine dair sessiz bir anlaşma.',
        },
      },
      {
        type: 'h2',
        id: 'twelve',
        text: { en: 'Why twelve columns', tr: 'Neden on iki sütun' },
      },
      {
        type: 'p',
        text: {
          en: 'Twelve divides into halves, thirds, quarters and sixths. That flexibility is why so many layout systems choose it. But the number matters less than the habit: every edge on the page should land on a line you could draw.',
          tr: 'On iki; yarıma, üçe, dörde ve altıya bölünür. Pek çok düzen sisteminin onu seçmesinin nedeni bu esneklik. Ama sayı alışkanlık kadar önemli değil: sayfadaki her kenar, çizebileceğiniz bir çizgiye oturmalı.',
        },
      },
      {
        type: 'figure',
        art: 'grid',
        caption: {
          en: 'One grid, three layouts. The content changes; the lines stay.',
          tr: 'Tek grid, üç düzen. İçerik değişir, çizgiler kalır.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'On a screen the grid also has to bend. A layout that shows three columns on a laptop may show one on a phone. The lines move, but the logic stays: the same gutters, the same margins, the same rule that things line up with something. That consistency is what makes a responsive site feel like one site rather than three.',
          tr: 'Ekranda grid’in esnemesi de gerekir. Dizüstünde üç sütun gösteren bir düzen telefonda tek sütun gösterebilir. Çizgiler yer değiştirir ama mantık kalır: aynı ara boşluklar, aynı kenar payları, her şeyin bir şeyle hizalanması kuralı. Duyarlı bir sitenin üç site değil tek bir site gibi hissettirmesini sağlayan bu tutarlılıktır.',
        },
      },
      {
        type: 'h2',
        id: 'spacing',
        text: { en: 'Spacing is part of the grid', tr: 'Boşluk da grid’in parçası' },
      },
      {
        type: 'p',
        text: {
          en: 'Vertical rhythm is the grid people forget. Pick a base unit, often four or eight pixels, and let every margin be a multiple of it. Related things sit closer; separate things sit further apart. The reader never measures, but they feel it.',
          tr: 'Dikey ritim, insanların unuttuğu grid’dir. Çoğu zaman dört ya da sekiz piksel olan bir temel birim seçin ve her boşluğu onun katı yapın. Birbiriyle ilgili şeyler yakın, ayrı şeyler uzak durur. Okur ölçmez ama hisseder.',
        },
      },
      {
        type: 'code',
        language: 'css',
        code: `:root { --space: 8px; }

.card   { padding: calc(var(--space) * 3); }
.stack > * + * { margin-top: calc(var(--space) * 2); }`,
      },
      {
        type: 'p',
        text: {
          en: 'Type belongs to the rhythm as well. If body text sits on a 24 pixel line height, headings and images that are multiples of that height keep the lines of neighbouring columns aligned. Few readers could name the effect, but most would notice if it were gone.',
          tr: 'Tipografi de ritmin bir parçasıdır. Gövde metni 24 piksellik satır yüksekliğine oturuyorsa, bu yüksekliğin katı olan başlıklar ve görseller komşu sütunların satırlarını hizalı tutar. Pek az okur bu etkinin adını koyabilir ama ortadan kalksa çoğu fark eder.',
        },
      },
      {
        type: 'h3',
        id: 'breaking',
        text: { en: 'Breaking it on purpose', tr: 'Bilerek bozmak' },
      },
      {
        type: 'p',
        text: {
          en: 'A photograph that bleeds past the column, a pull quote that pushes into the margin: these only work because everything else obeys. Break the grid once and it is emphasis. Break it everywhere and there is nothing left to break.',
          tr: 'Sütunun dışına taşan bir fotoğraf, kenar boşluğuna uzanan bir alıntı: bunlar yalnızca geri kalan her şey kurala uyduğu için işe yarar. Grid’i bir kez bozarsanız vurgu olur. Her yerde bozarsanız bozacak bir şey kalmaz.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'When a layout feels off and nobody can say why, check the edges first. More often than not, something is two pixels away from the line it meant to sit on.',
          tr: 'Bir düzen tuhaf hissettiriyor ve kimse nedenini söyleyemiyorsa önce kenarlara bakın. Çoğu zaman bir şey, oturması gereken çizgiden iki piksel uzaktadır.',
        },
      },
      {
        type: 'quote',
        text: {
          en: 'The grid is not a cage. It is the floor you stand on when you decide to jump.',
          tr: 'Grid bir kafes değil. Zıplamaya karar verdiğinizde üzerinde durduğunuz zemin.',
        },
        cite: {
          en: 'A note pinned above the author’s desk',
          tr: 'Yazarın masasının üstüne iğnelenmiş bir not',
        },
      },
    ],
  },
  {
    slug: 'colour-that-survives-dark-mode',
    topic: 'design',
    authorId: 'mira-coskun',
    title: {
      en: 'Colour that survives dark mode',
      tr: 'Koyu temadan sağ çıkan renkler',
    },
    dek: {
      en: 'Inverting a palette is not a dark theme. Here is what to change, and what to leave alone.',
      tr: 'Bir paleti tersine çevirmek koyu tema değildir. Neyi değiştirmeli, neye dokunmamalı.',
    },
    published: '2026-07-29',
    cover: 'sun',
    views: 21800,
    editorsPick: true,
    body: [
      {
        type: 'p',
        text: {
          en: 'The first dark theme most teams ship is a light theme with the colours flipped. White becomes black, black becomes white, and the brand blue suddenly glows like a warning light. It works, technically. It is tiring to read.',
          tr: 'Ekiplerin yayımladığı ilk koyu tema genellikle renkleri ters çevrilmiş bir açık temadır. Beyaz siyah, siyah beyaz olur ve marka mavisi birden bir uyarı lambası gibi parlar. Teknik olarak çalışır. Okuması yorucudur.',
        },
      },
      {
        type: 'h2',
        id: 'not-black',
        text: { en: 'Not quite black, not quite white', tr: 'Tam siyah değil, tam beyaz değil' },
      },
      {
        type: 'p',
        text: {
          en: 'Pure white text on pure black has so much contrast that letters seem to vibrate. A very dark grey background and an off-white text colour are easier on the eyes and leave room for surfaces: raised cards can be a little lighter than the page, which is how depth reads in the dark.',
          tr: 'Saf siyah üzerinde saf beyaz metin o kadar yüksek kontrast yaratır ki harfler titreşiyormuş gibi görünür. Çok koyu bir gri arka plan ve kırık beyaz metin gözü daha az yorar, yüzeylere de yer bırakır: yükseltilmiş kartlar sayfadan biraz daha açık olabilir; karanlıkta derinlik böyle okunur.',
        },
      },
      {
        type: 'figure',
        art: 'contrast',
        caption: {
          en: 'Left, a flipped palette. Right, adjusted tones: softer text, lighter surfaces, a calmer accent.',
          tr: 'Solda ters çevrilmiş palet. Sağda ayarlanmış tonlar: yumuşak metin, açık yüzeyler, sakin bir vurgu rengi.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Shadows barely work on a dark background, so elevation needs another signal. The usual answer is to make each raised layer slightly lighter: the page darkest, a card a little lighter, a menu on top of the card lighter still. The eye reads the lighter surface as closer, just as it does with a lamp.',
          tr: 'Gölgeler koyu bir arka planda neredeyse işe yaramaz; yükseklik için başka bir işaret gerekir. Olağan çözüm, her yükseltilmiş katmanı biraz daha açık yapmaktır: sayfa en koyu, kart biraz daha açık, kartın üstündeki menü daha da açık. Göz, tıpkı bir lambada olduğu gibi, daha açık yüzeyi daha yakın okur.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Saturated colours need the most care. The bright brand blue that looks crisp on white can glow and blur on dark grey. A lighter, slightly less saturated tint keeps the identity and stops the colour from vibrating against the background.',
          tr: 'Doygun renkler en çok özeni ister. Beyaz üzerinde keskin görünen parlak marka mavisi, koyu gri üzerinde ışıldayıp bulanıklaşabilir. Daha açık ve biraz daha az doygun bir ton, kimliği korur ve rengin arka plana karşı titreşmesini engeller.',
        },
      },
      {
        type: 'h2',
        id: 'tokens',
        text: { en: 'Name colours by their job', tr: 'Renkleri işlerine göre adlandırın' },
      },
      {
        type: 'p',
        text: {
          en: 'The easiest themes are the ones where no component knows its actual colour. A button asks for "accent" and "on-accent"; the theme decides what those are. Then dark mode is a second set of values, not a second set of components.',
          tr: 'En kolay temalar, hiçbir bileşenin gerçek rengini bilmediği temalardır. Bir düğme "vurgu" ve "vurgu üstü" rengini ister; bunların ne olduğuna tema karar verir. O zaman koyu tema ikinci bir bileşen seti değil, ikinci bir değer setidir.',
        },
      },
      {
        type: 'code',
        language: 'css',
        code: `:root {
  --surface: #ffffff;
  --text: #1c1c1e;
  --accent: #2f5bd3;
}

@media (prefers-color-scheme: dark) {
  :root {
    --surface: #17181c;
    --text: #e8e6e1;
    --accent: #8aa6ff;
  }
}`,
      },
      {
        type: 'h3',
        id: 'check',
        text: { en: 'Check, do not guess', tr: 'Tahmin etmeyin, ölçün' },
      },
      {
        type: 'p',
        text: {
          en: 'The accessibility guidelines ask for a contrast ratio of at least 4.5 to 1 for body text and 3 to 1 for large text. Measure both themes. Colours that pass comfortably on white often fail on dark grey, and the fix is usually a lighter tint of the same hue.',
          tr: 'Erişilebilirlik yönergeleri gövde metni için en az 4,5’e 1, büyük metin için 3’e 1 kontrast oranı ister. İki temayı da ölçün. Beyaz üzerinde rahatça geçen renkler koyu gri üzerinde çoğu zaman kalır; çözüm genellikle aynı rengin daha açık bir tonudur.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Finally, remember images and illustrations. A diagram drawn with black lines on transparent background disappears in dark mode. Give such images their own light panel, or draw them with the same colour tokens as the interface so they change with it.',
          tr: 'Son olarak görselleri ve çizimleri unutmayın. Saydam arka plan üzerine siyah çizgilerle çizilmiş bir diyagram koyu temada kaybolur. Bu tür görsellere kendi açık panellerini verin ya da onları arayüzle aynı renk değişkenleriyle çizin ki onunla birlikte değişsinler.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'A good dark theme is not a mirror. It is the same design, lit differently.',
          tr: 'İyi bir koyu tema ayna değildir. Aynı tasarımdır, yalnızca farklı aydınlatılmıştır.',
        },
      },
    ],
  },
  {
    slug: 'in-praise-of-the-humble-form',
    topic: 'design',
    authorId: 'mira-coskun',
    title: { en: 'In praise of the humble form', tr: 'Mütevazı forma övgü' },
    dek: {
      en: 'Nobody screenshots a good form. Everybody remembers a bad one.',
      tr: 'Kimse iyi bir formun ekran görüntüsünü almaz. Kötü olanı ise herkes hatırlar.',
    },
    published: '2026-06-25',
    cover: 'stripes',
    views: 9800,
    body: [
      {
        type: 'p',
        text: {
          en: 'Forms are where products ask for something. A name, an address, a card number. They are also where most people give up. The difference between the two outcomes is rarely clever design; it is patience with small details.',
          tr: 'Formlar, ürünlerin bir şey istediği yerdir: bir ad, bir adres, bir kart numarası. Aynı zamanda çoğu insanın vazgeçtiği yer de. İki sonuç arasındaki fark nadiren zekice bir tasarımdır; küçük ayrıntılara gösterilen sabırdır.',
        },
      },
      {
        type: 'h2',
        id: 'labels',
        text: { en: 'Labels above, always visible', tr: 'Etiket üstte ve hep görünür' },
      },
      {
        type: 'p',
        text: {
          en: 'A placeholder that disappears when you start typing is a label that abandons you. Put the label above the field and keep it there. Use the placeholder, if at all, for an example of the format.',
          tr: 'Yazmaya başladığınızda kaybolan bir yer tutucu, sizi yarı yolda bırakan bir etikettir. Etiketi alanın üstüne koyun ve orada tutun. Yer tutucuyu kullanacaksanız biçime örnek vermek için kullanın.',
        },
      },
      {
        type: 'figure',
        art: 'form',
        caption: {
          en: 'A label that stays, a hint before the mistake, an error that says how to fix it.',
          tr: 'Kalan bir etiket, hatadan önce bir ipucu ve nasıl düzeltileceğini söyleyen bir hata mesajı.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Mark what is optional rather than what is required. If most fields are required, a row of red stars adds noise; a quiet “optional” next to the one exception says more with less.',
          tr: 'Zorunlu olanı değil isteğe bağlı olanı işaretleyin. Alanların çoğu zorunluysa bir sıra kırmızı yıldız yalnızca gürültü ekler; tek istisnanın yanındaki sessiz bir “isteğe bağlı” daha azıyla daha çok şey söyler.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Choose the right input for the job. A date picker for a birthday decades ago can be slower than three small fields. A numeric keyboard for a phone number saves a tap on every digit. The best control is the one that matches how people already think about the answer.',
          tr: 'İş için doğru giriş türünü seçin. Onlarca yıl önceki bir doğum günü için tarih seçici, üç küçük alandan daha yavaş olabilir. Telefon numarası için sayısal klavye her rakamda bir dokunuş kazandırır. En iyi kontrol, insanların yanıt hakkında zaten düşündüğü biçime uyandır.',
        },
      },
      {
        type: 'h2',
        id: 'errors',
        text: { en: 'Errors that help', tr: 'Yardım eden hata mesajları' },
      },
      {
        type: 'list',
        items: [
          {
            en: 'Say what to do, not what went wrong: "Enter a date after today" beats "Invalid date".',
            tr: 'Neyin yanlış gittiğini değil ne yapılacağını söyleyin: "Bugünden sonraki bir tarih girin", "Geçersiz tarih"ten iyidir.',
          },
          {
            en: 'Check a field when the person leaves it, not on every keystroke.',
            tr: 'Alanı her tuşa basışta değil, kişi alandan ayrıldığında kontrol edin.',
          },
          {
            en: 'Keep what they typed. Never clear a field because it was wrong.',
            tr: 'Yazılanı koruyun. Bir alanı yanlış olduğu için asla temizlemeyin.',
          },
          {
            en: 'Move focus to the first problem when the form is sent.',
            tr: 'Form gönderildiğinde odağı ilk soruna taşıyın.',
          },
        ],
      },
      {
        type: 'h3',
        id: 'ask-less',
        text: { en: 'Ask for less', tr: 'Daha az isteyin' },
      },
      {
        type: 'p',
        text: {
          en: 'The best field is the one you delete. Do you need a separate first and last name? Do you need the city if you already have the postcode? Every question you remove is one fewer reason to leave.',
          tr: 'En iyi alan, sildiğiniz alandır. Ad ve soyadı gerçekten ayrı mı gerekiyor? Posta kodu varken şehri sormanız şart mı? Kaldırdığınız her soru, vazgeçmek için bir neden eksiltir.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Test a form by filling it in on a phone, with one thumb, in a hurry. Every point where you hesitate is a point where someone else gives up.',
          tr: 'Bir formu, telefonda, tek başparmakla ve aceleyle doldurarak test edin. Duraksadığınız her nokta, başka birinin vazgeçtiği bir noktadır.',
        },
      },
      {
        type: 'quote',
        text: {
          en: 'A form is a conversation. Speak one question at a time, and listen to the answer.',
          tr: 'Form bir sohbettir. Her seferinde bir soru sorun ve yanıtı dinleyin.',
        },
      },
    ],
  },
  {
    slug: 'how-bees-understand-nothing',
    topic: 'science',
    authorId: 'emre-tunali',
    title: {
      en: 'How bees understand nothing',
      tr: 'Arılar hiçliği nasıl anlıyor',
    },
    dek: {
      en: 'A small brain, a clever experiment and the surprisingly hard idea of zero.',
      tr: 'Küçük bir beyin, zekice bir deney ve sıfır fikrinin şaşırtıcı zorluğu.',
    },
    published: '2026-09-09',
    cover: 'dots',
    views: 26500,
    editorsPick: true,
    body: [
      {
        type: 'p',
        text: {
          en: 'Zero took humans a long time. Many ancient number systems had no symbol for it, and the idea that "nothing" could be a quantity, smaller than one, is not obvious. So it caught attention when researchers reported in 2018 that honeybees seem to grasp it.',
          tr: 'Sıfır, insanlar için uzun zaman aldı. Pek çok eski sayı sisteminde onun için bir simge yoktu; "hiçbir şey"in birden küçük bir miktar olabileceği fikri de apaçık değildir. Bu yüzden araştırmacılar 2018’de bal arılarının bunu kavradığını bildirdiğinde dikkat çekti.',
        },
      },
      {
        type: 'h2',
        id: 'experiment',
        text: { en: 'The experiment', tr: 'Deney' },
      },
      {
        type: 'p',
        text: {
          en: 'Bees were trained with cards showing different numbers of shapes. Choosing the card with fewer shapes earned sugar water. Once they had learned "fewer is better", they were shown a card with no shapes at all next to a card with one or more. Most of the time they chose the empty card.',
          tr: 'Arılar, üzerinde farklı sayıda şekil bulunan kartlarla eğitildi. Daha az şekilli kartı seçmek şekerli suyla ödüllendirildi. "Az olan iyidir" kuralını öğrendikten sonra, hiç şekil olmayan bir kart ile bir ya da daha fazla şekilli bir kart gösterildi. Çoğu zaman boş kartı seçtiler.',
        },
      },
      {
        type: 'figure',
        art: 'bees',
        caption: {
          en: 'Trained on "fewer", bees placed the empty card below one.',
          tr: '"Daha az"ı öğrenen arılar boş kartı birin altına yerleştirdi.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'The design mattered. To make sure the bees were not simply choosing the card with less black ink, the researchers varied the size, colour and arrangement of the shapes, so that the total area did not give the answer away. The bees still picked by number.',
          tr: 'Deneyin tasarımı önemliydi. Araştırmacılar, arıların yalnızca daha az siyah mürekkep olan kartı seçmediğinden emin olmak için şekillerin boyutunu, rengini ve dizilişini değiştirdi; böylece toplam alan yanıtı ele vermedi. Arılar yine de sayıya göre seçti.',
        },
      },
      {
        type: 'h2',
        id: 'what-it-means',
        text: { en: 'What it does and does not mean', tr: 'Ne anlama geliyor, ne anlama gelmiyor' },
      },
      {
        type: 'p',
        text: {
          en: 'It does not mean bees do arithmetic the way we do. It suggests that treating "none" as the low end of a scale does not require a large brain. Earlier work had already shown that bees can keep track of small numbers of landmarks, up to around four, while foraging.',
          tr: 'Bu, arıların bizim gibi aritmetik yaptığı anlamına gelmiyor. "Hiç"i bir ölçeğin alt ucu olarak görmenin büyük bir beyin gerektirmediğini düşündürüyor. Daha önceki çalışmalar da arıların yiyecek ararken dört civarına kadar az sayıda yer işaretini takip edebildiğini göstermişti.',
        },
      },
      {
        type: 'note',
        text: {
          en: 'Animal cognition results are debated and replicated for years. Read a single study as a strong hint, not a final answer.',
          tr: 'Hayvan bilişi sonuçları yıllarca tartışılır ve tekrarlanır. Tek bir çalışmayı kesin bir yanıt değil güçlü bir ipucu olarak okuyun.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Other animals have passed similar tests. Monkeys and some birds have been shown to treat an empty set as smaller than one. What makes the bee result striking is the size of the brain involved, and the distance on the tree of life between insects and us.',
          tr: 'Başka hayvanlar da benzer testleri geçti. Maymunların ve bazı kuşların boş bir kümeyi birden küçük saydığı gösterildi. Arı sonucunu çarpıcı kılan, işin içindeki beynin büyüklüğü ve hayat ağacında böceklerle aramızdaki mesafedir.',
        },
      },
      {
        type: 'h3',
        id: 'why-care',
        text: { en: 'Why it matters beyond bees', tr: 'Arıların ötesinde neden önemli' },
      },
      {
        type: 'p',
        text: {
          en: 'The next time a bee visits a flower and leaves the one beside it untouched, it may be doing a small piece of arithmetic. Or it may simply know there is nothing left there. Either way, it seems to understand nothing better than we assumed.',
          tr: 'Bir dahaki sefere bir arı bir çiçeğe konup yanındakine dokunmadan geçtiğinde küçük bir hesap yapıyor olabilir. Ya da orada hiçbir şey kalmadığını biliyordur. Her iki durumda da hiçliği sandığımızdan daha iyi anlıyor gibi görünüyor.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'If a brain with under a million neurons can learn a rule like this, engineers building small, efficient learning systems have something to study. Nature often finds the cheap solution first.',
          tr: 'Bir milyondan az nöronu olan bir beyin böyle bir kuralı öğrenebiliyorsa, küçük ve verimli öğrenen sistemler kuran mühendislerin inceleyeceği bir şey var demektir. Doğa ucuz çözümü çoğu zaman önce bulur.',
        },
      },
    ],
  },
  {
    slug: 'the-colours-of-twilight',
    topic: 'science',
    authorId: 'emre-tunali',
    title: { en: 'The colours of twilight', tr: 'Alacakaranlığın renkleri' },
    dek: {
      en: 'Civil, nautical, astronomical: the sky has names for each step of the dark.',
      tr: 'Sivil, denizcilik, astronomik: gökyüzünün karanlığın her adımı için bir adı var.',
    },
    published: '2026-07-15',
    cover: 'sun',
    views: 11900,
    body: [
      {
        type: 'p',
        text: {
          en: 'Sunset is a moment; twilight is a process. After the sun disappears the sky keeps changing for well over an hour at mid latitudes, and astronomers divide that time into three stages by how far the sun has sunk below the horizon.',
          tr: 'Gün batımı bir andır; alacakaranlık ise bir süreç. Güneş kaybolduktan sonra orta enlemlerde gökyüzü bir saatten uzun süre değişmeye devam eder. Gökbilimciler bu süreyi, güneşin ufkun ne kadar altına indiğine göre üç evreye ayırır.',
        },
      },
      {
        type: 'h2',
        id: 'three-stages',
        text: { en: 'Three stages', tr: 'Üç evre' },
      },
      {
        type: 'list',
        items: [
          {
            en: 'Civil twilight, sun up to 6° below: you can still read outdoors.',
            tr: 'Sivil alacakaranlık, güneş 6°’ye kadar aşağıda: dışarıda hâlâ okunabilir.',
          },
          {
            en: 'Nautical twilight, 6° to 12°: the horizon at sea fades, bright stars appear.',
            tr: 'Denizcilik alacakaranlığı, 6° ile 12° arası: denizde ufuk silikleşir, parlak yıldızlar görünür.',
          },
          {
            en: 'Astronomical twilight, 12° to 18°: the last glow leaves the sky.',
            tr: 'Astronomik alacakaranlık, 12° ile 18° arası: son ışıltı da gökyüzünden çekilir.',
          },
        ],
      },
      {
        type: 'figure',
        art: 'twilight',
        caption: {
          en: 'Each band is six degrees of the sun’s descent.',
          tr: 'Her bant, güneşin inişinin altı derecesine karşılık gelir.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'These definitions are practical as much as poetic. Civil twilight has long been used for rules about lights on vehicles and aircraft. Nautical twilight marks when sailors could still see the horizon to take star sightings. Astronomical twilight tells observers when the sky is dark enough for faint galaxies.',
          tr: 'Bu tanımlar şiirsel olduğu kadar pratik de. Sivil alacakaranlık uzun zamandır taşıtlarda ve uçaklarda ışık kullanımına dair kurallarda kullanılıyor. Denizcilik alacakaranlığı, denizcilerin yıldız gözlemi için ufku hâlâ görebildiği zamanı gösterir. Astronomik alacakaranlık ise gözlemcilere gökyüzünün sönük galaksiler için yeterince karardığı anı söyler.',
        },
      },
      {
        type: 'h2',
        id: 'why-blue',
        text: { en: 'Why the blue hour is blue', tr: 'Mavi saat neden mavi' },
      },
      {
        type: 'p',
        text: {
          en: 'During the day, air molecules scatter short, blue wavelengths far more than red ones, which is why the sky is blue. At twilight the light reaching you has travelled a long path high in the atmosphere, and ozone there absorbs some of the orange and red. What remains is that deep, even blue photographers wait for.',
          tr: 'Gündüz hava molekülleri kısa, mavi dalga boylarını kırmızıdan çok daha fazla saçar; gökyüzünün mavi olmasının nedeni budur. Alacakaranlıkta size ulaşan ışık atmosferin yukarılarında uzun bir yol kat etmiştir ve oradaki ozon turuncu ile kırmızının bir kısmını emer. Geriye fotoğrafçıların beklediği o derin, düzgün mavi kalır.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Look east at the same time and you may see a pink band just above the horizon with a darker blue-grey layer beneath it. The dark layer is the shadow of the Earth itself, cast on the atmosphere, and the pink band above it is called the Belt of Venus.',
          tr: 'Aynı anda doğuya bakarsanız ufkun hemen üstünde pembe bir kuşak ve altında daha koyu, mavimsi gri bir katman görebilirsiniz. Koyu katman, Dünya’nın atmosfere düşen kendi gölgesidir; üstündeki pembe kuşağa ise Venüs Kuşağı denir.',
        },
      },
      {
        type: 'h3',
        id: 'latitude',
        text: { en: 'Latitude changes everything', tr: 'Enlem her şeyi değiştirir' },
      },
      {
        type: 'p',
        text: {
          en: 'Near the equator the sun drops steeply and twilight is short. Far north in summer, the sun may never sink 18° at all, and the night never becomes fully dark. The same physics, a different angle.',
          tr: 'Ekvator yakınında güneş dik iner ve alacakaranlık kısadır. Yazın çok kuzeyde güneş hiç 18°’nin altına inmeyebilir ve gece hiçbir zaman tam kararmaz. Aynı fizik, farklı bir açı.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Most weather apps list the times of civil, nautical and astronomical dusk for your location. Pick one clear evening, note them down, and watch each boundary pass. It is the cheapest astronomy there is.',
          tr: 'Çoğu hava durumu uygulaması bulunduğunuz yer için sivil, denizcilik ve astronomik akşam alacakaranlığının saatlerini verir. Açık bir akşam seçin, saatleri not edin ve her sınırın geçişini izleyin. Bundan daha ucuz bir astronomi yok.',
        },
      },
      {
        type: 'quote',
        text: {
          en: 'Stay outside ten minutes longer than you meant to. The sky is not finished yet.',
          tr: 'Dışarıda niyet ettiğinizden on dakika fazla kalın. Gökyüzü henüz işini bitirmedi.',
        },
      },
    ],
  },
  {
    slug: 'the-physics-of-a-skipping-stone',
    topic: 'science',
    authorId: 'emre-tunali',
    title: {
      en: 'The physics of a skipping stone',
      tr: 'Sekerek giden taşın fiziği',
    },
    dek: {
      en: 'Speed, spin and one angle that matters more than all the others.',
      tr: 'Hız, dönüş ve hepsinden önemli tek bir açı.',
    },
    published: '2026-06-09',
    cover: 'waves',
    views: 8700,
    body: [
      {
        type: 'p',
        text: {
          en: 'Everyone who has stood at a lake has tried it. Some stones bounce once and sink; others hop across the water a dozen times. The difference is not luck. It is a handful of quantities you can control with your wrist.',
          tr: 'Bir göl kıyısında duran herkes denemiştir. Bazı taşlar bir kez seker ve batar; bazıları suyun üstünde düzinelerce kez zıplar. Fark şans değil. Bileğinizle kontrol edebileceğiniz birkaç büyüklük.',
        },
      },
      {
        type: 'h2',
        id: 'angle',
        text: { en: 'The magic angle', tr: 'Sihirli açı' },
      },
      {
        type: 'p',
        text: {
          en: 'In a well known 2004 study, French physicists launched aluminium discs at water with a small machine and filmed each impact. The best results came when the disc met the water tilted at about 20 degrees. Much flatter or steeper, and the stone lost too much energy on the first hit.',
          tr: '2004’te yayımlanan bilinen bir çalışmada Fransız fizikçiler küçük bir düzenekle alüminyum diskleri suya fırlatıp her çarpmayı filme aldı. En iyi sonuçlar, disk suya yaklaşık 20 derece eğimle değdiğinde elde edildi. Çok daha düz ya da dik olduğunda taş ilk temasta fazla enerji kaybetti.',
        },
      },
      {
        type: 'figure',
        art: 'stone',
        caption: {
          en: 'Tilt the front edge up slightly; about twenty degrees works best.',
          tr: 'Ön kenarı hafifçe yukarı kaldırın; yaklaşık yirmi derece en iyi sonucu verir.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Speed matters too, but mostly as a threshold. Below a certain speed the stone cannot generate enough lift from the water and sinks on the first contact. Above it, each bounce costs a little speed and a little height until the stone finally runs out of both.',
          tr: 'Hız da önemli ama daha çok bir eşik olarak. Belirli bir hızın altında taş sudan yeterli kaldırma kuvveti alamaz ve ilk temasta batar. Üstünde ise her sekme biraz hız ve biraz yükseklik götürür, ta ki taşın ikisi de tükenene kadar.',
        },
      },
      {
        type: 'h2',
        id: 'spin',
        text: { en: 'Spin keeps it steady', tr: 'Dönüş dengede tutar' },
      },
      {
        type: 'p',
        text: {
          en: 'A spinning stone behaves like a small gyroscope. The spin keeps its angle stable from one bounce to the next, so it does not start to wobble and dig in. That is what the flick of the index finger is for.',
          tr: 'Dönen bir taş küçük bir jiroskop gibi davranır. Dönüş, açısını bir sekmeden diğerine sabit tutar; böylece yalpalayıp suya gömülmez. İşaret parmağının o son fiskesi bunun içindir.',
        },
      },
      {
        type: 'list',
        ordered: true,
        items: [
          {
            en: 'Choose a flat, round stone about the size of your palm.',
            tr: 'Avuç içi büyüklüğünde, düz ve yuvarlak bir taş seçin.',
          },
          {
            en: 'Crouch low so the stone travels almost parallel to the water.',
            tr: 'Taş suya neredeyse paralel gitsin diye alçalın.',
          },
          {
            en: 'Throw hard and flick your finger for spin.',
            tr: 'Sert fırlatın ve dönüş için parmağınızla fiske vurun.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'water',
        text: { en: 'The water decides too', tr: 'Son sözü su söyler' },
      },
      {
        type: 'p',
        text: {
          en: 'Calm water is best. Waves change the angle of every impact, turning a perfect throw into a clumsy one. Early morning, when the wind is still low, is when the long runs happen, and when you are most likely to have the shore to yourself.',
          tr: 'En iyisi durgun sudur. Dalgalar her çarpmanın açısını değiştirir ve kusursuz bir atışı sakar bir atışa çevirir. Uzun serilerin yaşandığı zaman rüzgârın henüz hafif olduğu sabah erken saatlerdir; kıyının size kalma ihtimali de en yüksek o zamandır.',
        },
      },
      {
        type: 'p',
        text: {
          en: 'Physics cannot make you patient, but it can tell you which throws to keep practising.',
          tr: 'Fizik sizi sabırlı yapamaz ama hangi atışları çalışmaya devam etmeniz gerektiğini söyleyebilir.',
        },
      },
    ],
  },
]
