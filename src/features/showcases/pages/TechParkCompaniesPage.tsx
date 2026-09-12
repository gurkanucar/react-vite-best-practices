import { ArrowLeftOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, Divider, Flex, Row, Select, Space, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { PublicSiteShell, ShowcasePreviewFrame } from '@/features/showcases/components'
import {
  companySectorAccents,
  companySectorLabels,
  companyStageLabels,
  residentCompanies,
  techParkCopy,
  techParkLinks,
  techParkMonogram,
} from '@/features/showcases/data'
import { useInfiniteList } from '@/features/showcases/hooks'
import { localize, type CompanySector } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'

interface TechParkCompaniesPageProps {
  standalone?: boolean
}

/** Nine fills three rows on a wide screen, which is a page a reader notices arriving. */
const PAGE_SIZE = 9

export function TechParkCompaniesPage({ standalone = false }: TechParkCompaniesPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = techParkCopy[language]
  const rootPath = standalone ? '/preview/technopark' : '/showcases/technopark'

  const [sector, setSector] = useState<CompanySector | undefined>()
  // Memoised because the infinite list treats a new array as a new result set and starts over.
  const filtered = useMemo(
    () =>
      sector ? residentCompanies.filter((company) => company.sector === sector) : residentCompanies,
    [sector],
  )
  const { visible, hasMore, loadMore, sentinelRef } = useInfiniteList(filtered, PAGE_SIZE)

  const shownLabel =
    language === 'tr'
      ? `${filtered.length} şirketten ${visible.length} tanesi gösteriliyor`
      : `Showing ${visible.length} of ${filtered.length} companies`

  const sectorOptions = Object.entries(companySectorLabels)
    .map(([value, label]) => ({ value, label: localize(label, language) }))
    .sort((first, second) => first.label.localeCompare(second.label, language))

  const page = (
    <PublicSiteShell
      brand="Aurora Tech Park"
      tagline={{ en: techParkCopy.en.tagline, tr: techParkCopy.tr.tagline }}
      className="techpark-site"
      primary="#3157d5"
      links={techParkLinks(rootPath)}
    >
      <section className="showcase-section techpark-directory-hero">
        <Button type="link" href={rootPath} icon={<ArrowLeftOutlined />}>
          {text.backToCampus}
        </Button>
        <Typography.Title>{text.directoryTitle}</Typography.Title>
        <Typography.Paragraph>{text.directoryDescription}</Typography.Paragraph>
      </section>

      <section className="showcase-section techpark-companies">
        <Flex justify="space-between" align="center" gap={16} wrap>
          <Typography.Text type="secondary" aria-live="polite">
            {shownLabel}
          </Typography.Text>
          <Select
            className="techpark-companies__filter"
            allowClear
            value={sector}
            onChange={(value?: CompanySector) => setSector(value)}
            options={sectorOptions}
            placeholder={text.sectorFilter}
            aria-label={text.sectorFilter}
          />
        </Flex>

        <Row gutter={[20, 20]}>
          {visible.map((company) => (
            <Col xs={24} sm={12} lg={8} key={company.name}>
              <Card className="techpark-company" variant="borderless">
                <a
                  className="techpark-company__link"
                  href={`${rootPath}/companies/${company.slug}`}
                  aria-label={company.name}
                >
                  <Flex align="center" gap={12}>
                    <Avatar
                      shape="square"
                      size={46}
                      className="techpark-company__mark"
                      style={{ backgroundColor: companySectorAccents[company.sector] }}
                    >
                      {techParkMonogram(company.name)}
                    </Avatar>
                    <Space orientation="vertical" size={0}>
                      <Typography.Text strong>{company.name}</Typography.Text>
                      <Typography.Text type="secondary">
                        {localize(companySectorLabels[company.sector], language)}
                      </Typography.Text>
                    </Space>
                  </Flex>
                </a>
                <Flex gap={8} wrap className="techpark-company__tags">
                  <Tag variant="filled">
                    {localize(companyStageLabels[company.stage], language)}
                  </Tag>
                  {company.hiring ? (
                    <Tag color="green" variant="filled">
                      {text.hiring}
                    </Tag>
                  ) : null}
                </Flex>
                <Divider />
                <Flex justify="space-between" gap={8}>
                  <Typography.Text type="secondary">
                    {text.founded} {company.founded}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {company.headcount} {text.people}
                  </Typography.Text>
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>

        <Flex className="techpark-companies__foot" orientation="vertical" align="center" gap={8}>
          {hasMore ? (
            <Button ref={sentinelRef} size="large" onClick={loadMore}>
              {text.loadMore}
            </Button>
          ) : (
            <Typography.Text type="secondary">{text.allShown}</Typography.Text>
          )}
        </Flex>
      </section>
    </PublicSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/technopark/companies"
      title={{ en: 'Resident company directory', tr: 'Yerleşik şirket dizini' }}
      description={{
        en: 'A long list paged by scroll position rather than by a page number.',
        tr: 'Sayfa numarası yerine kaydırma konumuyla sayfalanan uzun bir liste.',
      }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
