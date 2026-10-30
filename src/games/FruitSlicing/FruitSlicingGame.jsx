import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy, 
  Flame, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  Award,
  ChevronRight,
  Heart,
  Volume2,
  VolumeX,
  Home,
  ArrowLeft
} from 'lucide-react';
import { FruitCanvas } from './FruitCanvas';
import { soundManager } from './engine/SoundManager';
import { 
  getHighScore, 
  saveHighScore, 
  recordGameStats,
  getLifetimeStats 
} from '../../utils/storage';

export const FruitSlicingGame = ({ 
  isMuted, 
  onToggleSound, 
  onOpenInstructions,
  onBackToHome 
}) => {
  // Game states: 'welcome' | 'playing' | 'paused' | 'gameover'
  const [gameState, setGameState] = useState('welcome');
  const [gameMode, setGameMode] = useState('arcade'); // 'arcade' | 'zen' | 'classic'

  // Score & Stats
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => getHighScore('arcade'));
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [comboStreakLabel, setComboStreakLabel] = useState('');
  
  // Stats tracking for game over screen
  const [sessionSlicedCount, setSessionSlicedCount] = useState(0);
  const [sessionBombsHit, setSessionBombsHit] = useState(0);
  const [maxComboHit, setMaxComboHit] = useState(0);

  // Mode specific mechanics
  const [timeLeft, setTimeLeft] = useState(60); // 60s for arcade, 90s for zen
  const [strikes, setStrikes] = useState(0); // 0, 1, 2, 3 for classic mode

  // Combo UI flash timer
  const comboTimerRef = useRef(null);

  // Sync high score when mode changes
  useEffect(() => {
    setHighScore(getHighScore(gameMode));
  }, [gameMode]);

  // Start new game
  const startGame = useCallback((selectedMode = gameMode) => {
    soundManager.ensureContext();
    soundManager.playClick();

    setGameMode(selectedMode);
    setScore(0);
    setSessionSlicedCount(0);
    setSessionBombsHit(0);
    setMaxComboHit(0);
    setIsNewHighScore(false);
    setComboCount(0);
    setComboStreakLabel('');
    setStrikes(0);

    const initialTime = selectedMode === 'zen' ? 90 : 60;
    setTimeLeft(initialTime);
    setGameState('playing');
  }, [gameMode]);

  // Pause game
  const pauseGame = useCallback(() => {
    if (gameState === 'playing') {
      soundManager.playClick();
      setGameState('paused');
    }
  }, [gameState]);

  // Resume game
  const resumeGame = useCallback(() => {
    if (gameState === 'paused') {
      soundManager.playClick();
      setGameState('playing');
    }
  }, [gameState]);

  // Restart game
  const restartGame = useCallback(() => {
    startGame(gameMode);
  }, [startGame, gameMode]);

  // Trigger Game Over
  const handleGameOver = useCallback(() => {
    setGameState('gameover');

    // Check high score
    const wasNewHigh = saveHighScore(score, gameMode);
    setIsNewHighScore(wasNewHigh);
    if (wasNewHigh) {
      setHighScore(score);
      soundManager.playHighScore();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti optional
      }
    } else {
      soundManager.playGameOver();
    }

    // Record total stats
    recordGameStats(sessionSlicedCount);
  }, [score, gameMode, sessionSlicedCount]);

  // Timer countdown hook for Arcade & Zen modes
  useEffect(() => {
    if (gameState !== 'playing' || gameMode === 'classic') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }

        // Low time ticking sound (< 10 seconds)
        if (prev <= 10) {
          soundManager.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, gameMode, handleGameOver]);

  // Keyboard shortcuts (Escape, P, Space to pause/resume)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (gameState === 'playing') {
          pauseGame();
        } else if (gameState === 'paused') {
          resumeGame();
        }
      } else if (e.code === 'Space') {
        if (gameState === 'welcome') {
          e.preventDefault();
          startGame(gameMode);
        } else if (gameState === 'playing') {
          e.preventDefault();
          pauseGame();
        } else if (gameState === 'paused') {
          e.preventDefault();
          resumeGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, pauseGame, resumeGame, startGame, gameMode]);

  // Callback when score updates from canvas
  const handleScoreUpdate = useCallback((points) => {
    setScore(prev => {
      const nextScore = Math.max(0, prev + points);
      if (nextScore > highScore) {
        setHighScore(nextScore);
      }
      return nextScore;
    });

    if (points > 0) {
      setSessionSlicedCount(prev => prev + 1);
    } else if (points < 0) {
      setSessionBombsHit(prev => prev + 1);
    }
  }, [highScore]);

  // Callback when combo is triggered
  const handleComboUpdate = useCallback((combo) => {
    setComboCount(combo);
    setMaxComboHit(prev => Math.max(prev, combo));

    if (combo === 3) setComboStreakLabel('TRIPLE SLICE!');
    else if (combo === 4) setComboStreakLabel('SUPER SLICE!');
    else setComboStreakLabel('BLADE MASTER!');

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setComboStreakLabel('');
      setComboCount(0);
    }, 1200);
  }, []);

  // Time penalty from bomb slice
  const handleTimePenalty = useCallback((penaltySeconds) => {
    if (gameMode === 'arcade') {
      setTimeLeft(prev => {
        const nextTime = Math.max(0, prev - penaltySeconds);
        if (nextTime === 0) {
          handleGameOver();
        }
        return nextTime;
      });
    }
  }, [gameMode, handleGameOver]);

  // Strike handler for Classic mode
  const handleStrike = useCallback(() => {
    if (gameMode === 'classic') {
      soundManager.playBombExplode();
      setStrikes(prev => {
        const next = prev + 1;
        if (next >= 3) {
          handleGameOver();
        }
        return next;
      });
    }
  }, [gameMode, handleGameOver]);

  return (
    <div className="game-container">
      {/* Top Arcade HUD (Visible during active play & pause) */}
      <div className="game-hud">
        {/* Score & Best */}
        <div className="hud-metric-group">
          <div className="hud-metric score-card">
            <span className="metric-label">SCORE</span>
            <span className="metric-value score-val">{score}</span>
          </div>

          <div className="hud-metric highscore-card">
            <Trophy className="metric-icon text-amber" size={16} />
            <div className="metric-inner">
              <span className="metric-label">BEST</span>
              <span className="metric-value">{highScore}</span>
            </div>
          </div>
        </div>

        {/* Center: Mode Indicator & Timer / Lives */}
        <div className="hud-center">
          {gameMode !== 'classic' ? (
            <div className={`timer-badge ${timeLeft <= 10 ? 'timer-urgency' : ''}`}>
              <Clock size={18} className="timer-icon" />
              <span className="timer-text">{timeLeft}s</span>
            </div>
          ) : (
            <div className="strikes-container">
              {[1, 2, 3].map(heartNum => (
                <Heart 
                  key={heartNum}
                  size={20}
                  className={`strike-heart ${heartNum <= (3 - strikes) ? 'heart-full' : 'heart-empty'}`}
                />
              ))}
            </div>
          )}

          {comboStreakLabel && (
            <div className="hud-combo-tag animate-bounce">
              <Flame size={16} className="text-amber" />
              <span>{comboStreakLabel}</span>
            </div>
          )}
        </div>

        {/* Right HUD: Controls */}
        <div className="hud-controls">
          {onBackToHome && (
            <button 
              className="btn-icon hud-btn"
              onClick={() => {
                soundManager.playClick();
                onBackToHome();
              }}
              title="Return to Arcade Home"
              aria-label="Arcade Home"
            >
              <Home size={18} />
            </button>
          )}

          <button 
            className="btn-icon hud-btn"
            onClick={gameState === 'playing' ? pauseGame : resumeGame}
            title={gameState === 'playing' ? "Pause (Escape)" : "Resume"}
            aria-label="Pause or Resume"
          >
            {gameState === 'playing' ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button 
            className="btn-icon hud-btn"
            onClick={restartGame}
            title="Restart Game"
            aria-label="Restart Game"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="canvas-frame">
        <FruitCanvas 
          gameState={gameState}
          gameMode={gameMode}
          isPaused={gameState === 'paused'}
          onScoreUpdate={handleScoreUpdate}
          onComboUpdate={handleComboUpdate}
          onTimePenalty={handleTimePenalty}
          onStrike={handleStrike}
          onGameOver={handleGameOver}
        />

        {/* WELCOME / START SCREEN OVERLAY */}
        {gameState === 'welcome' && (
          <div className="overlay-screen welcome-overlay">
            <div className="welcome-content">
              <div className="hero-fruit-icon">
                <span className="hero-emoji">🍉</span>
              </div>
              <h1 className="hero-title">FRUIT SLICING</h1>
              <p className="hero-tagline">Slice juicy flying fruits, unleash neon combos, and conquer the arcade!</p>

              {/* Mode Selection Tabs */}
              <div className="mode-selection-group">
                <div 
                  className={`mode-card ${gameMode === 'arcade' ? 'active-mode' : ''}`}
                  onClick={() => {
                    soundManager.playClick();
                    setGameMode('arcade');
                  }}
                >
                  <div className="mode-badge">POPULAR</div>
                  <div className="mode-icon-title">
                    <Clock size={18} className="text-cyan" />
                    <h4>Arcade Frenzy</h4>
                  </div>
                  <p>60s countdown blitz. Watch out for bombs (-10s)!</p>
                </div>

                <div 
                  className={`mode-card ${gameMode === 'zen' ? 'active-mode' : ''}`}
                  onClick={() => {
                    soundManager.playClick();
                    setGameMode('zen');
                  }}
                >
                  <div className="mode-icon-title">
                    <Sparkles size={18} className="text-amber" />
                    <h4>Zen Dojo</h4>
                  </div>
                  <p>90s tranquil slicing. Pure fruit bliss, zero bombs.</p>
                </div>

                <div 
                  className={`mode-card ${gameMode === 'classic' ? 'active-mode' : ''}`}
                  onClick={() => {
                    soundManager.playClick();
                    setGameMode('classic');
                  }}
                >
                  <div className="mode-icon-title">
                    <Heart size={18} className="text-rose" />
                    <h4>Classic 3-Lives</h4>
                  </div>
                  <p>3 strikes allowed. Don't let fruits fall unsliced!</p>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="welcome-cta-group">
                <button 
                  className="btn btn-primary btn-large btn-glow"
                  onClick={() => startGame(gameMode)}
                >
                  <Play size={22} fill="currentColor" />
                  <span>START SLICING</span>
                </button>

                <button 
                  className="btn btn-secondary"
                  onClick={onOpenInstructions}
                >
                  <HelpCircle size={18} />
                  <span>How To Play</span>
                </button>

                {onBackToHome && (
                  <button 
                    className="btn btn-ghost"
                    onClick={() => {
                      soundManager.playClick();
                      onBackToHome();
                    }}
                  >
                    <ArrowLeft size={16} />
                    <span>Arcade Home</span>
                  </button>
                )}
              </div>

              {/* Lifetime stats indicator */}
              <div className="arcade-mini-stats">
                <span>Best {gameMode.toUpperCase()}: <strong>{highScore} pts</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* PAUSE SCREEN OVERLAY */}
        {gameState === 'paused' && (
          <div className="overlay-screen pause-overlay">
            <div className="pause-modal-card">
              <span className="modal-badge">GAME PAUSED</span>
              <h2 className="modal-title">Take a Breath, Ninja</h2>
              
              <div className="pause-stats-summary">
                <div className="pause-stat-item">
                  <span className="pause-label">Current Score</span>
                  <span className="pause-val">{score}</span>
                </div>
                {gameMode !== 'classic' && (
                  <div className="pause-stat-item">
                    <span className="pause-label">Time Remaining</span>
                    <span className="pause-val">{timeLeft}s</span>
                  </div>
                )}
              </div>

              <div className="pause-actions">
                <button className="btn btn-primary btn-large" onClick={resumeGame}>
                  <Play size={20} fill="currentColor" />
                  <span>Resume Game</span>
                </button>

                <button className="btn btn-secondary" onClick={restartGame}>
                  <RotateCcw size={18} />
                  <span>Restart Match</span>
                </button>

                <button className="btn btn-ghost" onClick={onOpenInstructions}>
                  <HelpCircle size={18} />
                  <span>Instructions</span>
                </button>

                {onBackToHome && (
                  <button 
                    className="btn btn-ghost" 
                    onClick={() => {
                      soundManager.playClick();
                      onBackToHome();
                    }}
                  >
                    <Home size={18} />
                    <span>Exit to Arcade Home</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* GAME OVER SCREEN OVERLAY */}
        {gameState === 'gameover' && (
          <div className="overlay-screen gameover-overlay">
            <div className="gameover-modal-card">
              {isNewHighScore ? (
                <div className="high-score-ribbon animate-pulse">
                  <Award size={20} />
                  <span>NEW PERSONAL BEST!</span>
                </div>
              ) : (
                <span className="modal-badge">MATCH CONCLUDED</span>
              )}

              <h2 className="gameover-title">Game Over</h2>

              {/* Big Score Board */}
              <div className="gameover-score-board">
                <div className="final-score-box">
                  <span className="score-board-label">FINAL SCORE</span>
                  <span className="final-score-number">{score}</span>
                </div>
                <div className="best-score-box">
                  <span className="score-board-label">ALL-TIME BEST</span>
                  <span className="best-score-number">{highScore}</span>
                </div>
              </div>

              {/* Detailed Performance Stats */}
              <div className="gameover-stats-grid">
                <div className="stat-card">
                  <span className="stat-card-label">Fruits Sliced</span>
                  <span className="stat-card-value text-emerald">{sessionSlicedCount}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-card-label">Peak Combo</span>
                  <span className="stat-card-value text-amber">{maxComboHit > 0 ? `${maxComboHit}x` : '—'}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-card-label">Bombs Hit</span>
                  <span className="stat-card-value text-rose">{sessionBombsHit}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="gameover-actions">
                <button 
                  className="btn btn-primary btn-large btn-glow"
                  onClick={() => startGame(gameMode)}
                >
                  <RotateCcw size={20} />
                  <span>PLAY AGAIN</span>
                </button>

                <button 
                  className="btn btn-secondary"
                  onClick={() => setGameState('welcome')}
                >
                  <span>Select Game Mode</span>
                  <ChevronRight size={18} />
                </button>

                {onBackToHome && (
                  <button 
                    className="btn btn-ghost" 
                    onClick={() => {
                      soundManager.playClick();
                      onBackToHome();
                    }}
                  >
                    <Home size={18} />
                    <span>Return to Arcade Home</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
