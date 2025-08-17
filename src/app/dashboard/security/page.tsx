'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  Key, 
  Smartphone, 
  Eye,
  EyeOff,
  Fingerprint,
  Globe,
  Clock,
  FileText,
  UserCheck,
  Settings,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'

interface SecurityCheck {
  id: string
  name: string
  description: string
  status: 'completed' | 'warning' | 'pending' | 'critical'
  icon: React.ComponentType<any>
  action?: string
  lastUpdated?: string
}

export default function SecurityPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)

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

  const securityChecks: SecurityCheck[] = [
    {
      id: 'wallet_connected',
      name: 'Wallet Connection',
      description: 'Secure wallet connection established',
      status: 'completed',
      icon: Lock,
      lastUpdated: '2 hours ago',
    },
    {
      id: '2fa_enabled',
      name: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      status: twoFactorEnabled ? 'completed' : 'warning',
      icon: Smartphone,
      action: twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA',
    },
    {
      id: 'backup_phrase',
      name: 'Recovery Phrase Backup',
      description: 'Secure backup of your recovery phrase',
      status: 'completed',
      icon: Key,
      action: 'View Backup',
      lastUpdated: '1 week ago',
    },
    {
      id: 'kyc_verified',
      name: 'Identity Verification',
      description: 'Complete KYC verification for full access',
      status: 'pending',
      icon: UserCheck,
      action: 'Complete KYC',
    },
    {
      id: 'biometric_auth',
      name: 'Biometric Authentication',
      description: 'Use fingerprint or face recognition',
      status: biometricEnabled ? 'completed' : 'pending',
      icon: Fingerprint,
      action: biometricEnabled ? 'Disable Biometric' : 'Enable Biometric',
    },
    {
      id: 'session_management',
      name: 'Session Management',
      description: 'Active sessions and device management',
      status: 'completed',
      icon: Globe,
      action: 'Manage Sessions',
      lastUpdated: '1 day ago',
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
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
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      case 'critical':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  }

  const mockRecoveryPhrase = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Security Center
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your account security and privacy settings
            </p>
          </div>
          
          <button className="crypto-button flex items-center space-x-2">
            <RefreshCw className="h-5 w-5" />
            <span>Security Scan</span>
          </button>
        </div>

        {/* Security Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="crypto-card p-8"
        >
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
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
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor()}`}>
                    {securityScore}%
                  </div>
                  <Shield className={`h-8 w-8 ${getScoreColor()} mx-auto mt-1`} />
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Security Score
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {securityScore >= 80 ? 'Excellent security setup!' : 
               securityScore >= 60 ? 'Good security, but room for improvement' : 
               'Your security needs attention'}
            </p>
          </div>
        </motion.div>

        {/* Security Checks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="crypto-card p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Security Checklist
          </h3>
          
          <div className="space-y-4">
            {securityChecks.map((check, index) => (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getStatusBg(check.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <check.icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {check.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {check.description}
                      </div>
                      {check.lastUpdated && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Last updated: {check.lastUpdated}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(check.status)}
                    {check.action && (
                      <button 
                        onClick={() => {
                          if (check.id === '2fa_enabled') {
                            setTwoFactorEnabled(!twoFactorEnabled)
                          } else if (check.id === 'biometric_auth') {
                            setBiometricEnabled(!biometricEnabled)
                          }
                        }}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {check.action}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recovery & Backup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="crypto-card p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recovery & Backup
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Recovery Phrase
                </h4>
                <button
                  onClick={() => setShowRecoveryPhrase(!showRecoveryPhrase)}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                >
                  {showRecoveryPhrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span>{showRecoveryPhrase ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {showRecoveryPhrase ? (
                  <div className="font-mono text-sm text-gray-900 dark:text-white">
                    {mockRecoveryPhrase}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30">
                  <Upload className="h-4 w-4" />
                  <span>Backup</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">
                Emergency Contacts
              </h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Primary Contact
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    john.doe@example.com
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Secondary Contact
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    jane.smith@example.com
                  </div>
                </div>
              </div>
              
              <button className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                Manage Emergency Contacts
              </button>
            </div>
          </div>
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="crypto-card p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Security Activity
          </h3>
          
          <div className="space-y-4">
            {[
              {
                action: 'Wallet connected',
                time: '2 hours ago',
                location: 'New York, US',
                status: 'success'
              },
              {
                action: 'Security settings updated',
                time: '1 day ago',
                location: 'New York, US',
                status: 'success'
              },
              {
                action: 'Failed login attempt',
                time: '3 days ago',
                location: 'Unknown location',
                status: 'warning'
              },
              {
                action: 'Recovery phrase accessed',
                time: '1 week ago',
                location: 'New York, US',
                status: 'info'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {activity.location}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            View Full Activity Log
          </button>
        </motion.div>

        {/* Security Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="crypto-card p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Security Recommendations
          </h3>
          
          <div className="space-y-4">
            {securityScore < 100 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Improve Your Security Score
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  {!twoFactorEnabled && <li>• Enable two-factor authentication</li>}
                  {securityChecks.find(c => c.id === 'kyc_verified')?.status === 'pending' && (
                    <li>• Complete identity verification</li>
                  )}
                  {!biometricEnabled && <li>• Set up biometric authentication</li>}
                  <li>• Regularly review your security settings</li>
                  <li>• Keep your recovery phrase secure and backed up</li>
                </ul>
              </div>
            )}
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                Best Practices
              </h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• Use a hardware wallet for maximum security</li>
                <li>• Never share your private keys or recovery phrase</li>
                <li>• Regularly update your passwords</li>
                <li>• Monitor your account activity frequently</li>
                <li>• Use different passwords for different accounts</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}