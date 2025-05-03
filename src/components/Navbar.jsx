import React, { memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  // Optimized logout handler with useCallback
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }, [navigate]);

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">Booking Bridge Link</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <Link to="/place/new" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100">+ Add Place</Link>
              <button 
                onClick={handleLogout}
                className="text-white hover:text-blue-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Memoize the component to avoid unnecessary re-renders
export default memo(Navbar);