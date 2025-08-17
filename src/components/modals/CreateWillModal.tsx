'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Clock, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const createWillSchema = z.object({
  name: z.string().min(1, 'Will name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  inactivityPeriod: z.number().min(365, 'Minimum 1 year').max(3650, 'Maximum 10 years'),
  requiresOracle: z.boolean(),
  legalDocument: z.any().optional(),
})

type CreateWillForm = z.infer<typeof createWillSchema>

interface CreateWillModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateWillModal({ isOpen, onClose, onSuccess }: CreateWillModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateWillForm>({
    resolver: zodResolver(createWillSchema),
    defaultValues: {
      inactivityPeriod: 365,
      requiresOracle: true,
    },
  })

  const watchedValues = watch()

  const handleClose = () => {
    reset()
    setStep(1)
    setUploadedFile(null)
    onClose()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setValue('legalDocument', file)
    }
  }

  const onSubmit = async (data: CreateWillForm) => {
    setIsSubmitting(true)
    try {
      // Here you would integrate with your smart contract
      console.log('Creating will with data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onSuccess()
      handleClose()
    } catch (error) {
      console.error('Error creating will:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPeriod = (days: number) => {
    const years = Math.floor(days / 365)
    const remainingDays = days % 365
    const months = Math.floor(remainingDays / 30)
    
    if (years > 0 && months > 0) {
      return `${years} year${years > 1 ? 's' : ''} and ${months} month${months > 1 ? 's' : ''}`
    } else if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`
    } else {
      return `${days} day${days > 1 ? 's' : ''}`
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Create New Will
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Step {step} of 3
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Basic Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Will Name *
                        </label>
                        <input
                          {...register('name')}
                          type="text"
                          placeholder="e.g., My Crypto Inheritance Will"
                          className="crypto-input"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description (Optional)
                        </label>
                        <textarea
                          {...register('description')}
                          rows={3}
                          placeholder="Brief description of your will and inheritance instructions"
                          className="crypto-input"
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Inheritance Settings */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Inheritance Settings
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Inactivity Period *
                        </label>
                        <div className="space-y-3">
                          <input
                            {...register('inactivityPeriod', { valueAsNumber: true })}
                            type="range"
                            min="365"
                            max="3650"
                            step="30"
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>1 year</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {formatPeriod(watchedValues.inactivityPeriod)}
                            </span>
                            <span>10 years</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          Time period after which inheritance can be triggered if no activity is detected
                        </p>
                        {errors.inactivityPeriod && (
                          <p className="mt-1 text-sm text-red-600">{errors.inactivityPeriod.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-3">
                          <input
                            {...register('requiresOracle')}
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Require Oracle Verification
                            </span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Require verified death certificate from authorized oracles
                            </p>
                          </div>
                        </label>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                              Security Features
                            </h4>
                            <ul className="mt-2 text-sm text-blue-800 dark:text-blue-200 space-y-1">
                              <li>• Multi-signature wallet integration</li>
                              <li>• Encrypted nominee details</li>
                              <li>• Time-locked smart contracts</li>
                              <li>• Oracle-based verification</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Legal Documents */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Legal Documents (Optional)
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Upload Legal Will Document
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="legal-document"
                          />
                          <label
                            htmlFor="legal-document"
                            className="cursor-pointer flex flex-col items-center space-y-2"
                          >
                            <FileText className="h-8 w-8 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Click to upload or drag and drop
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              PDF, DOC, DOCX up to 10MB
                            </span>
                          </label>
                        </div>
                        
                        {uploadedFile && (
                          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-800 dark:text-green-200">
                                {uploadedFile.name} uploaded successfully
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                              Legal Disclaimer
                            </h4>
                            <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
                              This platform provides technical infrastructure for digital asset inheritance. 
                              Please consult with legal professionals to ensure compliance with local laws 
                              and regulations regarding digital asset inheritance.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                          Will Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Name:</span>
                            <span className="text-gray-900 dark:text-white">{watchedValues.name || 'Untitled Will'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Inactivity Period:</span>
                            <span className="text-gray-900 dark:text-white">{formatPeriod(watchedValues.inactivityPeriod)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Oracle Verification:</span>
                            <span className="text-gray-900 dark:text-white">
                              {watchedValues.requiresOracle ? 'Required' : 'Not Required'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Legal Document:</span>
                            <span className="text-gray-900 dark:text-white">
                              {uploadedFile ? 'Uploaded' : 'None'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-3">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Previous
                    </button>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="crypto-button"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="crypto-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSubmitting && <div className="spinner" />}
                      <span>{isSubmitting ? 'Creating...' : 'Create Will'}</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
}