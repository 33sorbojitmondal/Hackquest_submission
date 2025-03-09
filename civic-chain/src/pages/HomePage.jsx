import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const HomePage = () => {
  const { isAuthenticated } = useUser();

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8">
          <h1 className="display-4 fw-bold mb-3">Welcome to CivicChain</h1>
          <p className="lead mb-4">Empowering communities through blockchain technology</p>
          <div className="d-flex justify-content-center gap-3">
            {!isAuthenticated && (
              <>
                <Link to="/register" className="btn btn-primary btn-lg px-4 py-2">Get Started</Link>
                <Link to="/login" className="btn btn-outline-secondary btn-lg px-4 py-2">Login</Link>
              </>
            )}
            {isAuthenticated && (
              <Link to="/dashboard" className="btn btn-primary btn-lg px-4 py-2">Go to Dashboard</Link>
            )}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8">
          <h2 className="fw-bold mb-4">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                    <i className="bi bi-people-fill text-primary fs-4"></i>
                  </div>
                  <h3 className="h5 fw-bold">Participate</h3>
                  <p className="text-muted">Engage in community activities and civic initiatives</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="rounded-circle bg-success bg-opacity-10 p-3 d-inline-flex mb-3">
                    <i className="bi bi-trophy-fill text-success fs-4"></i>
                  </div>
                  <h3 className="h5 fw-bold">Earn</h3>
                  <p className="text-muted">Collect points for your participation and contributions</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="rounded-circle bg-info bg-opacity-10 p-3 d-inline-flex mb-3">
                    <i className="bi bi-gift-fill text-info fs-4"></i>
                  </div>
                  <h3 className="h5 fw-bold">Redeem</h3>
                  <p className="text-muted">Use your points to claim rewards from local businesses</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="rounded-circle bg-warning bg-opacity-10 p-3 d-inline-flex mb-3">
                    <i className="bi bi-building-fill text-warning fs-4"></i>
                  </div>
                  <h3 className="h5 fw-bold">Govern</h3>
                  <p className="text-muted">Vote on community proposals and help shape your neighborhood</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
