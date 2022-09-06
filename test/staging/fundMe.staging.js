const { ethers, getNamedAccounts, network } = require("hardhat");
const { deploymentChain } = require("../../helper-hardhat-config");
const { expect } = require("chai");

deploymentChain.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      let fundme;
      let deployer;
      const sendEth = ethers.utils.parseEther("1");
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundme = await ethers.getContract("FundMe", deployer);
      });

      it("allows people to fund and withDraw", async function () {
        await fundme.fund({ value: sendEth });
        await fundme.withDraw();
        const endBalance = await fundme.provider.getBalance(fundme.address);
        expect(endBalance.toString()).to.equal("0");
      });
    });
