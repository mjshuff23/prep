import { StackState } from '../../../ds/structures/stack';
import { VisualizationAdapter } from '../types';
import { createLinearNodes } from './linear';
import { Highlight } from '../../../ds/core/types';

export const stackAdapter: VisualizationAdapter<StackState> = {
  structure: 'stack',
  toFlowModel({ state, highlights = [] }: { state: StackState; highlights?: Highlight[] }) {
    return createLinearNodes(state.items, highlights);
  },
};
