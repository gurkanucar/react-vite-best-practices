/*
 * Pre-scripted chess games for the live broadcasts. The moves are well-known openings and
 * classic miniatures, written in standard algebraic notation. They are replayed on a small
 * board model: no engine, only enough rules to find which piece each move belongs to.
 */

export type ChessResult = '1-0' | '0-1' | '1/2-1/2'
export type ChessEnding = 'mate' | 'resign' | 'repetition' | 'agreed'

export interface ChessGame {
  id: string
  opening: string
  moves: string[]
  result: ChessResult
  ending: ChessEnding
}

const parse = (text: string) =>
  text
    .split(/\s+/)
    .filter((token) => token && !/^\d+\.$/.test(token))
    .map((token) => token.replace(/^\d+\./, ''))

export const chessGames: ChessGame[] = [
  {
    id: 'opera',
    opening: 'Philidor Defence',
    moves: parse(
      '1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6 15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8#',
    ),
    result: '1-0',
    ending: 'mate',
  },
  {
    id: 'legal',
    opening: 'Philidor Defence',
    moves: parse('1.e4 e5 2.Nf3 d6 3.Bc4 Bg4 4.Nc3 g6 5.Nxe5 Bxd1 6.Bxf7+ Ke7 7.Nd5#'),
    result: '1-0',
    ending: 'mate',
  },
  {
    id: 'petrov-trap',
    opening: 'Petrov Defence',
    moves: parse('1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nxe4 4.Qe2 Nf6 5.Nc6+'),
    result: '1-0',
    ending: 'resign',
  },
  {
    id: 'blackburne',
    opening: 'Italian Game',
    moves: parse('1.e4 e5 2.Nf3 Nc6 3.Bc4 Nd4 4.Nxe5 Qg5 5.Nxf7 Qxg2 6.Rf1 Qxe4+ 7.Be2 Nf3#'),
    result: '0-1',
    ending: 'mate',
  },
  {
    id: 'albin',
    opening: 'Albin Countergambit',
    moves: parse(
      '1.d4 d5 2.c4 e5 3.dxe5 d4 4.e3 Bb4+ 5.Bd2 dxe3 6.Bxb4 exf2+ 7.Ke2 fxg1=N+ 8.Ke1 Qh4+ 9.Kd2 Nc6 10.Bc3 Bg4',
    ),
    result: '0-1',
    ending: 'resign',
  },
  {
    id: 'italian-repetition',
    opening: 'Giuoco Piano',
    moves: parse(
      '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6 6.O-O O-O 7.Re1 a6 8.Bb3 Ba7 9.h3 h6 10.Nbd2 Re8 11.Nf1 Be6 12.Bc2 d5 13.exd5 Bxd5 14.Ng3 Qd6 15.Nh4 Bb6 16.Nhf5 Qd7 17.Nh4 Qd6 18.Nhf5 Qd7 19.Nh4 Qd6',
    ),
    result: '1/2-1/2',
    ending: 'repetition',
  },
  {
    id: 'qgd-agreed',
    opening: 'Queen’s Gambit Declined',
    moves: parse(
      '1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 Nbd7 7.Rc1 c6 8.Bd3 dxc4 9.Bxc4 Nd5 10.Bxe7 Qxe7 11.O-O Nxc3 12.Rxc3 e5 13.Qc2 exd4 14.exd4 Nf6 15.Re1 Qd6 16.Ne5 Be6 17.Bxe6 fxe6',
    ),
    result: '1/2-1/2',
    ending: 'agreed',
  },
]

export const chessGameById = new Map(chessGames.map((game) => [game.id, game]))

/* ---------- A tiny board ---------- */

/** 64 squares, a1 = 0, h8 = 63. Upper case is White, lower case Black, '' is empty. */
export type Board = string[]

export const START: Board = (() => {
  const board: Board = Array(64).fill('')
  const back = 'RNBQKBNR'
  for (let file = 0; file < 8; file += 1) {
    board[file] = back[file]
    board[8 + file] = 'P'
    board[48 + file] = 'p'
    board[56 + file] = back[file].toLowerCase()
  }
  return board
})()

const fileOf = (square: number) => square % 8
const rankOf = (square: number) => Math.floor(square / 8)
const squareOf = (name: string) => name.charCodeAt(0) - 97 + (Number(name[1]) - 1) * 8
export const squareName = (square: number) =>
  `${String.fromCharCode(97 + fileOf(square))}${rankOf(square) + 1}`
const isWhite = (piece: string) => piece !== '' && piece === piece.toUpperCase()

