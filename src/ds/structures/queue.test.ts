import { describe, it, expect } from 'vitest';
import { queueDefinition } from './queue';
import { InvalidCommandError } from '../core/errors';

describe('Queue Definition', () => {
  it('creates initial state correctly', () => {
    expect(queueDefinition.createInitialState()).toEqual({ items: [] });
    expect(queueDefinition.createInitialState([1, 2, 3])).toEqual({ items: [1, 2, 3] });
  });

  it('validates state correctly', () => {
    expect(queueDefinition.validateState({ items: [] }).valid).toBe(true);
    // @ts-expect-error Intentionally invalid state
    expect(queueDefinition.validateState({ items: 'not-array' }).valid).toBe(false);
  });

  describe('Operations', () => {
    it('enqueues an item', () => {
      const state = { items: [1] };
      const command = queueDefinition.parseCommand({
        structure: 'queue',
        operation: 'enqueue',
        payload: { item: 2 },
      });
      const trace = queueDefinition.applyOperation(state, command);

      expect(trace.finalState).toEqual({ items: [1, 2] });
      expect(trace.steps).toHaveLength(1);
      expect(trace.steps[0].title).toBe('Enqueue Item');
      expect(trace.steps[0].highlights).toContainEqual({ id: 'index-1', type: 'node' });
    });

    it('dequeues an item', () => {
      const state = { items: [1, 2] };
      const command = queueDefinition.parseCommand({
        structure: 'queue',
        operation: 'dequeue',
        payload: {},
      });
      const trace = queueDefinition.applyOperation(state, command);

      expect(trace.finalState).toEqual({ items: [2] });
      expect(trace.steps).toHaveLength(1);
      expect(trace.steps[0].title).toBe('Dequeue Item');
      expect(trace.steps[0].highlights).toContainEqual({ id: 'index-0', type: 'node', color: 'danger' });
    });

    it('throws error when dequeuing empty queue', () => {
      const state = { items: [] };
      const command = queueDefinition.parseCommand({
        structure: 'queue',
        operation: 'dequeue',
        payload: {},
      });
      expect(() => queueDefinition.applyOperation(state, command)).toThrow(InvalidCommandError);
    });

    it('peeks an item', () => {
      const state = { items: [1, 2] };
      const command = queueDefinition.parseCommand({
        structure: 'queue',
        operation: 'peek',
        payload: {},
      });
      const trace = queueDefinition.applyOperation(state, command);

      expect(trace.finalState).toEqual({ items: [1, 2] });
      expect(trace.steps).toHaveLength(1);
      expect(trace.steps[0].title).toBe('Peek Item');
    });

    it('throws error when peeking empty queue', () => {
      const state = { items: [] };
      const command = queueDefinition.parseCommand({
        structure: 'queue',
        operation: 'peek',
        payload: {},
      });
      expect(() => queueDefinition.applyOperation(state, command)).toThrow(InvalidCommandError);
    });

    it('resets the queue', () => {
      const state = { items: [1, 2, 3] };
      const command = queueDefinition.parseCommand({
        structure: 'queue',
        operation: 'reset',
        payload: {},
      });
      const trace = queueDefinition.applyOperation(state, command);

      expect(trace.finalState).toEqual({ items: [] });
      expect(trace.steps).toHaveLength(1);
      expect(trace.steps[0].title).toBe('Reset Queue');
    });
  });

  describe('Validation', () => {
    it('throws on invalid payload for enqueue', () => {
      expect(() =>
        queueDefinition.parseCommand({
          structure: 'queue',
          operation: 'enqueue',
          payload: {}, // Missing item
        })
      ).toThrow();
    });
  });
});
