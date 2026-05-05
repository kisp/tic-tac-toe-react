import {
  createInitialBoardModel,
  Field,
  isEmptyField,
  placeMove,
  placeMoves,
  Piece,
} from './GameModel.ts'
import {gameStatus} from './GameStatus.ts'
import {
  deterministicStrategy,
  minimaxStrategy,
  randomStrategy,
  strategyMap,
  StrategyName,
} from './Strategies.ts'

function playGame(
  board: ReturnType<typeof createInitialBoardModel>,
  xStrategy: (board: ReturnType<typeof createInitialBoardModel>) => Field,
): ReturnType<typeof createInitialBoardModel> {
  let current = board
  while (gameStatus(current).type === 'Turn') {
    const player = (gameStatus(current) as {type: 'Turn'; player: Piece}).player
    if (player === 'O') {
      current = placeMove(current, [minimaxStrategy(current), 'O'])
    } else {
      current = placeMove(current, [xStrategy(current), 'X'])
    }
  }
  return current
}

function alwaysFirstEmpty(
  board: ReturnType<typeof createInitialBoardModel>,
): Field {
  return deterministicStrategy(board)
}

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

  describe('minimaxStrategy', () => {
    it('picks the center on an empty board', () => {
      const boardModel = createInitialBoardModel()
      expect(minimaxStrategy(boardModel)).toEqual(4)
    })

    it('wins when a winning move is available', () => {
      const boardModel = placeMoves([0, 'O'], [1, 'O'], [3, 'X'], [4, 'X'])
      expect(minimaxStrategy(boardModel)).toEqual(2)
    })

    it('blocks the opponent when they have a winning move', () => {
      const boardModel = placeMoves([0, 'X'], [1, 'X'], [4, 'O'])
      expect(minimaxStrategy(boardModel)).toEqual(2)
    })

    it('prefers winning over blocking', () => {
      const boardModel = placeMoves(
        [0, 'O'],
        [1, 'O'],
        [3, 'X'],
        [6, 'X'],
        [7, 'X'],
      )
      expect(minimaxStrategy(boardModel)).toEqual(2)
    })

    it('takes the only available field', () => {
      const boardModel = placeMoves(
        [0, 'X'],
        [1, 'O'],
        [2, 'X'],
        [3, 'O'],
        [4, 'X'],
        [5, 'O'],
        [6, 'O'],
        [7, 'X'],
      )
      expect(minimaxStrategy(boardModel)).toEqual(8)
    })

    it('forces a draw from a blocked position', () => {
      const boardModel = placeMoves([0, 'X'], [2, 'X'], [4, 'O'])
      const result = minimaxStrategy(boardModel)
      const nextBoard = placeMove(boardModel, [result, 'O'])
      const finalBoard = playGame(nextBoard, alwaysFirstEmpty)
      const finalStatus = gameStatus(finalBoard)
      expect(finalStatus.type === 'Won' && finalStatus.player === 'X').toBe(
        false,
      )
    })

    it('never loses from any starting move as O', () => {
      const allStartingMoves: Field[] = [0, 1, 2, 3, 4, 5, 6, 7, 8]
      for (const start of allStartingMoves) {
        const boardModel = placeMoves([start, 'X'])
        const finalBoard = playGame(boardModel, alwaysFirstEmpty)
        const finalStatus = gameStatus(finalBoard)
        expect(finalStatus.type === 'Won' && finalStatus.player === 'X').toBe(
          false,
        )
      }
    })

    it('never loses playing full games from empty board', () => {
      const allMoves: Field[] = [0, 1, 2, 3, 4, 5, 6, 7, 8]
      for (const firstMove of allMoves) {
        let board = createInitialBoardModel()
        board = placeMove(board, [firstMove, 'X'])

        while (gameStatus(board).type === 'Turn') {
          const currentPlayer = (
            gameStatus(board) as {type: 'Turn'; player: 'X' | 'O'}
          ).player
          if (currentPlayer === 'O') {
            const move = minimaxStrategy(board)
            board = placeMove(board, [move, 'O'])
          } else {
            const emptyFields = allMoves.filter(f =>
              isEmptyField(board, f as Field),
            ) as Field[]
            board = placeMove(board, [emptyFields[0], 'X'])
          }
        }

        const finalStatus = gameStatus(board)
        expect(finalStatus.type === 'Won' && finalStatus.player === 'X').toBe(
          false,
        )
      }
    })

    it('throws an error when the board is full', () => {
      const boardModel = placeMoves(
        [0, 'X'],
        [1, 'O'],
        [2, 'X'],
        [3, 'O'],
        [4, 'X'],
        [5, 'O'],
        [6, 'O'],
        [7, 'X'],
        [8, 'X'],
      )
      expect(() => minimaxStrategy(boardModel)).toThrow()
    })
  })

  describe('strategyMap', () => {
    it('maps deterministic to deterministicStrategy', () => {
      expect(strategyMap.deterministic).toBe(deterministicStrategy)
    })

    it('maps random to randomStrategy', () => {
      expect(strategyMap.random).toBe(randomStrategy)
    })

    it('maps minimax to minimaxStrategy', () => {
      expect(strategyMap.minimax).toBe(minimaxStrategy)
    })

    it('contains exactly three strategies', () => {
      const keys = Object.keys(strategyMap) as StrategyName[]
      expect(keys).toHaveLength(3)
      expect(keys).toContain('deterministic')
      expect(keys).toContain('random')
      expect(keys).toContain('minimax')
    })
  })
})
