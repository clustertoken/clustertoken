var ConvertLib = artifacts.require("./ConvertLib.sol");
var ClusterToken = artifacts.require("./ClusterToken.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, ClusterToken);
  deployer.deploy(ClusterToken);
};
