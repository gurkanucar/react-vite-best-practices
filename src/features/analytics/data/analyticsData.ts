/**
 * Figures a real product would report, kept static so the page renders identically in
 * every environment. A live application would swap these arrays for query results; the
 * chart components take data as props and do not care where it came from.
 */

export interface RevenuePoint {
  month: string
  subscriptions: number
  services: number
  marketplace: number
}

/** Monthly recurring revenue in USD, split by the three lines of business. */
export const revenueByMonth: RevenuePoint[] = [
  { month: '2025-10', subscriptions: 486_200, services: 118_400, marketplace: 42_900 },
  { month: '2025-11', subscriptions: 502_800, services: 124_100, marketplace: 47_600 },
  { month: '2025-12', subscriptions: 531_400, services: 109_700, marketplace: 61_300 },
  { month: '2026-01', subscriptions: 548_900, services: 132_800, marketplace: 44_100 },
  { month: '2026-02', subscriptions: 561_300, services: 138_200, marketplace: 49_800 },
  { month: '2026-03', subscriptions: 594_700, services: 145_600, marketplace: 55_200 },
  { month: '2026-04', subscriptions: 612_100, services: 141_900, marketplace: 58_700 },
  { month: '2026-05', subscriptions: 634_800, services: 152_300, marketplace: 63_400 },
  { month: '2026-06', subscriptions: 658_200, services: 149_800, marketplace: 67_900 },
  { month: '2026-07', subscriptions: 671_500, services: 156_400, marketplace: 71_200 },
  { month: '2026-08', subscriptions: 698_300, services: 163_700, marketplace: 74_800 },
  { month: '2026-09', subscriptions: 724_600, services: 171_200, marketplace: 79_500 },
]

export interface LatencyPoint {
  hour: string
  p50: number
  p95: number
  p99: number
}

/**
 * Response time percentiles in milliseconds over one day. The 06:00-09:00 climb is the
 * European morning peak and 14:00 is a cache eviction, which is what makes percentile
 * charts worth plotting: the p50 barely moves while the p99 triples.
 */
export const latencyByHour: LatencyPoint[] = [
  { hour: '00:00', p50: 42, p95: 118, p99: 214 },
  { hour: '02:00', p50: 38, p95: 104, p99: 186 },
  { hour: '04:00', p50: 36, p95: 98, p99: 172 },
  { hour: '06:00', p50: 44, p95: 132, p99: 248 },
  { hour: '08:00', p50: 61, p95: 198, p99: 412 },
  { hour: '10:00', p50: 68, p95: 224, p99: 468 },
  { hour: '12:00', p50: 64, p95: 211, p99: 441 },
  { hour: '14:00', p50: 72, p95: 318, p99: 986 },
  { hour: '16:00', p50: 66, p95: 236, p99: 512 },
  { hour: '18:00', p50: 58, p95: 187, p99: 388 },
  { hour: '20:00', p50: 51, p95: 154, p99: 296 },
  { hour: '22:00', p50: 46, p95: 129, p99: 238 },
]

export interface SignupPoint {
  week: string
  trials: number
  converted: number
  conversionRate: number
}

/** Trials started against the share that became paid accounts, by ISO week. */
export const signupsByWeek: SignupPoint[] = [
  { week: 'W27', trials: 482, converted: 96, conversionRate: 19.9 },
  { week: 'W28', trials: 517, converted: 108, conversionRate: 20.9 },
  { week: 'W29', trials: 468, converted: 84, conversionRate: 17.9 },
  { week: 'W30', trials: 594, converted: 137, conversionRate: 23.1 },
  { week: 'W31', trials: 622, converted: 149, conversionRate: 24.0 },
  { week: 'W32', trials: 571, converted: 128, conversionRate: 22.4 },
  { week: 'W33', trials: 648, converted: 162, conversionRate: 25.0 },
  { week: 'W34', trials: 703, converted: 186, conversionRate: 26.5 },
  { week: 'W35', trials: 689, converted: 174, conversionRate: 25.3 },
  { week: 'W36', trials: 741, converted: 203, conversionRate: 27.4 },
]

/**
 * A labelled share of a whole. The id is a translation key rather than a display string,
 * so the same dataset renders in every language; the chart receives the matching labels.
 */
export interface BreakdownSlice<TId extends string> {
  id: TId
  value: number
}

