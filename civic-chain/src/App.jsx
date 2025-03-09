import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';

// Pages
import Dashboard from './pages/Dashboard';
import CommunityMapPage from './pages/CommunityMapPage';
import RewardsPage from './pages/RewardsPage';
import DAOPage from './pages/DAOPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ActivityFormPage from './pages/ActivityFormPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import RewardDetailPage from './pages/RewardDetailPage';
import ProposalFormPage from './pages/ProposalFormPage';
import ProposalDetailPage from './pages/ProposalDetailPage';
import ProfilePage from './pages/ProfilePage';
import UBIPage from './pages/UBIPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, isAuthenticated } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAuthenticated } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (currentUser?.role !== 'admin') {
    // Redirect to dashboard if not an admin
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated, currentUser, logout } = useUser();
  
  return (
    <div className="app-container">
      <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold text-primary">
            CivicChain
          </Link>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/activities" className="nav-link">Community Map</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/rewards" className="nav-link">Rewards</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/proposals" className="nav-link">DAO</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/ubi" className="nav-link">UBI</Link>
                  </li>
                </>
              )}
            </ul>
            
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <>
                  {currentUser?.role === 'admin' && (
                    <li className="nav-item">
                      <Link to="/admin" className="nav-link text-danger">Admin</Link>
                    </li>
                  )}
                  
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <div className="me-2 text-end">
                        <div className="fw-medium">{currentUser?.fullName || 'Alex Johnson'}</div>
                        <div className="small text-muted">Score: {currentUser?.score || 785}</div>
                      </div>
                      <div className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        {currentUser?.avatar ? (
                          <img src={currentUser.avatar} alt="Avatar" className="rounded-circle" width="40" height="40" />
                        ) : (
                          <span>{(currentUser?.fullName || 'A')[0]}</span>
                        )}
                      </div>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li><Link to="/profile" className="dropdown-item">Profile</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button onClick={logout} className="dropdown-item text-danger">Logout</button></li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </header>
      
      <main className="app-main py-4">
        <div className="container">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            
            {/* Activity routes */}
            <Route path="/activities" element={<ProtectedRoute><CommunityMapPage /></ProtectedRoute>} />
            <Route path="/activities/new" element={<ProtectedRoute><ActivityFormPage /></ProtectedRoute>} />
            <Route path="/activities/:id" element={<ProtectedRoute><ActivityDetailPage /></ProtectedRoute>} />
            <Route path="/activities/:id/edit" element={<ProtectedRoute><ActivityFormPage /></ProtectedRoute>} />
            
            {/* Reward routes */}
            <Route path="/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
            <Route path="/rewards/:id" element={<ProtectedRoute><RewardDetailPage /></ProtectedRoute>} />
            
            {/* Proposal routes */}
            <Route path="/proposals" element={<ProtectedRoute><DAOPage /></ProtectedRoute>} />
            <Route path="/proposals/new" element={<ProtectedRoute><ProposalFormPage /></ProtectedRoute>} />
            <Route path="/proposals/:id" element={<ProtectedRoute><ProposalDetailPage /></ProtectedRoute>} />
            <Route path="/proposals/:id/edit" element={<ProtectedRoute><ProposalFormPage /></ProtectedRoute>} />
            
            {/* UBI routes */}
            <Route path="/ubi" element={<ProtectedRoute><UBIPage /></ProtectedRoute>} />
            
            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminRoute><Dashboard /></AdminRoute>} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>
      
      <footer className="app-footer mt-auto">
        <div className="container">
          <div className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} CivicChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;