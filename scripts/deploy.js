const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy KYC Verification contract
  console.log("\nDeploying KYC Verification contract...");
  const KYCVerification = await ethers.getContractFactory("KYCVerification");
  const kycVerification = await KYCVerification.deploy(deployer.address);
  await kycVerification.deployed();
  console.log("KYC Verification deployed to:", kycVerification.address);

  // Deploy Multi-Chain Bridge contract
  console.log("\nDeploying Multi-Chain Bridge contract...");
  const MultiChainBridge = await ethers.getContractFactory("MultiChainBridge");
  const multiChainBridge = await MultiChainBridge.deploy(deployer.address);
  await multiChainBridge.deployed();
  console.log("Multi-Chain Bridge deployed to:", multiChainBridge.address);

  // Deploy main CryptoInheritance contract
  console.log("\nDeploying CryptoInheritance contract...");
  const CryptoInheritance = await ethers.getContractFactory("CryptoInheritance");
  const cryptoInheritance = await CryptoInheritance.deploy(deployer.address);
  await cryptoInheritance.deployed();
  console.log("CryptoInheritance deployed to:", cryptoInheritance.address);

  // Set up initial configuration
  console.log("\nSetting up initial configuration...");
  
  // Add KYC verification contract as KYC provider
  await cryptoInheritance.addKYCProvider(kycVerification.address);
  console.log("Added KYC Verification as KYC provider");

  // Add deployer as initial oracle
  await cryptoInheritance.addOracle(deployer.address);
  console.log("Added deployer as initial oracle");

  // Add deployer as initial validator for multi-chain bridge
  await multiChainBridge.addValidator(deployer.address);
  console.log("Added deployer as initial validator");

  // Add deployer as initial KYC verifier
  await kycVerification.addVerifier(
    deployer.address,
    "Initial Verifier",
    "LICENSE-001"
  );
  console.log("Added deployer as initial KYC verifier");

  console.log("\nDeployment completed successfully!");
  console.log("\nContract Addresses:");
  console.log("===================");
  console.log("KYC Verification:", kycVerification.address);
  console.log("Multi-Chain Bridge:", multiChainBridge.address);
  console.log("CryptoInheritance:", cryptoInheritance.address);

  // Save deployment addresses to a file
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      KYCVerification: kycVerification.address,
      MultiChainBridge: multiChainBridge.address,
      CryptoInheritance: cryptoInheritance.address
    },
    deploymentTime: new Date().toISOString()
  };

  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\nDeployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });