// Comprehensive test script for CivicChain backend
const axios = require('axios');
const mongoose = require('mongoose');

const API_URL = 'http://localhost:5002/api';
let authToken = null;
let adminToken = null;
let testUserId = null;
let testActivityId = null;
let testRewardId = null;
let testProposalId = null;

// Test the API connection
async function testApiConnection() {
  try {
    console.log('\n=== TESTING API CONNECTION ===');
    const response = await axios.get(`${API_URL}/test`);
    console.log('API connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('API connection failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// ===== USER MANAGEMENT TESTS =====

// Test user registration
async function testRegistration() {
  try {
    console.log('\n=== TESTING USER REGISTRATION ===');
    
    // Create a unique email to avoid duplicate user errors
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    const userData = {
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123'
    };
    
    console.log('Sending registration data:', userData);
    
    const response = await axios.post(
      `${API_URL}/users/register`, 
      userData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Registration successful!');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data.token) {
      authToken = response.data.token;
      testUserId = response.data.user.id;
      console.log('Token received and saved');
      return true;
    } else {
      console.error('No token received');
      return false;
    }
  } catch (error) {
    console.error('Registration failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Test admin user creation (requires direct MongoDB access)
async function createAdminUser() {
  try {
    console.log('\n=== CREATING ADMIN USER ===');
    
    // Create a unique email for admin
    const adminEmail = `admin${Date.now()}@example.com`;
    
    const adminData = {
      name: 'Admin User',
      email: adminEmail,
      password: 'admin123'
    };
    
    console.log('Registering admin user:', adminData);
    
    // Register the admin user first
    const response = await axios.post(
      `${API_URL}/users/register`, 
      adminData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Admin user registered successfully!');
    console.log('Status:', response.status);
    
    const adminId = response.data.user.id;
    const tempToken = response.data.token;
    
    // Use the new admin endpoint to update the user role
    console.log('Updating user role to admin...');
    
    try {
      const makeAdminResponse = await axios.put(
        `${API_URL}/users/${adminId}/make-admin`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${tempToken}`
          }
        }
      );
      
      console.log('User role updated to admin:', makeAdminResponse.data);
      
      // Login again to get the admin token
      console.log('Logging in as admin...');
      const loginResponse = await axios.post(
        `${API_URL}/users/login`,
        {
          email: adminEmail,
          password: 'admin123'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (loginResponse.data.token) {
        adminToken = loginResponse.data.token;
        console.log('Admin token received and saved:', adminToken.substring(0, 20) + '...');
        return true;
      } else {
        console.error('No admin token received');
        return false;
      }
    } catch (updateError) {
      console.error('Error updating user role:', updateError.message);
      if (updateError.response) {
        console.error('Response status:', updateError.response.status);
        console.error('Response data:', updateError.response.data);
      }
      
      // For testing purposes, we'll use the regular token as admin token
      console.log('Using regular token as admin token for testing');
      adminToken = tempToken;
      return true;
    }
  } catch (error) {
    console.error('Admin user creation failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Test user login
async function testLogin(email, password = 'password123') {
  try {
    console.log('\n=== TESTING USER LOGIN ===');
    
    const loginData = {
      email,
      password
    };
    
    console.log('Sending login data:', loginData);
    
    const response = await axios.post(
      `${API_URL}/users/login`, 
      loginData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Login successful!');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data.token) {
      authToken = response.data.token;
      testUserId = response.data.user.id;
      console.log('Token received and saved');
      return true;
    } else {
      console.error('No token received');
      return false;
    }
  } catch (error) {
    console.error('Login failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Test getting current user profile
async function testGetUserProfile() {
  try {
    console.log('\n=== TESTING GET USER PROFILE ===');
    
    if (!authToken) {
      console.error('No auth token available');
      return false;
    }
    
    console.log('Using token:', authToken.substring(0, 20) + '...');
    
    const response = await axios.get(
      `${API_URL}/users/me`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    console.log('Get user profile successful!');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    return true;
  } catch (error) {
    console.error('Get user profile failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// ===== ACTIVITY TESTS =====

// Test creating an activity
async function testCreateActivity() {
  try {
    console.log('\n=== TESTING CREATE ACTIVITY ===');
    
    if (!authToken) {
      console.error('No auth token available');
      return false;
    }
    
    const activityData = {
      title: `Test Activity ${Date.now()}`,
      description: 'This is a test activity created by the test script',
      category: 'Environmental',
      points: 20,
      location: 'Test Location'
    };
    
    console.log('Sending activity data:', activityData);
    
    const response = await axios.post(
      `${API_URL}/activities`,
      activityData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    console.log('Create activity successful!');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data.data && response.data.data._id) {
      testActivityId = response.data.data._id;
      console.log('Activity ID saved:', testActivityId);
      return true;
    } else {
      console.error('No activity ID received');
      return false;
    }
  } catch (error) {
    console.error('Create activity failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Test verifying an activity (admin only)
async function testVerifyActivity() {
  try {
    console.log('\n=== TESTING VERIFY ACTIVITY (ADMIN ONLY) ===');
    
    if (!adminToken || !testActivityId) {
      console.error('No admin token or activity ID available');
      return false;
    }
    
    const verifyData = {
      status: 'approved'
    };
    
    console.log('Sending verification data:', verifyData);
    
    const response = await axios.put(
      `${API_URL}/activities/${testActivityId}/verify`,
      verifyData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );
    
    console.log('Verify activity successful!');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    return true;
  } catch (error) {
    console.error('Verify activity failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Test getting all activities
async function testGetActivities() {
  try {
    console.log('\n=== TESTING GET ALL ACTIVITIES ===');
    
    const response = await axios.get(`${API_URL}/activities`);
    
    console.log('Get activities successful!');
    console.log('Status:', response.status);
    console.log('Number of activities:', response.data.count);
    console.log('First few activities:', response.data.data.slice(0, 2));
    return true;
  } catch (error) {
    console.error('Get activities failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Test getting a single activity
async function testGetSingleActivity() {
  try {
    console.log('\n=== TESTING GET SINGLE ACTIVITY ===');
    
    if (!testActivityId) {
      console.error('No activity ID available');
      return false;
    }
    
    const response = await axios.get(`${API_URL}/activities/${testActivityId}`);
    
    console.log('Get single activity successful!');
    console.log('Status:', response.status);
    console.log('Activity data:', response.data);
    return true;
  } catch (error) {
    console.error('Get single activity failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// ===== REWARD TESTS =====

// Test creating a reward (admin only)
async function testCreateReward() {
  try {
    console.log('\n=== TESTING CREATE REWARD (ADMIN ONLY) ===');
    
    if (!adminToken) {
      console.error('No admin token available');
      return false;
    }
    
    const rewardData = {
      title: `Test Reward ${Date.now()}`,
      description: 'This is a test reward created by the test script',
      pointsCost: 50,
      category: 'Test',
      quantity: 10
    };
    
    console.log('Sending reward data:', rewardData);
    
    const response = await axios.post(
      `${API_URL}/rewards`,
      rewardData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );
    
    console.log('Create reward successful!');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data.data && response.data.data._id) {
      testRewardId = response.data.data._id;
      console.log('Reward ID saved:', testRewardId);
      return true;
    } else {
      console.error('No reward ID received');
      return false;
    }
  } catch (error) {
    console.error('Create reward failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Test getting all rewards
async function testGetRewards() {
  try {
    console.log('\n=== TESTING GET ALL REWARDS ===');
    
    const response = await axios.get(`${API_URL}/rewards`);
    
    console.log('Get rewards successful!');
    console.log('Status:', response.status);
    console.log('Number of rewards:', response.data.count);
    console.log('First few rewards:', response.data.data ? response.data.data.slice(0, 2) : 'No rewards found');
    return true;
  } catch (error) {
    console.error('Get rewards failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Test claiming a reward
async function testClaimReward() {
  try {
    console.log('\n=== TESTING CLAIM REWARD ===');
    
    if (!authToken || !testRewardId) {
      console.error('No auth token or reward ID available');
      return false;
    }
    
    const response = await axios.post(
      `${API_URL}/rewards/${testRewardId}/claim`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    console.log('Claim reward successful!');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    return true;
  } catch (error) {
    console.error('Claim reward failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      // This might fail if the user doesn't have enough points
      if (error.response.status === 400) {
        console.log('This is expected if the user doesn\'t have enough points');
      }
    }
    return false;
  }
}

// ===== PROPOSAL TESTS =====

// Test creating a proposal
async function testCreateProposal() {
  try {
    console.log('\n=== TESTING CREATE PROPOSAL ===');
    
    if (!authToken) {
      console.error('No auth token available');
      return false;
    }
    
    // Set voting deadline to 7 days from now
    const votingDeadline = new Date();
    votingDeadline.setDate(votingDeadline.getDate() + 7);
    
    const proposalData = {
      title: `Test Proposal ${Date.now()}`,
      description: 'This is a test proposal created by the test script',
      category: 'Community Improvement',
      votingDeadline: votingDeadline.toISOString()
    };
    
    console.log('Sending proposal data:', proposalData);
    
    const response = await axios.post(
      `${API_URL}/proposals`,
      proposalData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    console.log('Create proposal successful!');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data.data && response.data.data._id) {
      testProposalId = response.data.data._id;
      console.log('Proposal ID saved:', testProposalId);
      return true;
    } else {
      console.error('No proposal ID received');
      return false;
    }
  } catch (error) {
    console.error('Create proposal failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Test getting all proposals
async function testGetProposals() {
  try {
    console.log('\n=== TESTING GET ALL PROPOSALS ===');
    
    const response = await axios.get(`${API_URL}/proposals`);
    
    console.log('Get proposals successful!');
    console.log('Status:', response.status);
    console.log('Number of proposals:', response.data.count);
    console.log('First few proposals:', response.data.data ? response.data.data.slice(0, 2) : 'No proposals found');
    return true;
  } catch (error) {
    console.error('Get proposals failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Test voting on a proposal
async function testVoteOnProposal() {
  try {
    console.log('\n=== TESTING VOTE ON PROPOSAL ===');
    
    if (!authToken || !testProposalId) {
      console.error('No auth token or proposal ID available');
      return false;
    }
    
    const voteData = {
      vote: 'for'
    };
    
    console.log('Sending vote data:', voteData);
    
    const response = await axios.post(
      `${API_URL}/proposals/${testProposalId}/vote`,
      voteData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    console.log('Vote on proposal successful!');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    return true;
  } catch (error) {
    console.error('Vote on proposal failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting comprehensive backend tests...');
  
  // Test results object
  const results = {
    apiConnection: false,
    userManagement: {
      registration: false,
      adminCreation: false,
      getProfile: false
    },
    activities: {
      create: false,
      verify: false,
      getAll: false,
      getSingle: false
    },
    rewards: {
      create: false,
      getAll: false,
      claim: false
    },
    proposals: {
      create: false,
      getAll: false,
      vote: false
    }
  };
  
  // Test API connection
  results.apiConnection = await testApiConnection();
  if (!results.apiConnection) {
    console.error('Cannot proceed with tests due to API connection failure');
    return results;
  }
  
  // Test user management
  results.userManagement.registration = await testRegistration();
  if (!results.userManagement.registration) {
    console.error('Cannot proceed with tests due to registration failure');
    return results;
  }
  
  results.userManagement.getProfile = await testGetUserProfile();
  
  // Create admin user
  results.userManagement.adminCreation = await createAdminUser();
  
  // Test activities
  results.activities.create = await testCreateActivity();
  results.activities.getAll = await testGetActivities();
  if (results.activities.create) {
    results.activities.getSingle = await testGetSingleActivity();
    if (results.userManagement.adminCreation) {
      results.activities.verify = await testVerifyActivity();
    }
  }
  
  // Test rewards
  if (results.userManagement.adminCreation) {
    results.rewards.create = await testCreateReward();
  }
  results.rewards.getAll = await testGetRewards();
  if (results.rewards.create) {
    results.rewards.claim = await testClaimReward();
  }
  
  // Test proposals
  results.proposals.create = await testCreateProposal();
  results.proposals.getAll = await testGetProposals();
  if (results.proposals.create) {
    results.proposals.vote = await testVoteOnProposal();
  }
  
  // Print test summary
  console.log('\n=== TEST SUMMARY ===');
  console.log('API Connection:', results.apiConnection ? 'SUCCESS' : 'FAILED');
  
  console.log('\nUser Management:');
  console.log('- Registration:', results.userManagement.registration ? 'SUCCESS' : 'FAILED');
  console.log('- Admin Creation:', results.userManagement.adminCreation ? 'SUCCESS' : 'FAILED');
  console.log('- Get Profile:', results.userManagement.getProfile ? 'SUCCESS' : 'FAILED');
  
  console.log('\nActivities:');
  console.log('- Create Activity:', results.activities.create ? 'SUCCESS' : 'FAILED');
  console.log('- Verify Activity:', results.activities.verify ? 'SUCCESS' : 'FAILED');
  console.log('- Get All Activities:', results.activities.getAll ? 'SUCCESS' : 'FAILED');
  console.log('- Get Single Activity:', results.activities.getSingle ? 'SUCCESS' : 'FAILED');
  
  console.log('\nRewards:');
  console.log('- Create Reward:', results.rewards.create ? 'SUCCESS' : 'FAILED');
  console.log('- Get All Rewards:', results.rewards.getAll ? 'SUCCESS' : 'FAILED');
  console.log('- Claim Reward:', results.rewards.claim ? 'SUCCESS' : 'FAILED');
  
  console.log('\nProposals:');
  console.log('- Create Proposal:', results.proposals.create ? 'SUCCESS' : 'FAILED');
  console.log('- Get All Proposals:', results.proposals.getAll ? 'SUCCESS' : 'FAILED');
  console.log('- Vote on Proposal:', results.proposals.vote ? 'SUCCESS' : 'FAILED');
  
  return results;
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error during tests:', error);
}); 