import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  Flex,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useParams } from 'react-router'
import { PublicSiteShell, ShowcasePreviewFrame } from '@/features/showcases/components'
import {
  companySectorAccents,
  companySectorLabels,
  companySectorRoles,
  companyStageLabels,
  findCompany,
  residentCompanies,
  roleLevelLabels,
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

  /*
   * Shipped products and delivered projects answer the same question — what has this team
   * actually made — so they read as one list. The discriminant is what keeps the year on the
   * entries that have one, rather than making every product carry an empty field.
   */
  const work = company
    ? [
        ...company.products.map((product) => ({ kind: 'product' as const, ...product })),
        ...company.projects.map((project) => ({ kind: 'project' as const, ...project })),
      ]
    : []

  /*
   * The company says how many people it is hiring; the sector says what the roles are. Spread
   * the count over those roles and drop the ones it does not reach, so a team with two
   * vacancies advertises two rather than three with a zero beside one of them.
   */
  const vacancies = company?.hiring
    ? companySectorRoles[company.sector]
        .map((role, index) => {
          const roleCount = companySectorRoles[company.sector].length
          const share = Math.floor(company.openRoles / roleCount)

          return { role, positions: share + (index < company.openRoles % roleCount ? 1 : 0) }
        })
        .filter((vacancy) => vacancy.positions > 0)
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
              <Typography.Title level={3}>{text.about}</Typography.Title>
              <Typography.Paragraph>{localize(company.about, language)}</Typography.Paragraph>

              <Typography.Text type="secondary">{text.expertiseTitle}</Typography.Text>
              <Flex gap={8} wrap className="techpark-company-detail__expertise">
                {company.expertise.map((area) => (
                  <Tag key={area.en}>{localize(area, language)}</Tag>
                ))}
              </Flex>
            </Card>

            <Card className="techpark-company-detail__card" variant="borderless">
              <Typography.Title level={3}>{text.workTitle}</Typography.Title>
              {work.map((entry) => (
                <div className="techpark-entry" key={entry.name}>
                  <Flex justify="space-between" align="center" gap={12} wrap>
                    <Flex align="center" gap={8} wrap>
                      <Typography.Text strong>{entry.name}</Typography.Text>
                      <Tag variant="filled">
                        {entry.kind === 'product' ? text.productLabel : text.projectLabel}
                      </Tag>
                    </Flex>
                    {/* Only a project is dated: a product is still being sold. */}
                    {entry.kind === 'project' ? (
                      <Typography.Text type="secondary">{entry.year}</Typography.Text>
                    ) : null}
                  </Flex>
                  <Typography.Text type="secondary">
                    {localize(entry.summary, language)}
                  </Typography.Text>
                </div>
              ))}
            </Card>

            <Card className="techpark-company-detail__card" variant="borderless">
              <Typography.Title level={3}>{text.openRolesTitle}</Typography.Title>
              {vacancies.length > 0 ? (
                <>
                  <Typography.Paragraph>
                    {language === 'tr'
                      ? `${company.openRoles} açık pozisyon, ${company.building} binasında.`
                      : `${company.openRoles} open roles, in building ${company.building}.`}{' '}
                    {text.openRolesLead}
                  </Typography.Paragraph>
                  <Collapse
                    className="techpark-vacancies"
                    items={vacancies.map(({ role, positions }) => ({
                      key: role.id,
                      label: (
                        <Flex justify="space-between" align="center" gap={12} wrap>
                          <Typography.Text strong>{localize(role.title, language)}</Typography.Text>
                          <Flex gap={8} wrap>
                            <Tag variant="filled">
                              {localize(roleLevelLabels[role.level], language)}
                            </Tag>
                            <Tag variant="filled">
                              {positions === 1
                                ? text.positionsOne
                                : `${positions} ${text.positionsMany}`}
                            </Tag>
                          </Flex>
                        </Flex>
                      ),
                      children: (
                        <>
                          <Typography.Paragraph>
                            {localize(role.summary, language)}
                          </Typography.Paragraph>
                          <Typography.Text type="secondary">{text.skillsLabel}</Typography.Text>
                          <Flex gap={8} wrap className="techpark-vacancy__skills">
                            {role.skills.map((skill) => (
                              <Tag key={skill.en}>{localize(skill, language)}</Tag>
                            ))}
                          </Flex>
                          {/*
                            One address per role rather than one for the company: the subject
                            line is what tells the team which posting the mail is about.
                          */}
                          <Button
                            type="primary"
                            icon={<MailOutlined />}
                            href={`mailto:${company.email}?subject=${encodeURIComponent(
                              `${localize(role.title, language)} — ${company.name}`,
                            )}`}
                          >
                            {text.applyLabel}
                          </Button>
                        </>
                      ),
                    }))}
                  />
                </>
              ) : (
                <Typography.Paragraph type="secondary">{text.openRolesNone}</Typography.Paragraph>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={9}>
            <Card className="techpark-company-detail__card" variant="borderless">
              <Typography.Title level={4}>{text.contactTitle}</Typography.Title>
              <Space orientation="vertical" size={12} className="techpark-contact">
                <a className="techpark-contact__row" href={`https://${company.website}`}>
                  <GlobalOutlined />
                  <span>
                    <Typography.Text type="secondary">{text.websiteLabel}</Typography.Text>
                    <Typography.Text strong>{company.website}</Typography.Text>
                  </span>
                </a>
                <a className="techpark-contact__row" href={`mailto:${company.email}`}>
                  <MailOutlined />
                  <span>
                    <Typography.Text type="secondary">{text.emailLabel}</Typography.Text>
                    <Typography.Text strong>{company.email}</Typography.Text>
                  </span>
                </a>
                {/* tel: strips the spaces the printed number keeps for readability. */}
                <a
                  className="techpark-contact__row"
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                >
                  <PhoneOutlined />
                  <span>
                    <Typography.Text type="secondary">{text.phoneLabel}</Typography.Text>
                    <Typography.Text strong>{company.phone}</Typography.Text>
                  </span>
                </a>
              </Space>
              <Button type="primary" icon={<MailOutlined />} href={`mailto:${company.email}`}>
                {text.contactCompany}
              </Button>
            </Card>

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
