import clsx from 'clsx'
import {MouseEventHandler, useState, useEffect} from 'react'
import {PieceOrEmpty} from '../models/GameModel.ts'

export type BorderPosition = 't' | 'b' | 'l' | 'r'

type CellProps = {
  piece?: PieceOrEmpty
  onClick?: MouseEventHandler
  noBorder?: BorderPosition[]
}

function classes({noBorder = []}: CellProps, isFlashing: boolean) {
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
    'transition duration-100',
    {
      'bg-blue-200': isFlashing,
    },
  )
}

function useFlashing(piece?: PieceOrEmpty) {
  const [isFlashing, setIsFlashing] = useState(false)

  useEffect(() => {
    if (piece) {
      setIsFlashing(true)
      const timer = setTimeout(() => {
        setIsFlashing(false)
      }, 250)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [piece])

  return isFlashing
}

function Cell(props: CellProps) {
  const {piece, onClick} = props

  const isFlashing = useFlashing(piece)

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

export default Cell
