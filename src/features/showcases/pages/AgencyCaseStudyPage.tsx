import type { CSSProperties } from 'react'
import { Link, useParams } from 'react-router'
import { AgencyArtwork } from '@/features/showcases/components/AgencyArtwork'
import { AgencyCompare } from '@/features/showcases/components/AgencyCompare'
import { AgencyReveal } from '@/features/showcases/components/AgencyReveal'
import { AgencySiteShell } from '@/features/showcases/components/AgencySiteShell'
import { agencyRoot } from '@/features/showcases/data/agency'
import { findCase, nextCase } from '@/features/showcases/data/agencyLogic'
import { useAgencyCopy } from '@/features/showcases/hooks/useAgencyCopy'

interface AgencyCaseStudyPageProps {
  standalone?: boolean
}

export function AgencyCaseStudyPage({ standalone = false }: AgencyCaseStudyPageProps) {
  const { text, language } = useAgencyCopy()
  const root = agencyRoot(standalone)
  const { caseId } = useParams()
  const study = findCase(caseId)
  const copy = text.caseStudy

  if (!study) {
    return (
      <AgencySiteShell standalone={standalone} page="case">
        <section className="agency-page-hero agency-not-found">
          <div className="agency-wrap">
            <p className="agency-kicker">404</p>
            <h1 className="agency-page-hero__title">{copy.notFoundTitle}</h1>
            <p className="agency-page-hero__intro">{copy.notFoundText}</p>
            <Link to={`${root}/work`} className="agency-button agency-button--solid">
              <span aria-hidden="true">←</span> {copy.backToWork}
            </Link>
          </div>
        </section>
      </AgencySiteShell>
    )
  }

  const next = nextCase(study.id)
  const story = [
    { heading: copy.challenge, body: study.challenge[language] },
    { heading: copy.approach, body: study.approach[language] },
    { heading: copy.result, body: study.result[language] },
  ]

  return (
    <AgencySiteShell standalone={standalone} page="case">
      <article
        className="agency-case"
        style={{ '--case-accent': study.cover.palette.accent } as CSSProperties}
      >
        <header className="agency-page-hero agency-case__hero">
          <div className="agency-wrap">
            <Link to={`${root}/work`} className="agency-link agency-link--back">
              <span aria-hidden="true">←</span> {copy.backToWork}
            </Link>
            <p className="agency-kicker">{study.client}</p>
            <h1 className="agency-page-hero__title agency-case__title">{study.title[language]}</h1>
            <p className="agency-page-hero__intro">{study.summary[language]}</p>

            <dl className="agency-case__meta">
              <div>
                <dt>{copy.client}</dt>
                <dd>{study.client}</dd>
              </div>
              <div>
                <dt>{copy.year}</dt>
                <dd>{study.year}</dd>
              </div>
              <div>
                <dt>{copy.services}</dt>
                <dd>{study.services.map((service) => service[language]).join(', ')}</dd>
              </div>
              <div>
                <dt>{copy.disciplines}</dt>
                <dd>{study.disciplines.map((item) => text.disciplines[item]).join(', ')}</dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="agency-case__cover">
          <AgencyArtwork art={study.cover} label={study.title[language]} />
        </div>

        <section className="agency-section">
          <div className="agency-wrap agency-case__story">
            {story.map((part) => (
              <AgencyReveal key={part.heading} className="agency-case__chapter">
                <h2>{part.heading}</h2>
                <p>{part.body}</p>
              </AgencyReveal>
            ))}
          </div>
        </section>

        <section className="agency-case__gallery" aria-hidden="true">
          <div className="agency-wrap agency-case__gallery-grid">
            {study.gallery.map((art, index) => (
              <AgencyReveal key={index} delay={index * 120}>
                <AgencyArtwork art={art} />
              </AgencyReveal>
            ))}
          </div>
        </section>

        <section className="agency-section">
          <div className="agency-wrap">
            <AgencyReveal className="agency-heading">
              <h2>{copy.compareTitle}</h2>
              <p>{copy.compareHint}</p>
            </AgencyReveal>
            <AgencyCompare
              before={study.before}
              after={study.cover}
              labels={{ before: copy.before, after: copy.after, slider: copy.compareLabel }}
            />
          </div>
        </section>

        <section className="agency-section agency-section--dark">
          <div className="agency-wrap">
            <p className="agency-kicker">{copy.resultsTitle}</p>
            <ul className="agency-case__metrics">
              {study.metrics.map((metric, index) => (
                <li key={metric.label.en}>
                  <AgencyReveal delay={index * 100}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label[language]}</span>
                  </AgencyReveal>
                </li>
              ))}
            </ul>
            <figure className="agency-quotes__quote agency-case__quote">
              <blockquote>“{study.quote.text[language]}”</blockquote>
              <figcaption>
                <strong>{study.quote.author}</strong>
                <span>{study.quote.role[language]}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="agency-section">
          <div className="agency-wrap agency-case__credits">
            <h2>{copy.creditsTitle}</h2>
            <dl>
              {study.credits.map((credit) => (
                <div key={credit.name + credit.role.en}>
                  <dt>{credit.role[language]}</dt>
                  <dd>{credit.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <Link to={`${root}/work/${next.id}`} className="agency-next">
          <div className="agency-next__art">
            <AgencyArtwork art={next.cover} />
          </div>
          <div className="agency-wrap agency-next__text">
            <span className="agency-kicker">{copy.nextProject}</span>
            <span className="agency-next__client">{next.client}</span>
            <span className="agency-next__title">
              {next.title[language]} <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      </article>
    </AgencySiteShell>
  )
}
