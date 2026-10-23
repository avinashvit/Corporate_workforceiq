/**
 * WorkForceIQ - Authentication & Session Management Utility
 * 
 * ============================================================================
 * ARCHITECTURAL SECURITY NOTE (DEMO IMPLEMENTATION):
 * ============================================================================
 * Demo authentication only. Production implementation should use server-side
 * authentication, password hashing (e.g., Argon2id or bcrypt with salt),
 * HttpOnly/Secure/SameSite JWT or session cookies, rate-limiting against brute force,
 * and strict CORS/CSRF protections.
 * 
 * In this client-side enterprise demo, credentials are validated against local
 * data/users.json with session persistence in localStorage / sessionStorage.
 * ============================================================================
 */

import initialUsers from '../../data/users.json';
import { registerUnassignedEmployee } from './employeeData';

const SESSION_KEY = 'workforceiq_session';
const USERS_STORAGE_KEY = 'workforceiq_users_db_v3';
const REMEMBER_KEY = 'workforceiq_remember_email';

/**
 * Initializes and retrieves the local users database.
 * Allows runtime updates (such as demo password resets and lastLogin updates)
 * while preserving fallback to initial users.json.
 */
export function getAllUsers() {
  const usersMap = new Map();

  // 1. Always load users from data/users.json first
  (initialUsers || []).forEach((u) => {
    if (u && u.email) {
      usersMap.set(u.email.toLowerCase().trim(), { ...u });
    }
  });

  // 2. Merge dynamically registered users from localStorage
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        parsed.forEach((u) => {
          if (u && u.email) {
            const emailKey = u.email.toLowerCase().trim();
            if (!usersMap.has(emailKey)) {
              usersMap.set(emailKey, u);
            } else {
              const diskUser = usersMap.get(emailKey);
              usersMap.set(emailKey, {
                ...u,
                ...diskUser,
                lastLogin: u.lastLogin || diskUser.lastLogin,
              });
            }
          }
        });
      }
    }
  } catch (err) {
    console.warn('Unable to access localStorage for users:', err);
  }

  const merged = Array.from(usersMap.values());

  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {}

  return merged;
}

/**
 * Persists the users database (for simulated updates like lastLogin & demo password reset).
 */
function saveUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users into local storage:', err);
  }
}

/**
 * Authenticate a user with email and password.
 * Checks:
 *  1. Matching email & password
 *  2. Account active status
 * 
 * Returns: { success: boolean, user?: object, error?: string }
 */
export function login(email, password, rememberMe = false) {
  const users = getAllUsers();
  const trimmedEmail = (email || '').trim().toLowerCase();
  
  // Find matching user (case-insensitive email matching)
  const user = users.find(
    (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
  );

  if (!user) {
    return {
      success: false,
      error: 'Invalid email or password',
    };
  }

  // Account status check
  if (user.status !== 'active') {
    return {
      success: false,
      error: 'Your account has been disabled. Contact the administrator.',
    };
  }

  // Update lastLogin timestamp
  const nowIso = new Date().toISOString();
  const updatedUser = { ...user, lastLogin: nowIso };
  const updatedUsers = users.map((u) => 
    u.id === user.id ? updatedUser : u
  );
  saveUsers(updatedUsers);

  // Sync updated user to physical data/users.json on disk
  try {
    fetch('/api/save-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    }).catch(() => {});
  } catch (e) {}

  // Prepare session object (per requirement: role, department, name, userId, isAuthenticated, avatar)
  const sessionData = {
    isAuthenticated: true,
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    avatar: user.avatar,
    lastLogin: nowIso,
  };

  // If employee signs in, ensure they are registered in employee records queue for HR
  if (user.role === 'Employee') {
    registerUnassignedEmployee({
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
    });
  }

  // Store in localStorage for persistent session
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, trimmedEmail);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
  } catch (err) {
    console.error('Error saving session:', err);
  }

  return {
    success: true,
    user: sessionData,
    dashboardUrl: getDashboardForRole(user.role),
  };
}

