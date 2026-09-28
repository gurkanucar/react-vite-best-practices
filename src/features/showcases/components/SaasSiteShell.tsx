import { GithubOutlined, LinkedinOutlined, XOutlined, YoutubeOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Flex, Row, Space, Typography } from 'antd'
import type { ReactNode } from 'react'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { saasCopy, saasRoot } from '@/features/showcases/data/saas'
import { usePreferencesStore } from '@/store/preferences-store'

interface SaasSiteShellProps {
  children: ReactNode
  standalone: boolean
}

const socials = [
  { label: 'GitHub', icon: <GithubOutlined /> },
  { label: 'LinkedIn', icon: <LinkedinOutlined /> },
  { label: 'X', icon: <XOutlined /> },
  { label: 'YouTube', icon: <YoutubeOutlined /> },
]

export function SaasSiteShell({ children, standalone }: SaasSiteShellProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = saasCopy[language]
  const root = saasRoot(standalone)
  const paths = [root, `${root}#saas-features`, `${root}#saas-customers`, `${root}/pricing`]
  // A demo site has no pages behind most footer links; each column leads to its nearest section.
  const columnTargets = [`${root}#saas-features`, `${root}#saas-customers`, `${root}/pricing`]

  const footer = (
    <div className="saas-footer">
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={9}>
          <Space orientation="vertical" size={12}>
            <Typography.Text strong className="saas-footer__brand">
              Pulseboard
            </Typography.Text>
            <Typography.Text type="secondary">{text.footer.about}</Typography.Text>
            <Space size={4}>
              {socials.map((social) => (
                <Button
                  key={social.label}
                  type="text"
                  icon={social.icon}
                  aria-label={social.label}
                  href="#"
                />
              ))}
            </Space>
          </Space>
        </Col>
        {text.footer.columns.map(([title, links], column) => (
          <Col xs={12} md={8} lg={5} key={title}>
            <Typography.Title level={5}>{title}</Typography.Title>
            <ul className="saas-footer__links">
              {links.map((link) => (
                <li key={link}>
                  <a href={columnTargets[column] ?? root}>{link}</a>
                </li>
              ))}
            </ul>
          </Col>
        ))}
      </Row>
      <Divider />
      <Flex justify="space-between" align="center" gap={16} wrap>
        <Typography.Text type="secondary">
          © 2026 Pulseboard, Inc. {text.footer.rights}
        </Typography.Text>
        <Space size={16} wrap>
          {text.footer.legal.map((link) => (
            <Typography.Text key={link} type="secondary">
              {link}
            </Typography.Text>
          ))}
        </Space>
      </Flex>
    </div>
  )

  return (
    <PublicSiteShell
      brand="Pulseboard"
      tagline={{ en: saasCopy.en.tagline, tr: saasCopy.tr.tagline }}
      className="saas-site"
      primary="#5b4ce6"
      homeHref={root}
      footer={footer}
      links={paths.map((href, index) => ({
        href,
        label: { en: saasCopy.en.nav[index] ?? '', tr: saasCopy.tr.nav[index] ?? '' },
      }))}
    >
      {children}
    </PublicSiteShell>
  )
}
