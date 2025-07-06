import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const isAuth = Boolean(localStorage.getItem('access'));
  return isAuth ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        {/* Otras rutas aquí */}
      </Routes>
    </Router>
  )
}

export default App
