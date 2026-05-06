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
import {PastGameResult} from '../models/PastGame.ts'
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
  onGameComplete?: (boardModel: BoardModel, result: PastGameResult) => void
}

export function Game({
  strategy = deterministicStrategy,
  initialBoardModel = createInitialBoardModel(),
  onReturnToWelcome,
  onGameComplete,
}: GameProps) {
  const [boardModel, setBoardModel] = useState<BoardModel>(initialBoardModel)
  const [showGameEndDialog, setShowGameEndDialog] = useState(false)
  const [dialogClosing, setDialogClosing] = useState(false)
  const [winMessage, setWinMessage] = useState<string | null>(null)
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [showNotAllowedCursor, setShowNotAllowedCursor] = useState(false)
  const [lastMoveField, setLastMoveField] = useState<Field | null>(null)

  useCypress(boardModel, setBoardModel)

  useEffect(() => {
    if (isAIThinking) {
      const timer = setTimeout(() => setShowNotAllowedCursor(true), 1000)
      return () => {
        clearTimeout(timer)
        setShowNotAllowedCursor(false)
      }
    }
    setShowNotAllowedCursor(false)
  }, [isAIThinking])

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
        setLastMoveField(null)
      }, 500)

      const dialogDelay = isWinStatus(status) ? 1200 : 500
      const dialogTimer = setTimeout(() => {
        setShowGameEndDialog(true)
      }, dialogDelay)

      return () => {
        clearTimeout(timer)
        clearTimeout(dialogTimer)
      }
    }
  }, [status, winMessage])

  return (
    <>
      <div
        data-testid="game"
        className="flex min-h-screen flex-col sm:min-h-0 sm:items-center sm:justify-center sm:py-8"
      >
        <div className="flex flex-col items-center px-4 pt-6 sm:pt-0">
          <h1 className="py-4 text-center text-2xl font-bold text-bark sm:py-6 sm:text-3xl">
            {winMessage ?? 'Have fun with this game!'}
          </h1>
          {winMessage !== null && onReturnToWelcome && (
            <div className="pb-2">
              <Button onClick={onReturnToWelcome}>
                Return to Welcome Page
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-4 sm:flex-initial sm:p-4">
          <div
            className={clsx('w-64 sm:w-80', {
              'cursor-not-allowed':
                showNotAllowedCursor || !isTurnStatus(status),
              'cursor-pointer': isAIThinking && !showNotAllowedCursor,
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
          <div
            className={clsx(
              'fixed inset-0 z-50 bg-bark/60',
              dialogClosing
                ? 'animate-backdrop-fade-out'
                : 'animate-backdrop-fade-in',
            )}
          ></div>
          <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform">
            <div
              className={clsx(
                'min-w-[280px] overflow-hidden rounded-2xl border border-wood/30 bg-cream shadow-2xl',
                dialogClosing
                  ? 'animate-dialog-fade-out'
                  : 'animate-dialog-scale-in',
              )}
            >
              <div
                className={clsx('h-2', {
                  'bg-honey': isWinStatus(status),
                  'bg-wood/40': isDrawStatus(status),
                })}
              />
              <div className="px-8 pb-8 pt-6 text-center">
                <div className="mb-3 text-5xl" aria-hidden="true">
                  {isWinStatus(status) && '🏆'}
                  {isDrawStatus(status) && '🤝'}
                </div>
                <p
                  className="mb-6 text-xl font-bold text-bark"
                  data-testid="game-ends-message"
                >
                  {isWinStatus(status) && (
                    <span>The winner is {status.player}!</span>
                  )}
                  {isDrawStatus(status) && <span>It&apos;s a draw!</span>}
                </p>
                <Button
                  size="large"
                  className="w-full"
                  onClick={() => {
                    if (isWinStatus(status)) {
                      setWinMessage(`The winner is ${status.player}!`)
                      onGameComplete?.(boardModel, status.player)
                    } else if (isDrawStatus(status)) {
                      setWinMessage("It's a draw!")
                      onGameComplete?.(boardModel, 'draw')
                    }
                    setDialogClosing(true)
                    setTimeout(() => {
                      setShowGameEndDialog(false)
                      setDialogClosing(false)
                    }, 500)
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Game
