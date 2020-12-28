pragma solidity ^0.5.0;

contract Supply {
address[16] public acquirers;
// Choose supplies
function acquire(uint supplyId) public returns (uint) {
  require(supplyId >= 0 && supplyId <= 15);

  acquirers[supplyId] = msg.sender;

  return supplyId;
}
// Retrieving the acquirers
function getAcquirers() public view returns (address[16] memory) {
  return acquirers;
}

}