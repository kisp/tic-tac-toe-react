import {allFields, BoardModel, Field, isEmptyField} from './GameModel.ts'

export type Strategy = (boardModel: BoardModel) => Field

export const deterministicStrategy: Strategy = boardModel => {
  const emptyField = allFields.find(isEmptyField(boardModel))
  if (emptyField === undefined) {
    throw new Error('No empty field found in the board model')
  }
  return emptyField
}

export const randomStrategy: Strategy = boardModel => {
  const emptyFields = allFields.filter(isEmptyField(boardModel))
  if (emptyFields.length === 0) {
    throw new Error('No empty field found in the board model')
  }
  const randomIndex = Math.floor(Math.random() * emptyFields.length)
  return emptyFields[randomIndex]
}
