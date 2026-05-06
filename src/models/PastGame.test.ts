import {
  createPastGame,
  formatAbsoluteTime,
  formatRelativeTime,
  resultLabel,
  strategyLabel,
} from './PastGame.ts'
import {placeMoves} from './GameModel.ts'
import {describe} from 'vitest'

describe('PastGame', () => {
  describe('createPastGame', () => {
    it('creates a past game with an X win result', () => {
      const boardModel = placeMoves(
        [0, 'X'],
        [4, 'O'],
        [1, 'X'],
        [6, 'O'],
        [2, 'X'],
      )
      const game = createPastGame(boardModel, 'X', 'deterministic')

      expect(game.result).toEqual('X')
      expect(game.strategy).toEqual('deterministic')
      expect(game.boardModel).toEqual(boardModel)
      expect(game.id).toBeTruthy()
      expect(typeof game.timestamp).toBe('number')
    })

    it('creates a past game with an O win result', () => {
      const boardModel = placeMoves(
        [6, 'X'],
        [0, 'O'],
        [7, 'X'],
        [1, 'O'],
        [4, 'X'],
        [2, 'O'],
      )
      const game = createPastGame(boardModel, 'O', 'minimax')

      expect(game.result).toEqual('O')
      expect(game.strategy).toEqual('minimax')
    })

    it('creates a past game with a draw result', () => {
      const boardModel = placeMoves(
        [4, 'X'],
        [0, 'O'],
        [6, 'X'],
        [2, 'O'],
        [1, 'X'],
        [7, 'O'],
        [8, 'X'],
        [3, 'O'],
        [5, 'X'],
      )
      const game = createPastGame(boardModel, 'draw', 'random')

      expect(game.result).toEqual('draw')
      expect(game.strategy).toEqual('random')
    })

    it('generates unique ids', () => {
      const boardModel = placeMoves(
        [0, 'X'],
        [4, 'O'],
        [1, 'X'],
        [6, 'O'],
        [2, 'X'],
      )
      const game1 = createPastGame(boardModel, 'X', 'deterministic')
      const game2 = createPastGame(boardModel, 'X', 'deterministic')

      expect(game1.id).not.toEqual(game2.id)
    })
  })

  describe('resultLabel', () => {
    it('returns "X won!" for X result', () => {
      expect(resultLabel('X')).toEqual('X won!')
    })

    it('returns "O won!" for O result', () => {
      expect(resultLabel('O')).toEqual('O won!')
    })

    it('returns "Draw" for draw result', () => {
      expect(resultLabel('draw')).toEqual('Draw')
    })
  })

  describe('strategyLabel', () => {
    it('capitalizes deterministic', () => {
      expect(strategyLabel('deterministic')).toEqual('Deterministic')
    })

    it('capitalizes random', () => {
      expect(strategyLabel('random')).toEqual('Random')
    })

    it('capitalizes minimax', () => {
      expect(strategyLabel('minimax')).toEqual('Minimax')
    })

    it('labels mostlyRandom as Mostly random', () => {
      expect(strategyLabel('mostlyRandom')).toEqual('Mostly random')
    })
  })

  describe('formatRelativeTime', () => {
    const now = 1700000000000

    it('returns "just now" for less than 45 seconds ago', () => {
      expect(formatRelativeTime(now - 30000, now)).toEqual('just now')
      expect(formatRelativeTime(now - 44000, now)).toEqual('just now')
      expect(formatRelativeTime(now, now)).toEqual('just now')
    })

    it('returns "1m ago" for 45-89 seconds ago', () => {
      expect(formatRelativeTime(now - 45000, now)).toEqual('1m ago')
      expect(formatRelativeTime(now - 89000, now)).toEqual('1m ago')
    })

    it('returns minutes ago for 90 seconds to ~44 minutes', () => {
      expect(formatRelativeTime(now - 90000, now)).toEqual('2m ago')
      expect(formatRelativeTime(now - 300000, now)).toEqual('5m ago')
      expect(formatRelativeTime(now - 2640000, now)).toEqual('44m ago')
    })

    it('returns "1h ago" for ~45-89 minutes ago', () => {
      expect(formatRelativeTime(now - 3600000, now)).toEqual('1h ago')
      expect(formatRelativeTime(now - 5340000, now)).toEqual('1h ago')
    })

    it('returns hours ago for 90 minutes to ~22 hours', () => {
      expect(formatRelativeTime(now - 7200000, now)).toEqual('2h ago')
      expect(formatRelativeTime(now - 36000000, now)).toEqual('10h ago')
    })

    it('returns "1d ago" for ~22-48 hours ago', () => {
      expect(formatRelativeTime(now - 86400000, now)).toEqual('1d ago')
    })

    it('returns days ago for 2-56 days', () => {
      expect(formatRelativeTime(now - 259200000, now)).toEqual('3d ago')
    })

    it('returns "1mo ago" for ~56-112 days ago', () => {
      expect(formatRelativeTime(now - 5184000000, now)).toEqual('1mo ago')
    })

    it('returns months ago for over 112 days', () => {
      expect(formatRelativeTime(now - 15552000000, now)).toEqual('6mo ago')
    })

    it('returns "1y ago" for over a year', () => {
      expect(formatRelativeTime(now - 31536000000, now)).toEqual('1y ago')
    })

    it('uses Date.now() as default for now parameter', () => {
      const result = formatRelativeTime(Date.now() - 10000)
      expect(result).toEqual('just now')
    })
  })

  describe('formatAbsoluteTime', () => {
    it('formats a timestamp as human-readable date and time', () => {
      const timestamp = new Date('2026-12-06T15:45:00').getTime()
      const result = formatAbsoluteTime(timestamp)
      expect(result).toContain('December')
      expect(result).toContain('2026')
      expect(result).toContain('6')
    })

    it('includes the time with AM/PM', () => {
      const timestamp = new Date('2026-06-15T09:30:00').getTime()
      const result = formatAbsoluteTime(timestamp)
      expect(result).toMatch(/\d+:\d+ (AM|PM)/)
    })
  })
})
