import * as R from 'ramda'
import {
  BoardModel,
  countEmptyFields,
  Field,
  getFieldContents,
  Piece,
} from './GameModel.ts'

export type TurnStatus = {type: 'Turn'; player: Piece}
export type WinStatus = {type: 'Won'; player: Piece}
export type DrawStatus = {type: 'Draw'}

type GameStatus = TurnStatus | WinStatus | DrawStatus

export function isTurnStatus(status: GameStatus): status is TurnStatus {
  return status.type === 'Turn'
}

export function isWinStatus(status: GameStatus): status is WinStatus {
  return status.type === 'Won'
}

export function isDrawStatus(status: GameStatus): status is DrawStatus {
  return status.type === 'Draw'
}

const rows: Field[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
]

const columns: Field[][] = [
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
]

const diagonals: Field[][] = [
  [0, 4, 8],
  [2, 4, 6],
]

const allWinningLines = R.concat(R.concat(rows, columns), diagonals)

// // TODO: Use allEquals
// const allEquals = array =>
//   !R.find(R.complement(R.identical(array[0])), array.slice(1))

// TODO: Refactor gameStatus
export function gameStatus(boardModel: BoardModel): GameStatus {
  if (
    R.any(
      fields => R.equals(['X', 'X', 'X'], getFieldContents(boardModel, fields)),
      allWinningLines,
    )
  ) {
    return {type: 'Won', player: 'X'}
  }

  if (
    R.any(
      fields => R.equals(['O', 'O', 'O'], getFieldContents(boardModel, fields)),
      allWinningLines,
    )
  ) {
    return {type: 'Won', player: 'O'}
  }

  const emptyFields = countEmptyFields(boardModel)

  if (emptyFields === 0) {
    return {type: 'Draw'}
  } else {
    return {type: 'Turn', player: emptyFields % 2 === 0 ? 'O' : 'X'}
  }
}
