import React, { useState } from 'react';
import { ChevronDown, Users, Shield, UserPlus, KeyRound } from 'lucide-react';

const DEMO_USERS = [
  {
    role: 'HR Manager',
    name: 'Sarah Johnson',
    email: 'hr@workforceiq.com',
    password: 'hr123',
    badgeClass: 'hr-manager',
    department: 'Human Resources (Manages & Evaluates Employees)',
    desc: 'Access the HR Dashboard, evaluate unassigned employees, and project the Corporate Attendance QR Code.'
  },
  {
    role: 'Employee',
    name: 'Avinash',
    email: 'avinash@workforceiq.com',
    password: 'avinash123',
    badgeClass: 'employee',
    department: 'Product Design',
    desc: 'Access Employee Dashboard, mark daily attendance via QR Code scanner, and view HR performance charts.'
  }
];

export default function DemoAccounts({ onSelectAccount }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="demo-accounts-wrapper">
      <div className="demo-accordion-card">
        <button
          type="button"
          className="demo-accordion-header"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          id="demo-accounts-toggle-btn"
        >
          <div className="demo-header-left">
            <Users size={16} className="ticker-icon" />
            <span>Demo Accounts</span>
            <span className="demo-pill">Quick Access</span>
          </div>
          <ChevronDown
            size={18}
            className={`demo-chevron ${isExpanded ? 'expanded' : ''}`}
          />
        </button>

        {isExpanded && (
          <div className="demo-accordion-content">
            <p className="demo-subtitle">
              Sign in as <strong>HR Manager</strong> to review the workforce, project the attendance QR terminal, and calculate performance for new employees:
            </p>

            {DEMO_USERS.map((user) => (
              <div key={user.email} className="demo-user-card">
                <div className="demo-user-info">
                  <div className="demo-role-row">
                    <span className="demo-role-tag">{user.role}</span>
                    <span className={`role-badge-pill ${user.badgeClass}`}>
                      {user.department}
                    </span>
                  </div>
                  <div className="demo-credentials-row">
                    <span>{user.email}</span> • <span className="cred-pass">pwd: {user.password}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#a1a1aa', marginTop: '0.2rem' }}>
                    {user.desc}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-use-account"
                  onClick={() => onSelectAccount({ email: user.email, password: user.password })}
                  id={`use-account-${user.email.split('@')[0]}`}
                >
                  Use Account
                </button>
              </div>
            ))}

            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                fontSize: '0.76rem',
                color: '#d4d4d8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <UserPlus size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
              <span>
                <strong>Testing as an Employee:</strong> Click the <em>"Sign In as New User"</em> tab above to register a new employee. Once signed in, they will be shown to the HR as an unassigned employee for initial evaluation & performance calculation.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
