import Board from './Board.tsx'
import clsx from 'clsx'
import {useEffect, useMemo, useState} from 'react'
import {
  BoardModel,
  createInitialBoardModel,
  Field,
  placeMove,
  PieceOrEmpty,
} from '../models/GameModel.ts'
import {deterministicStrategy, Strategy} from '../models/Strategies.ts'
import {
  gameStatus,
  getWinningFields,
  isDrawStatus,
  isTurnStatus,
  isWinStatus,
} from '../models/GameStatus.ts'
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
  onReturnToWelcome?: () => void
}

export function Game({
  strategy = deterministicStrategy,
  initialBoardModel = createInitialBoardModel(),
  onReturnToWelcome,
}: GameProps) {
  const [boardModel, setBoardModel] = useState<BoardModel>(initialBoardModel)
  const [showGameEndDialog, setShowGameEndDialog] = useState(false)
  const [winMessage, setWinMessage] = useState<string | null>(null)
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [lastMoveField, setLastMoveField] = useState<Field | null>(null)

  useCypress(boardModel, setBoardModel)

  const status = useMemo(() => gameStatus(boardModel), [boardModel])

  const handleMove = () => {
    let handleMoveCalled = false

    return (field: Field) => {
      if (!handleMoveCalled && !isAIThinking && isTurnStatus(status)) {
        handleMoveCalled = true
        setLastMoveField(field)

        const boardAfterX = placeMove(boardModel, [field, 'X'])
        setBoardModel(boardAfterX)

        if (!strategy) {
          throw new Error('Cannot make a move: missing strategy')
        }

        if (!isTurnStatus(gameStatus(boardAfterX))) {
          return
        }

        setIsAIThinking(true)

        setTimeout(() => {
          if (isTurnStatus(gameStatus(boardAfterX))) {
            const aiField = strategy(boardAfterX)
            setLastMoveField(aiField)
            setBoardModel(placeMove(boardAfterX, [aiField, 'O']))
          }
          setIsAIThinking(false)
        }, 1000)
      }
    }
  }

  const winningFields = useMemo(
    () => getWinningFields(boardModel),
    [boardModel],
  )
  const effectiveWinningFields = useMemo(() => {
    if (!winningFields) return null
    if (lastMoveField === null) return winningFields
    return winningFields.filter(f => f !== lastMoveField)
  }, [winningFields, lastMoveField])

  useEffect(() => {
    if ((isWinStatus(status) || isDrawStatus(status)) && winMessage === null) {
      const timer = setTimeout(() => {
        setShowGameEndDialog(true)
        setLastMoveField(null)
      }, 500)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [status, winMessage])

  return (
    <>
      <div data-testid="game">
        <h1 className={clsx('py-6 text-center')}>
          {winMessage ?? 'Have fun with this game!'}
        </h1>
        <div className={clsx('flex justify-center')}>
          <div
            className={clsx('h-64 w-64 rounded-xl', {
              'cursor-not-allowed': isAIThinking || !isTurnStatus(status),
            })}
          >
            <div
              className={clsx({
                'pointer-events-none': isAIThinking || !isTurnStatus(status),
              })}
            >
              <Board
                boardModel={boardModel}
                onMove={handleMove()}
                winningFields={effectiveWinningFields}
              />
            </div>
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
              {isDrawStatus(status) && <span>It&apos;s a draw!</span>}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  if (isWinStatus(status)) {
                    setWinMessage(`The winner is ${status.player}!`)
                  } else if (isDrawStatus(status)) {
                    setWinMessage("It's a draw!")
                  }
                  setShowGameEndDialog(false)
                }}
              >
                Close
              </Button>
              {onReturnToWelcome && (
                <Button onClick={onReturnToWelcome}>
                  Return to Welcome Page
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Game
