import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dialog from './Dialog'

describe('Dialog', () => {
  it('does not render when open is false', () => {
    render(
      <Dialog open={false} onClose={() => {}}>
        {() => <p>Dialog content</p>}
      </Dialog>,
    )

    expect(screen.queryByText('Dialog content')).not.toBeInTheDocument()
  })

  it('renders children when open is true', () => {
    render(
      <Dialog open={true} onClose={() => {}}>
        {() => <p>Dialog content</p>}
      </Dialog>,
    )

    expect(screen.getByText('Dialog content')).toBeInTheDocument()
  })

  it('renders the default accent bar', () => {
    render(
      <Dialog open={true} onClose={() => {}}>
        {() => <p>Dialog content</p>}
      </Dialog>,
    )

    const accentBar = screen.getByText('Dialog content').closest('div')
      ?.previousElementSibling
    expect(accentBar).toHaveClass('bg-wood/40')
  })

  it('renders a custom accent bar when accentClassName is provided', () => {
    render(
      <Dialog open={true} onClose={() => {}} accentClassName="bg-honey">
        {() => <p>Dialog content</p>}
      </Dialog>,
    )

    const accentBar = screen.getByText('Dialog content').closest('div')
      ?.previousElementSibling
    expect(accentBar).toHaveClass('bg-honey')
  })

  it('calls onClose after closeDialog is triggered and animation completes', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <Dialog open={true} onClose={onClose}>
        {closeDialog => (
          <button onClick={closeDialog}>Close</button>
        )}
      </Dialog>,
    )

    await user.click(screen.getByRole('button', {name: 'Close'}))

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce(), {
      timeout: 2000,
    })
  })

  it('applies scale-in animation when dialog opens', () => {
    render(
      <Dialog open={true} onClose={() => {}}>
        {() => <p>Dialog content</p>}
      </Dialog>,
    )

    const dialogContainer = screen
      .getByText('Dialog content')
      .closest('[class*="rounded-2xl"]')
    expect(dialogContainer).toHaveClass('animate-dialog-scale-in')
  })

  it('provides closeDialog function to children', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <Dialog open={true} onClose={onClose}>
        {closeDialog => (
          <button onClick={closeDialog}>Close</button>
        )}
      </Dialog>,
    )

    expect(screen.getByRole('button', {name: 'Close'})).toBeInTheDocument()

    await user.click(screen.getByRole('button', {name: 'Close'}))

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce(), {
      timeout: 2000,
    })
  })
})