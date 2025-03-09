import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h2 className="h4 fw-bold mb-3">CivicChain</h2>
            <p className="text-white-50 mb-4">
              A decentralized social credit system empowering communities through transparency and engagement.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white-50 hover-text-white">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-white-50 hover-text-white">
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h3 className="h5 fw-bold mb-3">Navigation</h3>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-white-50 text-decoration-none">Dashboard</Link></li>
              <li className="mb-2"><Link to="/community-map" className="text-white-50 text-decoration-none">Community Map</Link></li>
              <li className="mb-2"><Link to="/rewards" className="text-white-50 text-decoration-none">Rewards</Link></li>
              <li className="mb-2"><Link to="/dao" className="text-white-50 text-decoration-none">DAO</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <h3 className="h5 fw-bold mb-3">Resources</h3>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Documentation</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">FAQ</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Community Guidelines</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-top border-secondary">
          <p className="text-white-50 text-center small mb-0">
            &copy; {new Date().getFullYear()} CivicChain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;