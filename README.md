# CivicChain

CivicChain is a blockchain-powered platform that incentivizes civic engagement through a tokenized UBI (Universal Basic Income) system. It integrates a Node.js backend with a React frontend (styled with Bootstrap) and seamless MetaMask connectivity.

## Features

- **Blockchain Integration:** Connect with MetaMask for secure transactions.
- **Real-Time Dashboard:** Dynamic charts and data visualizations of civic engagement.
- **Rewards Marketplace:** Redeem and manage CUBI tokens as rewards.
- **Secure Authentication:** Robust login, registration, and profile management.
- **RESTful APIs:** Node.js backend routes for activities, dashboards, and community data.

## How to Use

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/CivicChain.git
   ```

2. **Install Backend Dependencies:**

   Navigate to the backend folder and run:

   ```bash
   cd CivicChain/civic-chain-backend
   npm install
   ```

3. **Install Frontend Dependencies:**

   Navigate to the frontend folder and run:

   ```bash
   cd ../civic-chain
   npm install
   ```

### Running the Application

- **Start the Backend Server:**

  From the backend directory:

  ```bash
  npm run dev
  ```

- **Start the Frontend Server:**

  From the frontend directory:

  ```bash
  npm start
  ```

Access the application in your browser (e.g., http://localhost:3000).

## Dependencies

- **Backend:** Node.js, Express, and related NPM packages for RESTful APIs.
- **Frontend:** React, Bootstrap, react-router-dom, react-chartjs-2, chart.js, etc.
- **Blockchain Integration:** MetaMask for wallet connectivity and blockchain transactions.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

- **civic-chain-backend/**: Node.js server with RESTful routes for dashboard statistics, activities, and more.
- **civic-chain/**: React frontend application integrating Bootstrap and blockchain functionalities.
- **services/web3Service.js**: Handles MetaMask connection, blockchain interactions, and UBI claims.
- **pages/**: Contains key React components such as DashboardPage.jsx, UBIPage.jsx, and other pages.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for bugs, features, or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details. 