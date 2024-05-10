import Board from './Board.tsx'
import clsx from 'clsx'
import {useEffect, useState} from 'react'
import {
  BoardModel,
  createInitialBoardModel,
  Field,
  PieceOrEmpty,
  setFieldContent,
} from '../models/GameModel.ts'

function useCypress(
  boardModel: PieceOrEmpty[],
  setBoardModel: (
    value: ((prevState: PieceOrEmpty[]) => PieceOrEmpty[]) | PieceOrEmpty[],
  ) => void,
) {
  useEffect(() => {
    // @ts-expect-error no worries
    if (window.Cypress) {
      // @ts-expect-error no worries
      window.boardModel = boardModel
      // @ts-expect-error no worries
      window.setBoardModel = setBoardModel
    }

    return () => {
      // @ts-expect-error no worries
      if (window.Cypress) {
        // @ts-expect-error no worries
        window.boardModel = null
        // @ts-expect-error no worries
        window.setBoardModel = null
      }
    }
  }, [boardModel, setBoardModel])
}

export function Game() {
  const [boardModel, setBoardModel] = useState<BoardModel>(
    createInitialBoardModel(),
  )

  useCypress(boardModel, setBoardModel)

  const makeMove = (field: Field) => {
    setBoardModel(prev => setFieldContent(prev, field, 'X'))
  }

  return (
    <div data-testid="game">
      <h1 className={clsx('py-6 text-center')}>Have fun with this game!</h1>
      <div className={clsx('flex justify-center')}>
        <div className={clsx('h-64 w-64 rounded-xl')}>
          <Board boardModel={boardModel} makeMove={makeMove} />
        </div>
      </div>
    </div>
  )
}

export default Game
