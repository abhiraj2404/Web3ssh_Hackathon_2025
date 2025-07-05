const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Deploy EventChainContract first
  const EventChainContract = await hre.ethers.getContractFactory("EventChainContract");
  const [deployer] = await hre.ethers.getSigners();
  const eventChainContract = await EventChainContract.deploy(deployer.address);
  await eventChainContract.waitForDeployment();
  
  const eventChainAddress = await eventChainContract.getAddress();
  console.log("EventChainContract deployed to:", eventChainAddress);

  // Deploy EventChainEventManagerContract
  const EventChainEventManagerContract = await hre.ethers.getContractFactory("EventChainEventManagerContract");
  const eventManagerContract = await EventChainEventManagerContract.deploy(
    deployer.address,
    eventChainAddress
  );
  await eventManagerContract.waitForDeployment();
  
  const eventManagerAddress = await eventManagerContract.getAddress();
  console.log("EventChainEventManagerContract deployed to:", eventManagerAddress);

  console.log("\nDeployment completed!");
  console.log("EventChainContract:", eventChainAddress);
  console.log("EventChainEventManagerContract:", eventManagerAddress);
  
  // Save deployment addresses
  const fs = require("fs");
  const deploymentInfo = {
    EventChainContract: eventChainAddress,
    EventChainEventManagerContract: eventManagerAddress,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    `deployment-${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`Deployment info saved to deployment-${hre.network.name}.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });