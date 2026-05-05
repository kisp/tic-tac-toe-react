import Button from './components/Button.tsx'
import Game from './components/Game.tsx'
import clsx from 'clsx'
import {useState} from 'react'
import Board from './components/Board.tsx'
import {strategyMap, StrategyName} from './models/Strategies.ts'

type ShowGameStatus = false | 0 | true

function WelcomePage({
  showGame,
  setShowGame,
  strategyName,
  setStrategyName,
}: {
  showGame: ShowGameStatus
  setShowGame: (arg: ShowGameStatus) => void
  strategyName: StrategyName
  setStrategyName: (arg: StrategyName) => void
}) {
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
      <div className="flex flex-wrap justify-around gap-6">
        <div className="h-28 w-28 flex-col rounded-xl border-2 border-wood/30 bg-cream/50 p-2 shadow-md hover:border-wood/50">
          <Board interactive={false} />
        </div>
        <div className="h-28 w-28 flex-col rounded-xl border-2 border-wood/30 bg-cream/50 p-2 shadow-md hover:border-wood/50">
          <Board interactive={false} />
        </div>
        <div className="h-28 w-28 flex-col rounded-xl border-2 border-wood/30 bg-cream/50 p-2 shadow-md hover:border-wood/50">
          <Board interactive={false} />
        </div>
      </div>
    </>
  )
}

function App() {
  const [showGame, setShowGame] = useState<ShowGameStatus>(false)
  const [strategyName, setStrategyName] =
    useState<StrategyName>('deterministic')

  return (
    <div className="min-h-screen">
      {!showGame && (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <WelcomePage
            showGame={showGame}
            setShowGame={setShowGame}
            strategyName={strategyName}
            setStrategyName={setStrategyName}
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
            onReturnToWelcome={() => setShowGame(false)}
          />
        )}
      </div>
    </div>
  )
}

export default App
