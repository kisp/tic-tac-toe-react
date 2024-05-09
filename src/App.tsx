import Button from './components/Button.tsx'
import Game from './components/Game.tsx'
import clsx from 'clsx'
import {useState} from 'react'
import Board from './components/Board.tsx'

function WelcomePage({setShowGame}: {setShowGame: (arg: boolean) => void}) {
  return (
    <>
      <h1 className={clsx('py-6 text-center')}>Welcome to React Tic Tac Toe</h1>
      <div className={clsx('my-3 flex justify-center')}>
        <Button
          onClick={() => setShowGame(true)}
          dataTestid="start-new-game-button"
        >
          Start New Game
        </Button>
      </div>
      <h2 className={clsx('py-6 text-center')}>Past Games</h2>
      <div className={clsx('flex justify-around')}>
        <div className="h-28 w-28 flex-col rounded-xl border-2 border-slate-400 p-2">
          <Board />
        </div>
        <div className="h-28 w-28 flex-col rounded-xl border-2 border-slate-400 p-2">
          <Board />
        </div>
        <div className="h-28 w-28 flex-col rounded-xl border-2 border-slate-400 p-2">
          <Board />
        </div>
      </div>
    </>
  )
}

function App() {
  const [showGame, setShowGame] = useState(false)

  return (
    <div className="container mx-auto">
      {!showGame && <WelcomePage setShowGame={setShowGame} />}
      {showGame && <Game />}
    </div>
  )
}

export default App
