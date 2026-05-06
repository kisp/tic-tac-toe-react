import Dialog from './Dialog.tsx'
import Button from './Button.tsx'

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  message: string
  icon?: string
  confirmLabel?: string
  cancelLabel?: string
  accentClassName?: string
  dataTestId?: string
  confirmButtonTestId?: string
}

function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  message,
  icon = '⚠️',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  accentClassName,
  dataTestId,
  confirmButtonTestId,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} accentClassName={accentClassName}>
      {closeDialog => (
        <>
          <div className="mb-3 text-5xl" aria-hidden="true">
            {icon}
          </div>
          <p
            className="mb-6 text-xl font-bold text-bark"
            data-testid={dataTestId}
          >
            {message}
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={closeDialog}
            >
              {cancelLabel}
            </Button>
            <Button
              size="large"
              className="flex-1"
              dataTestid={confirmButtonTestId}
              onClick={() => {
                onConfirm()
                closeDialog()
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </>
      )}
    </Dialog>
  )
}

export default ConfirmationDialog
