import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmationDialog from './ConfirmationDialog'

describe('ConfirmationDialog', () => {
  it('does not render when open is false', () => {
    render(
      <ConfirmationDialog
        open={false}
        onClose={() => {}}
        onConfirm={() => {}}
        message="Are you sure?"
      />,
    )

    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument()
  })

  it('renders the message when open', () => {
    render(
      <ConfirmationDialog
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        message="Are you sure?"
      />,
    )

    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('renders with default icon, labels, and dataTestId', () => {
    render(
      <ConfirmationDialog
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        message="Are you sure?"
      />,
    )

    expect(screen.getByText('⚠️')).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Confirm'})).toBeInTheDocument()
  })

  it('renders custom labels and icon', () => {
    render(
      <ConfirmationDialog
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        message="Delete everything?"
        confirmLabel="Delete"
        cancelLabel="Go Back"
        icon="🗑️"
      />,
    )

    expect(screen.getByText('🗑️')).toBeInTheDocument()
    expect(
      screen.getByRole('button', {name: 'Go Back'}),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {name: 'Delete'}),
    ).toBeInTheDocument()
  })

  it('renders with custom dataTestId', () => {
    render(
      <ConfirmationDialog
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        message="Are you sure?"
        dataTestId="my-dialog-message"
      />,
    )

    expect(screen.getByTestId('my-dialog-message')).toBeInTheDocument()
  })

  it('calls onConfirm immediately and onClose after animation when confirm is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onClose = vi.fn()

    render(
      <ConfirmationDialog
        open={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Confirm'}))

    expect(onConfirm).toHaveBeenCalledOnce()

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce(), {
      timeout: 2000,
    })
  })

  it('calls onClose after animation when cancel is clicked without calling onConfirm', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onClose = vi.fn()

    render(
      <ConfirmationDialog
        open={true}
        onClose={onClose}
        onConfirm={onConfirm}
        message="Are you sure?"
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Cancel'}))

    expect(onConfirm).not.toHaveBeenCalled()

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce(), {
      timeout: 2000,
    })
  })

  it('renders with custom accentClassName', () => {
    render(
      <ConfirmationDialog
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        message="Are you sure?"
        accentClassName="bg-honey"
      />,
    )

    const accentBar = screen.getByText('Are you sure?').closest('div')
      ?.previousElementSibling
    expect(accentBar).toHaveClass('bg-honey')
  })
})