/** Whether the piece on `from` attacks `to`, ignoring whose turn it is. */
function attacks(board: Board, from: number, to: number) {
  const piece = board[from]
  if (!piece || from === to) return false
  const df = fileOf(to) - fileOf(from)
  const dr = rankOf(to) - rankOf(from)
  const type = piece.toUpperCase()
  const clear = (stepFile: number, stepRank: number) => {
    let file = fileOf(from) + stepFile
    let rank = rankOf(from) + stepRank
    while (file !== fileOf(to) || rank !== rankOf(to)) {
      if (board[rank * 8 + file]) return false
      file += stepFile
      rank += stepRank
    }
    return true
  }
  switch (type) {
    case 'P':
      return Math.abs(df) === 1 && dr === (isWhite(piece) ? 1 : -1)
    case 'N':
      return (
        (Math.abs(df) === 1 && Math.abs(dr) === 2) || (Math.abs(df) === 2 && Math.abs(dr) === 1)
      )
    case 'K':
      return Math.max(Math.abs(df), Math.abs(dr)) === 1
    case 'B':
      return Math.abs(df) === Math.abs(dr) && clear(Math.sign(df), Math.sign(dr))
    case 'R':
      return (df === 0 || dr === 0) && clear(Math.sign(df), Math.sign(dr))
    case 'Q':
      return (
        (Math.abs(df) === Math.abs(dr) || df === 0 || dr === 0) &&
        clear(Math.sign(df), Math.sign(dr))
      )
  }
  return false
}

function kingInCheck(board: Board, white: boolean) {
  const king = board.indexOf(white ? 'K' : 'k')
  return board.some(
    (piece, square) => piece && isWhite(piece) !== white && attacks(board, square, king),
  )
}

export interface AppliedMove {
  board: Board
  from: number
  to: number
}

/** Plays one SAN move. Throws if the move does not fit the position exactly once. */
export function applySan(board: Board, san: string, white: boolean): AppliedMove {
  const move = san.replace(/[+#!?]/g, '')
  const next = [...board]
  if (move === 'O-O' || move === 'O-O-O') {
    const rank = white ? 0 : 56
    const long = move === 'O-O-O'
    const [kingTo, rookFrom, rookTo] = long ? [2, 0, 3] : [6, 7, 5]
    next[rank + 4] = ''
    next[rank + rookFrom] = ''
    next[rank + kingTo] = white ? 'K' : 'k'
    next[rank + rookTo] = white ? 'R' : 'r'
    return { board: next, from: rank + 4, to: rank + kingTo }
  }
  const match = /^([NBRQK])?([a-h])?([1-8])?(x)?([a-h][1-8])(=([NBRQ]))?$/.exec(move)
  if (!match) throw new Error(`Unreadable move ${san}`)
  const [, pieceLetter, fromFile, fromRank, capture, target, , promotion] = match
  const to = squareOf(target)
  const type = pieceLetter ?? 'P'
  const own = white ? type : type.toLowerCase()
  const candidates = board
    .map((piece, square) => (piece === own ? square : -1))
    .filter((square) => square >= 0)
    .filter((square) => !fromFile || fileOf(square) === fromFile.charCodeAt(0) - 97)
    .filter((square) => !fromRank || rankOf(square) === Number(fromRank) - 1)
    .filter((square) => {
      if (board[to] && isWhite(board[to]) === white) return false
      if (type !== 'P') return attacks(board, square, to)
      const step = white ? 8 : -8
      if (capture) return attacks(board, square, to)
      if (square + step === to) return !board[to]
      const home = white ? 1 : 6
      return (
        rankOf(square) === home && square + 2 * step === to && !board[square + step] && !board[to]
      )
    })
    .filter((square) => {
      // A pinned piece cannot move; this is what makes the move unique.
      const trial = [...board]
      trial[to] = trial[square]
      trial[square] = ''
      return !kingInCheck(trial, white)
    })
  if (candidates.length !== 1) throw new Error(`Move ${san} fits ${candidates.length} pieces`)
  const from = candidates[0]
  if (type === 'P' && capture && !board[to]) next[to + (white ? -8 : 8)] = ''
  next[to] = promotion ? (white ? promotion : promotion.toLowerCase()) : board[from]
  next[from] = ''
  return { board: next, from, to }
}

const positions = new Map<string, AppliedMove[]>()

/** Every position of a game, one per ply. */
export function positionsOf(game: ChessGame): AppliedMove[] {
  const cached = positions.get(game.id)
  if (cached) return cached
  const list: AppliedMove[] = []
  let board = START
  game.moves.forEach((san, ply) => {
    const applied = applySan(board, san, ply % 2 === 0)
    list.push(applied)
    board = applied.board
  })
  positions.set(game.id, list)
  return list
}

/** Unicode glyphs for the board view. */
export const glyphs: Record<string, string> = {
  K: '♔',
  Q: '♕',
  R: '♖',
  B: '♗',
  N: '♘',
  P: '♙',
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
}

/** Material in pawns (Q 9, R 5, B/N 3, P 1) for each colour. */
export function material(board: Board): { white: number; black: number } {
  const value: Record<string, number> = { q: 9, r: 5, b: 3, n: 3, p: 1, k: 0 }
  let white = 0
  let black = 0
  for (const piece of board) {
    if (!piece) continue
    if (isWhite(piece)) white += value[piece.toLowerCase()]
    else black += value[piece]
  }
  return { white, black }
}
