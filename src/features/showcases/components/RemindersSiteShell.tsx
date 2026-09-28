import { Flex, Space, Typography } from 'antd'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { RemindersAlarmHost } from '@/features/showcases/components/RemindersAlarmHost'
import { ShowcasePreviewFrame } from '@/features/showcases/components/ShowcasePreviewFrame'
import { remindersRoot } from '@/features/showcases/data/reminders'
import { remindersCopy } from '@/features/showcases/data/remindersCopy'
import { useRemindersCopy } from '@/features/showcases/hooks/useRemindersCopy'
import '../showcases.css'
import '../reminders.css'

interface RemindersSiteShellProps {
  children: ReactNode
  standalone: boolean
  page: 'home' | 'calendar' | 'detail'
}

const sections = ['', '/calendar']

/** Every page of Anlar: the header, the footer and the alarms, inside the admin's frame. */
export function RemindersSiteShell({ children, standalone, page }: RemindersSiteShellProps) {
  const { text, language } = useRemindersCopy()
  const { pathname, search } = useLocation()
  const root = remindersRoot(standalone)
  const links = sections.map((path, index) => ({
    href: `${root}${path}`,
    label: { en: remindersCopy.en.nav[index] ?? '', tr: remindersCopy.tr.nav[index] ?? '' },
  }))

  const footer = (
    <Flex justify="space-between" align="center" gap={16} wrap>
      <Space orientation="vertical" size={0}>
        <Typography.Text strong>{text.brand}</Typography.Text>
        <Typography.Text type="secondary">{text.footerNote}</Typography.Text>
      </Space>
      <nav aria-label={text.brand} className="reminders-footer__links">
        {links.map((link) => (
          <Link key={link.href} to={link.href}>
            {link.label[language]}
          </Link>
        ))}
      </nav>
    </Flex>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={`${pathname.replace('/showcases/reminders', '/preview/reminders')}${search}`}
      title={{ en: remindersCopy.en.preview[page].title, tr: remindersCopy.tr.preview[page].title }}
      description={{
        en: remindersCopy.en.preview[page].description,
        tr: remindersCopy.tr.preview[page].description,
      }}
    >
      <PublicSiteShell
        brand={text.brand}
        tagline={{ en: remindersCopy.en.tagline, tr: remindersCopy.tr.tagline }}
        className="reminders-site"
        primary="#b4235a"
        homeHref={root}
        links={links}
        footer={footer}
      >
        <RemindersAlarmHost root={root} />
        {children}
      </PublicSiteShell>
    </ShowcasePreviewFrame>
  )
}
