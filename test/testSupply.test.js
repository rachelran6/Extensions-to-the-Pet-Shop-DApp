const Supply = artifacts.require("Supply");

contract("Supply", (accounts) => {
 let supply;
 let expectedSupplyId;

 before(async () => {
    supply = await Supply.deployed();
 });

 describe("acquiring a supply and retrieving account addresses", async () => {
   before("acquire a supply using accounts[0]", async () => {
     await supply.acquire(8, { from: accounts[0] });
     expectedAcquirer = accounts[0];
   });

   it("can fetch the address of an acquirer by supply id", async () => {
     const acquirer = await supply.acquirers(8);
     assert.equal(acquirer, expectedAcquirer, "The owner of the acquired supply should be the first account.");
   });

   it("can fetch the collection of all supply owners' addresses", async () => {
     const acquirers = await supply.getAcquirers();
     assert.equal(acquirers[8], expectedAcquirer, "The owner of the acquired supply should be in the collection.");
   });
 });
});