'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Users, 
  Clock, 
  Shield, 
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import { motion } from 'framer-motion'

interface Will {
  id: string
  name: string
  isActive: boolean
  isTriggered: boolean
  createdTimestamp: number
  lastActivityTimestamp: number
  inactivityPeriod: number
  nominees: Array<{
    address: string
    percentage: number
    isVerified: boolean
    isActive: boolean
  }>
  assets: Array<{
    tokenAddress: string
    symbol: string
    amount: number
    value: number
  }>
  totalValue: number
}

interface WillCardProps {
  will: Will
  onEdit?: () => void
  onDelete?: () => void
}

export default function WillCard({ will, onEdit, onDelete }: WillCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const getTimeUntilInactivity = () => {
    const now = Date.now() / 1000
    const timeSinceLastActivity = now - will.lastActivityTimestamp
    const timeRemaining = will.inactivityPeriod - timeSinceLastActivity
    
    if (timeRemaining <= 0) {
      return 'Inheritance can be triggered'
    }
    
    const days = Math.floor(timeRemaining / (24 * 60 * 60))
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} remaining`
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} remaining`
    } else {
      return `${days} day${days > 1 ? 's' : ''} remaining`
    }
  }

  const getStatusColor = () => {
    if (will.isTriggered) return 'status-triggered'
    if (!will.isActive) return 'status-rejected'
    return 'status-active'
  }

  const getStatusText = () => {
    if (will.isTriggered) return 'Triggered'
    if (!will.isActive) return 'Inactive'
    return 'Active'
  }

  const verifiedNominees = will.nominees?.filter(n => n.isVerified).length || 0
  const totalNominees = will.nominees?.length || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="crypto-card p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {will.name || `Will #${will.id}`}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Created {formatDate(will.createdTimestamp)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`status-badge ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="py-1">
                  <Link
                    href={`/dashboard/wills/${will.id}`}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </Link>
                  
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit()
                        setShowMenu(false)
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Will</span>
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete()
                        setShowMenu(false)
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Will</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Will Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${will.totalValue?.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Value
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {verifiedNominees}/{totalNominees}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Verified Nominees
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {will.assets?.length || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Assets
          </div>
        </div>
      </div>

      {/* Assets Preview */}
      {will.assets && will.assets.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Assets
          </h4>
          <div className="flex flex-wrap gap-2">
            {will.assets.slice(0, 3).map((asset, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
              >
                <span className="font-medium">{asset.amount}</span>
                <span className="text-gray-600 dark:text-gray-400">{asset.symbol}</span>
              </div>
            ))}
            {will.assets.length > 3 && (
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-600 dark:text-gray-400">
                +{will.assets.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inactivity Timer */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Inactivity Period
          </span>
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {getTimeUntilInactivity()}
        </span>
      </div>

      {/* Warnings */}
      {verifiedNominees === 0 && totalNominees > 0 && (
        <div className="mt-4 flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            No verified nominees. Complete KYC verification.
          </span>
        </div>
      )}

      {totalNominees === 0 && (
        <div className="mt-4 flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-800 dark:text-red-200">
            No nominees assigned. Add nominees to complete your will.
          </span>
        </div>
      )}
    </motion.div>
  )
}