const hre = require("hardhat");

async function main() {
  console.log("Deploying DreamSoul NFT to Monad Testnet...");

  const DreamSoul = await hre.ethers.getContractFactory("DreamSoul");
  const dreamSoul = await DreamSoul.deploy();

  await dreamSoul.waitForDeployment();

  console.log("DreamSoul deployed to:", await dreamSoul.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
