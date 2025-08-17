'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Globe, 
  Palette, 
  Shield, 
  CreditCard,
  Download,
  Upload,
  Trash2,
  Save,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Languages,
  DollarSign,
  Clock,
  HelpCircle
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    language: 'en',
    currency: 'USD'
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    activityUpdates: true,
    securityAlerts: true,
    inheritanceAlerts: true,
    marketingEmails: false,
    weeklyReports: true
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showBalances: true,
    publicProfile: false,
    dataSharing: false,
    analytics: true
  })

  // Platform settings
  const [platform, setPlatform] = useState({
    autoLock: 15, // minutes
    sessionTimeout: 60, // minutes
    defaultGasPrice: 'standard',
    confirmTransactions: true
  })

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

  const handleSaveProfile = () => {
    // Save profile data
    console.log('Saving profile:', profileData)
  }

  const handleSaveNotifications = () => {
    // Save notification settings
    console.log('Saving notifications:', notifications)
  }

  const handleExportData = () => {
    // Export user data
    console.log('Exporting data...')
  }

  const handleDeleteAccount = () => {
    // Delete account
    console.log('Deleting account...')
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account preferences and platform settings
          </p>
        </div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="crypto-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                className="crypto-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="crypto-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                className="crypto-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Wallet Address
              </label>
              <input
                type="text"
                value={address}
                disabled
                className="crypto-input bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={profileData.timezone}
                onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                className="crypto-input"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={profileData.language}
                onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                className="crypto-input"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={handleSaveProfile} className="crypto-button flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="crypto-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Appearance
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    theme === 'light' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Light</div>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    theme === 'dark' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Moon className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Dark</div>
                </button>

                <button
                  onClick={() => setTheme('system')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    theme === 'system' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Monitor className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">System</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Currency Display
              </label>
              <select
                value={profileData.currency}
                onChange={(e) => setProfileData({...profileData, currency: e.target.value})}
                className="crypto-input max-w-xs"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="BTC">BTC (₿)</option>
                <option value="ETH">ETH (Ξ)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="crypto-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Notification Channels
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">SMS Notifications</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via SMS</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Push Notifications</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Receive browser push notifications</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Notification Types
              </h3>
              <div className="space-y-4">
                {[
                  { key: 'activityUpdates', label: 'Activity Updates', desc: 'Will creation, nominee changes, etc.' },
                  { key: 'securityAlerts', label: 'Security Alerts', desc: 'Login attempts, security changes' },
                  { key: 'inheritanceAlerts', label: 'Inheritance Alerts', desc: 'Inheritance triggers and claims' },
                  { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Product updates and promotions' },
                  { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Summary of your account activity' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={handleSaveNotifications} className="crypto-button flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save Notifications</span>
            </button>
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="crypto-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Privacy & Security
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { 
                key: 'showBalances', 
                label: 'Show Asset Balances', 
                desc: 'Display actual balance amounts in the interface',
                icon: privacy.showBalances ? Eye : EyeOff
              },
              { 
                key: 'publicProfile', 
                label: 'Public Profile', 
                desc: 'Allow others to view your public profile information',
                icon: User
              },
              { 
                key: 'dataSharing', 
                label: 'Data Sharing', 
                desc: 'Share anonymized data to improve the platform',
                icon: Globe
              },
              { 
                key: 'analytics', 
                label: 'Analytics', 
                desc: 'Allow collection of usage analytics',
                icon: SettingsIcon
              }
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={privacy[item.key as keyof typeof privacy]}
                  onChange={(e) => setPrivacy({...privacy, [item.key]: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </motion.div>

        {/* Platform Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="crypto-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <SettingsIcon className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Platform Settings
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Auto-lock Timeout (minutes)
              </label>
              <select
                value={platform.autoLock}
                onChange={(e) => setPlatform({...platform, autoLock: parseInt(e.target.value)})}
                className="crypto-input"
              >
                <option value={5}>5 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={0}>Never</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Gas Price
              </label>
              <select
                value={platform.defaultGasPrice}
                onChange={(e) => setPlatform({...platform, defaultGasPrice: e.target.value})}
                className="crypto-input"
              >
                <option value="slow">Slow (Lower fees)</option>
                <option value="standard">Standard</option>
                <option value="fast">Fast (Higher fees)</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={platform.confirmTransactions}
                onChange={(e) => setPlatform({...platform, confirmTransactions: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Confirm All Transactions</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Require confirmation for all blockchain transactions</div>
              </div>
            </label>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="crypto-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Download className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Data Management
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Export Data</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Download all your account data</div>
              </div>
              <button 
                onClick={handleExportData}
                className="flex items-center space-x-2 py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div>
                <div className="font-medium text-red-900 dark:text-red-100">Delete Account</div>
                <div className="text-sm text-red-700 dark:text-red-200">Permanently delete your account and all data</div>
              </div>
              <button 
                onClick={handleDeleteAccount}
                className="flex items-center space-x-2 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Help & Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="crypto-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <HelpCircle className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Help & Support
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button className="flex items-center space-x-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
              <HelpCircle className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Help Center</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Browse our knowledge base</div>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
              <Mail className="h-6 w-6 text-green-600" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Contact Support</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Get help from our team</div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}