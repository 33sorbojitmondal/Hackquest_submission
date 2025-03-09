# CUBI Token Smart Contract

This directory contains the smart contract for the CUBI token, which is used for the Universal Basic Income (UBI) feature in the CivicChain application.

## Contract Overview

The CUBI token is an ERC-20 token with additional functionality for UBI distribution. Key features include:

- Credit score-based UBI distribution
- Time-locked claims (once per 24 hours)
- Civic score tracking
- Total supply cap of 100 million tokens
- Owner-controlled distribution parameters

## Deployment Instructions

Follow these steps to deploy the CUBI token smart contract to an Ethereum testnet or mainnet.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Truffle](https://www.trufflesuite.com/truffle) or [Hardhat](https://hardhat.org/)
- [MetaMask](https://metamask.io/) with testnet ETH
- An Infura or Alchemy API key

### Step 1: Install Dependencies

```bash
npm install @openzeppelin/contracts@4.9.3 @truffle/hdwallet-provider dotenv
```

### Step 2: Create a Deployment Configuration

Create a `.env` file in the root directory with the following content:

```
MNEMONIC=your mnemonic phrase here
INFURA_API_KEY=your infura api key here
```

### Step 3: Create a Truffle Configuration

Create a `truffle-config.js` file in the root directory:

```javascript
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    goerli: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
      ),
      network_id: 5,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    sepolia: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
      ),
      network_id: 11155111,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
```

### Step 4: Create a Migration Script

Create a `migrations` directory and add a file named `2_deploy_contracts.js`:

```javascript
const CUBIToken = artifacts.require("CUBIToken");

module.exports = function(deployer) {
  deployer.deploy(CUBIToken);
};
```

### Step 5: Compile the Contract

```bash
npx truffle compile
```

### Step 6: Deploy to Testnet

```bash
npx truffle migrate --network sepolia
```

### Step 7: Update Contract Address

After deployment, update the contract address in the `web3Service.js` file:

```javascript
// CUBI Token contract address (on Ethereum testnet)
const CUBI_CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
```

## Interacting with the Contract

After deployment, you can interact with the contract using the following methods:

### Claiming UBI

Users can claim UBI tokens once per day using the `claim()` function. The amount of tokens they receive is based on their civic score.

### Updating Civic Scores

The contract owner can update a user's civic score using the `updateCivicScore(address user, uint256 score)` function.

### Distributing UBI

The contract owner can distribute UBI tokens to a specific user using the `distributeUBI(address recipient, uint256 amount)` function.

## Contract Verification

After deployment, you should verify your contract on Etherscan for transparency:

1. Go to [Etherscan](https://etherscan.io/) (or the testnet version)
2. Find your contract address
3. Click on the "Contract" tab
4. Click "Verify and Publish"
5. Follow the instructions to verify your contract

## Security Considerations

- The contract includes a pause mechanism that can be activated by the owner in case of emergencies.
- The total supply is capped at 100 million tokens to prevent inflation.
- The UBI claim amount is capped to prevent excessive minting.
- Time-locking prevents users from claiming UBI more than once per day.

## License

This contract is licensed under the MIT License. 