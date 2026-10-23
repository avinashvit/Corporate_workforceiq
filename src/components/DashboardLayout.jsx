import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Cpu, User, ArrowLeftRight, Shield } from 'lucide-react';
import NeuralCursorCanvas from './NeuralCursorCanvas';
import { getCurrentUser, logout, login } from '../utils/auth';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const user = getCurrentUser() || {
    name: 'Enterprise User',
    role: 'Employee',
    department: 'General',
    email: 'employee@workforceiq.com',
  };

  const isHR = (user.role || '').toLowerCase().includes('hr');

  // Mouse position for dynamic gold cursor spotlight
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleQuickSwitchRole = () => {
    if (isHR) {
      // Switch to Employee
      login('employee@workforceiq.com', 'employee123');
      navigate('/employee/dashboard');
    } else {
      // Switch to HR
      login('hr@workforceiq.com', 'hr123');
      navigate('/hr/dashboard');
    }
  };

  return (
    <div className="dashboard-shell">
      {/* 1. Global Interactive Neural Particle Canvas */}
      <NeuralCursorCanvas />

      {/* 2. Dynamic Gold & White Ambient Cursor Spotlight */}
      <div
        className="cursor-spotlight"
        style={{
          background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 158, 11, 0.15), rgba(254, 240, 138, 0.05) 45%, transparent 75%)`,
        }}
      />

      {/* 3. Global Cyber Ambient Grid */}
      <div className="login-ambient-grid" />

      {/* Top Navigation Bar */}
      <header className="dashboard-header">
        <div className="header-left">
          <Link to="/" className="header-brand">
            <img src="/logo.svg" alt="WorkForceIQ Emblem" />
            <div className="header-brand-title">
              WorkForce<span>IQ</span>
            </div>
          </Link>

          <div className="header-badge">
            <Cpu size={13} />
            <span>2-Role Enterprise System • {isHR ? 'HR Portal' : 'Employee Portal'}</span>
          </div>
        </div>

        <div className="header-right">
          {/* Role badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.8rem',
              borderRadius: '9999px',
              background: isHR ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.12)',
              border: `1px solid ${isHR ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
              color: isHR ? '#fef08a' : '#6ee7b7',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            <Shield size={13} />
            <span>{isHR ? 'HR Administration Portal' : 'Employee Portal'}</span>
          </div>

          {/* Active User Initials Badge */}
          <div className="header-user-profile">
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: isHR
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 750,
                fontSize: '0.9rem',
                boxShadow: isHR ? '0 0 10px rgba(245, 158, 11, 0.4)' : '0 0 10px rgba(16, 185, 129, 0.4)',
                border: '1.5px solid #fef08a',
                flexShrink: 0,
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
            </div>
            <div className="user-details-mini">
              <span className="user-name-text">{user.name}</span>
              <span className="user-role-text">
                {user.role} • {user.department}
              </span>
            </div>
          </div>

          {/* Sign Out Action */}
          <button
            type="button"
            className="btn-header-logout"
            onClick={logout}
            title="Sign out of WorkForceIQ"
            id="header-logout-btn"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: 'calc(100vh - 72px)',
          width: '100%',
          position: 'relative',
          zIndex: 10,
          padding: '2rem 1.5rem',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1360px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
