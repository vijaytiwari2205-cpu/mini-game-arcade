import React from 'react';
import { Gamepad2, Zap, Shield, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../games/FruitSlicing/engine/SoundManager';

export const ArcadeFooter = ({ onNavigateHome, onNavigateGames, onNavigateAbout, onOpenContact }) => {
  return (
    <footer className="arcade-footer">
      <div className="footer-top-strip">
        <div className="platform-tag" onClick={onNavigateHome} role="button" tabIndex={0}>
          <Gamepad2 size={18} className="text-cyan" />
          <span>MINI GAME ARCADE</span>
        </div>

        {/* Quick Nav Links */}
        <div className="footer-nav-links">
          <button 
            className="footer-nav-btn" 
            onClick={() => {
              soundManager.playClick();
              onNavigateHome();
            }}
          >
            Home
          </button>
          <button 
            className="footer-nav-btn" 
            onClick={() => {
              soundManager.playClick();
              onNavigateGames();
            }}
          >
            Games Library
          </button>
          <button 
            className="footer-nav-btn" 
            onClick={() => {
              soundManager.playClick();
              onNavigateAbout();
            }}
          >
            About
          </button>
          <button 
            className="footer-nav-btn" 
            onClick={() => {
              soundManager.playClick();
              onOpenContact();
            }}
          >
            Contact
          </button>
        </div>

        {/* Technical Badges */}
        <div className="footer-pills">
          <span className="pill"><Zap size={13} className="text-cyan" /> 60 FPS Canvas</span>
          <span className="pill"><Shield size={13} className="text-purple" /> 100% Client-Side</span>
          <span className="pill"><Sparkles size={13} className="text-amber" /> Web Audio API</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mini Game Arcade. Crafted for high-speed desktop & mobile gaming. All rights reserved.</p>
        <p className="footer-subtext">Static edge hosting compatible with Vercel • Zero backend required</p>
      </div>
    </footer>
  );
};
