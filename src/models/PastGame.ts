import {BoardModel, Piece} from './GameModel.ts'
import {StrategyName} from './Strategies.ts'

export type PastGameResult = Piece | 'draw'

export type PastGame = {
  id: string
  boardModel: BoardModel
  result: PastGameResult
  strategy: StrategyName
  timestamp: number
}

export function createPastGame(
  boardModel: BoardModel,
  result: PastGameResult,
  strategy: StrategyName,
): PastGame {
  return {
    id: crypto.randomUUID(),
    boardModel,
    result,
    strategy,
    timestamp: Date.now(),
  }
}

export function resultLabel(result: PastGameResult): string {
  if (result === 'draw') return 'Draw'
  return `${result} won!`
}

export function strategyLabel(strategy: StrategyName): string {
  return strategy.charAt(0).toUpperCase() + strategy.slice(1)
}
