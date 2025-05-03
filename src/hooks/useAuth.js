import { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

/**
 * Custom hook for handling Firebase authentication state with performance optimizations
 */
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup auth listener with cleanup
  useEffect(() => {
    // Don't recreate the unsubscribe function on every render
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state changed error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Memoize the auth object to prevent unnecessary re-renders
  const value = useMemo(() => ({
    currentUser,
    loading,
    error,
    isAuthenticated: !!currentUser
  }), [currentUser, loading, error]);

  return value;
};

export default useAuth;