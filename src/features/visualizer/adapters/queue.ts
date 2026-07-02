import { QueueState } from '../../../ds/structures/queue';
import { VisualizationAdapter } from '../types';
import { createLinearNodes } from './linear';
import { Highlight } from '../../../ds/core/types';

export const queueAdapter: VisualizationAdapter<QueueState> = {
  structure: 'queue',
  toFlowModel({ state, highlights = [] }: { state: QueueState; highlights?: Highlight[] }) {
    return createLinearNodes(state.items, highlights);
  },
};
