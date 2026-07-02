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

export type QueueState = {
  items: unknown[];
};

const enqueueSchema = z.object({ item: z.unknown() });
const queueCommandSchema = z.discriminatedUnion('operation', [
  z.object({ operation: z.literal('enqueue'), payload: enqueueSchema }),
  z.object({ operation: z.literal('dequeue'), payload: emptySchema }),
  z.object({ operation: z.literal('peek'), payload: emptySchema }),
  z.object({ operation: z.literal('reset'), payload: emptySchema }),
]);

export type QueueCommandPayload = z.infer<typeof queueCommandSchema>['payload'];

export const queueDefinition: DataStructureDefinition<QueueState, QueueCommandPayload> = {
  kind: 'queue',
  label: 'Queue',
  
  createInitialState(seed?: unknown): QueueState {
    return createLinearInitialState(seed) as QueueState;
  },

  getSupportedOperations(): OperationSpec[] {
    return [
      { operation: 'enqueue', description: 'Add an item to the back of the queue.' },
      { operation: 'dequeue', description: 'Remove and return the front item from the queue.' },
      { operation: 'peek', description: 'Return the front item from the queue without removing it.' },
      { operation: 'reset', description: 'Clear all items from the queue.' },
    ];
  },

  parseCommand(command: unknown): OperationCommand<QueueCommandPayload> {
    const raw = command as Record<string, unknown>;
    if (raw?.structure !== 'queue') {
      throw new InvalidCommandError(`Expected structure 'queue', but got '${raw?.structure}'`, command as OperationCommand);
    }
    const parsed = queueCommandSchema.safeParse(command);
    if (!parsed.success) {
      throw new InvalidCommandError(parsed.error.message, command as OperationCommand);
    }
    return {
      structure: 'queue',
      operation: parsed.data.operation,
      payload: parsed.data.payload,
    };
  },

  validateState(state: QueueState): InvariantCheck {
    const errors: string[] = [];
    if (!Array.isArray(state.items)) {
      errors.push('Queue items must be an array.');
    }
    return createInvariantCheck(errors);
  },

  applyOperation(state: QueueState, command: OperationCommand<QueueCommandPayload>): OperationTrace {
    const builder = new TraceBuilder(command).setInitialState(state);

    switch (command.operation) {
      case 'enqueue': {
        const payload = command.payload as z.infer<typeof enqueueSchema>;
        const nextState = { items: [...state.items, payload.item] };
        
        builder.addStep({
          title: 'Enqueue Item',
          description: `Adding item to the back of the queue.`,
          state: nextState,
          highlights: [{ id: `index-${nextState.items.length - 1}`, type: 'node' }],
          invariantCheck: this.validateState(nextState),
        });
        
        builder.setComplexity('O(1)', 'O(1)');
        return builder.setFinalState(nextState).build();
      }

      case 'dequeue': {
        if (state.items.length === 0) {
          throw new InvalidCommandError('Cannot dequeue from an empty queue.', command);
        }
        const nextState = { items: state.items.slice(1) };

        builder.addStep({
          title: 'Dequeue Item',
          description: `Removed item from the front of the queue.`,
          state: nextState,
          highlights: [{ id: 'index-0', type: 'node', color: 'danger' }],
          invariantCheck: this.validateState(nextState),
        });

        builder.setComplexity('O(1)', 'O(1)', 'In a real queue, dequeue might be O(N) depending on array shift implementation, but abstractly O(1).');
        return builder.setFinalState(nextState).build();
      }

      case 'peek': {
        if (state.items.length === 0) {
          throw new InvalidCommandError('Cannot peek into an empty queue.', command);
        }
        builder.addStep({
          title: 'Peek Item',
          description: `Viewing the front item.`,
          state,
          highlights: [{ id: 'index-0', type: 'node' }],
          invariantCheck: this.validateState(state),
        });
        
        builder.setComplexity('O(1)', 'O(1)');
        return builder.setFinalState(state).build();
      }

      case 'reset': {
        const nextState = { items: [] };
        builder.addStep({
          title: 'Reset Queue',
          description: `Cleared all items from the queue.`,
          state: nextState,
          invariantCheck: this.validateState(nextState),
        });

        builder.setComplexity('O(1)', 'O(1)', 'Releasing references to all elements.');
        return builder.setFinalState(nextState).build();
      }

      default:
        throw new UnsupportedOperationError('queue', command.operation);
    }
  },
};
