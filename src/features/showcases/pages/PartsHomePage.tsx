import {
  ArrowRightOutlined,
  CarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  RollbackOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Flex, Row, Tag, Typography } from 'antd'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import { PartCard, PartVisual } from '@/features/showcases/components/PartsBits'
import { VehiclePicker } from '@/features/showcases/components/PartsGarage'
import { PartsSiteShell } from '@/features/showcases/components/PartsSiteShell'
import {
  brands,
  categoryCounts,
  categoryIds,
  categoryNames,
  discountPercent,
  fitFor,
  partsCatalog,
  totalStock,
} from '@/features/showcases/data/partsCatalog'
import { partsRoot } from '@/features/showcases/data/partsCopy'
import { vehicleName } from '@/features/showcases/data/partsVehicles'
import { usePartsCopy } from '@/features/showcases/hooks/usePartsCopy'
import { useActiveVehicle, usePartsStore } from '@/features/showcases/hooks/usePartsStore'

interface PartsHomePageProps {
  standalone?: boolean
}

/** A real number from the catalogue, so the example search always finds something. */
const exampleOem = partsCatalog.find((part) => part.oem.length > 0)?.oem[0]?.number ?? ''

const serviceIcons = [
  <ClockCircleOutlined key="clock" />,
  <SafetyCertificateOutlined key="fit" />,
  <EnvironmentOutlined key="warehouses" />,
  <RollbackOutlined key="returns" />,
]

export function PartsHomePage({ standalone = false }: PartsHomePageProps) {
  const { text, language } = usePartsCopy()
  const navigate = useNavigate()
  const root = partsRoot(standalone)
  const vehicle = useActiveVehicle()
  const openGarage = usePartsStore((state) => state.openGarage)
  const counts = useMemo(() => categoryCounts(vehicle), [vehicle])

  // Marked-down parts in stock; the ones for the selected car before the rest.
  const deals = useMemo(
    () =>
      partsCatalog
        .filter((part) => part.compareAt && totalStock(part) > 0)
        .filter((part) => !vehicle || fitFor(part, vehicle) !== 'doesNotFit')
        .sort(
          (a, b) =>
            Number(fitFor(b, vehicle) === 'fits') - Number(fitFor(a, vehicle) === 'fits') ||
            discountPercent(b) - discountPercent(a),
        )
        .slice(0, 4),
    [vehicle],
  )

  return (
    <PartsSiteShell standalone={standalone}>
      <section className="parts-hero">
        <div className="parts-hero__inner">
          <div className="parts-hero__copy">
            <Tag variant="filled" className="parts-hero__eyebrow">
              {text.home.eyebrow}
            </Tag>
            <Typography.Title>{text.home.title}</Typography.Title>
            <Typography.Paragraph className="parts-hero__lead">
              {text.home.description}
            </Typography.Paragraph>
            <dl className="parts-hero__stats">
              {text.home.stats.map(([value, label]) => (
                <div key={label}>
                  <dt>{value}</dt>
                  <dd>{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Card className="parts-hero__picker" variant="borderless">
            <Typography.Title level={3}>
              <CarOutlined aria-hidden="true" /> {text.home.pickerTitle}
            </Typography.Title>
            {vehicle && (
              <Flex
                align="center"
                justify="space-between"
                gap={8}
                wrap
                className="parts-hero__current"
              >
                <Typography.Text strong>{vehicleName(vehicle)}</Typography.Text>
                <Button
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  iconPlacement="end"
                  onClick={() => void navigate(`${root}/catalog`)}
                >
                  {text.garage.find}
                </Button>
              </Flex>
            )}
            <VehiclePicker
              submitLabel={text.garage.find}
              onPicked={() => void navigate(`${root}/catalog`)}
            />
            <Typography.Text type="secondary" className="parts-hero__hint">
              {text.home.pickerHint}
            </Typography.Text>
          </Card>
        </div>
      </section>

      <section className="parts-section">
        <div className="parts-section__heading">
          <div>
            <Typography.Title level={2}>{text.home.categoriesTitle}</Typography.Title>
            <Typography.Text type="secondary">{text.home.categoriesText}</Typography.Text>
          </div>
          <Link to={`${root}/catalog`} className="parts-link">
            {text.home.viewAll} <ArrowRightOutlined />
          </Link>
        </div>
        <ul className="parts-categories">
          {categoryIds.map((id) => (
            <li key={id}>
              <Link to={`${root}/catalog?category=${id}`} className="parts-category">
                <PartVisual category={id} size="small" />
                <span className="parts-category__name">{categoryNames[id][language]}</span>
                <span className="parts-category__count">{text.home.partsCount(counts[id])}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="parts-section">
        <div className="parts-section__heading">
          <div>
            <Typography.Title level={2}>{text.home.dealsTitle}</Typography.Title>
            <Typography.Text type="secondary">{text.home.dealsText}</Typography.Text>
          </div>
          <Link to={`${root}/catalog?sort=popular`} className="parts-link">
            {text.home.viewAll} <ArrowRightOutlined />
          </Link>
        </div>
        <div className="parts-grid parts-grid--row">
          {deals.map((part) => (
            <PartCard key={part.id} part={part} root={root} vehicle={vehicle} />
          ))}
        </div>
      </section>

      <section className="parts-section parts-services" aria-label={text.home.servicesTitle}>
        <Typography.Title level={2}>{text.home.servicesTitle}</Typography.Title>
        <Row gutter={[16, 16]}>
          {text.home.services.map(([title, description], index) => (
            <Col xs={24} sm={12} lg={6} key={title}>
              <div className="parts-service">
                <span className="parts-service__icon" aria-hidden="true">
                  {serviceIcons[index]}
                </span>
                <Typography.Text strong>{title}</Typography.Text>
                <Typography.Text type="secondary">{description}</Typography.Text>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      <section className="parts-section">
        <Typography.Title level={2}>{text.home.brandsTitle}</Typography.Title>
        <ul className="parts-brands">
          {brands.map((brand) => (
            <li key={brand.id}>
              <Link to={`${root}/catalog?brand=${brand.id}`} className="parts-brand">
                <span className="parts-brand__name">{brand.name}</span>
                <span className="parts-brand__country">{brand.country[language]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="parts-section">
        <div className="parts-help">
          <div>
            <Typography.Title level={3}>{text.home.helpTitle}</Typography.Title>
            <Typography.Paragraph>{text.home.helpText}</Typography.Paragraph>
          </div>
          <Flex gap={8} wrap>
            <Button
              size="large"
              icon={<SearchOutlined />}
              onClick={() => void navigate(`${root}/catalog?q=${encodeURIComponent(exampleOem)}`)}
            >
              {text.home.helpAction}
            </Button>
            <Button size="large" type="primary" icon={<CarOutlined />} onClick={openGarage}>
              {text.garage.title}
            </Button>
          </Flex>
        </div>
      </section>
    </PartsSiteShell>
  )
}
