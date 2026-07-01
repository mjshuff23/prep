import { z } from 'zod';
import { OperationTrace } from './types';

export const highlightSchema = z.object({
  id: z.string(),
  type: z.enum(['node', 'edge', 'pointer', 'index']),
  color: z.string().optional(),
  label: z.string().optional(),
});

export const invariantCheckSchema = z.object({
  valid: z.boolean(),
  errors: z.array(z.string()),
});

export const traceStepSchema = z.object({
  id: z.string(),
  index: z.number(),
  title: z.string(),
  description: z.string(),
  state: z.unknown(),
  highlights: z.array(highlightSchema).optional(),
  invariantCheck: invariantCheckSchema.optional(),
});

export const operationTraceSchema = z.object({
  id: z.string(),
  structure: z.enum([
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
  ]),
  operation: z.enum([
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
  ]),
  input: z.unknown(),
  initialState: z.unknown(),
  finalState: z.unknown(),
  steps: z.array(traceStepSchema),
  complexity: z.object({
    time: z.string(),
    space: z.string(),
    notes: z.string().optional(),
  }),
});

export function serializeTrace(trace: OperationTrace): string {
  try {
    return JSON.stringify(trace, null, 2);
  } catch (error) {
    throw new Error(`Failed to serialize trace: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function deserializeTrace(json: string): OperationTrace {
  try {
    const parsed = JSON.parse(json);
    return operationTraceSchema.parse(parsed) as OperationTrace;
  } catch (error) {
    throw new Error(`Failed to deserialize trace: ${error instanceof Error ? error.message : String(error)}`);
  }
}
