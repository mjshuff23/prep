import { describe, it, expect } from 'vitest';
import { createPlaygroundSchema, createDatasetSchema } from '@/server/schemas';

describe('Validation Schemas', () => {
  describe('createPlaygroundSchema', () => {
    it('validates a correct payload', () => {
      const payload = {
        name: 'My Playground',
        description: 'Test',
        structure: 'stack',
        stateJson: { items: [1, 2, 3] }
      };
      const result = createPlaygroundSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects invalid structure kind', () => {
      const payload = {
        name: 'My Playground',
        structure: 'invalid-structure',
        stateJson: {}
      };
      const result = createPlaygroundSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects missing name', () => {
      const payload = {
        name: '',
        structure: 'stack',
        stateJson: {}
      };
      const result = createPlaygroundSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('createDatasetSchema', () => {
    it('validates a correct payload', () => {
      const payload = {
        name: 'My Dataset',
        valuesJson: [1, 2, 3]
      };
      const result = createDatasetSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });
});
