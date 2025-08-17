'use client'

import { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'

interface Asset {
  tokenAddress: string
  symbol: string
  name: string
  balance: number
  value: number
  change24h: number
  logo?: string
}

export function useAssets(address?: string) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address as `0x${string}`,
    enabled: !!address,
  })

  useEffect(() => {
    if (!address) {
      setAssets([])
      setTotalValue(0)
      setLoading(false)
      return
    }

    const fetchAssets = async () => {
      try {
        setLoading(true)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock asset data - replace with actual token balance calls and price feeds
        const mockAssets: Asset[] = [
          {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            symbol: 'ETH',
            name: 'Ethereum',
            balance: ethBalance ? parseFloat(ethBalance.formatted) : 2.5,
            value: ethBalance ? parseFloat(ethBalance.formatted) * 1700 : 4250, // Mock ETH price
            change24h: 2.34,
            logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
          },
          {
            tokenAddress: '0xA0b86a33E6441e6e80D0c4C6C7527d5b8C6B8b8b',
            symbol: 'USDC',
            name: 'USD Coin',
            balance: 5000,
            value: 5000,
            change24h: 0.01,
            logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
          },
          {
            tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            symbol: 'USDT',
            name: 'Tether USD',
            balance: 3000,
            value: 3000,
            change24h: -0.02,
            logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
          },
          {
            tokenAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
            symbol: 'WBTC',
            name: 'Wrapped Bitcoin',
            balance: 0.15,
            value: 6450, // Mock BTC price
            change24h: 1.87,
            logo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
          },
          {
            tokenAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
            symbol: 'MATIC',
            name: 'Polygon',
            balance: 2500,
            value: 1875, // Mock MATIC price
            change24h: -3.21,
            logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
          },
        ]
        
        const total = mockAssets.reduce((sum, asset) => sum + asset.value, 0)
        
        setAssets(mockAssets)
        setTotalValue(total)
        setError(null)
      } catch (err) {
        setError('Failed to fetch assets')
        console.error('Error fetching assets:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [address, ethBalance])

  const refetch = () => {
    if (address) {
      setLoading(true)
      // Trigger refetch
      const fetchAssets = async () => {
        await new Promise(resolve => setTimeout(resolve, 500))
        setLoading(false)
      }
      fetchAssets()
    }
  }

  return {
    assets,
    totalValue,
    loading,
    error,
    refetch,
  }
}

export function useAssetPrices(tokenAddresses: string[]) {
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tokenAddresses.length) {
      setPrices({})
      setLoading(false)
      return
    }

    const fetchPrices = async () => {
      try {
        setLoading(true)
        
        // Mock price data - replace with actual price feed API
        const mockPrices: Record<string, number> = {
          '0x0000000000000000000000000000000000000000': 1700, // ETH
          '0xA0b86a33E6441e6e80D0c4C6C7527d5b8C6B8b8b': 1, // USDC
          '0xdAC17F958D2ee523a2206206994597C13D831ec7': 1, // USDT
          '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 43000, // WBTC
          '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0': 0.75, // MATIC
        }
        
        const filteredPrices = tokenAddresses.reduce((acc, address) => {
          if (mockPrices[address]) {
            acc[address] = mockPrices[address]
          }
          return acc
        }, {} as Record<string, number>)
        
        setPrices(filteredPrices)
      } catch (err) {
        console.error('Error fetching prices:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
  }, [tokenAddresses])

  return {
    prices,
    loading,
  }
}

export function useTokenBalance(tokenAddress: string, userAddress?: string) {
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tokenAddress || !userAddress) {
      setBalance(0)
      setLoading(false)
      return
    }

    const fetchBalance = async () => {
      try {
        setLoading(true)
        
        // Mock balance data - replace with actual token balance call
        const mockBalances: Record<string, number> = {
          '0x0000000000000000000000000000000000000000': 2.5, // ETH
          '0xA0b86a33E6441e6e80D0c4C6C7527d5b8C6B8b8b': 5000, // USDC
          '0xdAC17F958D2ee523a2206206994597C13D831ec7': 3000, // USDT
          '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 0.15, // WBTC
          '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0': 2500, // MATIC
        }
        
        setBalance(mockBalances[tokenAddress] || 0)
      } catch (err) {
        console.error('Error fetching token balance:', err)
        setBalance(0)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [tokenAddress, userAddress])

  return {
    balance,
    loading,
  }
}