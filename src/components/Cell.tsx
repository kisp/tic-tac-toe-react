import clsx from 'clsx'
import {MouseEventHandler, useEffect, useState} from 'react'
import {PieceOrEmpty} from '../models/GameModel.ts'

// TODO: we should have an eslint rule to either use function or const
function classes({noBorder = [], piece}: CellProps, isFlashing: boolean) {
  return clsx(
    'flex items-center justify-center',
    'text-5xl',
    'border border-black',
    'select-none',
    'focus-visible:outline-none focus-visible:ring focus-visible:ring-inset focus-visible:ring-blue-300',
    {
      'border-t-0': noBorder.includes('t'),
      'border-r-0': noBorder.includes('r'),
      'border-b-0': noBorder.includes('b'),
      'border-l-0': noBorder.includes('l'),
    },
    {'transition-colors duration-1000': piece === 'X'},
    {
      'bg-blue-200 ': isFlashing && piece === 'O',
    },
    {'transition-colors duration-1000': piece === 'O' && !isFlashing},
    // {
    //   "hover:text-gray-400 hover:after:content-['X']": true,
    // },
    {
      'cursor-pointer hover:bg-gray-200':
        !piece || (piece === 'X' && isFlashing),
    },
    {'cursor-not-allowed': piece && (piece === 'O' || !isFlashing)},
  )
}

function useFlashing(piece?: PieceOrEmpty): boolean {
  const [stopFlashing, setStopFlashing] = useState(false)

  useEffect(() => {
    if (piece) {
      const timer = setTimeout(() => {
        setStopFlashing(true)
      }, 800)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [piece])

  return !!piece && !stopFlashing
}

export type BorderPosition = 't' | 'b' | 'l' | 'r'

type CellProps = {
  piece?: PieceOrEmpty
  onClick?: MouseEventHandler
  noBorder?: BorderPosition[]
  interactive?: boolean
}

function Cell(props: CellProps) {
  const {piece, onClick, interactive} = props

  const isFlashing = useFlashing(piece)

  if (interactive) {
    return (
      <button
        onClick={onClick}
        className={classes(props, isFlashing)}
        data-testid="cell"
        tabIndex={1}
      >
        {piece}
      </button>
    )
  } else {
    return (
      <div
        onClick={onClick}
        className={classes(props, isFlashing)}
        data-testid="cell"
      >
        {piece}
      </div>
    )
  }
}

export default Cell
