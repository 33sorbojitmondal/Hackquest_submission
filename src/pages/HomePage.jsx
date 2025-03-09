import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to CivicChain</h1>
        <p>Empowering communities through blockchain technology</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </section>
      
      <section className="features">
        <h2>How It Works</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Participate</h3>
            <p>Engage in community activities and civic initiatives</p>
          </div>
          <div className="feature-card">
            <h3>Earn</h3>
            <p>Collect points for your participation and contributions</p>
          </div>
          <div className="feature-card">
            <h3>Redeem</h3>
            <p>Use your points to claim rewards from local businesses</p>
          </div>
          <div className="feature-card">
            <h3>Govern</h3>
            <p>Vote on community proposals and help shape your neighborhood</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 