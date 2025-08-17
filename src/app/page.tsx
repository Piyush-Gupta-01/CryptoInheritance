'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Lock, Globe, ArrowRight, CheckCircle, Zap, FileText } from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const features = [
  {
    icon: Shield,
    title: 'Multi-Level Security',
    description: 'Advanced encryption, 2FA, and decentralized identity protection for your digital assets.',
  },
  {
    icon: Users,
    title: 'Verified Nominees',
    description: 'Secure KYC verification ensures only legitimate beneficiaries can inherit your assets.',
  },
  {
    icon: Lock,
    title: 'Smart Contract Escrow',
    description: 'Assets remain locked in secure smart contracts until inheritance conditions are met.',
  },
  {
    icon: Globe,
    title: 'Multi-Chain Support',
    description: 'Manage inheritance across multiple blockchains from a single unified dashboard.',
  },
  {
    icon: Zap,
    title: 'Automated Triggers',
    description: 'Conditional release mechanisms with oracle verification and time-lock conditions.',
  },
  {
    icon: FileText,
    title: 'Legal Compliance',
    description: 'Designed to comply with global legal frameworks for digital asset inheritance.',
  },
]

const stats = [
  { label: 'Assets Protected', value: '$50M+' },
  { label: 'Active Wills', value: '1,200+' },
  { label: 'Verified Nominees', value: '3,500+' },
  { label: 'Supported Chains', value: '8' },
]

export default function HomePage() {
  const { isConnected } = useAccount()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                CryptoInheritance
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                How It Works
              </Link>
              <Link href="#security" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Security
              </Link>
              {isConnected && (
                <Link href="/dashboard" className="crypto-button">
                  Dashboard
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Secure Your Crypto
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}Legacy
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The first blockchain-based platform for secure cryptocurrency inheritance. 
              Create on-chain wills, verify nominees, and ensure your digital assets 
              reach the right hands through smart contracts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isConnected ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="crypto-button flex items-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <div className="crypto-button">
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <button onClick={openConnectModal} className="flex items-center space-x-2">
                        <span>Get Started</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    )}
                  </ConnectButton.Custom>
                </div>
              )}
              
              <Link
                href="#how-it-works"
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose CryptoInheritance?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built with cutting-edge blockchain technology and legal compliance in mind
            </p>
          </motion.div>

          <div className="crypto-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="crypto-card p-6"
              >
                <feature.icon className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simple steps to secure your digital legacy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Will',
                description: 'Connect your wallet and create an on-chain will with inheritance conditions and time locks.',
              },
              {
                step: '2',
                title: 'Add Nominees',
                description: 'Assign verified nominees with KYC verification and define asset allocation percentages.',
              },
              {
                step: '3',
                title: 'Secure Inheritance',
                description: 'Assets are automatically distributed to nominees when trigger conditions are met.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Bank-Grade Security
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Your assets are protected by multiple layers of security
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {[
                  'End-to-end encryption for all sensitive data',
                  'Multi-signature wallet integration',
                  'Decentralized identity verification',
                  'Oracle-based death certificate validation',
                  'Time-locked smart contracts',
                  'Regular security audits',
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="crypto-card p-8"
            >
              <Shield className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Trustless & Secure
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Built on battle-tested smart contracts with multiple security layers. 
                Your private keys remain in your control while ensuring seamless inheritance.
              </p>
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Audited by leading security firms</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Secure Your Digital Legacy?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of crypto holders who trust CryptoInheritance with their digital assets
            </p>
            
            {isConnected ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Create Your Will Now
              </button>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                  >
                    Connect Wallet to Start
                  </button>
                )}
              </ConnectButton.Custom>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">CryptoInheritance</span>
              </div>
              <p className="text-gray-400">
                Secure blockchain-based digital asset inheritance platform.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#security" className="hover:text-white">Security</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white">Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CryptoInheritance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}