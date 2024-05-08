import {render, screen} from '@testing-library/react'
import Cell, {BorderPosition} from './Cell'

function borderClassesExcept(...classes: string[]): string[] {
  return ['border-t-0', 'border-r-0', 'border-b-0', 'border-l-0'].filter(
    className => !classes.includes(className),
  )
}

describe('Cell', () => {
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
