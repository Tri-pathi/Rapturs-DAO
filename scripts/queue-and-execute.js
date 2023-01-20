const { ethers, network }=require("hardhat");
const { FUNC, NEW_STORE_VALUE, proposalsFile, PROPOSAL_DESCRIPTION, VOTING_DELAY, developmentChains, MIN_DELAY } =require( "../hardhat-helper-config");




const moveBlocks=async(amount)=>{
    console.log("We are in Hardhat so we can just move the block and that's what we are doing ")
    for(let i=0;i<amount;i++){
     await network.provider.request({
        method:"evm_mine",
        params:[]
     })
    }
    console.log(`Moved ${amount} blocks`);
  }
  const moveTime=async (amount) =>{
    console.log("Moving time..... ");
    await network.provider.send("evm_increaseTime", [amount]);
    console.log(`Moved  forward in time ${amount} seconds`);
  }
  
  
 async function queueAndExecute(){
    const args=[NEW_STORE_VALUE];
    const functionToCall=FUNC

    const target=await ethers.getContract("Target");
    const encodeFunctionalCall=target.interface.encodeFunctionData(functionToCall,args);
    const descriptionHash =ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION));
    //we can also use ethers.utils.id(PROPOSAL_DESCRIPTION)

    const governor=await ethers.getContract("GovernorContract");
    console.log("Queueing......");
    const queueTx=await governor.queue([target.address],[0],[encodeFunctionalCall],descriptionHash);
    await queueTx.wait();
    if(developmentChains.includes(network.name)){
        await moveTime(MIN_DELAY+1);
        await moveBlocks(1);
    }

    console.log("Executing...")
    const executeTx=await governor.execute(
        [target.address],
        [0],
        [encodeFunctionalCall],
        descriptionHash
    )
    await executeTx.wait(1);
    console.log(`Target value: ${await target.retrieve()}`)
}

queueAndExecute().then(()=>process.exit(0)).catch((error)=>{
    console.log(error);
    process.exit(1);
})