export type DeviceId = 'desktop' | 'mobile' | 'tablet'

/** Sessions by device class over the last 30 days. */
export const sessionsByDevice: BreakdownSlice<DeviceId>[] = [
  { id: 'desktop', value: 184_320 },
  { id: 'mobile', value: 126_780 },
  { id: 'tablet', value: 21_450 },
]

export type PlanId = 'free' | 'pro' | 'team' | 'enterprise'

/** Accounts on each plan. */
export const accountsByPlan: BreakdownSlice<PlanId>[] = [
  { id: 'free', value: 12_480 },
  { id: 'pro', value: 3_960 },
  { id: 'team', value: 1_240 },
  { id: 'enterprise', value: 186 },
]

export type AuditId = 'performance' | 'accessibility' | 'bestPractices' | 'seo' | 'pwa'

export interface QualityScore {
  id: AuditId
  before: number
  after: number
}

/**
 * Lighthouse category scores before and after the route-splitting work, which is the
 * kind of paired comparison a radar chart reads well.
 */
export const lighthouseScores: QualityScore[] = [
  { id: 'performance', before: 62, after: 94 },
  { id: 'accessibility', before: 88, after: 98 },
  { id: 'bestPractices', before: 79, after: 96 },
  { id: 'seo', before: 84, after: 100 },
  { id: 'pwa', before: 55, after: 82 },
]

export type ServiceId = 'api' | 'web' | 'jobs' | 'search'

export interface ServiceObjective {
  id: ServiceId
  attainment: number
}

/** Availability against each service's monthly objective, as a percentage. */
export const serviceObjectives: ServiceObjective[] = [
  { id: 'api', attainment: 99.98 },
  { id: 'web', attainment: 99.94 },
  { id: 'jobs', attainment: 99.72 },
  { id: 'search', attainment: 98.61 },
]

export interface RoutePerformancePoint {
  route: string
  /** Transferred JavaScript for the route, in kilobytes. */
  transferredKb: number
  /** Time to interactive, in milliseconds. */
  interactiveMs: number
  /** Sessions that opened the route, used as the bubble area. */
  sessions: number
}

/**
 * Every route in this application, measured from its own production build. Three
 * variables at once is exactly what a scatter chart with a `ZAxis` is for.
 */
export const routePerformance: RoutePerformancePoint[] = [
  { route: '/', transferredKb: 96, interactiveMs: 620, sessions: 48_200 },
  { route: '/dashboard', transferredKb: 412, interactiveMs: 1180, sessions: 31_700 },
  { route: '/components', transferredKb: 334, interactiveMs: 1040, sessions: 8_400 },
  { route: '/posts', transferredKb: 188, interactiveMs: 760, sessions: 14_900 },
  { route: '/products', transferredKb: 196, interactiveMs: 790, sessions: 12_300 },
  { route: '/documents', transferredKb: 620, interactiveMs: 1620, sessions: 3_100 },
  { route: '/assistant', transferredKb: 284, interactiveMs: 940, sessions: 5_600 },
  { route: '/settings', transferredKb: 142, interactiveMs: 690, sessions: 9_800 },
]

export interface BundleNode {
  name: string
  size: number
  /**
   * `Treemap` accepts arbitrary extra fields on a node and types its data accordingly,
   * so the node type has to allow them too.
   */
  [field: string]: unknown
}

/** Shipped chunk sizes in kilobytes, taken from this repository's production build. */
export const bundleComposition: BundleNode[] = [
  { name: 'recharts', size: 349 },
  { name: 'antd/table', size: 164 },
  { name: 'antd/typography', size: 148 },
  { name: 'react-pdf', size: 286 },
  { name: 'antd/date-picker', size: 104 },
  { name: '@ant-design/x', size: 84 },
  { name: 'antd/select', size: 72 },
  { name: 'react-dom', size: 176 },
  { name: 'i18n messages', size: 188 },
  { name: 'antd/card', size: 44 },
  { name: 'antd/dropdown', size: 44 },
  { name: 'antd/drawer', size: 36 },
  { name: 'tanstack/query', size: 15 },
  { name: 'application code', size: 118 },
]

export type StageId = 'visited' | 'signedUp' | 'activated' | 'invitedTeam' | 'subscribed'

export interface FunnelStage {
  id: StageId
  value: number
}

