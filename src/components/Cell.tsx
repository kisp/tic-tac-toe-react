import clsx from 'clsx'
import {MouseEventHandler} from 'react'
import {PieceOrEmpty} from '../models/GameModel.ts'

export type BorderPosition = 't' | 'b' | 'l' | 'r'

type CellProps = {
  piece?: PieceOrEmpty
  onClick?: MouseEventHandler
  noBorder?: BorderPosition[]
}

function classes(noBorder: BorderPosition[]) {
  return clsx(
    'flex items-center justify-center',
    'text-5xl',
    'border border-black',
    {
      'border-t-0': noBorder.includes('t'),
      'border-r-0': noBorder.includes('r'),
      'border-b-0': noBorder.includes('b'),
      'border-l-0': noBorder.includes('l'),
    },
  )
}

function Cell({piece, onClick, noBorder = []}: CellProps) {
  return (
    <div onClick={onClick} className={classes(noBorder)} data-testid="cell">
      {piece}
    </div>
  )
}

export default Cell
