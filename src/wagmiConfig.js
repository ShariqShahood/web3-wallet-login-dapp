

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
  autoConnect: false, // 🔴 MUST stay false
  connectors: [
    // MetaMask (Injected)
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),

    // WalletConnect (QR)
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        qrcode: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})
