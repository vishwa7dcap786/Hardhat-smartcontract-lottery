const { network } = require("hardhat");

const networkconfig={
    default: {
        name: "hardhat",
        interval: "30",
    },

    11155111:{
        name:"sepolia",
        COORDINATOR: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        entrenceFee : ethers.utils.parseEther("0.5"),
        gaslean  :"0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        subscriptionId : "2311",
        callbackGasLimit : "50000",
        interval :"30"
    },
    31337:{
        name:"localhost",
        entrenceFee : ethers.utils.parseEther("0.5"),
        gaslean  :"0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        callbackGasLimit : "50000",
        interval :"30"

    }
};

const developmentchains=["hardhat","localhost"]
module.exports={
    networkconfig,
    developmentchains
}