'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Coins, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

interface Asset {
  tokenAddress: string
  symbol: string
  name: string
  balance: number
  value: number
  change24h: number
  logo?: string
}

interface AssetOverviewProps {
  assets: Asset[]
  loading: boolean
}

export default function AssetOverview({ assets, loading }: AssetOverviewProps) {
  const [showBalances, setShowBalances] = useState(true)

  const totalValue = assets?.reduce((sum, asset) => sum + asset.value, 0) || 0
  const totalChange24h = assets?.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0) || 0
  const totalChangePercent = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0

  const formatCurrency = (value: number) => {
    if (!showBalances) return '****'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatNumber = (value: number, decimals: number = 4) => {
    if (!showBalances) return '****'
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    })
  }

  if (loading) {
    return (
      <div className="crypto-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-20"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="crypto-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Asset Overview
        </h2>
        <button
          onClick={() => setShowBalances(!showBalances)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {showBalances ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {/* Total Portfolio Value */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Portfolio Value</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalValue)}
          </span>
          <div className={`flex items-center space-x-1 ${
            totalChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {totalChangePercent >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {showBalances ? `${totalChangePercent >= 0 ? '+' : ''}${totalChangePercent.toFixed(2)}%` : '**%'}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          24h change: {showBalances ? formatCurrency(totalChange24h) : '****'}
        </p>
      </div>

      {/* Asset List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2">
          <span>Asset</span>
          <span>Balance</span>
          <span>Value</span>
          <span>24h Change</span>
        </div>

        {assets && assets.length > 0 ? (
          assets.map((asset, index) => (
            <motion.div
              key={asset.tokenAddress}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2 -mx-2"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {asset.logo ? (
                    <img src={asset.logo} alt={asset.symbol} className="w-6 h-6 rounded-full" />
                  ) : (
                    <Coins className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {asset.symbol}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {asset.name}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatNumber(asset.balance)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {asset.symbol}
                </div>
              </div>

              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(asset.value)}
                </div>
              </div>

              <div className="text-right">
                <div className={`flex items-center space-x-1 ${
                  asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {asset.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span className="text-sm font-medium">
                    {showBalances ? `${asset.change24h >= 0 ? '+' : ''}${asset.change24h.toFixed(2)}%` : '**%'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <Coins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No assets found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect your wallet and deposit assets to get started
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {assets && assets.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {assets.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Assets
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {showBalances ? assets.filter(a => a.change24h > 0).length : '**'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Gaining
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {showBalances ? assets.filter(a => a.change24h < 0).length : '**'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Losing
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}