import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import web3Service from '../services/web3Service';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const UBIPage = () => {
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [networkInfo, setNetworkInfo] = useState({ networkId: 0, networkName: 'Not Connected' });
  const [transactions, setTransactions] = useState([]);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(null);
  const [nextClaimDate, setNextClaimDate] = useState(null);
  const [metamaskInstalled, setMetamaskInstalled] = useState(true);
  const [userRejected, setUserRejected] = useState(false);

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if MetaMask is installed
        const isInstalled = web3Service.isMetaMaskInstalled();
        setMetamaskInstalled(isInstalled);
        
        if (!isInstalled) {
          setError('MetaMask is not installed. Please install MetaMask to use this feature.');
          setLoading(false);
          return;
        }
        
        // Initialize Web3
        const result = await web3Service.initWeb3();
        
        if (result.connected) {
          setWalletConnected(true);
          setWalletAddress(result.account);
          setUserRejected(false);
          
          // Get token balance
          const balance = await web3Service.getTokenBalance(result.account);
          setTokenBalance(balance);
          
          // Get network info
          const network = await web3Service.getNetworkInfo();
          setNetworkInfo(network);
          
          // Get transaction history
          const history = await web3Service.getTransactionHistory(result.account);
          setTransactions(history);
          
          // Set next claim date (24 hours after last claim)
          // In a real implementation, this would come from the smart contract
          const lastClaimTimestamp = history.find(tx => tx.type === 'UBI Claim')?.timestamp || 0;
          const nextClaimTimestamp = lastClaimTimestamp + (24 * 60 * 60 * 1000); // 24 hours
          setNextClaimDate(nextClaimTimestamp);
        } else if (result.userRejected) {
          setUserRejected(true);
          setError('You rejected the connection request. Please connect your wallet to use the UBI feature.');
        } else {
          setError(result.error || 'Failed to connect to MetaMask');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error initializing wallet:', err);
        setError('Failed to initialize wallet. Please try again later.');
        setLoading(false);
      }
    };
    
    initializeWallet();
  }, []);

  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      setUserRejected(false);
      
      // Initialize Web3
      const result = await web3Service.initWeb3();
      
      if (result.connected) {
        setWalletConnected(true);
        setWalletAddress(result.account);
        
        // Get token balance
        const balance = await web3Service.getTokenBalance(result.account);
        setTokenBalance(balance);
        
        // Get network info
        const network = await web3Service.getNetworkInfo();
        setNetworkInfo(network);
        
        // Get transaction history
        const history = await web3Service.getTransactionHistory(result.account);
        setTransactions(history);
        
        // Set next claim date (24 hours after last claim)
        const lastClaimTimestamp = history.find(tx => tx.type === 'UBI Claim')?.timestamp || 0;
        const nextClaimTimestamp = lastClaimTimestamp + (24 * 60 * 60 * 1000); // 24 hours
        setNextClaimDate(nextClaimTimestamp);
      } else if (result.userRejected) {
        setUserRejected(true);
        setError('You rejected the connection request. Please connect your wallet to use the UBI feature.');
      } else {
        setError(result.error || 'Failed to connect to MetaMask');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please try again later.');
      setLoading(false);
    }
  };

  const handleClaimUBI = async () => {
    try {
      setClaimLoading(true);
      setClaimSuccess(null);
      setError(null);
      
      // Check if user can claim UBI
      const now = Date.now();
      if (nextClaimDate && now < nextClaimDate) {
        setError('You cannot claim UBI yet. Please wait until the next claim period.');
        setClaimLoading(false);
        return;
      }
      
      // Claim UBI based on civic score
      const result = await web3Service.claimUBI(currentUser?.score || 0);
      
      if (result.success) {
        // Update token balance
        const balance = await web3Service.getTokenBalance();
        setTokenBalance(balance);
        
        // Update transaction history
        const history = await web3Service.getTransactionHistory();
        setTransactions(history);
        
        // Set next claim date (24 hours from now)
        const nextClaimTimestamp = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        setNextClaimDate(nextClaimTimestamp);
        
        // Show success message
        setClaimSuccess(`Successfully claimed ${result.amount} CUBI tokens!`);
      } else {
        setError(result.error || 'Failed to claim UBI. Please try again later.');
      }
      
      setClaimLoading(false);
    } catch (err) {
      console.error('Error claiming UBI:', err);
      setError(err.message || 'Failed to claim UBI. Please try again later.');
      setClaimLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const canClaimUBI = () => {
    if (!nextClaimDate) return true;
    return Date.now() >= nextClaimDate;
  };

  const getTimeUntilNextClaim = () => {
    if (!nextClaimDate) return 'Now';
    
    const now = Date.now();
    if (now >= nextClaimDate) return 'Now';
    
    const timeLeft = nextClaimDate - now;
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading UBI data...</p>
      </div>
    );
  }

  if (!metamaskInstalled) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm dashboard-card">
          <div className="card-body dashboard-card-body">
            <h1 className="mb-4">Universal Basic Income (UBI)</h1>
            <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">MetaMask Not Installed</h4>
              <p>
                MetaMask is required to use the UBI feature. Please install MetaMask to continue.
              </p>
              <hr />
              <p className="mb-0">
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-warning"
                >
                  Install MetaMask
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm dashboard-card mb-4">
        <div className="card-body dashboard-card-body">
          <h1 className="mb-4">Universal Basic Income (UBI)</h1>
          
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}
          
          {claimSuccess && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {claimSuccess}
              <button type="button" className="btn-close" onClick={() => setClaimSuccess(null)}></button>
            </div>
          )}
          
          {userRejected && (
            <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">Connection Rejected</h4>
              <p>
                You rejected the connection request. To use the UBI feature, you need to connect your MetaMask wallet.
              </p>
              <hr />
              <p className="mb-0">
                <button 
                  className="btn btn-warning"
                  onClick={handleConnectWallet}
                >
                  Try Again
                </button>
              </p>
            </div>
          )}
          
          <div className="row">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Wallet Information</h5>
                  
                  {!walletConnected ? (
                    <div className="text-center py-4">
                      <p className="text-muted mb-4">
                        Connect your MetaMask wallet to claim your UBI tokens.
                      </p>
                      <button 
                        className="btn btn-primary"
                        onClick={handleConnectWallet}
                      >
                        Connect Wallet
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Wallet Address</label>
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control" 
                            value={walletAddress} 
                            readOnly 
                          />
                          <button 
                            className="btn btn-outline-secondary" 
                            type="button"
                            onClick={() => navigator.clipboard.writeText(walletAddress)}
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Network</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={networkInfo.networkName} 
                          readOnly 
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">CUBI Token Balance</label>
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control" 
                            value={`${tokenBalance} CUBI`} 
                            readOnly 
                          />
                          <span className="input-group-text">
                            <i className="bi bi-coin text-warning"></i>
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">UBI Claim</h5>
                  
                  {!walletConnected ? (
                    <div className="text-center py-4">
                      <p className="text-muted">
                        Connect your wallet to claim UBI tokens.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <div style={{ width: 150, height: 150, margin: '0 auto 20px' }}>
                        <CircularProgressbar
                          value={currentUser?.score || 0}
                          maxValue={1000}
                          text={`${currentUser?.score || 0}`}
                          styles={buildStyles({
                            textSize: '16px',
                            pathColor: `rgba(75, 192, 192, ${(currentUser?.score || 0) / 1000})`,
                            textColor: '#333',
                            trailColor: '#d6d6d6',
                            backgroundColor: '#3e98c7',
                          })}
                        />
                      </div>
                      
                      <h5 className="mb-3">Your Civic Score</h5>
                      <p className="text-muted mb-4">
                        Your UBI amount is based on your civic score. Higher scores earn more tokens!
                      </p>
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Next Claim Available:</span>
                          <span className="fw-bold">{getTimeUntilNextClaim()}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Estimated Amount:</span>
                          <span className="fw-bold">{(currentUser?.score || 0) / 10} CUBI</span>
                        </div>
                      </div>
                      
                      <button 
                        className="btn btn-primary w-100"
                        onClick={handleClaimUBI}
                        disabled={claimLoading || !canClaimUBI()}
                      >
                        {claimLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Claiming...
                          </>
                        ) : canClaimUBI() ? (
                          'Claim UBI Tokens'
                        ) : (
                          `Claim Available in ${getTimeUntilNextClaim()}`
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card border-0 shadow-sm dashboard-card">
        <div className="card-body dashboard-card-body">
          <h5 className="card-title mb-4">Transaction History</h5>
          
          {!walletConnected ? (
            <div className="text-center py-4">
              <p className="text-muted">
                Connect your wallet to view transaction history.
              </p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Transaction Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={index}>
                      <td>{tx.type}</td>
                      <td className={tx.type.includes('Claim') ? 'text-success' : 'text-danger'}>
                        {tx.type.includes('Claim') ? '+' : '-'}{tx.amount} CUBI
                      </td>
                      <td>{formatDate(tx.timestamp)}</td>
                      <td>
                        <a 
                          href={`https://etherscan.io/tx/${tx.hash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-truncate d-inline-block"
                          style={{ maxWidth: '150px' }}
                        >
                          {formatAddress(tx.hash)}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No transactions found.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="card border-0 shadow-sm dashboard-card mt-4">
        <div className="card-body dashboard-card-body">
          <h5 className="card-title mb-3">About Universal Basic Income (UBI)</h5>
          <p>
            The CivicChain UBI system distributes CUBI tokens to users based on their civic engagement and contributions to the community. 
            Unlike traditional UBI systems that provide a fixed amount to everyone, our system rewards users proportionally to their civic score.
          </p>
          
          <h6 className="mt-4">Key Features:</h6>
          <ul>
            <li><strong>Credit Score-Based Distribution:</strong> Higher civic scores earn more tokens</li>
            <li><strong>Time-Locked Claims:</strong> UBI can be claimed once every 24 hours</li>
            <li><strong>Transferable Value:</strong> CUBI tokens can be transferred to other users</li>
            <li><strong>Reward Redemption:</strong> Tokens can be used to redeem rewards in the marketplace</li>
          </ul>
          
          <h6 className="mt-4">How to Increase Your UBI Amount:</h6>
          <ol>
            <li>Complete civic activities to increase your civic score</li>
            <li>Participate in community events and volunteer opportunities</li>
            <li>Engage with the DAO governance system</li>
            <li>Refer friends to join the platform</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default UBIPage; 