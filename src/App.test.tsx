import {act, render, screen} from '@testing-library/react'
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

  it('will show a board when the new game button is clicked', () => {
    render(<App />)

    act(() => {
      const button = screen.getByRole('button')
      button.click()
    })

    const board = screen.getByTestId('game')
    expect(board).toBeInTheDocument()
  })

  it('will hide the new game button after it is clicked', () => {
    render(<App />)

    act(() => {
      const button = screen.getByRole('button')
      button.click()
    })

    const button = screen.queryByRole('button')
    expect(button).not.toBeInTheDocument()
  })
})
