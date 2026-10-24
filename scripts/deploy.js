import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exportAbis } from "./export-abi.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// LOCAL DEVELOPMENT ONLY.
// This script runs against the Hardhat node and uses its first unlocked account.
async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();

  const token = await ethers.deployContract("TestToken");
  await token.waitForDeployment();

  const mintAmount = ethers.parseEther("10000");
  await (await token.mint(deployer.address, mintAmount)).wait();

  const vault = await ethers.deployContract("TreasuryVault", [await token.getAddress()]);
  await vault.waitForDeployment();

  const vaultAddress = await vault.getAddress();
  await (await token.approve(vaultAddress, ethers.MaxUint256)).wait();
  await (await vault.deposit(ethers.parseEther("100"))).wait();
  await (await vault.fundReserve(ethers.parseEther("900"))).wait();

  const deployment = {
    chainId: 31337,
    token: await token.getAddress(),
    vault: vaultAddress,
    account: deployer.address,
    note: "LOCAL DEVELOPMENT ONLY",
  };

  const outPath = path.join(__dirname, "..", "src", "contracts", "deployment.json");
  fs.writeFileSync(outPath, `${JSON.stringify(deployment, null, 2)}\n`);
  exportAbis();

  console.log("TestToken:    ", deployment.token);
  console.log("TreasuryVault:", deployment.vault);
  console.log("Account:      ", deployment.account);
  console.log("LOCAL DEVELOPMENT ONLY");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
