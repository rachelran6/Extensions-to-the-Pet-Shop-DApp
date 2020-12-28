pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Supply.sol";

contract TestSupply {
// The address of the supply contract to be tested
 Supply supply = Supply(DeployedAddresses.Supply());

// The id of the supply that will be used for testing
 uint expectedSupplyId = 8;

//The expected owner of acquired supply is this contract
 address expectedAcquirer = address(this);

// Testing the acquire() function
function testUserCanAcquireSupply() public {
  uint returnedId = supply.acquire(expectedSupplyId);

  Assert.equal(returnedId, expectedSupplyId, "Acquirement of the expected supply should match what is returned.");
}

// Testing retrieval of a single supply's acquirer
function testGetAcquirerAddressBySupplyId() public {
  address acquirer = supply.acquirers(expectedSupplyId);

  Assert.equal(acquirer, expectedAcquirer, "Acquirer of the expected supply should be this contract");
}

// Testing retrieval of all supply acquirers
function testGetAcquirerAddressBySupplyIdInArray() public {
  // Store acquirers in memory rather than contract's storage
  address[16] memory acquirers = supply.getAcquirers();

  Assert.equal(acquirers[expectedSupplyId], expectedAcquirer, "Acquirer of the expected supply should be this contract");
}


}

