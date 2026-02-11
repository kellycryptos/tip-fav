import { ethers } from "hardhat";
import { network } from "hardhat";
import { run } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("Deploying TippingContract...");

  const TippingContract = await ethers.getContractFactory("TippingContract");
  const tippingContract = await TippingContract.deploy();

  await tippingContract.waitForDeployment();
  const contractAddress = await tippingContract.getAddress();

  console.log("TippingContract deployed to:", contractAddress);

  // Save the contract address to an environment variable file for reference
  console.log("\nUpdate your .env file with:");
  console.log(`NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS=${contractAddress}\n`);

  // Wait for a few seconds to ensure the contract is propagated
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Verify the contract if we're on a live network
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Verifying contract...");
    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.log("Verification failed:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });