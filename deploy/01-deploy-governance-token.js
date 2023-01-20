const { ethers } = require("hardhat");

 module.exports=async({getNamedAccounts,deployments})=>{
   const{deploy, log}=deployments;
   const {deployer}=await getNamedAccounts();

   console.log("Deloying.........");
   const governanceToken=await deploy("GovernanceToken",{
    from: deployer,
    args:[],
    log:true,
    waitConfirmations:1

   })
   console.log("contract Address of GovernanceToken Contract is ",governanceToken.address);
   //doing delegation stuffs
   log(`Delegating to ${deployer}`)
   
   
  await delegate(governanceToken.address,deployer);
   log("Delegated");
 

 }
 const delegate=async(governanceTokenAddress,delegatedAccount)=>{
    const governanceToken=await ethers.getContractAt("GovernanceToken",governanceTokenAddress);
    const transactionResponse=await governanceToken.delegate(delegatedAccount);
    await transactionResponse.wait(1);
    console.log("CheckPoints ", await governanceToken.numCheckpoints(delegatedAccount));
  }
 module.exports.tags=["all","governor"];

