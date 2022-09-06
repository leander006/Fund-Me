const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { expect } = require("chai");
describe("FundMe", () => {
  let fundme;
  let deployer;
  let MockV3Aggregator;
  const sendEth = ethers.utils.parseEther("1");
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    fundme = await ethers.getContract("FundMe", deployer);
    MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });
  describe("constructor", async () => {
    it("Set aggregator address correct", async function () {
      const response = await fundme.getPriceFeed();
      expect(response).to.equal(MockV3Aggregator.address);
    });
    it("Check whether owner is assisgn properly", async function () {
      const response = await fundme.getOwner();
      expect(response).to.equal(deployer);
    });
  });
  describe("fund", async () => {
    it("Fails if we didn't send enough eth", async function () {
      await expect(fundme.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });

    it("Updated the amount funded data structure", async () => {
      await fundme.fund({ value: sendEth });
      const response = await fundme.getAddressToAmountFunded(deployer);
      expect(response.toString()).to.equal(sendEth.toString());
    });
    it("Add funders to funder's array", async function () {
      await fundme.fund({ value: sendEth });
      const funder = await fundme.getFunder(0);
      expect(funder).to.equal(deployer);
    });
  });

  describe("WithDraw", async () => {
    it("Withdraw eth from a single funder", async function () {
      const startingFundmebalance = await fundme.provider.getBalance(
        fundme.address
      );
      const startingDeployerbalance = await fundme.provider.getBalance(
        deployer
      );

      const transactionResponse = await fundme.withdraw();
      const transactionReciept = await transactionResponse.wait(1);

      const { gasUsed, effectiveGasPrice } = transactionReciept;
      const gasCost = gasUsed.mul(effectiveGasPrice);
      const endFundmeBalance = await fundme.provider.getBalance(fundme.address);
      const endDeployerBalance = await fundme.provider.getBalance(deployer);

      expect(endFundmeBalance).to.equal(0);
      expect(
        startingFundmebalance.add(startingDeployerbalance).toString()
      ).to.equal(endDeployerBalance.add(gasCost).toString());
    });
    it("allow us too withDraw with multiple users", async function () {
      const accounts = await ethers.getSigners();
      for (i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundme.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: sendEth });
      }
      const startingFundmebalance = await fundme.provider.getBalance(
        fundme.address
      );
      const startingDeployerbalance = await fundme.provider.getBalance(
        deployer
      );

      const transactionResponse = await fundme.withdraw();
      const transactionReciept = await transactionResponse.wait(1);

      const { gasUsed, effectiveGasPrice } = transactionReciept;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endFundmeBalance = await fundme.provider.getBalance(fundme.address);
      const endDeployerBalance = await fundme.provider.getBalance(deployer);

      expect(endFundmeBalance).to.equal(0);
      expect(
        startingFundmebalance.add(startingDeployerbalance).toString()
      ).to.equal(endDeployerBalance.add(gasCost).toString());

      for (let i = 1; i < 6; i++) {
        expect(
          await fundme.getAddressToAmountFunded(accounts[i].address)
        ).to.equal(0);
      }
    });

    it("Only allows the owner to withdraw", async function () {
      const accounts = await ethers.getSigners();
      const fundMeConnectedContract = await fundme.connect(accounts[1]);
      await expect(
        fundMeConnectedContract.withdraw()
      ).to.be.revertedWithCustomError(fundme, "NotOwner");
    });
  });
});
