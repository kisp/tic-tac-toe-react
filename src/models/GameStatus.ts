import {BoardModel, isEqualBoardModel, Piece} from './GameModel.ts'

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

export function gameStatus(boardModel: BoardModel): GameStatus {
  if (
    isEqualBoardModel(boardModel, [
      'X',
      'X',
      'X',
      null,
      'O',
      null,
      'O',
      null,
      null,
    ])
  ) {
    return {type: 'Won', player: 'X'}
  }

  if (
    isEqualBoardModel(boardModel, [
      'O',
      'O',
      null,
      null,
      null,
      null,
      'X',
      'X',
      'X',
    ])
  ) {
    return {type: 'Won', player: 'X'}
  }

  if (
    isEqualBoardModel(boardModel, [
      'O',
      'O',
      'O',
      null,
      'X',
      null,
      'X',
      'X',
      null,
    ])
  ) {
    return {type: 'Won', player: 'O'}
  }

  return {type: 'Turn', player: 'X'}
}
