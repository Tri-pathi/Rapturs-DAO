const { ethers, network }=require("hardhat");
const { FUNC, NEW_STORE_VALUE, proposalsFile, PROPOSAL_DESCRIPTION, VOTING_DELAY, developmentChains } =require( "../hardhat-helper-config");
const fs =require("fs");

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

async function propose(args,functionToCall,proposalDescription){
  const governor= await ethers.getContract("GovernorContract");
  const target=await ethers.getContract("Target");
  const encodeFunctionalCall=target.interface.encodeFunctionData(functionToCall,args);
  console.log(`Proposing ${functionToCall} on ${target.address} with ${args}`)
  console.log(`Proposal Description:\n  ${proposalDescription}`)


  const proposeTransactionResponse=await governor.propose(
    [target.address],
    [0],
    [encodeFunctionalCall],
    proposalDescription
  )

  if(developmentChains.includes(network.name)){
    await moveBlocks (VOTING_DELAY+1);
  }
  const proposalReceipt=await proposeTransactionResponse.wait();
  const proposalId=proposalReceipt.events[0].args.proposalId;
  console.log(`Proposed with proposal ID:\n  ${proposalId}`)
  storeProposalId(proposalId);


  const proposalState=await governor.state(proposalId);
  const proposalSnapShot=await governor.proposalSnapshot(proposalId);
  const proposalDeadline=await governor.proposalDeadline(proposalId);

   console.log(`Current Proposal State: ${proposalState}`)
     // What block # the proposal was snapshot

   console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
   console.log(`Current Proposal Deadline: ${proposalDeadline}`)

}
function storeProposalId(proposalId){
  const chainId=network.config.chainId.toString();
  let proposals;
  if(fs.existsSync(proposalsFile)){
    proposals=JSON.parse(fs.readFileSync(proposalsFile, "utf8"));

  }else{
    proposals={ };
    proposals[chainId]=[];
  }

  proposals[chainId].push(proposalId.toString());
  fs.writeFileSync(proposalsFile,JSON.stringify(proposals),"utf8");
}

propose([NEW_STORE_VALUE],FUNC,PROPOSAL_DESCRIPTION).then(()=>process.exit(0))
.catch((error)=>{
  console.log(error);
  process.exit(1);
})

