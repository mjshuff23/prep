# Data Structures Prep App

A production-grade foundation for a data structures learning and prep platform. This app aims to help learners visualize, inspect, and trace data structure operations step-by-step.

## Local Setup

### Prerequisites
- Node.js >= 20
- pnpm >= 9

### Installation

1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```
2. Run the development server:
   ```bash
   pnpm dev
   ```

### Scripts

- `pnpm dev`: Start the development server.
- `pnpm build`: Build the production bundle.
- `pnpm lint`: Run ESLint.
- `pnpm typecheck`: Run TypeScript type-checking without emitting files.
- `pnpm test`: Run Vitest unit and component tests.
- `pnpm test:watch`: Run Vitest in watch mode.
- `pnpm test:e2e`: Run Playwright end-to-end tests.
- `pnpm quality`: Run lint, typecheck, and tests locally to verify quality before pushing.

## Architecture Boundaries

To ensure this app scales cleanly as we add more data structures and visualizations:

1. **Algorithm Engine vs UI**: Keep pure algorithm and data-structure logic independent of React and Next.js. The logic should reside in `src/ds/core` and `src/ds/structures`.
2. **Visualizations**: Visualization logic acts as a consumer of deterministic states from the data-structure engine. It should not be the source of truth.
3. **No Global Mutable State**: Trace replays and operation tracking must not use global mutable state. Use proper deterministic outputs and state management.
4. **Test Everything**: Pure modules must have corresponding unit tests. UI components should have tests validating their behavior.

## Project Intent

This scaffold represents Phase 0 and Phase 1 of the app: establishing the structure, routing, components, testing strategies, and the foundation required to introduce the first vertical slice of the platform.
