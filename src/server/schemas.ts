import { z } from 'zod';
import { STRUCTURE_KINDS } from '../ds/core/types';

export const structureKindEnum = z.enum(STRUCTURE_KINDS);

export const createPlaygroundSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional().nullable(),
  structure: structureKindEnum,
  stateJson: z.unknown(), // validated further in the server action using structure's validateState
  traceJson: z.unknown().optional().nullable(),
});

export const updatePlaygroundSchema = createPlaygroundSchema.partial().extend({
  id: z.string(),
});

export const createDatasetSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional().nullable(),
  structure: structureKindEnum.optional().nullable(),
  valuesJson: z.unknown(),
});

export const updateDatasetSchema = createDatasetSchema.partial().extend({
  id: z.string(),
});
