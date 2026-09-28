import { Typography } from 'antd'
import { TeamCrest } from '@/features/showcases/components/EsportsBits'
import {
  START,
  chessGameById,
  glyphs,
  material,
  positionsOf,
  squareName,
} from '@/features/showcases/data/esportsChess'
import { formatChessClock } from '@/features/showcases/data/esportsFormat'
import type { Fate, LiveState } from '@/features/showcases/data/esportsSim'
import { useEsportsCopy } from '@/features/showcases/hooks/useEsportsStore'

/**
 * The position in the chess game being played (or the last one), White at the bottom, with
 * the last move marked, both clocks and the move list.
 */
export function ChessBoard({ fate, state }: { fate: Fate; state: LiveState }) {
  const { text } = useEsportsCopy()
  const boards = fate.script.chess ?? []
  const gameIndex = Math.min(boards.length - 1, Math.max(0, state.period - 1))
  const ref = boards[gameIndex]
  const game = chessGameById.get(ref.id)!
  const moves = state.events.filter(
    (event) => event.kind === 'move' && event.period === gameIndex + 1,
  )
  const positions = positionsOf(game)
  const current = moves.length ? positions[moves.length - 1] : undefined
  const board = current?.board ?? START
  const lastMove = moves.at(-1)
  const periodStart = state.events.find(
    (event) => event.kind === 'start' && event.period === gameIndex + 1,
  )
  const gameOver = state.events.some(
    (event) => event.kind === 'periodEnd' && event.period === gameIndex + 1,
  )
  const whiteSide = ref.white
  const toMove: 'a' | 'b' = moves.length % 2 === 0 ? whiteSide : whiteSide === 'a' ? 'b' : 'a'
  const clocks: [number, number] = [
    ...(lastMove?.clocks ?? periodStart?.clocks ?? [25 * 60_000, 25 * 60_000]),
  ] as [number, number]
  if (state.started && !gameOver && !state.finished) {
    const since = state.elapsed - (lastMove?.at ?? periodStart?.at ?? state.elapsed)
    clocks[toMove === 'a' ? 0 : 1] = Math.max(0, clocks[toMove === 'a' ? 0 : 1] - since)
  }
  const worth = material(board)
  const whiteTeam = fate.teams[whiteSide === 'a' ? 0 : 1]
  const blackTeam = fate.teams[whiteSide === 'a' ? 1 : 0]
  const blackClock = clocks[whiteSide === 'a' ? 1 : 0]
  const whiteClock = clocks[whiteSide === 'a' ? 0 : 1]
  const ranks = [7, 6, 5, 4, 3, 2, 1, 0]
  const lastLabel = lastMove
    ? `${Math.ceil((lastMove.ply ?? 1) / 2)}. ${lastMove.san}`
    : text.clock.pre
  const pairs: [string, string | undefined][] = []
  for (let ply = 0; ply < moves.length; ply += 2)
    pairs.push([moves[ply].san ?? '', moves[ply + 1]?.san])

  const playerRow = (
    team: typeof whiteTeam,
    clock: number,
    colour: 'white' | 'black',
    ticking: boolean,
  ) => (
    <div className={`esp-chess__player${ticking ? ' is-ticking' : ''}`}>
      <span className="esp-tableteam">
        <span className={`esp-chess__swatch esp-chess__swatch--${colour}`} aria-hidden="true" />
        <TeamCrest team={team} size={24} />
        <strong>
          {team.roster[0]?.title ? `${team.roster[0].title} ` : ''}
          {team.name}
        </strong>
      </span>
      <span
        className="esp-chess__clock"
        aria-label={`${text.match[colour]} ${formatChessClock(clock)}`}
      >
        {formatChessClock(clock)}
      </span>
    </div>
  )

  return (
    <section className="esp-panel esp-chess">
      <div className="esp-chess__head">
        <Typography.Title level={4}>{text.match.board}</Typography.Title>
        <span className="esp-muted">
          {text.match.opening}: {game.opening}
        </span>
      </div>
      <div className="esp-chess__layout">
        <div className="esp-chess__boardwrap">
          {playerRow(
            blackTeam,
            blackClock,
            'black',
            !gameOver && state.started && toMove !== whiteSide,
          )}
          <figure className="esp-chess__board" aria-label={text.match.boardLabel(lastLabel)}>
            {ranks.flatMap((rank) =>
              [0, 1, 2, 3, 4, 5, 6, 7].map((file) => {
                const square = rank * 8 + file
                const piece = board[square]
                const dark = (rank + file) % 2 === 0
                const marked = current && (current.from === square || current.to === square)
                return (
                  <span
                    key={square}
                    className={`esp-chess__square${dark ? ' is-dark' : ''}${marked ? ' is-last' : ''}`}
                    data-square={squareName(square)}
                  >
                    {piece && (
                      <span
                        className={`esp-chess__piece${piece === piece.toUpperCase() ? ' is-white' : ' is-black'}`}
                      >
                        {glyphs[piece]}
                      </span>
                    )}
                  </span>
                )
              }),
            )}
          </figure>
          {playerRow(
            whiteTeam,
            whiteClock,
            'white',
            !gameOver && state.started && toMove === whiteSide,
          )}
          <div className="esp-chess__material">
            {text.match.material}: {text.match.white} {worth.white} · {text.match.black}{' '}
            {worth.black}
          </div>
        </div>
        <div className="esp-chess__moves">
          <Typography.Title level={5}>{text.match.moves}</Typography.Title>
          {pairs.length === 0 ? (
            <Typography.Text type="secondary">{text.match.feedEmpty}</Typography.Text>
          ) : (
            <ol className="esp-chess__list">
              {pairs.map(([white, black], index) => (
                <li key={index}>
                  <span className="esp-chess__num">{index + 1}.</span>
                  <span>{white}</span>
                  <span>{black ?? ''}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}
