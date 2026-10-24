import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

async function deployFixture() {
  const [owner, other] = await ethers.getSigners();

  const token = await ethers.deployContract("TestToken");
  await token.waitForDeployment();

  const vault = await ethers.deployContract("TreasuryVault", [await token.getAddress()]);
  await vault.waitForDeployment();

  await token.mint(owner.address, ethers.parseEther("1000"));
  await token.mint(other.address, ethers.parseEther("1000"));
  await token.connect(owner).approve(await vault.getAddress(), ethers.MaxUint256);
  await token.connect(other).approve(await vault.getAddress(), ethers.MaxUint256);

  return { owner, other, token, vault };
}

describe("TreasuryVault", function () {
  describe("deposit", function () {
    it("credits the user and the treasury", async function () {
      const { owner, token, vault } = await deployFixture();
      const amount = ethers.parseEther("100");

      await expect(vault.deposit(amount))
        .to.emit(vault, "Deposited")
        .withArgs(owner.address, amount);

      expect(await vault.getUserBalance(owner.address)).to.equal(amount);
      expect(await vault.getTreasuryBalance()).to.equal(amount);
      expect(await token.balanceOf(await vault.getAddress())).to.equal(amount);
      expect(await vault.getTransactionCount()).to.equal(1);
    });

    it("accumulates multiple deposits", async function () {
      const { owner, vault } = await deployFixture();

      await vault.deposit(ethers.parseEther("25"));
      await vault.deposit(ethers.parseEther("75"));

      expect(await vault.getUserBalance(owner.address)).to.equal(ethers.parseEther("100"));
      expect(await vault.getTreasuryBalance()).to.equal(ethers.parseEther("100"));
    });

    it("reverts on a zero deposit", async function () {
      const { vault } = await deployFixture();
      await expect(vault.deposit(0)).to.be.revertedWithCustomError(vault, "ZeroAmount");
    });
  });

  describe("withdraw", function () {
    async function deposited() {
      const contracts = await deployFixture();
      await contracts.vault.deposit(ethers.parseEther("100"));
      return contracts;
    }

    it("emits Withdrawn for the requested amount", async function () {
      const { owner, vault } = await deposited();
      const amount = ethers.parseEther("40");

      await expect(vault.withdraw(amount))
        .to.emit(vault, "Withdrawn")
        .withArgs(owner.address, amount);
    });

    it("reduces the user balance and the treasury balance by the withdrawn amount", async function () {
      const { owner, vault } = await deposited();

      await vault.withdraw(ethers.parseEther("40"));

      expect(await vault.getUserBalance(owner.address)).to.equal(ethers.parseEther("60"));
      expect(await vault.getTreasuryBalance()).to.equal(ethers.parseEther("60"));
    });

    it("keeps treasury accounting equal to the tokens the contract still holds", async function () {
      const { token, vault } = await deposited();

      await vault.withdraw(ethers.parseEther("40"));

      expect(await vault.getTreasuryBalance()).to.equal(
        await token.balanceOf(await vault.getAddress())
      );
    });

    it("returns the full balance and clears both balances", async function () {
      const { owner, token, vault } = await deposited();

      await vault.withdraw(ethers.parseEther("100"));

      expect(await vault.getUserBalance(owner.address)).to.equal(0);
      expect(await vault.getTreasuryBalance()).to.equal(0);
      expect(await token.balanceOf(await vault.getAddress())).to.equal(0);
    });

    it("reverts when the amount is zero", async function () {
      const { vault } = await deposited();
      await expect(vault.withdraw(0)).to.be.revertedWithCustomError(vault, "ZeroAmount");
    });

    it("reverts when the amount is larger than the user balance", async function () {
      const { vault } = await deposited();
      await expect(vault.withdraw(ethers.parseEther("101"))).to.be.revertedWithCustomError(
        vault,
        "InsufficientBalance"
      );
    });

    it("does not let another account withdraw a user's funds", async function () {
      const { owner, other, vault } = await deposited();

      await expect(vault.connect(other).withdraw(ethers.parseEther("1"))).to.be.revertedWithCustomError(
        vault,
        "InsufficientBalance"
      );
      expect(await vault.getUserBalance(owner.address)).to.equal(ethers.parseEther("100"));
    });
  });

  describe("claimTreasuryBonus", function () {
    const bonus = ethers.parseEther("10");

    async function funded() {
      const contracts = await deployFixture();
      await contracts.vault.deposit(ethers.parseEther("100"));
      await contracts.vault.fundReserve(ethers.parseEther("100"));
      return contracts;
    }

    it("transfers 10 TEST from the treasury to the caller", async function () {
      const { owner, token, vault } = await funded();
      const walletBefore = await token.balanceOf(owner.address);

      await vault.claimTreasuryBonus();

      expect(await token.balanceOf(owner.address)).to.equal(walletBefore + bonus);
      expect(await token.balanceOf(await vault.getAddress())).to.equal(ethers.parseEther("190"));
    });

    it("decreases the treasury balance by 10 TEST and leaves the vault deposit unchanged", async function () {
      const { owner, vault } = await funded();

      await vault.claimTreasuryBonus();

      expect(await vault.getTreasuryBalance()).to.equal(ethers.parseEther("190"));
      expect(await vault.getUserBalance(owner.address)).to.equal(ethers.parseEther("100"));
    });

    it("records the claim and emits BonusClaimed", async function () {
      const { owner, vault } = await funded();
      const countBefore = await vault.getTransactionCount();

      await expect(vault.claimTreasuryBonus())
        .to.emit(vault, "BonusClaimed")
        .withArgs(owner.address, bonus);

      expect(await vault.hasClaimedBonus(owner.address)).to.equal(true);
      expect(await vault.getTransactionCount()).to.equal(countBefore + 1n);

      const record = await vault.getTransaction(countBefore);
      expect(record.user).to.equal(owner.address);
      expect(record.amount).to.equal(bonus);
      expect(record.kind).to.equal(2);
    });

    it("reverts when the same account claims twice", async function () {
      const { vault } = await funded();

      await vault.claimTreasuryBonus();
      await expect(vault.claimTreasuryBonus()).to.be.reverted;
    });

    it("lets a second account claim once", async function () {
      const { owner, other, vault } = await funded();

      await vault.claimTreasuryBonus();
      await vault.connect(other).claimTreasuryBonus();

      expect(await vault.hasClaimedBonus(owner.address)).to.equal(true);
      expect(await vault.hasClaimedBonus(other.address)).to.equal(true);
      expect(await vault.getTreasuryBalance()).to.equal(ethers.parseEther("180"));
    });
  });
});
