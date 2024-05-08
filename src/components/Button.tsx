import clsx from 'clsx'
import {ButtonHTMLAttributes} from 'react'

const classes = clsx(
  'rounded-xl',
  'bg-blue-800',
  'px-8 py-4',
  'text-white',
  'shadow-xl',
  'hover:bg-blue-900',
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  dataTestid?: string
}

function Button({children, dataTestid, ...props}: ButtonProps) {
  return (
    <button className={classes} data-testid={dataTestid} {...props}>
      {children}
    </button>
  )
}

export default Button
