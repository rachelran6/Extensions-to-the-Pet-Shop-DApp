pragma solidity ^0.5.0;

contract Donation {
    // Model a Donation
    struct Item {
        uint id;
        string name;
        string description;
        string donateBy;
        string donateOn;
        address admin;
    }

    // Store items
    // Fetch item
    mapping(uint => Item) public items;

    // Store items Count
    uint public itemsCount;

    constructor () public {
        addItem("Food", "Wet Food", "Scott", "Dec 24, 2020", 0x0000000000000000000000000000000000000000);
    }

    function donate (string memory _name, string memory _description, string memory _donateBy, string memory _donateOn) public {
        itemsCount ++;
        items[itemsCount] = Item(itemsCount, _name, _description, _donateBy, _donateOn, msg.sender);
    }

    function addItem (string memory _name, string memory _description, string memory _donateBy, string memory _donateOn, address _admin) private {
        itemsCount ++;
        items[itemsCount] = Item(itemsCount, _name, _description, _donateBy, _donateOn, _admin);
    }
}