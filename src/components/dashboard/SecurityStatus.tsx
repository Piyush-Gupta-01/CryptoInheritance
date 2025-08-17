'use client'

import { Shield, CheckCircle, AlertTriangle, Lock, Key, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'

interface SecurityCheck {
  id: string
  name: string
  description: string
  status: 'completed' | 'warning' | 'pending'
  icon: React.ComponentType<any>
}

export default function SecurityStatus() {
  const securityChecks: SecurityCheck[] = [
    {
      id: 'wallet_connected',
      name: 'Wallet Connected',
      description: 'Secure wallet connection established',
      status: 'completed',
      icon: Lock,
    },
    {
      id: '2fa_enabled',
      name: '2FA Authentication',
      description: 'Two-factor authentication enabled',
      status: 'warning',
      icon: Smartphone,
    },
    {
      id: 'backup_phrase',
      name: 'Recovery Phrase',
      description: 'Backup recovery phrase secured',
      status: 'completed',
      icon: Key,
    },
    {
      id: 'kyc_verified',
      name: 'KYC Verification',
      description: 'Identity verification completed',
      status: 'pending',
      icon: CheckCircle,
    },
  ]

  const completedChecks = securityChecks.filter(check => check.status === 'completed').length
  const totalChecks = securityChecks.length
  const securityScore = Math.round((completedChecks / totalChecks) * 100)

  const getScoreColor = () => {
    if (securityScore >= 80) return 'text-green-600'
    if (securityScore >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = () => {
    if (securityScore >= 80) return 'bg-green-500'
    if (securityScore >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'pending':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="crypto-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Security Status
        </h3>
        <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </div>

      {/* Security Score */}
      <div className="text-center mb-6">
        <div className={`text-3xl font-bold ${getScoreColor()}`}>
          {securityScore}%
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Security Score
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-20 h-20 mx-auto">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200 dark:text-gray-700"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={getScoreColor().replace('text-', 'text-')}
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${securityScore}, 100`}
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className={`h-6 w-6 ${getScoreColor()}`} />
          </div>
        </div>
      </div>

      {/* Security Checks */}
      <div className="space-y-3">
        {securityChecks.map((check, index) => (
          <motion.div
            key={check.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg border ${getStatusBg(check.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <check.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {check.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {check.description}
                  </div>
                </div>
              </div>
              {getStatusIcon(check.status)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 text-sm">
          Security Recommendations
        </h4>
        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
          {securityScore < 100 && (
            <>
              {securityChecks.find(c => c.id === '2fa_enabled')?.status !== 'completed' && (
                <li>• Enable two-factor authentication for enhanced security</li>
              )}
              {securityChecks.find(c => c.id === 'kyc_verified')?.status !== 'completed' && (
                <li>• Complete KYC verification to unlock all features</li>
              )}
              <li>• Regularly update your security settings</li>
              <li>• Keep your recovery phrase in a secure location</li>
            </>
          )}
          {securityScore === 100 && (
            <li>• Excellent! Your security setup is complete</li>
          )}
        </ul>
      </div>

      {/* Action Button */}
      <button className="w-full mt-4 crypto-button text-sm">
        Improve Security
      </button>
    </motion.div>
  )
}