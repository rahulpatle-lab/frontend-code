import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth components
import ProtectedRoute from '../auth/ProtectedRoute';
import PublicRoute from '../auth/PublicRoute';

// Layout
import Layout from '../layout/Layout';

// Auth pages
import LoginPage from '../../pages/auth/LoginPage';
import SignupPage from '../../pages/auth/SignupPage';

// Admin pages
import AdminDashboard from '../../pages/admin/AdminDashboard';
import CustomersPage from '../../pages/admin/CustomersPage';
import SubscriptionPacksPage from '../../pages/admin/SubscriptionPacksPage';
import SubscriptionsPage from '../../pages/admin/SubscriptionsPage';

// Customer pages
import CustomerSubscriptionPage from '../../pages/customer/CustomerSubscriptionPage';
import CustomerHistoryPage from '../../pages/customer/CustomerHistoryPage';

// Error pages
const UnauthorizedPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900">403</h1>
      <p className="mt-2 text-lg text-gray-600">Unauthorized Access</p>
      <p className="mt-1 text-sm text-gray-500">
        You don't have permission to access this page.
      </p>
    </div>
  </div>
);

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-lg text-gray-600">Page Not Found</p>
      <p className="mt-1 text-sm text-gray-500">
        The page you're looking for doesn't exist.
      </p>
    </div>
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="subscription-packs" element={<SubscriptionPacksPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Customer routes */}
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute requiredRole="customer">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="subscription" element={<CustomerSubscriptionPage />} />
          <Route path="history" element={<CustomerHistoryPage />} />
          <Route path="*" element={<Navigate to="/customer/subscription" replace />} />
        </Route>

        {/* Error routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
};

export default AppRoutes;
