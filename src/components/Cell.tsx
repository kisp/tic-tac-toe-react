import clsx from 'clsx'
import {MouseEventHandler, useEffect, useState} from 'react'
import {PieceOrEmpty} from '../models/GameModel.ts'

function classes(
  {noBorder = [], piece, interactive, highlighted, size = 'normal'}: CellProps,
  isFlashing: boolean,
  cursorDelayed: boolean,
) {
  const isNonInteractive = interactive === false
  const isSmall = size === 'small'

  return clsx(
    'flex items-center justify-center',
    isSmall ? 'text-lg font-bold text-bark' : 'text-5xl font-bold text-bark',
    'border border-wood-dark',
    'select-none bg-cream/50',
    'min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0',
    'focus-visible:outline-none focus-visible:ring focus-visible:ring-inset focus-visible:ring-flame/50',
    {
      'border-t-0': noBorder.includes('t'),
      'border-r-0': noBorder.includes('r'),
      'border-b-0': noBorder.includes('b'),
      'border-l-0': noBorder.includes('l'),
    },
    {'transition-colors duration-300': isNonInteractive},
    {
      'transition-colors duration-1000':
        piece === 'X' && !highlighted && !isNonInteractive,
    },
    {
      'bg-honey/30':
        isFlashing && piece === 'O' && !highlighted && !isNonInteractive,
    },
    {
      'transition-colors duration-1000':
        piece === 'O' && !isFlashing && !highlighted && !isNonInteractive,
    },
    {
      'cursor-pointer hover:bg-honey/30':
        !isNonInteractive &&
        (!piece || (piece === 'X' && (isFlashing || cursorDelayed))),
    },
    {
      'cursor-not-allowed':
        !isNonInteractive &&
        piece &&
        (piece === 'O' || (!cursorDelayed && !isFlashing)),
    },
    {
      'animate-win-pop bg-flame text-cream transition-colors duration-500':
        highlighted && !isNonInteractive,
    },
    {
      'bg-flame text-cream': highlighted && isNonInteractive,
    },
  )
}

function useFlashing(piece?: PieceOrEmpty, interactive?: boolean): boolean {
  const [stopFlashing, setStopFlashing] = useState(false)

  useEffect(() => {
    if (!interactive) return
    if (piece) {
      const timer = setTimeout(() => {
        setStopFlashing(true)
      }, 800)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [piece, interactive])

  return interactive ? !!piece && !stopFlashing : false
}

function useCursorDelay(piece?: PieceOrEmpty, interactive?: boolean): boolean {
  const [cursorDelayed, setCursorDelayed] = useState(false)

  useEffect(() => {
    if (!interactive) return
    if (piece === 'X') {
      setCursorDelayed(true)
      const timer = setTimeout(() => setCursorDelayed(false), 1000)
      return () => clearTimeout(timer)
    }
    setCursorDelayed(false)
  }, [piece, interactive])

  return interactive ? cursorDelayed : false
}

export type BorderPosition = 't' | 'b' | 'l' | 'r'
export type CellSize = 'normal' | 'small'

type CellProps = {
  piece?: PieceOrEmpty
  onClick?: MouseEventHandler
  noBorder?: BorderPosition[]
  interactive?: boolean
  highlighted?: boolean
  highlightDelay?: number
  size?: CellSize
}

function Cell(props: CellProps) {
  const {piece, onClick, interactive = true} = props

  const isFlashing = useFlashing(piece, interactive)
  const cursorDelayed = useCursorDelay(piece, interactive)

  const style =
    props.highlighted && props.highlightDelay !== undefined
      ? {animationDelay: `${props.highlightDelay}ms`}
      : undefined

  const shadowClass =
    props.size === 'small' ? 'piece-shadow-sm' : 'piece-shadow'

  if (interactive) {
    return (
      <button
        onClick={!piece ? onClick : undefined}
        className={clsx(
          classes(props, isFlashing, cursorDelayed),
          piece && shadowClass,
        )}
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
        className={clsx(
          classes(props, isFlashing, cursorDelayed),
          piece && shadowClass,
        )}
        style={style}
        data-testid="cell"
      >
        {piece}
      </div>
    )
  }
}

export default Cell
