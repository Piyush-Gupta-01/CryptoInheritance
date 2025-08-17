// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title MultiChainBridge
 * @dev Bridge contract for cross-chain inheritance operations
 */
contract MultiChainBridge is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Events
    event CrossChainWillCreated(
        uint256 indexed willId,
        address indexed owner,
        uint256 indexed targetChainId,
        bytes32 willHash
    );
    event CrossChainAssetLocked(
        uint256 indexed willId,
        address indexed token,
        uint256 amount,
        uint256 indexed targetChainId
    );
    event CrossChainInheritanceTriggered(
        uint256 indexed willId,
        uint256 indexed sourceChainId,
        bytes32 proofHash
    );
    event CrossChainAssetReleased(
        uint256 indexed willId,
        address indexed nominee,
        address indexed token,
        uint256 amount
    );
    event ValidatorAdded(address indexed validator);
    event ValidatorRemoved(address indexed validator);
    event ChainSupported(uint256 indexed chainId, address indexed bridgeContract);

    // Structs
    struct CrossChainWill {
        address owner;
        uint256 sourceChainId;
        uint256 targetChainId;
        bytes32 willHash;
        bool isActive;
        bool isTriggered;
        uint256 createdTimestamp;
        mapping(address => uint256) lockedAssets; // token => amount
        address[] assetTokens;
    }

    struct ChainInfo {
        bool isSupported;
        address bridgeContract;
        uint256 minConfirmations;
        bool isActive;
    }

    struct CrossChainMessage {
        uint256 willId;
        uint256 sourceChainId;
        uint256 targetChainId;
        bytes32 messageHash;
        uint256 timestamp;
        bool isProcessed;
        uint256 confirmations;
        mapping(address => bool) validatorConfirmations;
    }

    // State variables
    mapping(uint256 => CrossChainWill) public crossChainWills;
    mapping(uint256 => ChainInfo) public supportedChains;
    mapping(address => bool) public validators;
    mapping(bytes32 => CrossChainMessage) public crossChainMessages;
    
    address[] public validatorList;
    uint256 public nextWillId = 1;
    uint256 public minValidatorConfirmations = 3;
    uint256 public bridgeFee = 0.001 ether;
    address public feeRecipient;

    // Modifiers
    modifier onlyValidator() {
        require(validators[msg.sender], "Not a validator");
        _;
    }

    modifier supportedChain(uint256 chainId) {
        require(supportedChains[chainId].isSupported, "Chain not supported");
        _;
    }

    modifier willExists(uint256 willId) {
        require(crossChainWills[willId].owner != address(0), "Will does not exist");
        _;
    }

    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev Create a cross-chain will
     * @param targetChainId Target chain ID for inheritance
     * @param willHash Hash of the will data
     */
    function createCrossChainWill(
        uint256 targetChainId,
        bytes32 willHash
    ) external payable supportedChain(targetChainId) returns (uint256) {
        require(msg.value >= bridgeFee, "Insufficient bridge fee");
        require(willHash != bytes32(0), "Invalid will hash");

        uint256 willId = nextWillId++;
        CrossChainWill storage newWill = crossChainWills[willId];
        
        newWill.owner = msg.sender;
        newWill.sourceChainId = block.chainid;
        newWill.targetChainId = targetChainId;
        newWill.willHash = willHash;
        newWill.isActive = true;
        newWill.isTriggered = false;
        newWill.createdTimestamp = block.timestamp;

        // Transfer bridge fee
        if (msg.value > 0) {
            payable(feeRecipient).transfer(msg.value);
        }

        emit CrossChainWillCreated(willId, msg.sender, targetChainId, willHash);
        return willId;
    }

    /**
     * @dev Lock assets for cross-chain inheritance
     * @param willId The will ID
     * @param tokenAddress Token address (address(0) for native token)
     * @param amount Amount to lock
     */
    function lockAssets(
        uint256 willId,
        address tokenAddress,
        uint256 amount
    ) external payable willExists(willId) nonReentrant {
        CrossChainWill storage will = crossChainWills[willId];
        require(will.owner == msg.sender, "Not will owner");
        require(will.isActive, "Will not active");
        require(amount > 0, "Amount must be greater than 0");

        if (tokenAddress == address(0)) {
            // Native token
            require(msg.value == amount, "Amount mismatch");
        } else {
            // ERC20 token
            require(msg.value == 0, "Native token not expected");
            IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
        }

        if (will.lockedAssets[tokenAddress] == 0) {
            will.assetTokens.push(tokenAddress);
        }
        will.lockedAssets[tokenAddress] += amount;

        emit CrossChainAssetLocked(willId, tokenAddress, amount, will.targetChainId);
    }

    /**
     * @dev Submit cross-chain inheritance trigger
     * @param willId The will ID
     * @param sourceChainId Source chain ID
     * @param proofHash Hash of the inheritance proof
     * @param signatures Array of validator signatures
     */
    function submitCrossChainInheritance(
        uint256 willId,
        uint256 sourceChainId,
        bytes32 proofHash,
        bytes[] memory signatures
    ) external {
        require(signatures.length >= minValidatorConfirmations, "Insufficient signatures");
        
        bytes32 messageHash = keccak256(abi.encodePacked(
            willId,
            sourceChainId,
            block.chainid,
            proofHash
        ));

        // Verify validator signatures
        uint256 validSignatures = 0;
        address[] memory signers = new address[](signatures.length);
        
        for (uint256 i = 0; i < signatures.length; i++) {
            bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
            address signer = ethSignedMessageHash.recover(signatures[i]);
            
            if (validators[signer]) {
                // Check for duplicate signers
                bool isDuplicate = false;
                for (uint256 j = 0; j < validSignatures; j++) {
                    if (signers[j] == signer) {
                        isDuplicate = true;
                        break;
                    }
                }
                
                if (!isDuplicate) {
                    signers[validSignatures] = signer;
                    validSignatures++;
                }
            }
        }

        require(validSignatures >= minValidatorConfirmations, "Insufficient valid signatures");

        // Process cross-chain message
        CrossChainMessage storage message = crossChainMessages[messageHash];
        require(!message.isProcessed, "Message already processed");

        message.willId = willId;
        message.sourceChainId = sourceChainId;
        message.targetChainId = block.chainid;
        message.messageHash = messageHash;
        message.timestamp = block.timestamp;
        message.confirmations = validSignatures;
        message.isProcessed = true;

        emit CrossChainInheritanceTriggered(willId, sourceChainId, proofHash);
    }

    /**
     * @dev Release cross-chain assets to nominee
     * @param willId The will ID
     * @param nominee Nominee address
     * @param tokenAddress Token address
     * @param amount Amount to release
     * @param messageHash Cross-chain message hash
     */
    function releaseCrossChainAssets(
        uint256 willId,
        address nominee,
        address tokenAddress,
        uint256 amount,
        bytes32 messageHash
    ) external willExists(willId) nonReentrant {
        CrossChainMessage storage message = crossChainMessages[messageHash];
        require(message.isProcessed, "Message not processed");
        require(message.willId == willId, "Will ID mismatch");

        CrossChainWill storage will = crossChainWills[willId];
        require(will.lockedAssets[tokenAddress] >= amount, "Insufficient locked assets");

        will.lockedAssets[tokenAddress] -= amount;

        if (tokenAddress == address(0)) {
            // Native token
            payable(nominee).transfer(amount);
        } else {
            // ERC20 token
            IERC20(tokenAddress).safeTransfer(nominee, amount);
        }

        emit CrossChainAssetReleased(willId, nominee, tokenAddress, amount);
    }

    /**
     * @dev Add a validator
     * @param validator Validator address
     */
    function addValidator(address validator) external onlyOwner {
        require(validator != address(0), "Invalid validator address");
        require(!validators[validator], "Validator already exists");

        validators[validator] = true;
        validatorList.push(validator);

        emit ValidatorAdded(validator);
    }

    /**
     * @dev Remove a validator
     * @param validator Validator address
     */
    function removeValidator(address validator) external onlyOwner {
        require(validators[validator], "Validator does not exist");

        validators[validator] = false;

        // Remove from validator list
        for (uint256 i = 0; i < validatorList.length; i++) {
            if (validatorList[i] == validator) {
                validatorList[i] = validatorList[validatorList.length - 1];
                validatorList.pop();
                break;
            }
        }

        emit ValidatorRemoved(validator);
    }

    /**
     * @dev Add support for a new chain
     * @param chainId Chain ID
     * @param bridgeContract Bridge contract address on the target chain
     * @param minConfirmations Minimum confirmations required
     */
    function addSupportedChain(
        uint256 chainId,
        address bridgeContract,
        uint256 minConfirmations
    ) external onlyOwner {
        require(chainId != 0, "Invalid chain ID");
        require(bridgeContract != address(0), "Invalid bridge contract");

        supportedChains[chainId] = ChainInfo({
            isSupported: true,
            bridgeContract: bridgeContract,
            minConfirmations: minConfirmations,
            isActive: true
        });

        emit ChainSupported(chainId, bridgeContract);
    }

    /**
     * @dev Remove support for a chain
     * @param chainId Chain ID
     */
    function removeSupportedChain(uint256 chainId) external onlyOwner {
        supportedChains[chainId].isSupported = false;
        supportedChains[chainId].isActive = false;
    }

    /**
     * @dev Update minimum validator confirmations
     * @param newMinConfirmations New minimum confirmations
     */
    function updateMinValidatorConfirmations(uint256 newMinConfirmations) external onlyOwner {
        require(newMinConfirmations > 0, "Invalid confirmation count");
        require(newMinConfirmations <= validatorList.length, "Too many confirmations required");
        minValidatorConfirmations = newMinConfirmations;
    }

    /**
     * @dev Update bridge fee
     * @param newFee New bridge fee
     */
    function updateBridgeFee(uint256 newFee) external onlyOwner {
        bridgeFee = newFee;
    }

    /**
     * @dev Get cross-chain will details
     * @param willId The will ID
     */
    function getCrossChainWill(uint256 willId) external view returns (
        address owner,
        uint256 sourceChainId,
        uint256 targetChainId,
        bytes32 willHash,
        bool isActive,
        bool isTriggered,
        uint256 createdTimestamp
    ) {
        CrossChainWill storage will = crossChainWills[willId];
        return (
            will.owner,
            will.sourceChainId,
            will.targetChainId,
            will.willHash,
            will.isActive,
            will.isTriggered,
            will.createdTimestamp
        );
    }

    /**
     * @dev Get locked asset amount
     * @param willId The will ID
     * @param tokenAddress Token address
     */
    function getLockedAssetAmount(uint256 willId, address tokenAddress) external view returns (uint256) {
        return crossChainWills[willId].lockedAssets[tokenAddress];
    }

    /**
     * @dev Get all validators
     */
    function getValidators() external view returns (address[] memory) {
        return validatorList;
    }

    /**
     * @dev Check if chain is supported
     * @param chainId Chain ID
     */
    function isChainSupported(uint256 chainId) external view returns (bool) {
        return supportedChains[chainId].isSupported && supportedChains[chainId].isActive;
    }

    /**
     * @dev Emergency withdrawal by contract owner
     * @param tokenAddress Token address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address tokenAddress, uint256 amount) external onlyOwner {
        if (tokenAddress == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(tokenAddress).safeTransfer(owner(), amount);
        }
    }
}