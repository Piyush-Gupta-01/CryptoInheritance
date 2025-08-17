// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title CryptoInheritance
 * @dev Smart contract for managing cryptocurrency inheritance through on-chain wills
 */
contract CryptoInheritance is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Events
    event WillCreated(address indexed owner, uint256 indexed willId);
    event NomineeAdded(address indexed owner, uint256 indexed willId, address indexed nominee);
    event AssetDeposited(address indexed owner, uint256 indexed willId, address token, uint256 amount);
    event InheritanceTriggered(uint256 indexed willId, address indexed trigger);
    event AssetsClaimed(uint256 indexed willId, address indexed nominee, address token, uint256 amount);
    event WillUpdated(address indexed owner, uint256 indexed willId);
    event EmergencyWithdrawal(address indexed owner, uint256 indexed willId);

    // Structs
    struct Nominee {
        address nomineeAddress;
        uint256 percentage; // Percentage of inheritance (basis points, 10000 = 100%)
        bool isVerified; // KYC verification status
        bool isActive;
        string encryptedDetails; // Encrypted nominee details
        uint256 addedTimestamp;
    }

    struct Asset {
        address tokenAddress; // Address(0) for ETH
        uint256 amount;
        bool isActive;
    }

    struct Will {
        address owner;
        bool isActive;
        bool isTriggered;
        uint256 createdTimestamp;
        uint256 lastActivityTimestamp;
        uint256 inactivityPeriod; // Time in seconds after which inheritance can be triggered
        string encryptedWillDocument; // Encrypted will document hash
        mapping(uint256 => Nominee) nominees;
        uint256 nomineeCount;
        mapping(address => Asset) assets; // tokenAddress => Asset
        address[] assetTokens; // Array to track all token addresses
        uint256 totalPercentage; // Total percentage allocated to nominees
        bool requiresOracle; // Whether oracle verification is required
        address[] authorizedTriggers; // Addresses authorized to trigger inheritance
    }

    // State variables
    mapping(uint256 => Will) public wills;
    mapping(address => uint256[]) public ownerWills; // owner => willIds
    mapping(address => bool) public verifiedOracles; // Authorized oracles for death verification
    mapping(address => bool) public kycProviders; // Authorized KYC providers
    
    uint256 public nextWillId = 1;
    uint256 public constant MIN_INACTIVITY_PERIOD = 365 days; // Minimum 1 year
    uint256 public constant MAX_INACTIVITY_PERIOD = 10 * 365 days; // Maximum 10 years
    uint256 public platformFee = 250; // 2.5% in basis points
    address public feeRecipient;

    // Modifiers
    modifier onlyWillOwner(uint256 willId) {
        require(wills[willId].owner == msg.sender, "Not will owner");
        _;
    }

    modifier willExists(uint256 willId) {
        require(wills[willId].owner != address(0), "Will does not exist");
        _;
    }

    modifier willActive(uint256 willId) {
        require(wills[willId].isActive, "Will is not active");
        _;
    }

    modifier onlyVerifiedOracle() {
        require(verifiedOracles[msg.sender], "Not authorized oracle");
        _;
    }

    modifier onlyKYCProvider() {
        require(kycProviders[msg.sender], "Not authorized KYC provider");
        _;
    }

    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev Create a new will
     * @param inactivityPeriod Time in seconds after which inheritance can be triggered
     * @param encryptedWillDocument Encrypted will document
     * @param requiresOracle Whether oracle verification is required
     */
    function createWill(
        uint256 inactivityPeriod,
        string memory encryptedWillDocument,
        bool requiresOracle
    ) external returns (uint256) {
        require(
            inactivityPeriod >= MIN_INACTIVITY_PERIOD && 
            inactivityPeriod <= MAX_INACTIVITY_PERIOD,
            "Invalid inactivity period"
        );

        uint256 willId = nextWillId++;
        Will storage newWill = wills[willId];
        
        newWill.owner = msg.sender;
        newWill.isActive = true;
        newWill.isTriggered = false;
        newWill.createdTimestamp = block.timestamp;
        newWill.lastActivityTimestamp = block.timestamp;
        newWill.inactivityPeriod = inactivityPeriod;
        newWill.encryptedWillDocument = encryptedWillDocument;
        newWill.requiresOracle = requiresOracle;

        ownerWills[msg.sender].push(willId);

        emit WillCreated(msg.sender, willId);
        return willId;
    }

    /**
     * @dev Add a nominee to a will
     * @param willId The will ID
     * @param nomineeAddress Address of the nominee
     * @param percentage Percentage of inheritance (basis points)
     * @param encryptedDetails Encrypted nominee details
     */
    function addNominee(
        uint256 willId,
        address nomineeAddress,
        uint256 percentage,
        string memory encryptedDetails
    ) external onlyWillOwner(willId) willActive(willId) {
        require(nomineeAddress != address(0), "Invalid nominee address");
        require(nomineeAddress != msg.sender, "Cannot nominate yourself");
        require(percentage > 0 && percentage <= 10000, "Invalid percentage");
        
        Will storage will = wills[willId];
        require(will.totalPercentage + percentage <= 10000, "Total percentage exceeds 100%");

        uint256 nomineeId = will.nomineeCount++;
        Nominee storage nominee = will.nominees[nomineeId];
        
        nominee.nomineeAddress = nomineeAddress;
        nominee.percentage = percentage;
        nominee.isVerified = false;
        nominee.isActive = true;
        nominee.encryptedDetails = encryptedDetails;
        nominee.addedTimestamp = block.timestamp;

        will.totalPercentage += percentage;
        will.lastActivityTimestamp = block.timestamp;

        emit NomineeAdded(msg.sender, willId, nomineeAddress);
    }

    /**
     * @dev Deposit assets into a will
     * @param willId The will ID
     * @param tokenAddress Token address (address(0) for ETH)
     * @param amount Amount to deposit
     */
    function depositAsset(
        uint256 willId,
        address tokenAddress,
        uint256 amount
    ) external payable onlyWillOwner(willId) willActive(willId) nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        Will storage will = wills[willId];
        
        if (tokenAddress == address(0)) {
            // ETH deposit
            require(msg.value == amount, "ETH amount mismatch");
        } else {
            // ERC20 token deposit
            require(msg.value == 0, "ETH not expected for token deposit");
            IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
        }

        Asset storage asset = will.assets[tokenAddress];
        if (asset.amount == 0) {
            // New asset
            will.assetTokens.push(tokenAddress);
        }
        
        asset.tokenAddress = tokenAddress;
        asset.amount += amount;
        asset.isActive = true;

        will.lastActivityTimestamp = block.timestamp;

        emit AssetDeposited(msg.sender, willId, tokenAddress, amount);
    }

    /**
     * @dev Trigger inheritance for a will
     * @param willId The will ID
     * @param deathCertificateHash Hash of the death certificate
     * @param signature Signature from authorized oracle (if required)
     */
    function triggerInheritance(
        uint256 willId,
        bytes32 deathCertificateHash,
        bytes memory signature
    ) external willExists(willId) willActive(willId) {
        Will storage will = wills[willId];
        require(!will.isTriggered, "Inheritance already triggered");

        bool canTrigger = false;

        // Check if caller is authorized trigger
        for (uint256 i = 0; i < will.authorizedTriggers.length; i++) {
            if (will.authorizedTriggers[i] == msg.sender) {
                canTrigger = true;
                break;
            }
        }

        // Check inactivity period
        if (!canTrigger && block.timestamp >= will.lastActivityTimestamp + will.inactivityPeriod) {
            canTrigger = true;
        }

        // Check oracle verification if required
        if (will.requiresOracle && signature.length > 0) {
            bytes32 messageHash = keccak256(abi.encodePacked(willId, deathCertificateHash));
            bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
            address signer = ethSignedMessageHash.recover(signature);
            
            if (verifiedOracles[signer]) {
                canTrigger = true;
            }
        }

        require(canTrigger, "Not authorized to trigger inheritance");

        will.isTriggered = true;
        will.isActive = false;

        emit InheritanceTriggered(willId, msg.sender);
    }

    /**
     * @dev Claim inherited assets
     * @param willId The will ID
     * @param nomineeId The nominee ID
     */
    function claimInheritance(
        uint256 willId,
        uint256 nomineeId
    ) external willExists(willId) nonReentrant {
        Will storage will = wills[willId];
        require(will.isTriggered, "Inheritance not triggered");
        require(nomineeId < will.nomineeCount, "Invalid nominee ID");
        
        Nominee storage nominee = will.nominees[nomineeId];
        require(nominee.nomineeAddress == msg.sender, "Not the nominee");
        require(nominee.isActive, "Nominee not active");
        require(nominee.isVerified, "Nominee not verified");

        // Calculate and transfer assets
        for (uint256 i = 0; i < will.assetTokens.length; i++) {
            address tokenAddress = will.assetTokens[i];
            Asset storage asset = will.assets[tokenAddress];
            
            if (asset.isActive && asset.amount > 0) {
                uint256 inheritanceAmount = (asset.amount * nominee.percentage) / 10000;
                uint256 feeAmount = (inheritanceAmount * platformFee) / 10000;
                uint256 finalAmount = inheritanceAmount - feeAmount;

                if (tokenAddress == address(0)) {
                    // ETH transfer
                    payable(msg.sender).transfer(finalAmount);
                    if (feeAmount > 0) {
                        payable(feeRecipient).transfer(feeAmount);
                    }
                } else {
                    // ERC20 transfer
                    IERC20(tokenAddress).safeTransfer(msg.sender, finalAmount);
                    if (feeAmount > 0) {
                        IERC20(tokenAddress).safeTransfer(feeRecipient, feeAmount);
                    }
                }

                asset.amount -= inheritanceAmount;
                
                emit AssetsClaimed(willId, msg.sender, tokenAddress, finalAmount);
            }
        }

        nominee.isActive = false;
    }

    /**
     * @dev Update will activity timestamp (proof of life)
     * @param willId The will ID
     */
    function updateActivity(uint256 willId) external onlyWillOwner(willId) willActive(willId) {
        wills[willId].lastActivityTimestamp = block.timestamp;
    }

    /**
     * @dev Emergency withdrawal by will owner
     * @param willId The will ID
     * @param tokenAddress Token address to withdraw
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(
        uint256 willId,
        address tokenAddress,
        uint256 amount
    ) external onlyWillOwner(willId) willActive(willId) nonReentrant {
        Will storage will = wills[willId];
        Asset storage asset = will.assets[tokenAddress];
        
        require(asset.amount >= amount, "Insufficient balance");
        
        asset.amount -= amount;
        will.lastActivityTimestamp = block.timestamp;

        if (tokenAddress == address(0)) {
            payable(msg.sender).transfer(amount);
        } else {
            IERC20(tokenAddress).safeTransfer(msg.sender, amount);
        }

        emit EmergencyWithdrawal(msg.sender, willId);
    }

    /**
     * @dev Verify nominee KYC status
     * @param willId The will ID
     * @param nomineeId The nominee ID
     * @param isVerified Verification status
     */
    function verifyNomineeKYC(
        uint256 willId,
        uint256 nomineeId,
        bool isVerified
    ) external onlyKYCProvider willExists(willId) {
        require(nomineeId < wills[willId].nomineeCount, "Invalid nominee ID");
        wills[willId].nominees[nomineeId].isVerified = isVerified;
    }

    /**
     * @dev Add authorized oracle
     * @param oracle Oracle address
     */
    function addOracle(address oracle) external onlyOwner {
        verifiedOracles[oracle] = true;
    }

    /**
     * @dev Remove authorized oracle
     * @param oracle Oracle address
     */
    function removeOracle(address oracle) external onlyOwner {
        verifiedOracles[oracle] = false;
    }

    /**
     * @dev Add KYC provider
     * @param provider KYC provider address
     */
    function addKYCProvider(address provider) external onlyOwner {
        kycProviders[provider] = true;
    }

    /**
     * @dev Remove KYC provider
     * @param provider KYC provider address
     */
    function removeKYCProvider(address provider) external onlyOwner {
        kycProviders[provider] = false;
    }

    /**
     * @dev Get will details
     * @param willId The will ID
     */
    function getWill(uint256 willId) external view returns (
        address owner,
        bool isActive,
        bool isTriggered,
        uint256 createdTimestamp,
        uint256 lastActivityTimestamp,
        uint256 inactivityPeriod,
        uint256 nomineeCount,
        uint256 totalPercentage
    ) {
        Will storage will = wills[willId];
        return (
            will.owner,
            will.isActive,
            will.isTriggered,
            will.createdTimestamp,
            will.lastActivityTimestamp,
            will.inactivityPeriod,
            will.nomineeCount,
            will.totalPercentage
        );
    }

    /**
     * @dev Get nominee details
     * @param willId The will ID
     * @param nomineeId The nominee ID
     */
    function getNominee(uint256 willId, uint256 nomineeId) external view returns (
        address nomineeAddress,
        uint256 percentage,
        bool isVerified,
        bool isActive,
        uint256 addedTimestamp
    ) {
        require(nomineeId < wills[willId].nomineeCount, "Invalid nominee ID");
        Nominee storage nominee = wills[willId].nominees[nomineeId];
        return (
            nominee.nomineeAddress,
            nominee.percentage,
            nominee.isVerified,
            nominee.isActive,
            nominee.addedTimestamp
        );
    }

    /**
     * @dev Get asset balance
     * @param willId The will ID
     * @param tokenAddress Token address
     */
    function getAssetBalance(uint256 willId, address tokenAddress) external view returns (uint256) {
        return wills[willId].assets[tokenAddress].amount;
    }

    /**
     * @dev Get owner's will IDs
     * @param owner Owner address
     */
    function getOwnerWills(address owner) external view returns (uint256[] memory) {
        return ownerWills[owner];
    }

    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Update platform fee
     * @param newFee New fee in basis points
     */
    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = newFee;
    }

    /**
     * @dev Update fee recipient
     * @param newRecipient New fee recipient address
     */
    function updateFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid address");
        feeRecipient = newRecipient;
    }
}