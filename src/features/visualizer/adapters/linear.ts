import { Edge } from '@xyflow/react';
import { Highlight } from '../../../ds/core/types';
import { CustomNode, ValueNodeData } from '../types';
import { calculateLinearLayout } from '../layout/linear';

export function createLinearNodes(
  items: unknown[],
  highlights: Highlight[] = []
): { nodes: CustomNode[]; edges: Edge[] } {
  const positions = calculateLinearLayout(items.length);
  const nodes: CustomNode[] = [];

  for (let i = 0; i < items.length; i++) {
    const id = `index-${i}`;
    const value = items[i];

    const highlight = highlights.find((h) => h.id === id);
    let status: ValueNodeData['status'] = 'default';

    if (highlight) {
      if (highlight.color === 'danger') status = 'danger';
      else if (highlight.color === 'success') status = 'success';
      else if (highlight.color === 'warning') status = 'warning';
      else status = 'active'; // Default active state for uncolored highlights
    }

    nodes.push({
      id,
      type: 'value',
      position: positions[i],
      data: {
        value,
        status,
        label: `[${i}]`,
      },
    });
  }

  return { nodes, edges: [] };
}
