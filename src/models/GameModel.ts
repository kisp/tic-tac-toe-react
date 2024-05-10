export type BoardModel = PieceOrEmpty[]

export type Field = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type Piece = 'X' | 'O'
export type Empty = null
export type PieceOrEmpty = Piece | Empty

export const allFields: Field[] = [0, 1, 2, 3, 4, 5, 6, 7, 8]
export const allPieces: Piece[] = ['X', 'O']

export function createInitialBoardModel(): BoardModel {
  return new Array<PieceOrEmpty>(9).fill(null)
}

export function countEmptyFields(boardModel: BoardModel) {
  return allFields.reduce<number>(
    (count, field) => (boardModel[field] ? count : count + 1),
    0,
  )
}

export function getFieldContent(
  boardModel: BoardModel,
  field: Field,
): PieceOrEmpty {
  return boardModel[field]
}

export function setFieldContent(
  boardModel: BoardModel,
  field: Field,
  piece: Piece,
): BoardModel {
  const newBoardModel = boardModel.slice()
  newBoardModel[field] = piece
  return newBoardModel
}
