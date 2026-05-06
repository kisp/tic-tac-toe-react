import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {BoardModel, Piece} from './GameModel.ts'
import {StrategyName} from './Strategies.ts'

dayjs.extend(relativeTime)

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
  const labels: Record<StrategyName, string> = {
    deterministic: 'Deterministic',
    random: 'Random',
    mostlyRandom: 'Mostly random',
    minimax: 'Minimax',
  }
  return labels[strategy]
}

export function formatRelativeTime(
  timestamp: number,
  now: number = Date.now(),
): string {
  const diffMs = now - timestamp
  const diffSeconds = Math.floor(diffMs / 1000)

  if (diffSeconds < 45) return 'just now'
  if (diffSeconds < 90) return '1m ago'
  if (diffSeconds < 2670) return `${Math.round(diffSeconds / 60)}m ago`
  if (diffSeconds < 5340) return '1h ago'
  if (diffSeconds < 80640) return `${Math.round(diffSeconds / 3600)}h ago`
  if (diffSeconds < 161280) return '1d ago'
  if (diffSeconds < 4838400) return `${Math.round(diffSeconds / 86400)}d ago`
  if (diffSeconds < 9676800) return '1mo ago'
  if (diffSeconds < 31536000)
    return `${Math.round(diffSeconds / 2592000)}mo ago`
  return '1y ago'
}

export function formatAbsoluteTime(timestamp: number): string {
  return dayjs(timestamp).format('MMMM D, YYYY [at] h:mm A')
}
