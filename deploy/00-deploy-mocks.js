const { network } = require("hardhat");
const {
  deploymentChain,
  DECIMALS,
  INITIAL_PRICE,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  if (deploymentChain.includes(network.name)) {
    console.log("Deploying on local network! mocks detected");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    });
    console.log("Mocks deployed");
    console.log("--------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