/** Visitors reaching each step of onboarding over the last 30 days. */
export const onboardingFunnel: FunnelStage[] = [
  { id: 'visited', value: 142_800 },
  { id: 'signedUp', value: 38_400 },
  { id: 'activated', value: 19_600 },
  { id: 'invitedTeam', value: 8_900 },
  { id: 'subscribed', value: 4_120 },
]

export type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface ThroughputPoint {
  day: DayId
  operations: number
}

/** Successful platform operations per weekday, shown on the dashboard. */
export const throughputByDay: ThroughputPoint[] = [
  { day: 'mon', operations: 62_400 },
  { day: 'tue', operations: 74_100 },
  { day: 'wed', operations: 58_900 },
  { day: 'thu', operations: 86_300 },
  { day: 'fri', operations: 72_800 },
  { day: 'sat', operations: 34_200 },
  { day: 'sun', operations: 28_700 },
]

export type KpiId = 'mrr' | 'activeUsers' | 'churn' | 'csat'

export interface KpiTrend {
  id: KpiId
  value: number
  /** Change against the previous period, in percent. */
  change: number
  /** Whether a rise is good news; churn going up is not. */
  higherIsBetter: boolean
  format: 'currency' | 'number' | 'percent'
  /** The last twelve periods, oldest first, for the sparkline. */
  trend: number[]
}

/** The headline figures across the top of the page, each with the shape of its last year. */
export const kpiTrends: KpiTrend[] = [
  {
    id: 'mrr',
    value: 975_300,
    change: 4.1,
    higherIsBetter: true,
    format: 'currency',
    trend: [647, 674, 702, 726, 749, 795, 813, 851, 876, 899, 937, 975],
  },
  {
    id: 'activeUsers',
    value: 24_860,
    change: 6.8,
    higherIsBetter: true,
    format: 'number',
    trend: [15.2, 15.9, 16.4, 17.1, 17.8, 18.9, 19.6, 20.4, 21.8, 22.5, 23.3, 24.9],
  },
  {
    id: 'churn',
    value: 2.6,
    change: -0.4,
    higherIsBetter: false,
    format: 'percent',
    trend: [3.9, 3.7, 3.8, 3.5, 3.4, 3.3, 3.1, 3.2, 3, 2.9, 2.7, 2.6],
  },
  // The one going the wrong way: satisfaction slid while chat tickets grew faster than the team.
  {
    id: 'csat',
    value: 84.2,
    change: -3.1,
    higherIsBetter: true,
    format: 'percent',
    trend: [91.8, 92.4, 91.9, 91.2, 90.6, 90.9, 89.7, 88.9, 88.1, 87.3, 86.9, 84.2],
  },
]

export interface DailyUsersPoint {
  /** `YYYY-MM-DD` */
  date: string
  users: number
}

/**
 * Ninety days of daily active users: steady growth, quiet weekends, and a two-day outage in
 * August, which is what the brush and the reference area on the chart are there to find.
 */
export const dailyActiveUsers: DailyUsersPoint[] = Array.from({ length: 90 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 5, 30 + index))
  const weekday = date.getUTCDay()
  const weekend = weekday === 0 || weekday === 6 ? 0.72 : 1
  // A fixed wobble instead of Math.random, so every render and every test sees the same line.
  const wobble = 1 + Math.sin(index * 1.7) * 0.035
  const outage = index === 48 || index === 49 ? 0.58 : 1

  return {
    date: date.toISOString().slice(0, 10),
    users: Math.round((17_400 + index * 82) * weekend * wobble * outage),
  }
})

/** The outage the reference area marks, as the first and last day it covers. */
export const outageWindow = { from: dailyActiveUsers[48].date, to: dailyActiveUsers[49].date }

export type MrrStepId = 'start' | 'new' | 'expansion' | 'contraction' | 'churn' | 'end'

export interface MrrStep {
  id: MrrStepId
  /** A change for the steps in between; the whole balance for the first and the last. */
  value: number
}

/** How recurring revenue got from August to September: the bridge a waterfall draws. */
export const mrrMovement: MrrStep[] = [
  { id: 'start', value: 936_800 },
  { id: 'new', value: 52_400 },
  { id: 'expansion', value: 21_300 },
  { id: 'contraction', value: -9_800 },
  { id: 'churn', value: -25_400 },
  { id: 'end', value: 975_300 },
]

