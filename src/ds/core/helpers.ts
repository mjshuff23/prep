import { z } from 'zod';

export const emptySchema = z.strictObject({}).default({});

export function createLinearInitialState(seed?: unknown): { items: unknown[] } {
  if (Array.isArray(seed)) {
    return { items: [...seed] };
  }
  return { items: [] };
}
