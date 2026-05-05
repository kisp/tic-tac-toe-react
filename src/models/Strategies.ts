import {allFields, BoardModel, Field, isEmptyField, placeMove} from './GameModel.ts'
import {gameStatus} from './GameStatus.ts'

export type Strategy = (boardModel: BoardModel) => Field

export type StrategyName = 'deterministic' | 'random' | 'minimax'

function minimaxScore(boardModel: BoardModel, isMaximizing: boolean): number {
  const status = gameStatus(boardModel)

  if (status.type === 'Won') {
    return status.player === 'O' ? 1 : -1
  }

  if (status.type === 'Draw') {
    return 0
  }

  const emptyFields = allFields.filter(isEmptyField(boardModel))

  if (isMaximizing) {
    let bestScore = -Infinity
    for (const field of emptyFields) {
      const newBoard = placeMove(boardModel, [field, 'O'])
      const score = minimaxScore(newBoard, false)
      bestScore = Math.max(bestScore, score)
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (const field of emptyFields) {
      const newBoard = placeMove(boardModel, [field, 'X'])
      const score = minimaxScore(newBoard, true)
      bestScore = Math.min(bestScore, score)
    }
    return bestScore
  }
}

export const minimaxStrategy: Strategy = boardModel => {
  const emptyFields = allFields.filter(isEmptyField(boardModel))
  if (emptyFields.length === 0) {
    throw new Error('No empty field found in the board model')
  }

  const preferredOrder: Field[] = [4, 0, 2, 8, 6, 1, 3, 5, 7]
  const orderedEmptyFields = preferredOrder.filter(f => emptyFields.includes(f))

  let bestScore = -Infinity
  let bestField = orderedEmptyFields[0]

  for (const field of orderedEmptyFields) {
    const newBoard = placeMove(boardModel, [field, 'O'])
    const score = minimaxScore(newBoard, false)
    if (score > bestScore) {
      bestScore = score
      bestField = field
    }
  }

  return bestField
}

export const deterministicStrategy: Strategy = boardModel => {
  const emptyField = allFields.find(isEmptyField(boardModel))
  if (emptyField === undefined) {
    throw new Error('No empty field found in the board model')
  }
  return emptyField
}

export const randomStrategy: Strategy = boardModel => {
  const emptyFields = allFields.filter(isEmptyField(boardModel))
  if (emptyFields.length === 0) {
    throw new Error('No empty field found in the board model')
  }
  const randomIndex = Math.floor(Math.random() * emptyFields.length)
  return emptyFields[randomIndex]
}

export const strategyMap: Record<StrategyName, Strategy> = {
  deterministic: deterministicStrategy,
  random: randomStrategy,
  minimax: minimaxStrategy,
}
