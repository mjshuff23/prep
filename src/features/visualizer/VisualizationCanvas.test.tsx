import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VisualizationCanvas } from './VisualizationCanvas';
import { stackAdapter } from './adapters/stack';
import { TraceStep } from '../../ds/core/types';
import React, { ReactNode } from 'react';

vi.mock('@xyflow/react', () => {
  return {
    ReactFlow: ({ children, nodes }: { children: ReactNode; nodes: { id: string; data: { value: unknown; status: string } }[] }) => (
      <div data-testid="react-flow-mock">
        {nodes.map((n) => (
          <div key={n.id} data-testid={`node-${n.id}`}>
            {String(n.data.value)} - {n.data.status}
          </div>
        ))}
        {children}
      </div>
    ),
    Controls: () => <div data-testid="controls" />,
    Background: () => <div data-testid="background" />,
    MiniMap: () => <div data-testid="minimap" />,
    Panel: ({ children }: { children: ReactNode }) => <div data-testid="panel">{children}</div>,
    Handle: () => <div data-testid="handle" />,
    Position: { Top: 'top', Bottom: 'bottom' }
  };
});

describe('VisualizationCanvas', () => {
  it('renders empty state when step is null', () => {
    render(<VisualizationCanvas step={null} adapter={stackAdapter} />);
    expect(screen.getByText('No operation selected')).toBeInTheDocument();
  });

  it('renders nodes based on the adapter', () => {
    const step: TraceStep = {
      id: 'step-1',
      index: 0,
      title: 'Test Step',
      description: 'Test description',
      state: { items: [42, 100] },
      highlights: [{ id: 'index-1', type: 'node', color: 'danger' }]
    };

    render(<VisualizationCanvas step={step} adapter={stackAdapter} />);
    expect(screen.getByTestId('node-index-0')).toHaveTextContent('42 - default');
    expect(screen.getByTestId('node-index-1')).toHaveTextContent('100 - danger');
    expect(screen.getByText('Test Step')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders error state when adapter throws', () => {
    const badAdapter = {
      ...stackAdapter,
      toFlowModel: () => { throw new Error('Bad model'); }
    };
    
    const step: TraceStep = {
      id: 'step-1',
      index: 0,
      title: 'Test Step',
      description: 'Test description',
      state: { items: [42] }
    };

    render(<VisualizationCanvas step={step} adapter={badAdapter} />);
    expect(screen.getByText('Error visualizing state: Bad model')).toBeInTheDocument();
  });
});
