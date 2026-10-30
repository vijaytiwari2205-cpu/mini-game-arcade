import React from 'react';
import { X, Flame, Bomb, Sparkles, ShieldAlert, Award } from 'lucide-react';
import { soundManager } from '../games/FruitSlicing/engine/SoundManager';

export const InstructionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-card instructions-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">DOJO SCROLL</span>
            <h2 className="modal-title">How To Play</h2>
          </div>
          <button className="btn-icon close-btn" onClick={handleClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body instructions-content">
          {/* Section 1: The Core Slice Gesture */}
          <div className="instruction-section">
            <div className="section-icon-box">
              <Sparkles className="text-cyan" size={24} />
            </div>
            <div className="section-text">
              <h3>Blade Slicing Controls</h3>
              <p>
                <strong>Desktop:</strong> Click and drag your mouse across flying fruits to slash them with your neon blade.<br />
                <strong>Mobile & Tablet:</strong> Swipe your finger smoothly across the screen. Rapid swipes carve clean cuts!
              </p>
            </div>
          </div>

          {/* Section 2: Combos */}
          <div className="instruction-section">
            <div className="section-icon-box">
              <Flame className="text-amber" size={24} />
            </div>
            <div className="section-text">
              <h3>Combo Bonuses</h3>
              <p>
                Slice 3 or more fruits in one continuous stroke to trigger explosive combos:
              </p>
              <div className="combo-chips">
                <span className="combo-chip">3 Fruits: +15 pts</span>
                <span className="combo-chip">4 Fruits: +30 pts</span>
                <span className="combo-chip">5+ Fruits: +50+ pts</span>
              </div>
            </div>
          </div>

          {/* Section 3: Bombs */}
          <div className="instruction-section">
            <div className="section-icon-box">
              <Bomb className="text-rose" size={24} />
            </div>
            <div className="section-text">
              <h3>Avoid The Bombs!</h3>
              <p>
                Bombs spawn with a glowing fuse and sparking wick. Slicing a bomb triggers an explosion that incurs a <strong>-10 second penalty</strong> and <strong>-20 points</strong>!
              </p>
            </div>
          </div>

          {/* Section 4: Game Modes */}
          <div className="instruction-section">
            <div className="section-icon-box">
              <Award className="text-emerald" size={24} />
            </div>
            <div className="section-text">
              <h3>Game Modes</h3>
              <ul className="mode-list">
                <li><strong>Arcade Frenzy (60s):</strong> High-stakes 60-second blitz. Slice fruits, dodge bombs, and set records before time expires!</li>
                <li><strong>Zen Sanctuary (90s):</strong> Pure slicing bliss with zero bombs. Great for practicing long combos.</li>
                <li><strong>Classic Dojo:</strong> 3 strikes. Missing whole fruits or hitting a bomb loses a strike.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary w-full" onClick={handleClose}>
            Ready to Slice!
          </button>
        </div>
      </div>
    </div>
  );
};
