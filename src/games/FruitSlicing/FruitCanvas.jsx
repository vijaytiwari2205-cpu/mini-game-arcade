import React, { useRef, useEffect, useCallback } from 'react';
import { FruitEntity } from './engine/FruitEntity';
import { getRandomFruitType } from './engine/FruitTypes';
import { BladeTrail } from './engine/BladeTrail';
import { ParticleSystem } from './engine/ParticleSystem';
import { CollisionDetector } from './engine/CollisionDetector';
import { soundManager } from './engine/SoundManager';

export const FruitCanvas = ({
  gameState,
  gameMode, // 'arcade' | 'zen' | 'classic'
  isPaused,
  onScoreUpdate,
  onComboUpdate,
  onTimePenalty,
  onStrike,
  onGameOver
}) => {
  const canvasRef = useRef(null);

  // Engine references persistent across renders
  const engineRef = useRef({
    fruits: [],
    bladeTrail: new BladeTrail(),
    particleSystem: new ParticleSystem(),
    isPointerDown: false,
    lastPointerPos: null,
    spawnTimer: 0,
    spawnInterval: 1.8,
    activeComboCount: 0,
    comboResetTimeout: null,
    animationFrameId: null,
    lastFrameTime: performance.now(),
    width: 0,
    height: 0,
    stats: {
      sliced: 0,
      bombsHit: 0,
      maxCombo: 0
    }
  });

  // Handle pointer down (mouse or touch)
  const handlePointerDown = useCallback((clientX, clientY) => {
    soundManager.ensureContext();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const engine = engineRef.current;
    engine.isPointerDown = true;
    engine.lastPointerPos = { x, y };
    engine.bladeTrail.clear();
    engine.bladeTrail.addPoint(x, y);
    engine.activeComboCount = 0;
  }, []);

  // Pointer Up handler
  const handlePointerUp = useCallback(() => {
    const engine = engineRef.current;
    engine.isPointerDown = false;
  }, []);


  // Global pointer release listener so swiping off canvas edge releases cleanly
  useEffect(() => {
    const handleGlobalUp = () => {
      engineRef.current.isPointerDown = false;
    };
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    window.addEventListener('touchcancel', handleGlobalUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
      window.removeEventListener('touchcancel', handleGlobalUp);
    };
  }, []);

  // Handle pointer move
  const handlePointerMove = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing' || isPaused) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const engine = engineRef.current;
    if (!engine.isPointerDown) return;

    engine.bladeTrail.addPoint(x, y);

    const segment = engine.bladeTrail.getRecentSegment();
    if (!segment) return;

    // Check slice collisions against all active fruits
    let fruitsSlicedInThisMove = 0;

    for (const fruit of engine.fruits) {
      if (CollisionDetector.checkSlice(segment, fruit)) {
        if (fruit.type.isBomb) {
          // BOMB HIT!
          fruit.slice(segment.angle);
          engine.particleSystem.spawnBombExplosion(fruit.x, fruit.y);
          soundManager.playBombExplode();

          engine.stats.bombsHit++;
          engine.activeComboCount = 0;

          if (gameMode === 'arcade') {
            engine.particleSystem.addFloatingText(fruit.x, fruit.y, 'BOMB! -10s', '#ef4444', 32, true);
            onTimePenalty(10);
            onScoreUpdate(fruit.type.points); // -20 points
          } else if (gameMode === 'classic') {
            engine.particleSystem.addFloatingText(fruit.x, fruit.y, 'BOMB EXPLODED!', '#ef4444', 32, true);
            onStrike();
          }
        } else {
          // FRUIT SLICED!
          fruitsSlicedInThisMove++;
          engine.activeComboCount++;
          engine.stats.sliced++;

          fruit.slice(segment.angle);
          engine.particleSystem.spawnFruitSlice(fruit.x, fruit.y, fruit.type, segment.angle);

          // Audio
          soundManager.playSlice();
          soundManager.playSplat(fruit.type.id);

          // Base points
          let pointsEarned = fruit.type.points;
          onScoreUpdate(pointsEarned);

          // Floating score indicator
          engine.particleSystem.addFloatingText(
            fruit.x,
            fruit.y,
            `+${pointsEarned}`,
            '#facc15',
            24
          );
        }
      }
    }

    // Process Combos
    if (fruitsSlicedInThisMove > 0) {
      // Clear any pending combo reset
      if (engine.comboResetTimeout) {
        clearTimeout(engine.comboResetTimeout);
      }

      // Combo check window (380ms)
      engine.comboResetTimeout = setTimeout(() => {
        const combo = engine.activeComboCount;
        if (combo >= 3) {
          let comboBonus = 0;
          let label = '';

          if (combo === 3) {
            comboBonus = 15;
            label = '3x COMBO! +15';
          } else if (combo === 4) {
            comboBonus = 30;
            label = '4x FRENZY! +30';
          } else {
            comboBonus = 50 + (combo - 5) * 15;
            label = `${combo}x UNBELIEVABLE! +${comboBonus}`;
          }

          onScoreUpdate(comboBonus);
          onComboUpdate(combo);
          soundManager.playCombo(combo);

          if (combo > engine.stats.maxCombo) {
            engine.stats.maxCombo = combo;
          }

          engine.particleSystem.addFloatingText(
            engine.lastPointerPos ? engine.lastPointerPos.x : engine.width / 2,
            engine.lastPointerPos ? engine.lastPointerPos.y : engine.height / 2,
            label,
            '#38bdf8',
            32,
            true
          );
        }
        engine.activeComboCount = 0;
      }, 380);
    }

    engine.lastPointerPos = { x, y };
  }, [gameState, isPaused, gameMode, onScoreUpdate, onComboUpdate, onTimePenalty, onStrike]);


  // Spawn fruit wave
  const spawnFruitWave = useCallback((width, height, mode) => {
    const engine = engineRef.current;
    const includeBomb = mode !== 'zen';

    // Number of fruits in this wave (1 to 4 depending on mode and speed)
    const waveCount = mode === 'zen' 
      ? 2 + Math.floor(Math.random() * 3) 
      : 2 + Math.floor(Math.random() * 2);

    for (let i = 0; i < waveCount; i++) {
      // Chance for a bomb in this wave
      const isBombWave = includeBomb && Math.random() < 0.28 && i === 0;
      const type = isBombWave ? getRandomFruitType(true) : getRandomFruitType(false);

      // Random horizontal spawn position
      const minX = width * 0.15;
      const maxX = width * 0.85;
      const x = minX + Math.random() * (maxX - minX);
      const y = height + 40;

      // Arc physics: inward towards center
      const centerX = width / 2;
      const horizontalPull = (centerX - x) * 0.012;
      const vx = (Math.random() - 0.5) * 4 + horizontalPull;

      // Vertical launch velocity tailored to screen height
      const gravity = 0.38;
      const targetPeakHeight = height * (0.2 + Math.random() * 0.25);
      const jumpDistance = y - targetPeakHeight;
      const vy = -Math.sqrt(2 * gravity * jumpDistance) * (0.95 + Math.random() * 0.1);

      engine.fruits.push(new FruitEntity(type, x, y, vx, vy, gravity));
    }
  }, []);

  // Main Canvas Render & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const engine = engineRef.current;

    // Resize handler for Retina / HiDPI crispness
    const handleResize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      engine.width = rect.width;
      engine.height = rect.height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const loop = (timestamp) => {
      const dt = Math.min(0.05, (timestamp - engine.lastFrameTime) / 1000);
      engine.lastFrameTime = timestamp;

      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.scale(dpr, dpr);

      // Handle Screen Shake
      if (engine.particleSystem.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * engine.particleSystem.screenShake;
        const shakeY = (Math.random() - 0.5) * engine.particleSystem.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Draw Arcade Cutting Board Background
      drawBackground(ctx, engine.width, engine.height);

      // 2. Draw Permanent / Fading Juice Splatters on Board
      engine.particleSystem.drawSplatters(ctx);

      // 3. Gameplay Updates (if playing and unpaused)
      if (gameState === 'playing' && !isPaused) {
        // Spawn timer
        engine.spawnTimer += dt;
        if (engine.spawnTimer >= engine.spawnInterval) {
          engine.spawnTimer = 0;
          engine.spawnInterval = 1.3 + Math.random() * 0.9;
          spawnFruitWave(engine.width, engine.height, gameMode);
        }

        // Update Fruits
        for (let i = engine.fruits.length - 1; i >= 0; i--) {
          const fruit = engine.fruits[i];
          fruit.update(engine.width, engine.height);

          // Classic mode dropped fruit strike check
          if (fruit.hasMissed && !fruit.isSliced && !fruit.type.isBomb && gameMode === 'classic') {
            onStrike();
          }

          if (!fruit.active) {
            engine.fruits.splice(i, 1);
          }
        }

        // Update Particles and Blade Trail
        engine.bladeTrail.update();
        engine.particleSystem.update(dt);
      }

      // 4. Draw Fruits
      for (const fruit of engine.fruits) {
        fruit.draw(ctx);
      }

      // 5. Draw Particles & Explosions
      engine.particleSystem.drawParticles(ctx);

      // 6. Draw Blade Trail (Neon Glow Katana Slash)
      engine.bladeTrail.draw(ctx);

      ctx.restore();

      engine.animationFrameId = requestAnimationFrame(loop);
    };

    engine.animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (engine.animationFrameId) {
        cancelAnimationFrame(engine.animationFrameId);
      }
    };
  }, [gameState, isPaused, gameMode, spawnFruitWave, onStrike]);

  // Clean state when game restarts or state changes
  useEffect(() => {
    if (gameState === 'ready' || gameState === 'playing') {
      const engine = engineRef.current;
      engine.fruits = [];
      engine.bladeTrail.clear();
      engine.particleSystem.reset();
      engine.spawnTimer = 0;
      engine.stats = { sliced: 0, bombsHit: 0, maxCombo: 0 };
    }
  }, [gameState]);

  // Draw authentic rich wooden dojo / arcade cutting board
  const drawBackground = (ctx, width, height) => {
    // Rich mahogany / walnut cutting board gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#1a110d');
    bgGrad.addColorStop(0.5, '#261912');
    bgGrad.addColorStop(1, '#180f0a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle wooden plank grooves
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 2;
    const plankHeight = 70;
    for (let y = plankHeight; y < height; y += plankHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Top highlight for 3D beveled plank groove
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath();
      ctx.moveTo(0, y + 1);
      ctx.lineTo(width, y + 1);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    }

    // Arcade Dojo Ambient Lighting (Vignette)
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, Math.min(width, height) * 0.2,
      width / 2, height / 2, Math.max(width, height) * 0.75
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  };

  // DOM Event Listeners for Touch & Mouse
  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="fruit-canvas"
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => {
          if (e.touches.length > 0) {
            handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length > 0) {
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={handlePointerUp}
        onTouchCancel={handlePointerUp}
      />
    </div>
  );
};
