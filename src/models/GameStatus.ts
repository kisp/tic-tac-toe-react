import * as R from 'ramda'
import {
  BoardModel,
  countEmptyFields,
  Field,
  getFieldContents,
  isEqualBoardModel,
  Piece,
  PieceOrEmpty,
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

// TODO: Refactor gameStatus
export function gameStatus(boardModel: BoardModel): GameStatus {
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

  if (
    R.any(
      fields => R.equals(['X', 'X', 'X'], getFieldContents(boardModel, fields)),
      rows,
    )
  ) {
    return {type: 'Won', player: 'X'}
  }

  if (
    R.any(
      fields => R.equals(['O', 'O', 'O'], getFieldContents(boardModel, fields)),
      rows,
    )
  ) {
    return {type: 'Won', player: 'O'}
  }

  if (
    R.any(
      fields => R.equals(['X', 'X', 'X'], getFieldContents(boardModel, fields)),
      columns,
    )
  ) {
    return {type: 'Won', player: 'X'}
  }

  if (
    R.any(
      fields => R.equals(['O', 'O', 'O'], getFieldContents(boardModel, fields)),
      columns,
    )
  ) {
    return {type: 'Won', player: 'O'}
  }

  if (
    R.any(
      fields => R.equals(['X', 'X', 'X'], getFieldContents(boardModel, fields)),
      diagonals,
    )
  ) {
    return {type: 'Won', player: 'X'}
  }

  if (
    R.any(
      fields => R.equals(['O', 'O', 'O'], getFieldContents(boardModel, fields)),
      diagonals,
    )
  ) {
    return {type: 'Won', player: 'O'}
  }

  let turnPlayer: PieceOrEmpty

  switch (countEmptyFields(boardModel)) {
    case 9:
    case 7:
    case 5:
    case 3:
    case 1:
      turnPlayer = 'X'
      break
    case 8:
    case 6:
    case 4:
    case 2:
      turnPlayer = 'O'
      break
    default:
      turnPlayer = null
  }

  if (turnPlayer) return {type: 'Turn', player: turnPlayer}
  else return {type: 'Draw'}
}
