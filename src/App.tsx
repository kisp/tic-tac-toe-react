import Button from './components/Button.tsx'
import Game from './components/Game.tsx'
import clsx from 'clsx'
import {useState} from 'react'
import Board from './components/Board.tsx'

type ShowGameStatus = false | 0 | true

function WelcomePage({
  showGame,
  setShowGame,
}: {
  showGame: ShowGameStatus
  setShowGame: (arg: ShowGameStatus) => void
}) {
  return (
    <>
      <h1 className="py-6 text-center text-3xl font-bold text-bark">
        Welcome to React Tic Tac Toe
      </h1>
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

  return (
    <div className="min-h-screen">
      {!showGame && (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <WelcomePage showGame={showGame} setShowGame={setShowGame} />
        </div>
      )}
      <div
        className={clsx('transition-opacity duration-500 ease-in-out', {
          'opacity-100': showGame,
          'opacity-0': !showGame,
        })}
      >
        {!!showGame && <Game onReturnToWelcome={() => setShowGame(false)} />}
      </div>
    </div>
  )
}

export default App
