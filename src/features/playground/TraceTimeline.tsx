import React from 'react';
import { TraceStep } from '../../ds/core/types';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface TraceTimelineProps {
  steps: TraceStep[];
  currentIndex: number;
  onSelectStep: (index: number) => void;
  disabled?: boolean;
}

export function TraceTimeline({ steps, currentIndex, onSelectStep, disabled }: TraceTimelineProps) {
  if (steps.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground border rounded-md bg-muted/10">
        No trace available. Run an operation first.
      </div>
    );
  }

  return (
    <ScrollArea className="h-64 border rounded-md bg-background">
      <div className="p-2 space-y-1">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={step.id || index}
              onClick={() => onSelectStep(index)}
              disabled={disabled}
              className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'hover:bg-muted/50 text-foreground'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">{index}.</span>
                  <span className="truncate font-semibold">{step.title}</span>
                </div>
                {isActive && (
                  <div className="pl-6 text-xs text-muted-foreground">
                    {step.description}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
