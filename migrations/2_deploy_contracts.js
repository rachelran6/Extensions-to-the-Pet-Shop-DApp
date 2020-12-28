var Supply = artifacts.require("Supply");
var Adoption = artifacts.require("Adoption");
var Donation = artifacts.require("Donation");
var PersonalDonation = artifacts.require("PersonalDonation");

module.exports = function(deployer) {
  deployer.deploy(Supply);
  deployer.deploy(Adoption);
  deployer.deploy(Donation);
  deployer.deploy(PersonalDonation);
};