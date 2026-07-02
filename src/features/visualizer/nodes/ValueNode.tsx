import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CustomNode } from '../types';
import { cn } from '../../../lib/utils';

export function ValueNode({ data }: NodeProps<CustomNode>) {
  const { value, label, status = 'default' } = data;
  
  return (
    <div className={cn(
      "relative flex flex-col items-center justify-center p-2 min-w-12 h-12 rounded border-2 bg-background font-mono shadow-sm",
      {
        "border-border": status === 'default',
        "border-primary text-primary": status === 'active',
        "border-green-500 text-green-500": status === 'success',
        "border-destructive text-destructive": status === 'danger',
        "border-yellow-500 text-yellow-600": status === 'warning',
      }
    )}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <span className="font-semibold text-lg">{String(value)}</span>
      {label && (
        <span className="absolute -bottom-5 text-xs text-muted-foreground whitespace-nowrap">
          {label}
        </span>
      )}
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}
