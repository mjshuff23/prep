/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  createPlayground, 
  getPlaygroundById, 
  updatePlayground 
} from '@/server/actions';

// Mock dependencies
vi.mock('@/lib/auth', () => ({
  auth: vi.fn()
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    playground: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
      findMany: vi.fn()
    },
    dataset: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
      findMany: vi.fn()
    }
  }
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

describe('Server Actions - Playgrounds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createPlayground fails if unauthenticated', async () => {
    vi.mocked(auth as any).mockResolvedValueOnce(null);
    await expect(createPlayground({
      name: 'Test',
      structure: 'stack',
      stateJson: { items: [] }
    })).rejects.toThrow('Unauthorized');
  });

  it('createPlayground succeeds for authenticated user', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' } as any);
    const mockReturn = { id: 'pg-1', name: 'Test', userId: 'user-1' };
    vi.mocked(prisma.playground.create).mockResolvedValueOnce(mockReturn as any);

    const res = await createPlayground({
      name: 'Test',
      structure: 'stack',
      stateJson: { items: [] }
    });

    expect(prisma.playground.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-1',
        name: 'Test',
        structure: 'stack',
        stateJson: '{"items":[]}'
      })
    });
    expect(res).toEqual(mockReturn);
  });

  it('getPlaygroundById enforces ownership', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' } as any);
    vi.mocked(prisma.playground.findUnique).mockResolvedValueOnce({
      id: 'pg-1',
      userId: 'user-2', // Different user
      name: 'Test',
      structure: 'stack',
      stateJson: '{"items":[]}'
    } as any);

    await expect(getPlaygroundById('pg-1')).rejects.toThrow('Not found or forbidden');
  });

  it('updatePlayground enforces ownership', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' } as any);
    vi.mocked(prisma.playground.findUnique).mockResolvedValueOnce({
      id: 'pg-1',
      userId: 'user-2', // Different user
      name: 'Test',
      structure: 'stack',
      stateJson: '{"items":[]}'
    } as any);

    await expect(updatePlayground({ id: 'pg-1', name: 'New Name' })).rejects.toThrow('Not found or forbidden');
  });
});

describe('Server Actions - Datasets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createDataset fails if unauthenticated', async () => {
    vi.mocked(auth as any).mockResolvedValueOnce(null);
    const { createDataset } = await import('@/server/actions');
    await expect(createDataset({
      name: 'Test DS',
      valuesJson: [1, 2, 3]
    })).rejects.toThrow('Unauthorized');
  });

  it('createDataset succeeds for authenticated user', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' } as any);
    const mockReturn = { id: 'ds-1', name: 'Test DS', userId: 'user-1' };
    vi.mocked(prisma.dataset.create).mockResolvedValueOnce(mockReturn as any);

    const { createDataset } = await import('@/server/actions');
    const res = await createDataset({
      name: 'Test DS',
      valuesJson: [1, 2, 3]
    });

    expect(prisma.dataset.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-1',
        name: 'Test DS',
        valuesJson: '[1,2,3]'
      })
    });
    expect(res).toEqual(mockReturn);
  });

  it('updateDataset enforces ownership', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' } as any);
    vi.mocked(prisma.dataset.findUnique).mockResolvedValueOnce({ id: 'ds-1', userId: 'other-user', name: 'Old' } as any);

    const { updateDataset } = await import('@/server/actions');
    await expect(updateDataset({ id: 'ds-1', name: 'New Name' })).rejects.toThrow('Not found or forbidden');
  });

  it('deleteDataset enforces ownership', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' } as any);
    vi.mocked(prisma.dataset.deleteMany).mockResolvedValueOnce({ count: 0 } as any);

    const { deleteDataset } = await import('@/server/actions');
    await expect(deleteDataset('ds-1')).rejects.toThrow('Not found or forbidden');
  });

  it('listDatasetsForCurrentUser returns list', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' } as any);
    vi.mocked(prisma.dataset.findMany).mockResolvedValueOnce([
      { id: 'ds-1', valuesJson: '[1,2,3]' }
    ] as any);

    const { listDatasetsForCurrentUser } = await import('@/server/actions');
    const res = await listDatasetsForCurrentUser();
    expect(res).toEqual([{ id: 'ds-1', valuesJson: [1,2,3] }]);
  });
});
