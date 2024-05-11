import Board from './Board.tsx'
import clsx from 'clsx'
import {useEffect, useState} from 'react'
import {
  BoardModel,
  createInitialBoardModel,
  Field,
  makeMove,
  PieceOrEmpty,
} from '../models/GameModel.ts'
import {deterministicStrategy, Strategy} from '../models/Strategies.ts'
import {gameStatus, isWinStatus} from '../models/GameStatus.ts'

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

type GameProps = {
  strategy?: Strategy
  initialBoardModel?: BoardModel
}

export function Game({
  strategy = deterministicStrategy,
  initialBoardModel = createInitialBoardModel(),
}: GameProps) {
  const [boardModel, setBoardModel] = useState<BoardModel>(initialBoardModel)

  useCypress(boardModel, setBoardModel)

  const handleMakeMove = (field: Field) => {
    setBoardModel(prev => makeMove(prev, [field, 'X']))

    if (!strategy) {
      throw new Error('Cannot make a move: missing strategy')
    }

    setTimeout(() => {
      setBoardModel(prev => {
        // TODO: this condition is not correct
        if (!isWinStatus(gameStatus(prev))) {
          return makeMove(prev, [strategy(prev), 'O'])
        } else {
          return prev
        }
      })
    }, 1000)
  }

  const status = gameStatus(boardModel)

  return (
    <div data-testid="game">
      <h1 className={clsx('py-6 text-center')}>Have fun with this game!</h1>
      {isWinStatus(status) && (
        <h2
          className={clsx('py-6 text-center')}
          data-testid="game-ends-message"
        >
          The winner is {status.player}!
        </h2>
      )}
      <div className={clsx('flex justify-center')}>
        <div className={clsx('h-64 w-64 rounded-xl')}>
          <Board boardModel={boardModel} onMakeMove={handleMakeMove} />
        </div>
      </div>
    </div>
  )
}

export default Game
