import {createInitialBoardModel, Field, isEmptyField, placeMoves} from './GameModel.ts'
import {deterministicStrategy, randomStrategy} from './Strategies.ts'

describe('Strategies', () => {
  describe('deterministicStrategy', () => {
    it('when the board is empty', () => {
      const boardModel = createInitialBoardModel()
      expect(deterministicStrategy(boardModel)).toEqual(0)
    })

    it("when O is playing it's first move", () => {
      const boardModel = placeMoves([0, 'X'])
      expect(deterministicStrategy(boardModel)).toEqual(1)
    })

    it("when X is playing it's second move", () => {
      const boardModel = placeMoves([0, 'X'], [1, 'O'])
      expect(deterministicStrategy(boardModel)).toEqual(2)
    })

    it("when O is playing it's second move", () => {
      const boardModel = placeMoves([0, 'X'], [1, 'O'], [2, 'X'])
      expect(deterministicStrategy(boardModel)).toEqual(3)
    })

    it('throws an error when the board is full', () => {
      const boardModel = placeMoves(
        [0, 'X'],
        [1, 'O'],
        [2, 'X'],
        [3, 'O'],
        [4, 'X'],
        [5, 'O'],
        [6, 'X'],
        [7, 'O'],
        [8, 'X'],
      )
      expect(() => deterministicStrategy(boardModel)).toThrow()
    })
  })

  describe('randomStrategy', () => {
    it('returns an empty field on an empty board', () => {
      const boardModel = createInitialBoardModel()
      const field = randomStrategy(boardModel)
      expect(isEmptyField(boardModel, field)).toBe(true)
    })

    it('returns an empty field on a partially filled board', () => {
      const boardModel = placeMoves([0, 'X'], [4, 'O'])
      const field = randomStrategy(boardModel)
      expect(isEmptyField(boardModel, field)).toBe(true)
    })

    it('only returns fields that are empty on the given board', () => {
      const boardModel = placeMoves([0, 'X'], [4, 'O'])
      const results = new Set<number>()
      for (let i = 0; i < 50; i++) {
        results.add(randomStrategy(boardModel))
      }
      for (const field of results) {
        expect(isEmptyField(boardModel, field as Field)).toBe(true)
      }
    })

    it('can return different fields over multiple calls', () => {
      const boardModel = createInitialBoardModel()
      const results = new Set<number>()
      for (let i = 0; i < 50; i++) {
        results.add(randomStrategy(boardModel))
      }
      expect(results.size).toBeGreaterThan(1)
    })

    it('throws an error when the board is full', () => {
      const boardModel = placeMoves(
        [0, 'X'],
        [1, 'O'],
        [2, 'X'],
        [3, 'O'],
        [4, 'X'],
        [5, 'O'],
        [6, 'X'],
        [7, 'O'],
        [8, 'X'],
      )
      expect(() => randomStrategy(boardModel)).toThrow()
    })
  })
})
