import * as R from 'ramda'

export type BoardModel = PieceOrEmpty[]

export type Field = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type Piece = 'X' | 'O'
export type Empty = null
export type PieceOrEmpty = Piece | Empty
export type Move = [Field, Piece]

export const allFields: Field[] = [0, 1, 2, 3, 4, 5, 6, 7, 8]
export const allPieces: Piece[] = ['X', 'O']

export function createInitialBoardModel(): BoardModel {
  return new Array<PieceOrEmpty>(9).fill(null)
}

export function isEmptyField(boardModel: BoardModel, field: Field): boolean {
  return !getFieldContent(boardModel, field)
}

export function countEmptyFields(boardModel: BoardModel) {
  return R.count(R.partial(isEmptyField, [boardModel]), allFields)
}

export function getFieldContent(
  boardModel: BoardModel,
  field: Field,
): PieceOrEmpty {
  return boardModel[field]
}

function setFieldContent(
  boardModel: BoardModel,
  field: Field,
  piece: Piece,
): BoardModel {
  const newBoardModel = boardModel.slice()
  newBoardModel[field] = piece
  return newBoardModel
}

export function placeMove(boardModel: BoardModel, move: Move): BoardModel {
  const [field, piece] = move

  if (getFieldContent(boardModel, field)) throw new Error('Invalid move')

  return setFieldContent(boardModel, field, piece)
}

export function placeMoves(...moves: Move[]): BoardModel
export function placeMoves(boardModel: BoardModel, ...moves: Move[]): BoardModel

export function placeMoves(
  boardOrMove: BoardModel | Move,
  ...moves: Move[]
): BoardModel {
  let initialBoard

  if (boardOrMove && boardOrMove.length === 9) {
    initialBoard = boardOrMove
  } else {
    initialBoard = createInitialBoardModel()
    // @ts-expect-error boardOrMove needs to be a BoardModel
    if (boardOrMove) moves = [boardOrMove, ...moves]
  }

  return moves.reduce<BoardModel>(placeMove, initialBoard)
}

export function isEqualBoardModel(
  boardA: BoardModel,
  boardB: BoardModel,
): boolean {
  return R.equals(boardA, boardB)
}
