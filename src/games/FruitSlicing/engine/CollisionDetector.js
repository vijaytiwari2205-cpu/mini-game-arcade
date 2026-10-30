/**
 * CollisionDetector - Line segment to circle collision detection for blade slicing
 */

export class CollisionDetector {
  /**
   * Check if segment (p1 -> p2) intersects with circle (cx, cy, radius)
   */
  static testSegmentCircle(p1, p2, cx, cy, radius) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lenSq = dx * dx + dy * dy;

    if (lenSq === 0) {
      const distSq = (cx - p1.x) * (cx - p1.x) + (cy - p1.y) * (cy - p1.y);
      return distSq <= radius * radius;
    }

    // Project circle center onto line segment
    const t = Math.max(0, Math.min(1, ((cx - p1.x) * dx + (cy - p1.y) * dy) / lenSq));
    const nearestX = p1.x + t * dx;
    const nearestY = p1.y + t * dy;

    const distX = cx - nearestX;
    const distY = cy - nearestY;
    const distSq = distX * distX + distY * distY;

    return distSq <= radius * radius;
  }

  /**
   * Check if a blade swipe intersects with a fruit entity
   * Requires minimum swipe speed to count as a genuine slice
   */
  static checkSlice(segment, fruit) {
    if (!segment || !fruit || !fruit.active || fruit.isSliced) return false;

    // Minimum swipe speed of 120 px/sec to prevent static hover slicing
    if (segment.speed < 120) return false;

    return this.testSegmentCircle(
      segment.p1,
      segment.p2,
      fruit.x,
      fruit.y,
      fruit.radius
    );
  }
}
