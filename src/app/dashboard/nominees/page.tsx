'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Mail,
  Phone,
  Wallet,
  Edit,
  Trash2,
  MoreVertical,
  UserCheck,
  UserX,
  FileText
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useWills } from '@/hooks/useWills'

interface NomineeWithWill {
  id: string
  address: string
  name?: string          // <-- made optional
  email?: string
  phone?: string
  percentage: number
  isVerified: boolean
  isActive: boolean
  willId: string
  willName: string
  addedTimestamp: number
}


export default function NomineesPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddNominee, setShowAddNominee] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { wills, loading } = useWills(address)

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

  // Flatten nominees from all wills
  // Flatten nominees from all wills
const allNominees: NomineeWithWill[] = wills?.flatMap(will => 
  will.nominees?.map(nominee => ({
    ...nominee,
    id: `${will.id}-${nominee.address}`,
    willId: will.id,
    willName: will.name || `Will #${will.id}`,
    name: nominee.name ?? 'Unnamed Nominee',  // <-- fallback string
    addedTimestamp: Math.floor(Date.now() / 1000 - Math.random() * 86400 * 30) // Mock timestamp
  })) || []
) || []


  const filteredNominees = allNominees.filter(nominee => {
    const matchesSearch = nominee.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         nominee.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nominee.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'verified' && nominee.isVerified) ||
                         (filterStatus === 'pending' && !nominee.isVerified && nominee.isActive) ||
                         (filterStatus === 'inactive' && !nominee.isActive)
    
    return matchesSearch && matchesFilter
  })

  const stats = [
    {
      label: 'Total Nominees',
      value: allNominees.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      label: 'Verified',
      value: allNominees.filter(n => n.isVerified).length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      label: 'Pending Verification',
      value: allNominees.filter(n => !n.isVerified && n.isActive).length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    },
    {
      label: 'Inactive',
      value: allNominees.filter(n => !n.isActive).length,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
    },
  ]

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const getStatusBadge = (nominee: NomineeWithWill) => {
    if (!nominee.isActive) {
      return <span className="status-badge status-rejected">Inactive</span>
    }
    if (nominee.isVerified) {
      return <span className="status-badge status-verified">Verified</span>
    }
    return <span className="status-badge status-pending">Pending</span>
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Nominees
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your inheritance beneficiaries
            </p>
          </div>
          
          <button
            onClick={() => setShowAddNominee(true)}
            className="crypto-button flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Nominee</span>
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
              placeholder="Search nominees by name, address, or email..."
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
              <option value="all">All Nominees</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Nominees List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredNominees.length > 0 ? (
            <div className="space-y-4">
              {filteredNominees.map((nominee) => (
                <motion.div
                  key={nominee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="crypto-card p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {nominee.name || 'Unnamed Nominee'}
                          </h3>
                          {getStatusBadge(nominee)}
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Wallet className="h-4 w-4" />
                            <span className="font-mono">{nominee.address}</span>
                          </div>
                          
                          {nominee.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>{nominee.email}</span>
                            </div>
                          )}
                          
                          {nominee.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>{nominee.phone}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>Will: {nominee.willName}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {nominee.percentage / 100}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Inheritance
                        </div>
                      </div>
                      
                      <div className="relative">
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Added: {formatDate(nominee.addedTimestamp)}
                      </span>
                      
                      <div className="flex items-center space-x-4">
                        {!nominee.isVerified && nominee.isActive && (
                          <button className="text-blue-600 dark:text-blue-400 hover:underline">
                            Send KYC Reminder
                          </button>
                        )}
                        
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No nominees found' : 'No nominees added yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Add nominees to your wills to ensure your assets reach the right people'
                }
              </p>
              {(!searchTerm && filterStatus === 'all') && (
                <button
                  onClick={() => setShowAddNominee(true)}
                  className="crypto-button"
                >
                  Add Your First Nominee
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* KYC Status Overview */}
        {allNominees.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="crypto-card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              KYC Verification Overview
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round((allNominees.filter(n => n.isVerified).length / allNominees.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Verification Rate
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {allNominees.filter(n => !n.isVerified && n.isActive).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Pending Verification
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {allNominees.filter(n => n.isVerified).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Ready for Inheritance
                </div>
              </div>
            </div>

            {allNominees.filter(n => !n.isVerified && n.isActive).length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      Action Required
                    </h4>
                    <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
                      {allNominees.filter(n => !n.isVerified && n.isActive).length} nominee(s) need to complete KYC verification. 
                      Send them reminders to ensure they can inherit your assets.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Add Nominee Modal would go here */}
      {showAddNominee && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddNominee(false)} />
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add Nominee Feature
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This feature would open a modal to add a new nominee to one of your wills.
              </p>
              <button
                onClick={() => setShowAddNominee(false)}
                className="crypto-button w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}