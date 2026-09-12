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
