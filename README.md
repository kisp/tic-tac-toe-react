# tic-tac-toe-react

Classic game, modern twist - a Tic Tac Toe game built with React and TypeScript.

You play as **X**, and the AI plays as **O**.

## Features

### Selectable AI Strategies

Choose from three AI strategies before starting a game:

| Strategy          | Description                                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| **Deterministic** | Always picks the first available cell (top-left to bottom-right). Easy to beat once you notice the pattern. |
| **Random**        | Picks a random empty cell each turn. Unpredictable but not strategic.                                       |
| **Minimax**       | Uses the minimax algorithm to play optimally. This AI never loses - the best you can achieve is a draw!     |

### Past Games Collection

Every completed game is saved to your browser's local storage and displayed on the welcome page:

- Browse your game history with board snapshots, results, and the strategy used.
- Clear your history at any time with the **Clear History** button.

## Tech Stack

| Layer                    | Technology                   |
| ------------------------ | ---------------------------- |
| UI Framework             | React 18 + TypeScript        |
| Build Tool               | Vite 5                       |
| Styling                  | Tailwind CSS 3               |
| Functional Utilities     | Ramda 0.30                   |
| Unit / Integration Tests | Vitest + Testing Library     |
| E2E Tests                | Cypress 13                   |
| Linting                  | ESLint 8 + TypeScript plugin |
| Formatting               | Prettier 3 + Tailwind plugin |

## Development Setup

After cloning the repository and installing dependencies, initialize Husky hooks:

```bash
npm install
npx husky install
```

**What this does:**

- Automatically formats staged files with Prettier before each commit
- Prevents commits if formatting fails
- Works seamlessly for both human developers and AI agents

No additional action needed—formatting is handled automatically!

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Available Scripts

| Script               | Description                         |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start the dev server                |
| `npm test`           | Run unit/integration tests          |
| `npm run test:watch` | Run tests in watch mode             |
| `npm run cypress`    | Open Cypress interactively          |
| `npm run cypress:ci` | Run Cypress in CI (headless)        |
| `npm run lint`       | Lint the codebase (zero warnings)   |
| `npm run prettier`   | Format all files with Prettier      |
| `npm run build`      | Type-check and build for production |

## Project Structure

```
src/
  components/       # React UI components
    Game.tsx        # Main game orchestrator; manages board state and AI moves
    Board.tsx       # Renders the 3x3 grid
    Cell.tsx        # Individual cell component
    Button.tsx      # Reusable button component
  models/           # Pure business logic (no React)
    GameModel.ts    # Board state, move validation, type definitions
    Strategies.ts   # AI strategy functions (deterministic, random, minimax)
    GameStatus.ts   # Game status logic (win, draw, turn)
    PastGame.ts     # Past game model and localStorage persistence
  hooks/            # Custom React hooks
    useLocalStorage.ts
  App.tsx           # Root component; welcome page with strategy selection and past games
  main.tsx          # React DOM entry point
  main.css          # Global styles
cypress/            # Cypress E2E tests
public/             # Static assets
```

## Acknowledgements

Based on [react-create-vite-extended-template](https://github.com/kisp/react-create-vite-extended-template) ([generator version](https://github.com/kisp/react-create-vite-extended-template-generator/commit/2da3ffa4d17a8c1f3f60ba2480a24752d244d3a9)).
