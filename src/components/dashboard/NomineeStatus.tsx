'use client'

import { Users, CheckCircle, Clock, AlertTriangle, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'

interface Nominee {
  address: string
  percentage: number
  isVerified: boolean
  isActive: boolean
  name?: string
}

interface Will {
  id: string
  nominees: Nominee[]
}

interface NomineeStatusProps {
  wills: Will[]
}

export default function NomineeStatus({ wills }: NomineeStatusProps) {
  const allNominees = wills?.flatMap(will => will.nominees) || []
  const totalNominees = allNominees.length
  const verifiedNominees = allNominees.filter(n => n.isVerified).length
  const pendingNominees = allNominees.filter(n => !n.isVerified && n.isActive).length
  const inactiveNominees = allNominees.filter(n => !n.isActive).length

  const verificationRate = totalNominees > 0 ? (verifiedNominees / totalNominees) * 100 : 0

  const getStatusColor = () => {
    if (verificationRate >= 80) return 'text-green-600'
    if (verificationRate >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusMessage = () => {
    if (totalNominees === 0) return 'No nominees added yet'
    if (verificationRate === 100) return 'All nominees verified'
    if (pendingNominees > 0) return `${pendingNominees} nominees pending verification`
    return 'Nominee verification in progress'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="crypto-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Nominee Status
        </h3>
        <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </div>

      {totalNominees === 0 ? (
        <div className="text-center py-8">
          <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Nominees Yet
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add nominees to your wills to ensure your assets reach the right people
          </p>
          <button className="crypto-button text-sm">
            Add First Nominee
          </button>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalNominees}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Nominees
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStatusColor()}`}>
                {verificationRate.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Verified
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Verification Progress</span>
              <span>{verifiedNominees}/{totalNominees}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  verificationRate >= 80 ? 'bg-green-500' :
                  verificationRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${verificationRate}%` }}
              />
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="space-y-3">
            {verifiedNominees > 0 && (
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Verified Nominees
                  </span>
                </div>
                <span className="text-sm font-bold text-green-800 dark:text-green-200">
                  {verifiedNominees}
                </span>
              </div>
            )}

            {pendingNominees > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Pending Verification
                  </span>
                </div>
                <span className="text-sm font-bold text-yellow-800 dark:text-yellow-200">
                  {pendingNominees}
                </span>
              </div>
            )}

            {inactiveNominees > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    Inactive Nominees
                  </span>
                </div>
                <span className="text-sm font-bold text-red-800 dark:text-red-200">
                  {inactiveNominees}
                </span>
              </div>
            )}
          </div>

          {/* Status Message */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {getStatusMessage()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 space-y-2">
            <button className="w-full text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 py-2 px-4 rounded-lg transition-colors">
              Manage Nominees
            </button>
            
            {pendingNominees > 0 && (
              <button className="w-full text-sm bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 py-2 px-4 rounded-lg transition-colors">
                Check Verification Status
              </button>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}