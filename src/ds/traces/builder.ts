import {
  Highlight,
  InvariantCheck,
  OperationCommand,
  OperationTrace,
  StructureState,
  TraceStep,
} from '../core/types';
import { InvariantViolationError } from '../core/errors';

export class TraceBuilder {
  private readonly idPrefix: string;
  private initialState: StructureState | undefined;
  private finalState: StructureState | undefined;
  private readonly steps: TraceStep[] = [];
  private stepIndex = 0;
  private complexity = { time: 'O(1)', space: 'O(1)', notes: undefined as string | undefined };

  constructor(
    private readonly command: OperationCommand<unknown>,
    private readonly generateId: () => string = () => crypto.randomUUID()
  ) {
    this.idPrefix = this.generateId();
  }

  setInitialState(state: StructureState): this {
    this.initialState = state;
    return this;
  }

  addStep(options: {
    title: string;
    description: string;
    state: StructureState;
    highlights?: Highlight[];
    invariantCheck?: InvariantCheck;
  }): this {
    const currentIndex = this.stepIndex++;
    this.steps.push({
      id: `${this.idPrefix}-step-${currentIndex}`,
      index: currentIndex,
      ...options,
    });
    return this;
  }

  setComplexity(time: string, space: string, notes?: string): this {
    this.complexity = { time, space, notes };
    return this;
  }

  setFinalState(state: StructureState): this {
    this.finalState = state;
    return this;
  }

  build(): OperationTrace {
    if (this.initialState === undefined || this.finalState === undefined) {
      throw new InvariantViolationError('TraceBuilder requires initial and final states to be set before building.');
    }
    return {
      id: this.idPrefix,
      structure: this.command.structure,
      operation: this.command.operation,
      input: this.command.payload,
      initialState: this.initialState,
      finalState: this.finalState,
      steps: this.steps,
      complexity: this.complexity,
    };
  }
}
