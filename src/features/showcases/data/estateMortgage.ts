export interface MortgageInput {
  price: number
  /** Share of the price paid up front, 0–100. */
  downPaymentPct: number
  months: number
  /** Turkish banks quote housing loans per month, so the rate is monthly, in percent. */
  monthlyRatePct: number
}

export interface MortgageYear {
  year: number
  principal: number
  interest: number
  balance: number
}

export interface MortgagePlan {
  downPayment: number
  loan: number
  monthly: number
  totalInterest: number
  totalPaid: number
  years: MortgageYear[]
}

export const MORTGAGE_TERMS = [36, 60, 120, 180, 240]
export const DEFAULT_MORTGAGE = { downPaymentPct: 30, months: 120, monthlyRatePct: 2.49 }

/** The fixed instalment that pays `principal` off in `months` at `monthlyRate` (a fraction). */
export function monthlyPayment(principal: number, monthlyRate: number, months: number) {
  if (principal <= 0 || months <= 0) return 0
  if (monthlyRate === 0) return principal / months
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
}

export function mortgagePlan({
  price,
  downPaymentPct,
  months,
  monthlyRatePct,
}: MortgageInput): MortgagePlan {
  const pct = Math.min(Math.max(downPaymentPct, 0), 100)
  const downPayment = Math.round((price * pct) / 100)
  const loan = Math.max(price - downPayment, 0)
  const rate = Math.max(monthlyRatePct, 0) / 100
  const monthly = monthlyPayment(loan, rate, months)

  const years: MortgageYear[] = []
  let balance = loan
  for (let month = 1; month <= months; month += 1) {
    const interest = balance * rate
    const principal = Math.min(monthly - interest, balance)
    balance = Math.max(balance - principal, 0)
    const year = Math.ceil(month / 12)
    const row = years[year - 1] ?? { year, principal: 0, interest: 0, balance: 0 }
    row.principal += principal
    row.interest += interest
    row.balance = balance
    years[year - 1] = row
  }

  const totalPaid = monthly * months
  return {
    downPayment,
    loan,
    monthly: Math.round(monthly),
    totalInterest: Math.round(totalPaid - loan),
    totalPaid: Math.round(totalPaid),
    years: years.map((row) => ({
      year: row.year,
      principal: Math.round(row.principal),
      interest: Math.round(row.interest),
      balance: Math.round(row.balance),
    })),
  }
}

/** What a monthly rate compounds to over a year, in percent. */
export const annualRate = (monthlyRatePct: number) => ((1 + monthlyRatePct / 100) ** 12 - 1) * 100

/** The most a monthly budget can borrow, plus the down payment it implies. */
export function affordablePrice(budget: number, input: Omit<MortgageInput, 'price'>) {
  const rate = input.monthlyRatePct / 100
  const loan =
    rate === 0 ? budget * input.months : (budget * (1 - (1 + rate) ** -input.months)) / rate
  const share = 1 - Math.min(Math.max(input.downPaymentPct, 0), 99) / 100
  return Math.round(loan / share)
}

/** Renting: the first month, a two-month deposit and one month's agency fee plus 20% VAT. */
export function moveInCost(rent: number) {
  const deposit = rent * 2
  const agencyFee = Math.round(rent * 1.2)
  return { firstRent: rent, deposit, agencyFee, total: rent + deposit + agencyFee }
}
