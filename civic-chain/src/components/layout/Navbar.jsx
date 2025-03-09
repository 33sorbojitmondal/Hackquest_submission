import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

const Navbar = () => {
  const { userData } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Community Map', path: '/community-map' },
    { name: 'Rewards', path: '/rewards' },
    { name: 'DAO', path: '/dao' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold text-primary">
          CivicChain
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="d-flex align-items-center">
            <div className="d-flex flex-column align-items-end me-3">
              <span className="small fw-medium">{userData.name}</span>
              <span className="small text-muted">Score: {userData.score}</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
            >
              <img
                src={userData.avatar}
                alt={userData.name}
                className="rounded-circle"
                width="32"
                height="32"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;