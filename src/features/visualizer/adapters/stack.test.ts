import { describe, it, expect } from 'vitest';
import { stackAdapter } from './stack';

describe('stackAdapter', () => {
  it('converts state to flow model', () => {
    const model = stackAdapter.toFlowModel({
      state: { items: [10, 20] },
      highlights: [{ id: 'index-1', type: 'node', color: 'danger' }]
    });

    expect(model.nodes).toHaveLength(2);
    expect(model.nodes[0].data.value).toBe(10);
    expect(model.nodes[0].data.status).toBe('default');
    
    expect(model.nodes[1].data.value).toBe(20);
    expect(model.nodes[1].data.status).toBe('danger');
    
    expect(model.edges).toHaveLength(0);
  });
});
