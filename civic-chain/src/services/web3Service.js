// import Web3 from 'web3';
// import CUBI_ABI from '../contracts/CUBI_ABI.json';

// // CUBI Token contract address (on Ethereum testnet)
// const CUBI_CONTRACT_ADDRESS = '0x123456789abcdef123456789abcdef123456789a'; // Replace with actual contract address

// // Initialize web3 instance
// let web3;
// let cubiContract;
// let currentAccount = null;

// // Initialize Web3 with MetaMask
// export const initWeb3 = async () => {
//   if (window.ethereum) {
//     try {
//       // Request account access
//       web3 = new Web3(window.ethereum);
//       await window.ethereum.request({ method: 'eth_requestAccounts' });
      
//       // Get the current account
//       const accounts = await web3.eth.getAccounts();
//       currentAccount = accounts[0];
      
//       // Initialize the CUBI token contract
//       cubiContract = new web3.eth.Contract(CUBI_ABI, CUBI_CONTRACT_ADDRESS);
      
//       // Set up event listeners for account changes
//       window.ethereum.on('accountsChanged', (accounts) => {
//         currentAccount = accounts[0];
//         // Trigger a page reload to refresh data
//         window.location.reload();
//       });
      
//       return {
//         connected: true,
//         account: currentAccount
//       };
//     } catch (error) {
//       console.error('User denied account access:', error);
//       return {
//         connected: false,
//         error: 'User denied account access'
//       };
//     }
//   } else if (window.web3) {
//     // Legacy dapp browsers
//     web3 = new Web3(window.web3.currentProvider);
//     const accounts = await web3.eth.getAccounts();
//     currentAccount = accounts[0];
    
//     // Initialize the CUBI token contract
//     cubiContract = new web3.eth.Contract(CUBI_ABI, CUBI_CONTRACT_ADDRESS);
    
//     return {
//       connected: true,
//       account: currentAccount
//     };
//   } else {
//     // Non-dapp browsers
//     return {
//       connected: false,
//       error: 'Non-Ethereum browser detected. You should consider trying MetaMask!'
//     };
//   }
// };

// // Get current account
// export const getCurrentAccount = () => {
//   return currentAccount;
// };

// // Get CUBI token balance
// export const getTokenBalance = async (address = currentAccount) => {
//   if (!web3 || !cubiContract) {
//     await initWeb3();
//   }
  
//   try {
//     const balance = await cubiContract.methods.balanceOf(address).call();
//     return web3.utils.fromWei(balance, 'ether');
//   } catch (error) {
//     console.error('Error getting token balance:', error);
//     return '0';
//   }
// };

// // Claim UBI tokens based on civic score
// export const claimUBI = async (civicScore) => {
//   if (!web3 || !cubiContract || !currentAccount) {
//     await initWeb3();
//   }
  
//   try {
//     // Calculate UBI amount based on civic score
//     // Higher civic score = higher UBI amount
//     const baseAmount = 10; // Base UBI amount
//     const scoreMultiplier = civicScore / 100; // Score multiplier
//     const ubiAmount = baseAmount * scoreMultiplier;
    
//     // Convert to wei
//     const ubiAmountWei = web3.utils.toWei(ubiAmount.toString(), 'ether');
    
//     // Call the claim function on the smart contract
//     const result = await cubiContract.methods.claim(ubiAmountWei).send({
//       from: currentAccount
//     });
    
//     return {
//       success: true,
//       transactionHash: result.transactionHash,
//       amount: ubiAmount
//     };
//   } catch (error) {
//     console.error('Error claiming UBI:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// };

// // Transfer CUBI tokens to another address
// export const transferTokens = async (toAddress, amount) => {
//   if (!web3 || !cubiContract || !currentAccount) {
//     await initWeb3();
//   }
  
//   try {
//     // Convert amount to wei
//     const amountWei = web3.utils.toWei(amount.toString(), 'ether');
    
//     // Transfer tokens
//     const result = await cubiContract.methods.transfer(toAddress, amountWei).send({
//       from: currentAccount
//     });
    
//     return {
//       success: true,
//       transactionHash: result.transactionHash
//     };
//   } catch (error) {
//     console.error('Error transferring tokens:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// };

// // Get transaction history for the current account
// export const getTransactionHistory = async (address = currentAccount) => {
//   if (!web3 || !cubiContract) {
//     await initWeb3();
//   }
  
//   try {
//     // For a real implementation, you would need to use an API like Etherscan
//     // or The Graph to get transaction history
//     // For this demo, we'll return mock data
//     return [
//       {
//         type: 'UBI Claim',
//         amount: '25.5',
//         timestamp: Date.now() - 86400000 * 2, // 2 days ago
//         hash: '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234'
//       },
//       {
//         type: 'Reward Redemption',
//         amount: '10.0',
//         timestamp: Date.now() - 86400000 * 5, // 5 days ago
//         hash: '0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcd'
//       },
//       {
//         type: 'UBI Claim',
//         amount: '22.8',
//         timestamp: Date.now() - 86400000 * 9, // 9 days ago
//         hash: '0x9abcdef123456789abcdef123456789abcdef123456789abcdef123456789abc'
//       }
//     ];
//   } catch (error) {
//     console.error('Error getting transaction history:', error);
//     return [];
//   }
// };

