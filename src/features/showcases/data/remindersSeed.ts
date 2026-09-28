import type { GiftIdea, Localized, Reminder } from '@/features/showcases/data/reminders'

/*
 * The demo's starting list: one family's special days, a few bills, and Türkiye's public and
 * religious holidays. The religious holidays follow the lunar calendar, so they are listed by
 * date: the first day of each bayram as announced by the Presidency of Religious Affairs.
 */

const gift = (id: string, en: string, tr: string, done = false): GiftIdea => ({
  id,
  text: en,
  i18n: { en, tr },
  done,
})

const t = (en: string, tr: string): { title: string; i18n: Localized } => ({
  title: en,
  i18n: { en, tr },
})

const note = (en: string, tr: string): { note: string; noteI18n: Localized } => ({
  note: en,
  noteI18n: { en, tr },
})

const personal: Reminder[] = [
  {
    id: 'mum-birthday',
    ...t('Mum’s birthday', 'Annemin doğum günü'),
    category: 'birthday',
    date: '1962-10-09',
    repeat: 'yearly',
    countYears: true,
    offsets: [7, 1, 0],
    alarmTime: '09:00',
    contact: { name: 'Ayşe Yılmaz', phone: '+90 532 418 20 77' },
    ...note(
      'She likes a quiet breakfast with the family. Book the table at Moda for Sunday.',
      'Aile kahvaltısını seviyor. Pazar için Moda’daki masayı ayırt.',
    ),
    gifts: [
      gift('g-mum-1', 'Handmade ceramic tea set', 'El yapımı seramik çay seti'),
      gift('g-mum-2', 'Orhan Pamuk’s new novel', 'Orhan Pamuk’un yeni romanı', true),
      gift('g-mum-3', 'Spa day voucher', 'Spa günü hediye çeki'),
    ],
  },
  {
    id: 'deniz-birthday',
    ...t('Deniz’s birthday', 'Deniz’in doğum günü'),
    category: 'birthday',
    date: '1994-10-02',
    repeat: 'yearly',
    countYears: true,
    offsets: [1, 0],
    alarmTime: '08:30',
    contact: { name: 'Deniz Kaya', phone: '+90 541 902 11 35' },
    gifts: [
      gift('g-deniz-1', 'Concert tickets for two', 'İki kişilik konser bileti'),
      gift('g-deniz-2', 'Climbing gym membership', 'Tırmanış salonu üyeliği'),
    ],
  },
  {
    id: 'wedding',
    ...t('Our wedding anniversary', 'Evlilik yıl dönümümüz'),
    category: 'wedding',
    date: '2019-10-19',
    repeat: 'yearly',
    countYears: true,
    offsets: [14, 3, 0],
    alarmTime: '10:00',
    ...note(
      'Same restaurant as the first year? Ask for the table by the window.',
      'İlk yılki restoran olabilir mi? Pencere kenarındaki masayı iste.',
    ),
    gifts: [
      gift('g-wed-1', 'Dinner reservation', 'Akşam yemeği rezervasyonu'),
      gift('g-wed-2', 'Printed photo album of the year', 'Yılın fotoğraflarından baskı albüm'),
      gift('g-wed-3', 'Weekend in Cunda', 'Cunda’da hafta sonu'),
    ],
  },
  {
    id: 'work-anniversary',
    ...t('Work anniversary', 'İşe başlama yıl dönümü'),
    category: 'anniversary',
    date: '2021-10-04',
    repeat: 'yearly',
    countYears: true,
    offsets: [0],
    alarmTime: '09:30',
    gifts: [],
  },
  {
    id: 'grandad-memorial',
    ...t('Grandad’s memorial day', 'Dedemin anma günü'),
    category: 'memorial',
    date: '2015-11-21',
    repeat: 'yearly',
    countYears: true,
    offsets: [1, 0],
    alarmTime: '09:00',
    ...note(
      'Visit Zincirlikuyu with the family, then lokma for the neighbours.',
      'Aileyle Zincirlikuyu ziyareti, ardından komşulara lokma.',
    ),
    gifts: [],
  },
  {
    id: 'first-date',
    ...t('Our first date', 'İlk buluşmamız'),
    category: 'anniversary',
    date: '2016-12-03',
    repeat: 'yearly',
    countYears: true,
    offsets: [3, 0],
    alarmTime: '12:00',
    gifts: [gift('g-date-1', 'Film night at the same cinema', 'Aynı sinemada film gecesi')],
  },
  {
    id: 'emre-birthday',
    ...t('Emre’s birthday', 'Emre’nin doğum günü'),
    category: 'birthday',
    date: '1996-02-29',
    repeat: 'yearly',
    countYears: true,
    offsets: [7, 0],
    alarmTime: '09:00',
    contact: { name: 'Emre Demir' },
    ...note(
      'Born on 29 February: celebrated on the 28th in other years.',
      '29 Şubat doğumlu: diğer yıllarda 28’inde kutlanıyor.',
    ),
    gifts: [],
  },
  {
    id: 'rent',
    ...t('Rent', 'Kira ödemesi'),
    category: 'bill',
    date: '2024-01-05',
    repeat: 'monthly',
    countYears: false,
    offsets: [3, 0],
    alarmTime: '09:00',
    ...note('Transfer to the landlord’s İş Bankası account.', 'Ev sahibinin İş Bankası hesabına.'),
    gifts: [],
  },
  {
    id: 'phone-bill',
    ...t('Phone and internet bill', 'Telefon ve internet faturası'),
    category: 'bill',
    date: '2024-03-31',
    repeat: 'monthly',
    countYears: false,
    offsets: [1],
    alarmTime: '19:00',
    gifts: [],
  },
  {
    id: 'car-insurance',
    ...t('Car insurance renewal', 'Kasko yenileme'),
    category: 'bill',
    date: '2025-11-14',
    repeat: 'yearly',
    countYears: false,
    offsets: [30, 7, 0],
    alarmTime: '10:00',
    ...note('Get two quotes before renewing.', 'Yenilemeden önce iki teklif al.'),
    gifts: [],
  },
  {
    id: 'passport',
    ...t('Passport expires', 'Pasaportun süresi doluyor'),
    category: 'other',
    date: '2027-04-18',
    repeat: 'once',
    countYears: false,
    offsets: [30, 14],
    alarmTime: '09:00',
    ...note(
      'Book an appointment at the registry office; the queue takes weeks.',
      'Nüfus müdürlüğünden randevu al, sıra haftalar sürüyor.',
    ),
    gifts: [],
  },
]

