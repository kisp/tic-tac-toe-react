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
  onMakeMove?: (field: Field) => void
}

function makeCell(boardModel: BoardModel, onMakeMove: (field: Field) => void) {
  return (field: Field) => {
    return (
      <Cell
        key={field}
        piece={getFieldContent(boardModel, field)}
        onClick={() => onMakeMove(field)}
        noBorder={fieldsNoBorder[field]}
      />
    )
  }
}

export function Board({
  boardModel = createInitialBoardModel(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMakeMove = _field => null,
}: BoardProps) {
  return (
    <div className={classes} data-testid="board">
      {allFields.map(makeCell(boardModel, onMakeMove))}
    </div>
  )
}

export default Board
