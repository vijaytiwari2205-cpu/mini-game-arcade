import React from 'react';
import { Play, Sparkles, Clock, Gamepad2, Flame, Award, Zap, Grid, Heart } from 'lucide-react';
import { soundManager } from '../games/FruitSlicing/engine/SoundManager';

export const GameLibrary = ({ onPlayGame }) => {
  const games = [
    {
      id: 'fruit-slicing',
      title: 'Fruit Slicing',
      category: 'Reflex Action',
      status: 'available',
      badgeText: 'AVAILABLE NOW',
      description: 'Test your blade reflexes! Slice flying fruits, chain massive combos, and dodge ticking explosive bombs in 60 FPS glory.',
      tags: ['Action', 'Combos', '60 FPS', '1 Player'],
      rating: '4.9 ★',
      iconBg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(239, 68, 68, 0.25))',
      renderGraphic: () => (
        <svg viewBox="0 0 160 110" className="card-illustration-svg" fill="none">
          <defs>
            <linearGradient id="wmRind" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <linearGradient id="wmFlesh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff3366" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <filter id="bladeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Watermelon Left Half */}
          <g transform="translate(42, 60) rotate(-18)">
            <path d="M -30 0 A 30 30 0 0 0 0 30 L 0 0 Z" fill="url(#wmRind)" />
            <path d="M -26 0 A 26 26 0 0 0 0 26 L 0 0 Z" fill="#bbf7d0" />
            <path d="M -22 0 A 22 22 0 0 0 0 22 L 0 0 Z" fill="url(#wmFlesh)" />
            <circle cx="-10" cy="10" r="1.8" fill="#1e293b" />
            <circle cx="-16" cy="6" r="1.8" fill="#1e293b" />
          </g>
          {/* Watermelon Right Half */}
          <g transform="translate(112, 45) rotate(22)">
            <path d="M 0 0 L 0 30 A 30 30 0 0 0 30 0 Z" fill="url(#wmRind)" />
            <path d="M 0 0 L 0 26 A 26 26 0 0 0 26 0 Z" fill="#bbf7d0" />
            <path d="M 0 0 L 0 22 A 22 22 0 0 0 22 0 Z" fill="url(#wmFlesh)" />
            <circle cx="10" cy="10" r="1.8" fill="#1e293b" />
            <circle cx="16" cy="6" r="1.8" fill="#1e293b" />
          </g>
          {/* Juice Droplets */}
          <circle cx="70" cy="38" r="3.5" fill="#ef4444" opacity="0.9" />
          <circle cx="86" cy="66" r="2.8" fill="#facc15" opacity="0.9" />
          <circle cx="78" cy="74" r="2" fill="#ef4444" opacity="0.8" />
          <circle cx="98" cy="32" r="2.2" fill="#22c55e" opacity="0.8" />
          {/* Laser Slash Trail */}
          <path 
            d="M 18 90 Q 75 52 142 20" 
            stroke="#38bdf8" 
            strokeWidth="4" 
            strokeLinecap="round" 
            filter="url(#bladeGlow)" 
          />
          <path 
            d="M 22 88 Q 75 52 138 22" 
            stroke="#ffffff" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
          />
        </svg>
      )
    },
    {
      id: 'tic-tac-toe',
      title: 'Tic-Tac-Toe Neon',
      category: 'Cyber Strategy',
      status: 'coming-soon',
      badgeText: 'COMING SOON',
      description: 'The timeless duel of alignment reimagined with smart AI difficulties, glowing cyber neon grids, and local 2-player pass & play.',
      tags: ['Strategy', 'AI Battle', 'PvP', 'Board'],
      rating: 'Upcoming',
      iconBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(56, 189, 248, 0.2))',
      renderGraphic: () => (
        <svg viewBox="0 0 160 110" className="card-illustration-svg" fill="none">
          <defs>
            <filter id="neonPurpleGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* 3x3 Grid Lines */}
          <line x1="62" y1="18" x2="62" y2="92" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="3" strokeLinecap="round" />
          <line x1="98" y1="18" x2="98" y2="92" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="3" strokeLinecap="round" />
          <line x1="26" y1="42" x2="134" y2="42" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="3" strokeLinecap="round" />
          <line x1="26" y1="68" x2="134" y2="68" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="3" strokeLinecap="round" />

          {/* Neon X (Cyan) */}
          <g filter="url(#neonPurpleGlow)">
            <line x1="36" y1="22" x2="52" y2="38" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <line x1="52" y1="22" x2="36" y2="38" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Neon O (Purple) */}
          <circle cx="80" cy="55" r="10" stroke="#a855f7" strokeWidth="4" filter="url(#neonPurpleGlow)" />

          {/* Another Neon X (Cyan) */}
          <g filter="url(#neonPurpleGlow)">
            <line x1="108" y1="72" x2="124" y2="88" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <line x1="124" y1="72" x2="108" y2="88" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Winning Slash Indicator */}
          <line x1="30" y1="20" x2="130" y2="90" stroke="rgba(168, 85, 247, 0.45)" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      )
    },
    {
      id: 'snake-game',
      title: 'Retro Snake Rush',
      category: 'Arcade Classic',
      status: 'coming-soon',
      badgeText: 'COMING SOON',
      description: 'Nostalgic serpent eating mayhem with turbo speed boosts, special glowing energy pellets, and endless high-score chasing.',
      tags: ['Retro', 'Speed', 'Survival', 'High Score'],
      rating: 'Upcoming',
      iconBg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(234, 179, 8, 0.2))',
      renderGraphic: () => (
        <svg viewBox="0 0 160 110" className="card-illustration-svg" fill="none">
          {/* Subtle grid background */}
          <rect x="25" y="15" width="110" height="80" rx="8" fill="rgba(15, 23, 42, 0.6)" stroke="rgba(255, 255, 255, 0.08)" />
          
          {/* Snake Segments (Vibrant green neon blocks) */}
          <rect x="40" y="65" width="12" height="12" rx="3" fill="#16a34a" />
          <rect x="54" y="65" width="12" height="12" rx="3" fill="#22c55e" />
          <rect x="68" y="65" width="12" height="12" rx="3" fill="#22c55e" />
          <rect x="68" y="51" width="12" height="12" rx="3" fill="#4ade80" />
          <rect x="68" y="37" width="12" height="12" rx="3" fill="#4ade80" />
          <rect x="82" y="37" width="12" height="12" rx="3" fill="#86efac" />
          {/* Snake Head with eyes */}
          <rect x="96" y="37" width="14" height="14" rx="4" fill="#a7f3d0" />
          <circle cx="106" cy="41" r="2" fill="#065f46" />
          <circle cx="106" cy="47" r="2" fill="#065f46" />

          {/* Golden Power Apple / Energy Pellet */}
          <circle cx="118" cy="65" r="7" fill="#facc15" />
          <circle cx="118" cy="65" r="11" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <path d="M 118 57 Q 120 54 122 55" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'memory-card-game',
      title: 'Cyber Memory Match',
      category: 'Brain Puzzle',
      status: 'coming-soon',
      badgeText: 'COMING SOON',
      description: 'Sharpen your focus and cognitive speed by discovering matching pairs of holographic arcade gems against a ticking timer.',
      tags: ['Puzzle', 'Memory', 'Mind', 'Speed'],
      rating: 'Upcoming',
      iconBg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2))',
      renderGraphic: () => (
        <svg viewBox="0 0 160 110" className="card-illustration-svg" fill="none">
          {/* Card 1 (Flipped Back) */}
          <g transform="translate(35, 25) rotate(-8)">
            <rect width="36" height="52" rx="6" fill="#1e293b" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" />
            <rect x="4" y="4" width="28" height="44" rx="4" fill="rgba(168, 85, 247, 0.25)" />
            <path d="M 18 20 L 23 26 L 18 32 L 13 26 Z" fill="#c084fc" />
          </g>

          {/* Card 2 (Revealed Gem Pair) */}
          <g transform="translate(72, 22) rotate(4)">
            <rect width="38" height="54" rx="6" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
            <circle cx="19" cy="27" r="14" fill="rgba(236, 72, 153, 0.2)" />
            {/* Diamond Gem */}
            <path d="M 19 18 L 26 27 L 19 36 L 12 27 Z" fill="#f472b6" />
            <circle cx="19" cy="27" r="3" fill="#ffffff" />
          </g>

          {/* Sparkles around match */}
          <circle cx="122" cy="30" r="2" fill="#facc15" />
          <circle cx="128" cy="46" r="3" fill="#38bdf8" />
          <circle cx="60" cy="78" r="2.5" fill="#ec4899" />
        </svg>
      )
    }
  ];

  return (
    <section id="games" className="game-library-section">
      <div className="section-header-block">
        <div className="section-badge">
          <Gamepad2 size={14} className="text-cyan" />
          <span>GAME LIBRARY</span>
        </div>
        <h2 className="section-title">
          CHOOSE YOUR <span className="gradient-cyan">CHALLENGE</span>
        </h2>
        <p className="section-subtitle">
          Jump into our flagship game today or preview the next arcade hits arriving in the vault.
        </p>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <div 
            key={game.id} 
            className={`game-card ${game.status === 'available' ? 'card-available' : 'card-upcoming'}`}
          >
            {/* Top Status Badge */}
            <div className="card-top-bar">
              <span className={`status-pill ${game.status === 'available' ? 'pill-available' : 'pill-upcoming'}`}>
                {game.status === 'available' ? (
                  <>
                    <span className="live-dot" />
                    {game.badgeText}
                  </>
                ) : (
                  <>
                    <Clock size={12} />
                    {game.badgeText}
                  </>
                )}
              </span>
              <span className="card-category-label">{game.category}</span>
            </div>

            {/* Visual Illustration Area */}
            <div className="card-graphic-wrapper" style={{ background: game.iconBg }}>
              {game.renderGraphic()}
            </div>

            {/* Card Content Details */}
            <div className="card-body-content">
              <div className="card-title-row">
                <h3 className="card-game-title">{game.title}</h3>
                <span className="card-rating-chip">{game.rating}</span>
              </div>

              <p className="card-game-description">{game.description}</p>

              {/* Tags */}
              <div className="card-tags-list">
                {game.tags.map((tag, i) => (
                  <span key={i} className="card-tag">{tag}</span>
                ))}
              </div>

              {/* Card Action Button */}
              <div className="card-action-box">
                {game.status === 'available' ? (
                  <button 
                    className="btn btn-primary w-full btn-play-card"
                    onClick={() => {
                      soundManager.playClick();
                      onPlayGame(game.id);
                    }}
                  >
                    <Play size={18} fill="currentColor" />
                    <span>Play Now</span>
                  </button>
                ) : (
                  <button className="btn btn-disabled w-full" disabled>
                    <Clock size={16} />
                    <span>Coming Soon</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
