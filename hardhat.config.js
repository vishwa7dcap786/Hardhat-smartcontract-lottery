require("@nomiclabs/hardhat-etherscan")
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("solidity-coverage")
require("dotenv").config()

ETHERSCAN_API_KEY =process.env.ETHERSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
      hardhat: {
          // // If you want to do some forking, uncomment this
          // forking: {
          //   url: MAINNET_RPC_URL
          // }
          chainId: 31337,
      },
      localhost: {
          chainId: 31337,
      },
  networks:{
    hardhat: {
      // // If you want to do some forking, uncomment this
      // forking: {
      //   url: MAINNET_RPC_URL
      // }
      chainId: 31337,
  },
  localhost: {
      chainId: 31337,
  },
    sepolia:
    {
      url:process.env.SEPOLIA_RPC_URL,
      accounts:[process.env.PRIVATE_KEY],
      chainId:11155111,
      
    },

  },
  
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
        1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    player: {
        default: 1,
    },
  },
  verify: {etherscan: {
       apikey:ETHERSCAN_API_KEY,
  
  
  },},
  solidity: 
    {
      compilers:[{version:"0.8.19"},]
      },
};
