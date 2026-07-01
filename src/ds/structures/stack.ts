import { z } from 'zod';
import {
  DataStructureDefinition,
  InvariantCheck,
  OperationCommand,
  OperationSpec,
  OperationTrace,
} from '../core/types';
import { TraceBuilder } from '../traces/builder';
import { InvalidCommandError, UnsupportedOperationError } from '../core/errors';
import { createInvariantCheck } from '../core/invariants';
import { emptySchema, createLinearInitialState } from '../core/helpers';

export type StackState = {
  items: unknown[];
};

const pushSchema = z.object({ item: z.unknown() });
const stackCommandSchema = z.discriminatedUnion('operation', [
  z.object({ operation: z.literal('push'), payload: pushSchema }),
  z.object({ operation: z.literal('pop'), payload: emptySchema }),
  z.object({ operation: z.literal('peek'), payload: emptySchema }),
  z.object({ operation: z.literal('reset'), payload: emptySchema }),
]);

export type StackCommandPayload = z.infer<typeof stackCommandSchema>['payload'];

export const stackDefinition: DataStructureDefinition<StackState, StackCommandPayload> = {
  kind: 'stack',
  label: 'Stack',
  
  createInitialState(seed?: unknown): StackState {
    return createLinearInitialState(seed) as StackState;
  },

  getSupportedOperations(): OperationSpec[] {
    return [
      { operation: 'push', description: 'Push an item onto the top of the stack.' },
      { operation: 'pop', description: 'Remove and return the top item from the stack.' },
      { operation: 'peek', description: 'Return the top item from the stack without removing it.' },
      { operation: 'reset', description: 'Clear all items from the stack.' },
    ];
  },

  parseCommand(command: unknown): OperationCommand<StackCommandPayload> {
    const raw = command as Record<string, unknown>;
    if (raw?.structure !== 'stack') {
      throw new InvalidCommandError(`Expected structure 'stack', but got '${raw?.structure}'`, command as OperationCommand);
    }
    const parsed = stackCommandSchema.safeParse(command);
    if (!parsed.success) {
      throw new InvalidCommandError(parsed.error.message, command as OperationCommand);
    }
    return {
      structure: 'stack',
      operation: parsed.data.operation,
      payload: parsed.data.payload,
    };
  },

  validateState(state: StackState): InvariantCheck {
    const errors: string[] = [];
    if (!Array.isArray(state.items)) {
      errors.push('Stack items must be an array.');
    }
    return createInvariantCheck(errors);
  },

  applyOperation(state: StackState, command: OperationCommand<StackCommandPayload>): OperationTrace {
    const builder = new TraceBuilder(command).setInitialState(state);

    switch (command.operation) {
      case 'push': {
        const payload = command.payload as z.infer<typeof pushSchema>;
        const nextState = { items: [...state.items, payload.item] };
        
        builder.addStep({
          title: 'Push Item',
          description: `Pushing item onto the stack.`,
          state: nextState,
          highlights: [{ id: `index-${nextState.items.length - 1}`, type: 'node' }],
          invariantCheck: this.validateState(nextState),
        });
        
        builder.setComplexity('O(1)', 'O(1)');
        return builder.setFinalState(nextState).build();
      }

      case 'pop': {
        if (state.items.length === 0) {
          throw new InvalidCommandError('Cannot pop from an empty stack.', command);
        }
        const nextState = { items: state.items.slice(0, -1) };

        builder.addStep({
          title: 'Pop Item',
          description: `Popped item from the top of the stack.`,
          state: nextState,
          highlights: [{ id: `index-${state.items.length - 1}`, type: 'node', color: 'danger' }],
          invariantCheck: this.validateState(nextState),
        });

        builder.setComplexity('O(1)', 'O(1)');
        return builder.setFinalState(nextState).build();
      }

      case 'peek': {
        if (state.items.length === 0) {
          throw new InvalidCommandError('Cannot peek into an empty stack.', command);
        }
        builder.addStep({
          title: 'Peek Item',
          description: `Viewing the top item.`,
          state,
          highlights: [{ id: `index-${state.items.length - 1}`, type: 'node' }],
          invariantCheck: this.validateState(state),
        });
        
        builder.setComplexity('O(1)', 'O(1)');
        return builder.setFinalState(state).build();
      }

      case 'reset': {
        const nextState = { items: [] };
        builder.addStep({
          title: 'Reset Stack',
          description: `Cleared all items from the stack.`,
          state: nextState,
          invariantCheck: this.validateState(nextState),
        });

        builder.setComplexity('O(1)', 'O(1)', 'Releasing references to all elements.');
        return builder.setFinalState(nextState).build();
      }

      default:
        throw new UnsupportedOperationError('stack', command.operation);
    }
  },
};
