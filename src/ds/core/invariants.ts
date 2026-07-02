import { InvariantCheck } from './types';
import { InvariantViolationError } from './errors';

export function assertInvariant(condition: boolean, message: string): void {
  if (!condition) {
    throw new InvariantViolationError(message);
  }
}

export function createInvariantCheck(errors: string[]): InvariantCheck {
  return {
    valid: errors.length === 0,
    errors,
  };
}
