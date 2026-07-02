"use client";

import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Copy, Check } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StructureKind, Language } from './types';
import { getAllExamplesForStructure } from './registry';
import { CodeNotes } from './CodeNotes';
import { Button } from '@/components/ui/button';

interface CodeTabsProps {
  structure: StructureKind;
}

const LANGUAGES: Language[] = ['javascript', 'typescript', 'python'];

export function CodeTabs({ structure }: CodeTabsProps) {
  const examples = getAllExamplesForStructure(structure);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  if (!examples || examples.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No code examples available for this structure yet.
      </div>
    );
  }

  const handleCopy = (lang: Language, source: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(source).then(() => {
      setCopiedStates((prev) => ({ ...prev, [lang]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [lang]: false }));
      }, 2000);
    }).catch(() => {});
  };

  const getFileName = (lang: Language, struct: StructureKind) => {
    const ext = lang === 'javascript' ? 'js' : lang === 'typescript' ? 'ts' : 'py';
    return `${struct}.${ext}`;
  };

  return (
    <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-background">
      <Tabs defaultValue={examples[0]?.language ?? 'javascript'} className="w-full">
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
          <TabsList className="bg-transparent h-auto p-0 gap-4">
            {LANGUAGES.map((lang) => (
              <TabsTrigger 
                key={lang}
                value={lang}
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-1 capitalize"
              >
                {lang === 'javascript' ? 'JavaScript' : lang === 'typescript' ? 'TypeScript' : 'Python'}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {LANGUAGES.map((lang) => {
          const example = examples.find((ex) => ex.language === lang);
          if (!example) {
            return (
              <TabsContent key={lang} value={lang} className="p-4 m-0">
                <p className="text-sm text-muted-foreground">Example not found.</p>
              </TabsContent>
            );
          }

          return (
            <TabsContent key={lang} value={lang} className="m-0 border-none outline-none">
              <div className="p-4 border-b border-border bg-muted/20">
                <p className="text-sm text-foreground/80">{example.description}</p>
              </div>

              {/* Code Section */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                  <span className="text-xs font-mono text-muted-foreground">
                    {getFileName(lang, structure)}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => handleCopy(lang, example.source)}
                    title="Copy code"
                  >
                    {copiedStates[lang] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="h-[400px]">
                  <Editor
                    height="100%"
                    language={lang}
                    theme="vs-dark"
                    value={example.source}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>

              {/* Notes Section */}
              <div className="p-4 bg-muted/10 border-t border-border">
                <CodeNotes example={example} />
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
