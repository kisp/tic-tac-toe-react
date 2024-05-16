import {createInitialBoardModel, placeMoves} from './GameModel.ts'
import {deterministicStrategy} from './Strategies.ts'

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
  })
})
