'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  Users, 
  DollarSign,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import WillCard from '@/components/dashboard/WillCard'
import CreateWillModal from '@/components/modals/CreateWillModal'
import { useWills } from '@/hooks/useWills'

export default function WillsPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [showCreateWill, setShowCreateWill] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [mounted, setMounted] = useState(false)

  const { wills, loading, refetch } = useWills(address)

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

  const filteredWills = wills?.filter(will => {
    const matchesSearch = will.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         will.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && will.isActive && !will.isTriggered) ||
                         (filterStatus === 'triggered' && will.isTriggered) ||
                         (filterStatus === 'inactive' && !will.isActive)
    
    return matchesSearch && matchesFilter
  }) || []

  const stats = [
    {
      label: 'Total Wills',
      value: wills?.length || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      label: 'Active Wills',
      value: wills?.filter(w => w.isActive && !w.isTriggered).length || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      label: 'Total Value',
      value: `$${wills?.reduce((sum, w) => sum + (w.totalValue || 0), 0).toLocaleString() || '0'}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      label: 'Total Nominees',
      value: wills?.reduce((sum, w) => sum + (w.nominees?.length || 0), 0) || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Wills
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your digital asset inheritance wills
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateWill(true)}
            className="crypto-button flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Will</span>
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

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search wills by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="crypto-input pl-10"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="crypto-input pl-10 pr-8 appearance-none"
            >
              <option value="all">All Wills</option>
              <option value="active">Active</option>
              <option value="triggered">Triggered</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Wills List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredWills.length > 0 ? (
            <div className="space-y-6">
              {filteredWills.map((will) => (
                <WillCard 
                  key={will.id} 
                  will={will}
                  onEdit={() => {
                    // Handle edit will
                    console.log('Edit will:', will.id)
                  }}
                  onDelete={() => {
                    // Handle delete will
                    console.log('Delete will:', will.id)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No wills found' : 'No wills created yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first will to start protecting your digital assets'
                }
              </p>
              {(!searchTerm && filterStatus === 'all') && (
                <button
                  onClick={() => setShowCreateWill(true)}
                  className="crypto-button"
                >
                  Create Your First Will
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        {wills && wills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="crypto-card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowCreateWill(true)}
                className="flex items-center space-x-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
              >
                <Plus className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Create New Will</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Set up inheritance for new assets</div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/dashboard/nominees')}
                className="flex items-center space-x-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
              >
                <Users className="h-6 w-6 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Manage Nominees</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Add or verify beneficiaries</div>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
                <Clock className="h-6 w-6 text-orange-600" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Update Activity</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Proof of life for all wills</div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Create Will Modal */}
      {showCreateWill && (
        <CreateWillModal
          isOpen={showCreateWill}
          onClose={() => setShowCreateWill(false)}
          onSuccess={() => {
            setShowCreateWill(false)
            refetch()
          }}
        />
      )}
    </DashboardLayout>
  )
}