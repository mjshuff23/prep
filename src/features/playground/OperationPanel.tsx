import React, { useState } from 'react';
import { OperationSpec } from '../../ds/core/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface OperationPanelProps {
  operations: OperationSpec[];
  onRunOperation: (operation: string, payload?: unknown) => void;
  disabled?: boolean;
}

// These operations require a payload based on common sense for our MVP.
const PAYLOAD_OPERATIONS = ['push', 'enqueue', 'insert', 'update', 'search'];

export function OperationPanel({ operations, onRunOperation, disabled }: OperationPanelProps) {
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [payloadStr, setPayloadStr] = useState<string>('');

  const handleRun = () => {
    if (!selectedOp) return;
    
    let parsedPayload: unknown = undefined;
    if (PAYLOAD_OPERATIONS.includes(selectedOp) && payloadStr.trim() !== '') {
      const num = Number(payloadStr);
      parsedPayload = isNaN(num) ? payloadStr : num;
    }
    
    onRunOperation(selectedOp, parsedPayload);
    
    // Optionally reset payload after run
    setPayloadStr('');
    setSelectedOp(null);
  };

  const activeOpNeedsPayload = selectedOp && PAYLOAD_OPERATIONS.includes(selectedOp);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {operations.map((op) => (
          <Button
            key={op.operation}
            variant={selectedOp === op.operation ? 'default' : 'secondary'}
            onClick={() => setSelectedOp(op.operation)}
            disabled={disabled}
            className="w-full justify-start text-xs h-8 px-2"
            title={op.description}
          >
            {op.operation}
          </Button>
        ))}
      </div>

      {activeOpNeedsPayload && (
        <div className="space-y-2 mt-4 p-4 border rounded-md bg-muted/20">
          <label className="text-sm font-medium">Input Value</label>
          <Input 
            value={payloadStr} 
            onChange={(e) => setPayloadStr(e.target.value)} 
            placeholder="Enter value..."
            autoFocus
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !(!selectedOp || (activeOpNeedsPayload && !payloadStr.trim()))) {
                handleRun();
              }
            }}
          />
        </div>
      )}

      <Button 
        className="w-full" 
        onClick={handleRun} 
        disabled={disabled || !selectedOp || !!(activeOpNeedsPayload && !payloadStr.trim())}
      >
        Run Operation
      </Button>
    </div>
  );
}
