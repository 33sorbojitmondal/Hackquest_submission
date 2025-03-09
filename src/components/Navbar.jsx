import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar component for the main application
 * Shows different navigation options based on authentication status
 */
const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and brand */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold">CivicChain</Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-primary-200">Home</Link>
            <Link to="/about" className="hover:text-primary-200">About</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-primary-200">Dashboard</Link>
                <Link to="/activities" className="hover:text-primary-200">Activities</Link>
                <Link to="/rewards" className="hover:text-primary-200">Rewards</Link>
                <Link to="/proposals" className="hover:text-primary-200">Proposals</Link>
              </>
            ) : null}
          </div>
          
          {/* Authentication buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {currentUser?.role === 'admin' && (
                  <Link to="/admin" className="text-yellow-300 hover:text-yellow-100">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="hover:text-primary-200">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-transparent hover:bg-primary-700 text-white px-4 py-2 rounded border border-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white hover:bg-gray-100 text-primary-600 px-4 py-2 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-500">
            <Link to="/" className="block py-2 hover:text-primary-200">Home</Link>
            <Link to="/about" className="block py-2 hover:text-primary-200">About</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block py-2 hover:text-primary-200">Dashboard</Link>
                <Link to="/activities" className="block py-2 hover:text-primary-200">Activities</Link>
                <Link to="/rewards" className="block py-2 hover:text-primary-200">Rewards</Link>
                <Link to="/proposals" className="block py-2 hover:text-primary-200">Proposals</Link>
                <Link to="/profile" className="block py-2 hover:text-primary-200">Profile</Link>
                {currentUser?.role === 'admin' && (
                  <Link to="/admin" className="block py-2 text-yellow-300 hover:text-yellow-100">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-300 hover:text-red-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-primary-200">Login</Link>
                <Link to="/register" className="block py-2 hover:text-primary-200">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 