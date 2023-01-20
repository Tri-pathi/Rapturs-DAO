const { network } = require("hardhat");
const fs =require("fs");


const { proposalsFile, VOTING_PERIOD, developmentChains } = require("../hardhat-helper-config");

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
async function main(){

    const proposals=JSON.parse(fs.readFileSync(proposalsFile,"utf8"));
    const proposalId=proposals[network.config.chainId].at(-1);

 // 0 = Against, 1 = For, 2 = Abstain for this example
  const voteWay = 1
  const reason = "Mera Man"
  await vote(proposalId, voteWay, reason)

}

 async function vote(proposalId,voteWay,reason){
    console.log("Voting...")
    const governor = await ethers.getContract("GovernorContract")
    const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason)
    const voteTxReceipt = await voteTx.wait(1)
    console.log(voteTxReceipt.events[0].args.reason)
    const proposalState = await governor.state(proposalId)
    console.log(`Current Proposal State: ${proposalState}`)
    if (developmentChains.includes(network.name)) {
      await moveBlocks(VOTING_PERIOD + 1)
    }
}




main().then(()=>process.exit(0)).catch((error)=>{
    console.log(error);
    process.exit(1);
})