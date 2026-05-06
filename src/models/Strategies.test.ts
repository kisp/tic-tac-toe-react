import {vi} from 'vitest'
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
  mostlyRandomStrategy,
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

  describe('mostlyRandomStrategy', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    describe('Priority 1: Immediate Win', () => {
      it('plays the winning move when AI can win directly', () => {
        const boardModel = placeMoves([0, 'O'], [1, 'O'], [3, 'X'])
        const result = mostlyRandomStrategy(boardModel)
        expect(result).toEqual(2)
      })

      it('plays the winning move when AI has two in a row (column)', () => {
        const boardModel = placeMoves([0, 'O'], [3, 'O'], [1, 'X'])
        const result = mostlyRandomStrategy(boardModel)
        expect(result).toEqual(6)
      })

      it('plays the winning move when AI has two in a diagonal', () => {
        const boardModel = placeMoves([0, 'O'], [4, 'O'], [1, 'X'])
        const result = mostlyRandomStrategy(boardModel)
        expect(result).toEqual(8)
      })

      it('picks from available winning moves when multiple exist', () => {
        const boardModel = placeMoves(
          [0, 'O'],
          [1, 'O'],
          [4, 'O'],
          [3, 'X'],
          [6, 'X'],
        )
        const winningMoves: Field[] = [2, 7, 8]
        for (let i = 0; i < 20; i++) {
          const result = mostlyRandomStrategy(boardModel)
          expect(winningMoves).toContain(result)
        }
      })
    })

    describe('Priority 2: Block Opponent', () => {
      it('blocks the opponent when they can win on next move', () => {
        const boardModel = placeMoves([0, 'X'], [1, 'X'])
        const result = mostlyRandomStrategy(boardModel)
        expect(result).toEqual(2)
      })

      it('blocks the opponent column win', () => {
        const boardModel = placeMoves([0, 'X'], [3, 'X'], [4, 'O'])
        const result = mostlyRandomStrategy(boardModel)
        expect(result).toEqual(6)
      })

      it('blocks the opponent diagonal win', () => {
        const boardModel = placeMoves([2, 'X'], [4, 'X'], [0, 'O'])
        const result = mostlyRandomStrategy(boardModel)
        expect(result).toEqual(6)
      })
    })

    describe('Priority 3: Conflict Resolution', () => {
      it('randomly chooses between winning and blocking when both apply', () => {
        const boardModel = placeMoves(
          [0, 'O'],
          [1, 'O'],
          [3, 'X'],
          [6, 'X'],
          [7, 'X'],
        )
        const results = new Set<number>()
        for (let i = 0; i < 100; i++) {
          results.add(mostlyRandomStrategy(boardModel))
        }
        expect(results.has(2)).toBe(true)
      })

      it('can choose blocking move over winning move', () => {
        const boardModel = placeMoves(
          [0, 'O'],
          [1, 'O'],
          [3, 'X'],
          [6, 'X'],
          [7, 'X'],
        )
        let choseBlock = false
        for (let i = 0; i < 100; i++) {
          const result = mostlyRandomStrategy(boardModel)
          if (result === 8) {
            choseBlock = true
          }
        }
        expect(choseBlock).toBe(true)
      })

      it('can choose winning move over blocking move', () => {
        const boardModel = placeMoves(
          [0, 'O'],
          [1, 'O'],
          [3, 'X'],
          [6, 'X'],
          [7, 'X'],
        )
        let choseWin = false
        for (let i = 0; i < 100; i++) {
          const result = mostlyRandomStrategy(boardModel)
          if (result === 2) {
            choseWin = true
          }
        }
        expect(choseWin).toBe(true)
      })

      it('returns a valid field when conflict occurs', () => {
        const boardModel = placeMoves(
          [0, 'O'],
          [1, 'O'],
          [3, 'X'],
          [6, 'X'],
          [7, 'X'],
        )
        for (let i = 0; i < 50; i++) {
          const result = mostlyRandomStrategy(boardModel)
          expect(isEmptyField(boardModel, result)).toBe(true)
          expect([2, 8]).toContain(result)
        }
      })
    })

    describe('Priority 4: Random Move', () => {
      it('plays a random valid move when no immediate threats', () => {
        const boardModel = createInitialBoardModel()
        const result = mostlyRandomStrategy(boardModel)
        expect(isEmptyField(boardModel, result)).toBe(true)
      })

      it('can return different fields over multiple calls on empty board', () => {
        const boardModel = createInitialBoardModel()
        const results = new Set<number>()
        for (let i = 0; i < 50; i++) {
          results.add(mostlyRandomStrategy(boardModel))
        }
        expect(results.size).toBeGreaterThan(1)
      })

      it('plays randomly on opening move with no center/corner preference', () => {
        const boardModel = createInitialBoardModel()
        const cornerCount = [0, 2, 6, 8].length
        let cornerHits = 0
        const iterations = 500
        for (let i = 0; i < iterations; i++) {
          const result = mostlyRandomStrategy(boardModel)
          if ([0, 2, 6, 8].includes(result)) cornerHits++
        }
        const cornerRatio = cornerHits / iterations
        const expectedRatio = cornerCount / 9
        expect(cornerRatio).toBeGreaterThan(expectedRatio - 0.15)
        expect(cornerRatio).toBeLessThan(expectedRatio + 0.15)
      })

      it('plays a random valid move on a partially filled board with no threats', () => {
        const boardModel = placeMoves([4, 'X'], [0, 'O'])
        const result = mostlyRandomStrategy(boardModel)
        expect(isEmptyField(boardModel, result)).toBe(true)
      })

      it('returns different results over multiple calls with no threats', () => {
        const boardModel = placeMoves([4, 'X'], [0, 'O'])
        const results = new Set<number>()
        for (let i = 0; i < 50; i++) {
          results.add(mostlyRandomStrategy(boardModel))
        }
        expect(results.size).toBeGreaterThan(1)
      })
    })

    describe('Edge cases', () => {
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
        expect(mostlyRandomStrategy(boardModel)).toEqual(8)
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
        expect(() => mostlyRandomStrategy(boardModel)).toThrow()
      })

      it('always returns a valid empty field', () => {
        const boardModel = placeMoves([0, 'X'], [4, 'O'])
        for (let i = 0; i < 20; i++) {
          const result = mostlyRandomStrategy(boardModel)
          expect(isEmptyField(boardModel, result as Field)).toBe(true)
        }
      })

      it('blocks when opponent has two winning threats', () => {
        const boardModel = placeMoves([0, 'X'], [4, 'X'], [1, 'O'])
        const result = mostlyRandomStrategy(boardModel)
        expect([2, 8]).toContain(result)
      })
    })
  })

  describe('strategyMap', () => {
    it('maps deterministic to deterministicStrategy', () => {
      expect(strategyMap.deterministic).toBe(deterministicStrategy)
    })

    it('maps random to randomStrategy', () => {
      expect(strategyMap.random).toBe(randomStrategy)
    })

    it('maps mostlyRandom to mostlyRandomStrategy', () => {
      expect(strategyMap.mostlyRandom).toBe(mostlyRandomStrategy)
    })

    it('maps minimax to minimaxStrategy', () => {
      expect(strategyMap.minimax).toBe(minimaxStrategy)
    })

    it('contains exactly four strategies', () => {
      const keys = Object.keys(strategyMap) as StrategyName[]
      expect(keys).toHaveLength(4)
      expect(keys).toContain('deterministic')
      expect(keys).toContain('random')
      expect(keys).toContain('mostlyRandom')
      expect(keys).toContain('minimax')
    })
  })
})
