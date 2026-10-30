import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { GameLibrary } from '../components/GameLibrary';
import { AboutSection } from '../components/AboutSection';

export const HomePage = ({ onLaunchFruitSlicing }) => {
  const handleExploreGames = () => {
    const el = document.getElementById('games');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlayGame = (gameId) => {
    if (gameId === 'fruit-slicing') {
      onLaunchFruitSlicing();
    }
  };

  return (
    <div className="homepage-wrapper">
      {/* Hero Section */}
      <HeroSection 
        onExploreGames={handleExploreGames} 
        onPlayFruitSlicing={onLaunchFruitSlicing} 
      />

      {/* Game Library Section */}
      <GameLibrary onPlayGame={handlePlayGame} />

      {/* About Section */}
      <AboutSection />
    </div>
  );
};
