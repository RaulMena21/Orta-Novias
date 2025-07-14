import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
// import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './hooks/useAuth';
import { AnalyticsProvider } from './components/AnalyticsProvider';
import Navbar from './components/Navbar';
//import ProtectedRoute from './components/ProtectedRoute';
//import ScrollToTop from './components/ScrollToTop';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import DressesPage from './pages/DressesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import NotificationsPage from './pages/NotificationsPage';
//import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  useEffect(() => {
  }, []);

  return (
    // <HelmetProvider>
      <AnalyticsProvider>
        <AuthProvider>
          {/* <ScrollToTop /> */}
          <Navbar />
          <div className="max-w-8xl mx-auto px-4 py-6 pt-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* <Route path="/auth" element={<AuthPage />} /> */}
              <Route path="/dashboard" element={
               // <ProtectedRoute>
                  <Dashboard />
                //</ProtectedRoute>
              } />
              <Route path="/dresses" element={<DressesPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/notifications" element={
               // <ProtectedRoute>
                  <NotificationsPage />
                //</ProtectedRoute>
              } />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </AuthProvider>
      </AnalyticsProvider>
    // </HelmetProvider>
  );
}

export default App;
