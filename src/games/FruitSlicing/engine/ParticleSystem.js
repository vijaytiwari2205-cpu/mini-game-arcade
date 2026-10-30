/**
 * ParticleSystem - Manages Juice Droplets, Splatters, Explosions, and Floating Score Popups
 */

export class ParticleSystem {
  constructor() {
    this.droplets = [];
    this.splatters = [];
    this.explosions = [];
    this.floatingTexts = [];
    this.screenShake = 0;
  }

  reset() {
    this.droplets = [];
    this.splatters = [];
    this.explosions = [];
    this.floatingTexts = [];
    this.screenShake = 0;
  }

  /**
   * Spawn a burst of juice droplets upon slicing fruit
   */
  spawnFruitSlice(x, y, fruitType, sliceAngle) {
    const colors = fruitType.juiceColors || ['#ef4444', '#f87171'];
    const count = 22 + Math.floor(Math.random() * 10);
    const perpAngle = sliceAngle + Math.PI / 2;

    for (let i = 0; i < count; i++) {
      // Spray biased along the slice angle and perpendicular impulse
      const spread = (Math.random() - 0.5) * 1.8;
      const angle = (Math.random() > 0.5 ? perpAngle : perpAngle + Math.PI) + spread;
      const speed = 3 + Math.random() * 9;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const radius = 2.5 + Math.random() * 3.5;
      const life = 0.6 + Math.random() * 0.5;

      this.droplets.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Slight upward burst
        radius,
        color,
        life,
        maxLife: life,
        gravity: 0.35
      });
    }

    // Add a juice splatter on the backboard
    this.addSplatter(x, y, fruitType);
  }

  /**
   * Add a fading juice splatter on the arcade wall
   */
  addSplatter(x, y, fruitType) {
    const splatCount = 4 + Math.floor(Math.random() * 4);
    const color = fruitType.splatColor || 'rgba(239, 68, 68, 0.7)';

    for (let i = 0; i < splatCount; i++) {
      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = (Math.random() - 0.5) * 60;
      const r = 10 + Math.random() * 18;

      this.splatters.push({
        x: x + offsetX,
        y: y + offsetY,
        radius: r,
        color,
        alpha: 0.55 + Math.random() * 0.25,
        life: 5.0 // Lasts 5 seconds
      });
    }

    // Cap splatters so memory stays lean
    if (this.splatters.length > 50) {
      this.splatters.splice(0, this.splatters.length - 50);
    }
  }

  /**
   * Spawn a dramatic bomb explosion shockwave & sparks
   */
  spawnBombExplosion(x, y) {
    this.screenShake = 18; // Trigger intense screen shake

    // Expanding shockwaves
    this.explosions.push({
      x,
      y,
      radius: 10,
      maxRadius: 180,
      speed: 16,
      alpha: 1.0,
      color: '#fbbf24',
      lineWidth: 8
    });

    // Fiery smoke and ember particles
    const emberColors = ['#f59e0b', '#ef4444', '#dc2626', '#ffffff', '#78350f'];
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 14;
      const life = 0.5 + Math.random() * 0.7;

      this.droplets.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3 + Math.random() * 5,
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
        life,
        maxLife: life,
        gravity: 0.15
      });
    }
  }

  /**
   * Floating score / combo notification
   */
  addFloatingText(x, y, text, color = '#facc15', size = 26, isCombo = false) {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      size,
      isCombo,
      alpha: 1.0,
      vy: isCombo ? -2.2 : -1.8,
      scale: isCombo ? 1.4 : 1.0,
      life: 1.0
    });
  }

  update(dt = 0.016) {
    // 1. Screen shake decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - 35 * dt);
    }

    // 2. Update droplets
    for (let i = this.droplets.length - 1; i >= 0; i--) {
      const p = this.droplets[i];
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.life -= dt;
      if (p.life <= 0) {
        this.droplets.splice(i, 1);
      }
    }

    // 3. Update splatters (fade over time)
    for (let i = this.splatters.length - 1; i >= 0; i--) {
      const s = this.splatters[i];
      s.life -= dt;
      s.alpha = (s.life / 5.0) * 0.6;
      if (s.life <= 0) {
        this.splatters.splice(i, 1);
      }
    }

    // 4. Update shockwaves
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const exp = this.explosions[i];
      exp.radius += exp.speed;
      exp.alpha = Math.max(0, 1 - exp.radius / exp.maxRadius);
      if (exp.radius >= exp.maxRadius || exp.alpha <= 0) {
        this.explosions.splice(i, 1);
      }
    }

    // 5. Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y += t.vy;
      t.life -= dt;
      t.alpha = Math.max(0, t.life / 1.0);
      if (t.isCombo && t.scale > 1.0) {
        t.scale = Math.max(1.0, t.scale - 1.2 * dt);
      }
      if (t.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  drawSplatters(ctx) {
    if (this.splatters.length === 0) return;
    ctx.save();
    for (const s of this.splatters) {
      ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawParticles(ctx) {
    ctx.save();

    // 1. Droplets
    for (const p of this.droplets) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Shockwaves
    for (const exp of this.explosions) {
      ctx.globalAlpha = exp.alpha;
      ctx.strokeStyle = exp.color;
      ctx.lineWidth = exp.lineWidth;
      ctx.beginPath();
      ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. Floating texts
    for (const t of this.floatingTexts) {
      ctx.globalAlpha = t.alpha;
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.scale(t.scale, t.scale);

      ctx.font = `900 ${t.size}px 'Outfit', 'Segoe UI', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Text stroke for punchy arcade contrast
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.lineWidth = t.isCombo ? 6 : 4;
      ctx.strokeText(t.text, 0, 0);

      ctx.fillStyle = t.color;
      ctx.fillText(t.text, 0, 0);

      ctx.restore();
    }

    ctx.restore();
  }
}
