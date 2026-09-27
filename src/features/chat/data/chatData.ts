import dayjs from 'dayjs'
import antDesignPhoto from '@/assets/theme-backgrounds/ant-design.jpg'
import gurkanPhoto from '@/assets/theme-backgrounds/gurkan.jpg'
import illustrationPhoto from '@/assets/theme-backgrounds/illustration.jpg'
import muiPhoto from '@/assets/theme-backgrounds/mui.jpg'
import shadcnPhoto from '@/assets/theme-backgrounds/shadcn.jpg'
import { createVoiceNote } from '@/features/chat/data/voiceNote'
import { ME, type ChatContact, type ChatMessage, type Conversation } from '@/features/chat/types'

/** The PDF the documents page also uses, attached here as a file. */
const SAMPLE_REPORT_BYTES = 1_803

/** A short CC0 clip from MDN's examples: the repository ships no video of its own. */
const SAMPLE_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

/** A time `daysAgo` days back at `time`, so the seed always reads as recent. */
function at(daysAgo: number, time: string): string {
  const [hour = 0, minute = 0] = time.split(':').map(Number)

  return dayjs().subtract(daysAgo, 'day').hour(hour).minute(minute).second(0).toISOString()
}

export const chatContacts: ChatContact[] = [
  {
    id: 'ayse',
    name: 'Ayşe Demir',
    role: { en: 'Product designer', tr: 'Ürün tasarımcısı' },
    color: '#eb2f96',
    presence: 'online',
    about: {
      en: 'Designing things people enjoy using. Coffee first ☕',
      tr: 'İnsanların keyifle kullandığı şeyler tasarlıyorum. Önce kahve ☕',
    },
    phone: '+90 532 410 22 18',
    email: 'ayse.demir@example.com',
  },
  {
    id: 'can',
    name: 'Can Yılmaz',
    role: { en: 'Frontend developer', tr: 'Frontend geliştirici' },
    color: '#1677ff',
    presence: 'online',
    about: { en: 'Shipping pixels since 2015.', tr: "2015'ten beri piksel gönderiyorum." },
    phone: '+90 533 118 44 02',
    email: 'can.yilmaz@example.com',
  },
  {
    id: 'elif',
    name: 'Elif Şahin',
    role: { en: 'QA engineer', tr: 'Test mühendisi' },
    color: '#13c2c2',
    presence: 'away',
    lastSeen: at(0, '09:12'),
    about: {
      en: 'If it can break, I will find out how.',
      tr: 'Bozulabiliyorsa, nasıl bozulduğunu bulurum.',
    },
    phone: '+90 541 902 13 77',
    email: 'elif.sahin@example.com',
  },
  {
    id: 'mehmet',
    name: 'Mehmet Kaya',
    role: { en: 'Backend developer', tr: 'Backend geliştirici' },
    color: '#fa8c16',
    presence: 'offline',
    lastSeen: at(1, '22:47'),
    about: { en: 'APIs, queues and too much tea.', tr: "API'ler, kuyruklar ve fazlaca çay." },
    phone: '+90 535 667 90 11',
    email: 'mehmet.kaya@example.com',
  },
  {
    id: 'zeynep',
    name: 'Zeynep Arslan',
    role: { en: 'Product manager', tr: 'Ürün yöneticisi' },
    color: '#722ed1',
    presence: 'online',
    about: { en: 'Busy · Ask me about the roadmap', tr: 'Meşgul · Yol haritasını bana sorun' },
    phone: '+90 530 221 56 40',
    email: 'zeynep.arslan@example.com',
  },
  {
    id: 'burak',
    name: 'Burak Öztürk',
    role: { en: 'DevOps engineer', tr: 'DevOps mühendisi' },
    color: '#52c41a',
    presence: 'offline',
    lastSeen: at(0, '07:30'),
    about: { en: 'On call this week 📟', tr: 'Bu hafta nöbetçiyim 📟' },
    phone: '+90 542 350 87 23',
    email: 'burak.ozturk@example.com',
  },
  {
    id: 'selin',
    name: 'Selin Koç',
    role: { en: 'Marketing lead', tr: 'Pazarlama lideri' },
    color: '#f5222d',
    presence: 'offline',
    lastSeen: at(12, '18:05'),
    about: {
      en: 'Telling the story of what we build.',
      tr: 'Ürettiklerimizin hikayesini anlatıyorum.',
    },
    phone: '+90 536 781 04 59',
    email: 'selin.koc@example.com',
  },
  {
    id: 'emre',
    name: 'Emre Aydın',
    role: { en: 'Data analyst', tr: 'Veri analisti' },
    color: '#2f54eb',
    presence: 'away',
    lastSeen: at(0, '11:40'),
    about: {
      en: 'Numbers, dashboards and good questions.',
      tr: 'Sayılar, panolar ve iyi sorular.',
    },
    phone: '+90 543 129 65 30',
    email: 'emre.aydin@example.com',
  },
]

