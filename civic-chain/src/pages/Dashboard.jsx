import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import ScoreOverview from '../components/dashboard/ScoreOverview';
import ScoreHistory from '../components/dashboard/ScoreHistory';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import RecentActivities from '../components/dashboard/RecentActivities';

const Dashboard = () => {
  return (
    <Layout>
      <div className="container py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 fw-bold">Dashboard</h2>
          
          <div className="row mb-4">
            <div className="col-md-6 mb-4">
              <ScoreOverview />
            </div>
            <div className="col-md-6 mb-4">
              <ScoreHistory />
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-4">
              <CategoryBreakdown />
            </div>
            <div className="col-md-6 mb-4">
              <RecentActivities />
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;