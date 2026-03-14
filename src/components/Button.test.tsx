import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button.tsx'

describe('Button', () => {
  it('renders the text content passed to it', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(/click me/i)
  })

  it('calls the onClick function when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn().mockName('handleClick')

    render(<Button onClick={handleClick} />)

    await user.click(screen.getByRole('button'))

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

  it('applies normal size styles by default', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('rounded-md')
    expect(button).toHaveClass('px-4')
    expect(button).toHaveClass('py-2')
    expect(button).toHaveClass('shadow-md')
  })

  it('applies large size styles when size is large', () => {
    render(<Button size="large">Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('rounded-xl')
    expect(button).toHaveClass('px-8')
    expect(button).toHaveClass('py-4')
    expect(button).toHaveClass('shadow-xl')
  })
})
