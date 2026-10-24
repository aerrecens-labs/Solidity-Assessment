import { ethers } from "ethers";
import deploymentJson from "./deployment.json";

export const LOCAL_RPC_URL = "http://127.0.0.1:8545";
export const LOCAL_CHAIN_ID = 31337;

// LOCAL DEVELOPMENT ONLY.
// Hardhat account #0. This key is public and ships with Hardhat.
// Never use it on a public network or with real funds.
export const LOCAL_DEV_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export const deployment = {
  chainId: deploymentJson.chainId,
  token: deploymentJson.token,
  vault: deploymentJson.vault,
  account: deploymentJson.account,
};

export const localProvider = new ethers.JsonRpcProvider(LOCAL_RPC_URL, LOCAL_CHAIN_ID, {
  staticNetwork: true,
});

export const localSigner = new ethers.Wallet(LOCAL_DEV_PRIVATE_KEY, localProvider);

export function contractsReady(): boolean {
  return ethers.isAddress(deployment.vault) && ethers.isAddress(deployment.token);
}
