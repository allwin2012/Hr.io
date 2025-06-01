// src/App.js
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Layout from './components/dashboard/Layout';
import PageContent from './components/dashboard/PageContent';
import { ThemeProvider } from './contexts/ThemeContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import LoginPage from './pages/LoginPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

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

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <SnackbarProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={
              isLoggedIn
                ? <Navigate to="/dashboard" replace />
                : <LoginPage onLogin={handleLogin} />
            } />
            <Route path="/*" element={
              isLoggedIn
                ? (
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
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Layout>
                )
                : <Navigate to="/login" replace />
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
