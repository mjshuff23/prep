'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  createPlaygroundSchema, 
  updatePlaygroundSchema, 
  createDatasetSchema, 
  updateDatasetSchema 
} from './schemas';
import { registry } from '@/ds/core/registry';
import { revalidatePath } from 'next/cache';

// Helper to get current user ID
async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}

// Playgrounds
export async function createPlayground(data: unknown) {
  const userId = await requireUser();
  const parsed = createPlaygroundSchema.parse(data);

  // Validate stateJson against the structure's invariant checks
  const definition = registry.getStructure(parsed.structure);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invariantCheck = definition.validateState(parsed.stateJson as any);
  if (!invariantCheck.valid) {
    throw new Error(`Invalid state for structure ${parsed.structure}: ${invariantCheck.errors.join(', ')}`);
  }

  const stateStr = JSON.stringify(parsed.stateJson);
  const traceStr = parsed.traceJson ? JSON.stringify(parsed.traceJson) : null;

  const playground = await prisma.playground.create({
    data: {
      userId,
      name: parsed.name,
      description: parsed.description,
      structure: parsed.structure,
      stateJson: stateStr,
      traceJson: traceStr,
    }
  });

  revalidatePath('/dashboard/playgrounds'); // adjust path if needed
  return playground;
}

export async function updatePlayground(data: unknown) {
  const userId = await requireUser();
  const parsed = updatePlaygroundSchema.parse(data);

  // We need existing to validate the structure if it changed
  const existing = await prisma.playground.findUnique({ where: { id: parsed.id } });
  if (!existing || existing.userId !== userId) {
    throw new Error('Not found or forbidden');
  }

  const structureToValidate = parsed.structure || existing.structure;
  const stateToValidate = parsed.stateJson !== undefined 
    ? parsed.stateJson 
    : (parsed.structure && parsed.structure !== existing.structure ? JSON.parse(existing.stateJson) : undefined);
    
  if (stateToValidate !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const definition = registry.getStructure(structureToValidate as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invariantCheck = definition.validateState(stateToValidate as any);
    if (!invariantCheck.valid) {
      throw new Error(`Invalid state for structure ${structureToValidate}: ${invariantCheck.errors.join(', ')}`);
    }
  }

  const stateStr = parsed.stateJson !== undefined ? JSON.stringify(parsed.stateJson) : undefined;
  const traceStr = parsed.traceJson !== undefined ? (parsed.traceJson ? JSON.stringify(parsed.traceJson) : null) : undefined;

  const { count } = await prisma.playground.updateMany({
    where: { id: parsed.id, userId },
    data: {
      name: parsed.name,
      description: parsed.description,
      structure: parsed.structure,
      stateJson: stateStr,
      traceJson: traceStr,
    }
  });

  if (count === 0) throw new Error('Not found or forbidden');

  revalidatePath('/dashboard/playgrounds');
  return { ...existing, ...parsed, stateJson: stateStr || existing.stateJson, traceJson: traceStr || existing.traceJson };
}

export async function getPlaygroundById(id: string) {
  const userId = await requireUser();
  const playground = await prisma.playground.findUnique({ where: { id } });
  
  if (!playground || playground.userId !== userId) {
    throw new Error('Not found or forbidden');
  }

  return {
    ...playground,
    stateJson: JSON.parse(playground.stateJson),
    traceJson: playground.traceJson ? JSON.parse(playground.traceJson) : null,
  };
}

export async function listPlaygroundsForCurrentUser() {
  const userId = await requireUser();
  const playgrounds = await prisma.playground.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 50
  });

  return playgrounds.map(p => ({
    ...p,
    stateJson: JSON.parse(p.stateJson),
    traceJson: p.traceJson ? JSON.parse(p.traceJson) : null,
  }));
}

export async function deletePlayground(id: string) {
  const userId = await requireUser();
  const { count } = await prisma.playground.deleteMany({ where: { id, userId } });
  if (count === 0) {
    throw new Error('Not found or forbidden');
  }

  revalidatePath('/dashboard/playgrounds');
}

// Datasets
export async function createDataset(data: unknown) {
  const userId = await requireUser();
  const parsed = createDatasetSchema.parse(data);

  // Ensure dataset shape is array for basic validation, though this can be extended
  if (!Array.isArray(parsed.valuesJson)) {
    throw new Error('valuesJson must be an array');
  }

  const valuesStr = JSON.stringify(parsed.valuesJson);

  const dataset = await prisma.dataset.create({
    data: {
      userId,
      name: parsed.name,
      description: parsed.description,
      structure: parsed.structure,
      valuesJson: valuesStr,
    }
  });

  revalidatePath('/dashboard/datasets');
  return dataset;
}

export async function updateDataset(data: unknown) {
  const userId = await requireUser();
  const parsed = updateDatasetSchema.parse(data);

  if (parsed.valuesJson !== undefined && !Array.isArray(parsed.valuesJson)) {
    throw new Error('valuesJson must be an array');
  }

  const valuesStr = parsed.valuesJson !== undefined ? JSON.stringify(parsed.valuesJson) : undefined;

  const { count } = await prisma.dataset.updateMany({
    where: { id: parsed.id, userId },
    data: {
      name: parsed.name,
      description: parsed.description,
      structure: parsed.structure,
      valuesJson: valuesStr,
    }
  });

  if (count === 0) throw new Error('Not found or forbidden');

  revalidatePath('/dashboard/datasets');
  return { id: parsed.id, name: parsed.name };
}

export async function listDatasetsForCurrentUser() {
  const userId = await requireUser();
  const datasets = await prisma.dataset.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 50
  });

  return datasets.map(d => ({
    ...d,
    valuesJson: JSON.parse(d.valuesJson),
  }));
}

export async function deleteDataset(id: string) {
  const userId = await requireUser();
  const { count } = await prisma.dataset.deleteMany({ where: { id, userId } });
  if (count === 0) {
    throw new Error('Not found or forbidden');
  }

  revalidatePath('/dashboard/datasets');
}
