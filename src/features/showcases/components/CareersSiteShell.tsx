import {
  FileTextOutlined,
  IdcardOutlined,
  PlusOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Col, Divider, Flex, Row, Segmented, Space, Typography } from 'antd'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { ShowcasePreviewFrame } from '@/features/showcases/components/ShowcasePreviewFrame'
import { careersBrand, careersRoot } from '@/features/showcases/data/careers'
import { careersCopy } from '@/features/showcases/data/careersCopy'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import '../showcases.css'
import '../careers.css'

interface CareersSiteShellProps {
  children: ReactNode
  standalone: boolean
}

function CareersFooter() {
  const { text } = useCareersCopy()
  return (
    <div className="careers-footer">
      <Row gutter={[32, 28]}>
        <Col xs={24} lg={9}>
          <Space orientation="vertical" size={10}>
            <Typography.Text strong className="careers-footer__brand">
              {careersBrand}
            </Typography.Text>
            <Typography.Text type="secondary">{text.footer.about}</Typography.Text>
          </Space>
        </Col>
        {text.footer.columns.map(([title, links]) => (
          <Col xs={12} md={8} lg={5} key={title}>
            <Typography.Title level={5}>{title}</Typography.Title>
            <ul className="careers-footer__links">
              {links.map((link) => (
                <li key={link}>
                  <Typography.Text type="secondary">{link}</Typography.Text>
                </li>
              ))}
            </ul>
          </Col>
        ))}
      </Row>
      <Divider />
      <Typography.Text type="secondary">
        © 2026 {careersBrand}. {text.footer.rights}
      </Typography.Text>
    </div>
  )
}

/**
 * Candidate and employer are the same site seen from two sides; there is no sign-in. The
 * bar switches sides and holds each side's own pages, which keeps the header short.
 */
function ModeBar({ root }: { root: string }) {
  const { text } = useCareersCopy()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const employer = pathname.startsWith(`${root}/employer`)
  const link = (path: string, label: string, icon: ReactNode) => {
    const href = `${root}${path}`
    const current = pathname === href
    return (
      <Link
        to={href}
        className={`careers-modebar__link${current ? ' is-active' : ''}`}
        aria-current={current ? 'page' : undefined}
      >
        {icon} {label}
      </Link>
    )
  }
  return (
    <div className={`careers-modebar${employer ? ' is-employer' : ''}`}>
      <Flex className="careers-modebar__inner" justify="space-between" align="center" gap={8} wrap>
        <Segmented<'candidate' | 'employer'>
          size="small"
          aria-label={text.employer.switchLabel}
          value={employer ? 'employer' : 'candidate'}
          onChange={(mode) => void navigate(mode === 'employer' ? `${root}/employer` : root)}
          options={[
            { value: 'candidate', label: text.employer.candidate, icon: <UserOutlined /> },
            { value: 'employer', label: text.employer.employer, icon: <SolutionOutlined /> },
          ]}
        />
        <nav
          className="careers-modebar__nav"
          aria-label={employer ? text.employer.employer : text.employer.candidate}
        >
          {employer ? (
            link('/employer/new', text.employer.postJob, <PlusOutlined aria-hidden="true" />)
          ) : (
            <>
              {link(
                '/applications',
                text.nav.applications,
                <FileTextOutlined aria-hidden="true" />,
              )}
              {link('/profile', text.nav.profile, <IdcardOutlined aria-hidden="true" />)}
            </>
          )}
        </nav>
      </Flex>
    </div>
  )
}

/**
 * The job site's frame. Inside the admin it sits in the preview frame, whose "open in a new
 * tab" keeps the page and its search.
 */
export function CareersSiteShell({ children, standalone }: CareersSiteShellProps) {
  const root = careersRoot(standalone)
  const { pathname, search } = useLocation()
  const previewPath = `${pathname.replace(careersRoot(false), careersRoot(true))}${search}`
  const nav = (key: keyof typeof careersCopy.en.nav, path: string) => ({
    href: `${root}${path}`,
    label: { en: careersCopy.en.nav[key], tr: careersCopy.tr.nav[key] },
  })

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={previewPath}
      title={{ en: careersCopy.en.frame.title, tr: careersCopy.tr.frame.title }}
      description={{ en: careersCopy.en.frame.description, tr: careersCopy.tr.frame.description }}
    >
      <PublicSiteShell
        brand={careersBrand}
        tagline={{ en: careersCopy.en.tagline, tr: careersCopy.tr.tagline }}
        className="careers-site"
        primary="#1f5eff"
        homeHref={root}
        links={[nav('jobs', '/jobs'), nav('companies', '/companies'), nav('employer', '/employer')]}
        footer={<CareersFooter />}
      >
        <ModeBar root={root} />
        <div className="careers-page">{children}</div>
      </PublicSiteShell>
    </ShowcasePreviewFrame>
  )
}
