import React from 'react';
import { ComplexityData } from './types';

interface ComplexityTableProps {
  complexity: Record<string, ComplexityData>;
}

export function ComplexityTable({ complexity }: ComplexityTableProps) {
  const operations = Object.keys(complexity);

  if (operations.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border mt-4 mb-4">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">Operation</th>
            <th scope="col" className="px-4 py-2 font-medium">Time Complexity</th>
            <th scope="col" className="px-4 py-2 font-medium">Space Complexity</th>
            <th scope="col" className="px-4 py-2 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {operations.map((op) => {
            const data = complexity[op];
            return (
              <tr key={op} className="bg-background">
                <td className="px-4 py-2 font-mono text-xs">{op}</td>
                <td className="px-4 py-2">{data.time}</td>
                <td className="px-4 py-2">{data.space}</td>
                <td className="px-4 py-2 text-muted-foreground">{data.notes || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
