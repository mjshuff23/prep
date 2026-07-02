import React from 'react';
import { CodeExample } from './types';
import { ComplexityTable } from './ComplexityTable';
import { Editor } from '@monaco-editor/react';

interface CodeNotesProps {
  example: CodeExample;
}

export function CodeNotes({ example }: CodeNotesProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <section>
        <h3 className="text-lg font-semibold mb-2">Complexity</h3>
        <ComplexityTable complexity={example.complexity} />
      </section>

      {example.caveats && example.caveats.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-2">Caveats & Edge Cases</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
            {example.caveats.map((caveat, index) => (
              <li key={index}>{caveat}</li>
            ))}
          </ul>
        </section>
      )}

      {example.testSource && (
        <section>
          <h3 className="text-lg font-semibold mb-2">Usage & Tests</h3>
          <div className="h-[200px] border border-border rounded-md overflow-hidden">
             <Editor
                height="100%"
                language={example.language}
                theme="vs-dark"
                value={example.testSource}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                }}
              />
          </div>
        </section>
      )}
    </div>
  );
}
