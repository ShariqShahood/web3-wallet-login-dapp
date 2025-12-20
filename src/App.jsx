

import { useAccount, useConnect, useDisconnect } from 'wagmi'

function App() {
  const { address, isConnected } = useAccount()
  const { connectAsync, connectors, error, isLoading } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <main className="bg-dark text-light min-vh-100">
      <div className="container py-4 justify-content-center">
        {!isConnected ? (
          <div>
            <p className="text-secondary text-center">
              Select a Wallet to connect
            </p>

            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  className="btn btn-primary"
                  disabled={isLoading}
                  onClick={async () => {
                    try {
                      await connectAsync({ connector })
                    } catch (err) {
                      console.error(err)
                    }
                  }}
                >
                  {connector.name}
                </button>
              ))}
            </div>

            {error && (
              <div className="text-danger text-center mt-3">
                {error.message}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-success">
              Wallet Connected to <b>{address}</b>
            </p>

            <button
              onClick={() => {
                disconnect()
                window.location.reload()
              }}
            >
              Disconnect
            </button>

          </div>
        )}
      </div>
    </main>
  )
}

export default App
