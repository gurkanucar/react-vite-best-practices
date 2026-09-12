import { ArrowLeftOutlined, ArrowRightOutlined, MailOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, Descriptions, Flex, Row, Space, Tag, Typography } from 'antd'
import { useParams } from 'react-router'
import { PublicSiteShell, ShowcasePreviewFrame } from '@/features/showcases/components'
import {
  companySectorAccents,
  companySectorDescriptions,
  companySectorLabels,
  companySectorRoles,
  companyStageLabels,
  findCompany,
  residentCompanies,
  techParkCopy,
  techParkLinks,
  techParkMonogram,
} from '@/features/showcases/data'
import { localize } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'

interface TechParkCompanyPageProps {
  standalone?: boolean
}

/** Enough to suggest a neighbourhood without turning the page into a second directory. */
const NEIGHBOUR_LIMIT = 3

export function TechParkCompanyPage({ standalone = false }: TechParkCompanyPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = techParkCopy[language]
  const rootPath = standalone ? '/preview/technopark' : '/showcases/technopark'
  const directoryPath = `${rootPath}/companies`

  const { companySlug } = useParams()
  const company = findCompany(companySlug)

  const neighbours = company
    ? residentCompanies
        .filter((other) => other.sector === company.sector && other.slug !== company.slug)
        .slice(0, NEIGHBOUR_LIMIT)
    : []

  const body = company ? (
    <>
      <section className="showcase-section techpark-company-hero">
        <Button type="link" href={directoryPath} icon={<ArrowLeftOutlined />}>
          {text.backToDirectory}
        </Button>
        <Flex align="center" gap={20} wrap>
          <Avatar
            shape="square"
            size={72}
            className="techpark-company-hero__mark"
            style={{ backgroundColor: companySectorAccents[company.sector] }}
          >
            {techParkMonogram(company.name)}
          </Avatar>
          <Space orientation="vertical" size={4}>
            <Typography.Title>{company.name}</Typography.Title>
            <Flex gap={8} wrap>
              <Tag variant="filled">{localize(companySectorLabels[company.sector], language)}</Tag>
              <Tag variant="filled">{localize(companyStageLabels[company.stage], language)}</Tag>
              {company.hiring ? (
                <Tag color="green" variant="filled">
                  {text.hiring}
                </Tag>
              ) : null}
            </Flex>
          </Space>
        </Flex>
      </section>

      <section className="showcase-section techpark-company-detail">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={15}>
            <Card className="techpark-company-detail__card" variant="borderless">
              <Typography.Title level={3}>{text.whatTheyDo}</Typography.Title>
              <Typography.Paragraph>
                {localize(companySectorDescriptions[company.sector], language)}
              </Typography.Paragraph>
            </Card>

            <Card className="techpark-company-detail__card" variant="borderless">
              <Typography.Title level={3}>{text.openRolesTitle}</Typography.Title>
              {company.hiring ? (
                <>
                  <Typography.Paragraph>
                    {language === 'tr'
                      ? `${company.openRoles} açık pozisyon, ${company.building} binasında.`
                      : `${company.openRoles} open roles, in building ${company.building}.`}
                  </Typography.Paragraph>
                  <Typography.Text type="secondary">{text.typicalRoles}</Typography.Text>
                  <Flex gap={8} wrap className="techpark-company-detail__roles">
                    {companySectorRoles[company.sector].map((role) => (
                      <Tag key={role.en}>{localize(role, language)}</Tag>
                    ))}
                  </Flex>
                </>
              ) : (
                <Typography.Paragraph type="secondary">{text.openRolesNone}</Typography.Paragraph>
              )}
              <Button type="primary" icon={<MailOutlined />}>
                {text.contactCompany}
              </Button>
            </Card>
          </Col>

          <Col xs={24} lg={9}>
            <Card className="techpark-company-detail__card" variant="borderless">
              <Typography.Title level={4}>{text.atAGlance}</Typography.Title>
              <Descriptions
                column={1}
                size="small"
                items={[
                  {
                    key: 'sector',
                    label: text.sectorLabel,
                    children: localize(companySectorLabels[company.sector], language),
                  },
                  {
                    key: 'stage',
                    label: text.stageLabel,
                    children: localize(companyStageLabels[company.stage], language),
                  },
                  { key: 'founded', label: text.foundedLabel, children: company.founded },
                  { key: 'joined', label: text.joinedLabel, children: company.joined },
                  {
                    key: 'headcount',
                    label: text.headcountLabel,
                    children: `${company.headcount} ${text.people}`,
                  },
                  { key: 'building', label: text.buildingLabel, children: company.building },
                ]}
              />
            </Card>

            {neighbours.length > 0 ? (
              <Card className="techpark-company-detail__card" variant="borderless">
                <Typography.Title level={4}>{text.neighbours}</Typography.Title>
                <Space orientation="vertical" size={12} className="techpark-neighbours">
                  {neighbours.map((other) => (
                    <a
                      className="techpark-neighbour"
                      href={`${directoryPath}/${other.slug}`}
                      key={other.slug}
                    >
                      <Avatar
                        shape="square"
                        size={34}
                        className="techpark-strip__mark"
                        style={{ backgroundColor: companySectorAccents[other.sector] }}
                      >
                        {techParkMonogram(other.name)}
                      </Avatar>
                      <Space orientation="vertical" size={0}>
                        <Typography.Text strong>{other.name}</Typography.Text>
                        <Typography.Text type="secondary">
                          {other.headcount} {text.people}
                        </Typography.Text>
                      </Space>
                    </a>
                  ))}
                </Space>
              </Card>
            ) : null}
          </Col>
        </Row>
      </section>
    </>
  ) : (
    <section className="showcase-section techpark-company-hero">
      <Typography.Title>{text.companyNotFound}</Typography.Title>
      <Button type="link" href={directoryPath} icon={<ArrowRightOutlined />} iconPlacement="end">
        {text.backToDirectory}
      </Button>
    </section>
  )

  const page = (
    <PublicSiteShell
      brand="Aurora Tech Park"
      tagline={{ en: techParkCopy.en.tagline, tr: techParkCopy.tr.tagline }}
      className="techpark-site"
      primary="#3157d5"
      links={techParkLinks(rootPath)}
    >
      {body}
    </PublicSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={`/preview/technopark/companies/${companySlug ?? ''}`}
      title={{ en: 'Resident company profile', tr: 'Yerleşik şirket profili' }}
      description={{
        en: 'A detail route behind every row of the directory.',
        tr: 'Dizindeki her satırın arkasındaki detay sayfası.',
      }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
