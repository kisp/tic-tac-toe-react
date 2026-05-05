import Cell, {BorderPosition} from './Cell.tsx'
import clsx from 'clsx'
import {
  allFields,
  BoardModel,
  createInitialBoardModel,
  Field,
  getFieldContent,
} from '../models/GameModel.ts'

const classes = clsx('grid aspect-square max-h-full grid-cols-3 grid-rows-3')

const fieldsNoBorder: BorderPosition[][] = [
  ['l', 't'],
  ['t'],
  ['t', 'r'],
  ['l'],
  [],
  ['r'],
  ['l', 'b'],
  ['b'],
  ['r', 'b'],
]

type BoardProps = {
  boardModel?: BoardModel
  onMove?: (field: Field) => void
  interactive?: boolean
  winningFields?: Field[] | null
}

export function Board({
  boardModel = createInitialBoardModel(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove = _field => null,
  interactive = true,
  winningFields,
}: BoardProps) {
  const sortedWinningFields = winningFields
    ? [...winningFields].sort((a, b) => a - b)
    : null

  const cellForField = (field: Field) => {
    const isHighlighted = winningFields?.includes(field)
    const highlightDelay = isHighlighted
      ? (sortedWinningFields?.indexOf(field) ?? 0) * 100
      : undefined

    return (
      <Cell
        key={field}
        piece={getFieldContent(boardModel, field)}
        onClick={() => onMove(field)}
        noBorder={fieldsNoBorder[field]}
        interactive={interactive}
        highlighted={isHighlighted}
        highlightDelay={highlightDelay}
      />
    )
  }

  return (
    <div className={classes} data-testid="board">
      {allFields.map(cellForField)}
    </div>
  )
}

export default Board
