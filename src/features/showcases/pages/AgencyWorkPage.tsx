import { Link, useSearchParams } from 'react-router'
import { AgencyProjectCard } from '@/features/showcases/components/AgencyProjectCard'
import { AgencySiteShell } from '@/features/showcases/components/AgencySiteShell'
import {
  agencyRoot,
  caseStudies,
  DISCIPLINES,
  type Discipline,
} from '@/features/showcases/data/agency'
import {
  disciplineCounts,
  filterCases,
  parseDiscipline,
} from '@/features/showcases/data/agencyLogic'
import { useAgencyCopy } from '@/features/showcases/hooks/useAgencyCopy'

interface AgencyWorkPageProps {
  standalone?: boolean
}

const counts = disciplineCounts(caseStudies)

export function AgencyWorkPage({ standalone = false }: AgencyWorkPageProps) {
  const { text } = useAgencyCopy()
  const root = agencyRoot(standalone)
  const [params, setParams] = useSearchParams()
  const discipline = parseDiscipline(params.get('discipline'))
  const shown = filterCases(caseStudies, discipline)

  const choose = (next: Discipline | null) =>
    setParams(
      (current) => {
        const updated = new URLSearchParams(current)
        if (next) updated.set('discipline', next)
        else updated.delete('discipline')
        return updated
      },
      { replace: true, preventScrollReset: true },
    )

  const options: { value: Discipline | null; label: string; count: number }[] = [
    { value: null, label: text.work.all, count: counts.all },
    ...DISCIPLINES.map((value) => ({
      value,
      label: text.disciplines[value],
      count: counts[value],
    })),
  ]

  return (
    <AgencySiteShell standalone={standalone} page="work">
      <section className="agency-page-hero">
        <div className="agency-wrap">
          <h1 className="agency-page-hero__title">
            {text.work.title}
            <sup>{counts.all}</sup>
          </h1>
          <p className="agency-page-hero__intro">{text.work.intro}</p>
        </div>
      </section>

      <section className="agency-section agency-section--flush">
        <div className="agency-wrap">
          <fieldset className="agency-filters">
            <legend className="agency-visually-hidden">{text.work.filterLabel}</legend>
            {options.map((option) => {
              const active = option.value === discipline
              return (
                <button
                  key={option.value ?? 'all'}
                  type="button"
                  className={`agency-chip${active ? ' is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => choose(option.value)}
                >
                  {option.label}
                  <span className="agency-chip__count">{option.count}</span>
                </button>
              )
            })}
          </fieldset>
          <p className="agency-filters__status" aria-live="polite">
            {text.work.showing(shown.length)}
          </p>

          {shown.length === 0 ? (
            <p className="agency-empty">{text.work.empty}</p>
          ) : (
            // Keyed by the filter, so a new selection plays the entrance again.
            <div key={discipline ?? 'all'} className="agency-grid agency-grid--work">
              {shown.map((study, index) => (
                <AgencyProjectCard
                  key={study.id}
                  study={study}
                  root={root}
                  index={index}
                  className="agency-project--enter"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="agency-cta agency-cta--compact">
        <div className="agency-wrap">
          <h2 className="agency-cta__title">{text.work.ctaTitle}</h2>
          <div className="agency-cta__actions">
            <Link to={`${root}/contact`} className="agency-button agency-button--light">
              {text.home.ctaButton} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </AgencySiteShell>
  )
}
