import {render, screen} from '@testing-library/react'
import Board from './Board'

describe('Board', () => {
  it('has 9 Cells inside', () => {
    render(<Board />)

    const cells = screen.getAllByTestId('cell')
    expect(cells).toHaveLength(9)
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
})
