"use client";

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  ProOptions,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TraceStep } from '../../ds/core/types';
import { VisualizationAdapter } from './types';
import { ValueNode } from './nodes/ValueNode';

const nodeTypes = {
  value: ValueNode,
};

const proOptions: ProOptions = { hideAttribution: true };

export interface VisualizationCanvasProps<TState> {
  step: TraceStep | null;
  adapter: VisualizationAdapter<TState>;
  viewportMode?: 'compact' | 'detailed';
  className?: string;
}

export function VisualizationCanvas<TState>({
  step,
  adapter,
  viewportMode = 'detailed',
  className = ''
}: VisualizationCanvasProps<TState>) {
  const { nodes: initialNodes, edges: initialEdges, error } = useMemo(() => {
    if (!step) return { nodes: [], edges: [], error: null };
    try {
      const result = adapter.toFlowModel({
        state: step.state as unknown as TState,
        highlights: step.highlights,
        viewportMode
      });
      return { ...result, error: null };
    } catch (e) {
      console.error("Adapter failed to parse state:", e);
      const err = e instanceof Error ? e : new Error(String(e));
      return { nodes: [], edges: [], error: err };
    }
  }, [step, adapter, viewportMode]);

  if (!step) {
    return (
      <div className={`flex items-center justify-center bg-muted/20 border border-dashed rounded-lg min-h-[300px] w-full ${className}`}>
        <p className="text-muted-foreground text-sm">No operation selected</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-destructive/10 border border-destructive/20 rounded-lg min-h-[300px] w-full text-destructive ${className}`}>
        <p className="text-sm font-semibold">Error visualizing state: {error.message}</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[400px] border rounded-lg overflow-hidden bg-background ${className}`} aria-label={`${adapter.structure} visualization canvas`}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={proOptions}
        nodesConnectable={false}
        nodesDraggable={false}
        elementsSelectable={true}
        panOnScroll={true}
        zoomOnScroll={true}
      >
        <Background gap={16} size={1} />
        <Controls showInteractive={false} />
        <MiniMap zoomable pannable nodeClassName={(n) => {
          if (n.type === 'value') return 'bg-primary/20';
          return 'bg-muted';
        }} />
        <Panel position="top-left" className="bg-background/80 backdrop-blur-sm p-2 rounded shadow-sm text-sm border max-w-[300px]">
          <div className="font-semibold truncate">{step.title}</div>
          <div className="text-muted-foreground text-xs whitespace-normal">{step.description}</div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
