import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
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

  it('shows 3 past game boards', () => {
    render(<App />)

    const boards = screen.getAllByTestId('board')
    expect(boards).toHaveLength(3)
  })
})
