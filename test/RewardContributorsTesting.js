const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reward Contributors Contract", function () {
  let grantedTokens = 100;
  let tokenContract;
  let token;
  let rewardContract;
  let reward;
  let owner;
  let alice;
  let bob;
  let carol;
  let addrs;
  let defaultAdmin;
  let contributorRole;

  beforeEach(async function () {
    tokenContract = await ethers.getContractFactory("Token");
    token = await tokenContract.deploy();
    rewardContract = await ethers.getContractFactory("RewardContributors");
    reward = await rewardContract.deploy(token.address);
    [owner, alice, bob, carol, ...addrs] = await ethers.getSigners();
    defaultAdmin = await reward.DEFAULT_ADMIN_ROLE();
    contributorRole = await reward.CONTRIBUTOR_ROLE();
  });

  describe("Deployment", function () {
    it("Should set the right default admin", async function () {
      expect(await reward.hasRole(defaultAdmin, owner.address)).to.be.true;
    });
  });
  describe("Reward Contributors functionalities", function () {
    it("Should be able to add a user as contributor", async function () {
      await reward.addContributor(alice.address);
      expect(await reward.hasRole(contributorRole, alice.address)).to.be.true;
    });

    it("Should be able to remove a user from contributors list", async function () {
      await expect(
        reward.removeContributor(alice.address)
      ).to.be.revertedWith("Trying to remove contributor who doesn't exists");
      await reward.addContributor(alice.address);
      await reward.removeContributor(alice.address);
      expect(await reward.hasRole(contributorRole, alice.address)).to.be.false;
    });

    it("Should be able to start an epoch", async function () {
      await reward.addContributor(alice.address);
      await reward.startEpoch(grantedTokens);
      expect(await token.balanceOf(alice.address)).to.equal(grantedTokens);
    });

    it("Should not be able to end an epoch which is not ended", async function () {
      await reward.startEpoch(grantedTokens);
      await expect(
        reward.endEpoch()
      ).to.be.revertedWith("Epoch end time not reached");
    });

    it("Should be able to end an epoch which has exceeded timelimit", async function () {
      await reward.startEpoch(grantedTokens);
      await network.provider.send("evm_increaseTime", [11 * 24 * 60 * 60]);
      await expect(reward.endEpoch()).to.not.be.reverted;
    });

    it("Should be able to contribute during the epoch", async function () {
      await reward.addContributor(alice.address);
      await reward.addContributor(bob.address);
      await reward.startEpoch(grantedTokens);
      await token.connect(alice).approve(reward.address, grantedTokens);
      await reward.connect(alice).contribute(bob.address, 50);  
    });

    it("Should not be able to contribute more than allotted funds", async function () {
      await reward.addContributor(alice.address);
      await reward.addContributor(bob.address);
      await reward.startEpoch(grantedTokens);
      await token.connect(alice).approve(reward.address, grantedTokens);
      await expect(
        reward.connect(alice).contribute(bob.address, grantedTokens + 50)
      ).to.be.revertedWith("Insuffient funds to contribute"); 
    });

    it("Should not be able to receive funds when contributer is opted out of receiving", async function () {
      await reward.addContributor(alice.address);
      await reward.addContributor(bob.address);
      await reward.connect(bob).optOut();
      await reward.startEpoch(grantedTokens);
      await token.connect(alice).approve(reward.address, grantedTokens);
      await expect(
        reward.connect(alice).contribute(bob.address, grantedTokens)
      ).to.be.revertedWith("Recipient opted out to receive funds"); 
    });

    it("Should be able to opt in after opting out", async function () {
      await reward.addContributor(alice.address);
      await reward.addContributor(bob.address);
      await reward.connect(bob).optOut();
      await reward.startEpoch(grantedTokens);
      await reward.connect(bob).optIn();
      await token.connect(alice).approve(reward.address, grantedTokens);
      await reward.connect(alice).contribute(bob.address, grantedTokens);
    });

    it("Should be able to find the Contributor with most rewards", async function () {
      await reward.addContributor(alice.address);
      await reward.addContributor(bob.address);
      await reward.addContributor(carol.address);
      await reward.startEpoch(grantedTokens);
      await token.connect(alice).approve(reward.address, grantedTokens);
      await token.connect(bob).approve(reward.address, grantedTokens);
      await token.connect(carol).approve(reward.address, grantedTokens);
      await reward.connect(alice).contribute(bob.address, grantedTokens - 50);
      await reward.connect(bob).contribute(carol.address, grantedTokens - 60);
      await reward.connect(carol).contribute(bob.address, grantedTokens - 30);
      let addr = await reward.contributorWithMostRewards();
      expect(addr).to.be.equal(bob.address);
    });

    it("Should not be able to contribute after the epoch has ended", async function () {
      await reward.addContributor(alice.address);
      await reward.addContributor(bob.address);
      await reward.startEpoch(grantedTokens);
      await network.provider.send("evm_increaseTime", [3 * 60]);
      await reward.endEpoch();
      await expect(
        reward.connect(alice).contribute(bob.address, 50)
      ).to.be.revertedWith("Lockin Period ended");
      
    });
  });
});
