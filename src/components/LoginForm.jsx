import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { login, getRememberedEmail } from '../utils/auth';

export default function LoginForm({ credentialsToFill, onSwitchToRegister }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-fill from Remember Me or Demo Accounts selection
  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (credentialsToFill) {
      setEmail(credentialsToFill.email || '');
      setPassword(credentialsToFill.password || '');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [credentialsToFill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);

    // Simulate enterprise authentication network latency (600ms)
    setTimeout(() => {
      const result = login(email, password, rememberMe);

      if (!result.success) {
        setLoading(false);
        setErrorMessage(result.error);
      } else {
        setSuccessMessage(`Authenticated as ${result.user.name} (${result.user.role}). Redirecting...`);
        // Smooth transition before redirect
        setTimeout(() => {
          navigate(result.dashboardUrl);
        }, 650);
      }
    }, 600);
  };

  return (
    <div className="login-card">
      <div className="login-card-header">
        <div className="login-card-badge">
          <ShieldCheck size={14} /> Enterprise Access Gateway
        </div>
        <h2 className="login-card-title">Welcome Back</h2>
        <p className="login-card-subtitle">Sign in to your WorkforceIQ account</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {/* Error Alert */}
        {errorMessage && (
          <div className="auth-alert error" role="alert">
            <AlertCircle size={18} className="alert-icon" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="auth-alert success" role="status">
            <CheckCircle2 size={18} className="alert-icon" />
            <div>{successMessage}</div>
          </div>
        )}

        {/* Email Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="email-input">
            Corporate Email
          </label>
          <div className="input-container">
            <span className="input-icon-left">
              <Mail size={18} />
            </span>
            <input
              id="email-input"
              type="email"
              className="form-input"
              placeholder="name@workforceiq.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="form-group">
          <div className="form-label">
            <label htmlFor="password-input">Password</label>
          </div>
          <div className="input-container">
            <span className="input-icon-left">
              <Lock size={18} />
            </span>
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              className="form-input has-right-btn"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="input-btn-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="form-options-row">
          <label className="remember-checkbox-label" htmlFor="remember-me">
            <input
              id="remember-me"
              type="checkbox"
              className="custom-checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            <span>Remember me</span>
          </label>

          <Link to="/forgot-password" className="forgot-password-link">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-submit"
          disabled={loading}
          id="login-submit-btn"
        >
          {loading ? (
            <>
              <div className="btn-spinner" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Switch to Register as New User */}
        {onSwitchToRegister && (
          <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            New user?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              style={{ color: '#38bdf8', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              id="switch-to-register-btn"
            >
              Sign In as New User
            </button>
          </div>
        )}
      </form>

      {/* Trust & Compliance Footer */}
      <div className="login-trust-footer">
        <ShieldCheck size={16} />
        <span>Secure Workforce Intelligence Platform • 256-bit SSL</span>
      </div>
    </div>
  );
}
