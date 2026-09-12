/**
 * Recharts hands formatters a value typed as `string | number | array | undefined`,
 * because the same callback serves every chart type. Narrowing to a number once here
 * keeps that detail out of every chart component — and out of every `as` cast.
 */
export function forChart(format: (value: number) => string) {
  return (value: unknown): string =>
    typeof value === 'number' ? format(value) : String(value ?? '')
}
