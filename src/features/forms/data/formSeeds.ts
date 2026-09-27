import dayjs from 'dayjs'
import type {
  AnswerValue,
  FieldOption,
  FormField,
  FormResponse,
  FormSchema,
} from '@/features/forms/types'
import type { Language } from '@/store/preferences-store'

type Text = Record<Language, string>

/** Seed fields are written once with both languages and resolved when the store is created. */
type SeedField = Omit<FormField, 'label' | 'help' | 'placeholder' | 'options'> & {
  label: Text
  help?: Text
  placeholder?: Text
  options?: { id: string; label: Text }[]
}

interface SeedForm {
  id: string
  title: Text
  description: Text
  submitLabel: Text
  successMessage: Text
  status: FormSchema['status']
  /** Days ago the form was made and last changed. */
  created: number
  updated: number
  fields: SeedField[]
}

const option = (id: string, en: string, tr: string) => ({ id, label: { en, tr } })

const seedForms: SeedForm[] = [
  {
    id: 'demo-day-registration',
    title: { en: 'Demo Day 2026 registration', tr: 'Demo Day 2026 kaydı' },
    description: {
      en: 'Join twelve campus start-ups on stage on 14 November. Seats are limited, so register by 7 November.',
      tr: '14 Kasım’da on iki kampüs girişimini sahnede izleyin. Yer sınırlı, 7 Kasım’a kadar kayıt olun.',
    },
    submitLabel: { en: 'Register', tr: 'Kayıt ol' },
    successMessage: {
      en: 'You are on the list. We will email your ticket a week before the event.',
      tr: 'Listedesiniz. Biletinizi etkinlikten bir hafta önce e-postayla göndereceğiz.',
    },
    status: 'published',
    created: 24,
    updated: 3,
    fields: [
      {
        id: 'name',
        type: 'shortText',
        label: { en: 'Full name', tr: 'Ad soyad' },
        required: true,
        maxLength: 80,
      },
      {
        id: 'email',
        type: 'email',
        label: { en: 'Email', tr: 'E-posta' },
        placeholder: { en: 'you@company.example', tr: 'siz@sirket.example' },
        required: true,
      },
      {
        id: 'company',
        type: 'shortText',
        label: { en: 'Company or university', tr: 'Şirket veya üniversite' },
        required: false,
      },
      {
        id: 'role',
        type: 'dropdown',
        label: { en: 'What describes you best?', tr: 'Sizi en iyi ne tanımlar?' },
        required: true,
        options: [
          option('founder', 'Founder', 'Kurucu'),
          option('engineer', 'Engineer', 'Mühendis'),
          option('investor', 'Investor', 'Yatırımcı'),
          option('student', 'Student', 'Öğrenci'),
          option('other', 'Other', 'Diğer'),
        ],
      },
      {
        id: 'attendance',
        type: 'singleChoice',
        label: { en: 'How will you attend?', tr: 'Nasıl katılacaksınız?' },
        required: true,
        options: [
          option('in-person', 'In person, on campus', 'Kampüste, yüz yüze'),
          option('online', 'Online stream', 'Canlı yayından'),
        ],
      },
      {
        id: 'diet',
        type: 'multipleChoice',
        label: { en: 'Dietary requirements', tr: 'Beslenme tercihleri' },
        help: {
          en: 'Lunch is served after the pitches.',
          tr: 'Sunumlardan sonra öğle yemeği var.',
        },
        required: false,
        options: [
          option('vegetarian', 'Vegetarian', 'Vejetaryen'),
          option('vegan', 'Vegan', 'Vegan'),
          option('gluten-free', 'Gluten-free', 'Glütensiz'),
        ],
        visibleWhen: { fieldId: 'attendance', equals: 'in-person' },
      },
      {
        id: 'consent-section',
        type: 'section',
        label: { en: 'Keeping in touch', tr: 'İletişimde kalalım' },
        required: false,
      },
      {
        id: 'newsletter',
        type: 'yesNo',
        label: {
          en: 'Send me the monthly campus newsletter',
          tr: 'Aylık kampüs bültenini bana gönderin',
        },
        required: false,
      },
    ],
  },
  {
    id: 'customer-feedback',
    title: { en: 'Customer feedback', tr: 'Müşteri geri bildirimi' },
    description: {
      en: 'Two minutes, five questions. It tells us what to fix next.',
      tr: 'İki dakika, beş soru. Sırada neyi düzelteceğimizi bize bu söylüyor.',
    },
    submitLabel: { en: 'Send feedback', tr: 'Geri bildirimi gönder' },
    successMessage: {
      en: 'Thank you. Every answer is read by the product team.',
      tr: 'Teşekkürler. Her yanıtı ürün ekibi okuyor.',
    },
    status: 'published',
    created: 60,
    updated: 12,
    fields: [
      {
        id: 'nps',
        type: 'nps',
        label: {
          en: 'How likely are you to recommend us to a colleague?',
          tr: 'Bizi bir iş arkadaşınıza tavsiye etme olasılığınız nedir?',
        },
        required: true,
      },
      {
        id: 'satisfaction',
        type: 'rating',
        label: {
          en: 'Overall, how satisfied are you?',
          tr: 'Genel olarak ne kadar memnunsunuz?',
        },
        required: true,
        max: 5,
      },
      {
        id: 'liked',
        type: 'longText',
        label: { en: 'What works well for you?', tr: 'Sizin için ne iyi çalışıyor?' },
        required: false,
        maxLength: 1000,
      },
      {
        id: 'improve',
        type: 'longText',
        label: { en: 'What should we improve?', tr: 'Neyi geliştirmeliyiz?' },
        required: false,
        maxLength: 1000,
      },
      {
        id: 'contact-ok',
        type: 'yesNo',
        label: {
          en: 'May we contact you about your answers?',
          tr: 'Yanıtlarınız hakkında sizinle iletişime geçebilir miyiz?',
        },
        required: false,
      },
      {
        id: 'contact-email',
        type: 'email',
        label: { en: 'Your email', tr: 'E-postanız' },
        required: true,
        visibleWhen: { fieldId: 'contact-ok', equals: 'yes' },
      },
    ],
  },
  {
    id: 'frontend-application',
    title: { en: 'Frontend engineer application', tr: 'Frontend mühendisi başvurusu' },
    description: {
      en: 'Tell us about your work. We reply to every application within ten working days.',
      tr: 'Bize işinizden bahsedin. Her başvuruya on iş günü içinde dönüyoruz.',
    },
    submitLabel: { en: 'Apply', tr: 'Başvur' },
    successMessage: {
      en: 'Application received. You will hear from us within ten working days.',
      tr: 'Başvurunuz alındı. On iş günü içinde sizden haber alacağız.',
    },
    status: 'draft',
    created: 6,
    updated: 1,
    fields: [
      {
        id: 'name',
        type: 'shortText',
        label: { en: 'Full name', tr: 'Ad soyad' },
        required: true,
      },
      { id: 'email', type: 'email', label: { en: 'Email', tr: 'E-posta' }, required: true },
      { id: 'phone', type: 'phone', label: { en: 'Phone', tr: 'Telefon' }, required: false },
      {
        id: 'portfolio',
        type: 'shortText',
        label: { en: 'Portfolio or GitHub link', tr: 'Portfolyo veya GitHub bağlantısı' },
        placeholder: { en: 'https://', tr: 'https://' },
        required: false,
      },
      {
        id: 'experience',
        type: 'number',
        label: { en: 'Years of experience', tr: 'Deneyim yılı' },
        required: true,
        min: 0,
        max: 40,
      },
      {
        id: 'start',
        type: 'date',
        label: { en: 'Earliest start date', tr: 'En erken başlama tarihi' },
        required: false,
      },
      {
        id: 'cv',
        type: 'file',
        label: { en: 'CV', tr: 'Özgeçmiş' },
        help: { en: 'PDF, up to 5 MB.', tr: 'PDF, en fazla 5 MB.' },
        required: true,
      },
      {
        id: 'motivation',
        type: 'longText',
        label: { en: 'Why this role?', tr: 'Neden bu pozisyon?' },
        required: true,
        minLength: 50,
        maxLength: 1500,
      },
    ],
  },
  {
    id: 'equipment-request',
    title: { en: 'IT equipment request', tr: 'BT ekipman talebi' },
    description: {
      en: 'Requests for the autumn batch closed on 15 September.',
      tr: 'Sonbahar dönemi talepleri 15 Eylül’de kapandı.',
    },
    submitLabel: { en: 'Send request', tr: 'Talebi gönder' },
    successMessage: {
      en: 'Request sent to the IT desk.',
      tr: 'Talep BT masasına gönderildi.',
    },
    status: 'closed',
    created: 45,
    updated: 12,
    fields: [
      {
        id: 'name',
        type: 'shortText',
        label: { en: 'Your name', tr: 'Adınız' },
        required: true,
      },
      {
        id: 'department',
        type: 'dropdown',
        label: { en: 'Department', tr: 'Departman' },
        required: true,
        options: [
          option('engineering', 'Engineering', 'Mühendislik'),
          option('design', 'Design', 'Tasarım'),
          option('sales', 'Sales', 'Satış'),
          option('operations', 'Operations', 'Operasyon'),
        ],
      },
      {
        id: 'equipment',
        type: 'singleChoice',
        label: { en: 'What do you need?', tr: 'Neye ihtiyacınız var?' },
        required: true,
        options: [
          option('laptop', 'Laptop', 'Dizüstü bilgisayar'),
          option('monitor', 'Monitor', 'Monitör'),
          option('headset', 'Headset', 'Kulaklık'),
        ],
      },
      {
        id: 'os',
        type: 'singleChoice',
        label: { en: 'Operating system', tr: 'İşletim sistemi' },
        required: true,
        options: [
          option('macos', 'macOS', 'macOS'),
          option('windows', 'Windows', 'Windows'),
          option('linux', 'Linux', 'Linux'),
        ],
        visibleWhen: { fieldId: 'equipment', equals: 'laptop' },
      },
      {
        id: 'needed-by',
        type: 'date',
        label: { en: 'Needed by', tr: 'Şu tarihe kadar' },
        required: false,
      },
      {
        id: 'reason',
        type: 'longText',
        label: { en: 'Why do you need it?', tr: 'Neden ihtiyacınız var?' },
        required: false,
      },
    ],
  },
]

