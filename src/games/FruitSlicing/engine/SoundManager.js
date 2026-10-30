/**
 * SoundManager - Procedural Web Audio API sound synthesizer
 * 100% self-contained: no external audio assets needed, zero latency, offline ready!
 */

import { getSoundMuted, saveSoundMuted } from '../../../utils/storage';

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = getSoundMuted();
    this.initialized = false;
  }

  init() {
    if (this.initialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch {
      // AudioContext not supported or restricted
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    saveSoundMuted(this.isMuted);
    if (!this.isMuted) {
      this.playClick();
    }
    return this.isMuted;
  }

  setMute(muted) {
    this.isMuted = muted;
    saveSoundMuted(this.isMuted);
  }

  /**
   * Sword blade whoosh sound
   */
  playSlice(pitchMod = 1) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 0.14;

      // Noise buffer for swoosh friction
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter sweep
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600 * pitchMod, now);
      filter.frequency.exponentialRampToValueAtTime(1800 * pitchMod, now + 0.05);
      filter.frequency.exponentialRampToValueAtTime(300 * pitchMod, now + duration);
      filter.Q.setValueAtTime(4.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Add a swift resonant tone for sharp metallic blade feel
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750 * pitchMod, now);
      osc.frequency.exponentialRampToValueAtTime(240 * pitchMod, now + duration);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.08, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio fail silent
    }
  }

  /**
   * Juicy fruit slice / squish sound
   */
  playSplat(fruitTypeKey = 'WATERMELON') {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 0.22;

      // Base frequency tuned by fruit type
      let baseFreq = 260;
      if (fruitTypeKey === 'STRAWBERRY') baseFreq = 420;
      if (fruitTypeKey === 'WATERMELON') baseFreq = 180;
      if (fruitTypeKey === 'PINEAPPLE') baseFreq = 220;
      if (fruitTypeKey === 'DRAGONFRUIT') baseFreq = 340;

      // FM Oscillator for squishy plop
      const modOsc = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const carrierOsc = this.ctx.createOscillator();
      const mainGain = this.ctx.createGain();

      carrierOsc.type = 'sine';
      carrierOsc.frequency.setValueAtTime(baseFreq, now);
      carrierOsc.frequency.exponentialRampToValueAtTime(60, now + duration);

      modOsc.type = 'sawtooth';
      modOsc.frequency.setValueAtTime(baseFreq * 2.5, now);
      modOsc.frequency.exponentialRampToValueAtTime(40, now + duration);

      modGain.gain.setValueAtTime(baseFreq * 1.5, now);
      modGain.gain.exponentialRampToValueAtTime(1, now + duration);

      modOsc.connect(carrierOsc.frequency);

      mainGain.gain.setValueAtTime(0.4, now);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      carrierOsc.connect(mainGain);
      mainGain.connect(this.ctx.destination);

      carrierOsc.start(now);
      modOsc.start(now);
      carrierOsc.stop(now + duration);
      modOsc.stop(now + duration);
    } catch {
      // Audio fail silent
    }
  }

  /**
   * Musical combo chimes - pitch rises with combo multiplier
   */
  playCombo(comboCount = 2) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Pentatonic / major chord frequencies
      const chords = [
        [523.25, 659.25],         // C5, E5
        [587.33, 739.99, 880.00], // D5, F#5, A5
        [659.25, 830.61, 987.77], // E5, G#5, B5
        [783.99, 987.77, 1174.66, 1567.98] // G5, B5, D6, G6 (Grand Combo)
      ];

      const notes = chords[Math.min(comboCount - 2, chords.length - 1)] || chords[0];

      notes.forEach((freq, idx) => {
        const noteStart = now + idx * 0.055;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.25, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.36);
      });
    } catch {
      // Audio fail silent
    }
  }

  /**
   * Bomb explosion sound - heavy sub bass impact + noise rumble
   */
  playBombExplode() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 0.85;

      // 1. Heavy low-end sub drop
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.4);

      subGain.gain.setValueAtTime(0.7, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.5);

      // 2. Distorted noise burst
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.25));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + duration);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.65, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch {
      // Audio fail silent
    }
  }

  /**
   * Bomb fuse spark sound
   */
  playFuseSpark() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 0.05;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 3500;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch {
      // Silent
    }
  }

  /**
   * Timer warning tick sound (< 10 seconds remaining)
   */
  playTick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(980, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Silent
    }
  }

  /**
   * Game Over fanfare / sound
   */
  playGameOver() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 415.3, 392, 349.23]; // A4, Ab4, G4, F4

      notes.forEach((freq, idx) => {
        const noteStart = now + idx * 0.14;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.01, noteStart);
        gain.gain.linearRampToValueAtTime(0.22, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.3);
      });
    } catch {
      // Silent
    }
  }

  /**
   * High score celebration fanfare
   */
  playHighScore() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const noteStart = now + idx * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.01, noteStart);
        gain.gain.linearRampToValueAtTime(0.24, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + (idx === 3 ? 0.6 : 0.2));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.7);
      });
    } catch {
      // Silent
    }
  }

  /**
   * UI Click sound
   */
  playClick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Silent
    }
  }
}

// Singleton export
export const soundManager = new SoundManager();
