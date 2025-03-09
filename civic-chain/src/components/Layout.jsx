import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Layout = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!user.id;
  
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Modern Navbar */}
      <header className="bg-white shadow-sm">
        <div className="container-fluid px-4">
          <nav className="navbar navbar-expand-lg navbar-light py-2">
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <span className="fs-4 fw-bold text-primary">CivicChain</span>
            </Link>
            
            <button 
              className="navbar-toggler"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen ? "true" : "false"}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
              <ul className="navbar-nav me-auto">
                {isLoggedIn && (
                  <>
                    <li className="nav-item">
                      <NavLink to="/dashboard" active={location.pathname === '/dashboard'}>Dashboard</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/community-map" active={location.pathname === '/community-map'}>Community Map</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/rewards" active={location.pathname === '/rewards'}>Rewards</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/dao" active={location.pathname === '/dao'}>DAO</NavLink>
                    </li>
                  </>
                )}
              </ul>
              
              {isLoggedIn ? (
                <div className="d-flex align-items-center">
                  <div className="me-3 text-end">
                    <div className="fw-medium">{user.fullName || 'Alex Johnson'}</div>
                    <div className="small text-muted">Score: {user.score || 785}</div>
                  </div>
                  <div className="avatar">
                    <img 
                      src={user.avatar || 'https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff'} 
                      alt="User avatar" 
                      className="rounded-circle"
                      width="40"
                      height="40"
                    />
                  </div>
                </div>
              ) : (
                <div className="d-flex">
                  <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
                  <Link to="/register" className="btn btn-primary">Register</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow-1 py-3">
        <Outlet />
      </main>
    </div>
  );
};

const NavLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={`nav-link px-3 ${active ? 'active fw-medium' : ''}`}
  >
    {children}
  </Link>
);

export default Layout; 