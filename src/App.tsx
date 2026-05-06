import Button from './components/Button.tsx'
import ConfirmationDialog from './components/ConfirmationDialog.tsx'
import Game from './components/Game.tsx'
import clsx from 'clsx'
import {useState} from 'react'
import Board from './components/Board.tsx'
import {strategyMap, StrategyName} from './models/Strategies.ts'
import {
  PastGame,
  createPastGame,
  resultLabel,
  strategyLabel,
} from './models/PastGame.ts'
import {BoardModel} from './models/GameModel.ts'
import {PastGameResult} from './models/PastGame.ts'
import {useLocalStorage} from './hooks/useLocalStorage.ts'
import {getWinningFields} from './models/GameStatus.ts'

type ShowGameStatus = false | 0 | true

function WelcomePage({
  showGame,
  setShowGame,
  strategyName,
  setStrategyName,
  pastGames,
  onClearHistory,
}: {
  showGame: ShowGameStatus
  setShowGame: (arg: ShowGameStatus) => void
  strategyName: StrategyName
  setStrategyName: (arg: StrategyName) => void
  pastGames: PastGame[]
  onClearHistory: () => void
}) {
  const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false)
  const [hoveredGameId, setHoveredGameId] = useState<string | null>(null)

  return (
    <>
      <h1 className="py-6 text-center text-3xl font-bold text-bark">
        Welcome to React Tic Tac Toe
      </h1>
      <div className="my-4 flex items-center justify-center gap-6">
        <span className="text-lg text-bark">AI Strategy:</span>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="strategy"
            value="deterministic"
            checked={strategyName === 'deterministic'}
            onChange={() => setStrategyName('deterministic')}
            data-testid="strategy-deterministic"
            className="accent-flame"
          />
          <span className="text-bark">Deterministic</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="strategy"
            value="random"
            checked={strategyName === 'random'}
            onChange={() => setStrategyName('random')}
            data-testid="strategy-random"
            className="accent-flame"
          />
          <span className="text-bark">Random</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="strategy"
            value="mostlyRandom"
            checked={strategyName === 'mostlyRandom'}
            onChange={() => setStrategyName('mostlyRandom')}
            data-testid="strategy-mostly-random"
            className="accent-flame"
          />
          <span className="text-bark">Mostly random</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="strategy"
            value="minimax"
            checked={strategyName === 'minimax'}
            onChange={() => setStrategyName('minimax')}
            data-testid="strategy-minimax"
            className="accent-flame"
          />
          <span className="text-bark">Minimax</span>
        </label>
      </div>
      <div
        className={clsx('my-3 flex justify-center', {
          'transition-transform duration-200 ease-in-out': true,
          'scale-110 transform': showGame === 0,
        })}
      >
        <Button
          size="large"
          onClick={() => {
            setShowGame(0)
            setTimeout(() => setShowGame(true), 300)
          }}
          dataTestid="start-new-game-button"
        >
          Start New Game
        </Button>
      </div>
      <h2 className="py-6 text-center text-xl font-semibold text-bark">
        Past Games
      </h2>
      {pastGames.length === 0 ? (
        <p className="text-center text-bark/60" data-testid="no-past-games">
          No games played yet
        </p>
      ) : (
        <>
          <div
            className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
            data-testid="past-games-list"
          >
            {pastGames.map(game => (
              <div
                key={game.id}
                className="flex-col rounded-xl border-2 border-wood/30 bg-cream/50 p-2 shadow-md hover:border-wood/50"
                data-testid="past-game-card"
                onMouseEnter={() => setHoveredGameId(game.id)}
                onMouseLeave={() => setHoveredGameId(null)}
              >
                <Board
                  interactive={false}
                  boardModel={game.boardModel}
                  winningFields={
                    hoveredGameId === game.id
                      ? getWinningFields(game.boardModel)
                      : null
                  }
                  size="small"
                />
                <div className="mt-1 text-center text-sm font-semibold text-bark">
                  {resultLabel(game.result)}
                </div>
                <div className="text-center text-xs text-bark/60">
                  {strategyLabel(game.strategy)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => setShowClearHistoryDialog(true)}
              dataTestid="clear-history-button"
            >
              Clear History
            </Button>
          </div>
        </>
      )}
      <ConfirmationDialog
        open={showClearHistoryDialog}
        onClose={() => setShowClearHistoryDialog(false)}
        onConfirm={onClearHistory}
        message="Are you sure you want to clear all game history? This action cannot be undone."
        confirmLabel="Clear"
        dataTestId="clear-history-dialog-message"
        confirmButtonTestId="clear-history-confirm-button"
      />
    </>
  )
}

function App() {
  const [showGame, setShowGame] = useState<ShowGameStatus>(false)
  const [strategyName, setStrategyName] = useState<StrategyName>('mostlyRandom')
  const [pastGames, setPastGames] = useLocalStorage<PastGame[]>('pastGames', [])

  const handleGameComplete = (
    boardModel: BoardModel,
    result: PastGameResult,
  ) => {
    const game = createPastGame(boardModel, result, strategyName)
    setPastGames(prev => [game, ...prev])
  }

  const handleClearHistory = () => {
    setPastGames([])
  }

  return (
    <div className="min-h-screen">
      {!showGame && (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <WelcomePage
            showGame={showGame}
            setShowGame={setShowGame}
            strategyName={strategyName}
            setStrategyName={setStrategyName}
            pastGames={pastGames}
            onClearHistory={handleClearHistory}
          />
        </div>
      )}
      <div
        className={clsx('transition-opacity duration-500 ease-in-out', {
          'opacity-100': showGame,
          'opacity-0': !showGame,
        })}
      >
        {!!showGame && (
          <Game
            strategy={strategyMap[strategyName]}
            strategyName={strategyName}
            onReturnToWelcome={() => setShowGame(false)}
            onGameComplete={handleGameComplete}
          />
        )}
      </div>
    </div>
  )
}

export default App
