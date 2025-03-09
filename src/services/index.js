/**
 * Services index file
 * Exports all API services for easy importing
 */

import api from './api';
import authService from './authService';
import activityService from './activityService';
import rewardService from './rewardService';
import adminService from './adminService';

export {
  api,
  authService,
  activityService,
  rewardService,
  adminService
};

// Default export for convenience
export default {
  api,
  auth: authService,
  activities: activityService,
  rewards: rewardService,
  admin: adminService
}; 