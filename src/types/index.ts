// Core types for the CryptoInheritance platform

export interface User {
  address: string
  isKYCVerified: boolean
  createdAt: number
  lastActivity: number
}

export interface Will {
  id: string
  name: string
  owner: string
  isActive: boolean
  isTriggered: boolean
  createdTimestamp: number
  lastActivityTimestamp: number
  inactivityPeriod: number
  nomineeCount: number
  totalPercentage: number
  requiresOracle: boolean
  encryptedWillDocument?: string
  nominees: Nominee[]
  assets: Asset[]
  totalValue: number
}

export interface Nominee {
  id?: string
  address: string
  percentage: number
  isVerified: boolean
  isActive: boolean
  name?: string
  email?: string
  phone?: string
  encryptedDetails?: string
  addedTimestamp: number
  kycStatus: KYCStatus
}

export interface Asset {
  tokenAddress: string
  symbol: string
  name: string
  balance: number
  value: number
  change24h: number
  logo?: string
  decimals?: number
  isNative?: boolean
}

export interface KYCRecord {
  id: string
  userAddress: string
  status: KYCStatus
  documentHash: string
  verifier?: string
  submissionTimestamp: number
  verificationTimestamp?: number
  expiryTimestamp?: number
  rejectionReason?: string
  isActive: boolean
}

export enum KYCStatus {
  NotSubmitted = 'not_submitted',
  Pending = 'pending',
  Verified = 'verified',
  Rejected = 'rejected',
  Expired = 'expired'
}

export interface CrossChainWill {
  id: string
  owner: string
  sourceChainId: number
  targetChainId: number
  willHash: string
  isActive: boolean
  isTriggered: boolean
  createdTimestamp: number
  lockedAssets: Record<string, number>
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  backupPhraseSecured: boolean
  walletConnected: boolean
  kycCompleted: boolean
  securityScore: number
}

export interface ActivityLog {
  id: string
  type: ActivityType
  message: string
  timestamp: number
  userAddress: string
  willId?: string
  metadata?: Record<string, any>
}

export enum ActivityType {
  WillCreated = 'will_created',
  WillUpdated = 'will_updated',
  NomineeAdded = 'nominee_added',
  NomineeVerified = 'nominee_verified',
  AssetDeposited = 'asset_deposited',
  AssetWithdrawn = 'asset_withdrawn',
  InheritanceTriggered = 'inheritance_triggered',
  InheritanceClaimed = 'inheritance_claimed',
  KYCSubmitted = 'kyc_submitted',
  KYCVerified = 'kyc_verified',
  SecurityUpdated = 'security_updated'
}

export interface ChainInfo {
  chainId: number
  name: string
  symbol: string
  rpcUrl: string
  blockExplorer: string
  isSupported: boolean
  isActive: boolean
  bridgeContract?: string
}

export interface OracleVerification {
  id: string
  willId: string
  oracleAddress: string
  deathCertificateHash: string
  signature: string
  timestamp: number
  isVerified: boolean
}

export interface InheritanceTrigger {
  id: string
  willId: string
  triggerType: TriggerType
  triggerAddress: string
  timestamp: number
  proofHash?: string
  signature?: string
  isProcessed: boolean
}

export enum TriggerType {
  Inactivity = 'inactivity',
  Oracle = 'oracle',
  Manual = 'manual',
  Emergency = 'emergency'
}

export interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  activityUpdates: boolean
  securityAlerts: boolean
  inheritanceAlerts: boolean
}

export interface LegalDocument {
  id: string
  willId: string
  type: DocumentType
  fileName: string
  fileHash: string
  uploadTimestamp: number
  isEncrypted: boolean
  ipfsHash?: string
}

export enum DocumentType {
  Will = 'will',
  Trust = 'trust',
  PowerOfAttorney = 'power_of_attorney',
  DeathCertificate = 'death_certificate',
  IdentityDocument = 'identity_document',
  Other = 'other'
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Form types
export interface CreateWillForm {
  name: string
  description?: string
  inactivityPeriod: number
  requiresOracle: boolean
  legalDocument?: File
}

export interface AddNomineeForm {
  address: string
  name: string
  email?: string
  phone?: string
  percentage: number
}

export interface KYCSubmissionForm {
  documentType: DocumentType
  document: File
  additionalInfo?: string
}

export interface SecuritySettingsForm {
  twoFactorEnabled: boolean
  notificationSettings: NotificationSettings
}

// Contract interaction types
export interface ContractCall {
  contractAddress: string
  functionName: string
  args: any[]
  value?: string
}

export interface TransactionResult {
  hash: string
  blockNumber?: number
  gasUsed?: string
  status: 'pending' | 'success' | 'failed'
  error?: string
}

// Utility types
export type Address = `0x${string}`
export type Hash = `0x${string}`
export type Signature = `0x${string}`

export interface TokenInfo {
  address: Address
  symbol: string
  name: string
  decimals: number
  logo?: string
}

export interface PriceData {
  tokenAddress: string
  price: number
  change24h: number
  lastUpdated: number
}

export interface GasEstimate {
  gasLimit: string
  gasPrice: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}

// Error types
export class CryptoInheritanceError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message)
    this.name = 'CryptoInheritanceError'
  }
}

export enum ErrorCode {
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  KYC_REQUIRED = 'KYC_REQUIRED',
  WILL_NOT_ACTIVE = 'WILL_NOT_ACTIVE',
  NOMINEE_NOT_VERIFIED = 'NOMINEE_NOT_VERIFIED'
}