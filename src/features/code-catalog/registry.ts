import { CodeExample, Language, StructureKind } from './types';
import { stackExamples } from './examples/stack';
import { queueExamples } from './examples/queue';

const allExamples: CodeExample[] = [
  ...stackExamples,
  ...queueExamples,
];

// Map of StructureKind -> Language -> CodeExample
const registry: Partial<Record<StructureKind, Partial<Record<Language, CodeExample>>>> = {};

for (const example of allExamples) {
  if (!registry[example.structure]) {
    registry[example.structure] = {};
  }
  
  // @ts-expect-error - index is safe here
  if (registry[example.structure][example.language]) {
    console.warn(`Duplicate code example registered for ${example.structure}/${example.language}`);
  }
  
  // @ts-expect-error - index is safe here
  registry[example.structure][example.language] = example;
}

export function getCodeExample(structure: StructureKind, language: Language): CodeExample | undefined {
  return registry[structure]?.[language];
}

export function getAllExamplesForStructure(structure: StructureKind): CodeExample[] {
  const matches = registry[structure];
  if (!matches) return [];
  return Object.values(matches) as CodeExample[];
}
