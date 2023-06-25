const { network } = require("hardhat")
const {developmentchains} =require("../helper.hardhat.config")



module.exports=async ({getNamedAccounts,deployments}) => {
    const {get,deploy,log}= deployments
    const {deployer}= await getNamedAccounts()
    chainId = network.config.chainId
    const BASE_FEE = ethers.utils.parseEther("0.25")
    const GAS_PRICE_LINK = 1e9

    const args = [BASE_FEE,GAS_PRICE_LINK]
    if(chainId==31337){
    const VRFCoordinatormock = await deploy("VRFCoordinatorV2Mock",{
        from:deployer,
        args:args,
        log:true
   
         })
        log("mock Deployed")
    }


    }
    module.exports.tags= ["all","mocks"]
