import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import DressesPage from './pages/DressesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import NotFoundPage from './pages/NotFoundPage';


function PrivateRoute({ children }: { children: React.ReactElement }) {
  const isAuth = Boolean(localStorage.getItem('access'));
  return isAuth ? children : <Navigate to="/login" />;
}



function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <div className="max-w-8xl mx-auto px-4 py-6 pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/dresses" element={<DressesPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
