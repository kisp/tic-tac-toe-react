import clsx from 'clsx'
import {useState, useCallback, useEffect} from 'react'

interface DialogProps {
  open: boolean
  onClose: () => void
  accentClassName?: string
  children: (closeDialog: () => void) => React.ReactNode
}

function Dialog({
  open,
  onClose,
  accentClassName = 'bg-wood/40',
  children,
}: DialogProps) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setClosing(false)
    }
  }, [open])

  const closeDialog = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 500)
  }, [onClose])

  if (!open) return null

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-50 bg-bark/60',
          closing
            ? 'animate-backdrop-fade-out'
            : 'animate-backdrop-fade-in',
        )}
      ></div>
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform">
        <div
          className={clsx(
            'min-w-[280px] max-w-[360px] overflow-hidden rounded-2xl border border-wood/30 bg-cream shadow-2xl',
            closing
              ? 'animate-dialog-fade-out'
              : 'animate-dialog-scale-in',
          )}
        >
          <div className={clsx('h-2', accentClassName)} />
          <div className="px-8 pb-8 pt-6 text-center">
            {children(closeDialog)}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dialog