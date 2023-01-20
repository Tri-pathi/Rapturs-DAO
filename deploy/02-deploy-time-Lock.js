const { MIN_DELAY, ADDRESS_ZERO } = require("../hardhat-helper-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying TimeLock:)");
  console.log(deployer);
  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], [],deployer],
    log: true,
    waitConfirmations: 1,
  });

  console.log("TimeLock Contract deployed at ", timeLock.address);
};
module.exports.tags = ["all", "timeLock"];
