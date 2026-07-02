import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface DatasetPanelProps {
  onApplySeed: (seed: unknown[]) => void;
  onResetEmpty: () => void;
  disabled?: boolean;
}

export function DatasetPanel({ onApplySeed, onResetEmpty, disabled }: DatasetPanelProps) {
  const [seedInput, setSeedInput] = useState('');

  const handleApply = () => {
    // Parse comma separated strings or numbers
    const values = seedInput.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => {
        const num = Number(s);
        return isNaN(num) ? s : num;
      });
    onApplySeed(values);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input 
          placeholder="e.g. 1, 2, 3" 
          value={seedInput} 
          onChange={(e) => setSeedInput(e.target.value)} 
          disabled={disabled}
        />
        <Button onClick={handleApply} disabled={disabled || !seedInput.trim()}>
          Set
        </Button>
      </div>
      <Button variant="outline" className="w-full" onClick={onResetEmpty} disabled={disabled}>
        Reset to Empty
      </Button>
    </div>
  );
}
