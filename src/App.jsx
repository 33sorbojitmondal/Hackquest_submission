import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

// Styles
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Simple authentication functions
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);
  
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>CivicChain</h1>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              {isAuthenticated ? (
                <>
                  <li><a href="/dashboard">Dashboard</a></li>
                  <li><button onClick={logout}>Logout</button></li>
                </>
              ) : (
                <>
                  <li><a href="/login">Login</a></li>
                  <li><a href="/register">Register</a></li>
                </>
              )}
            </ul>
          </nav>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage onLogin={login} />} />
            <Route path="/register" element={<RegisterPage onRegister={login} />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} CivicChain. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 