// // Check if MetaMask is installed
// export const isMetaMaskInstalled = () => {
//   return window.ethereum !== undefined;
// };

// // Get network information
// export const getNetworkInfo = async () => {
//   if (!web3) {
//     await initWeb3();
//   }
  
//   try {
//     const networkId = await web3.eth.net.getId();
//     let networkName;
    
//     switch (networkId) {
//       case 1:
//         networkName = 'Ethereum Mainnet';
//         break;
//       case 3:
//         networkName = 'Ropsten Testnet';
//         break;
//       case 4:
//         networkName = 'Rinkeby Testnet';
//         break;
//       case 5:
//         networkName = 'Goerli Testnet';
//         break;
//       case 42:
//         networkName = 'Kovan Testnet';
//         break;
//       case 56:
//         networkName = 'Binance Smart Chain';
//         break;
//       case 137:
//         networkName = 'Polygon Mainnet';
//         break;
//       default:
//         networkName = 'Unknown Network';
//     }
    
//     return {
//       networkId,
//       networkName
//     };
//   } catch (error) {
//     console.error('Error getting network info:', error);
//     return {
//       networkId: 0,
//       networkName: 'Not Connected'
//     };
//   }
// };

// export default {
//   initWeb3,
//   getCurrentAccount,
//   getTokenBalance,
//   claimUBI,
//   transferTokens,
//   getTransactionHistory,
//   isMetaMaskInstalled,
//   getNetworkInfo
// }; 

import Web3 from 'web3';
import CUBI_ABI from '../contracts/CUBI_ABI.json';

// CUBI Token contract address (on Educhain)
const CUBI_CONTRACT_ADDRESS = '0x123456789abcdef123456789abcdef123456789a'; // Replace with actual contract address

// Educhain network configuration
const EDUCHAIN_CONFIG = {
  chainId: '656476', // 656476 in hex
  chainName: 'Educhain',
  nativeCurrency: {
    name: 'Educhain ETH',
    symbol: 'EDU', // Changed to EDU to match network name
    decimals: 18
  },
  rpcUrls: ['https://rpc.open-campus-codex.gelato.digital'],
  blockExplorerUrls: ['https://opencampus-codex.blockscout.com/']
};

// Initialize web3 instance
let web3;
let cubiContract;
let currentAccount = null;

// Initialize Web3 with MetaMask and configure for Educhain
export const initWeb3 = async () => {
  if (window.ethereum) {
    try {
      // Request account access
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if we're on the correct network
      const networkInfo = await getNetworkInfo();
      if (networkInfo.networkId !== 656476) {
        // Try to switch to Educhain
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: EDUCHAIN_CONFIG.chainId }]
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [EDUCHAIN_CONFIG]
              });
            } catch (addError) {
              console.error('Error adding Educhain network:', addError);
              return {
                connected: false,
                error: 'Failed to add Educhain network to your wallet'
              };
            }
          } else {
            console.error('Error switching to Educhain network:', switchError);
            return {
              connected: false,
              error: 'Failed to switch to Educhain network'
            };
          }
        }
      }
      
      // Get the current account
      const accounts = await web3.eth.getAccounts();
      currentAccount = accounts[0];
      
      // Initialize the CUBI token contract
      cubiContract = new web3.eth.Contract(CUBI_ABI, CUBI_CONTRACT_ADDRESS);
      
      // Set up event listeners for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        currentAccount = accounts[0];
        // Trigger a page reload to refresh data
        window.location.reload();
      });
      
      // Set up event listeners for chain changes
      window.ethereum.on('chainChanged', (chainId) => {
        // Reload the page when the chain changes
        window.location.reload();
      });
      
      return {
        connected: true,
        account: currentAccount,
        network: 'Educhain'
      };
    } catch (error) {
      console.error('User denied account access:', error);
      return {
        connected: false,
        error: 'User denied account access'
      };
    }
  } else if (window.web3) {
    // Legacy dapp browsers
    web3 = new Web3(window.web3.currentProvider);
    
    // Try to switch to Educhain network
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: EDUCHAIN_CONFIG.chainId }]
      });
    } catch (error) {
      console.error('Error switching to Educhain network:', error);
      return {
        connected: false,
        error: 'Cannot switch to Educhain network'
      };
    }
    
    const accounts = await web3.eth.getAccounts();
    currentAccount = accounts[0];
    
    // Initialize the CUBI token contract
    cubiContract = new web3.eth.Contract(CUBI_ABI, CUBI_CONTRACT_ADDRESS);
    
    return {
      connected: true,
      account: currentAccount,
      network: 'Educhain'
    };
  } else {
    // Non-dapp browsers
    return {
      connected: false,
      error: 'Non-Ethereum browser detected. Please install MetaMask to use this application.'
    };
  }
};

