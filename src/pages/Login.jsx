import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, LogIn, Cpu, Sparkles } from 'lucide-react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import DemoAccounts from '../components/DemoAccounts';
import NeuralCursorCanvas from '../components/NeuralCursorCanvas';

export default function Login() {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedCredentials, setSelectedCredentials] = useState(null);

  // Mouse position for dynamic lighting & 3D card tilt effect
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Calculate subtle 3D card tilt based on mouse distance from screen center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;

      // Subtle, elegant tilt limits (-6deg to 6deg)
      setCardTilt({
        x: deltaX * 5.5,
        y: -deltaY * 5.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSelectAccount = (creds) => {
    setAuthMode('login');
    setSelectedCredentials(creds);
  };

  return (
    <div className="login-interactive-container">
      {/* 1. Interactive Neural Particles Canvas (responds directly to cursor movement) */}
      <NeuralCursorCanvas />

      {/* 2. Dynamic Ambient Cursor Spotlight */}
      <div
        className="cursor-spotlight"
        style={{
          background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.14), rgba(129, 140, 248, 0.05) 45%, transparent 75%)`,
        }}
      />

      {/* 3. Subtle Cyber Grid */}
      <div className="login-ambient-grid" />

      {/* 4. Centerpiece Container with 3D Tilt Effect */}
      <div
        className="login-center-wrapper"
        style={{
          transform: `perspective(1200px) rotateX(${cardTilt.y}deg) rotateY(${cardTilt.x}deg)`,
          transition: 'transform 0.12s ease-out',
        }}
        ref={cardRef}
      >
        {/* Brand Header */}
        <div className="center-brand-header">
          <div className="center-logo-box">
            <img src="/logo.svg" alt="WorkForceIQ" className="center-logo-img" />
            <span className="logo-glow-ring" />
          </div>

          <h1 className="center-brand-title">
            WorkForce<span className="brand-title-accent">IQ</span>
          </h1>

          <div className="center-ai-pill">
            <span className="ai-pulse-dot" />
            <span>AI-Powered Corporate Workforce Intelligence</span>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="auth-tab-bar">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
            id="tab-sign-in"
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
            id="tab-sign-in-new"
          >
            <UserPlus size={15} />
            <span>Sign In as New User</span>
          </button>
        </div>

        {/* Login or Register Form Card */}
        <div className="auth-card-stage">
          {authMode === 'login' ? (
            <LoginForm
              credentialsToFill={selectedCredentials}
              onSwitchToRegister={() => setAuthMode('register')}
            />
          ) : (
            <RegisterForm
              onSwitchToLogin={(creds) => {
                setAuthMode('login');
                if (creds) setSelectedCredentials(creds);
              }}
            />
          )}
        </div>

        {/* Demo Accounts Panel */}
        <DemoAccounts onSelectAccount={handleSelectAccount} />
      </div>
    </div>
  );
}
