import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows a greeting', () => {
    render(<App />)

    const heading = screen.getByRole('heading', {name: /react tic tac toe/i})
    expect(heading).toBeInTheDocument()
  })

  it('shows a button to start a new game', () => {
    render(<App />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent(/start new game/i)
  })

  it('does not show a game board initially', () => {
    render(<App />)

    const board = screen.queryByTestId('game')
    expect(board).not.toBeInTheDocument()
  })

  it('will show a board when the new game button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button'))

    await waitFor(() => {
      const board = screen.getByTestId('game')
      expect(board).toBeInTheDocument()
    })
  })

  it('will hide the new game button after it is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button'))

    await waitFor(() => {
      const button = screen.queryByRole('button', {name: /start new game/i})
      expect(button).not.toBeInTheDocument()
    })
  })

  it('shows a "Past Games" heading', () => {
    render(<App />)

    const heading = screen.getByRole('heading', {name: /past games/i})
    expect(heading).toBeInTheDocument()
  })

  it('shows "No games played yet" when no games have been played', () => {
    render(<App />)

    expect(screen.getByTestId('no-past-games')).toHaveTextContent(
      'No games played yet',
    )
  })

  it('does not show past game cards when no games have been played', () => {
    render(<App />)

    expect(screen.queryByTestId('past-games-list')).not.toBeInTheDocument()
  })

  it('shows strategy radio buttons with deterministic selected by default', () => {
    render(<App />)

    const deterministicRadio = screen.getByTestId('strategy-deterministic')
    const randomRadio = screen.getByTestId('strategy-random')
    const mostlyRandomRadio = screen.getByTestId('strategy-mostly-random')

    expect(deterministicRadio).toBeChecked()
    expect(randomRadio).not.toBeChecked()
    expect(mostlyRandomRadio).not.toBeChecked()
  })

  it('allows switching to random strategy', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId('strategy-random'))

    expect(screen.getByTestId('strategy-random')).toBeChecked()
    expect(screen.getByTestId('strategy-deterministic')).not.toBeChecked()
  })

  it('allows switching to mostly random strategy', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId('strategy-mostly-random'))

    expect(screen.getByTestId('strategy-mostly-random')).toBeChecked()
    expect(screen.getByTestId('strategy-deterministic')).not.toBeChecked()
  })

  it('allows switching back to deterministic strategy', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByTestId('strategy-random'))
    expect(screen.getByTestId('strategy-random')).toBeChecked()

    await user.click(screen.getByTestId('strategy-deterministic'))
    expect(screen.getByTestId('strategy-deterministic')).toBeChecked()
    expect(screen.getByTestId('strategy-random')).not.toBeChecked()
    expect(screen.getByTestId('strategy-mostly-random')).not.toBeChecked()
  })

  it('does not show Clear History button when no games have been played', () => {
    render(<App />)

    expect(screen.queryByTestId('clear-history-button')).not.toBeInTheDocument()
  })
})
