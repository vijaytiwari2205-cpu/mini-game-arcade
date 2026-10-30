import React from 'react';
import { Play, Sparkles, Zap, Shield, Smartphone, ArrowDown } from 'lucide-react';
import { soundManager } from '../games/FruitSlicing/engine/SoundManager';

export const HeroSection = ({ onExploreGames, onPlayFruitSlicing }) => {
  return (
    <section className="arcade-hero-section">
      {/* Background Neon Glow Orbs */}
      <div className="hero-glow-orb hero-glow-cyan" aria-hidden="true" />
      <div className="hero-glow-orb hero-glow-purple" aria-hidden="true" />
      <div className="hero-grid-pattern" aria-hidden="true" />

      <div className="hero-container">
        {/* Top Announcement Badge */}
        <div className="hero-badge-pill">
          <Sparkles size={14} className="text-amber" />
          <span>MINI GAME ARCADE • BROWSER GAMING REIMAGINED</span>
        </div>

        {/* Main Large Heading */}
        <h1 className="hero-heading">
          PLAY. <span className="gradient-purple">COMPETE.</span> <span className="gradient-cyan">HAVE FUN.</span>
        </h1>

        {/* Short Gaming Description */}
        <p className="hero-description">
          Step into a next-generation browser arcade built for pure speed and competitive excitement. 
          Instant loading, zero downloads, no ads, and fluid 60 FPS gameplay on desktop, tablet, and mobile.
        </p>

        {/* Hero CTA Actions */}
        <div className="hero-actions">
          <button 
            className="btn btn-primary btn-large btn-hero-glow"
            onClick={() => {
              soundManager.playClick();
              onPlayFruitSlicing();
            }}
          >
            <Play size={20} fill="currentColor" />
            <span>PLAY FRUIT SLICING</span>
            <span className="btn-tag-live">AVAILABLE</span>
          </button>

          <button 
            className="btn btn-secondary btn-large"
            onClick={() => {
              soundManager.playClick();
              onExploreGames();
            }}
          >
            <span>Explore Games</span>
            <ArrowDown size={18} />
          </button>
        </div>

        {/* Platform Feature Badges */}
        <div className="hero-features-strip">
          <div className="hero-feature-item">
            <Zap size={16} className="text-cyan" />
            <span>60 FPS Canvas</span>
          </div>
          <div className="hero-feature-item">
            <Shield size={16} className="text-purple" />
            <span>100% Free & No Ads</span>
          </div>
          <div className="hero-feature-item">
            <Smartphone size={16} className="text-emerald" />
            <span>Touch & Keyboard</span>
          </div>
          <div className="hero-feature-item">
            <Sparkles size={16} className="text-amber" />
            <span>Web Audio Synth</span>
          </div>
        </div>
      </div>
    </section>
  );
};
