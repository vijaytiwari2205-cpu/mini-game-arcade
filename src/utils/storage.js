/**
 * LocalStorage utilities for Mini Game Arcade
 */

const STORAGE_KEYS = {
  HIGH_SCORE_ARCADE: 'mga_fruit_high_score_arcade',
  HIGH_SCORE_ZEN: 'mga_fruit_high_score_zen',
  HIGH_SCORE_CLASSIC: 'mga_fruit_high_score_classic',
  SOUND_MUTED: 'mga_sound_muted',
  TOTAL_FRUITS_SLICED: 'mga_fruit_total_sliced',
  GAMES_PLAYED: 'mga_fruit_games_played'
};

export const getHighScore = (mode = 'arcade') => {
  try {
    const key = mode === 'zen' 
      ? STORAGE_KEYS.HIGH_SCORE_ZEN 
      : mode === 'classic' 
      ? STORAGE_KEYS.HIGH_SCORE_CLASSIC 
      : STORAGE_KEYS.HIGH_SCORE_ARCADE;
    const val = localStorage.getItem(key);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
};

export const saveHighScore = (score, mode = 'arcade') => {
  try {
    const currentHigh = getHighScore(mode);
    if (score > currentHigh) {
      const key = mode === 'zen' 
        ? STORAGE_KEYS.HIGH_SCORE_ZEN 
        : mode === 'classic' 
        ? STORAGE_KEYS.HIGH_SCORE_CLASSIC 
        : STORAGE_KEYS.HIGH_SCORE_ARCADE;
      localStorage.setItem(key, score.toString());
      return true; // New record!
    }
    return false;
  } catch {
    return false;
  }
};

export const getSoundMuted = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === 'true';
  } catch {
    return false;
  }
};

export const saveSoundMuted = (muted) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, muted ? 'true' : 'false');
  } catch {
    // Ignore storage errors in private browsing
  }
};

export const recordGameStats = (fruitsSlicedCount) => {
  try {
    const prevSliced = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_FRUITS_SLICED) || '0', 10);
    const prevGames = parseInt(localStorage.getItem(STORAGE_KEYS.GAMES_PLAYED) || '0', 10);
    localStorage.setItem(STORAGE_KEYS.TOTAL_FRUITS_SLICED, (prevSliced + fruitsSlicedCount).toString());
    localStorage.setItem(STORAGE_KEYS.GAMES_PLAYED, (prevGames + 1).toString());
  } catch {
    // Ignore storage errors
  }
};

export const getLifetimeStats = () => {
  try {
    return {
      totalSliced: parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_FRUITS_SLICED) || '0', 10),
      gamesPlayed: parseInt(localStorage.getItem(STORAGE_KEYS.GAMES_PLAYED) || '0', 10)
    };
  } catch {
    return { totalSliced: 0, gamesPlayed: 0 };
  }
};
