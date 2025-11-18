/**
 * App.jsx
 * Main application component with routing and state management
 */

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import { SplashScreen } from "./components/templates/SplashScreen";
import { LoginTemplate } from "./components/templates/LoginTemplate";
import { DashboardPage } from "./pages/DashboardPage";
import { DocumentPage } from "./pages/DocumentPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NotFound } from "./pages/NotFound";
import { ProcessingOverlay } from "./components/common/ProcessingOverlay";
import { ToastProvider, useToast } from "./contexts/ToastContext";
import { AlertProvider, useAlert } from "./contexts/AlertContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function AppContent() {
  const [showSplash, setShowSplash] = useState(false);
  const [user, setUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const alert = useAlert();

  const handleSplashComplete = () => {
    setShowSplash(false);
    navigate('/dashboard');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('bdoc_user', JSON.stringify(userData));
    setShowSplash(true); // Show splash screen after successful login
  };

  const handleLogout = async () => {
    const confirmed = await alert.showAlert({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      type: 'warning',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      showCancel: true
    });

    if (confirmed) {
      setUser(null);
      localStorage.removeItem('bdoc_user');
      navigate('/login');
      toast.showToast('Logged out successfully', 'info');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleUpload = () => {
    // Trigger file picker
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.png,.jpg,.jpeg';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setIsProcessing(true);
        toast.showToast('Processing document...', 'info', 2000);
      }
    };
    input.click();
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    navigate('/documents');
    toast.showToast('Document processed successfully!', 'success');
  };

  const handleDownload = () => {
    toast.showToast('Download started', 'success');
  };

  const handleSearch = () => {
    toast.showToast('Search feature coming soon', 'info');
  };

  const handleUndo = () => {
    toast.showToast('Undo action', 'info');
  };

  const handleRedo = () => {
    toast.showToast('Redo action', 'info');
  };

  // Get active page from current route
  const getActivePage = () => {
    const path = window.location.pathname;
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('documents')) return 'documents';
    if (path.includes('settings')) return 'settings';
    return 'dashboard';
  };

  // Show splash screen after login
  if (showSplash && user) {
    return (
      <AuthLayout>
        <SplashScreen onComplete={handleSplashComplete} />
      </AuthLayout>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthLayout>
                <LoginTemplate onLoginSuccess={handleLoginSuccess} />
              </AuthLayout>
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <MainLayout
                user={user}
                activePage={getActivePage()}
                onNavigate={handleNavigation}
                onLogout={handleLogout}
                onDownload={handleDownload}
                onUpload={handleUpload}
                onSearch={handleSearch}
                onUndo={handleUndo}
                onRedo={handleRedo}
              >
                <DashboardPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/documents"
          element={
            user ? (
              <MainLayout
                user={user}
                activePage={getActivePage()}
                onNavigate={handleNavigation}
                onLogout={handleLogout}
                onDownload={handleDownload}
                onUpload={handleUpload}
                onSearch={handleSearch}
                onUndo={handleUndo}
                onRedo={handleRedo}
              >
                <DocumentPage onUpload={handleUpload} />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/settings"
          element={
            user ? (
              <MainLayout
                user={user}
                activePage={getActivePage()}
                onNavigate={handleNavigation}
                onLogout={handleLogout}
                onDownload={handleDownload}
                onUpload={handleUpload}
                onSearch={handleSearch}
                onUndo={handleUndo}
                onRedo={handleRedo}
              >
                <SettingsPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default & 404 */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Processing Overlay */}
      <ProcessingOverlay isVisible={isProcessing} onComplete={handleProcessingComplete} />
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AlertProvider>
            <AppContent />
          </AlertProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
