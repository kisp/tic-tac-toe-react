import {
  allFields,
  allPieces,
  countEmptyFields,
  makeMoves,
  createInitialBoardModel,
  getFieldContent,
  isEmptyField,
  makeMove,
  Move,
} from './GameModel.ts'
import {describe} from 'vitest'

describe('GameModel', () => {
  describe('the board can be completely filled with Xs or Os', () => {
    // This means that we can have a board that is not a valid game
    // state. At least for now...

    allPieces.forEach(piece => {
      it(`filled with ${piece}s`, () => {
        let boardModel = createInitialBoardModel()

        allFields.forEach(field => {
          boardModel = makeMove(boardModel, [field, piece])
        })

        allFields.forEach(field => {
          expect(getFieldContent(boardModel, field)).toEqual(piece)
        })
      })
    })
  })

  describe('createInitialBoardModel', () => {
    it('creates a completely empty board', () => {
      const boardModel = createInitialBoardModel()
      expect(countEmptyFields(boardModel)).toEqual(9)
    })
  })

  describe('getFieldContent', () => {
    it('returns the piece at a given field', () => {
      const boardModel = createInitialBoardModel()
      expect(getFieldContent(boardModel, 0)).toEqual(null)
    })
  })

  describe('makeMove', () => {
    it('sets X at a given field', () => {
      let boardModel = createInitialBoardModel()
      boardModel = makeMove(boardModel, [3, 'X'])
      expect(getFieldContent(boardModel, 3)).toEqual('X')
    })

    it('sets O at a given field', () => {
      let boardModel = createInitialBoardModel()
      boardModel = makeMove(boardModel, [5, 'O'])
      expect(getFieldContent(boardModel, 5)).toEqual('O')
    })

    it('does not destructively modify boardModel', () => {
      const boardModel = createInitialBoardModel()
      makeMove(boardModel, [5, 'O'])
      expect(boardModel).toEqual(createInitialBoardModel())
    })

    it('throws an error for an invalid move', () => {
      let boardModel = createInitialBoardModel()
      boardModel = makeMove(boardModel, [3, 'X'])

      expect(() => {
        makeMove(boardModel, [3, 'X'])
      }).toThrow()
    })
  })

  describe('countEmptyFields', () => {
    it('returns a count that decreases by 1 after a move', () => {
      let boardModel = createInitialBoardModel()
      expect(countEmptyFields(boardModel)).toEqual(9)
      boardModel = makeMove(boardModel, [3, 'X'])
      expect(countEmptyFields(boardModel)).toEqual(8)
    })
  })

  describe('isFreeField', () => {
    it('returns false if there is an X', () => {
      let boardModel = createInitialBoardModel()
      boardModel = makeMove(boardModel, [0, 'X'])
      expect(isEmptyField(boardModel, 0)).toBeFalsy()
    })

    it('returns false if there is an O', () => {
      let boardModel = createInitialBoardModel()
      boardModel = makeMove(boardModel, [0, 'O'])
      expect(isEmptyField(boardModel, 0)).toBeFalsy()
    })

    it('returns true if the the field is empty', () => {
      const boardModel = createInitialBoardModel()
      expect(isEmptyField(boardModel, 0)).toBeTruthy()
    })
  })

  describe('createBoardModel', () => {
    describe('with no args', () => {
      it('creates an empty board', () => {
        expect(makeMoves()).toEqual(createInitialBoardModel())
      })
    })

    describe('with a single arg', () => {
      it('makes that move', () => {
        const move: Move = [0, 'X']

        let expected = createInitialBoardModel()
        expected = makeMove(expected, [0, 'X'])

        expect(makeMoves(move)).toEqual(expected)
      })
    })

    describe('with two args', () => {
      it('makes those 2 moves in sequence', () => {
        const move1: Move = [0, 'X']
        const move2: Move = [1, 'O']

        let expected = createInitialBoardModel()
        expected = makeMove(expected, [0, 'X'])
        expected = makeMove(expected, [1, 'O'])

        expect(makeMoves(move1, move2)).toEqual(expected)
      })
    })

    describe('with three args', () => {
      it('makes those 3 moves in sequence', () => {
        const move1: Move = [3, 'X']
        const move2: Move = [4, 'O']
        const move3: Move = [6, 'X']

        let expected = createInitialBoardModel()
        expected = makeMove(expected, [3, 'X'])
        expected = makeMove(expected, [4, 'O'])
        expected = makeMove(expected, [6, 'X'])

        expect(makeMoves(move1, move2, move3)).toEqual(expected)
      })
    })

    describe('with a board and two args', () => {
      it('takes the board and makes those 2 moves in sequence', () => {
        let expected = createInitialBoardModel()
        expected = makeMove(expected, [3, 'X'])
        expected = makeMove(expected, [4, 'O'])
        expected = makeMove(expected, [6, 'X'])

        expect(
          makeMoves(
            makeMove(createInitialBoardModel(), [3, 'X']),
            [4, 'O'],
            [6, 'X'],
          ),
        ).toEqual(expected)
      })
    })

    describe('given an invalid move', () => {
      it('throws an error', () => {
        const move1: Move = [3, 'X']
        const move2: Move = [4, 'O']
        const move3: Move = [3, 'X']

        expect(() => {
          makeMoves(move1, move2, move3)
        }).toThrow()
      })
    })
  })
})
