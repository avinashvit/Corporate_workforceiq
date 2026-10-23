import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, ShieldAlert, KeyRound, Sparkles, RefreshCw } from 'lucide-react';
import { verifyEmail, resetPasswordDemo, getAllUsers } from '../utils/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSearching(true);
    setResetSuccess(false);

    // Simulate enterprise lookup latency
    setTimeout(() => {
      const exists = verifyEmail(email);
      setSubmitted(true);
      setIsSearching(false);

      if (exists) {
        const users = getAllUsers();
        const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        setMatchedUser(user || null);
      } else {
        setMatchedUser(null);
      }
    }, 450);
  };

  const handleDemoReset = (e) => {
    e.preventDefault();
    if (!newPassword.trim() || !matchedUser) return;

    const res = resetPasswordDemo(matchedUser.email, newPassword);
    if (res.success) {
      setResetSuccess(true);
    }
  };

  return (
    <div className="forgot-page-container">
      <div className="login-ambient-grid" />

      <div className="forgot-card">
        <div>
          <Link to="/login" className="forgot-back-link">
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </Link>
          <div className="login-card-badge">
            <KeyRound size={13} /> Account Recovery
          </div>
          <h2 className="login-card-title">Reset Password</h2>
          <p className="login-card-subtitle">
            Enter your corporate email address to receive password recovery instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="forgot-email">
              Corporate Email Address
            </label>
            <div className="input-container">
              <span className="input-icon-left">
                <Mail size={18} />
              </span>
              <input
                id="forgot-email"
                type="email"
                className="form-input"
                placeholder="name@workforceiq.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSubmitted(false);
                  setResetSuccess(false);
                }}
                disabled={isSearching}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={isSearching}
            id="forgot-submit-btn"
          >
            {isSearching ? (
              <>
                <div className="btn-spinner" />
                <span>Checking Database...</span>
              </>
            ) : (
              <span>Send Recovery Instructions</span>
            )}
          </button>
        </form>

        {/* Required Message upon Submission */}
        {submitted && (
          <div className="auth-alert success" role="status" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <CheckCircle2 size={18} className="alert-icon" />
              <span>If the account exists, password recovery instructions would be sent to the registered email.</span>
            </div>
          </div>
        )}

        {/* Development Mode Helper Panel */}
        {submitted && matchedUser && (
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              fontSize: '0.82rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fde68a', fontWeight: 700 }}>
              <Sparkles size={15} />
              <span>Development Mode: Reset Simulator</span>
            </div>
            <p style={{ color: '#94a3b8' }}>
              Account identified: <strong>{matchedUser.name}</strong> ({matchedUser.role})
              <br />
              Current demo password: <code style={{ color: '#f8fafc', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>{matchedUser.password}</code>
            </p>

            {resetSuccess ? (
              <div style={{ color: '#34d399', fontWeight: 600 }}>
                Password successfully updated to: <code>{newPassword}</code>. You can now{' '}
                <Link to="/login" style={{ textDecoration: 'underline' }}>
                  sign in here
                </Link>.
              </div>
            ) : (
              <form onSubmit={handleDemoReset} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter new demo password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ height: '38px', paddingLeft: '0.85rem' }}
                  required
                />
                <button
                  type="submit"
                  className="btn-use-account"
                  style={{ padding: '0 1rem', height: '38px' }}
                >
                  Set New
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
