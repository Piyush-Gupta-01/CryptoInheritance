// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title KYCVerification
 * @dev Smart contract for managing KYC verification for CryptoInheritance platform
 */
contract KYCVerification is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Events
    event KYCSubmitted(address indexed user, bytes32 indexed documentHash);
    event KYCVerified(address indexed user, address indexed verifier);
    event KYCRejected(address indexed user, address indexed verifier, string reason);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    event DocumentUpdated(address indexed user, bytes32 indexed newDocumentHash);

    // Enums
    enum KYCStatus {
        NotSubmitted,
        Pending,
        Verified,
        Rejected
    }

    // Structs
    struct KYCRecord {
        KYCStatus status;
        bytes32 documentHash;
        address verifier;
        uint256 submissionTimestamp;
        uint256 verificationTimestamp;
        string rejectionReason;
        uint256 expiryTimestamp;
        bool isActive;
    }

    struct VerifierInfo {
        bool isActive;
        string name;
        string licenseNumber;
        uint256 addedTimestamp;
        uint256 verificationsCount;
    }

    // State variables
    mapping(address => KYCRecord) public kycRecords;
    mapping(address => VerifierInfo) public verifiers;
    mapping(bytes32 => bool) public usedDocumentHashes;
    
    address[] public verifierList;
    uint256 public constant KYC_VALIDITY_PERIOD = 365 days; // 1 year
    uint256 public verificationFee = 0.01 ether;
    address public feeRecipient;

    // Modifiers
    modifier onlyVerifier() {
        require(verifiers[msg.sender].isActive, "Not an active verifier");
        _;
    }

    modifier validKYCStatus(address user, KYCStatus expectedStatus) {
        require(kycRecords[user].status == expectedStatus, "Invalid KYC status");
        _;
    }

    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev Submit KYC documents for verification
     * @param documentHash Hash of the encrypted KYC documents
     */
    function submitKYC(bytes32 documentHash) external payable nonReentrant {
        require(msg.value >= verificationFee, "Insufficient verification fee");
        require(documentHash != bytes32(0), "Invalid document hash");
        require(!usedDocumentHashes[documentHash], "Document hash already used");
        
        KYCRecord storage record = kycRecords[msg.sender];
        require(
            record.status == KYCStatus.NotSubmitted || 
            record.status == KYCStatus.Rejected ||
            (record.status == KYCStatus.Verified && block.timestamp > record.expiryTimestamp),
            "KYC already submitted or verified"
        );

        record.status = KYCStatus.Pending;
        record.documentHash = documentHash;
        record.submissionTimestamp = block.timestamp;
        record.verifier = address(0);
        record.verificationTimestamp = 0;
        record.rejectionReason = "";
        record.isActive = true;

        usedDocumentHashes[documentHash] = true;

        // Transfer fee to recipient
        if (msg.value > 0) {
            payable(feeRecipient).transfer(msg.value);
        }

        emit KYCSubmitted(msg.sender, documentHash);
    }

    /**
     * @dev Verify KYC documents
     * @param user User address to verify
     * @param approved Whether to approve or reject
     * @param reason Reason for rejection (if applicable)
     */
    function verifyKYC(
        address user,
        bool approved,
        string memory reason
    ) external onlyVerifier validKYCStatus(user, KYCStatus.Pending) {
        KYCRecord storage record = kycRecords[user];
        VerifierInfo storage verifierInfo = verifiers[msg.sender];

        record.verifier = msg.sender;
        record.verificationTimestamp = block.timestamp;

        if (approved) {
            record.status = KYCStatus.Verified;
            record.expiryTimestamp = block.timestamp + KYC_VALIDITY_PERIOD;
            record.rejectionReason = "";
            
            verifierInfo.verificationsCount++;
            
            emit KYCVerified(user, msg.sender);
        } else {
            record.status = KYCStatus.Rejected;
            record.rejectionReason = reason;
            record.expiryTimestamp = 0;
            
            emit KYCRejected(user, msg.sender, reason);
        }
    }

    /**
     * @dev Update KYC documents
     * @param newDocumentHash Hash of the new encrypted KYC documents
     */
    function updateKYCDocuments(bytes32 newDocumentHash) external {
        require(newDocumentHash != bytes32(0), "Invalid document hash");
        require(!usedDocumentHashes[newDocumentHash], "Document hash already used");
        
        KYCRecord storage record = kycRecords[msg.sender];
        require(record.status == KYCStatus.Verified, "KYC not verified");
        require(block.timestamp <= record.expiryTimestamp, "KYC expired");

        // Mark old hash as unused and new hash as used
        usedDocumentHashes[record.documentHash] = false;
        usedDocumentHashes[newDocumentHash] = true;

        record.documentHash = newDocumentHash;
        
        emit DocumentUpdated(msg.sender, newDocumentHash);
    }

    /**
     * @dev Add a new KYC verifier
     * @param verifier Verifier address
     * @param name Verifier name
     * @param licenseNumber Verifier license number
     */
    function addVerifier(
        address verifier,
        string memory name,
        string memory licenseNumber
    ) external onlyOwner {
        require(verifier != address(0), "Invalid verifier address");
        require(!verifiers[verifier].isActive, "Verifier already exists");

        verifiers[verifier] = VerifierInfo({
            isActive: true,
            name: name,
            licenseNumber: licenseNumber,
            addedTimestamp: block.timestamp,
            verificationsCount: 0
        });

        verifierList.push(verifier);
        
        emit VerifierAdded(verifier);
    }

    /**
     * @dev Remove a KYC verifier
     * @param verifier Verifier address
     */
    function removeVerifier(address verifier) external onlyOwner {
        require(verifiers[verifier].isActive, "Verifier not active");
        
        verifiers[verifier].isActive = false;
        
        // Remove from verifier list
        for (uint256 i = 0; i < verifierList.length; i++) {
            if (verifierList[i] == verifier) {
                verifierList[i] = verifierList[verifierList.length - 1];
                verifierList.pop();
                break;
            }
        }
        
        emit VerifierRemoved(verifier);
    }

    /**
     * @dev Check if user's KYC is valid
     * @param user User address
     * @return isValid Whether KYC is valid
     */
    function isKYCValid(address user) external view returns (bool isValid) {
        KYCRecord storage record = kycRecords[user];
        return record.status == KYCStatus.Verified && 
               block.timestamp <= record.expiryTimestamp &&
               record.isActive;
    }

    /**
     * @dev Get KYC status
     * @param user User address
     * @return status KYC status
     * @return verifier Verifier address
     * @return submissionTimestamp Submission timestamp
     * @return verificationTimestamp Verification timestamp
     * @return expiryTimestamp Expiry timestamp
     */
    function getKYCStatus(address user) external view returns (
        KYCStatus status,
        address verifier,
        uint256 submissionTimestamp,
        uint256 verificationTimestamp,
        uint256 expiryTimestamp
    ) {
        KYCRecord storage record = kycRecords[user];
        return (
            record.status,
            record.verifier,
            record.submissionTimestamp,
            record.verificationTimestamp,
            record.expiryTimestamp
        );
    }

    /**
     * @dev Get verifier information
     * @param verifier Verifier address
     * @return isActive Whether verifier is active
     * @return name Verifier name
     * @return licenseNumber License number
     * @return verificationsCount Number of verifications performed
     */
    function getVerifierInfo(address verifier) external view returns (
        bool isActive,
        string memory name,
        string memory licenseNumber,
        uint256 verificationsCount
    ) {
        VerifierInfo storage info = verifiers[verifier];
        return (
            info.isActive,
            info.name,
            info.licenseNumber,
            info.verificationsCount
        );
    }

    /**
     * @dev Get all active verifiers
     * @return activeVerifiers Array of active verifier addresses
     */
    function getActiveVerifiers() external view returns (address[] memory activeVerifiers) {
        uint256 activeCount = 0;
        
        // Count active verifiers
        for (uint256 i = 0; i < verifierList.length; i++) {
            if (verifiers[verifierList[i]].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active verifiers
        activeVerifiers = new address[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < verifierList.length; i++) {
            if (verifiers[verifierList[i]].isActive) {
                activeVerifiers[index] = verifierList[i];
                index++;
            }
        }
        
        return activeVerifiers;
    }

    /**
     * @dev Update verification fee
     * @param newFee New verification fee
     */
    function updateVerificationFee(uint256 newFee) external onlyOwner {
        verificationFee = newFee;
    }

    /**
     * @dev Update fee recipient
     * @param newRecipient New fee recipient address
     */
    function updateFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid address");
        feeRecipient = newRecipient;
    }

    /**
     * @dev Emergency function to deactivate a user's KYC
     * @param user User address
     */
    function deactivateKYC(address user) external onlyOwner {
        kycRecords[user].isActive = false;
    }

    /**
     * @dev Batch verify multiple KYC applications
     * @param users Array of user addresses
     * @param approvals Array of approval decisions
     * @param reasons Array of rejection reasons
     */
    function batchVerifyKYC(
        address[] memory users,
        bool[] memory approvals,
        string[] memory reasons
    ) external onlyVerifier {
        require(
            users.length == approvals.length && 
            users.length == reasons.length,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < users.length; i++) {
            if (kycRecords[users[i]].status == KYCStatus.Pending) {
                verifyKYC(users[i], approvals[i], reasons[i]);
            }
        }
    }
}