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
      <h1 className={clsx('py-6 text-center')}>Welcome to React Tic Tac Toe</h1>
      <div
        className={clsx('my-3 flex justify-center', {
          'transition-transform duration-200 ease-in-out': true,
          'scale-150 transform': showGame === 0,
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
      <h2 className={clsx('py-6 text-center')}>Past Games</h2>
      <div className={clsx('flex flex-wrap justify-around gap-6')}>
        <div className="h-28 w-28 flex-col rounded-xl border-2 border-slate-200 p-2 shadow hover:border-slate-400">
          <Board interactive={false} />
        </div>
        <div className="h-28 w-28 flex-col rounded-xl border-2 border-slate-200 p-2 shadow hover:border-slate-400">
          <Board interactive={false} />
        </div>
        <div className="h-28 w-28 flex-col rounded-xl border-2 border-slate-200 p-2 shadow hover:border-slate-400">
          <Board interactive={false} />
        </div>
      </div>
    </>
  )
}

function App() {
  const [showGame, setShowGame] = useState<ShowGameStatus>(false)

  return (
    <div className="container mx-auto">
      {!showGame && (
        <WelcomePage showGame={showGame} setShowGame={setShowGame} />
      )}
      <div
        className={clsx('transition-opacity duration-500 ease-in-out', {
          'opacity-100': showGame,
          'opacity-0': !showGame,
        })}
      >
        {!!showGame && <Game />}
      </div>
    </div>
  )
}

export default App
