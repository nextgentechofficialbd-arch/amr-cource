'use client';

import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { db } from './services/dbService';
import { Student, UserRole } from './types';

// Pages
import Home from './pages/Home';
import ProgramDetail from './pages/ProgramDetail';
import Login from './pages/Login';
import Dashboard from './pages/StudentDashboard';
import CoursePlayer from './pages/CoursePlayer';
import AdminDashboard from './pages/AdminDashboard';
import AdminPrograms from './pages/AdminPrograms';
import AdminPayments from './pages/AdminPayments';
import AdminVideos from './pages/AdminVideos';
import AdminStudents from './pages/AdminStudents';
import AdminPromoCodes from './pages/AdminPromoCodes';

// Route Tracker Component to log IP "middleware" style
const RouteTracker = () => {
  const location = useLocation();
  useEffect(() => {
    db.logIpAction(`NAVIGATE: ${location.pathname}`);
  }, [location]);
  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: UserRole }> = ({ children, role }) => {
  const user = db.getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<Student | null>(null);

  useEffect(() => {
    setUser(db.getCurrentUser());
    const checkUser = () => setUser(db.getCurrentUser());
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  return (
    <HashRouter>
      <RouteTracker />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/programs/:slug" element={<ProgramDetail />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />

        {/* Student Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute role={UserRole.STUDENT}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/course/:slug" 
          element={
            <ProtectedRoute role={UserRole.STUDENT}>
              <CoursePlayer />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute role={UserRole.ADMIN}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/programs" 
          element={
            <ProtectedRoute role={UserRole.ADMIN}>
              <AdminPrograms />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/payments" 
          element={
            <ProtectedRoute role={UserRole.ADMIN}>
              <AdminPayments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/videos/:id" 
          element={
            <ProtectedRoute role={UserRole.ADMIN}>
              <AdminVideos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/students" 
          element={
            <ProtectedRoute role={UserRole.ADMIN}>
              <AdminStudents />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/promocodes" 
          element={
            <ProtectedRoute role={UserRole.ADMIN}>
              <AdminPromoCodes />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;