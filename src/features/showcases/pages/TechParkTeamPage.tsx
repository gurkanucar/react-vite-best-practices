import { MailOutlined, TeamOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, Row, Tag, Typography } from 'antd'
import { ShowcasePreviewFrame, TechParkSiteShell } from '@/features/showcases/components'
import {
  techParkBoard,
  techParkManagement,
  techParkMonogram,
  techParkTeamCopy,
  type TeamMember,
} from '@/features/showcases/data'
import { localize } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'

interface TechParkTeamPageProps {
  standalone?: boolean
}

/** The titles go before the name in Turkish, but they are not part of the initials. */
function initials(name: string): string {
  return techParkMonogram(name.replace(/^(Prof\.|Doç\.|Dr\.|\s)+/g, '').trim())
}

function MemberCard({ member, lead, write }: { member: TeamMember; lead: boolean; write: string }) {
  const language = usePreferencesStore((state) => state.language)

  return (
    <Card
      className={lead ? 'techpark-member techpark-member--lead' : 'techpark-member'}
      variant="borderless"
    >
      <Avatar size={lead ? 88 : 72} className="techpark-member__avatar">
        {initials(member.name)}
      </Avatar>
      <Tag color="blue" variant="filled">
        {localize(member.role, language)}
      </Tag>
      <Typography.Title level={4}>{member.name}</Typography.Title>
      <Typography.Paragraph type="secondary">
        {localize(member.affiliation, language)}
      </Typography.Paragraph>
      {member.email && (
        <Button href={`mailto:${member.email}`} icon={<MailOutlined />} type="link">
          {write}
        </Button>
      )}
    </Card>
  )
}

export function TechParkTeamPage({ standalone = false }: TechParkTeamPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = techParkTeamCopy[language]
  const rootPath = standalone ? '/preview/technopark' : '/showcases/technopark'
  const [chair, ...board] = techParkBoard

  const page = (
    <TechParkSiteShell rootPath={rootPath}>
      <section className="showcase-section techpark-about-hero">
        <Tag color="blue" variant="filled" icon={<TeamOutlined />}>
          {text.eyebrow}
        </Tag>
        <Typography.Title>{text.title}</Typography.Title>
        <Typography.Paragraph className="techpark-about-hero__description">
          {text.description}
        </Typography.Paragraph>
      </section>

      <section className="showcase-section techpark-about-section" aria-labelledby="board">
        <div className="showcase-section__heading">
          <Typography.Title level={2} id="board">
            {text.boardTitle}
          </Typography.Title>
          <Typography.Paragraph>{text.boardDescription}</Typography.Paragraph>
        </div>
        <Row gutter={[20, 20]} justify="center">
          {chair && (
            <Col xs={24} md={12} lg={8}>
              <MemberCard member={chair} lead write={text.write} />
            </Col>
          )}
        </Row>
        <Row gutter={[20, 20]} className="techpark-team__row">
          {board.map((member) => (
            <Col xs={24} sm={12} lg={6} key={member.name}>
              <MemberCard member={member} lead={false} write={text.write} />
            </Col>
          ))}
        </Row>
      </section>

      <section className="showcase-section techpark-about-section" aria-labelledby="management">
        <div className="showcase-section__heading">
          <Typography.Title level={2} id="management">
            {text.managementTitle}
          </Typography.Title>
          <Typography.Paragraph>{text.managementDescription}</Typography.Paragraph>
        </div>
        <Row gutter={[20, 20]}>
          {techParkManagement.map((member) => (
            <Col xs={24} md={8} key={member.name}>
              <MemberCard member={member} lead={false} write={text.write} />
            </Col>
          ))}
        </Row>
      </section>
    </TechParkSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/technopark/team"
      title={{ en: 'Tech park team page', tr: 'Teknopark ekip sayfası' }}
      description={{
        en: 'The board of directors and the management team, as member cards.',
        tr: 'Yönetim kurulu ve yönetim ekibi, üye kartları olarak.',
      }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
