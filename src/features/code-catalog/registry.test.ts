import { describe, it, expect } from 'vitest';
import { getCodeExample, getAllExamplesForStructure } from './registry';

describe('Code Catalog Registry', () => {
  it('should return all examples for stack', () => {
    const stackExamples = getAllExamplesForStructure('stack');
    expect(stackExamples).toHaveLength(3);
    expect(stackExamples.map(e => e.language).sort()).toEqual(['javascript', 'python', 'typescript']);
  });

  it('should return all examples for queue', () => {
    const queueExamples = getAllExamplesForStructure('queue');
    expect(queueExamples).toHaveLength(3);
    expect(queueExamples.map(e => e.language).sort()).toEqual(['javascript', 'python', 'typescript']);
  });

  it('should return specific examples', () => {
    const pyStack = getCodeExample('stack', 'python');
    expect(pyStack).toBeDefined();
    expect(pyStack?.language).toBe('python');
    expect(pyStack?.structure).toBe('stack');
    
    // Check some fields exist
    expect(pyStack?.source).toContain('class Stack');
    expect(pyStack?.complexity).toBeDefined();
    expect(pyStack?.testSource).toBeDefined();
  });

  it('should return empty array for unknown structure', () => {
    // @ts-expect-error - testing invalid input
    expect(getAllExamplesForStructure('unknown')).toEqual([]);
  });

  it('should return undefined for unknown language', () => {
    // @ts-expect-error - intentionally testing invalid language
    expect(getCodeExample('stack', 'ruby')).toBeUndefined();
  });
});
