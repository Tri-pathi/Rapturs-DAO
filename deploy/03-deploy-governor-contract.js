const {
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
} = require("../hardhat-helper-config");
module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;
  const governanceToken = await get("GovernanceToken");
  const timeLock = await get("TimeLock");

  const args = [
    governanceToken.address,
    timeLock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
  ];
  log("deploying GovernorContract  ");
  const governotContract = await deploy("GovernorContract", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmation: 1,
  });
  log("GovernorContract address is ", governotContract.address);
};
module.exports.tags = ["all", "governor"];
