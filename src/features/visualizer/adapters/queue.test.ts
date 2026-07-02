import { describe, it, expect } from 'vitest';
import { queueAdapter } from './queue';

describe('queueAdapter', () => {
  it('converts state to flow model', () => {
    const model = queueAdapter.toFlowModel({
      state: { items: ['A', 'B'] },
      highlights: [{ id: 'index-0', type: 'node', color: 'success' }]
    });

    expect(model.nodes).toHaveLength(2);
    expect(model.nodes[0].data.value).toBe('A');
    expect(model.nodes[0].data.status).toBe('success');
    
    expect(model.nodes[1].data.value).toBe('B');
    expect(model.nodes[1].data.status).toBe('default');
    
    expect(model.edges).toHaveLength(0);
  });
});
