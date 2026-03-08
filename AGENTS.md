# AGENTS.md

## Project Overview

**tic-tac-toe-react** is a classic Tic Tac Toe game with a modern React frontend. The human player plays as **X**, and an AI opponent plays as **O** with a 1-second move delay for a better UX.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Functional Utilities | Ramda 0.30 |
| Unit/Integration Tests | Vitest + @testing-library/react |
| E2E Tests | Cypress 13 |
| Linting | ESLint 8 + TypeScript plugin |
| Formatting | Prettier 3 + Tailwind plugin |

## Project Structure

```
src/
  components/       # React UI components
    Game.tsx        # Main game orchestrator; manages board state and AI moves
    Board.tsx       # Renders the 3×3 grid
    Cell.tsx        # Individual cell component
    Button.tsx      # Reusable button component
  models/           # Pure business logic (no React)
    GameModel.ts    # Board state, move validation, type definitions
    Strategies.ts   # AI strategy functions
  App.tsx           # Root component; switches between welcome page and game
  main.tsx          # React DOM entry point
  main.css          # Global styles
cypress/            # Cypress E2E tests
public/             # Static assets
```

## Common Commands

```bash
# Start the development server
npm run dev

# Run unit/integration tests (single run)
npm test

# Run unit/integration tests in watch mode
npm run test:watch

# Run Cypress E2E tests interactively
npm run cypress

# Run Cypress E2E tests in CI (headless)
npm run cypress:ci

# Lint the codebase (zero warnings allowed)
npm run lint

# Format all files with Prettier
npm run prettier

# Type-check and build for production
npm run build
```

## Key Conventions

- **TypeScript strict mode** is enabled; avoid `any` and prefer explicit types.
- **ESLint** is configured with zero warnings allowed (`--max-warnings 0`). Run `npm run lint` before committing.
- **Prettier** is the formatter; run `npm run prettier` to auto-format.
- Business logic lives in `src/models/` and must remain free of React imports.
- UI components live in `src/components/` and should delegate game logic to the models.
- AI strategies follow the `Strategy` type signature: `(boardModel: BoardModel) => Field`.
- The `Game` component exposes `window.boardModel` and `window.setBoardModel` when running inside Cypress for E2E test control.

## Running Tests

Run unit and integration tests:

```bash
npm test
```

Run Cypress E2E tests (requires a running dev server):

```bash
npm run dev &
npm run cypress:ci
```
