import React from 'react';
import { Volume2, VolumeX, HelpCircle, Gamepad2 } from 'lucide-react';
import { soundManager } from '../games/FruitSlicing/engine/SoundManager';

export const ArcadeNavbar = ({ 
  isMuted, 
  onToggleSound, 
  onOpenInstructions,
  onGoHome 
}) => {
  return (
    <header className="arcade-header">
      <div className="header-brand" onClick={onGoHome} role="button" tabIndex={0}>
        <div className="brand-icon-wrapper">
          <Gamepad2 className="brand-icon" size={24} />
        </div>
        <div className="brand-text-group">
          <span className="brand-title">MINI GAME ARCADE</span>
          <span className="brand-subtitle">FLAGSHIP EDITION</span>
        </div>
      </div>

      <div className="header-actions">
        <button 
          className="btn-icon header-btn" 
          onClick={() => {
            soundManager.playClick();
            onOpenInstructions();
          }}
          title="Game Instructions"
          aria-label="Instructions"
        >
          <HelpCircle size={20} />
          <span className="btn-label-desktop">How To Play</span>
        </button>

        <button 
          className={`btn-icon header-btn ${isMuted ? 'btn-muted' : ''}`}
          onClick={onToggleSound}
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
          aria-label="Toggle Sound"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          <span className="btn-label-desktop">{isMuted ? 'Muted' : 'Sound'}</span>
        </button>
      </div>
    </header>
  );
};