// Get current account
export const getCurrentAccount = () => {
  return currentAccount;
};

// Get CUBI token balance
export const getTokenBalance = async (address = currentAccount) => {
  if (!web3 || !cubiContract) {
    await initWeb3();
  }
  
  try {
    const balance = await cubiContract.methods.balanceOf(address).call();
    return web3.utils.fromWei(balance, 'ether');
  } catch (error) {
    console.error('Error getting token balance:', error);
    return '0';
  }
};

// Claim UBI tokens based on civic score
export const claimUBI = async (civicScore) => {
  if (!web3 || !cubiContract || !currentAccount) {
    await initWeb3();
  }
  
  try {
    // Calculate UBI amount based on civic score
    // Higher civic score = higher UBI amount
    const baseAmount = 10; // Base UBI amount
    const scoreMultiplier = civicScore / 100; // Score multiplier
    const ubiAmount = baseAmount * scoreMultiplier;
    
    // Convert to wei
    const ubiAmountWei = web3.utils.toWei(ubiAmount.toString(), 'ether');
    
    // Call the claim function on the smart contract
    const result = await cubiContract.methods.claim(ubiAmountWei).send({
      from: currentAccount
    });
    
    return {
      success: true,
      transactionHash: result.transactionHash,
      amount: ubiAmount,
      explorerLink: `${EDUCHAIN_CONFIG.blockExplorerUrls[0]}/tx/${result.transactionHash}`
    };
  } catch (error) {
    console.error('Error claiming UBI:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Transfer CUBI tokens to another address
export const transferTokens = async (toAddress, amount) => {
  if (!web3 || !cubiContract || !currentAccount) {
    await initWeb3();
  }
  
  try {
    // Convert amount to wei
    const amountWei = web3.utils.toWei(amount.toString(), 'ether');
    
    // Transfer tokens
    const result = await cubiContract.methods.transfer(toAddress, amountWei).send({
      from: currentAccount
    });
    
    return {
      success: true,
      transactionHash: result.transactionHash,
      explorerLink: `${EDUCHAIN_CONFIG.blockExplorerUrls[0]}/tx/${result.transactionHash}`
    };
  } catch (error) {
    console.error('Error transferring tokens:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get transaction history for the current account
export const getTransactionHistory = async (address = currentAccount) => {
  if (!web3 || !cubiContract) {
    await initWeb3();
  }
  
  try {
    // For a real implementation, you would need to use the Educhain explorer API
    // For this demo, we'll return mock data with Educhain explorer links
    return [
      {
        type: 'UBI Claim',
        amount: '25.5',
        timestamp: Date.now() - 86400000 * 2, // 2 days ago
        hash: '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234',
        explorerLink: `${EDUCHAIN_CONFIG.blockExplorerUrls[0]}/tx/0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234`
      },
      {
        type: 'Reward Redemption',
        amount: '10.0',
        timestamp: Date.now() - 86400000 * 5, // 5 days ago
        hash: '0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcd',
        explorerLink: `${EDUCHAIN_CONFIG.blockExplorerUrls[0]}/tx/0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcd`
      },
      {
        type: 'UBI Claim',
        amount: '22.8',
        timestamp: Date.now() - 86400000 * 9, // 9 days ago
        hash: '0x9abcdef123456789abcdef123456789abcdef123456789abcdef123456789abc',
        explorerLink: `${EDUCHAIN_CONFIG.blockExplorerUrls[0]}/tx/0x9abcdef123456789abcdef123456789abcdef123456789abcdef123456789abc`
      }
    ];
  } catch (error) {
    console.error('Error getting transaction history:', error);
    return [];
  }
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return window.ethereum !== undefined;
};

// Get network information
export const getNetworkInfo = async () => {
  if (!web3) {
    web3 = new Web3(window.ethereum || window.web3.currentProvider);
  }
  
  try {
    const networkId = await web3.eth.net.getId();
    let networkName;
    
    switch (networkId) {
      case 1:
        networkName = 'Ethereum Mainnet';
        break;
      case 421614:
        networkName = 'Arbitrum Sepolia (Settlement Layer)';
        break;
      case 656476:
        networkName = 'Educhain';
        break;
      default:
        networkName = 'Unknown Network';
    }
    
    return {
      networkId,
      networkName,
      isEduchain: networkId === 656476
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    return {
      networkId: 0,
      networkName: 'Not Connected',
      isEduchain: false
    };
  }
};

// Helper function to check if user is on Educhain
export const isOnEduchain = async () => {
  const networkInfo = await getNetworkInfo();
  return networkInfo.isEduchain;
};

// Function to provide Educhain configuration for adding to MetaMask
export const getEduchainConfig = () => {
  return EDUCHAIN_CONFIG;
};

export default {
  initWeb3,
  getCurrentAccount,
  getTokenBalance,
  claimUBI,
  transferTokens,
  getTransactionHistory,
  isMetaMaskInstalled,
  getNetworkInfo,
  isOnEduchain,
  getEduchainConfig
};