export type Language = 'javascript' | 'typescript' | 'python';

export type StructureKind = 'stack' | 'queue' | 'linked-list' | 'array' | 'tree' | 'graph' | 'hash-table';

export type ComplexityData = {
  time: string;
  space: string;
  notes?: string;
};

export type CodeExample = {
  structure: StructureKind;
  language: Language;
  title: string;
  description: string;
  source: string;
  testSource?: string;
  complexity: Record<string, ComplexityData>;
  caveats: string[];
};