/** Answers written as `[daysAgo, answers]`, text in both languages where it is prose. */
type SeedAnswers = Record<string, AnswerValue | Text>
const seedResponses: Record<string, [number, SeedAnswers][]> = {
  'demo-day-registration': [
    [
      1,
      {
        name: 'Elif Aydın',
        email: 'elif@brightloop.example',
        company: 'Brightloop',
        role: 'founder',
        attendance: 'in-person',
        diet: ['vegetarian'],
        newsletter: true,
      },
    ],
    [
      1,
      {
        name: 'Can Demir',
        email: 'can.demir@aurora-uni.example',
        company: 'Aurora University',
        role: 'student',
        attendance: 'in-person',
        diet: [],
        newsletter: true,
      },
    ],
    [
      2,
      {
        name: 'Maya Chen',
        email: 'maya@northwind.example',
        company: 'Northwind Capital',
        role: 'investor',
        attendance: 'online',
        newsletter: false,
      },
    ],
    [
      3,
      {
        name: 'Noah Williams',
        email: 'noah@stackforge.example',
        company: 'Stackforge',
        role: 'engineer',
        attendance: 'in-person',
        diet: ['vegan', 'gluten-free'],
        newsletter: false,
      },
    ],
    [
      4,
      {
        name: 'Zeynep Kaya',
        email: 'zeynep@sensorlab.example',
        company: 'Sensorlab',
        role: 'founder',
        attendance: 'in-person',
        diet: [],
        newsletter: true,
      },
    ],
    [
      5,
      {
        name: 'Ava Patel',
        email: 'ava@fieldnote.example',
        company: '',
        role: 'other',
        attendance: 'online',
        newsletter: true,
      },
    ],
    [
      6,
      {
        name: 'Mert Yılmaz',
        email: 'mert@kiln.example',
        company: 'Kiln Robotics',
        role: 'engineer',
        attendance: 'in-person',
        diet: ['vegetarian'],
        newsletter: false,
      },
    ],
    [
      8,
      {
        name: 'Selin Öz',
        email: 'selin@aurora-uni.example',
        company: 'Aurora University',
        role: 'student',
        attendance: 'online',
        newsletter: true,
      },
    ],
  ],
  'customer-feedback': [
    [
      0,
      {
        nps: 10,
        satisfaction: 5,
        liked: {
          en: 'Setting up a new workspace took five minutes.',
          tr: 'Yeni çalışma alanını kurmak beş dakika sürdü.',
        },
        improve: { en: 'A dark mode for the mobile app.', tr: 'Mobil uygulama için karanlık mod.' },
        'contact-ok': true,
        'contact-email': 'deniz@harbor.example',
      },
    ],
    [
      1,
      {
        nps: 9,
        satisfaction: 4,
        liked: { en: 'The search is fast.', tr: 'Arama hızlı.' },
        'contact-ok': false,
      },
    ],
    [
      2,
      {
        nps: 7,
        satisfaction: 4,
        improve: {
          en: 'Exports should keep the column order.',
          tr: 'Dışa aktarma sütun sırasını korumalı.',
        },
        'contact-ok': false,
      },
    ],
    [
      3,
      {
        nps: 4,
        satisfaction: 2,
        improve: { en: 'Invoices arrive late every month.', tr: 'Faturalar her ay geç geliyor.' },
        'contact-ok': true,
        'contact-email': 'finance@lumen.example',
      },
    ],
    [
      4,
      {
        nps: 8,
        satisfaction: 4,
        liked: {
          en: 'Support answers within the hour.',
          tr: 'Destek bir saat içinde yanıt veriyor.',
        },
        'contact-ok': false,
      },
    ],
    [
      5,
      {
        nps: 10,
        satisfaction: 5,
        liked: { en: 'The reports.', tr: 'Raporlar.' },
        'contact-ok': false,
      },
    ],
    [
      7,
      {
        nps: 6,
        satisfaction: 3,
        improve: { en: 'Too many emails.', tr: 'Çok fazla e-posta.' },
        'contact-ok': false,
      },
    ],
    [9, { nps: 9, satisfaction: 5, 'contact-ok': false }],
    [
      11,
      {
        nps: 3,
        satisfaction: 2,
        improve: {
          en: 'The calendar sync breaks with Outlook.',
          tr: 'Takvim senkronizasyonu Outlook ile bozuluyor.',
        },
        'contact-ok': true,
        'contact-email': 'it@quarry.example',
      },
    ],
    [13, { nps: 9, satisfaction: 4, 'contact-ok': false }],
  ],
  'equipment-request': [
    [
      14,
      {
        name: 'Burak Şahin',
        department: 'engineering',
        equipment: 'laptop',
        os: 'linux',
        'needed-by': '2026-10-01',
        reason: { en: 'My current laptop is five years old.', tr: 'Şu anki dizüstüm beş yaşında.' },
      },
    ],
    [
      15,
      { name: 'Ece Arslan', department: 'design', equipment: 'monitor', 'needed-by': '2026-09-30' },
    ],
    [16, { name: 'Ali Koç', department: 'sales', equipment: 'headset' }],
    [18, { name: 'Irmak Tan', department: 'engineering', equipment: 'laptop', os: 'macos' }],
  ],
}

