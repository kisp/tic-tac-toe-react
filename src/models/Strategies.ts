import {allFields, BoardModel, Field, isEmptyField} from './GameModel.ts'

export type Strategy = (boardModel: BoardModel) => Field

export const deterministicStrategy: Strategy = boardModel => {
  const emptyField = allFields.find(field => isEmptyField(boardModel, field))
  if (emptyField === undefined) {
    throw new Error('No empty field found in the board model')
  }
  return emptyField
}
