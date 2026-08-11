import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useSession } from './context/AuthContext';
import QueryProvider from './context/QueryProvider';
import { ToastProvider } from './context/ToastProvider';

// Pages
import DashboardPage from './pages/dashboard';
import SignInPage from './pages/signin';
import AdminCategoriesPage from './pages/admin/categories';
import AdminCoursesPage from './pages/admin/courses';
import AdminModulesPage from './pages/admin/modules';
import AdminSubmodulesPage from './pages/admin/submodules';
import AdminContentPage from './pages/admin/content';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <Navigate to="/signin" replace />;
  
  if (adminOnly && session.user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <QueryProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/signin" element={<SignInPage />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />

              <Route path="/admin/categories" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminCategoriesPage />
                </ProtectedRoute>
              } />

              <Route path="/admin/courses" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminCoursesPage />
                </ProtectedRoute>
              } />

              <Route path="/admin/modules" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminModulesPage />
                </ProtectedRoute>
              } />

              <Route path="/admin/submodules" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminSubmodulesPage />
                </ProtectedRoute>
              } />

              <Route path="/admin/content" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminContentPage />
                </ProtectedRoute>
              } />

              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </QueryProvider>
    </AuthProvider>
  );
}

export default App;
