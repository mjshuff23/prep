import { describe, it, expect } from 'vitest';
import { calculateLinearLayout } from './linear';

describe('calculateLinearLayout', () => {
  it('returns empty array for 0 count', () => {
    expect(calculateLinearLayout(0)).toEqual([]);
  });

  it('calculates position for 1 node', () => {
    const points = calculateLinearLayout(1, 50, 10, 100, 200);
    expect(points).toEqual([{ x: 100, y: 200 }]);
  });

  it('calculates positions for multiple nodes with default spacing', () => {
    const points = calculateLinearLayout(3);
    expect(points).toEqual([
      { x: 50, y: 50 },
      { x: 120, y: 50 },
      { x: 190, y: 50 },
    ]);
  });

  it('calculates positions with custom spacing', () => {
    const points = calculateLinearLayout(2, 100, 20, 0, 0);
    expect(points).toEqual([
      { x: 0, y: 0 },
      { x: 120, y: 0 },
    ]);
  });
});
