import React from 'react';
import { Shield, Zap, Sparkles, Cpu, Globe, Heart } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="about" className="about-arcade-section">
      <div className="about-container">
        <div className="section-header-block">
          <div className="section-badge">
            <Sparkles size={14} className="text-purple" />
            <span>PLATFORM BLUEPRINT</span>
          </div>
          <h2 className="section-title">
            ENGINEERED FOR <span className="gradient-purple">SPEED</span> & <span className="gradient-cyan">FUN</span>
          </h2>
          <p className="section-subtitle">
            Mini Game Arcade delivers frictionless browser gaming without downloads, accounts, or latency.
          </p>
        </div>

        <div className="about-pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon-box bg-cyan-glass">
              <Zap className="text-cyan" size={24} />
            </div>
            <h3>60 FPS Canvas Engine</h3>
            <p>
              Custom 2D hardware-accelerated canvas loops optimized for high-refresh desktop monitors and mobile touchscreens.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box bg-purple-glass">
              <Cpu className="text-purple" size={24} />
            </div>
            <h3>Procedural Web Audio</h3>
            <p>
              All sound effects are synthesized programmatically using the browser Web Audio API — zero audio downloads and zero latency.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box bg-emerald-glass">
              <Shield className="text-emerald" size={24} />
            </div>
            <h3>Zero Backend & Privacy First</h3>
            <p>
              No databases, no tracking cookies, no paywalls. All high scores and settings are safely stored in your browser local storage.
            </p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box bg-amber-glass">
              <Globe className="text-amber" size={24} />
            </div>
            <h3>Vercel Edge Ready</h3>
            <p>
              Crafted as a static single-page application ready for global edge deployment on Vercel with instant sub-second page loads.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
