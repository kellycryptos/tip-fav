import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TippingContract", function () {
  async function deployTippingContractFixture() {
    const [owner, tipper, creator] = await ethers.getSigners();

    const TippingContract = await ethers.getContractFactory("TippingContract");
    const tippingContract = await TippingContract.deploy();

    // Deploy a mock ERC20 token for testing
    const MockToken = await ethers.getContractFactory("MockToken");
    const mockToken = await MockToken.deploy("Test Token", "TEST", 18, ethers.parseEther("1000000"));

    return { tippingContract, mockToken, owner, tipper, creator };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { tippingContract, owner } = await loadFixture(deployTippingContractFixture);
      expect(await tippingContract.owner()).to.equal(owner.address);
    });
  });

  describe("Tipping with ETH", function () {
    it("Should allow tipping with ETH", async function () {
      const { tippingContract, tipper, creator } = await loadFixture(deployTippingContractFixture);
      
      const tipAmount = ethers.parseEther("0.01");
      const message = "Thanks for the great content!";
      
      await expect(tippingContract
        .connect(tipper)
        .tip(creator.address, await tippingContract.ETH_ADDRESS(), tipAmount, message, {
          value: tipAmount
        })
      )
        .to.emit(tippingContract, "TipSent")
        .withArgs(tipper.address, creator.address, await tippingContract.ETH_ADDRESS(), tipAmount, message, anyValue);
      
      // Check balances
      expect(await tippingContract.getTipsReceived(creator.address)).to.equal(tipAmount);
      expect(await tippingContract.getTipsSent(tipper.address)).to.equal(tipAmount);
      expect(await tippingContract.getCreatorTotalTips(creator.address, await tippingContract.ETH_ADDRESS())).to.equal(tipAmount);
    });

    it("Should fail when tipping yourself", async function () {
      const { tippingContract, creator } = await loadFixture(deployTippingContractFixture);
      
      const tipAmount = ethers.parseEther("0.01");
      
      await expect(tippingContract
        .connect(creator)
        .tip(creator.address, await tippingContract.ETH_ADDRESS(), tipAmount, "Self tip", {
          value: tipAmount
        })
      ).to.be.revertedWith("Cannot tip yourself");
    });

    it("Should fail with incorrect ETH value", async function () {
      const { tippingContract, tipper, creator } = await loadFixture(deployTippingContractFixture);
      
      const tipAmount = ethers.parseEther("0.01");
      
      await expect(tippingContract
        .connect(tipper)
        .tip(creator.address, await tippingContract.ETH_ADDRESS(), tipAmount, "Test", {
          value: ethers.parseEther("0.005")
        })
      ).to.be.revertedWith("Incorrect ETH value sent");
    });
  });

  describe("Tipping with ERC20", function () {
    it("Should allow tipping with ERC20 tokens", async function () {
      const { tippingContract, mockToken, tipper, creator } = await loadFixture(deployTippingContractFixture);
      
      const tipAmount = ethers.parseEther("100");
      const message = "Great work!";
      
      // Approve token spending
      await mockToken.connect(tipper).approve(await tippingContract.getAddress(), tipAmount);
      
      await expect(tippingContract
        .connect(tipper)
        .tip(creator.address, await mockToken.getAddress(), tipAmount, message)
      )
        .to.emit(tippingContract, "TipSent")
        .withArgs(tipper.address, creator.address, await mockToken.getAddress(), tipAmount, message, anyValue);
      
      // Check balances
      expect(await tippingContract.getTipsReceived(creator.address)).to.equal(tipAmount);
      expect(await tippingContract.getCreatorTotalTips(creator.address, await mockToken.getAddress())).to.equal(tipAmount);
      expect(await mockToken.balanceOf(await tippingContract.getAddress())).to.equal(tipAmount);
    });

    it("Should fail when no ETH is sent for ERC20 tips", async function () {
      const { tippingContract, mockToken, tipper, creator } = await loadFixture(deployTippingContractFixture);
      
      const tipAmount = ethers.parseEther("100");
      
      await mockToken.connect(tipper).approve(await tippingContract.getAddress(), tipAmount);
      
      await expect(tippingContract
        .connect(tipper)
        .tip(creator.address, await mockToken.getAddress(), tipAmount, "Test", {
          value: ethers.parseEther("0.001")
        })
      ).to.be.revertedWith("No ETH should be sent for ERC20 tips");
    });
  });

  describe("Withdrawal", function () {
    it("Should allow creator to withdraw ETH tips", async function () {
      const { tippingContract, tipper, creator } = await loadFixture(deployTippingContractFixture);
      
      const tipAmount = ethers.parseEther("0.01");
      
      // Tip first
      await tippingContract
        .connect(tipper)
        .tip(creator.address, await tippingContract.ETH_ADDRESS(), tipAmount, "Test tip", {
          value: tipAmount
        });
      
      const initialBalance = await ethers.provider.getBalance(creator.address);
      
      // Withdraw
      await expect(tippingContract.connect(creator).withdraw(await tippingContract.ETH_ADDRESS(), tipAmount))
        .to.emit(tippingContract, "Withdrawal")
        .withArgs(creator.address, await tippingContract.ETH_ADDRESS(), tipAmount, anyValue);
      
      const finalBalance = await ethers.provider.getBalance(creator.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should allow creator to withdraw ERC20 tips", async function () {
      const { tippingContract, mockToken, tipper, creator } = await loadFixture(deployTippingContractFixture);
      
      const tipAmount = ethers.parseEther("100");
      
      // Approve and tip
      await mockToken.connect(tipper).approve(await tippingContract.getAddress(), tipAmount);
      await tippingContract
        .connect(tipper)
        .tip(creator.address, await mockToken.getAddress(), tipAmount, "Test");
      
      const initialBalance = await mockToken.balanceOf(creator.address);
      
      // Withdraw
      await expect(tippingContract.connect(creator).withdraw(await mockToken.getAddress(), tipAmount))
        .to.emit(tippingContract, "Withdrawal")
        .withArgs(creator.address, await mockToken.getAddress(), tipAmount, anyValue);
      
      const finalBalance = await mockToken.balanceOf(creator.address);
      expect(finalBalance).to.equal(initialBalance + tipAmount);
    });

    it("Should fail withdrawal with insufficient balance", async function () {
      const { tippingContract, creator } = await loadFixture(deployTippingContractFixture);
      
      const withdrawAmount = ethers.parseEther("1");
      
      await expect(tippingContract
        .connect(creator)
        .withdraw(await tippingContract.ETH_ADDRESS(), withdrawAmount)
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("View Functions", function () {
    it("Should return correct tip counts", async function () {
      const { tippingContract, mockToken, tipper, creator } = await loadFixture(deployTippingContractFixture);
      
      const ethTip = ethers.parseEther("0.01");
      const erc20Tip = ethers.parseEther("100");
      
      // Make multiple tips
      await tippingContract
        .connect(tipper)
        .tip(creator.address, await tippingContract.ETH_ADDRESS(), ethTip, "ETH tip", {
          value: ethTip
        });
      
      await mockToken.connect(tipper).approve(await tippingContract.getAddress(), erc20Tip);
      await tippingContract
        .connect(tipper)
        .tip(creator.address, await mockToken.getAddress(), erc20Tip, "ERC20 tip");
      
      expect(await tippingContract.getTipsReceived(creator.address)).to.equal(ethTip + erc20Tip);
      expect(await tippingContract.getTipsSent(tipper.address)).to.equal(ethTip + erc20Tip);
      expect(await tippingContract.getTipCount(creator.address)).to.equal(2);
    });

    it("Should return recent tips", async function () {
      const { tippingContract, tipper, creator } = await loadFixture(deployTippingContractFixture);
      
      const tipAmount = ethers.parseEther("0.01");
      
      await tippingContract
        .connect(tipper)
        .tip(creator.address, await tippingContract.ETH_ADDRESS(), tipAmount, "First tip", {
          value: tipAmount
        });
      
      await time.increase(3600); // 1 hour later
      
      await tippingContract
        .connect(tipper)
        .tip(creator.address, await tippingContract.ETH_ADDRESS(), tipAmount, "Second tip", {
          value: tipAmount
        });
      
      const recentTips = await tippingContract.getRecentTips(creator.address, 5);
      expect(recentTips.length).to.equal(2);
      expect(recentTips[0].message).to.equal("Second tip");
      expect(recentTips[1].message).to.equal("First tip");
    });
  });
});