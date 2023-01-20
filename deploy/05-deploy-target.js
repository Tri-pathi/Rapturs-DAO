const { ethers } = require("hardhat");

module.exports=async({getNamedAccounts,deployments})=>{
 const{deployer}=await getNamedAccounts();
 const{deploy,log}= deployments;
 console.log("Deploying Target contract");
 const target=await deploy("Target",{
    from:deployer,
    args:[],
    log:true,
    waitConfirmations:1
 })
 console.log("Address of Target Contract is ", target.address);

 const targetContract=await ethers.getContractAt("Target",target.address);
 const timeLock=await ethers.getContract("TimeLock");
 const transfertx=await targetContract.transferOwnership(timeLock.address);
 await transfertx.wait(1);
 

}
module.exports.tags=["all","target"];