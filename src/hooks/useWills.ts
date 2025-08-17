'use client'

import { useState, useEffect } from 'react'
import { useAccount, useContractRead, useContractReads } from 'wagmi'

interface Will {
  id: string
  name: string
  owner: string
  isActive: boolean
  isTriggered: boolean
  createdTimestamp: number
  lastActivityTimestamp: number
  inactivityPeriod: number
  nomineeCount: number
  totalPercentage: number
  nominees: Array<{
    address: string
    percentage: number
    isVerified: boolean
    isActive: boolean
    name?: string
  }>
  assets: Array<{
    tokenAddress: string
    symbol: string
    amount: number
    value: number
  }>
  totalValue: number
}

export function useWills(address?: string) {
  const [wills, setWills] = useState<Will[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data for development - replace with actual contract calls
  useEffect(() => {
    if (!address) {
      setWills([])
      setLoading(false)
      return
    }

    const fetchWills = async () => {
      try {
        setLoading(true)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - replace with actual smart contract calls
        const mockWills: Will[] = [
          {
            id: '1',
            name: 'Primary Crypto Will',
            owner: address,
            isActive: true,
            isTriggered: false,
            createdTimestamp: Date.now() / 1000 - 86400 * 30, // 30 days ago
            lastActivityTimestamp: Date.now() / 1000 - 86400 * 7, // 7 days ago
            inactivityPeriod: 365 * 24 * 60 * 60, // 1 year
            nomineeCount: 2,
            totalPercentage: 10000, // 100%
            nominees: [
              {
                address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b1',
                percentage: 6000, // 60%
                isVerified: true,
                isActive: true,
                name: 'John Doe',
              },
              {
                address: '0x8ba1f109551bD432803012645Hac136c30C85bcf',
                percentage: 4000, // 40%
                isVerified: false,
                isActive: true,
                name: 'Jane Smith',
              },
            ],
            assets: [
              {
                tokenAddress: '0x0000000000000000000000000000000000000000',
                symbol: 'ETH',
                amount: 2.5,
                value: 4250,
              },
              {
                tokenAddress: '0xA0b86a33E6441e6e80D0c4C6C7527d5b8C6B8b8b',
                symbol: 'USDC',
                amount: 5000,
                value: 5000,
              },
            ],
            totalValue: 9250,
          },
          {
            id: '2',
            name: 'Emergency Fund Will',
            owner: address,
            isActive: true,
            isTriggered: false,
            createdTimestamp: Date.now() / 1000 - 86400 * 60, // 60 days ago
            lastActivityTimestamp: Date.now() / 1000 - 86400 * 14, // 14 days ago
            inactivityPeriod: 730 * 24 * 60 * 60, // 2 years
            nomineeCount: 1,
            totalPercentage: 10000, // 100%
            nominees: [
              {
                address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b1',
                percentage: 10000, // 100%
                isVerified: true,
                isActive: true,
                name: 'Emergency Contact',
              },
            ],
            assets: [
              {
                tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
                symbol: 'USDT',
                amount: 10000,
                value: 10000,
              },
            ],
            totalValue: 10000,
          },
        ]
        
        setWills(mockWills)
        setError(null)
      } catch (err) {
        setError('Failed to fetch wills')
        console.error('Error fetching wills:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWills()
  }, [address])

  const refetch = () => {
    if (address) {
      setLoading(true)
      // Trigger refetch
      const fetchWills = async () => {
        await new Promise(resolve => setTimeout(resolve, 500))
        setLoading(false)
      }
      fetchWills()
    }
  }

  return {
    wills,
    loading,
    error,
    refetch,
  }
}

export function useWill(willId: string) {
  const [will, setWill] = useState<Will | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!willId) {
      setWill(null)
      setLoading(false)
      return
    }

    const fetchWill = async () => {
      try {
        setLoading(true)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock data - replace with actual smart contract call
        const mockWill: Will = {
          id: willId,
          name: 'Primary Crypto Will',
          owner: '0x1234567890123456789012345678901234567890',
          isActive: true,
          isTriggered: false,
          createdTimestamp: Date.now() / 1000 - 86400 * 30,
          lastActivityTimestamp: Date.now() / 1000 - 86400 * 7,
          inactivityPeriod: 365 * 24 * 60 * 60,
          nomineeCount: 2,
          totalPercentage: 10000,
          nominees: [
            {
              address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b1',
              percentage: 6000,
              isVerified: true,
              isActive: true,
              name: 'John Doe',
            },
            {
              address: '0x8ba1f109551bD432803012645Hac136c30C85bcf',
              percentage: 4000,
              isVerified: false,
              isActive: true,
              name: 'Jane Smith',
            },
          ],
          assets: [
            {
              tokenAddress: '0x0000000000000000000000000000000000000000',
              symbol: 'ETH',
              amount: 2.5,
              value: 4250,
            },
            {
              tokenAddress: '0xA0b86a33E6441e6e80D0c4C6C7527d5b8C6B8b8b',
              symbol: 'USDC',
              amount: 5000,
              value: 5000,
            },
          ],
          totalValue: 9250,
        }
        
        setWill(mockWill)
        setError(null)
      } catch (err) {
        setError('Failed to fetch will')
        console.error('Error fetching will:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWill()
  }, [willId])

  return {
    will,
    loading,
    error,
  }
}