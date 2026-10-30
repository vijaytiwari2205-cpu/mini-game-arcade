/**
 * FruitEntity - Physics and Procedural Canvas Rendering for Fruits and Split Halves
 */

export class FruitEntity {
  /**
   * @param {Object} type - fruit definition from FruitTypes
   * @param {number} x - start X
   * @param {number} y - start Y
   * @param {number} vx - horizontal velocity
   * @param {number} vy - vertical launch velocity
   * @param {number} gravity - gravity force
   */
  constructor(type, x, y, vx, vy, gravity = 0.4) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.gravity = gravity;
    this.radius = type.radius;
    this.rotation = Math.random() * Math.PI * 2;
    this.vRot = (Math.random() - 0.5) * 0.08;

    this.isSliced = false;
    this.sliceAngle = 0;
    this.halves = [];
    this.active = true;
    this.hasMissed = false; // For classic mode drop detection

    // Bomb fuse animation
    this.fuseTime = 0;
  }

  update(width, height) {
    if (this.isSliced) {
      // Update the two halves
      let anyHalfActive = false;
      for (const half of this.halves) {
        half.update(height);
        if (half.active) anyHalfActive = true;
      }
      if (!anyHalfActive) {
        this.active = false;
      }
      return;
    }

    // Whole fruit physics
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.vRot;
    this.fuseTime += 0.05;

    // Check if fallen below screen
    if (this.vy > 0 && this.y - this.radius > height + 80) {
      this.active = false;
      this.hasMissed = true;
    }
  }

  slice(angle, pushSpeed = 4.5) {
    if (this.isSliced) return;
    this.isSliced = true;
    this.sliceAngle = angle;

    if (this.type.isBomb) {
      // Bombs don't split, they explode!
      this.active = false;
      return;
    }

    // Create 2 halves separated perpendicular to the slice angle
    const perpAngle = angle + Math.PI / 2;
    const px = Math.cos(perpAngle);
    const py = Math.sin(perpAngle);

    // Half 1 flings to one side
    const half1 = new FruitHalf(
      this.type,
      this.x - px * 4,
      this.y - py * 4,
      this.vx - px * pushSpeed,
      this.vy - py * pushSpeed - 1.5,
      this.gravity,
      this.rotation,
      -0.08 - Math.random() * 0.05,
      this.sliceAngle,
      1
    );

    // Half 2 flings to other side
    const half2 = new FruitHalf(
      this.type,
      this.x + px * 4,
      this.y + py * 4,
      this.vx + px * pushSpeed,
      this.vy + py * pushSpeed - 1.5,
      this.gravity,
      this.rotation,
      0.08 + Math.random() * 0.05,
      this.sliceAngle,
      2
    );

    this.halves = [half1, half2];
  }

  draw(ctx) {
    if (this.isSliced) {
      for (const half of this.halves) {
        half.draw(ctx);
      }
      return;
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.type.isBomb) {
      this.drawBomb(ctx);
    } else {
      this.drawFruit(ctx, this.type);
    }

    ctx.restore();
  }

  drawBomb(ctx) {
    const r = this.radius;

    // Outer shadow / glow
    ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
    ctx.shadowBlur = 12;

    // Bomb body gradient
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#475569');
    grad.addColorStop(0.4, '#1e293b');
    grad.addColorStop(1, '#090d16');

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowBlur = 0; // Reset shadow

    // Specular highlight
    ctx.beginPath();
    ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.3, r * 0.18, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fill();

    // Metallic cap / neck
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-r * 0.25, -r - 6, r * 0.5, 7);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-r * 0.2, -r - 9, r * 0.4, 3);

    // Braided fuse curve
    ctx.beginPath();
    ctx.moveTo(0, -r - 9);
    ctx.quadraticCurveTo(r * 0.4, -r - 20, r * 0.2, -r - 26);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Spark at fuse tip
    const sparkX = r * 0.2;
    const sparkY = -r - 26;
    const pulse = 1 + Math.sin(this.fuseTime * 20) * 0.3;

    // Spark halo
    const sparkGrad = ctx.createRadialGradient(sparkX, sparkY, 0, sparkX, sparkY, 14 * pulse);
    sparkGrad.addColorStop(0, '#ffffff');
    sparkGrad.addColorStop(0.3, '#fbbf24');
    sparkGrad.addColorStop(0.7, '#ef4444');
    sparkGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

    ctx.beginPath();
    ctx.arc(sparkX, sparkY, 14 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = sparkGrad;
    ctx.fill();

    // Spark rays
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const a = (this.fuseTime * 15 + i * (Math.PI / 2)) % (Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(sparkX, sparkY);
      ctx.lineTo(sparkX + Math.cos(a) * (8 * pulse), sparkY + Math.sin(a) * (8 * pulse));
      ctx.stroke();
    }
  }

  drawFruit(ctx, type) {
    const r = this.radius;

    switch (type.id) {
      case 'WATERMELON':
        this.renderWatermelon(ctx, r);
        break;
      case 'ORANGE':
        this.renderOrange(ctx, r);
        break;
      case 'STRAWBERRY':
        this.renderStrawberry(ctx, r);
        break;
      case 'BANANA':
        this.renderBanana(ctx, r);
        break;
      case 'APPLE':
        this.renderApple(ctx, r);
        break;
      case 'PINEAPPLE':
        this.renderPineapple(ctx, r);
        break;
      case 'COCONUT':
        this.renderCoconut(ctx, r);
        break;
      case 'DRAGONFRUIT':
        this.renderDragonfruit(ctx, r);
        break;
      default:
        this.renderWatermelon(ctx, r);
    }
  }

  renderWatermelon(ctx, r) {
    // Green striped sphere
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#22c55e');
    grad.addColorStop(0.7, '#15803d');
    grad.addColorStop(1, '#14532d');

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Dark wavy green watermelon stripes
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = '#052e16';
    ctx.lineWidth = 5;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      const xOffset = i * (r / 2.5);
      ctx.moveTo(xOffset, -r);
      ctx.bezierCurveTo(xOffset - 8, -r * 0.3, xOffset + 8, r * 0.3, xOffset, r);
      ctx.stroke();
    }
    ctx.restore();

    // Specular gloss
    ctx.beginPath();
    ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.35, r * 0.2, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.fill();
  }

  renderOrange(ctx, r) {
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#fb923c');
    grad.addColorStop(0.7, '#f97316');
    grad.addColorStop(1, '#c2410c');

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Textured stippling for peel
    ctx.fillStyle = 'rgba(194, 65, 12, 0.35)';
    for (let i = 0; i < 14; i++) {
      const a = i * 0.45;
      const d = (i % 3 + 1) * (r * 0.22);
      ctx.beginPath();
      ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Stem dot & tiny leaf
    ctx.beginPath();
    ctx.arc(0, -r + 2, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#65a30d';
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(4, -r + 1, 6, 2.5, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#4d7c0f';
    ctx.fill();

    // Shine
    ctx.beginPath();
    ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.3, r * 0.18, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.fill();
  }

  renderStrawberry(ctx, r) {
    // Heart / conical tapered shape
    ctx.beginPath();
    ctx.moveTo(0, r * 0.95);
    ctx.bezierCurveTo(-r * 1.1, r * 0.3, -r * 1.05, -r * 0.6, -r * 0.3, -r * 0.8);
    ctx.quadraticCurveTo(0, -r * 0.65, r * 0.3, -r * 0.8);
    ctx.bezierCurveTo(r * 1.05, -r * 0.6, r * 1.1, r * 0.3, 0, r * 0.95);
    ctx.closePath();

    const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r);
    grad.addColorStop(0, '#f43f5e');
    grad.addColorStop(0.6, '#e11d48');
    grad.addColorStop(1, '#9f1239');
    ctx.fillStyle = grad;
    ctx.fill();

    // Yellow seeds
    ctx.fillStyle = '#fef08a';
    const seedPositions = [
      [-r * 0.4, -r * 0.3], [0, -r * 0.35], [r * 0.4, -r * 0.3],
      [-r * 0.5, 0], [-r * 0.15, 0.05], [r * 0.2, 0.05], [r * 0.5, 0],
      [-r * 0.3, r * 0.35], [0.05, r * 0.4], [r * 0.3, r * 0.35],
      [-0.1, r * 0.65], [0.1, r * 0.65]
    ];
    seedPositions.forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.ellipse(sx, sy, 1.8, 1.1, 0.3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Green leafy crown
    ctx.fillStyle = '#15803d';
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.7);
      const angle = -Math.PI / 2 + i * 0.45;
      const lx = Math.cos(angle) * (r * 0.6);
      const ly = Math.sin(angle) * (r * 0.5) - r * 0.4;
      ctx.lineTo(lx, ly);
      ctx.lineTo(lx * 0.6 + (i * 2), ly * 0.5);
      ctx.fill();
    }
  }

  renderBanana(ctx, r) {
    // Curved crescent
    ctx.beginPath();
    ctx.moveTo(-r * 0.9, r * 0.3);
    ctx.quadraticCurveTo(-r * 0.2, -r * 0.85, r * 0.85, -r * 0.4);
    ctx.quadraticCurveTo(r * 0.1, -r * 0.4, -r * 0.7, r * 0.5);
    ctx.closePath();

    const grad = ctx.createLinearGradient(-r, 0, r, 0);
    grad.addColorStop(0, '#eab308');
    grad.addColorStop(0.5, '#facc15');
    grad.addColorStop(1, '#ca8a04');
    ctx.fillStyle = grad;
    ctx.fill();

    // Stem tip (brown)
    ctx.beginPath();
    ctx.arc(r * 0.85, -r * 0.4, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#78350f';
    ctx.fill();

    // Bottom tip
    ctx.beginPath();
    ctx.arc(-r * 0.85, r * 0.35, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#854d0e';
    ctx.fill();

    // Longitudinal ridge line
    ctx.beginPath();
    ctx.moveTo(-r * 0.75, r * 0.35);
    ctx.quadraticCurveTo(-r * 0.1, -r * 0.65, r * 0.75, -r * 0.38);
    ctx.strokeStyle = 'rgba(161, 98, 7, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  renderApple(ctx, r) {
    // Apple lobes
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.6);
    ctx.bezierCurveTo(r * 0.6, -r * 0.9, r * 1.05, -r * 0.3, r * 0.95, r * 0.4);
    ctx.bezierCurveTo(r * 0.85, r * 0.9, r * 0.3, r * 0.95, 0, r * 0.7);
    ctx.bezierCurveTo(-r * 0.3, r * 0.95, -r * 0.85, r * 0.9, -r * 0.95, r * 0.4);
    ctx.bezierCurveTo(-r * 1.05, -r * 0.3, -r * 0.6, -r * 0.9, 0, -r * 0.6);
    ctx.closePath();

    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
    grad.addColorStop(0, '#f87171');
    grad.addColorStop(0.6, '#dc2626');
    grad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = grad;
    ctx.fill();

    // Stem
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.6);
    ctx.quadraticCurveTo(r * 0.2, -r * 0.9, r * 0.1, -r * 1.05);
    ctx.strokeStyle = '#5c2b0c';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Green leaf
    ctx.beginPath();
    ctx.ellipse(r * 0.3, -r * 0.9, 7, 3.5, 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();

    // Gloss
    ctx.beginPath();
    ctx.ellipse(-r * 0.4, -r * 0.3, r * 0.28, r * 0.16, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
  }

  renderPineapple(ctx, r) {
    // Oval textured body
    ctx.beginPath();
    ctx.ellipse(0, r * 0.15, r * 0.75, r * 0.9, 0, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    grad.addColorStop(0, '#fde047');
    grad.addColorStop(0.7, '#ca8a04');
    grad.addColorStop(1, '#713f12');
    ctx.fillStyle = grad;
    ctx.fill();

    // Criss-cross diamond scales
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = 'rgba(69, 26, 3, 0.45)';
    ctx.lineWidth = 2.5;
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(-r + i * 14, -r);
      ctx.lineTo(r + i * 14, r * 1.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(r - i * 14, -r);
      ctx.lineTo(-r - i * 14, r * 1.5);
      ctx.stroke();
    }
    ctx.restore();

    // Spiky crown leaves on top
    ctx.fillStyle = '#16a34a';
    const leaves = [-0.6, -0.3, 0, 0.3, 0.6];
    leaves.forEach(offset => {
      ctx.beginPath();
      ctx.moveTo(offset * 12, -r * 0.5);
      ctx.lineTo(offset * 28, -r * 1.25);
      ctx.lineTo(offset * 12 + 6, -r * 0.5);
      ctx.fill();
    });
  }

  renderCoconut(ctx, r) {
    // Brown fibrous sphere
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
    grad.addColorStop(0, '#92400e');
    grad.addColorStop(0.7, '#78350f');
    grad.addColorStop(1, '#451a03');

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Hair fiber lines
    ctx.strokeStyle = 'rgba(69, 26, 3, 0.6)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      const a = (i / 9) * Math.PI * 2;
      ctx.moveTo(Math.cos(a) * (r * 0.7), Math.sin(a) * (r * 0.7));
      ctx.lineTo(Math.cos(a) * (r * 0.95), Math.sin(a) * (r * 0.95));
      ctx.stroke();
    }

    // 3 characteristic coconut eyes
    ctx.fillStyle = '#291104';
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.25, 4, 0, Math.PI * 2);
    ctx.arc(r * 0.1, -r * 0.3, 3.5, 0, Math.PI * 2);
    ctx.arc(-r * 0.05, -r * 0.05, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  renderDragonfruit(ctx, r) {
    // Vibrant magenta flame silhouette
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    grad.addColorStop(0, '#f472b6');
    grad.addColorStop(0.7, '#db2777');
    grad.addColorStop(1, '#9d174d');

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Green tipped scales
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const sx = Math.cos(angle) * (r * 0.8);
      const sy = Math.sin(angle) * (r * 0.8);

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle + Math.PI / 2);

      ctx.beginPath();
      ctx.moveTo(-7, 0);
      ctx.quadraticCurveTo(0, -14, 7, 0);
      ctx.fillStyle = '#db2777';
      ctx.fill();

      // Green tip
      ctx.beginPath();
      ctx.moveTo(-3, -7);
      ctx.quadraticCurveTo(0, -14, 3, -7);
      ctx.fillStyle = '#22c55e';
      ctx.fill();

      ctx.restore();
    }
  }
}

/**
 * FruitHalf - Represents one of the two halves flying apart after slice
 */
export class FruitHalf {
  constructor(type, x, y, vx, vy, gravity, rotation, vRot, sliceAngle, side) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.gravity = gravity;
    this.rotation = rotation;
    this.vRot = vRot;
    this.sliceAngle = sliceAngle;
    this.side = side; // 1 or 2
    this.radius = type.radius;
    this.active = true;
    this.opacity = 1.0;
  }

  update(height) {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.vRot;

    // Fade slightly when falling deep
    if (this.y > height * 0.8) {
      this.opacity = Math.max(0, this.opacity - 0.04);
    }

    if (this.y - this.radius > height + 80 || this.opacity <= 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active || this.opacity <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    const r = this.radius;

    // Clip half along slice orientation
    ctx.save();
    ctx.beginPath();
    if (this.side === 1) {
      ctx.arc(0, 0, r + 4, 0, Math.PI, false);
    } else {
      ctx.arc(0, 0, r + 4, Math.PI, Math.PI * 2, false);
    }
    ctx.closePath();
    ctx.clip();

    // Draw the outer rind
    this.drawOuterRind(ctx, r);

    ctx.restore();

    // Draw the exposed juicy cut face line along the cut diameter
    this.drawCutFace(ctx, r);

    ctx.restore();
  }

  drawOuterRind(ctx, r) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = this.type.rindColor || '#15803d';
    ctx.fill();

    // Inner pith ring
    ctx.beginPath();
    ctx.arc(0, 0, r - 3, 0, Math.PI * 2);
    ctx.fillStyle = this.type.innerRindColor || '#ffffff';
    ctx.fill();

    // Pulp center
    ctx.beginPath();
    ctx.arc(0, 0, r - 6, 0, Math.PI * 2);
    ctx.fillStyle = this.type.fleshColor || '#ef4444';
    ctx.fill();
  }

  drawCutFace(ctx, r) {
    // Cross-section cut surface details
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.type.innerRindColor || '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(r, 0);
    ctx.stroke();

    // Specific cross-section graphics
    if (this.type.id === 'WATERMELON') {
      // Black seeds along cut face
      ctx.fillStyle = '#1e293b';
      const seedOffsets = [-r * 0.6, -r * 0.25, r * 0.25, r * 0.6];
      seedOffsets.forEach(ox => {
        const oy = (this.side === 1 ? 5 : -5);
        ctx.beginPath();
        ctx.ellipse(ox, oy, 2.2, 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (this.type.id === 'ORANGE') {
      // Orange citrus radial spokes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.2;
      const count = 5;
      for (let i = 0; i <= count; i++) {
        const ox = -r * 0.8 + (i / count) * (r * 1.6);
        ctx.beginPath();
        ctx.moveTo(ox, 0);
        ctx.lineTo(ox * 0.4, this.side === 1 ? r * 0.5 : -r * 0.5);
        ctx.stroke();
      }
    } else if (this.type.id === 'COCONUT') {
      // White meat with dark shell
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-r * 0.85, this.side === 1 ? 0 : -6, r * 1.7, 6);
    } else if (this.type.id === 'DRAGONFRUIT') {
      // Dotted black seeds in white flesh
      ctx.fillStyle = '#0f172a';
      for (let i = -3; i <= 3; i++) {
        const ox = i * (r * 0.24);
        const oy = (this.side === 1 ? 6 : -6);
        ctx.beginPath();
        ctx.arc(ox, oy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}
