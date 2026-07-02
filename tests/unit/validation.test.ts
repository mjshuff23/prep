import { describe, it, expect } from 'vitest';
import { createPlaygroundSchema, createDatasetSchema, updatePlaygroundSchema, updateDatasetSchema } from '@/server/schemas';

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

    it('rejects invalid structure kind', () => {
      const payload = {
        name: 'My Dataset',
        structure: 'invalid-structure',
        valuesJson: [1, 2, 3]
      };
      const result = createDatasetSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('updatePlaygroundSchema', () => {
    it('requires id and allows partial fields', () => {
      const payload = { id: 'pg-1', name: 'New Name' };
      const result = updatePlaygroundSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('fails without id', () => {
      const payload = { name: 'New Name' };
      const result = updatePlaygroundSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('updateDatasetSchema', () => {
    it('requires id and allows partial fields', () => {
      const payload = { id: 'ds-1', name: 'New Name' };
      const result = updateDatasetSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('fails without id', () => {
      const payload = { name: 'New Name' };
      const result = updateDatasetSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
