import {
  addMinutes,
  slaDeadlines,
  type Agent,
  type Contact,
  type Ticket,
  type TicketActivity,
  type TicketCategory,
  type TicketChannel,
  type TicketMessage,
  type TicketPriority,
  type TicketStatus,
} from '@/features/helpdesk/types'
import type { Language } from '@/store/preferences-store'

type Copy = Record<Language, string>

/** The person using the demo; replies and changes are made in their name. */
export const CURRENT_AGENT_ID = 'agent-you'

export const agents: Agent[] = [
  { id: CURRENT_AGENT_ID, name: 'Demo Admin', color: '#1677ff' },
  { id: 'agent-elif', name: 'Elif Aydın', color: '#722ed1' },
  { id: 'agent-marco', name: 'Marco Rossi', color: '#13a8a8' },
  { id: 'agent-priya', name: 'Priya Nair', color: '#d48806' },
  { id: 'agent-jonas', name: 'Jonas Berg', color: '#c41d7f' },
]

/** Invented people at invented companies, on the reserved `.example` domain. */
export const seedContacts: Contact[] = [
  { id: 'c-hale', name: 'Hale Demir', email: 'hale@lumenfoods.example', company: 'Lumen Foods' },
  {
    id: 'c-owen',
    name: 'Owen Clarke',
    email: 'owen@brightpath.example',
    company: 'Brightpath Logistics',
  },
  { id: 'c-sofia', name: 'Sofia Marin', email: 'sofia@verdant.example', company: 'Verdant Energy' },
  { id: 'c-kaan', name: 'Kaan Yıldız', email: 'kaan@orbitlabs.example', company: 'Orbit Labs' },
  {
    id: 'c-amara',
    name: 'Amara Okafor',
    email: 'amara@northwind.example',
    company: 'Northwind Retail',
  },
  { id: 'c-lukas', name: 'Lukas Weber', email: 'lukas@tessera.example', company: 'Tessera Health' },
  { id: 'c-mei', name: 'Mei Tanaka', email: 'mei@kitecloud.example', company: 'Kite Cloud' },
  {
    id: 'c-deniz',
    name: 'Deniz Kaya',
    email: 'deniz@atlasmarine.example',
    company: 'Atlas Marine',
  },
]

interface SeedMessage {
  kind: TicketMessage['kind']
  /** An agent id for replies and notes; the requester writes the customer messages. */
  author?: string
  body: Copy
  /** Minutes after the ticket was opened. */
  after: number
  attachments?: TicketMessage['attachments']
}

interface SeedTicket {
  subject: Copy
  requester: string
  status: TicketStatus
  priority: TicketPriority
  channel: TicketChannel
  category: TicketCategory
  assignee?: string
  tags: string[]
  /** Minutes ago the ticket was opened. */
  openedAgo: number
  messages: SeedMessage[]
}

/*
 * Ages are chosen against the SLA targets so the queue shows every state at once: a clock
 * with plenty left, one about to run out, a few breached, and tickets that met theirs.
 */
