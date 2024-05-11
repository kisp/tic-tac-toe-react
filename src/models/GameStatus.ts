import {BoardModel, isEqualBoardModel, Piece} from './GameModel.ts'

export type TurnStatus = {type: 'Turn'; player: Piece}
export type WinStatus = {type: 'Won'; player: Piece}
export type DrawStatus = {type: 'Draw'}

type GameStatus = TurnStatus | WinStatus | DrawStatus

export function isTurnStatus(status: GameStatus): boolean {
  return status.type === 'Turn'
}

export function isWinStatus(status: GameStatus): boolean {
  return status.type === 'Won'
}

export function isDrawStatus(status: GameStatus): boolean {
  return status.type === 'Draw'
}

export function gameStatus(boardModel: BoardModel): GameStatus {
  console.log('checking gameStatus')
  console.log('boardModel: ', boardModel)
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
    console.log('its a win!')
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
    console.log('its a win!')
    return {type: 'Won', player: 'X'}
  }

  return {type: 'Turn', player: 'X'}
}
