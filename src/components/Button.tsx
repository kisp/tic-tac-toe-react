import clsx from 'clsx'
import {ButtonHTMLAttributes} from 'react'

type ButtonSize = 'normal' | 'large'
type ButtonVariant = 'primary' | 'secondary'

const classes = (size: ButtonSize, variant: ButtonVariant = 'primary') => {
  const focusStyles =
    'focus-visible:outline-none focus-visible:ring focus-visible:ring-flame/50'

  const variantStyles = (variant: ButtonVariant) => {
    if (variant === 'secondary') {
      return clsx(
        'border-2 border-flame bg-cream font-semibold text-flame',
        'hover:bg-flame/10',
        focusStyles,
      )
    }
    return clsx(
      'bg-flame font-semibold text-white',
      'hover:bg-flame-dark',
      focusStyles,
    )
  }

  const stylesForSize = (size: ButtonSize) => {
    if (size === 'normal') {
      return 'rounded-md px-4 py-2 shadow-md'
    } else {
      return 'rounded-xl px-8 py-4 shadow-xl'
    }
  }

  return clsx(variantStyles(variant), stylesForSize(size))
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  dataTestid?: string
  size?: ButtonSize
  variant?: ButtonVariant
}

function Button({
  size = 'normal',
  variant = 'primary',
  children,
  className,
  dataTestid,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(classes(size, variant), className)}
      data-testid={dataTestid}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
