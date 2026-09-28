import { ArrowLeftOutlined, ArrowRightOutlined, PlayCircleFilled } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router'
import { AgencyArtwork } from '@/features/showcases/components/AgencyArtwork'
import { AgencyProjectCard } from '@/features/showcases/components/AgencyProjectCard'
import { AgencyReveal } from '@/features/showcases/components/AgencyReveal'
import { AgencySiteShell } from '@/features/showcases/components/AgencySiteShell'
import {
  agencyEmail,
  agencyRoot,
  awards,
  caseStudies,
  clients,
  team,
} from '@/features/showcases/data/agency'
import { useAgencyCopy } from '@/features/showcases/hooks/useAgencyCopy'

interface AgencyHomePageProps {
  standalone?: boolean
}

const selected = caseStudies.slice(0, 4)
const quoted = [caseStudies[2]!, caseStudies[0]!, caseStudies[4]!]

/** The circumference of the badge's text path, so the label meets itself exactly once. */
const RING_LENGTH = Math.round(2 * Math.PI * 46)

/** Text running around a circle; the badge is square, so it stays round at any size. */
function AvailabilityBadge({ label }: { label: string }) {
  return (
    <div className="agency-badge">
      <span className="agency-visually-hidden">{label.replace(/ · $/, '')}</span>
      <svg viewBox="0 0 120 120" aria-hidden="true" className="agency-badge__ring">
        <defs>
          <path id="agency-badge-circle" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
        </defs>
        <text>
          <textPath href="#agency-badge-circle" textLength={RING_LENGTH} lengthAdjust="spacing">
            {label}
          </textPath>
        </text>
      </svg>
      <span className="agency-badge__dot" aria-hidden="true" />
    </div>
  )
}

function Testimonials() {
  const { text, language } = useAgencyCopy()
  const [index, setIndex] = useState(0)
  const study = quoted[index]!
  const step = (by: number) => setIndex((current) => (current + by + quoted.length) % quoted.length)

  return (
    <section className="agency-section agency-section--dark agency-quotes">
      <div className="agency-wrap">
        <p className="agency-kicker">{text.home.testimonialsTitle}</p>
        <figure key={study.id} className="agency-quotes__quote">
          <blockquote>“{study.quote.text[language]}”</blockquote>
          <figcaption>
            <strong>{study.quote.author}</strong>
            <span>{study.quote.role[language]}</span>
          </figcaption>
        </figure>
        <div className="agency-quotes__controls">
          <Button
            shape="circle"
            size="large"
            icon={<ArrowLeftOutlined />}
            aria-label={text.home.previous}
            onClick={() => step(-1)}
          />
          <span className="agency-quotes__count" aria-live="polite">
            {String(index + 1).padStart(2, '0')} / {String(quoted.length).padStart(2, '0')}
          </span>
          <Button
            shape="circle"
            size="large"
            icon={<ArrowRightOutlined />}
            aria-label={text.home.next}
            onClick={() => step(1)}
          />
        </div>
      </div>
    </section>
  )
}