/** A public holiday: no alarm by default, and the years counted from the day it marks. */
function holiday(
  id: string,
  en: string,
  tr: string,
  date: string,
  countYears: boolean,
  category: Reminder['category'] = 'holiday',
): Reminder {
  return {
    id,
    ...t(en, tr),
    category,
    date,
    repeat: 'yearly',
    countYears,
    offsets: [],
    alarmTime: '09:00',
    gifts: [],
    builtin: true,
  }
}

const holidays: Reminder[] = [
  holiday('new-year', 'New Year’s Day', 'Yılbaşı', '2000-01-01', false),
  holiday('valentines', 'Valentine’s Day', 'Sevgililer Günü', '2000-02-14', false),
  holiday(
    'national-sovereignty',
    'National Sovereignty and Children’s Day',
    'Ulusal Egemenlik ve Çocuk Bayramı',
    '1920-04-23',
    true,
  ),
  holiday('labour-day', 'Labour and Solidarity Day', 'Emek ve Dayanışma Günü', '2000-05-01', false),
  holiday(
    'youth-day',
    'Commemoration of Atatürk, Youth and Sports Day',
    'Atatürk’ü Anma, Gençlik ve Spor Bayramı',
    '1919-05-19',
    true,
  ),
  holiday(
    'democracy-day',
    'Democracy and National Unity Day',
    'Demokrasi ve Millî Birlik Günü',
    '2016-07-15',
    true,
  ),
  holiday('victory-day', 'Victory Day', 'Zafer Bayramı', '1922-08-30', true),
  {
    ...holiday('republic-day', 'Republic Day', 'Cumhuriyet Bayramı', '1923-10-29', true),
    offsets: [0],
  },
  holiday(
    'ataturk-memorial',
    'Atatürk Memorial Day',
    'Atatürk’ü Anma Günü',
    '1938-11-10',
    true,
    'memorial',
  ),
  holiday('teachers-day', 'Teachers’ Day', 'Öğretmenler Günü', '2000-11-24', false),
  {
    ...holiday('mothers-day', 'Mother’s Day', 'Anneler Günü', '2000-05-14', false),
    rule: { kind: 'nthWeekday', month: 5, weekday: 0, nth: 2 },
    offsets: [3, 0],
  },
  {
    ...holiday('fathers-day', 'Father’s Day', 'Babalar Günü', '2000-06-18', false),
    rule: { kind: 'nthWeekday', month: 6, weekday: 0, nth: 3 },
    offsets: [3, 0],
  },
  {
    ...holiday(
      'ramadan-feast',
      'Ramadan Feast',
      'Ramazan Bayramı',
      '2026-03-20',
      false,
      'religious',
    ),
    rule: { kind: 'dates', dates: ['2026-03-20', '2027-03-09'] },
    offsets: [7, 0],
  },
  {
    ...holiday(
      'sacrifice-feast',
      'Feast of Sacrifice',
      'Kurban Bayramı',
      '2026-05-27',
      false,
      'religious',
    ),
    rule: { kind: 'dates', dates: ['2026-05-27', '2027-05-16'] },
    offsets: [7, 0],
  },
]

export const seedReminders: readonly Reminder[] = [...personal, ...holidays]
