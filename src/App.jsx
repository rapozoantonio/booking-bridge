import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';

// Custom Hooks
import useAuth from './hooks/useAuth';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PlaceEditor = lazy(() => import('./pages/PlaceEditor'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Layout component with Navbar and Footer
const MainLayout = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={currentUser} />
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Router>
      <Routes>
        {/* ProfilePage route without Navbar and Footer */}
        <Route path="/p/:profileId" element={
          <Suspense fallback={<LoadingFallback />}>
            <ProfilePage />
          </Suspense>
        } />
        
        {/* All other routes with Navbar and Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={currentUser}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/place/new" 
            element={
              <ProtectedRoute user={currentUser}>
                <PlaceEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/place/edit/:placeId" 
            element={
              <ProtectedRoute user={currentUser}>
                <PlaceEditor />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;