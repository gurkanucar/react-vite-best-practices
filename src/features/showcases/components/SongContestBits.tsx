import { clock, type Round } from '@/features/showcases/data/songContest'
import { useSongContestCopy } from '@/features/showcases/hooks/useSongContest'

/** "Voting open · Lines close in 12:04", or when the next round starts. */
export function RoundStatus({ round, now }: { round: Round; now: number }) {
  const { text } = useSongContestCopy()
  const seconds = Math.ceil(((round.open ? round.closesAt : round.nextOpensAt) - now) / 1000)
  return (
    <span className={`sc-status${round.open ? ' is-open' : ''}`}>
      <span className="sc-status__dot" aria-hidden="true" />
      <strong>{round.open ? text.common.votingOpen : text.common.votingClosed}</strong>
      <span className="sc-status__time">
        {round.open ? text.common.closesIn : text.common.opensIn}{' '}
        <time className="sc-tabular">{clock(seconds)}</time>
      </span>
    </span>
  )
}
