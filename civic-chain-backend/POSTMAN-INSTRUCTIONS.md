# CivicChain API Testing with Postman

This document provides instructions for testing the CivicChain API using Postman.

## Setup

1. Install [Postman](https://www.postman.com/downloads/) if you haven't already.
2. Import the `CivicChain.postman_collection.json` file into Postman:
   - Open Postman
   - Click on "Import" in the top left
   - Select the file or drag and drop it
   - Click "Import"

## Creating an Environment

1. Click on "Environments" in the sidebar
2. Click "+" to create a new environment
3. Name it "CivicChain Local"
4. Add the following variables:
   - `token`: Leave the value empty (this will be auto-filled when you login or register)
   - `adminToken`: Leave the value empty (you'll need to add this manually after creating an admin user)
5. Click "Save"
6. Select the environment from the dropdown in the top right

## Testing the API

### Verify API Connectivity

1. Open the "Test Routes" folder
2. Select "API Test"
3. Click "Send"
4. You should receive a 200 OK response with information about the API

### Verify User Routes

1. Select "User Routes Test"
2. Click "Send"
3. You should receive a 200 OK response confirming the user routes are working

### User Registration

1. Open the "User Management" folder
2. Select "Register User"
3. Verify that the request body contains:
   ```json
   {
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
   }
   ```
   - **Important**: Change the email to a unique value each time you register to avoid duplicate user errors
4. Click "Send"
5. You should receive a 201 Created response with a token and user details
6. The token will be automatically saved to your environment variables

### User Login

1. Select "Login User"
2. Verify that the request body contains:
   ```json
   {
       "email": "test@example.com",
       "password": "password123"
   }
   ```
   - Make sure to use the email you used during registration
3. Click "Send"
4. You should receive a 200 OK response with a token and user details
5. The token will be automatically saved to your environment variables

### Testing Protected Routes

1. Select "Get Current User"
2. Verify that the Authorization header is set to "Bearer {{token}}"
3. Click "Send"
4. You should receive a 200 OK response with your user details

### Creating an Activity

1. Open the "Activities" folder
2. Select "Create Activity"
3. Verify that the request body contains:
   ```json
   {
       "title": "Community Cleanup",
       "description": "Cleaned up the local park",
       "category": "Environmental",
       "points": 20,
       "location": "Central Park"
   }
   ```
4. Verify that the Authorization header is set to "Bearer {{token}}"
5. Click "Send"
6. You should receive a 201 Created response with the activity details

## Troubleshooting Authentication Issues

### Invalid Token Format

If you receive an error about invalid token format:
1. Check that the token is correctly set in your environment
2. Verify that the Authorization header is set to "Bearer {{token}}" (with a space after "Bearer")
3. Try logging in again to get a fresh token

### Token Not Being Saved

If the token is not being automatically saved:
1. Check that the test script is running correctly
2. Manually copy the token from the response and set it in your environment
3. Make sure you're using the correct environment

### "Not authorized to access this route" Error

If you receive this error:
1. Check that you're including the Authorization header
2. Verify that the token is valid and not expired
3. Try registering a new user and using that token
4. Check the server logs for more detailed error messages

## Running the Authentication Test Script

You can also test the authentication flow using the provided Node.js script:

1. Make sure the server is running
2. Open a terminal and navigate to the project directory
3. Run the test script:
   ```
   node auth-test.js
   ```
4. The script will:
   - Test the API connection
   - Register a new user
   - Test access to a protected route
   - Display a summary of the results

## Creating an Admin User

To create an admin user, you'll need to manually update a user in the database:

1. Register a new user through the API
2. Connect to your MongoDB database
3. Update the user's role to "admin":
   ```
   db.users.updateOne({email: "admin@example.com"}, {$set: {role: "admin"}})
   ```
4. Login with the admin user and save the token to the `adminToken` environment variable 