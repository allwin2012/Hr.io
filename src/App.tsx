// src/App.tsx
import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Layout from './components/dashboard/Layout';
import PageContent from './components/dashboard/PageContent';
import { ThemeProvider } from './contexts/ThemeContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import LoginPage from './pages/LoginPage';

import { isTokenExpired, scheduleAutoLogout } from './utils/auth';
import { clearSession, logoutAndRedirect } from './utils/session';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const logoutTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.title = 'HR Portal | Employee Self-Service';
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Check token on mount and schedule auto-logout.
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('[APP] token present?', !!token);

    if (!token || isTokenExpired(token)) {
      console.log('[APP] token missing or expired — clearing session and logging out');
      clearSession();
      setIsLoggedIn(false);
      return;
    }

    // schedule auto logout
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    logoutTimerRef.current = scheduleAutoLogout(token, () => {
      console.log('[APP] token expired (scheduled) — clearing session and logging out');
      clearSession();
      setIsLoggedIn(false);
      // optionally show a toast here
    });

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  // Called after successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');

    const token = localStorage.getItem('token');
    if (token) {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = scheduleAutoLogout(token, () => {
        alert('Session expired. Please login again.');
        logoutAndRedirect('/login');
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    logoutAndRedirect('/login');
  };

  return (
    <SnackbarProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />
              }
            />
            <Route
              path="/*"
              element={
                isLoggedIn ? (
                  <Layout onLogout={handleLogout}>
                    <Routes>
                      <Route path="/dashboard" element={<PageContent page="dashboard" />} />
                      <Route path="/profile" element={<PageContent page="profile" />} />
                      <Route path="/leaves" element={<PageContent page="leaves" />} />
                      <Route path="/tasks" element={<PageContent page="tasks" />} />
                      <Route path="/documents" element={<PageContent page="documents" />} />
                      <Route path="/salary" element={<PageContent page="salary" />} />
                      <Route path="/kudos" element={<PageContent page="kudos" />} />
                      <Route path="/settings" element={<PageContent page="settings" />} />
                      <Route path="/hr-dashboard" element={<PageContent page="hr-dashboard" />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Layout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
