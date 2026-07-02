import { describe, it, expect, beforeEach } from 'vitest';
import { registry } from './registry';
import { stackDefinition } from '../structures/stack';
import { InvalidCommandError, StructureNotFoundError } from './errors';

describe('DataStructureRegistry', () => {
  beforeEach(() => {
    // Register stack if not already registered to keep tests clean
    try {
      registry.register(stackDefinition);
    } catch {
      // Ignore if already registered
    }
  });

  it('can register and retrieve a structure', () => {
    const structure = registry.getStructure('stack');
    expect(structure).toBe(stackDefinition);
  });

  it('throws when getting an unregistered structure', () => {
    expect(() => registry.getStructure('graph')).toThrow(StructureNotFoundError);
  });

  it('executes a valid command and returns a trace', () => {
    const state = { items: [1] };
    const trace = registry.executeCommand(state, {
      structure: 'stack',
      operation: 'push',
      payload: { item: 2 },
    });

    expect(trace.finalState).toEqual({ items: [1, 2] });
    expect(trace.steps).toHaveLength(1);
    expect(trace.structure).toBe('stack');
    expect(trace.operation).toBe('push');
  });

  it('throws an error on invalid command payload during execution', () => {
    const state = { items: [1] };
    
    expect(() => {
      registry.executeCommand(state, {
        structure: 'stack',
        operation: 'push',
        payload: { wrongKey: 2 }, // Invalid payload
      });
    }).toThrow(InvalidCommandError);
  });
});