const seeds: SeedTicket[] = [
  {
    subject: {
      en: 'Checkout fails with a 502 after the payment step',
      tr: 'Ödeme adımından sonra checkout 502 hatası veriyor',
    },
    requester: 'c-amara',
    status: 'open',
    priority: 'urgent',
    channel: 'email',
    category: 'technical',
    tags: ['checkout', 'outage'],
    openedAgo: 75,
    messages: [
      {
        kind: 'customer',
        after: 0,
        body: {
          en: 'Since this morning about a third of our customers get a 502 right after they confirm the card. Orders are not created. This is costing us sales every minute.',
          tr: 'Bu sabahtan beri müşterilerimizin yaklaşık üçte biri kartı onayladıktan hemen sonra 502 hatası alıyor. Siparişler oluşmuyor. Her dakika satış kaybediyoruz.',
        },
        attachments: [{ name: 'har-export.har', size: '1.8 MB' }],
      },
    ],
  },
  {
    subject: {
      en: 'Invoice for September shows the wrong VAT rate',
      tr: 'Eylül faturasında KDV oranı yanlış görünüyor',
    },
    requester: 'c-hale',
    status: 'open',
    priority: 'high',
    channel: 'portal',
    category: 'billing',
    assignee: 'agent-priya',
    tags: ['invoice', 'vat'],
    openedAgo: 190,
    messages: [
      {
        kind: 'customer',
        after: 0,
        body: {
          en: 'Our September invoice applies 18% VAT, but our contract says 20%. Our accountant needs a corrected copy before month end.',
          tr: 'Eylül faturamızda %18 KDV uygulanmış, oysa sözleşmemizde %20 yazıyor. Muhasebecimizin ay sonundan önce düzeltilmiş bir kopyaya ihtiyacı var.',
        },
        attachments: [{ name: 'invoice-2026-09.pdf', size: '84 KB' }],
      },
      {
        kind: 'note',
        author: 'agent-priya',
        after: 40,
        body: {
          en: 'Tax table for their region was updated on the 1st; checking whether the invoice run picked up the old one.',
          tr: 'Bölgelerinin vergi tablosu ayın 1’inde güncellendi; fatura çalışmasının eski tabloyu kullanıp kullanmadığına bakıyorum.',
        },
      },
    ],
  },
  {
    subject: {
      en: 'Two-factor codes arrive several minutes late',
      tr: 'İki adımlı doğrulama kodları birkaç dakika geç geliyor',
    },
    requester: 'c-owen',
    status: 'pending',
    priority: 'high',
    channel: 'chat',
    category: 'account',
    assignee: 'agent-marco',
    tags: ['2fa', 'sms'],
    openedAgo: 20 * 60,
    messages: [
      {
        kind: 'customer',
        after: 0,
        body: {
          en: 'The SMS codes for login take 4–5 minutes to arrive, by then they have expired.',
          tr: 'Giriş için gelen SMS kodları 4–5 dakikada ulaşıyor, geldiğinde süresi dolmuş oluyor.',
        },
      },
      {
        kind: 'reply',
        author: 'agent-marco',
        after: 55,
        body: {
          en: 'Thanks Owen. Our SMS provider reports delays for one carrier. Could you tell us which carrier your team uses? Meanwhile, an authenticator app works without delay.',
          tr: 'Teşekkürler Owen. SMS sağlayıcımız bir operatörde gecikme bildiriyor. Ekibinizin hangi operatörü kullandığını iletebilir misiniz? Bu arada doğrulama uygulaması gecikmesiz çalışır.',
        },
      },
    ],
  },
  {
    subject: {
      en: 'Request: export dashboards as PDF on a schedule',
      tr: 'İstek: panoları zamanlanmış olarak PDF dışa aktarma',
    },
    requester: 'c-sofia',
    status: 'onHold',
    priority: 'low',
    channel: 'email',
    category: 'featureRequest',
    assignee: 'agent-elif',
    tags: ['reporting', 'roadmap'],
    openedAgo: 3 * 24 * 60,
    messages: [
      {
        kind: 'customer',
        after: 0,
        body: {
          en: 'Our board wants the energy dashboard every Monday as a PDF. Is a scheduled export on your roadmap?',
          tr: 'Yönetim kurulumuz enerji panosunu her pazartesi PDF olarak istiyor. Zamanlanmış dışa aktarma yol haritanızda var mı?',
        },
      },
      {
        kind: 'reply',
        author: 'agent-elif',
        after: 180,
        body: {
          en: 'Good news: it is planned for next quarter. I’ll keep this ticket on hold and update you when the beta opens.',
          tr: 'Güzel haber: gelecek çeyrek için planlandı. Talebi askıda tutuyorum, beta açıldığında size haber vereceğim.',
        },
      },
    ],
  },
  {
    subject: {
      en: 'API rate limit reached although traffic is normal',
      tr: 'Trafik normal olmasına rağmen API hız sınırına takılıyoruz',
    },
    requester: 'c-kaan',
    status: 'open',
    priority: 'normal',
    channel: 'portal',
    category: 'technical',
    tags: ['api'],
    openedAgo: 6 * 60,
    messages: [
      {
        kind: 'customer',
        after: 0,
        body: {
          en: 'Since yesterday we get 429 responses at around 200 requests per minute; our plan allows 1000.',
          tr: 'Dünden beri dakikada yaklaşık 200 istekte 429 yanıtı alıyoruz; planımız 1000’e izin veriyor.',
        },
        attachments: [{ name: 'response-headers.txt', size: '3 KB' }],
      },
    ],
  },
  {
    subject: {
      en: 'Add a second admin to our workspace',
      tr: 'Çalışma alanımıza ikinci bir yönetici ekleme',
    },
    requester: 'c-lukas',
    status: 'resolved',
    priority: 'normal',
    channel: 'email',
    category: 'account',
    assignee: CURRENT_AGENT_ID,
    tags: ['permissions'],
    openedAgo: 2 * 24 * 60,
    messages: [
      {
        kind: 'customer',
        after: 0,
        body: {
          en: 'Our only admin is on leave. Can you give admin rights to anna@tessera.example?',
          tr: 'Tek yöneticimiz izinde. anna@tessera.example adresine yönetici yetkisi verebilir misiniz?',
        },
      },
      {
        kind: 'reply',
        author: CURRENT_AGENT_ID,
        after: 95,
        body: {
          en: 'Done: Anna now has admin rights. For security we have emailed your current admin as well.',
          tr: 'Tamamlandı: Anna artık yönetici. Güvenlik için mevcut yöneticinize de e-posta gönderdik.',
        },
      },
    ],
  },
  {
    subject: {
      en: 'Card was charged twice for the annual plan',
      tr: 'Yıllık plan için kart iki kez tahsil edildi',
    },
    requester: 'c-mei',
    status: 'open',
    priority: 'high',
    channel: 'phone',
    category: 'billing',
    assignee: 'agent-priya',
    tags: ['refund'],
    openedAgo: 5 * 60,
    messages: [
      {
        kind: 'customer',
        after: 0,
        body: {
          en: 'Called in: the annual plan renewal was charged twice on the same card. Wants the duplicate refunded.',
          tr: 'Telefonla aradı: yıllık plan yenilemesi aynı karttan iki kez tahsil edilmiş. Mükerrer tutarın iadesini istiyor.',
        },
      },
    ],
  },
  {
    subject: {
      en: 'Vessel positions stopped updating on the map',
      tr: 'Haritada gemi konumları güncellenmiyor',
    },
    requester: 'c-deniz',
    status: 'pending',
    priority: 'urgent',
    channel: 'chat',
    category: 'technical',
    assignee: 'agent-jonas',
    tags: ['maps', 'realtime'],
    openedAgo: 3 * 60,
    messages: [
      {
        kind: 'customer',
        after: 0,
        body: {
          en: 'The live map froze at 08:40. Our dispatch team is blind right now.',
          tr: 'Canlı harita 08:40’ta dondu. Sevkiyat ekibimiz şu an hiçbir şey göremiyor.',
        },
      },
      {
        kind: 'reply',
        author: 'agent-jonas',
        after: 20,
        body: {
          en: 'We restarted the position feed and it is updating again on our side. Can you refresh and confirm?',
          tr: 'Konum akışını yeniden başlattık, bizim tarafımızda tekrar güncelleniyor. Sayfayı yenileyip onaylayabilir misiniz?',
        },
      },
    ],
  },
  {
    subject: {
      en: 'How do I change the company name on invoices?',
      tr: 'Faturalardaki şirket adını nasıl değiştiririm?',
    },
    requester: 'c-hale',
    status: 'closed',
    priority: 'low',
    channel: 'portal',
    category: 'billing',
    assignee: 'agent-priya',
    tags: [],
    openedAgo: 6 * 24 * 60,
    messages: [
      {
        kind: 'customer',
        after: 0,
        body: {
          en: 'We rebranded; the invoices should say Lumen Foods Ltd.',
          tr: 'Marka değişikliği yaptık; faturalarda Lumen Foods Ltd. yazmalı.',
        },
      },
      {
        kind: 'reply',
        author: 'agent-priya',
        after: 300,
        body: {
          en: 'You can change it under Settings → Billing → Company details. Future invoices will use the new name.',
          tr: 'Ayarlar → Faturalama → Şirket bilgileri bölümünden değiştirebilirsiniz. Sonraki faturalar yeni adı kullanır.',
        },
      },
    ],
  },
  {
    subject: {
      en: 'SSO login loops back to the sign-in page',
      tr: 'SSO girişi tekrar giriş sayfasına dönüyor',
    },
    requester: 'c-amara',
    status: 'open',
    priority: 'normal',
    channel: 'email',
    category: 'account',
    assignee: 'agent-marco',
    tags: ['sso'],
    openedAgo: 5 * 60 + 20,
    messages: [
      {
        kind: 'customer',
        after: 0,
        body: {
          en: 'After we rotated our identity provider certificate, users end up back on the sign-in page.',
          tr: 'Kimlik sağlayıcı sertifikamızı yeniledikten sonra kullanıcılar tekrar giriş sayfasına düşüyor.',
        },
      },
    ],
  },
]

