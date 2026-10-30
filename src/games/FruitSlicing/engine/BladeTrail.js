/**
 * BladeTrail - Renders a sleek glowing katana / laser blade trail following the player's swipe
 */

export class BladeTrail {
  constructor() {
    this.points = [];
    this.maxAge = 160; // Milliseconds before trail point fades out
    this.color = '#38bdf8'; // Sky blue neon default
    this.glowColor = 'rgba(56, 189, 248, 0.8)';
  }

  addPoint(x, y) {
    const now = performance.now();
    this.points.push({ x, y, time: now });
  }

  clear() {
    this.points = [];
  }

  update() {
    const now = performance.now();
    // Keep only recent points
    while (this.points.length > 0 && now - this.points[0].time > this.maxAge) {
      this.points.shift();
    }
  }

  draw(ctx) {
    if (this.points.length < 2) return;

    const now = performance.now();
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Outer Neon Glow Pass
    ctx.shadowBlur = 14;
    ctx.shadowColor = this.glowColor;

    for (let i = 1; i < this.points.length; i++) {
      const p1 = this.points[i - 1];
      const p2 = this.points[i];
      const age = now - p2.time;
      const progress = 1 - Math.min(1, age / this.maxAge);
      const width = Math.max(1, progress * 10);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = `rgba(56, 189, 248, ${progress * 0.75})`;
      ctx.lineWidth = width + 4;
      ctx.stroke();
    }

    // 2. Sharp White Laser Core
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ffffff';

    for (let i = 1; i < this.points.length; i++) {
      const p1 = this.points[i - 1];
      const p2 = this.points[i];
      const age = now - p2.time;
      const progress = 1 - Math.min(1, age / this.maxAge);
      const width = Math.max(1, progress * 5);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${progress * 0.95})`;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Get the current active slice segment (most recent movement)
   */
  getRecentSegment() {
    if (this.points.length < 2) return null;
    const p2 = this.points[this.points.length - 1];
    const p1 = this.points[this.points.length - 2];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dt = Math.max(1, p2.time - p1.time);
    const speed = (Math.hypot(dx, dy) / dt) * 1000; // px/sec

    return {
      p1,
      p2,
      angle: Math.atan2(dy, dx),
      speed
    };
  }
}
