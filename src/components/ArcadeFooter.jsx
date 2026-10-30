import React from 'react';
import { Gamepad2, Zap, Shield, Sparkles } from 'lucide-react';

export const ArcadeFooter = () => {
  return (
    <footer className="arcade-footer">
      <div className="footer-top-strip">
        <div className="platform-tag">
          <Gamepad2 size={16} />
          <span>MINI GAME ARCADE PLATFORM</span>
        </div>
        <div className="footer-pills">
          <span className="pill"><Zap size={13} /> 60 FPS HTML5 Canvas</span>
          <span className="pill"><Shield size={13} /> 100% Client-Side</span>
          <span className="pill"><Sparkles size={13} /> Web Audio API</span>
        </div>
      </div>

      <div className="footer-catalog-preview">
        <div className="catalog-title">ARCADE VAULT:</div>
        <div className="catalog-badges">
          <span className="game-badge active-game">1. Fruit Slicing (Active)</span>
          <span className="game-badge upcoming-game">2. Neon Brick Breaker (Coming Soon)</span>
          <span className="game-badge upcoming-game">3. Retro Snake Rush (Coming Soon)</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mini Game Arcade. Crafted for high-speed desktop & mobile gaming.</p>
      </div>
    </footer>
  );
};
