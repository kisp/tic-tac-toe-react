import clsx from 'clsx'
import {ButtonHTMLAttributes} from 'react'

type ButtonSize = 'normal' | 'large'

const classes = (size: ButtonSize) => {
  const baseStyles = 'bg-blue-500 text-white'
  const hoverStyles = 'hover:bg-blue-600'
  const focusStyles =
    'focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-300'

  const stylesForSize = (size: ButtonSize) => {
    if (size === 'normal') {
      return 'rounded-md px-4 py-2 shadow-md'
    } else {
      return 'rounded-xl px-8 py-4 shadow-xl'
    }
  }

  return clsx(baseStyles, hoverStyles, focusStyles, stylesForSize(size))
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  dataTestid?: string
  size?: ButtonSize
}

function Button({
  size = 'normal',
  children,
  dataTestid,
  ...props
}: ButtonProps) {
  return (
    <button className={classes(size)} data-testid={dataTestid} {...props}>
      {children}
    </button>
  )
}

export default Button
