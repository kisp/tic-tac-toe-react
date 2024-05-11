import {createInitialBoardModel, makeMoves} from './GameModel.ts'
import {
  DrawStatus,
  gameStatus,
  isDrawStatus,
  isTurnStatus,
  isWinStatus,
  TurnStatus,
  WinStatus,
} from './GameStatus.ts'
import {describe} from 'vitest'

describe('GameStatus', () => {
  describe('gameStatus', () => {
    // TODO: gameStatus needs more tests
    it('returns a TurnStatus for X given an empty board', () => {
      const boardModel = createInitialBoardModel()
      expect(gameStatus(boardModel)).toEqual({type: 'Turn', player: 'X'})
    })

    it('returns a WinStatus', () => {
      const boardModel = makeMoves(
        [0, 'X'],
        [4, 'O'],
        [1, 'X'],
        [6, 'O'],
        [2, 'X'],
      )

      // TODO: Remove this expect(boardModel).toEqual check
      expect(boardModel).toEqual([
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

      expect(gameStatus(boardModel)).toEqual({type: 'Won', player: 'X'})
    })
  })

  describe('isWinStatus', () => {
    it('returns true for a WinStatus', () => {
      const status: WinStatus = {type: 'Won', player: 'X'}
      expect(isWinStatus(status)).toBeTruthy()
    })

    it('returns false for a different', () => {
      const status: TurnStatus = {type: 'Turn', player: 'X'}
      expect(isWinStatus(status)).toBeFalsy()
    })
  })

  describe('isTurnStatus', () => {
    it('returns true for a WinStatus', () => {
      const status: TurnStatus = {type: 'Turn', player: 'X'}
      expect(isTurnStatus(status)).toBeTruthy()
    })

    it('returns false for a different', () => {
      const status: WinStatus = {type: 'Won', player: 'X'}
      expect(isTurnStatus(status)).toBeFalsy()
    })
  })

  describe('isDrawStatus', () => {
    it('returns true for a WinStatus', () => {
      const status: DrawStatus = {type: 'Draw'}
      expect(isDrawStatus(status)).toBeTruthy()
    })

    it('returns false for a different', () => {
      const status: TurnStatus = {type: 'Turn', player: 'X'}
      expect(isDrawStatus(status)).toBeFalsy()
    })
  })
})
