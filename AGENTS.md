# Agent Implementation Rules

When developing and extending this data structures application, coding agents MUST adhere to the following rules:

1. **Strict TypeScript**: All code must be strictly typed. Avoid `any` unless absolutely necessary.
2. **Architecture Separation**: 
   - Never implement algorithm logic directly inside React components or hooks.
   - Algorithms must be implemented in `src/ds/` and tested in isolation.
3. **Testing is Mandatory**:
   - For every new data structure or utility logic, create corresponding unit tests in Vitest.
   - For every new interactive UI component, create component tests using React Testing Library.
4. **No Visualization Spaghetti**: 
   - Build generic visualization adapters using React Flow.
   - Avoid creating bespoke, hardcoded DOM visualizers per data structure.
5. **Quality Gates**:
   - Ensure `pnpm quality` passes before pushing any code or completing a task.
   - Do not bypass linter warnings or TypeScript errors; fix them.
6. **No Placeholder Work**: 
   - If extending the app, provide real, working implementations unless specified as a mock by the task.

Following these constraints will maintain the integrity of this foundation.
