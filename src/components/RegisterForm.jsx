import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Briefcase, Building, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { registerUser, login } from '../utils/auth';

const ROLES = [
  'Employee',
  'HR Manager',
];

export default function RegisterForm({ onSwitchToLogin }) {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [department, setDepartment] = useState('Product Design');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !email.trim() || !password || !role) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password should be at least 4 characters.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const regRes = registerUser({
        name,
        email,
        password,
        role,
        department,
      });

      if (!regRes.success) {
        setLoading(false);
        setErrorMessage(regRes.error);
        return;
      }

      // Auto login with new credentials
      const loginRes = login(email, password, true);

      if (loginRes.success) {
        setSuccessMessage(`Account created successfully for ${regRes.user.name} (${regRes.user.role})! Redirecting to your dashboard...`);
        setTimeout(() => {
          navigate(loginRes.dashboardUrl);
        }, 800);
      } else {
        setLoading(false);
        setSuccessMessage('Account created! Please sign in with your credentials.');
        setTimeout(() => {
          onSwitchToLogin({ email, password });
        }, 1000);
      }
    }, 600);
  };

  return (
    <div className="login-card">
      <div className="login-card-header">
        <div className="login-card-badge">
          <User size={14} /> New User Registration
        </div>
        <h2 className="login-card-title">Sign In as New User</h2>
        <p className="login-card-subtitle">Create a corporate profile and access your workspace</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {errorMessage && (
          <div className="auth-alert error" role="alert">
            <AlertCircle size={18} className="alert-icon" />
            <div>{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="auth-alert success" role="status">
            <CheckCircle2 size={18} className="alert-icon" />
            <div>{successMessage}</div>
          </div>
        )}

        {/* Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="reg-name">
            Full Name
          </label>
          <div className="input-container">
            <span className="input-icon-left">
              <User size={18} />
            </span>
            <input
              id="reg-name"
              type="text"
              className="form-input"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* Corporate Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="reg-email">
            Corporate Email
          </label>
          <div className="input-container">
            <span className="input-icon-left">
              <Mail size={18} />
            </span>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              placeholder="johndoe@workforceiq.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="reg-password">
            Create Password
          </label>
          <div className="input-container">
            <span className="input-icon-left">
              <Lock size={18} />
            </span>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              className="form-input has-right-btn"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
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

        {/* User Role Selection */}
        <div className="form-group">
          <label className="form-label" htmlFor="reg-role">
            Assigned User Role
          </label>
          <div className="input-container">
            <span className="input-icon-left">
              <Briefcase size={18} />
            </span>
            <select
              id="reg-role"
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              style={{ paddingLeft: '2.85rem' }}
            >
              {ROLES.map((r) => (
                <option key={r} value={r} style={{ background: '#0f172a', color: 'white' }}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Department */}
        <div className="form-group">
          <label className="form-label" htmlFor="reg-dept">
            Department / Division
          </label>
          <div className="input-container">
            <span className="input-icon-left">
              <Building size={18} />
            </span>
            <input
              id="reg-dept"
              type="text"
              className="form-input"
              placeholder="e.g. Engineering, HR, Finance"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn-submit"
          disabled={loading}
          id="register-submit-btn"
        >
          {loading ? (
            <>
              <div className="btn-spinner" />
              <span>Registering Profile...</span>
            </>
          ) : (
            <>
              <span>Create Account & Enter Platform</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Toggle back to Sign In */}
        <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onSwitchToLogin()}
            style={{ color: '#38bdf8', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Sign In here
          </button>
        </div>
      </form>

      <div className="login-trust-footer">
        <ShieldCheck size={16} />
        <span>Instantly saved to local data/users.json store</span>
      </div>
    </div>
  );
}
