import React, { useState } from 'react';
import { ArcadeNavbar } from './components/ArcadeNavbar';
import { ArcadeFooter } from './components/ArcadeFooter';
import { InstructionsModal } from './components/InstructionsModal';
import { FruitSlicingGame } from './games/FruitSlicing/FruitSlicingGame';
import { soundManager } from './games/FruitSlicing/engine/SoundManager';
import './styles/main.css';

export function App() {
  const [isMuted, setIsMuted] = useState(() => soundManager.isMuted);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const handleToggleSound = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <div className="arcade-app-root">
      {/* Top Arcade Navigation */}
      <ArcadeNavbar 
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onGoHome={() => {
          // If we want to return to welcome or reset
        }}
      />

      {/* Main Arcade Arena Viewport */}
      <main className="arcade-viewport">
        <FruitSlicingGame 
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          onOpenInstructions={() => setIsInstructionsOpen(true)}
        />
      </main>

      {/* Arcade Footer & Platform Status */}
      <ArcadeFooter />

      {/* Dojo Instructions Modal */}
      <InstructionsModal 
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />
    </div>
  );
}

export default App;
