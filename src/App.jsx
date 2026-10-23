import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import AccessDenied from './pages/AccessDenied';
import HRDashboard from './pages/HRDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AuthGuard from './components/AuthGuard';
import { isAuthenticated, getCurrentUser, getDashboardForRole } from './utils/auth';

/**
 * Root Route Redirector
 * If authenticated, redirects to the user's assigned dashboard (HR or Employee).
 * If unauthenticated, redirects to /login.
 */
function RootRedirect() {
  if (isAuthenticated()) {
    const user = getCurrentUser();
    return <Navigate to={getDashboardForRole(user?.role)} replace />;
  }
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Route */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Exactly Two Role Protected Dashboards */}
        {/* 1. HR Dashboard (for HR role) */}
        <Route
          path="/hr/dashboard"
          element={
            <AuthGuard allowedRoles={['HR Manager', 'HR']}>
              <HRDashboard />
            </AuthGuard>
          }
        />

        {/* 2. Employee Dashboard (for Employee role) */}
        <Route
          path="/employee/dashboard"
          element={
            <AuthGuard allowedRoles={['Employee']}>
              <EmployeeDashboard />
            </AuthGuard>
          }
        />

        {/* Legacy redirects */}
        <Route path="/admin/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/manager/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/executive/dashboard" element={<Navigate to="/" replace />} />

        {/* Catch-all unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
