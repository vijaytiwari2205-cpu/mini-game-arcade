import React, { useState } from 'react';
import { ArcadeNavbar } from './components/ArcadeNavbar';
import { ArcadeFooter } from './components/ArcadeFooter';
import { InstructionsModal } from './components/InstructionsModal';
import { ContactModal } from './components/ContactModal';
import { HomePage } from './pages/HomePage';
import { FruitSlicingGame } from './games/FruitSlicing/FruitSlicingGame';
import { soundManager } from './games/FruitSlicing/engine/SoundManager';
import { ChevronLeft, Gamepad2 } from 'lucide-react';
import './styles/main.css';

export function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'fruit-slicing'
  const [isMuted, setIsMuted] = useState(() => soundManager.isMuted);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleToggleSound = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateGames = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('games');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('games');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateAbout = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchFruitSlicing = () => {
    setCurrentView('fruit-slicing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="arcade-app-root">
      {/* Platform Header / Navigation */}
      <ArcadeNavbar 
        currentView={currentView}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onNavigateHome={handleNavigateHome}
        onNavigateGames={handleNavigateGames}
        onNavigateAbout={handleNavigateAbout}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="arcade-viewport-main">
        {currentView === 'home' ? (
          <HomePage 
            onLaunchFruitSlicing={handleLaunchFruitSlicing} 
          />
        ) : (
          <div className="active-game-arena-wrapper">
            {/* Quick Breadcrumb Bar for easy return */}
            <div className="game-breadcrumb-bar">
              <button 
                className="btn-back-breadcrumb" 
                onClick={() => {
                  soundManager.playClick();
                  handleNavigateHome();
                }}
              >
                <ChevronLeft size={18} />
                <span>Arcade Hub</span>
              </button>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">
                <Gamepad2 size={15} className="text-cyan" /> Fruit Slicing
              </span>
            </div>

            {/* Existing Fruit Slicing Game */}
            <FruitSlicingGame 
              isMuted={isMuted}
              onToggleSound={handleToggleSound}
              onOpenInstructions={() => setIsInstructionsOpen(true)}
              onBackToHome={handleNavigateHome}
            />
          </div>
        )}
      </main>

      {/* Platform Footer */}
      <ArcadeFooter 
        onNavigateHome={handleNavigateHome}
        onNavigateGames={handleNavigateGames}
        onNavigateAbout={handleNavigateAbout}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Dojo Game Instructions Modal */}
      <InstructionsModal 
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      {/* Contact & Feedback Modal */}
      <ContactModal 
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}

export default App;
