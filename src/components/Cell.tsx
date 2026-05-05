import clsx from 'clsx'
import {MouseEventHandler, useEffect, useState} from 'react'
import {PieceOrEmpty} from '../models/GameModel.ts'

// TODO: we should have an eslint rule to either use function or const
function classes(
  {noBorder = [], piece, interactive, highlighted}: CellProps,
  isFlashing: boolean,
  cursorDelayed: boolean,
) {
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
    {'transition-colors duration-1000': piece === 'X' && !highlighted},
    {
      'bg-blue-200 ': isFlashing && piece === 'O' && !highlighted,
    },
    {
      'transition-colors duration-1000':
        piece === 'O' && !isFlashing && !highlighted,
    },
    // {
    //   "hover:text-gray-400 hover:after:content-['X']": true,
    // },
    {
      'cursor-pointer hover:bg-gray-200':
        interactive !== false &&
        (!piece || (piece === 'X' && (isFlashing || cursorDelayed))),
    },
    {
      'cursor-not-allowed':
        (piece && (piece === 'O' || (!cursorDelayed && !isFlashing))) ||
        (!piece && interactive === false),
    },
    {
      'animate-win-pop bg-yellow-300 transition-colors duration-500':
        highlighted,
    },
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

function useCursorDelay(piece?: PieceOrEmpty): boolean {
  const [cursorDelayed, setCursorDelayed] = useState(false)

  useEffect(() => {
    if (piece === 'X') {
      setCursorDelayed(true)
      const timer = setTimeout(() => setCursorDelayed(false), 1000)
      return () => clearTimeout(timer)
    }
    setCursorDelayed(false)
  }, [piece])

  return cursorDelayed
}

export type BorderPosition = 't' | 'b' | 'l' | 'r'

type CellProps = {
  piece?: PieceOrEmpty
  onClick?: MouseEventHandler
  noBorder?: BorderPosition[]
  interactive?: boolean
  highlighted?: boolean
  highlightDelay?: number
}

function Cell(props: CellProps) {
  const {piece, onClick, interactive = true} = props

  const isFlashing = useFlashing(piece)
  const cursorDelayed = useCursorDelay(piece)

  const style =
    props.highlighted && props.highlightDelay !== undefined
      ? {animationDelay: `${props.highlightDelay}ms`}
      : undefined

  if (interactive) {
    return (
      <button
        onClick={!piece ? onClick : undefined}
        className={classes(props, isFlashing, cursorDelayed)}
        style={style}
        data-testid="cell"
        tabIndex={1}
      >
        {piece}
      </button>
    )
  } else {
    return (
      <div
        className={classes(props, isFlashing, cursorDelayed)}
        style={style}
        data-testid="cell"
      >
        {piece}
      </div>
    )
  }
}

export default Cell
