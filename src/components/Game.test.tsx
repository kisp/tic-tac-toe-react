import {act, render, screen, waitFor} from '@testing-library/react'
import Game from './Game'
import {Strategy} from '../models/Strategies.ts'
import {makeMoves} from '../models/GameModel.ts'

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

  it("let's the opponent make a move after the player placed an X", async () => {
    const strategy: Strategy = vi.fn().mockReturnValue(7).mockName('strategy')

    render(<Game strategy={strategy} />)
    const cells = screen.getAllByTestId('cell')

    act(() => {
      cells[3].click()
    })

    expect(cells[3]).toHaveTextContent('X')

    await waitFor(() => expect(cells[7]).toHaveTextContent('O'))
  })

  describe('ending the game', () => {
    describe('given an empty board', () => {
      it('does not display a game ends message', () => {
        render(<Game />)

        const gameEndsMessage = screen.queryByTestId('game-ends-message')
        expect(gameEndsMessage).not.toBeInTheDocument()
      })
    })

    describe('given a board where X wins', () => {
      it('displays a winning message for X', () => {
        const boardModel = makeMoves(
          [0, 'X'],
          [4, 'O'],
          [1, 'X'],
          [6, 'O'],
          [2, 'X'],
        )

        render(<Game initialBoardModel={boardModel} />)

        const gameEndsMessage = screen.getByTestId('game-ends-message')
        expect(gameEndsMessage).toBeInTheDocument()
        expect(gameEndsMessage).toHaveTextContent('The winner is X!')
      })
    })

    describe('given a board where O wins', () => {
      it('displays a winning message for O', () => {
        const boardModel = makeMoves(
          [6, 'X'],
          [0, 'O'],
          [7, 'X'],
          [1, 'O'],
          [4, 'X'],
          [2, 'O'],
        )

        render(<Game initialBoardModel={boardModel} />)

        const gameEndsMessage = screen.getByTestId('game-ends-message')
        expect(gameEndsMessage).toBeInTheDocument()
        expect(gameEndsMessage).toHaveTextContent('The winner is O!')
      })
    })
  })
})
