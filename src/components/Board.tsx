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

function makeCell(
  boardModel: BoardModel,
  onMakeMove: (field: Field) => void,
  interactive: boolean,
) {
  return (field: Field) => {
    return (
      <Cell
        key={field}
        piece={getFieldContent(boardModel, field)}
        onClick={() => onMakeMove(field)}
        noBorder={fieldsNoBorder[field]}
        interactive={interactive}
      />
    )
  }
}

type BoardProps = {
  boardModel?: BoardModel
  onMove?: (field: Field) => void
  interactive?: boolean
}

export function Board({
  boardModel = createInitialBoardModel(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove = _field => null,
  interactive = true,
}: BoardProps) {
  return (
    <div className={classes} data-testid="board">
      {allFields.map(makeCell(boardModel, onMove, interactive))}
    </div>
  )
}

export default Board
