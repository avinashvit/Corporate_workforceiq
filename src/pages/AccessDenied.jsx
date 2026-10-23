import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Lock, AlertTriangle } from 'lucide-react';
import { getCurrentUser, getDashboardForRole } from '../utils/auth';

export default function AccessDenied() {
  const location = useLocation();
  const currentUser = getCurrentUser();
  const state = location.state || {};

  const returnDashboardUrl = currentUser ? getDashboardForRole(currentUser.role) : '/login';

  return (
    <div className="access-denied-wrapper">
      <div className="access-denied-card">
        <div className="access-denied-icon">
          <ShieldAlert size={38} />
        </div>

        <h1 className="access-denied-title">Access Restricted</h1>
        
        <p className="access-denied-message">
          You don't have permission to access this section.
        </p>

        {/* Role & Attempt Context Box */}
        <div className="access-role-context">
          <div>
            Your Active Role:{' '}
            <strong style={{ color: '#38bdf8' }}>
              {currentUser ? currentUser.role : 'Unauthenticated User'}
            </strong>
          </div>
          {state.attemptedPath && (
            <div>
              Attempted Route:{' '}
              <code style={{ color: '#f87171' }}>{state.attemptedPath}</code>
            </div>
          )}
          {state.allowedRoles && (
            <div>
              Authorized Roles:{' '}
              <span style={{ color: '#94a3b8' }}>{state.allowedRoles.join(', ')}</span>
            </div>
          )}
        </div>

        <Link to={returnDashboardUrl} className="btn-return-dashboard" id="return-dashboard-btn">
          <ArrowLeft size={18} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
