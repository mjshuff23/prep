import { OperationCommand, StructureKind } from './types';

export class DataStructureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DataStructureError';
  }
}

export class InvalidCommandError extends DataStructureError {
  constructor(message: string, public readonly command?: OperationCommand) {
    super(message);
    this.name = 'InvalidCommandError';
  }
}

export class UnsupportedOperationError extends DataStructureError {
  constructor(kind: StructureKind, operation: string) {
    super(`Operation '${operation}' is not supported on structure '${kind}'.`);
    this.name = 'UnsupportedOperationError';
  }
}

export class StructureNotFoundError extends DataStructureError {
  constructor(kind: string) {
    super(`Data structure '${kind}' is not registered.`);
    this.name = 'StructureNotFoundError';
  }
}

export class TraceSerializationError extends DataStructureError {
  constructor(message: string, public readonly originalError?: unknown) {
    super(`Serialization Error: ${message}`);
    this.name = 'TraceSerializationError';
  }
}

export class InvariantViolationError extends DataStructureError {
  constructor(message: string) {
    super(`Invariant Violation: ${message}`);
    this.name = 'InvariantViolationError';
  }
}
