import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component
 * Redirects to login page if user is not authenticated
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {boolean} [props.adminOnly=false] - Whether the route is restricted to admin users only
 * @returns {React.ReactNode} - The protected component or redirect
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If admin-only route and user is not admin, redirect to dashboard
  if (adminOnly && currentUser?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated (and is admin if required), render the protected component
  return children;
};

export default ProtectedRoute; 