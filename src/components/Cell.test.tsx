import {act, render, screen} from '@testing-library/react'
import Cell, {BorderPosition} from './Cell'

function borderClassesExcept(...classes: string[]): string[] {
  return ['border-t-0', 'border-r-0', 'border-b-0', 'border-l-0'].filter(
    className => !classes.includes(className),
  )
}

describe('Cell', () => {
  describe('accepts a piece prop', () => {
    it('displays X when passed piece X', () => {
      render(<Cell piece="X" />)
      expect(screen.getByTestId('cell')).toHaveTextContent('X')
    })

    it('displays O when passed piece O', () => {
      render(<Cell piece="O" />)
      expect(screen.getByTestId('cell')).toHaveTextContent('O')
    })

    it('displays neither when passed no piece', () => {
      render(<Cell piece={undefined} />)
      expect(screen.getByTestId('cell')).not.toHaveTextContent('X')
      expect(screen.getByTestId('cell')).not.toHaveTextContent('O')
    })
  })

  describe('click handling', () => {
    describe('when no piece is given', () => {
      it('calls the onClick function when clicked', () => {
        const handleClick = vi.fn().mockName('handleClick')

        render(<Cell onClick={handleClick} />)

        act(() => {
          const button = screen.getByTestId('cell')
          button.click()
        })

        expect(handleClick).toHaveBeenCalled()
      })
    })

    describe('when a piece is given', () => {
      it('does not call the onClick function when clicked', () => {
        const handleClick = vi.fn().mockName('handleClick')

        render(<Cell piece="X" onClick={handleClick} />)

        act(() => {
          const button = screen.getByTestId('cell')
          button.click()
        })

        expect(handleClick).not.toHaveBeenCalled()
      })
    })
  })

  describe('when requested to omit borders at specific sides', () => {
    const renderCellWithNoBorders = (...sides: BorderPosition[]) => {
      render(<Cell noBorder={sides} />)
      return screen.getByTestId('cell')
    }

    it('omits the top border', () => {
      const cell = renderCellWithNoBorders('t')

      expect(cell).toHaveClass('border-t-0')
      borderClassesExcept('border-t-0').forEach(className => {
        expect(cell).not.toHaveClass(className)
      })
    })

    it('omits the right border', () => {
      const cell = renderCellWithNoBorders('r')

      expect(cell).toHaveClass('border-r-0')
      borderClassesExcept('border-r-0').forEach(className => {
        expect(cell).not.toHaveClass(className)
      })
    })

    it('omits the bottom border', () => {
      const cell = renderCellWithNoBorders('b')

      expect(cell).toHaveClass('border-b-0')
      borderClassesExcept('border-b-0').forEach(className => {
        expect(cell).not.toHaveClass(className)
      })
    })

    it('omits the left border', () => {
      const cell = renderCellWithNoBorders('l')

      expect(cell).toHaveClass('border-l-0')
      borderClassesExcept('border-l-0').forEach(className => {
        expect(cell).not.toHaveClass(className)
      })
    })

    it('omits 2 borders', () => {
      const cell = renderCellWithNoBorders('l', 't')

      expect(cell).toHaveClass('border-l-0')
      expect(cell).toHaveClass('border-t-0')
      borderClassesExcept('border-l-0', 'border-t-0').forEach(className => {
        expect(cell).not.toHaveClass(className)
      })
    })
  })
})
