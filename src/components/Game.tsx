import Board from './Board.tsx'
import clsx from 'clsx'
import {useEffect, useState} from 'react'
import {
  BoardModel,
  createInitialBoardModel,
  Field,
  placeMove,
  PieceOrEmpty,
} from '../models/GameModel.ts'
import {deterministicStrategy, Strategy} from '../models/Strategies.ts'
import {gameStatus, isWinStatus} from '../models/GameStatus.ts'
import Button from './Button.tsx'

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
  const [showGameEndDialog, setShowGameEndDialog] = useState(false)

  useCypress(boardModel, setBoardModel)

  const handleMove = () => {
    let handleMoveCalled = false

    return (field: Field) => {
      if (!handleMoveCalled) {
        handleMoveCalled = true

        setBoardModel(prev => placeMove(prev, [field, 'X']))

        if (!strategy) {
          throw new Error('Cannot make a move: missing strategy')
        }

        setTimeout(() => {
          setBoardModel(prev => {
            // TODO: this condition is not correct
            if (!isWinStatus(gameStatus(prev))) {
              return placeMove(prev, [strategy(prev), 'O'])
            } else {
              return prev
            }
          })
        }, 1500)
      }
    }
  }

  const status = gameStatus(boardModel)

  useEffect(() => {
    if (isWinStatus(status)) {
      const timer = setTimeout(() => setShowGameEndDialog(true), 1500)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])

  return (
    <>
      <div data-testid="game">
        <h1 className={clsx('py-6 text-center')}>Have fun with this game!</h1>
        <div className={clsx('flex justify-center')}>
          <div className={clsx('h-64 w-64 rounded-xl')}>
            <Board boardModel={boardModel} onMove={handleMove()} />
          </div>
        </div>
      </div>

      {showGameEndDialog && (
        <>
          <div className="fixed inset-0 z-50 bg-black opacity-50"></div>
          <div
            className={clsx(
              'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform',
              'rounded-lg bg-white p-6 shadow-lg',
            )}
          >
            <p
              className="mb-3 text-lg font-semibold text-gray-800"
              data-testid="game-ends-message"
            >
              {isWinStatus(status) && (
                <span>The winner is {status.player}!</span>
              )}
            </p>
            <Button>Close</Button>
          </div>
        </>
      )}
    </>
  )
}

export default Game
