import {
  allPieces,
  createInitialBoardModel,
  Field,
  placeMoves,
} from './GameModel.ts'
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

    allPieces.forEach(piece => {
      ;[0, 1, 2].forEach(row => {
        it(`returns a WinStatus for ${piece} on row ${row + 1}`, () => {
          const boardModel = placeMoves(
            [(row * 3) as Field, piece],
            [(row * 3 + 1) as Field, piece],
            [(row * 3 + 2) as Field, piece],
          )
          expect(gameStatus(boardModel)).toEqual({type: 'Won', player: piece})
        })
      })
    })

    allPieces.forEach(piece => {
      ;[0, 1, 2].forEach(column => {
        it(`returns a WinStatus for ${piece} on column ${column + 1}`, () => {
          const boardModel = placeMoves(
            [column as Field, piece],
            [(column + 3) as Field, piece],
            [(column + 6) as Field, piece],
          )
          expect(gameStatus(boardModel)).toEqual({type: 'Won', player: piece})
        })
      })
    })

    allPieces.forEach(piece => {
      ;[
        [0, 4, 8],
        [2, 4, 6],
      ].forEach((diagonal, index) => {
        it(`returns a WinStatus for ${piece} on diagonal ${index + 1}`, () => {
          const boardModel = placeMoves(
            [diagonal[0] as Field, piece],
            [diagonal[1] as Field, piece],
            [diagonal[2] as Field, piece],
          )
          expect(gameStatus(boardModel)).toEqual({type: 'Won', player: piece})
        })
      })
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
