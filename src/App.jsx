import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import { useState, useEffect } from 'react';

function App() {
  const { address, isConnected, connector } = useAccount();
  const { connectAsync, connectors, error, isLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  
  const [walletName, setWalletName] = useState('MetaMask');
  const [copied, setCopied] = useState(false);
  const [isReallyDisconnected, setIsReallyDisconnected] = useState(true);
  const [showDisconnectSuccess, setShowDisconnectSuccess] = useState(false);

  // Sync local state with wagmi state
  useEffect(() => {
    setIsReallyDisconnected(!isConnected);
  }, [isConnected]);

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Copy address to clipboard
  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle wallet connection
  const handleConnect = async (connector) => {
    try {
      setWalletName(connector.name);
      setShowDisconnectSuccess(false);
      
      // Force disconnect first if still connected
      if (isConnected && connector) {
        await disconnect();
      }
      
      // Connect with the new connector
      await connectAsync({ connector });
      setIsReallyDisconnected(false);
    } catch (err) {
      console.error('Connection error:', err);
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      await disconnect();
      setIsReallyDisconnected(true);
      setWalletName('MetaMask');
      setShowDisconnectSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowDisconnectSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  // Get network name with emoji
  const getNetworkEmoji = () => {
    if (!chain) return '🌐';
    switch (chain.id) {
      case 1: return '🌍'; // Ethereum Mainnet
      case 11155111: return '🔬'; // Sepolia
      case 5: return '🎓'; // Goerli
      case 137: return '🟣'; // Polygon
      case 42161: return '🔷'; // Arbitrum
      default: return '🌐';
    }
  };

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold mb-3 text-dark" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Web3 Wallet Login
              </h1>
              <p className="text-muted fs-5">
                Connect your wallet to access decentralized features
              </p>
            </div>

            {/* Main Card */}
            <div className="glass-card p-4 p-md-5">
              {isReallyDisconnected ? (
                <div>
                  {/* Disconnection Success Message */}
                  {showDisconnectSuccess && (
                    <div className="alert alert-success text-center mb-4">
                      <strong>✅ Successfully Disconnected!</strong> Your wallet is now disconnected.
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <div className="mb-3">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8H20C21.1 8 22 8.9 22 10V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V10C2 8.9 2.9 8 4 8H6M18 8V6C18 4.9 17.1 4 16 4H8C6.9 4 6 4.9 6 6V8M18 8H6" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#667eea" strokeWidth="2"/>
                      </svg>
                    </div>
                    <h3 className="mb-2 text-dark">Connect Your Wallet</h3>
                    <p className="text-muted">
                      Choose your preferred wallet provider to continue
                    </p>
                    
                    {/* Debug info - you can remove this later */}
                    <div className="small text-muted mt-2">
                      Status: {isConnected ? 'Connected' : 'Disconnected'}
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {connectors.map((connector) => (
                      <button
                        key={connector.id}
                        className="wallet-btn d-flex align-items-center justify-content-center gap-3"
                        disabled={isLoading || !connector.ready}
                        onClick={() => handleConnect(connector)}
                      >
                        {connector.name === 'MetaMask' && (
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                            alt="MetaMask" 
                            width="24" 
                            height="24"
                          />
                        )}
                        {connector.name === 'WalletConnect' && (
                          <img 
                            src="https://avatars.githubusercontent.com/u/37784886?s=200&v=4" 
                            alt="WalletConnect" 
                            width="24" 
                            height="24"
                            style={{ borderRadius: '8px' }}
                          />
                        )}
                        <span className="text-white">
                          {connector.name}
                          {!connector.ready && ' (Unavailable)'}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Instructions */}
                  <div className="mt-4 p-3 rounded bg-white border">
                    <h6 className="mb-2 text-dark">💡 How to connect:</h6>
                    <ol className="mb-0 text-start small text-muted">
                      <li>Make sure you have MetaMask installed</li>
                      <li>Click the MetaMask button above</li>
                      <li>Approve the connection request in the extension</li>
                      <li>Select your account and network</li>
                    </ol>
                  </div>

                  {error && (
                    <div className="alert alert-danger mt-4 text-center bg-white text-dark border-danger">
                      <strong className="text-dark">Error:</strong> {error.message}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  {/* Success Icon */}
                  <div className="mb-4">
                    <div className="d-inline-block p-3 rounded-circle" style={{ 
                      background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                    }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  <h3 className="mb-3 text-dark">Wallet Connected! 🎉</h3>
                  <p className="text-success mb-4">
                    Successfully connected to <strong>{walletName}</strong>
                  </p>

                  {/* Wallet Info Card */}
                  <div className="glass-card p-4 mb-4 text-start bg-white">
                    <div className="row align-items-center mb-3">
                      <div className="col-auto">
                        <div className="p-2 rounded-circle" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http.w3.org/2000/svg">
                            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#667eea" strokeWidth="2"/>
                            <path d="M9 12L11 14L15 10" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      <div className="col">
                        <small className="text-muted d-block">Connected Wallet</small>
                        <strong className="text-dark">{walletName}</strong>
                      </div>
                    </div>

                    <div className="row align-items-center mb-3">
                      <div className="col-auto">
                        <div className="p-2 rounded-circle" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                          <span style={{ fontSize: '20px' }}>{getNetworkEmoji()}</span>
                        </div>
                      </div>
                      <div className="col">
                        <small className="text-muted d-block">Network</small>
                        <strong className="text-dark">{chain?.name || 'Unknown Network'}</strong>
                        <span className="network-badge ms-2">
                          Chain ID: {chain?.id || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="row align-items-center">
                      <div className="col-auto">
                        <div className="p-2 rounded-circle" style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21L21 21M19 21H14M5 21L3 21M5 21H10M9 6.99998H10M9 11H10M14 6.99998H15M14 11H15M10 21V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V21M10 21H14" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      <div className="col">
                        <small className="text-muted d-block">Wallet Address</small>
                        <div className="d-flex align-items-center gap-2">
                          <code className="address-chip flex-grow-1 text-dark">
                            {formatAddress(address)}
                          </code>
                          <button 
                            onClick={copyToClipboard}
                            className="btn btn-sm border"
                            style={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }}
                          >
                            {copied ? 'Copied! ✅' : 'Copy 📋'}
                          </button>
                        </div>
                        <small className="text-muted mt-1 d-block">
                          Full address: {address}
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Disconnect Button */}
                  <div className="d-flex flex-column gap-2 align-items-center">
                    <button
                      onClick={handleDisconnect}
                      className="disconnect-btn"
                    >
                      Disconnect Wallet
                    </button>
                    <small className="text-muted">
                      This will disconnect {walletName} from this DApp
                    </small>
                  </div>

                  {/* DApp Features Demo */}
                  <div className="mt-5">
                    <h5 className="mb-3 text-dark">🎮 DApp Features (Demo)</h5>
                    <div className="row g-3">
                      <div className="col-12 col-md-4">
                        <div className="feature-card text-center">
                          <div className="fs-1 mb-2">🪙</div>
                          <h6 className="text-dark">Token Balance</h6>
                          <p className="text-muted small">0.0 ETH</p>
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="feature-card text-center">
                          <div className="fs-1 mb-2">👥</div>
                          <h6 className="text-dark">Network Status</h6>
                          <p className="text-success small">Connected</p>
                        </div>
                      </div>
                      <div className="col-12 col-md-4">
                        <div className="feature-card text-center">
                          <div className="fs-1 mb-2">🔐</div>
                          <h6 className="text-dark">Session</h6>
                          <p className="text-success small">Active</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-muted small">
                Built for Decentralized Application Development Course • 
                Uses <a href="https://wagmi.sh" target="_blank" rel="noopener noreferrer" className="text-primary">wagmi</a> + 
                {' '}<a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" className="text-primary">Vite</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;