function localized(value: Copy, language: Language) {
  return value[language]
}

/** The seeded queue, dated relative to now so the SLA clocks always read the same. */
export function createSeedTickets(language: Language, now = Date.now()): Ticket[] {
  const agentName = (id?: string) => agents.find((agent) => agent.id === id)?.name ?? ''
  const contactName = (id: string) => seedContacts.find((contact) => contact.id === id)?.name ?? ''

  return seeds.map((seed, index) => {
    const createdAt = new Date(now - seed.openedAgo * 60_000).toISOString()
    const messages: TicketMessage[] = seed.messages.map((message, messageIndex) => ({
      id: `m-${index}-${messageIndex}`,
      kind: message.kind,
      authorName:
        message.kind === 'customer' ? contactName(seed.requester) : agentName(message.author),
      body: localized(message.body, language),
      createdAt: addMinutes(createdAt, message.after),
      attachments: message.attachments,
    }))
    const firstReply = messages.find((message) => message.kind === 'reply')
    const last = messages.at(-1)!
    const finished = seed.status === 'resolved' || seed.status === 'closed'

    return {
      id: 1031 + index,
      subject: localized(seed.subject, language),
      requesterId: seed.requester,
      status: seed.status,
      priority: seed.priority,
      channel: seed.channel,
      category: seed.category,
      assigneeId: seed.assignee,
      tags: seed.tags,
      createdAt,
      updatedAt: last.createdAt,
      firstResponseAt: firstReply?.createdAt,
      resolvedAt: finished ? addMinutes(last.createdAt, 10) : undefined,
      ...slaDeadlines(createdAt, seed.priority),
      messages,
      activity: seedActivity(seed, index, createdAt, messages, now),
    }
  })
}

