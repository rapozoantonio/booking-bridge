import React from 'react';
import { Navigate } from 'react-router-dom';

// Simplified ProtectedRoute component using functional pattern
const ProtectedRoute = ({ user, children }) => {
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;