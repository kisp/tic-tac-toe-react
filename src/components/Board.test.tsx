import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Board from './Board'
import {
  allFields,
  allPieces,
  createInitialBoardModel,
  Field,
  placeMove,
  placeMoves,
} from '../models/GameModel.ts'
import {describe} from 'vitest'

describe('Board', () => {
  it('has 9 Cells inside', () => {
    render(<Board />)

    const cells = screen.getAllByTestId('cell')
    expect(cells).toHaveLength(9)
  })

  describe('renders the given board model faithfully', () => {
    allPieces.forEach(piece => {
      allFields.forEach(field => {
        it(`correctly renders ${piece} at field ${field}`, () => {
          let boardModel = createInitialBoardModel()
          boardModel = placeMove(boardModel, [field as Field, piece])

          render(<Board boardModel={boardModel} />)

          const cells = screen.getAllByTestId('cell')
          expect(cells[field]).toHaveTextContent(piece)
        })
      })
    })
  })

  describe('accepts makeMove prop', () => {
    allFields.forEach(field => {
      it(`ensures that makeMove is called with field ${field} when clicked`, async () => {
        const user = userEvent.setup()
        const makeMove = vi.fn().mockName('makeMove')

        render(<Board onMove={makeMove} />)

        const cells = screen.getAllByTestId('cell')
        await user.click(cells[field])

        expect(makeMove).toHaveBeenCalledWith(field)
      })
    })
  })

  describe('takes care of omitting the outer borders', () => {
    let cells: HTMLElement[]

    beforeEach(() => {
      render(<Board />)
      cells = screen.getAllByTestId('cell')
    })

    it('omits the top border of the board', () => {
      expect(cells[0]).toHaveClass('border-t-0')
      expect(cells[1]).toHaveClass('border-t-0')
      expect(cells[2]).toHaveClass('border-t-0')
    })

    it('omits the right border of the board', () => {
      expect(cells[2]).toHaveClass('border-r-0')
      expect(cells[5]).toHaveClass('border-r-0')
      expect(cells[8]).toHaveClass('border-r-0')
    })

    it('omits the bottom border of the board', () => {
      expect(cells[6]).toHaveClass('border-b-0')
      expect(cells[7]).toHaveClass('border-b-0')
      expect(cells[8]).toHaveClass('border-b-0')
    })

    it('omits the left border of the board', () => {
      expect(cells[0]).toHaveClass('border-l-0')
      expect(cells[3]).toHaveClass('border-l-0')
      expect(cells[6]).toHaveClass('border-l-0')
    })
  })

  describe('winningFields', () => {
    it('highlights the winning cells when winningFields is provided', () => {
      const boardModel = placeMoves([0, 'X'], [1, 'X'], [2, 'X'])

      render(<Board boardModel={boardModel} winningFields={[0, 1, 2]} />)

      const cells = screen.getAllByTestId('cell')
      expect(cells[0]).toHaveClass('bg-yellow-300')
      expect(cells[1]).toHaveClass('bg-yellow-300')
      expect(cells[2]).toHaveClass('bg-yellow-300')
      expect(cells[3]).not.toHaveClass('bg-yellow-300')
    })

    it('does not highlight any cells when winningFields is not provided', () => {
      const boardModel = createInitialBoardModel()

      render(<Board boardModel={boardModel} />)

      const cells = screen.getAllByTestId('cell')
      cells.forEach(cell => {
        expect(cell).not.toHaveClass('bg-yellow-300')
      })
    })
  })
})
