const { network, ethers } = require("hardhat");
const {developmentchains,networkconfig} = require("../helper.hardhat.config");
const {verify} = require("../utils/verify")


module.exports = async ({getNamedAccounts,deployments}) => {
    const {deploy,log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;
    let VRFCoordinatorV2
    let subscriptionId
    let VRFCoordinatorMock
    const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30")
    if(chainId==31337){
        VRFCoordinatorMock = await ethers.getContract("VRFCoordinatorV2Mock")
        VRFCoordinatorV2 = VRFCoordinatorMock.address
        const transactionResponse = await VRFCoordinatorMock.createSubscription()
        const transactionReceipt  = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId
        log(subscriptionId.toString())
        //usually , you would need to link token on a real network
        await VRFCoordinatorMock.fundSubscription(subscriptionId,VRF_SUB_FUND_AMOUNT)
    
    }
    else{
        VRFCoordinatorV2 = networkconfig[chainId]["COORDINATOR"]
        subscriptionId =  networkconfig[chainId]["subscriptionId"]

    } 
                // vrfCoordinatorV2  ,
                //  entrenceFee,
                //  gaslean,
                // subscriptionId,
                // callbackGasLimit,
                //  interval
    const entrenceFee = networkconfig[chainId]["entrenceFee"]
    const gaslean  =  networkconfig[chainId]["gaslean"]
    const callbackGasLimit =  networkconfig[chainId]["callbackGasLimit"]
    const interval =  networkconfig[chainId]["interval"]
    const args = [VRFCoordinatorV2,entrenceFee,gaslean,subscriptionId,callbackGasLimit,interval]

    const lottery = await deploy("lottery",{
        from:deployer ,
        args:args,
        log: true,

    })
    if (developmentchains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, lottery.address)
        log("added")
    }

    if(!chainId==31337&& process.env.ETHERSCAN_API_KEY){
        console.log(process.env.ETHERSCAN_API_KEY)

       await verify(lottery.address,args)
       
    }
    log("---------------------------------------------------")
}

module.exports.tags = ["all","lattery"]