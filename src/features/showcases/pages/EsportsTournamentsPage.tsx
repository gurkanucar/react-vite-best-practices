import { SearchOutlined } from '@ant-design/icons'
import { Button, Empty, Flex, Input, Segmented, Select, Typography } from 'antd'
import { useSearchParams } from 'react-router'
import { TournamentCard } from '@/features/showcases/components/EsportsTournamentCard'
import { EsportsSiteShell } from '@/features/showcases/components/EsportsSiteShell'
import {
  esportsRoot,
  sportIds,
  tournaments,
  type SportId,
  type TournamentFormat,
} from '@/features/showcases/data/esports'
import {
  tournamentDates,
  tournamentStatus,
  type MatchStatus,
} from '@/features/showcases/data/esportsSim'
import { useEsportsCopy, useEsportsNow } from '@/features/showcases/hooks/useEsportsStore'

const STATUSES: MatchStatus[] = ['live', 'upcoming', 'finished']
const FORMATS: TournamentFormat[] = ['league', 'knockout', 'swiss']
const statusOrder: Record<MatchStatus, number> = { live: 0, upcoming: 1, finished: 2 }

export function EsportsTournamentsPage({ standalone = false }: { standalone?: boolean }) {
  const { text, language } = useEsportsCopy()
  const root = esportsRoot(standalone)
  const now = useEsportsNow(30_000)
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const sport = (sportIds as string[]).includes(params.get('sport') ?? '')
    ? (params.get('sport') as SportId)
    : undefined
  const status = (STATUSES as string[]).includes(params.get('status') ?? '')
    ? (params.get('status') as MatchStatus)
    : 'all'
  const format = (FORMATS as string[]).includes(params.get('format') ?? '')
    ? (params.get('format') as TournamentFormat)
    : undefined

  const update = (key: string, value: string | undefined) => {
    const search = new URLSearchParams(params)
    if (value) search.set(key, value)
    else search.delete(key)
    setParams(search, { replace: true })
  }

  const needle = query.trim().toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-GB')
  const results = tournaments
    .map((tournament) => ({
      tournament,
      status: tournamentStatus(tournament, now),
      dates: tournamentDates(tournament, now),
    }))
    .filter((item) => !sport || item.tournament.sport === sport)
    .filter((item) => status === 'all' || item.status === status)
    .filter((item) => !format || item.tournament.format === format)
    .filter(
      (item) =>
        !needle ||
        `${item.tournament.name} ${text.sports[item.tournament.sport]} ${item.tournament.location[language]}`
          .toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-GB')
          .includes(needle),
    )
    .sort(
      (first, second) =>
        statusOrder[first.status] - statusOrder[second.status] ||
        (first.status === 'finished'
          ? second.dates[1] - first.dates[1]
          : first.dates[0] - second.dates[0]),
    )
  const filtered = Boolean(query || sport || status !== 'all' || format)

  return (
    <EsportsSiteShell standalone={standalone}>
      <section className="esp-listhead">
        <div className="esp-wrap">
          <Typography.Title>{text.list.title}</Typography.Title>
          <Typography.Paragraph className="esp-lead">{text.list.lead}</Typography.Paragraph>
        </div>
      </section>
      <div className="esp-wrap esp-section">
        <div className="esp-filters">
          <Input
            allowClear
            className="esp-filters__search"
            prefix={<SearchOutlined aria-hidden="true" />}
            placeholder={text.list.search}
            aria-label={text.list.search}
            value={query}
            onChange={(event) => update('q', event.target.value || undefined)}
          />
          <Segmented
            aria-label={text.list.status}
            value={status}
            onChange={(value) => update('status', value === 'all' ? undefined : String(value))}
            options={[
              { value: 'all', label: text.common.all },
              ...STATUSES.map((value) => ({ value, label: text.status[value] })),
            ]}
          />
          <Select
            allowClear
            className="esp-filters__select"
            aria-label={text.common.sport}
            placeholder={text.common.sport}
            value={sport}
            onChange={(value) => update('sport', value)}
            options={sportIds.map((id) => ({ value: id, label: text.sports[id] }))}
          />
          <Select
            allowClear
            className="esp-filters__select"
            aria-label={text.list.format}
            placeholder={text.list.format}
            value={format}
            onChange={(value) => update('format', value)}
            options={FORMATS.map((value) => ({ value, label: text.formats[value] }))}
          />
        </div>
        <Flex justify="space-between" align="center" gap={12} wrap className="esp-resultline">
          <Typography.Text type="secondary">{text.list.results(results.length)}</Typography.Text>
          {filtered && (
            <Button type="link" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
              {text.list.clear}
            </Button>
          )}
        </Flex>
        {results.length ? (
          <div className="esp-tgrid">
            {results.map(({ tournament }) => (
              <TournamentCard key={tournament.id} tournament={tournament} now={now} root={root} />
            ))}
          </div>
        ) : (
          <Empty description={text.list.none} />
        )}
      </div>
    </EsportsSiteShell>
  )
}
