import Cell from './Cell.tsx'
import clsx from 'clsx'

const classes = clsx('grid h-64 w-64 grid-cols-3')

export function Board() {
  return (
    <div className={classes} data-testid="board">
      <Cell noBorder={['l', 't']} />
      <Cell noBorder={['t']} />
      <Cell noBorder={['t', 'r']} />
      <Cell noBorder={['l']} />
      <Cell />
      <Cell noBorder={['r']} />
      <Cell noBorder={['l', 'b']} />
      <Cell noBorder={['b']} />
      <Cell noBorder={['r', 'b']} />
    </div>
  )
}

export default Board