let seedId = 0
function message(fields: Omit<ChatMessage, 'id'>): ChatMessage {
  seedId += 1
  return { id: `seed-${seedId}`, ...fields }
}

function mine(fields: Omit<ChatMessage, 'id' | 'authorId'>): ChatMessage {
  return message({ authorId: ME, status: 'read', ...fields })
}

/**
 * The seed covers what a chat screen has to get right: runs of messages from one person,
 * other people cutting in, replies, photos, emoji-only messages, reactions, system lines,
 * several days, unread counts, a muted group and a chat with nothing in it yet.
 */
export function createSeedConversations(): Conversation[] {
  seedId = 0

  const ayseCoffee = message({
    authorId: 'ayse',
    sentAt: at(0, '14:09'),
    text: { en: 'Coffee? ☕', tr: 'Kahve? ☕' },
  })
  const canBuild = message({
    authorId: 'can',
    sentAt: at(0, '10:02'),
    text: {
      en: 'The build on main is red again. Something in the calendar tests?',
      tr: "main'deki build yine kırmızı. Takvim testlerinde bir şey mi var?",
    },
  })
  const mehmetSpec = message({
    authorId: 'mehmet',
    sentAt: at(1, '17:20'),
    text: {
      en: 'I pushed the draft of the notifications API. Endpoints are under /v2/notifications, paging is cursor based and every item carries a read flag. Websocket events mirror the REST payloads so the client can use one type for both. Could you look at it before tomorrow’s review?',
      tr: 'Bildirim API taslağını gönderdim. Uç noktalar /v2/notifications altında, sayfalama cursor tabanlı ve her kayıtta okundu bilgisi var. Websocket olayları REST ile aynı yapıda, böylece istemci ikisi için tek tip kullanabilir. Yarınki incelemeden önce bakabilir misin?',
    },
  })
  const zeynepScope = message({
    authorId: 'zeynep',
    sentAt: at(3, '09:30'),
    text: {
      en: 'Scope for 2.4 is frozen: chat, calendar drag and drop, PDF viewer.',
      tr: '2.4 kapsamı kesinleşti: sohbet, takvimde sürükle bırak, PDF görüntüleyici.',
    },
  })

  return [
    {
      id: 'c-ayse',
      kind: 'private',
      memberIds: [ME, 'ayse'],
      unread: 2,
      pinned: true,
      messages: [
        message({
          authorId: 'ayse',
          sentAt: at(1, '19:40'),
          text: { en: 'Landing now, see you Monday!', tr: 'İniyorum, pazartesi görüşürüz!' },
        }),
        mine({ sentAt: at(1, '19:42'), text: { en: 'Safe travels 🙌', tr: 'İyi yolculuklar 🙌' } }),
        message({
          authorId: 'ayse',
          sentAt: at(0, '13:58'),
          text: { en: 'Hi, I am back from vacation', tr: 'Selam, tatilden döndüm' },
        }),
        message({
          authorId: 'ayse',
          sentAt: at(0, '13:58'),
          images: [illustrationPhoto, shadcnPhoto, muiPhoto],
          text: { en: 'A few from the trip', tr: 'Tatilden birkaç kare' },
        }),
        message({
          authorId: 'ayse',
          sentAt: at(0, '13:59'),
          text: { en: 'How are you?', tr: 'Nasılsın?' },
          reactions: { '❤️': [ME] },
        }),
        mine({ sentAt: at(0, '14:03'), text: { en: 'Welcome back!', tr: 'Hoş geldin!' } }),
        mine({
          sentAt: at(0, '14:03'),
          text: {
            en: 'I am all well. These photos are amazing 😍',
            tr: 'Ben çok iyiyim. Fotoğraflar harika 😍',
          },
        }),
        ayseCoffee,
        message({
          authorId: 'ayse',
          sentAt: at(0, '14:10'),
          replyToId: ayseCoffee.id,
          text: {
            en: 'I also brought something for the team 🎁',
            tr: 'Ekibe de bir şeyler getirdim 🎁',
          },
        }),
        message({
          authorId: 'ayse',
          sentAt: at(0, '14:11'),
          attachment: { kind: 'voice', src: createVoiceNote(8, 220), duration: 8 },
        }),
      ],
    },
    {
      id: 'c-frontend',
      kind: 'group',
      title: { en: 'Frontend team', tr: 'Frontend ekibi' },
      memberIds: [ME, 'can', 'elif', 'mehmet', 'ayse'],
      description: {
        en: 'Day-to-day talk for the web client: builds, reviews and lunch plans.',
        tr: 'Web istemcisi için günlük konuşmalar: build, inceleme ve öğle planları.',
      },
      adminIds: ['can', ME],
      createdAt: at(6, '09:00'),
      unread: 4,
      messages: [
        message({
          authorId: 'can',
          system: true,
          sentAt: at(6, '09:00'),
          text: {
            en: 'Can Yılmaz created the group “Frontend team”',
            tr: 'Can Yılmaz “Frontend ekibi” grubunu oluşturdu',
          },
        }),
        message({
          authorId: 'can',
          system: true,
          sentAt: at(6, '09:00'),
          text: { en: 'Can Yılmaz added you', tr: 'Can Yılmaz sizi ekledi' },
        }),
        message({
          authorId: 'can',
          sentAt: at(6, '09:01'),
          text: { en: 'Welcome everyone 👋', tr: 'Herkese hoş geldiniz 👋' },
          reactions: { '👋': ['elif', 'mehmet', ME] },
        }),
        message({
          authorId: 'elif',
          sentAt: at(1, '16:10'),
          text: {
            en: 'Regression run for the release is done. Two issues, both in the editor.',
            tr: 'Sürüm için regresyon testi bitti. İki hata var, ikisi de editörde.',
          },
        }),
        message({
          authorId: 'elif',
          sentAt: at(1, '16:11'),
          images: [gurkanPhoto],
          text: {
            en: 'Toolbar overlaps on small screens',
            tr: 'Araç çubuğu küçük ekranda taşıyor',
          },
        }),
        message({
          authorId: 'elif',
          sentAt: at(1, '16:12'),
          attachment: {
            kind: 'file',
            src: '/sample-report.pdf',
            name: 'regression-report.pdf',
            size: SAMPLE_REPORT_BYTES,
          },
        }),
        mine({
          sentAt: at(1, '16:30'),
          text: { en: 'On it, will fix today.', tr: 'Bakıyorum, bugün düzeltirim.' },
          reactions: { '👍': ['elif'] },
        }),
        canBuild,
        message({
          authorId: 'can',
          sentAt: at(0, '10:02'),
          text: {
            en: 'Only on CI, it passes locally.',
            tr: 'Sadece CI’da, lokalde geçiyor.',
          },
        }),
        message({
          authorId: 'can',
          sentAt: at(0, '10:03'),
          text: { en: 'Timezone maybe 🤔', tr: 'Saat dilimi olabilir 🤔' },
        }),
        message({
          authorId: 'can',
          sentAt: at(0, '10:04'),
          attachment: { kind: 'video', src: SAMPLE_VIDEO, poster: gurkanPhoto },
          text: { en: 'Screen recording of the failing run', tr: 'Hatalı çalışmanın ekran kaydı' },
        }),
        message({
          authorId: 'elif',
          sentAt: at(0, '10:05'),
          replyToId: canBuild.id,
          text: {
            en: 'Yes, the runner is on UTC. The test builds dates with the local offset.',
            tr: 'Evet, runner UTC’de. Test tarihleri yerel saat farkıyla kuruyor.',
          },
        }),
        mine({
          sentAt: at(0, '10:12'),
          text: {
            en: 'Pinned the timezone in the test setup, main is green again.',
            tr: 'Test kurulumunda saat dilimini sabitledim, main yeniden yeşil.',
          },
          reactions: { '🎉': ['can', 'elif'], '🙏': ['mehmet'] },
        }),
        message({ authorId: 'can', sentAt: at(0, '10:13'), text: '🎉🎉🎉' }),
        message({
          authorId: 'mehmet',
          sentAt: at(0, '11:20'),
          text: {
            en: 'Lunch at 12:30? The new place across the street.',
            tr: 'Öğle yemeği 12:30’da? Karşıdaki yeni yer.',
          },
        }),
        message({
          authorId: 'mehmet',
          sentAt: at(0, '11:21'),
          poll: {
            question: { en: 'Where shall we eat?', tr: 'Nerede yiyelim?' },
            multiple: false,
            options: [
              { id: 'lunch-new', text: { en: 'The new place', tr: 'Yeni yer' } },
              { id: 'lunch-burger', text: { en: 'Burgers', tr: 'Hamburger' } },
              { id: 'lunch-home', text: { en: 'Home-style food', tr: 'Ev yemekleri' } },
            ],
            votes: { 'lunch-new': ['mehmet', 'ayse'], 'lunch-burger': ['can'], 'lunch-home': [] },
          },
        }),
        message({
          authorId: 'ayse',
          sentAt: at(0, '11:22'),
          text: { en: 'I’m in', tr: 'Ben varım' },
        }),
        message({
          authorId: 'elif',
          sentAt: at(0, '11:24'),
          text: { en: 'Me too, 5 minutes late though', tr: 'Ben de, ama 5 dk gecikirim' },
        }),
      ],
    },
    {
      id: 'c-mehmet',
      kind: 'private',
      memberIds: [ME, 'mehmet'],
      unread: 0,
      messages: [
        mehmetSpec,
        mine({
          sentAt: at(1, '17:45'),
          replyToId: mehmetSpec.id,
          text: {
            en: 'Sure. One question: do deleted notifications come through the socket too?',
            tr: 'Tabii. Bir sorum var: silinen bildirimler de socket’ten geliyor mu?',
          },
        }),
        message({
          authorId: 'mehmet',
          sentAt: at(1, '17:52'),
          text: {
            en: 'Yes, as a “removed” event with just the id.',
            tr: 'Evet, sadece id içeren bir “removed” olayı olarak.',
          },
        }),
        message({
          authorId: 'mehmet',
          sentAt: at(1, '17:52'),
          attachment: {
            kind: 'file',
            src: '/showcase-attachments/maintenance-window.csv',
            name: 'load-test-results.csv',
            size: 241,
          },
        }),
        mine({
          sentAt: at(1, '17:53'),
          attachment: { kind: 'voice', src: createVoiceNote(5, 140), duration: 5 },
        }),
        mine({ sentAt: at(1, '17:53'), text: '👍' }),
      ],
    },
    {
      id: 'c-release',
      kind: 'group',
      title: { en: 'Release 2.4', tr: 'Sürüm 2.4' },
      memberIds: [ME, 'zeynep', 'burak', 'emre', 'selin'],
      description: {
        en: 'Coordination for the 2.4 release. Decisions go here, details in the tickets.',
        tr: '2.4 sürümü için koordinasyon. Kararlar burada, ayrıntılar kayıtlarda.',
      },
      adminIds: ['zeynep'],
      createdAt: at(9, '10:00'),
      unread: 12,
      muted: true,
      messages: [
        message({
          authorId: 'zeynep',
          system: true,
          sentAt: at(4, '15:00'),
          text: {
            en: 'Zeynep Arslan changed the group name to “Release 2.4”',
            tr: 'Zeynep Arslan grup adını “Sürüm 2.4” olarak değiştirdi',
          },
        }),
        zeynepScope,
        message({
          authorId: 'zeynep',
          sentAt: at(3, '09:31'),
          attachment: { kind: 'voice', src: createVoiceNote(14, 240), duration: 14 },
        }),
        message({
          authorId: 'burak',
          sentAt: at(3, '09:41'),
          replyToId: zeynepScope.id,
          text: {
            en: 'Staging is ready for all three. Deploy window is Thursday 22:00.',
            tr: 'Staging üçü için de hazır. Yayın penceresi perşembe 22:00.',
          },
        }),
        message({
          authorId: 'emre',
          sentAt: at(2, '11:05'),
          images: [antDesignPhoto, gurkanPhoto],
          text: {
            en: 'Usage of the beta so far, calendar is the clear winner',
            tr: 'Betanın şimdiye kadarki kullanımı, takvim açık ara önde',
          },
        }),
        message({
          authorId: 'selin',
          sentAt: at(2, '11:30'),
          text: {
            en: 'Great, I will lead the announcement with the calendar then.',
            tr: 'Harika, duyuruyu takvimle açarım o zaman.',
          },
          reactions: { '🔥': ['zeynep', 'emre'] },
        }),
        message({
          authorId: 'zeynep',
          sentAt: at(2, '11:45'),
          poll: {
            question: {
              en: 'Which days work for the release retro?',
              tr: 'Sürüm retrosu için hangi günler uygun?',
            },
            multiple: true,
            options: [
              { id: 'retro-mon', text: { en: 'Monday', tr: 'Pazartesi' } },
              { id: 'retro-tue', text: { en: 'Tuesday', tr: 'Salı' } },
              { id: 'retro-thu', text: { en: 'Thursday', tr: 'Perşembe' } },
            ],
            votes: {
              'retro-mon': ['zeynep', 'emre'],
              'retro-tue': ['zeynep', 'burak', 'selin', ME],
              'retro-thu': ['emre'],
            },
          },
        }),
        mine({
          sentAt: at(2, '12:00'),
          status: 'delivered',
          text: {
            en: 'Chat will be behind a feature flag for the first week.',
            tr: 'Sohbet ilk hafta feature flag arkasında olacak.',
          },
        }),
      ],
    },
    {
      id: 'c-burak',
      kind: 'private',
      memberIds: [ME, 'burak'],
      unread: 0,
      messages: [
        message({
          authorId: 'burak',
          sentAt: at(0, '07:25'),
          text: {
            en: 'Certificates renew tonight, you might see a short blip.',
            tr: 'Sertifikalar bu gece yenileniyor, kısa bir kesinti görebilirsin.',
          },
        }),
        mine({
          sentAt: at(0, '08:40'),
          status: 'delivered',
          text: { en: 'Thanks for the heads up!', tr: 'Haber verdiğin için sağ ol!' },
        }),
      ],
    },
    {
      id: 'c-elif',
      kind: 'private',
      memberIds: [ME, 'elif'],
      unread: 0,
      messages: [
        mine({
          sentAt: at(8, '10:00'),
          text: {
            en: 'Can you retest the upload flow when you have a minute?',
            tr: 'Vakit bulunca yükleme akışını tekrar test edebilir misin?',
          },
        }),
        message({ authorId: 'elif', sentAt: at(8, '10:31'), text: '👍' }),
      ],
    },
    {
      id: 'c-selin',
      kind: 'private',
      memberIds: [ME, 'selin'],
      unread: 0,
      messages: [
        message({
          authorId: 'selin',
          sentAt: at(40, '15:15'),
          text: {
            en: 'Could you send me the screenshots for the website?',
            tr: 'Web sitesi için ekran görüntülerini gönderebilir misin?',
          },
        }),
        mine({
          sentAt: at(40, '15:40'),
          images: [antDesignPhoto, muiPhoto, shadcnPhoto, illustrationPhoto, gurkanPhoto],
        }),
        message({
          authorId: 'selin',
          sentAt: at(40, '15:42'),
          text: { en: 'Perfect, thank you!', tr: 'Mükemmel, teşekkürler!' },
        }),
      ],
    },
    {
      id: 'c-emre',
      kind: 'private',
      memberIds: [ME, 'emre'],
      unread: 0,
      messages: [],
    },
  ]
}

/** Ready-made answers for the simulated other side of a conversation. */
export const autoReplies = [
  { en: 'Sounds good 👍', tr: 'Kulağa iyi geliyor 👍' },
  { en: 'Got it, thanks!', tr: 'Anladım, teşekkürler!' },
  { en: 'Let me check and get back to you.', tr: 'Bir bakıp sana dönerim.' },
  { en: 'Haha 😄', tr: 'Haha 😄' },
  { en: 'Nice one!', tr: 'Güzel!' },
]
