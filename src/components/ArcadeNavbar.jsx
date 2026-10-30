import React from 'react';
import { Volume2, VolumeX, Gamepad2, Home, Grid, Info, ChevronLeft, HelpCircle } from 'lucide-react';
import { soundManager } from '../games/FruitSlicing/engine/SoundManager';

export const ArcadeNavbar = ({ 
  currentView,
  isMuted, 
  onToggleSound, 
  onNavigateHome,
  onNavigateGames,
  onNavigateAbout,
  onOpenInstructions 
}) => {
  return (
    <header className="arcade-header">
      {/* Brand Logo with Navigation */}
      <div 
        className="header-brand" 
        onClick={() => {
          soundManager.playClick();
          onNavigateHome();
        }} 
        role="button" 
        tabIndex={0}
        title="Mini Game Arcade - Home"
      >
        <div className="brand-icon-wrapper">
          <Gamepad2 className="brand-icon" size={22} />
        </div>
        <div className="brand-text-group">
          <span className="brand-title">MINI GAME ARCADE</span>
          <span className="brand-subtitle">PLAY • COMPETE • HAVE FUN</span>
        </div>
      </div>

      {/* Center Navigation Links (Home, Games, About) */}
      <nav className="header-nav-links" aria-label="Main Navigation">
        <button 
          className={`nav-link-btn ${currentView === 'home' ? 'active-nav-link' : ''}`}
          onClick={() => {
            soundManager.playClick();
            onNavigateHome();
          }}
        >
          <Home size={16} />
          <span>Home</span>
        </button>

        <button 
          className="nav-link-btn"
          onClick={() => {
            soundManager.playClick();
            onNavigateGames();
          }}
        >
          <Grid size={16} />
          <span>Games</span>
        </button>

        <button 
          className="nav-link-btn"
          onClick={() => {
            soundManager.playClick();
            onNavigateAbout();
          }}
        >
          <Info size={16} />
          <span>About</span>
        </button>
      </nav>

      {/* Right Actions: Back to Arcade (if in game), How to Play (if in game), Sound Toggle */}
      <div className="header-actions">
        {currentView === 'fruit-slicing' && (
          <>
            <button 
              className="btn-icon header-btn btn-back-arcade"
              onClick={() => {
                soundManager.playClick();
                onNavigateHome();
              }}
              title="Return to Arcade Homepage"
            >
              <ChevronLeft size={18} />
              <span className="btn-label-desktop">Back to Arcade</span>
            </button>

            <button 
              className="btn-icon header-btn" 
              onClick={() => {
                soundManager.playClick();
                onOpenInstructions();
              }}
              title="Game Instructions"
              aria-label="Instructions"
            >
              <HelpCircle size={18} />
              <span className="btn-label-desktop">How To Play</span>
            </button>
          </>
        )}

        {/* Sound ON/OFF Toggle */}
        <button 
          className={`btn-icon header-btn ${isMuted ? 'btn-muted' : ''}`}
          onClick={onToggleSound}
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
          aria-label="Toggle Sound"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span className="btn-label-desktop">{isMuted ? 'Muted' : 'Sound'}</span>
        </button>
      </div>
    </header>
  );
};