function resolveText<T>(value: T | Text | undefined, language: Language): T | string | undefined {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'en' in value) {
    return (value as Text)[language]
  }
  return value as T | undefined
}

export function createSeedForms(language: Language): FormSchema[] {
  const now = dayjs()

  return seedForms.map((seed) => ({
    id: seed.id,
    title: seed.title[language],
    description: seed.description[language],
    submitLabel: seed.submitLabel[language],
    successMessage: seed.successMessage[language],
    status: seed.status,
    createdAt: now.subtract(seed.created, 'day').toISOString(),
    updatedAt: now.subtract(seed.updated, 'day').toISOString(),
    fields: seed.fields.map(({ label, help, placeholder, options, ...field }): FormField => ({
      ...field,
      label: label[language],
      help: help?.[language],
      placeholder: placeholder?.[language],
      options: options?.map((entry): FieldOption => ({
        id: entry.id,
        label: entry.label[language],
      })),
    })),
  }))
}

/** Spread over the working day, so responses from one day do not share a timestamp. */
function spreadOverDay(now: dayjs.Dayjs, daysAgo: number, index: number): string {
  const stamp = now
    .subtract(daysAgo, 'day')
    .hour(9 + ((index * 3) % 9))
    .minute((index * 17) % 60)

  // Today's slots later than now would be answers from the future.
  return (stamp.isAfter(now) ? now.subtract(index + 1, 'minute') : stamp).toISOString()
}

export function createSeedResponses(language: Language): FormResponse[] {
  const now = dayjs()

  return Object.entries(seedResponses).flatMap(([formId, entries]) =>
    entries.map(([daysAgo, answers], index) => ({
      id: `${formId}-response-${index + 1}`,
      formId,
      submittedAt: spreadOverDay(now, daysAgo, index),
      answers: Object.fromEntries(
        Object.entries(answers).map(([key, value]) => [
          key,
          resolveText(value, language) as AnswerValue,
        ]),
      ),
    })),
  )
}
