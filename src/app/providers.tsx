'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet, polygon, sepolia, hardhat } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { RainbowKitProvider, getDefaultWallets, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import '@rainbow-me/rainbowkit/styles.css'

// Configure chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    sepolia,
    ...(process.env.NODE_ENV === 'development' ? [hardhat] : []),
  ],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '' }),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY || '' }),
    publicProvider(),
  ]
)

// Configure wallets
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

const { wallets } = getDefaultWallets({
  appName: 'CryptoInheritance',
  projectId,
  chains,
})

const connectors = connectorsForWallets(wallets)

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}