/** Whoever triages the queue; they route new tickets and raise their priority. */
const TRIAGE_AGENT_ID = 'agent-elif'

/**
 * The property changes a ticket in this state would have collected on its way here, so a
 * seeded ticket's history reads like work that happened rather than a single "opened" line:
 * routed to its agent, escalated if it is urgent, and moved to the status it is in now by
 * whoever last answered it.
 */
function seedActivity(
  seed: SeedTicket,
  index: number,
  createdAt: string,
  messages: TicketMessage[],
  now: number,
): TicketActivity[] {
  const agentName = (id?: string) => agents.find((agent) => agent.id === id)?.name ?? ''
  const triage = agentName(seed.assignee === TRIAGE_AGENT_ID ? CURRENT_AGENT_ID : TRIAGE_AGENT_ID)
  const owner = agentName(seed.assignee) || triage
  const last = messages.at(-1)!
  // Nothing is dated after the moment the queue is seeded.
  const atMost = (iso: string) => new Date(Math.min(Date.parse(iso), now)).toISOString()
  const activity: Omit<TicketActivity, 'id'>[] = [
    {
      at: createdAt,
      actorName: seedContacts.find((contact) => contact.id === seed.requester)?.name ?? '',
      kind: 'created',
    },
  ]

  if (seed.priority === 'urgent') {
    activity.push({
      at: addMinutes(createdAt, 4),
      actorName: triage,
      kind: 'priority',
      from: 'high',
      to: 'urgent',
    })
  }
  if (seed.assignee) {
    activity.push({
      at: addMinutes(createdAt, 6),
      actorName: triage,
      kind: 'assignee',
      to: seed.assignee,
    })
  }
  if (seed.status === 'pending' || seed.status === 'onHold') {
    activity.push({
      at: atMost(addMinutes(last.createdAt, 1)),
      actorName: owner,
      kind: 'status',
      from: 'open',
      to: seed.status,
    })
  }
  if (seed.status === 'resolved' || seed.status === 'closed') {
    const resolvedAt = addMinutes(last.createdAt, 10)
    activity.push({
      at: resolvedAt,
      actorName: owner,
      kind: 'status',
      from: 'open',
      to: 'resolved',
    })
    if (seed.status === 'closed') {
      activity.push({
        at: atMost(addMinutes(resolvedAt, 2 * 24 * 60)),
        actorName: owner,
        kind: 'status',
        from: 'resolved',
        to: 'closed',
      })
    }
  }

  return activity.map((entry, position) => ({ ...entry, id: `a-${index}-${position}` }))
}
