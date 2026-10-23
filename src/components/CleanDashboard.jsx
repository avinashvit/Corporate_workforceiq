import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Shield, Building, Clock, LogOut, CheckCircle2 } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { getCurrentUser, logout } from '../utils/auth';

export default function CleanDashboard({ roleTitle }) {
  const user = getCurrentUser() || {
    name: 'Authenticated User',
    email: 'user@workforceiq.com',
    role: roleTitle || 'Employee',
    department: 'Corporate Workspace',
    userId: 'USR---',
    status: 'active',
    lastLogin: new Date().toISOString(),
  };

  // 3D Card Tilt Tracking
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;

      // Subtle 3D perspective tilt (-5.5deg to 5.5deg)
      setCardTilt({
        x: deltaX * 5.5,
        y: -deltaY * 5.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const roleColors = {
    'Super Admin': { bg: 'rgba(245, 158, 11, 0.18)', text: '#fef08a', border: 'rgba(245, 158, 11, 0.45)' },
    'HR Manager': { bg: 'rgba(245, 158, 11, 0.18)', text: '#fde68a', border: 'rgba(245, 158, 11, 0.45)' },
    'Department Manager': { bg: 'rgba(245, 158, 11, 0.18)', text: '#fde68a', border: 'rgba(245, 158, 11, 0.45)' },
    'Executive': { bg: 'rgba(245, 158, 11, 0.22)', text: '#ffffff', border: 'rgba(254, 240, 138, 0.6)' },
    'Employee': { bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7', border: 'rgba(16, 185, 129, 0.35)' },
  };

  const currentRoleStyle = roleColors[user.role] || roleColors['Employee'];

  return (
    <DashboardLayout>
      {/* Centered 3D Tilt Card (Clean, perfectly positioned with 0 overflow) */}
      <div
        ref={cardRef}
        style={{
          maxWidth: '560px',
          width: '100%',
          background: 'rgba(18, 17, 24, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          boxShadow:
            '0 30px 60px -12px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          position: 'relative',
          zIndex: 10,
          transform: `perspective(1200px) rotateX(${cardTilt.y}deg) rotateY(${cardTilt.x}deg)`,
          transition: 'transform 0.12s ease-out, border-color 0.25s, box-shadow 0.25s',
          animation: 'fadeIn 0.35s ease-out',
          margin: 'auto',
        }}
      >
        {/* Glowing highlight rim across the top in Gold */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(254, 240, 138, 0.9), transparent)',
            borderRadius: '2px',
          }}
        />

        {/* User Initials Badge with Status Ring in Gold & White (No Photos) */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(18, 17, 24, 0.95) 100%)',
              border: '3px solid #f59e0b',
              boxShadow: '0 0 28px rgba(245, 158, 11, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '2.15rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.02em',
              textShadow: '0 0 15px rgba(254, 240, 138, 0.7)',
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : <User size={38} color="#fbbf24" />}
          </div>
          <span
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '16px',
              height: '16px',
              background: '#10b981',
              borderRadius: '50%',
              border: '2.5px solid #0f172a',
              boxShadow: '0 0 8px #10b981',
            }}
            title="Online & Active"
          />
        </div>

        {/* User Name & Role Pill in Gold */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '0.25rem 0.85rem',
              borderRadius: '9999px',
              background: currentRoleStyle.bg,
              color: currentRoleStyle.text,
              border: `1px solid ${currentRoleStyle.border}`,
              marginBottom: '0.75rem',
              boxShadow: '0 0 14px rgba(245, 158, 11, 0.25)',
            }}
          >
            <Shield size={14} />
            <span>{user.role}</span>
          </div>

          <h1
            style={{
              fontSize: '2.15rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.025em',
              marginBottom: '0.35rem',
            }}
          >
            Welcome, {user.name}
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#d4d4d8' }}>
            You are signed in to the WorkForceIQ Corporate Workspace.
          </p>
        </div>

        {/* Profile Details Grid */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.85rem',
            textAlign: 'left',
            marginTop: '0.5rem',
          }}
        >
          <div
            style={{
              background: 'rgba(12, 11, 17, 0.85)',
              border: '1px solid rgba(253, 230, 138, 0.12)',
              borderRadius: '12px',
              padding: '0.95rem 1.1rem',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                color: '#8e8e98',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginBottom: '0.25rem',
              }}
            >
              <User size={13} /> User ID
            </div>
            <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>
              <code>{user.userId || user.id || 'USR---'}</code>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(12, 11, 17, 0.85)',
              border: '1px solid rgba(253, 230, 138, 0.12)',
              borderRadius: '12px',
              padding: '0.95rem 1.1rem',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                color: '#8e8e98',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginBottom: '0.25rem',
              }}
            >
              <Building size={13} /> Department
            </div>
            <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>
              {user.department || 'General'}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(12, 11, 17, 0.85)',
              border: '1px solid rgba(253, 230, 138, 0.12)',
              borderRadius: '12px',
              padding: '0.95rem 1.1rem',
              gridColumn: 'span 2',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                color: '#8e8e98',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginBottom: '0.25rem',
              }}
            >
              <Mail size={13} /> Corporate Email
            </div>
            <div style={{ color: '#ffffff', fontWeight: 500, fontSize: '0.95rem' }}>
              {user.email || 'user@workforceiq.com'}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(12, 11, 17, 0.85)',
              border: '1px solid rgba(253, 230, 138, 0.12)',
              borderRadius: '12px',
              padding: '0.95rem 1.1rem',
              gridColumn: 'span 2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#8e8e98',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginBottom: '0.25rem',
                }}
              >
                <Clock size={13} /> Account Status
              </div>
              <div
                style={{
                  color: '#34d399',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <CheckCircle2 size={15} /> Active
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#8e8e98', marginBottom: '0.25rem' }}>
                Last Login
              </div>
              <div style={{ color: '#d4d4d8', fontSize: '0.82rem' }}>
                {user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString() : 'Just now'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Sign Out in Gold */}
        <button
          type="button"
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.55rem',
            padding: '0.9rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.98rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginTop: '0.5rem',
          }}
          id="clean-dashboard-logout-btn"
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </DashboardLayout>
  );
}
