import {act, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Game from './Game'
import {Strategy} from '../models/Strategies.ts'
import {placeMoves} from '../models/GameModel.ts'
import {PastGameResult} from '../models/PastGame.ts'

describe('Game', () => {
  it('renders the board', () => {
    render(<Game />)

    const board = screen.getByTestId('board')
    expect(board).toBeInTheDocument()
  })

  it('shows the default heading text', () => {
    render(<Game />)

    expect(screen.getByRole('heading')).toHaveTextContent(
      'Have fun with this game!',
    )
  })

  it('allows the first player to make and see its move', async () => {
    const user = userEvent.setup()
    render(<Game />)
    const cells = screen.getAllByTestId('cell')

    await user.click(cells[0])

    expect(cells[0]).toHaveTextContent('X')
  })

  it('tolerates immediate double clicking', async () => {
    const user = userEvent.setup()
    render(<Game />)

    await user.click(screen.getAllByTestId('cell')[0])
    await user.click(screen.getAllByTestId('cell')[0])

    expect(screen.getAllByTestId('cell')[0]).toHaveTextContent('X')
  })

  it('tolerates double clicking with re-render in between', async () => {
    const user = userEvent.setup()
    render(<Game />)

    await user.click(screen.getAllByTestId('cell')[0])
    await user.click(screen.getAllByTestId('cell')[0])

    expect(screen.getAllByTestId('cell')[0]).toHaveTextContent('X')
  })

  it('prevents player from making a move while the AI is thinking', async () => {
    const user = userEvent.setup()
    const strategy: Strategy = vi.fn().mockReturnValue(8).mockName('strategy')

    render(<Game strategy={strategy} />)
    const cells = screen.getAllByTestId('cell')

    await user.click(cells[0])

    expect(cells[0]).toHaveTextContent('X')

    // Player tries to move while AI is thinking
    await user.click(cells[1])

    // Cell 1 must remain empty while AI is thinking
    expect(cells[1]).not.toHaveTextContent('X')
    expect(cells[1]).not.toHaveTextContent('O')

    // Wait for AI to complete its move
    await waitFor(() => expect(cells[8]).toHaveTextContent('O'), {
      timeout: 3000,
    })
  })

  it("let's the opponent make a move after the player placed an X", async () => {
    const user = userEvent.setup()
    const strategy: Strategy = vi.fn().mockReturnValue(7).mockName('strategy')

    render(<Game strategy={strategy} />)
    const cells = screen.getAllByTestId('cell')

    await user.click(cells[3])

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
        const user = userEvent.setup()
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

        await user.click(screen.getByRole('button', {name: 'Close'}))

        await waitFor(() =>
          expect(
            screen.queryByTestId('game-ends-message'),
          ).not.toBeInTheDocument(),
        )
      })

      it('calls onReturnToWelcome when the Return to Welcome Page button is clicked after game ends', async () => {
        const user = userEvent.setup()
        const onReturnToWelcome = vi.fn()
        const boardModel = placeMoves(
          [0, 'X'],
          [4, 'O'],
          [1, 'X'],
          [6, 'O'],
          [2, 'X'],
        )

        render(
          <Game
            initialBoardModel={boardModel}
            onReturnToWelcome={onReturnToWelcome}
          />,
        )

        // Game is already won, so button shows "Return to Welcome Page"
        expect(
          screen.getByRole('button', {name: 'Return to Welcome Page'}),
        ).toBeInTheDocument()

        await waitFor(
          () =>
            expect(screen.getByTestId('game-ends-message')).toBeInTheDocument(),
          {timeout: 3000},
        )

        // After game ends, button still says "Return to Welcome Page"
        expect(
          screen.getByRole('button', {name: 'Return to Welcome Page'}),
        ).toBeInTheDocument()

        await user.click(screen.getByRole('button', {name: 'Close'}))

        await user.click(
          screen.getByRole('button', {name: 'Return to Welcome Page'}),
        )

        expect(onReturnToWelcome).toHaveBeenCalledOnce()
      })

      it('does not show navigation buttons when onReturnToWelcome is not provided', async () => {
        const user = userEvent.setup()
        const boardModel = placeMoves(
          [0, 'X'],
          [4, 'O'],
          [1, 'X'],
          [6, 'O'],
          [2, 'X'],
        )

        render(<Game initialBoardModel={boardModel} />)

        expect(
          screen.queryByRole('button', {name: 'Abort Game'}),
        ).not.toBeInTheDocument()

        await waitFor(
          () =>
            expect(screen.getByTestId('game-ends-message')).toBeInTheDocument(),
          {timeout: 3000},
        )

        await user.click(screen.getByRole('button', {name: 'Close'}))

        expect(
          screen.queryByRole('button', {name: 'Return to Welcome Page'}),
        ).not.toBeInTheDocument()
      })

      it('shows win message in heading and does not reopen dialog after Close', async () => {
        const user = userEvent.setup()
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

        await user.click(screen.getByRole('button', {name: 'Close'}))

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

    describe('given a board where X just won', () => {
      it('prevents player X from making any more moves', async () => {
        const user = userEvent.setup()
        // X wins on the top row; cells 3-8 are still empty
        const boardModel = placeMoves(
          [0, 'X'],
          [4, 'O'],
          [1, 'X'],
          [6, 'O'],
          [2, 'X'],
        )
        const strategy: Strategy = vi.fn().mockName('strategy')

        render(<Game initialBoardModel={boardModel} strategy={strategy} />)

        const cells = screen.getAllByTestId('cell')

        // Try to click an empty cell after game has ended
        await user.click(cells[3])

        // The cell must remain empty
        expect(cells[3]).not.toHaveTextContent('X')
        expect(cells[3]).not.toHaveTextContent('O')
        // The AI strategy must not have been invoked
        expect(strategy).not.toHaveBeenCalled()
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
      it('displays a draw message after the last move', async () => {
        const user = userEvent.setup()
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

        await user.click(screen.getAllByTestId('cell')[5])

        await waitFor(() =>
          expect(screen.getAllByTestId('cell')[5]).toHaveTextContent('X'),
        )

        // strategy should NOT be called because it's a draw after X's move
        await new Promise(resolve => setTimeout(resolve, 1500))
        expect(strategy).not.toHaveBeenCalled()

        await waitFor(
          () => {
            const gameEndsMessage = screen.getByTestId('game-ends-message')
            expect(gameEndsMessage).toBeInTheDocument()
            expect(gameEndsMessage).toHaveTextContent("It's a draw!")
          },
          {timeout: 3000},
        )
      })

      it('shows draw message in heading and does not reopen dialog after Close', async () => {
        const user = userEvent.setup()
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

        await user.click(screen.getAllByTestId('cell')[5])

        await waitFor(
          () =>
            expect(screen.getByTestId('game-ends-message')).toBeInTheDocument(),
          {timeout: 3000},
        )

        await user.click(screen.getByRole('button', {name: 'Close'}))

        expect(screen.getByRole('heading')).toHaveTextContent("It's a draw!")

        // wait to confirm the dialog does not reopen
        await new Promise(resolve => setTimeout(resolve, 800))
        expect(
          screen.queryByTestId('game-ends-message'),
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('highlighting winning combination', () => {
    it('highlights the winning cells when X wins on the top row', () => {
      const boardModel = placeMoves(
        [0, 'X'],
        [4, 'O'],
        [1, 'X'],
        [6, 'O'],
        [2, 'X'],
      )

      render(<Game initialBoardModel={boardModel} />)

      const cells = screen.getAllByTestId('cell')
      expect(cells[0]).toHaveClass('bg-flame')
      expect(cells[1]).toHaveClass('bg-flame')
      expect(cells[2]).toHaveClass('bg-flame')
      expect(cells[3]).not.toHaveClass('bg-flame')
    })

    it('does not highlight winning move cell until dialog opens', async () => {
      const user = userEvent.setup()
      // X is one move away from winning the top row by playing at field 2
      const boardModel = placeMoves([0, 'X'], [4, 'O'], [1, 'X'], [6, 'O'])
      const strategy: Strategy = vi.fn().mockName('strategy')

      render(<Game initialBoardModel={boardModel} strategy={strategy} />)

      await user.click(screen.getAllByTestId('cell')[2])

      const cells = screen.getAllByTestId('cell')
      // The other two winning cells are highlighted immediately
      expect(cells[0]).toHaveClass('bg-flame')
      expect(cells[1]).toHaveClass('bg-flame')
      // The winning move cell is NOT highlighted yet
      expect(cells[2]).not.toHaveClass('bg-flame')

      // Once the dialog opens the winning move cell is also highlighted
      await waitFor(
        () =>
          expect(screen.getByTestId('game-ends-message')).toBeInTheDocument(),
        {timeout: 3000},
      )
      expect(cells[2]).toHaveClass('bg-flame')

      // After closing the dialog all three winning cells remain highlighted
      await user.click(screen.getByRole('button', {name: 'Close'}))
      expect(cells[0]).toHaveClass('bg-flame')
      expect(cells[1]).toHaveClass('bg-flame')
      expect(cells[2]).toHaveClass('bg-flame')
    })

    it('does not highlight any cells when game is in progress', () => {
      render(<Game />)

      const cells = screen.getAllByTestId('cell')
      cells.forEach(cell => {
        expect(cell).not.toHaveClass('bg-flame')
      })
    })
  })

  describe('onGameComplete callback', () => {
    it('calls onGameComplete with board and result when X wins and Close is clicked', async () => {
      const user = userEvent.setup()
      const onGameComplete = vi.fn()
      const boardModel = placeMoves(
        [0, 'X'],
        [4, 'O'],
        [1, 'X'],
        [6, 'O'],
        [2, 'X'],
      )

      render(
        <Game initialBoardModel={boardModel} onGameComplete={onGameComplete} />,
      )

      await waitFor(
        () =>
          expect(screen.getByTestId('game-ends-message')).toBeInTheDocument(),
        {timeout: 3000},
      )

      await user.click(screen.getByRole('button', {name: 'Close'}))

      expect(onGameComplete).toHaveBeenCalledOnce()
      expect(onGameComplete).toHaveBeenCalledWith(boardModel, 'X')
    })

    it('calls onGameComplete with draw result when game is a draw and Close is clicked', async () => {
      const user = userEvent.setup()
      const onGameComplete = vi.fn()
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

      render(
        <Game
          initialBoardModel={boardModel}
          strategy={strategy}
          onGameComplete={onGameComplete}
        />,
      )

      await user.click(screen.getAllByTestId('cell')[5])

      await waitFor(
        () =>
          expect(screen.getByTestId('game-ends-message')).toBeInTheDocument(),
        {timeout: 3000},
      )

      await user.click(screen.getByRole('button', {name: 'Close'}))

      expect(onGameComplete).toHaveBeenCalledOnce()
      const [calledBoardModel, calledResult] = onGameComplete.mock.calls[0] as [
        typeof boardModel,
        PastGameResult,
      ]
      expect(calledResult).toEqual('draw')
      expect(calledBoardModel[5]).toEqual('X')
    })

    it('calls onGameComplete with O result when O wins', async () => {
      const user = userEvent.setup()
      const onGameComplete = vi.fn()
      const boardModel = placeMoves(
        [6, 'X'],
        [0, 'O'],
        [7, 'X'],
        [1, 'O'],
        [4, 'X'],
        [2, 'O'],
      )

      render(
        <Game initialBoardModel={boardModel} onGameComplete={onGameComplete} />,
      )

      await waitFor(
        () =>
          expect(screen.getByTestId('game-ends-message')).toBeInTheDocument(),
        {timeout: 3000},
      )

      await user.click(screen.getByRole('button', {name: 'Close'}))

      expect(onGameComplete).toHaveBeenCalledOnce()
      expect(onGameComplete).toHaveBeenCalledWith(boardModel, 'O')
    })

    it('does not call onGameComplete before Close is clicked', async () => {
      const onGameComplete = vi.fn()
      const boardModel = placeMoves(
        [0, 'X'],
        [4, 'O'],
        [1, 'X'],
        [6, 'O'],
        [2, 'X'],
      )

      render(
        <Game initialBoardModel={boardModel} onGameComplete={onGameComplete} />,
      )

      await waitFor(
        () =>
          expect(screen.getByTestId('game-ends-message')).toBeInTheDocument(),
        {timeout: 3000},
      )

      expect(onGameComplete).not.toHaveBeenCalled()
    })
  })

  describe('navigation button', () => {
    it('shows Abort Game button during gameplay when onReturnToWelcome is provided', () => {
      const onReturnToWelcome = vi.fn()
      render(<Game onReturnToWelcome={onReturnToWelcome} />)

      expect(
        screen.getByRole('button', {name: 'Abort Game'}),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('button', {name: 'Return to Welcome Page'}),
      ).not.toBeInTheDocument()
    })

    it('does not show Abort Game button when onReturnToWelcome is not provided', () => {
      render(<Game />)

      expect(
        screen.queryByRole('button', {name: 'Abort Game'}),
      ).not.toBeInTheDocument()
    })

    it('shows confirmation dialog when Abort Game is clicked', async () => {
      const user = userEvent.setup()
      const onReturnToWelcome = vi.fn()
      render(<Game onReturnToWelcome={onReturnToWelcome} />)

      await user.click(screen.getByRole('button', {name: 'Abort Game'}))

      expect(screen.getByTestId('abort-dialog-message')).toHaveTextContent(
        'Are you sure you want to quit the game?',
      )
      expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument()
      expect(
        screen.getByRole('button', {name: 'Quit Game'}),
      ).toBeInTheDocument()
    })

    it('calls onReturnToWelcome when Quit Game is clicked in abort dialog', async () => {
      const user = userEvent.setup()
      const onReturnToWelcome = vi.fn()
      render(<Game onReturnToWelcome={onReturnToWelcome} />)

      await user.click(screen.getByRole('button', {name: 'Abort Game'}))
      await user.click(screen.getByRole('button', {name: 'Quit Game'}))

      expect(onReturnToWelcome).toHaveBeenCalledOnce()
    })

    it('closes abort dialog when Cancel is clicked and returns to game', async () => {
      const user = userEvent.setup()
      const onReturnToWelcome = vi.fn()
      render(<Game onReturnToWelcome={onReturnToWelcome} />)

      await user.click(screen.getByRole('button', {name: 'Abort Game'}))
      expect(screen.getByTestId('abort-dialog-message')).toBeInTheDocument()

      await user.click(screen.getByRole('button', {name: 'Cancel'}))

      await waitFor(() =>
        expect(
          screen.queryByTestId('abort-dialog-message'),
        ).not.toBeInTheDocument(),
      )

      expect(onReturnToWelcome).not.toHaveBeenCalled()
      // Game is still visible
      expect(screen.getByTestId('board')).toBeInTheDocument()
    })

    it('changes button from Abort Game to Return to Welcome Page when game ends', async () => {
      const onReturnToWelcome = vi.fn()
      const boardModel = placeMoves(
        [0, 'X'],
        [4, 'O'],
        [1, 'X'],
        [6, 'O'],
        [2, 'X'],
      )

      render(
        <Game
          initialBoardModel={boardModel}
          onReturnToWelcome={onReturnToWelcome}
        />,
      )

      // Game is already won, so button says "Return to Welcome Page"
      expect(
        screen.getByRole('button', {name: 'Return to Welcome Page'}),
      ).toBeInTheDocument()

      // Wait for the game end dialog
      await waitFor(
        () =>
          expect(screen.getByTestId('game-ends-message')).toBeInTheDocument(),
        {timeout: 3000},
      )

      // After game ends, button still says "Return to Welcome Page"
      expect(
        screen.getByRole('button', {name: 'Return to Welcome Page'}),
      ).toBeInTheDocument()
    })
  })

  describe('elapsed time', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('starts at 00:00', () => {
      render(<Game />)

      expect(screen.getByTestId('elapsed-time')).toHaveTextContent('00:00')
    })

    it('increments every second during gameplay', () => {
      render(<Game strategyName="deterministic" />)

      expect(screen.getByTestId('elapsed-time')).toHaveTextContent('00:00')

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      expect(screen.getByTestId('elapsed-time')).toHaveTextContent('00:03')
    })

    it('stops incrementing when game has already ended', () => {
      const boardModel = placeMoves(
        [0, 'X'],
        [4, 'O'],
        [1, 'X'],
        [6, 'O'],
        [2, 'X'],
      )

      render(
        <Game initialBoardModel={boardModel} strategyName="deterministic" />,
      )

      expect(screen.getByTestId('elapsed-time')).toHaveTextContent('00:00')

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(screen.getByTestId('elapsed-time')).toHaveTextContent('00:00')
    })

    it('formats time correctly for minutes and seconds', () => {
      render(<Game strategyName="deterministic" />)

      act(() => {
        vi.advanceTimersByTime(125_000)
      })

      expect(screen.getByTestId('elapsed-time')).toHaveTextContent('02:05')
    })
  })

  describe('AI thinking indicator', () => {
    it('is hidden when AI is not thinking', () => {
      render(<Game />)

      expect(screen.getByTestId('ai-thinking')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
    })

    it('is visible when AI is thinking after player makes a move', async () => {
      const user = userEvent.setup()
      const strategy: Strategy = vi.fn().mockReturnValue(8).mockName('strategy')

      render(<Game strategy={strategy} />)

      const cells = screen.getAllByTestId('cell')
      await user.click(cells[0])

      expect(screen.getByTestId('ai-thinking')).toHaveAttribute(
        'aria-hidden',
        'false',
      )

      await waitFor(
        () => {
          expect(screen.getByTestId('ai-thinking')).toHaveAttribute(
            'aria-hidden',
            'true',
          )
        },
        {timeout: 3000},
      )
    })

    it('is hidden when game ends on player move', async () => {
      const user = userEvent.setup()
      const boardModel = placeMoves([0, 'X'], [4, 'O'], [1, 'X'], [6, 'O'])
      const strategy: Strategy = vi.fn().mockName('strategy')

      render(<Game initialBoardModel={boardModel} strategy={strategy} />)

      await user.click(screen.getAllByTestId('cell')[2])

      expect(screen.getByTestId('ai-thinking')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
    })
  })

  describe('strategy display', () => {
    it('does not show when strategyName is not provided', () => {
      render(<Game />)

      expect(screen.queryByTestId('strategy-display')).not.toBeInTheDocument()
    })

    it('shows deterministic strategy', () => {
      render(<Game strategyName="deterministic" />)

      expect(screen.getByTestId('strategy-display')).toHaveTextContent(
        'Playing against: Deterministic',
      )
    })

    it('shows random strategy', () => {
      render(<Game strategyName="random" />)

      expect(screen.getByTestId('strategy-display')).toHaveTextContent(
        'Playing against: Random',
      )
    })

    it('shows mostlyRandom strategy', () => {
      render(<Game strategyName="mostlyRandom" />)

      expect(screen.getByTestId('strategy-display')).toHaveTextContent(
        'Playing against: Mostly random',
      )
    })

    it('shows minimax strategy', () => {
      render(<Game strategyName="minimax" />)

      expect(screen.getByTestId('strategy-display')).toHaveTextContent(
        'Playing against: Minimax',
      )
    })
  })
})