export type ChannelId = 'email' | 'chat' | 'phone'

export interface TicketWeek {
  week: string
  email: number
  chat: number
  phone: number
}

/** Support tickets opened each week, by the channel they came in through. */
export const ticketsByWeek: TicketWeek[] = [
  { week: 'W29', email: 182, chat: 214, phone: 64 },
  { week: 'W30', email: 176, chat: 238, phone: 58 },
  { week: 'W31', email: 194, chat: 251, phone: 61 },
  { week: 'W32', email: 168, chat: 263, phone: 49 },
  { week: 'W33', email: 201, chat: 342, phone: 88 },
  { week: 'W34', email: 172, chat: 289, phone: 54 },
  { week: 'W35', email: 159, chat: 297, phone: 47 },
  { week: 'W36', email: 148, chat: 312, phone: 42 },
]

export interface CountrySessions {
  /** ISO 3166 code; the chart names it in the reader's language with `Intl.DisplayNames`. */
  code: string
  sessions: number
}

/** Sessions over the last 30 days from the countries sending the most traffic. */
export const sessionsByCountry: CountrySessions[] = [
  { code: 'TR', sessions: 98_400 },
  { code: 'US', sessions: 72_100 },
  { code: 'DE', sessions: 41_800 },
  { code: 'GB', sessions: 33_600 },
  { code: 'NL', sessions: 21_900 },
  { code: 'FR', sessions: 18_200 },
  { code: 'IN', sessions: 14_700 },
]

export type BrowserId = 'chrome' | 'safari' | 'edge' | 'firefox' | 'other'

export interface BrowserShare {
  month: string
  chrome: number
  safari: number
  edge: number
  firefox: number
  other: number
}

/** Sessions per browser; the chart stacks them to 100% so the mix reads, not the volume. */
export const browserShareByMonth: BrowserShare[] = [
  { month: '2026-04', chrome: 61_200, safari: 24_800, edge: 9_100, firefox: 5_400, other: 2_300 },
  { month: '2026-05', chrome: 63_900, safari: 25_600, edge: 9_800, firefox: 5_200, other: 2_100 },
  { month: '2026-06', chrome: 64_100, safari: 27_900, edge: 10_400, firefox: 4_900, other: 2_200 },
  { month: '2026-07', chrome: 66_800, safari: 29_300, edge: 10_900, firefox: 4_700, other: 1_900 },
  { month: '2026-08', chrome: 65_400, safari: 31_800, edge: 11_600, firefox: 4_500, other: 1_800 },
  { month: '2026-09', chrome: 68_700, safari: 33_100, edge: 12_200, firefox: 4_300, other: 1_700 },
]

export type NpsGroupId = 'detractors' | 'passives' | 'promoters'

/** Survey answers behind the net promoter score: promoters minus detractors, in percent. */
export const npsResponses: Record<NpsGroupId, number> = {
  detractors: 182,
  passives: 346,
  promoters: 612,
}

/**
 * Sessions per weekday and hour. Office hours carry the load, with a lunch dip and a lighter
 * weekend, which is the pattern a heatmap shows at a glance and a line chart hides.
 */
export const sessionsByHour: number[][] = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const weekend = day >= 5
    const office = Math.exp(-((hour - 14) ** 2) / 18)
    const lunch = hour === 12 || hour === 13 ? 0.82 : 1
    const evening = Math.exp(-((hour - 21) ** 2) / 6) * 0.45

    return Math.round((weekend ? 0.45 : 1) * (office * lunch + evening + 0.05) * 1_400)
  }),
)

export interface Cohort {
  month: string
  size: number
  /** Share still active after 0, 1, 2… months, in percent; newer cohorts have fewer months. */
  retention: number[]
}

/** Monthly signup cohorts and how many of each are still active as the months pass. */
export const retentionCohorts: Cohort[] = [
  { month: '2026-04', size: 1_842, retention: [100, 62, 51, 46, 43, 41] },
  { month: '2026-05', size: 1_967, retention: [100, 64, 54, 48, 45] },
  { month: '2026-06', size: 2_104, retention: [100, 66, 55, 50] },
  { month: '2026-07', size: 2_311, retention: [100, 69, 58] },
  { month: '2026-08', size: 2_486, retention: [100, 71] },
  { month: '2026-09', size: 2_652, retention: [100] },
]
