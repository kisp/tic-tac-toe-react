import {
  allFields,
  allPieces,
  countEmptyFields,
  createInitialBoardModel,
  getFieldContent,
  setFieldContent,
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
          boardModel = setFieldContent(boardModel, field, piece)
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

  describe('setFieldContent', () => {
    it('sets X at a given field', () => {
      let boardModel = createInitialBoardModel()
      boardModel = setFieldContent(boardModel, 3, 'X')
      expect(getFieldContent(boardModel, 3)).toEqual('X')
    })

    it('sets O at a given field', () => {
      let boardModel = createInitialBoardModel()
      boardModel = setFieldContent(boardModel, 5, 'O')
      expect(getFieldContent(boardModel, 5)).toEqual('O')
    })

    it('does not destructively modify boardModel', () => {
      const boardModel = createInitialBoardModel()
      setFieldContent(boardModel, 5, 'O')
      expect(boardModel).toEqual(createInitialBoardModel())
    })
  })

  describe('countEmptyFields', () => {
    it('returns a count that decreases by 1 after a move', () => {
      let boardModel = createInitialBoardModel()
      expect(countEmptyFields(boardModel)).toEqual(9)
      boardModel = setFieldContent(boardModel, 3, 'X')
      expect(countEmptyFields(boardModel)).toEqual(8)
    })
  })
})
