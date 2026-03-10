import {act, render, screen, waitFor} from '@testing-library/react'
import Game from './Game'
import {Strategy} from '../models/Strategies.ts'
import {placeMoves} from '../models/GameModel.ts'

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

  it('tolerates immediate double clicking', () => {
    render(<Game />)

    act(() => {
      screen.getAllByTestId('cell')[0].click()
      screen.getAllByTestId('cell')[0].click()
    })

    expect(screen.getAllByTestId('cell')[0]).toHaveTextContent('X')
  })

  it('tolerates double clicking with re-render in between', () => {
    render(<Game />)

    act(() => {
      screen.getAllByTestId('cell')[0].click()
    })
    act(() => {
      screen.getAllByTestId('cell')[0].click()
    })

    expect(screen.getAllByTestId('cell')[0]).toHaveTextContent('X')
  })

  it('prevents player from making a move while the AI is thinking', async () => {
    const strategy: Strategy = vi.fn().mockReturnValue(8).mockName('strategy')

    render(<Game strategy={strategy} />)
    const cells = screen.getAllByTestId('cell')

    act(() => {
      cells[0].click()
    })

    expect(cells[0]).toHaveTextContent('X')

    // Player tries to move while AI is thinking
    act(() => {
      cells[1].click()
    })

    // Cell 1 must remain empty while AI is thinking
    expect(cells[1]).not.toHaveTextContent('X')
    expect(cells[1]).not.toHaveTextContent('O')

    // Wait for AI to complete its move
    await waitFor(() => expect(cells[8]).toHaveTextContent('O'), {
      timeout: 3000,
    })
  })

  it("let's the opponent make a move after the player placed an X", async () => {
    const strategy: Strategy = vi.fn().mockReturnValue(7).mockName('strategy')

    render(<Game strategy={strategy} />)
    const cells = screen.getAllByTestId('cell')

    act(() => {
      cells[3].click()
    })

    expect(cells[3]).toHaveTextContent('X')

    await waitFor(() => expect(cells[7]).toHaveTextContent('O'), {
      timeout: 3000,
    })
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
      it('displays a winning message for X', async () => {
        const boardModel = placeMoves(
          [0, 'X'],
          [4, 'O'],
          [1, 'X'],
          [6, 'O'],
          [2, 'X'],
        )

        render(<Game initialBoardModel={boardModel} />)

        await waitFor(
          () => {
            const gameEndsMessage = screen.getByTestId('game-ends-message')
            expect(gameEndsMessage).toBeInTheDocument()
            expect(gameEndsMessage).toHaveTextContent('The winner is X!')
          },
          {timeout: 3000},
        )
      })

      it('closes the dialog when the Close button is clicked', async () => {
        const boardModel = placeMoves(
          [0, 'X'],
          [4, 'O'],
          [1, 'X'],
          [6, 'O'],
          [2, 'X'],
        )

        render(<Game initialBoardModel={boardModel} />)

        await waitFor(
          () =>
            expect(screen.getByTestId('game-ends-message')).toBeInTheDocument(),
          {timeout: 3000},
        )

        act(() => {
          screen.getByRole('button', {name: 'Close'}).click()
        })

        expect(
          screen.queryByTestId('game-ends-message'),
        ).not.toBeInTheDocument()
      })

      it('shows win message in heading and does not reopen dialog after Close', async () => {
        const boardModel = placeMoves(
          [0, 'X'],
          [4, 'O'],
          [1, 'X'],
          [6, 'O'],
          [2, 'X'],
        )

        render(<Game initialBoardModel={boardModel} />)

        await waitFor(
          () =>
            expect(screen.getByTestId('game-ends-message')).toBeInTheDocument(),
          {timeout: 3000},
        )

        act(() => {
          screen.getByRole('button', {name: 'Close'}).click()
        })

        expect(screen.getByRole('heading')).toHaveTextContent(
          'The winner is X!',
        )

        // wait to confirm the dialog does not reopen
        await new Promise(resolve => setTimeout(resolve, 800))
        expect(
          screen.queryByTestId('game-ends-message'),
        ).not.toBeInTheDocument()
      })
    })

    describe('given a board where O wins', () => {
      it('displays a winning message for O', async () => {
        const boardModel = placeMoves(
          [6, 'X'],
          [0, 'O'],
          [7, 'X'],
          [1, 'O'],
          [4, 'X'],
          [2, 'O'],
        )

        render(<Game initialBoardModel={boardModel} />)

        await waitFor(
          () => {
            const gameEndsMessage = screen.getByTestId('game-ends-message')
            expect(gameEndsMessage).toBeInTheDocument()
            expect(gameEndsMessage).toHaveTextContent('The winner is O!')
          },
          {timeout: 3000},
        )
      })
    })

    describe('given a board one move away from a draw', () => {
      it('does not display a game ends message after the last move', async () => {
        // After 8 moves; X plays at field 5 to fill the board with no winner (draw)
        const boardModel = placeMoves(
          [4, 'X'],
          [0, 'O'],
          [6, 'X'],
          [2, 'O'],
          [1, 'X'],
          [7, 'O'],
          [8, 'X'],
          [3, 'O'],
        )
        const strategy: Strategy = vi.fn().mockName('strategy')

        render(<Game initialBoardModel={boardModel} strategy={strategy} />)

        act(() => {
          screen.getAllByTestId('cell')[5].click()
        })

        await waitFor(() =>
          expect(screen.getAllByTestId('cell')[5]).toHaveTextContent('X'),
        )

        // strategy should NOT be called because it's a draw after X's move
        await new Promise(resolve => setTimeout(resolve, 1500))
        expect(strategy).not.toHaveBeenCalled()
        expect(
          screen.queryByTestId('game-ends-message'),
        ).not.toBeInTheDocument()
      })
    })
  })
})
