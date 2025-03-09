// Simple test script to verify authentication flow
const axios = require('axios');

const API_URL = 'http://localhost:5002/api';
let authToken = null;

// Test the API connection
async function testApiConnection() {
  try {
    console.log('Testing API connection...');
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

// Test user registration
async function testRegistration() {
  try {
    console.log('\nTesting user registration...');
    
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

// Test protected route access
async function testProtectedRoute() {
  try {
    console.log('\nTesting protected route access...');
    
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
    
    console.log('Protected route access successful!');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    return true;
  } catch (error) {
    console.error('Protected route access failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('Starting authentication flow tests...');
  
  // Test API connection
  const apiConnected = await testApiConnection();
  if (!apiConnected) {
    console.error('Cannot proceed with tests due to API connection failure');
    return;
  }
  
  // Test registration
  const registrationSuccessful = await testRegistration();
  if (!registrationSuccessful) {
    console.error('Cannot proceed with tests due to registration failure');
    return;
  }
  
  // Test protected route
  const protectedRouteAccessSuccessful = await testProtectedRoute();
  if (!protectedRouteAccessSuccessful) {
    console.error('Protected route access test failed');
  }
  
  console.log('\nTest summary:');
  console.log('- API connection:', apiConnected ? 'SUCCESS' : 'FAILED');
  console.log('- User registration:', registrationSuccessful ? 'SUCCESS' : 'FAILED');
  console.log('- Protected route access:', protectedRouteAccessSuccessful ? 'SUCCESS' : 'FAILED');
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error during tests:', error);
}); 