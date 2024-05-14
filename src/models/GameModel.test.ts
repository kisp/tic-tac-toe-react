import {
  allFields,
  allPieces,
  countEmptyFields,
  placeMoves,
  createInitialBoardModel,
  getFieldContent,
  isEmptyField,
  placeMove,
  Move,
  isEqualBoardModel,
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
          boardModel = placeMove(boardModel, [field, piece])
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

  describe('isEqualBoardModel', () => {
    it('returns true for equal boards', () => {
      expect(
        isEqualBoardModel(createInitialBoardModel(), createInitialBoardModel()),
      ).toBeTruthy()
    })

    it('returns false for different boards', () => {
      expect(
        isEqualBoardModel(createInitialBoardModel(), placeMoves([0, 'X'])),
      ).toBeFalsy()
    })
  })

  describe('getFieldContent', () => {
    it('returns the piece at a given field', () => {
      const boardModel = createInitialBoardModel()
      expect(getFieldContent(boardModel, 0)).toEqual(null)
    })
  })

  describe('placeMove', () => {
    it('sets X at a given field', () => {
      let boardModel = createInitialBoardModel()
      boardModel = placeMove(boardModel, [3, 'X'])
      expect(getFieldContent(boardModel, 3)).toEqual('X')
    })

    it('sets O at a given field', () => {
      let boardModel = createInitialBoardModel()
      boardModel = placeMove(boardModel, [5, 'O'])
      expect(getFieldContent(boardModel, 5)).toEqual('O')
    })

    it('does not destructively modify boardModel', () => {
      const boardModel = createInitialBoardModel()
      placeMove(boardModel, [5, 'O'])
      expect(boardModel).toEqual(createInitialBoardModel())
    })

    it('throws an error for an invalid move', () => {
      let boardModel = createInitialBoardModel()
      boardModel = placeMove(boardModel, [3, 'X'])

      expect(() => {
        placeMove(boardModel, [3, 'X'])
      }).toThrow()
    })
  })

  describe('countEmptyFields', () => {
    it('returns a count that decreases by 1 after a move', () => {
      let boardModel = createInitialBoardModel()
      expect(countEmptyFields(boardModel)).toEqual(9)
      boardModel = placeMove(boardModel, [3, 'X'])
      expect(countEmptyFields(boardModel)).toEqual(8)
    })
  })

  describe('isEmptyField', () => {
    it('returns false if there is an X', () => {
      let boardModel = createInitialBoardModel()
      boardModel = placeMove(boardModel, [0, 'X'])
      expect(isEmptyField(boardModel, 0)).toBeFalsy()
    })

    it('returns false if there is an O', () => {
      let boardModel = createInitialBoardModel()
      boardModel = placeMove(boardModel, [0, 'O'])
      expect(isEmptyField(boardModel, 0)).toBeFalsy()
    })

    it('returns true if the the field is empty', () => {
      const boardModel = createInitialBoardModel()
      expect(isEmptyField(boardModel, 0)).toBeTruthy()
    })

    describe('when called with just a boardModel', () => {
      it('returns a function that can be called with a Field', () => {
        let boardModel = createInitialBoardModel()
        boardModel = placeMove(boardModel, [0, 'X'])

        const isEmptyFieldInThisBoardModel = isEmptyField(boardModel)
        expect(isEmptyFieldInThisBoardModel).toBeTypeOf('function')
        expect(isEmptyFieldInThisBoardModel(0)).toBeFalsy()
        expect(isEmptyFieldInThisBoardModel(1)).toBeTruthy()
      })
    })
  })

  describe('placeMoves', () => {
    describe('with no args', () => {
      it('creates an empty board', () => {
        expect(placeMoves()).toEqual(createInitialBoardModel())
      })
    })

    describe('with a single arg', () => {
      it('makes that move', () => {
        const move: Move = [0, 'X']

        let expected = createInitialBoardModel()
        expected = placeMove(expected, [0, 'X'])

        expect(placeMoves(move)).toEqual(expected)
      })
    })

    describe('with two args', () => {
      it('makes those 2 moves in sequence', () => {
        const move1: Move = [0, 'X']
        const move2: Move = [1, 'O']

        let expected = createInitialBoardModel()
        expected = placeMove(expected, [0, 'X'])
        expected = placeMove(expected, [1, 'O'])

        expect(placeMoves(move1, move2)).toEqual(expected)
      })
    })

    describe('with three args', () => {
      it('makes those 3 moves in sequence', () => {
        const move1: Move = [3, 'X']
        const move2: Move = [4, 'O']
        const move3: Move = [6, 'X']

        let expected = createInitialBoardModel()
        expected = placeMove(expected, [3, 'X'])
        expected = placeMove(expected, [4, 'O'])
        expected = placeMove(expected, [6, 'X'])

        expect(placeMoves(move1, move2, move3)).toEqual(expected)
      })
    })

    describe('with a board and two args', () => {
      it('takes the board and makes those 2 moves in sequence', () => {
        let expected = createInitialBoardModel()
        expected = placeMove(expected, [3, 'X'])
        expected = placeMove(expected, [4, 'O'])
        expected = placeMove(expected, [6, 'X'])

        expect(
          placeMoves(
            placeMove(createInitialBoardModel(), [3, 'X']),
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
          placeMoves(move1, move2, move3)
        }).toThrow()
      })
    })
  })
})
