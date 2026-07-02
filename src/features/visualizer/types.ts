import { Node, Edge } from '@xyflow/react';
import { StructureKind, Highlight } from '../../ds/core/types';

export interface VisualizationAdapter<TState> {
  structure: StructureKind;
  toFlowModel(input: {
    state: TState;
    highlights?: Highlight[];
    viewportMode?: 'compact' | 'detailed';
  }): {
    nodes: Node[];
    edges: Edge[];
  };
}

export type ValueNodeData = {
  value: unknown;
  label?: string;
  status?: 'active' | 'success' | 'danger' | 'warning' | 'default';
};

export type CustomNode = Node<ValueNodeData, 'value'>;
