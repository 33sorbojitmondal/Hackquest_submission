# CivicChain Backend

This is the backend for the CivicChain application, built with Express.js and MongoDB.

## Features

- User authentication with JWT
- Activity tracking and verification
- Reward management and claiming
- DAO proposal system with voting
- Score calculation and management
- Future blockchain integration

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Joi for validation
- Security features (CORS, Helmet, Rate Limiting)

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user details
- `GET /api/users/score` - Get user score
- `GET /api/users/activities` - Get user activities
- `GET /api/users/rewards` - Get user rewards

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get single activity
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `PUT /api/activities/:id/verify` - Verify activity (admin only)

### Rewards
- `GET /api/rewards` - Get all rewards
- `GET /api/rewards/:id` - Get single reward
- `POST /api/rewards` - Create new reward (admin only)
- `PUT /api/rewards/:id` - Update reward (admin only)
- `DELETE /api/rewards/:id` - Delete reward (admin only)
- `POST /api/rewards/:id/claim` - Claim reward

### Proposals
- `GET /api/proposals` - Get all proposals
- `GET /api/proposals/:id` - Get single proposal
- `POST /api/proposals` - Create new proposal
- `PUT /api/proposals/:id` - Update proposal
- `DELETE /api/proposals/:id` - Delete proposal
- `POST /api/proposals/:id/vote` - Vote on proposal

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/civic-chain
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=30d
   NODE_ENV=development
   BLOCKCHAIN_ENABLED=false
   ```
4. Run the server: `npm run dev`

## Future Blockchain Integration

The backend is designed with future blockchain integration in mind. Key features include:

- Transaction recording placeholders
- Blockchain hash storage in models
- Wallet address support for users
- Token ID support for rewards
- Proposal voting with blockchain verification

## License

MIT 