/**
 * Logs out the current user, clears active session, and redirects to /login.
 */
export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error('Error during logout session cleanup:', err);
  }
  window.location.href = '/login';
}

/**
 * Retrieves the currently authenticated user from storage.
 * Returns null if not authenticated or expired.
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session && session.isAuthenticated) {
      return session;
    }
  } catch (err) {
    console.error('Failed to parse current user session:', err);
  }
  return null;
}

/**
 * Checks whether a valid user session currently exists.
 */
export function isAuthenticated() {
  const user = getCurrentUser();
  return !!(user && user.isAuthenticated);
}

/**
 * Checks if the currently authenticated user possesses a given role or is in a list of allowed roles.
 */
export function hasRole(allowedRoleOrRoles) {
  const user = getCurrentUser();
  if (!user || !user.role) return false;
  if (Array.isArray(allowedRoleOrRoles)) {
    return allowedRoleOrRoles.includes(user.role);
  }
  return user.role === allowedRoleOrRoles;
}

/**
 * Validates authentication; throws or returns false if unauthenticated.
 */
export function requireAuth() {
  return isAuthenticated();
}

/**
 * Validates whether the current user satisfies required role authorization.
 */
export function requireRole(allowedRoles) {
  if (!requireAuth()) return false;
  return hasRole(allowedRoles);
}

/**
 * Maps a standardized user role to its designated enterprise dashboard route.
 */
export function getDashboardForRole(role) {
  const normalized = (role || '').toLowerCase();
  if (normalized.includes('hr')) {
    return '/hr/dashboard';
  }
  return '/employee/dashboard';
}

/**
 * Gets remembered email (if user previously checked 'Remember Me').
 */
export function getRememberedEmail() {
  try {
    return localStorage.getItem(REMEMBER_KEY) || '';
  } catch (err) {
    return '';
  }
}

/**
 * Look up user email for Forgot Password functionality.
 */
export function verifyEmail(email) {
  const users = getAllUsers();
  const trimmed = (email || '').trim().toLowerCase();
  return users.some((u) => u.email.toLowerCase() === trimmed);
}

/**
 * Register a new user and persist to local storage database.
 */
export function registerUser({ name, email, password, role, department }) {
  const users = getAllUsers();
  const trimmedEmail = (email || '').trim().toLowerCase();

  if (!name?.trim() || !trimmedEmail || !password || !role) {
    return { success: false, error: 'All fields are required.' };
  }

  // Check if email is already registered
  const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
  if (existing) {
    return { success: false, error: 'An account with this email already exists. Please sign in.' };
  }

  // Generate new unique user ID
  const nextNumber = users.length + 1;
  const newId = `USR${String(nextNumber).padStart(3, '0')}`;

  const newUser = {
    id: newId,
    name: name.trim(),
    email: trimmedEmail,
    password: password,
    role: role,
    department: (department || 'General').trim(),
    avatar: null,
    status: 'active',
    lastLogin: null,
  };

  users.push(newUser);
  saveUsers(users);

  // If registering as Employee, queue as Unassigned Employee for HR evaluation
  if (role === 'Employee') {
    registerUnassignedEmployee({
      id: newId,
      name: name.trim(),
      email: trimmedEmail,
      department: (department || 'General').trim()
    });
  }

  // Sync to physical data/users.json on disk via dev server middleware
  try {
    fetch('/api/save-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    }).catch(() => {});
  } catch (e) {}

  return {
    success: true,
    user: newUser,
  };
}

/**
 * Demo reset password utility (updates the local storage mock DB).
 */
export function resetPasswordDemo(email, newPassword) {
  const users = getAllUsers();
  const trimmed = (email || '').trim().toLowerCase();
  const index = users.findIndex((u) => u.email.toLowerCase() === trimmed);
  
  if (index === -1) {
    return { success: false, error: 'User with this email not found' };
  }

  users[index].password = newPassword;
  saveUsers(users);
  return { success: true };
}
