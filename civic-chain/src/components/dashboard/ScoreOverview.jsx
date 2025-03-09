import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';

const ScoreOverview = () => {
  const { userData } = useUser();
  
  // Determine score color based on value
  const getScoreColor = (score) => {
    if (score >= 800) return 'text-success';
    if (score >= 700) return 'text-primary';
    if (score >= 600) return 'text-warning';
    if (score >= 500) return 'text-orange';
    return 'text-danger';
  };

  // Calculate score percentage for the circular progress
  const scorePercentage = (userData.score / 1000) * 100;
  
  return (
    <motion.div 
      className="card h-100"
      whileHover={{ y: -5 }}
    >
      <div className="card-body">
        <h5 className="card-title fw-bold mb-4">Your Civic Score</h5>
        <div className="d-flex align-items-center justify-content-between">
          <div className="position-relative" style={{ width: '120px', height: '120px' }}>
            <svg className="w-100 h-100" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e6e6e6"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={userData.score >= 700 ? "#0d6efd" : userData.score >= 500 ? "#fd7e14" : "#dc3545"}
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * scorePercentage) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <text
                x="50"
                y="50"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                className={getScoreColor(userData.score)}
              >
                {userData.score}
              </text>
              <text
                x="50"
                y="65"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="12"
                fill="#6c757d"
              >
                / 1000
              </text>
            </svg>
          </div>
          <div className="ms-4 flex-grow-1">
            <div className="mb-3">
              <p className="text-muted small mb-1">Current Tier</p>
              <p className="fw-bold">
                {userData.score >= 800 ? "Exemplary Citizen" :
                 userData.score >= 700 ? "Model Citizen" :
                 userData.score >= 600 ? "Active Citizen" :
                 userData.score >= 500 ? "Developing Citizen" :
                 "Basic Citizen"}
              </p>
            </div>
            <div>
              <p className="text-muted small mb-1">Available Points</p>
              <p className="fw-bold">{userData.points} points</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-top">
          <p className="small text-muted">
            Next tier: {userData.score >= 800 ? "You've reached the highest tier!" : 
                       userData.score >= 700 ? `${800 - userData.score} points to Exemplary Citizen` :
                       userData.score >= 600 ? `${700 - userData.score} points to Model Citizen` :
                       userData.score >= 500 ? `${600 - userData.score} points to Active Citizen` :
                       `${500 - userData.score} points to Developing Citizen`}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoreOverview;