App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    // Load supplies
    $.getJSON('../supplies.json', function(dataS) {
      var suppliesRow = $('#suppliesRow');
      var supplyTemplate = $('#supplyTemplate');

      for (i = 0; i < dataS.length; i ++) {
        supplyTemplate.find('.panel-title').text(dataS[i].name);
        supplyTemplate.find('img').attr('src', dataS[i].picture);
        supplyTemplate.find('.pet-food').text(dataS[i].description);
        supplyTemplate.find('.pet-donatedBy').text(dataS[i].donatedBy);
        supplyTemplate.find('.pet-donatedOn').text(dataS[i].donatedOn);
        supplyTemplate.find('.btn-acquire').attr('data-id', dataS[i].id);

        suppliesRow.append(supplyTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {

    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    // return App.initContract2(), App.initContract(), App.initContract3(), App.initContract4();
    return App.initContract(), App.initContract2(), App.initContract3(), App.initContract4();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
    
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  // initiate another contract
  initContract2: function() {
    $.getJSON('Supply.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var SupplyArtifact = data;
      App.contracts.Supply = TruffleContract(SupplyArtifact);
    
      // Set the provider for our contract
      App.contracts.Supply.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the acquired supplies
      return App.markAcquired();
    });

    return App.bindEvents2();
  },

  // initiate another contract
  initContract3: function() {
    $.getJSON('Donation.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var DonationArtifact = data;
      App.contracts.Donation = TruffleContract(DonationArtifact);
    
      // Set the provider for our contract
      App.contracts.Donation.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the acquired supplies
      return App.loadNewSupplies();
    });

    return App.bindEvents3();
  },

  // initiate another contract
  initContract4: function() {
    $.getJSON('PersonalDonation.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PersonalDonationArtifact = data;
      App.contracts.PersonalDonation = TruffleContract(PersonalDonationArtifact);
    
      // Set the provider for our contract
      App.contracts.PersonalDonation.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the acquired supplies
      return App.loadNewDonations();
    });

    return App.bindEvents4();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  bindEvents2: function() {
    $(document).on('click', '.btn-acquire', App.handleAcquire);
  },

  bindEvents3: function() {
    $(document).on('click', '.btn-donate', App.handleDonate);
  },

  bindEvents4: function() {
    $(document).on('click', '.btn-personal-donate', App.handlePersonalDonate);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
    
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  markAcquired: function(acquirers, account) {
    var supplyInstance;

    App.contracts.Supply.deployed().then(function(instance) {
      supplyInstance = instance;
    
      return supplyInstance.getAcquirers.call();
    }).then(function(acquirers) {
      for (i = 0; i < acquirers.length; i++) {
        if (acquirers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-supply').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
    
        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleAcquire: function(event) {
    event.preventDefault();

    var supplyId = parseInt($(event.target).data('id'));

    var supplyInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Supply.deployed().then(function(instance) {
        supplyInstance = instance;
    
        // Execute adopt as a transaction by sending account
        return supplyInstance.acquire(supplyId, {from: account});
      }).then(function(result) {
        return App.markAcquired();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleDonate: function(event) {
    event.preventDefault();

    var form = document.getElementById("addSupply");
    var itemName = form.itemName.value;
    var itemDescription = form.description.value;
    var itemDonor = form.donor.value;
    var itemDate = form.date.value;

    var donationInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Donation.deployed().then(function(instance) {
        donationInstance = instance;

        return donationInstance.donate(itemName, itemDescription, itemDonor, itemDate, {from: account});
      }).then(function(result) {
        // reload page to show the record
        return App.loadNewSupplies();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  },

  handlePersonalDonate: function(event) {
    event.preventDefault();

    var e = document.getElementById("selectedItem");
    var itemName = e.options[e.selectedIndex].text;
    var form = document.getElementById("addDonation");
    var itemDonor = form.preferredName.value;
    var itemDate = form.preferredDate.value;
    console.log(itemName)
    console.log(itemDonor)
    console.log(itemDate)

    var personalDonationInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.PersonalDonation.deployed().then(function(instance) {
        personalDonationInstance = instance;

        return personalDonationInstance.addDonation(itemName, itemDonor, itemDate, {from: account});
      }).then(function(result) {
        // reload page to show the record
        return App.loadNewDonations();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  },

  loadNewSupplies: function() {
    var donateInstance;

    App.contracts.Donation.deployed().then(function(instance) {
      donateInstance = instance;
      return donateInstance.itemsCount();
    }).then(function(itemsCount) {
      // Load new supplies
      var newSuppliesRow = $('#newSuppliesRow');
      var newSupplyTemplate = $('#newSupplyTemplate');
      // document.getElementById("newSuppliesRow").clear();

      donateInstance.items(itemsCount).then(function(item) {

        newSupplyTemplate.find('.panel-title').text(item[1]);
        // newSupplyTemplate.find('img').attr('src', item[2]);
        newSupplyTemplate.find('.item-description').text(item[2]);
        newSupplyTemplate.find('.item-donatedBy').text(item[3]);
        newSupplyTemplate.find('.item-donatedOn').text(item[4]);
        newSupplyTemplate.find('.item-address').text(item[5]);
        // newSupplyTemplate.find('.btn-acquire').attr('data-id', item[0]);
  
        newSuppliesRow.append(newSupplyTemplate.html());  
        
      });  

      // for (var i = 1; i <= itemsCount; i++) {
      //   donateInstance.items(i).then(function(item) {

      //     newSupplyTemplate.find('.panel-title').text(item[1]);
      //     // newSupplyTemplate.find('img').attr('src', item[2]);
      //     newSupplyTemplate.find('.item-description').text(item[2]);
      //     newSupplyTemplate.find('.item-donatedBy').text(item[3]);
      //     newSupplyTemplate.find('.item-donatedOn').text(item[4]);
      //     newSupplyTemplate.find('.item-address').text(item[5]);
      //     // newSupplyTemplate.find('.btn-acquire').attr('data-id', item[0]);
    
      //     newSuppliesRow.append(newSupplyTemplate.html());  
          
      //   });
      // }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  loadNewDonations: function() {
    var personalDonateInstance;

    App.contracts.PersonalDonation.deployed().then(function(instance) {
      personalDonateInstance = instance;
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
        }
      });
      return personalDonateInstance.recordsCount();
    }).then(function(recordsCount) {
      // Load new supplies
      var newDonationRow = $('#newDonationRow');
      var newDonationTemplate = $('#newDonationTemplate');
      // document.getElementById("newSuppliesRow").clear();

      personalDonateInstance.records(recordsCount).then(function(record) {
        if(record[4] == App.account) {
          newDonationTemplate.find('.panel-title').text(record[1]);
          newDonationTemplate.find('.item-id').text(record[0]);
          // newSupplyTemplate.find('img').attr('src', item[2]);
          // newDonationTemplate.find('.item-description').text(item[2]);
          newDonationTemplate.find('.item-donatedBy').text(record[2]);
          newDonationTemplate.find('.item-donatedOn').text(record[3]);
          // newDonationTemplate.find('.item-address').text(item[5]);
          // newSupplyTemplate.find('.btn-acquire').attr('data-id', item[0]);
    
          newDonationRow.append(newDonationTemplate.html());  
        }      
      });  

      // for (var i = 1; i <= itemsCount; i++) {
      //   donateInstance.items(i).then(function(item) {

      //     newSupplyTemplate.find('.panel-title').text(item[1]);
      //     // newSupplyTemplate.find('img').attr('src', item[2]);
      //     newSupplyTemplate.find('.item-description').text(item[2]);
      //     newSupplyTemplate.find('.item-donatedBy').text(item[3]);
      //     newSupplyTemplate.find('.item-donatedOn').text(item[4]);
      //     newSupplyTemplate.find('.item-address').text(item[5]);
      //     // newSupplyTemplate.find('.btn-acquire').attr('data-id', item[0]);
    
      //     newSuppliesRow.append(newSupplyTemplate.html());  
          
      //   });
      // }
    }).catch(function(err) {
      console.log(err.message);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
