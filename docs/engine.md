# Core Data Structures Engine

This engine powers the entire visualization and trace generation for the data structures application. It is a pure TypeScript engine, meaning it contains no React or DOM-specific code. This ensures algorithms can run headlessly and in unit tests.

## Concepts

### Commands & Traces

Every action taken on a data structure is represented by an `OperationCommand`.
Applying an `OperationCommand` to a `StructureState` deterministically yields an `OperationTrace`.

1. **`OperationCommand`**: Contains `structure` (e.g. `'stack'`), `operation` (e.g. `'push'`), and a `payload`.
2. **`OperationTrace`**: Captures the step-by-step trace of how the algorithm transitioned from the `initialState` to the `finalState`.
3. **`TraceStep`**: Represents an atomic step in the algorithm, with a user-friendly title, description, the intermediate `state`, and optional visual `highlights`.

### Adding a New Data Structure

To add a new data structure, follow these steps:

1. **Define the Data Structure**: Create a new file in `src/ds/structures/` (e.g., `graph.ts`).
2. **Export a `DataStructureDefinition`**: Define state, schema validation via `zod`, and the `applyOperation` method.
3. **Use `TraceBuilder`**: In `applyOperation`, use `TraceBuilder` to construct the trace incrementally.
4. **Register**: Ensure the data structure is registered in `registry.ts`.
5. **Write Tests**: Create a corresponding `.test.ts` file covering all commands and payload validations.

### Example (Pseudocode)

```typescript
import { registry } from '@src/ds/core/registry';
// The registry is pre-loaded with core structures (stack, queue)


// Execute Command
const trace = registry.executeCommand(
  { items: [1, 2] },
  { structure: 'stack', operation: 'push', payload: { item: 3 } }
);

console.log(trace.steps);
// [{ title: 'Push Item', state: { items: [1, 2, 3] }, highlights: [...] }]
```
