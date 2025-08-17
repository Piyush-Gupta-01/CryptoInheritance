'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Plus, 
  FileText, 
  Users, 
  Shield, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Settings
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import WillCard from '@/components/dashboard/WillCard'
import AssetOverview from '@/components/dashboard/AssetOverview'
import NomineeStatus from '@/components/dashboard/NomineeStatus'
import SecurityStatus from '@/components/dashboard/SecurityStatus'
import CreateWillModal from '@/components/modals/CreateWillModal'
import { useWills } from '@/hooks/useWills'
import { useAssets } from '@/hooks/useAssets'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [showCreateWill, setShowCreateWill] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { wills, loading: willsLoading, refetch: refetchWills } = useWills(address)
  const { assets, totalValue, loading: assetsLoading } = useAssets(address)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isConnected) {
      router.push('/')
    }
  }, [isConnected, mounted, router])

  if (!mounted || !isConnected) {
    return null
  }

  const stats = [
    {
      label: 'Total Assets Protected',
      value: totalValue ? `$${totalValue.toLocaleString()}` : '$0',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      label: 'Active Wills',
      value: wills?.filter(w => w.isActive).length || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      label: 'Verified Nominees',
      value: wills?.reduce((acc, w) => acc + (w.nominees?.filter(n => n.isVerified).length || 0), 0) || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      label: 'Security Score',
      value: '95%',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'will_created',
      message: 'New will created for ETH inheritance',
      timestamp: '2 hours ago',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      id: 2,
      type: 'nominee_verified',
      message: 'Nominee John Doe completed KYC verification',
      timestamp: '1 day ago',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      id: 3,
      type: 'asset_deposited',
      message: 'Deposited 2.5 ETH to Will #001',
      timestamp: '3 days ago',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      id: 4,
      type: 'security_update',
      message: 'Security settings updated',
      timestamp: '1 week ago',
      icon: Shield,
      color: 'text-yellow-600',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your digital asset inheritance
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateWill(true)}
            className="crypto-button flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Will</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="crypto-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="crypto-card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Wills and Assets */}
          <div className="lg:col-span-2 space-y-8">
            {/* Asset Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <AssetOverview assets={assets} loading={assetsLoading} />
            </motion.div>

            {/* Wills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="crypto-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Wills
                </h2>
                <button
                  onClick={() => router.push('/dashboard/wills')}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                >
                  <span>View All</span>
                  <Eye className="h-4 w-4" />
                </button>
              </div>

              {willsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : wills && wills.length > 0 ? (
                <div className="space-y-4">
                  {wills.slice(0, 3).map((will) => (
                    <WillCard key={will.id} will={will} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No wills created yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first will to start protecting your digital assets
                  </p>
                  <button
                    onClick={() => setShowCreateWill(true)}
                    className="crypto-button"
                  >
                    Create Your First Will
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Status and Activity */}
          <div className="space-y-8">
            {/* Security Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <SecurityStatus />
            </motion.div>

            {/* Nominee Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <NomineeStatus wills={wills} />
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="crypto-card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800`}>
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View all activity
              </button>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="crypto-card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowCreateWill(true)}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-900 dark:text-white">Create New Will</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard/nominees')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-900 dark:text-white">Manage Nominees</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard/security')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-gray-900 dark:text-white">Security Settings</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard/settings')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-900 dark:text-white">Settings</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Create Will Modal */}
      {showCreateWill && (
        <CreateWillModal
          isOpen={showCreateWill}
          onClose={() => setShowCreateWill(false)}
          onSuccess={() => {
            setShowCreateWill(false)
            refetchWills()
          }}
        />
      )}
    </DashboardLayout>
  )
}