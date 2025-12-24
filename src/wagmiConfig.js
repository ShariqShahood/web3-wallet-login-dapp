import { configureChains, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
)

export const wagmiConfig = createConfig({
  autoConnect: true, // Keep this as true
  connectors: [
    // MetaMask (Injected)
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: false, // ✅ CHANGED from true to false
      },
    }),

    // WalletConnect (QR)
    new WalletConnectConnector({
      chains,
      options: {
        projectId: projectId || 'demo',
        qrcode: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})