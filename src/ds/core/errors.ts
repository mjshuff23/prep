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

export class InvariantViolationError extends DataStructureError {
  constructor(message: string) {
    super(`Invariant Violation: ${message}`);
    this.name = 'InvariantViolationError';
  }
}
