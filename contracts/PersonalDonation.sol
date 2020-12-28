pragma solidity ^0.5.0;

contract PersonalDonation {
    // Model a personal Donation
    struct Record {
        uint id;
        string name;
        string donateBy;
        string donateOn;
        address donorAddr;
    }

    mapping(uint => Record) public records;

    // Store records Count
    uint public recordsCount;

    constructor () public {
        addRecord("Food", "Scott", "Dec 24, 2020", 0x0000000000000000000000000000000000000000);
    }

    function addDonation (string memory _name, string memory _donateBy, string memory _donateOn) public {
        recordsCount ++;
        records[recordsCount] = Record(recordsCount, _name, _donateBy, _donateOn, msg.sender);
    }

    function addRecord (string memory _name, string memory _donateBy, string memory _donateOn, address _admin) private {
        recordsCount ++;
        records[recordsCount] = Record(recordsCount, _name, _donateBy, _donateOn, _admin);
    }
}