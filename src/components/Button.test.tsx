import {act, render, screen} from '@testing-library/react'
import Button from './Button.tsx'

describe('Button', () => {
  it('renders the text content passed to it', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(/click me/i)
  })

  it('calls the onClick function when clicked', () => {
    const handleClick = vi.fn().mockName('handleClick')

    render(<Button onClick={handleClick} />)

    act(() => {
      const button = screen.getByRole('button')
      button.click()
    })

    expect(handleClick).toHaveBeenCalled()
  })

  it('can be passed a data-testid attribute', () => {
    render(<Button dataTestid="my-button" />)

    const button = screen.getByRole('button')
    expect(button.getAttribute('data-testid')).toEqual('my-button')
  })

  it('can be passed standard attributes', () => {
    render(<Button id="123" disabled />)

    const button = screen.getByRole('button')
    expect(button.getAttributeNames()).toContain('disabled')
    expect(button.id).toEqual('123')
  })
})
