import { OperationTrace } from './types';

export function serializeTrace(trace: OperationTrace): string {
  try {
    return JSON.stringify(trace, null, 2);
  } catch (error) {
    throw new Error(`Failed to serialize trace: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function deserializeTrace(json: string): OperationTrace {
  try {
    return JSON.parse(json) as OperationTrace;
  } catch (error) {
    throw new Error(`Failed to deserialize trace: ${error instanceof Error ? error.message : String(error)}`);
  }
}
