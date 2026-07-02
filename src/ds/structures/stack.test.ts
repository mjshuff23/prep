import { describe, it, expect } from 'vitest';
import { stackDefinition } from './stack';
import { InvalidCommandError } from '../core/errors';

describe('Stack Definition', () => {
  it('creates initial state correctly', () => {
    expect(stackDefinition.createInitialState()).toEqual({ items: [] });
    expect(stackDefinition.createInitialState([1, 2, 3])).toEqual({ items: [1, 2, 3] });
  });

  it('validates state correctly', () => {
    expect(stackDefinition.validateState({ items: [] }).valid).toBe(true);
    // @ts-expect-error Intentionally invalid state
    expect(stackDefinition.validateState({ items: 'not-array' }).valid).toBe(false);
  });

  describe('Operations', () => {
    it('pushes an item', () => {
      const state = { items: [1] };
      const command = stackDefinition.parseCommand({
        structure: 'stack',
        operation: 'push',
        payload: { item: 2 },
      });
      const trace = stackDefinition.applyOperation(state, command);

      expect(trace.finalState).toEqual({ items: [1, 2] });
      expect(trace.steps).toHaveLength(1);
      expect(trace.steps[0].title).toBe('Push Item');
      expect(trace.steps[0].highlights).toContainEqual({ id: 'index-1', type: 'node' });
    });

    it('pops an item', () => {
      const state = { items: [1, 2] };
      const command = stackDefinition.parseCommand({
        structure: 'stack',
        operation: 'pop',
        payload: {},
      });
      const trace = stackDefinition.applyOperation(state, command);

      expect(trace.finalState).toEqual({ items: [1] });
      expect(trace.steps).toHaveLength(1);
      expect(trace.steps[0].title).toBe('Pop Item');
      expect(trace.steps[0].highlights).toContainEqual({ id: 'index-1', type: 'node', color: 'danger' });
    });

    it('throws error when popping empty stack', () => {
      const state = { items: [] };
      const command = stackDefinition.parseCommand({
        structure: 'stack',
        operation: 'pop',
        payload: {},
      });
      expect(() => stackDefinition.applyOperation(state, command)).toThrow(InvalidCommandError);
    });

    it('peeks an item', () => {
      const state = { items: [1, 2] };
      const command = stackDefinition.parseCommand({
        structure: 'stack',
        operation: 'peek',
        payload: {},
      });
      const trace = stackDefinition.applyOperation(state, command);

      expect(trace.finalState).toEqual({ items: [1, 2] });
      expect(trace.steps).toHaveLength(1);
      expect(trace.steps[0].title).toBe('Peek Item');
      expect(trace.steps[0].highlights).toContainEqual({ id: 'index-1', type: 'node' });
    });

    it('throws error when peeking empty stack', () => {
      const state = { items: [] };
      const command = stackDefinition.parseCommand({
        structure: 'stack',
        operation: 'peek',
        payload: {},
      });
      expect(() => stackDefinition.applyOperation(state, command)).toThrow(InvalidCommandError);
    });

    it('resets the stack', () => {
      const state = { items: [1, 2, 3] };
      const command = stackDefinition.parseCommand({
        structure: 'stack',
        operation: 'reset',
        payload: {},
      });
      const trace = stackDefinition.applyOperation(state, command);

      expect(trace.finalState).toEqual({ items: [] });
      expect(trace.steps).toHaveLength(1);
      expect(trace.steps[0].title).toBe('Reset Stack');
    });
  });

  describe('Validation', () => {
    it('throws on invalid payload for push', () => {
      expect(() =>
        stackDefinition.parseCommand({
          structure: 'stack',
          operation: 'push',
          payload: {}, // Missing item
        })
      ).toThrow();
    });
  });
});
