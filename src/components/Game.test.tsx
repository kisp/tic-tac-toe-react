import {act, render, screen} from '@testing-library/react'
import Game from './Game'

describe('Game', () => {
  it('renders the board', () => {
    render(<Game />)

    const board = screen.getByTestId('board')
    expect(board).toBeInTheDocument()
  })

  it('allows the first player to make and see its move', () => {
    render(<Game />)

    const cells = screen.getAllByTestId('cell')

    act(() => {
      cells[0].click()
    })

    expect(cells[0]).toHaveTextContent('X')
  })
})
