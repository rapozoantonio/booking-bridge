import React, { memo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Link as LinkIcon } from 'lucide-react';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/' && !user;

  // Optimized logout handler with useCallback
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }, [navigate]);

  return (
    <nav className={`${isLandingPage ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} text-gray-900 shadow-md sticky top-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className={`flex items-center space-x-2 text-xl font-bold ${isLandingPage ? 'text-gray-900' : 'text-white'} hover:opacity-80 transition-opacity`}>
              <div className={`p-2 ${isLandingPage ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-white'} rounded-lg`}>
                <LinkIcon className={`w-5 h-5 ${isLandingPage ? 'text-white' : 'text-indigo-600'}`} />
              </div>
              <span>Booking Bridge</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-block text-white hover:text-indigo-100 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/place/new"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all font-medium shadow-sm hover:shadow-md"
                >
                  <span className="hidden sm:inline">+ Add Place</span>
                  <span className="sm:hidden">+ Add</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-indigo-100 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${isLandingPage ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-indigo-100'} transition-colors font-medium px-4 py-2`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`${isLandingPage
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-white text-indigo-600'} px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium shadow-sm transform hover:scale-105`}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Memoize the component to avoid unnecessary re-renders
export default memo(Navbar);