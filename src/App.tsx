import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import RequireAuth from './components/auth/RequireAuth';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ClassesPage from './pages/ClassesPage';
import MembersPage from './pages/MembersPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import MembershipPlansPage from './pages/MembershipPlansPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              } 
            />
            
            <Route 
              path="/classes" 
              element={
                <RequireAuth>
                  <ClassesPage />
                </RequireAuth>
              } 
            />
            
            <Route 
              path="/members" 
              element={
                <RequireAuth allowedRoles={['admin', 'instructor']}>
                  <MembersPage />
                </RequireAuth>
              } 
            />

            <Route 
              path="/memberships" 
              element={
                <RequireAuth allowedRoles={['member']}>
                  <MembershipPlansPage />
                </RequireAuth>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <RequireAuth allowedRoles={['admin']}>
                  <DashboardPage />
                </RequireAuth>
              } 
            />
            
            {/* Redirect all other paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;