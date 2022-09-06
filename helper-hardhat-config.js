const networkConfig = {
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
  31337: {
    name: "localhost",
  },
  137: {
    name: "polygon",
    ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
  },
};

const deploymentChain = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_PRICE = 200000000000;

module.exports = {
  networkConfig,
  deploymentChain,
  DECIMALS,
  INITIAL_PRICE,
};
