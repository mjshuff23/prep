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
      delete: vi.fn()
    },
    dataset: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
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
