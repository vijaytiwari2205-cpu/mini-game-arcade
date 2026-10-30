import React, { useState } from 'react';
import { X, Send, Mail, MessageSquare, CheckCircle, Sparkles } from 'lucide-react';
import { soundManager } from '../games/FruitSlicing/engine/SoundManager';

export const ContactModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [gameIdea, setGameIdea] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    soundManager.playHighScore();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setGameIdea('');
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-card contact-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-badge">COMMUNITY & FEEDBACK</span>
            <h2 className="modal-title">Contact Arcade Team</h2>
          </div>
          <button className="btn-icon close-btn" onClick={handleClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {submitted ? (
            <div className="contact-success-state">
              <CheckCircle size={48} className="text-emerald" />
              <h3>Game Idea Received!</h3>
              <p>Thank you for helping us shape the next arcade release.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-info-strip">
                <div className="contact-info-item">
                  <Mail size={16} className="text-cyan" />
                  <span>support@minigamearcade.local</span>
                </div>
                <div className="contact-info-item">
                  <Sparkles size={16} className="text-purple" />
                  <span>Vercel Edge Powered</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MessageSquare size={14} /> Suggest a New Mini Game or Leave Feedback
                </label>
                <textarea 
                  className="form-textarea"
                  rows={4}
                  placeholder="What game should we build next? (e.g., Brick Breaker, Pac-Man style, Flappy Runner, Space Shooter...)"
                  value={gameIdea}
                  onChange={(e) => setGameIdea(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                <Send size={16} />
                <span>Submit Feedback</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