export function AgencyHomePage({ standalone = false }: AgencyHomePageProps) {
  const { text, language } = useAgencyCopy()
  const root = agencyRoot(standalone)
  const [reelOpen, setReelOpen] = useState(false)

  return (
    <AgencySiteShell standalone={standalone} page="home">
      <section className="agency-hero">
        <div className="agency-wrap">
          <p className="agency-kicker agency-hero__eyebrow">
            <span className="agency-live-dot" aria-hidden="true" />
            {text.home.eyebrow}
          </p>
          <h1 className="agency-hero__title">
            {text.home.headline.map((part) =>
              part.accent ? <em key={part.text}>{part.text}</em> : part.text,
            )}
          </h1>
          <div className="agency-hero__footer">
            <p className="agency-hero__intro">{text.home.intro}</p>
            <div className="agency-hero__actions">
              <Link to={`${root}/contact`} className="agency-button agency-button--solid">
                {text.home.startProject} <span aria-hidden="true">→</span>
              </Link>
              <Link to={`${root}/work`} className="agency-button">
                {text.home.seeWork}
              </Link>
            </div>
            <AvailabilityBadge label={text.home.availability} />
          </div>
        </div>

        <div className="agency-wrap">
          <button type="button" className="agency-reel" onClick={() => setReelOpen(true)}>
            <span className="agency-reel__strip" aria-hidden="true">
              {caseStudies.slice(0, 5).map((study) => (
                <AgencyArtwork key={study.id} art={study.cover} />
              ))}
            </span>
            <span className="agency-reel__play">
              <PlayCircleFilled aria-hidden="true" /> {text.home.watchReel}
            </span>
          </button>
        </div>
      </section>

      <Modal
        open={reelOpen}
        onCancel={() => setReelOpen(false)}
        footer={null}
        width={960}
        centered
        title={text.home.reelTitle}
        className="agency-reel-modal"
        destroyOnHidden
      >
        <div className="agency-reel-modal__stage" aria-hidden="true">
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              className="agency-reel-modal__frame"
              style={{ animationDelay: `${index * 1.5}s` }}
            >
              <AgencyArtwork art={study.cover} />
              <span>{study.client}</span>
            </div>
          ))}
        </div>
        <p className="agency-reel-modal__caption">{text.home.reelCaption}</p>
      </Modal>

      <section className="agency-marquee" aria-label={text.home.clientsLabel}>
        <p className="agency-marquee__label">{text.home.clientsLabel}</p>
        <div className="agency-marquee__viewport">
          <ul className="agency-marquee__track">
            {clients.map((client) => (
              <li key={client}>{client}</li>
            ))}
          </ul>
          <ul className="agency-marquee__track" aria-hidden="true">
            {clients.map((client) => (
              <li key={client}>{client}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="agency-section" id="agency-work">
        <div className="agency-wrap">
          <AgencyReveal className="agency-heading">
            <h2>{text.home.selectedTitle}</h2>
            <p>{text.home.selectedIntro}</p>
            <Link to={`${root}/work`} className="agency-link">
              {text.home.allWork} <span aria-hidden="true">→</span>
            </Link>
          </AgencyReveal>
          <div className="agency-grid">
            {selected.map((study, index) => (
              <AgencyReveal key={study.id} delay={(index % 2) * 120} className="agency-grid__item">
                <AgencyProjectCard study={study} root={root} />
              </AgencyReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="agency-section agency-section--tint" id="agency-services">
        <div className="agency-wrap">
          <AgencyReveal className="agency-heading">
            <h2>{text.home.servicesTitle}</h2>
          </AgencyReveal>
          <ol className="agency-services">
            {text.home.services.map((service, index) => (
              <li key={service.title}>
                <AgencyReveal className="agency-service" delay={index * 80}>
                  <span className="agency-service__number">0{index + 1}</span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <ul className="agency-service__tags">
                    {service.deliverables.map((deliverable) => (
                      <li key={deliverable}>{deliverable}</li>
                    ))}
                  </ul>
                </AgencyReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="agency-section">
        <div className="agency-wrap">
          <AgencyReveal className="agency-heading">
            <h2>{text.home.processTitle}</h2>
          </AgencyReveal>
          <ol className="agency-process">
            {text.home.process.map((step, index) => (
              <li key={step.title}>
                <AgencyReveal className="agency-process__step" delay={index * 100}>
                  <span className="agency-process__index">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <span className="agency-process__duration">{step.duration}</span>
                  <p>{step.text}</p>
                </AgencyReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="agency-numbers" aria-label={text.home.teamTitle}>
        <div className="agency-wrap agency-numbers__grid">
          {text.home.numbers.map((number, index) => (
            <AgencyReveal key={number.label} className="agency-number" delay={index * 90}>
              <strong>{number.value}</strong>
              <span>{number.label}</span>
            </AgencyReveal>
          ))}
        </div>
      </section>

      <Testimonials />

      <section className="agency-section" id="agency-studio">
        <div className="agency-wrap">
          <AgencyReveal className="agency-heading">
            <h2>{text.home.teamTitle}</h2>
            <p>{text.home.teamIntro}</p>
          </AgencyReveal>
          <ul className="agency-team">
            {team.map((member, index) => (
              <li key={member.name}>
                <AgencyReveal className="agency-person" delay={(index % 3) * 90}>
                  <div
                    className="agency-person__portrait"
                    style={{ background: member.palette.bg, color: member.palette.ink }}
                    aria-hidden="true"
                  >
                    <span
                      className="agency-person__shape"
                      style={{ background: member.palette.soft }}
                    />
                    <span className="agency-person__initials">
                      {member.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </span>
                  </div>
                  <strong>{member.name}</strong>
                  <span>
                    {member.role[language]} · {member.city[language]}
                  </span>
                </AgencyReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="agency-section agency-section--tint">
        <div className="agency-wrap">
          <AgencyReveal className="agency-heading">
            <h2>{text.home.awardsTitle}</h2>
          </AgencyReveal>
          <table className="agency-awards">
            <thead>
              <tr>
                <th scope="col">{text.home.awardColumns.year}</th>
                <th scope="col">{text.home.awardColumns.award}</th>
                <th scope="col">{text.home.awardColumns.project}</th>
                <th scope="col">{text.home.awardColumns.honour}</th>
              </tr>
            </thead>
            <tbody>
              {awards.map((award) => (
                <tr key={`${award.award}-${award.project}`}>
                  <td>{award.year}</td>
                  <td>{award.award}</td>
                  <td>{award.project}</td>
                  <td>{award.honour[language]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="agency-cta">
        <div className="agency-wrap">
          <AgencyReveal>
            <h2 className="agency-cta__title">{text.home.ctaTitle}</h2>
            <p className="agency-cta__text">{text.home.ctaText}</p>
            <div className="agency-cta__actions">
              <Link to={`${root}/contact`} className="agency-button agency-button--light">
                {text.home.ctaButton} <span aria-hidden="true">→</span>
              </Link>
              <span>
                {text.home.ctaOr} <a href={`mailto:${agencyEmail}`}>{agencyEmail}</a>
              </span>
            </div>
          </AgencyReveal>
        </div>
      </section>
    </AgencySiteShell>
  )
}
