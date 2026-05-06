import {createPastGame, resultLabel, strategyLabel} from './PastGame.ts'
import {placeMoves} from './GameModel.ts'
import {describe} from 'vitest'

describe('PastGame', () => {
  describe('createPastGame', () => {
    it('creates a past game with an X win result', () => {
      const boardModel = placeMoves([0, 'X'], [4, 'O'], [1, 'X'], [6, 'O'], [2, 'X'])
      const game = createPastGame(boardModel, 'X', 'deterministic')

      expect(game.result).toEqual('X')
      expect(game.strategy).toEqual('deterministic')
      expect(game.boardModel).toEqual(boardModel)
      expect(game.id).toBeTruthy()
      expect(typeof game.timestamp).toBe('number')
    })

    it('creates a past game with an O win result', () => {
      const boardModel = placeMoves([6, 'X'], [0, 'O'], [7, 'X'], [1, 'O'], [4, 'X'], [2, 'O'])
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
      const boardModel = placeMoves([0, 'X'], [4, 'O'], [1, 'X'], [6, 'O'], [2, 'X'])
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
  })
})