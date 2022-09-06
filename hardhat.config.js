require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.8",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL || "http:georli.example",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "key",
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || "key",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    users: {
      default: 1,
    },
  },
};
