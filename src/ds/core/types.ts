export const STRUCTURE_KINDS = [
  'array',
  'linked-list',
  'stack',
  'queue',
  'deque',
  'hash-table',
  'binary-tree',
  'binary-search-tree',
  'heap',
  'graph',
  'trie',
  'disjoint-set',
] as const;

export type StructureKind = typeof STRUCTURE_KINDS[number];

export const OPERATION_KINDS = [
  'insert',
  'delete',
  'search',
  'update',
  'push',
  'pop',
  'enqueue',
  'dequeue',
  'peek',
  'connect',
  'disconnect',
  'heapify',
  'traverse',
  'reset',
] as const;

export type OperationKind = typeof OPERATION_KINDS[number];

export type OperationCommand<TPayload = unknown> = {
  structure: StructureKind;
  operation: OperationKind;
  payload: TPayload;
};

// Internal representation of the structure's state at a given time.
/**
 * Represents the internal shape of a data structure.
 * This explicitly requires states to be objects or arrays, preventing primitive states.
 */
export type StructureState = Record<string, unknown> | unknown[];

export type Highlight = {
  id: string; // The ID of the node/edge to highlight
  type: 'node' | 'edge' | 'pointer' | 'index';
  color?: string; // Optional custom color/intent (e.g. 'success', 'danger')
  label?: string; // Optional label for pointers
};

export type InvariantCheck = {
  valid: boolean;
  errors: string[];
};

export type TraceStep = {
  id: string;
  index: number;
  title: string;
  description: string;
  state: StructureState;
  highlights?: Highlight[];
  invariantCheck?: InvariantCheck;
};

export type OperationTrace = {
  id: string;
  structure: StructureKind;
  operation: OperationKind;
  input: unknown;
  initialState: StructureState;
  finalState: StructureState;
  steps: TraceStep[];
  complexity: {
    time: string;
    space: string;
    notes?: string;
  };
};

export type OperationSpec = {
  operation: OperationKind;
  description: string;
};

export interface DataStructureDefinition<TState, TCommandPayload> {
  kind: StructureKind;
  label: string;
  createInitialState(seed?: unknown): TState;
  getSupportedOperations(): OperationSpec[];
  parseCommand(command: OperationCommand<unknown>): OperationCommand<TCommandPayload>;
  applyOperation(
    state: TState,
    command: OperationCommand<TCommandPayload>
  ): OperationTrace;
  validateState(state: TState): InvariantCheck;
}
