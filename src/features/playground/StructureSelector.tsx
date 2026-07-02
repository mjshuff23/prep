import React from 'react';
import { StructureKind } from '../../ds/core/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface StructureSelectorProps {
  value: StructureKind;
  onChange: (kind: StructureKind) => void;
  disabled?: boolean;
}

export function StructureSelector({ value, onChange, disabled }: StructureSelectorProps) {
  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={(val) => onChange(val as StructureKind)} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select structure" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="stack">Stack</SelectItem>
          <SelectItem value="queue">Queue</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
