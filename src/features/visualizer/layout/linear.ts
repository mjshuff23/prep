export type Point = { x: number; y: number };

/**
 * Calculates coordinates for a linear collection of nodes.
 * @param count The total number of nodes.
 * @param nodeWidth The width of a single node.
 * @param gap The horizontal gap between nodes.
 * @param startX The starting X coordinate.
 * @param startY The starting Y coordinate.
 * @returns Array of coordinates (x, y) for each node.
 */
export function calculateLinearLayout(
  count: number,
  nodeWidth: number = 60,
  gap: number = 10,
  startX: number = 50,
  startY: number = 50
): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    points.push({
      x: startX + i * (nodeWidth + gap),
      y: startY,
    });
  }
  return points;
}
