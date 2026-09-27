import dayjs, { type Dayjs } from 'dayjs'
import type { Todo } from '@/features/todos/types'
import type { Language } from '@/store/preferences-store'

type Copy = Record<Language, string>

interface SeedTodo {
  title: Copy
  description?: Copy
  priority: Todo['priority']
  tags: string[]
  /** Days from today; negative is overdue. Left out for a task with no date. */
  due?: number
  done?: boolean
  /** Days ago the finished task was archived. */
  archived?: number
  subtasks?: { title: Copy; done: boolean }[]
  /** Days ago the task was written down. */
  created: number
}

const seeds: SeedTodo[] = [
  {
    title: {
      en: 'Fix login redirect loop on Safari',
      tr: "Safari'deki giriş yönlendirme döngüsünü düzelt",
    },
    description: {
      en: '<p>Users on <b>Safari 17</b> bounce between <code>/login</code> and <code>/dashboard</code> after the session cookie expires.</p><ul><li>Reproduce with a stale cookie</li><li>Check the <i>SameSite</i> attribute</li></ul>',
      tr: '<p><b>Safari 17</b> kullanıcıları oturum çerezi dolduktan sonra <code>/login</code> ile <code>/dashboard</code> arasında gidip geliyor.</p><ul><li>Eski bir çerezle tekrarla</li><li><i>SameSite</i> özelliğini kontrol et</li></ul>',
    },
    priority: 'urgent',
    tags: ['bug', 'frontend'],
    due: -1,
    created: 4,
    subtasks: [
      { title: { en: 'Reproduce', tr: 'Tekrarla' }, done: true },
      { title: { en: 'Write a failing test', tr: 'Hata veren test yaz' }, done: false },
      { title: { en: 'Ship the fix', tr: 'Düzeltmeyi yayınla' }, done: false },
    ],
  },
  {
    title: { en: 'Review the Q4 roadmap draft', tr: '4. çeyrek yol haritası taslağını incele' },
    description: {
      en: '<p>Leave comments on the <a href="https://example.com/roadmap">roadmap doc</a> before the planning meeting.</p>',
      tr: '<p>Planlama toplantısından önce <a href="https://example.com/roadmap">yol haritası belgesine</a> yorum bırak.</p>',
    },
    priority: 'high',
    tags: ['planning'],
    due: 0,
    created: 2,
  },
  {
    title: { en: 'Reply to the design feedback', tr: 'Tasarım geri bildirimine yanıt ver' },
    priority: 'medium',
    tags: ['design'],
    due: 0,
    created: 1,
  },
  {
    title: { en: 'Prepare release notes for 2.4', tr: '2.4 için sürüm notlarını hazırla' },
    description: {
      en: '<h3>Highlights</h3><ol><li>Chat with polls</li><li>Calendar drag and drop</li><li>New task list</li></ol>',
      tr: '<h3>Öne çıkanlar</h3><ol><li>Anketli sohbet</li><li>Takvimde sürükle bırak</li><li>Yeni görev listesi</li></ol>',
    },
    priority: 'high',
    tags: ['release', 'docs'],
    due: 2,
    created: 3,
    subtasks: [
      { title: { en: 'Collect merged PRs', tr: 'Birleşen PR’ları topla' }, done: true },
      { title: { en: 'Write the summary', tr: 'Özeti yaz' }, done: false },
    ],
  },
  {
    title: { en: 'Upgrade to the latest antd minor', tr: 'antd’yi son minör sürüme yükselt' },
    priority: 'low',
    tags: ['chore', 'frontend'],
    due: 6,
    created: 8,
  },
  {
    title: { en: 'Book a room for the team offsite', tr: 'Ekip buluşması için salon ayırt' },
    priority: 'medium',
    tags: ['team'],
    due: 10,
    created: 5,
  },
  {
    title: {
      en: 'Read “Designing Data-Intensive Applications”',
      tr: '“Designing Data-Intensive Applications” kitabını oku',
    },
    description: {
      en: '<p>One chapter a week. Notes go in the <u>reading</u> folder.</p>',
      tr: '<p>Haftada bir bölüm. Notlar <u>okuma</u> klasörüne.</p>',
    },
    priority: 'low',
    tags: ['learning'],
    created: 20,
  },
  {
    title: { en: 'Rotate the staging API keys', tr: 'Test ortamı API anahtarlarını yenile' },
    priority: 'urgent',
    tags: ['security', 'infra'],
    due: -3,
    created: 9,
  },
  {
    title: { en: 'Set up the CI cache', tr: 'CI önbelleğini kur' },
    priority: 'medium',
    tags: ['infra'],
    due: -2,
    done: true,
    created: 12,
  },
  {
    title: { en: 'Onboard the new designer', tr: 'Yeni tasarımcının oryantasyonunu yap' },
    priority: 'high',
    tags: ['team', 'design'],
    due: -5,
    done: true,
    created: 14,
    subtasks: [
      { title: { en: 'Accounts and access', tr: 'Hesaplar ve erişimler' }, done: true },
      {
        title: { en: 'Walk through the design system', tr: 'Tasarım sistemini anlat' },
        done: true,
      },
    ],
  },
  {
    title: { en: 'Migrate the docs site to Vite', tr: 'Doküman sitesini Vite’a taşı' },
    description: {
      en: '<p>Done in the last sprint. Build time went from <b>48s</b> to <b>6s</b>.</p>',
      tr: '<p>Geçen sprintte bitti. Derleme süresi <b>48 sn</b>’den <b>6 sn</b>’ye indi.</p>',
    },
    priority: 'medium',
    tags: ['docs', 'infra'],
    due: -18,
    done: true,
    archived: 10,
    created: 30,
  },
  {
    title: { en: 'Send the September newsletter', tr: 'Eylül bültenini gönder' },
    priority: 'low',
    tags: ['team'],
    due: -12,
    done: true,
    archived: 7,
    created: 21,
  },
]

/** The starting list, dated around `now` so it always has something overdue, due today and ahead. */
export function createSeedTodos(language: Language, now: Dayjs = dayjs()): Todo[] {
  return seeds.map((seed, index) => {
    const createdAt = now.subtract(seed.created, 'day')

    return {
      id: `seed-${index + 1}`,
      title: seed.title[language],
      description: seed.description?.[language] ?? '',
      priority: seed.priority,
      tags: seed.tags,
      dueDate: seed.due === undefined ? undefined : now.add(seed.due, 'day').format('YYYY-MM-DD'),
      done: seed.done ?? false,
      completedAt: seed.done ? now.subtract(1, 'day').toISOString() : undefined,
      archivedAt:
        seed.archived === undefined ? undefined : now.subtract(seed.archived, 'day').toISOString(),
      createdAt: createdAt.toISOString(),
      subtasks: (seed.subtasks ?? []).map((item, subIndex) => ({
        id: `seed-${index + 1}-${subIndex + 1}`,
        title: item.title[language],
        done: item.done,
      })),
    }
  })
}
