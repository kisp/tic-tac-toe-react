import Button from './components/Button.tsx'
import {Board} from './components/Board.tsx'
import clsx from 'clsx'
import {useState} from 'react'

function App() {
  const [showBoard, setShowBoard] = useState(false)

  return (
    <div className="container mx-auto">
      <h1 className={clsx('py-6 text-center')}>Welcome to React Tic Tac Toe</h1>
      <div className={clsx('my-3 flex justify-center')}>
        {!showBoard && (
          <Button
            onClick={() => setShowBoard(true)}
            dataTestid="start-new-game-button"
          >
            Start New Game
          </Button>
        )}
        {showBoard && <Board />}
      </div>
    </div>
  )
}

export default App
