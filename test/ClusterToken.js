var ClusterCoin = artifacts.require("./ClusterToken.sol");

var TOTAL_COINS = 750000000000000000000;
var CROWDSALE_CAP = 500000000000000000000
var CLRT_PER_ETHER = 100000000000000000;


contract('FastFlow', function(accounts) {

  var eth = web3.eth;
  var owner = eth.accounts[0];
  var wallet = eth.accounts[1];
  var buyer = eth.accounts[2];
  var thief = eth.accounts[3];
  var depl;


  function printBalance() {
    const ownerBalance = web3.eth.getBalance(owner);
    const walletBalance = web3.eth.getBalance(wallet);
    const buyerBalance = web3.eth.getBalance(buyer);
	//const deplBalance = web3.eth.getBalance(depl);
    //const crowdsaleBalance = web3.eth.getBalance(Crowdsale.address);

    console.log("Owner balance [1]", web3.fromWei(ownerBalance, "ether").toString(), " ETHER");
    console.log("Wallet balance [2]", web3.fromWei(walletBalance, "ether").toString(), " ETHER");
    console.log("Buyer balance [3]", web3.fromWei(buyerBalance, "ether").toString(), " ETHER");
    // console.log("Crowdsale balance", web3.fromWei(crowdsaleBalance, "ether").toString(), " ETHER");
	
	console.log("/////");

	console.log ("owner: " , owner);
	console.log ("wallet: " , wallet);
	console.log ("buyer: " , buyer);
	console.log ("thier: " , thief);
console.log("/////");

//geth --testnet --rpc --rpccorsdomain "*" console -unlock 0 1 2 3
//0x05429f9d1da9b82ec24156a802be6e27ec3c91fd --unlock 0x2ebf78a58dd444f89b64c3514b61bbd05032a323 --unlock 0xce209c4602d1d403977a11a78f480aab5dd4548d --unlock 0x9a11feee67aab7a1dec8d495f7e801edb3d9e8ff


    return ClusterCoin.deployed().then(function(instance) {
      return instance.balanceOf.call(owner)
    .then(function(balance) {
      console.log("Owner token balance: ", web3.fromWei(ownerBalance, "ether").toString(), " ETHER / ", balance.valueOf(), " CLRT");
	  console.log("Owner token 2 balance: ", web3.fromWei(walletBalance, "ether").toString(), " ETHER / ", balance.valueOf(), " CLUSTER");
	  
      console.log ("CONTRACT ADDRESS: " , instance.address);
	  depl = instance.address;
	  
	  console.log("CTR: ", instance.address, ", ", web3.fromWei(web3.eth.getBalance(instance.address), "ether").toString(), " ETHER / ", balance.valueOf(), " CLUSTER");
	  
	  return instance.balanceOf.call(buyer); 
    })

  })
  }
  
    it("should put 750 CLUSTER in the owner account", function() {
    return printBalance().then(function() {
      return ClusterCoin.deployed().then(function(instance) {
        return instance.balanceOf.call(owner);
      }).then(function(balance) {
        assert.equal(balance.valueOf(), TOTAL_COINS, "750000000000000000000 wasn't in the owner account.");
      });
    })
  });
  
  
  it("Buy 1 CLUSTER", function() {
   // web3.evm.increaseTime(PERIOD_2_DAYS);
    var investSum = 100000000000000000; 
	console.log("Investing ", web3.fromWei(investSum, "ether"), " ETHER in contract, 1 CLUSTER expected");
		
    return ClusterCoin.deployed().then(function(crowd) {
       return crowd.sendTransaction({from: buyer, to: crowd.address, value: investSum}).then(function(txn) {
		   console.log ("Crowd address = ", crowd.address);
          return ClusterCoin.deployed().then(function(coin) {
            return coin.balanceOf.call(buyer);
			
          });
       })
     }).then(function(balance) {
        console.log("Buyer balance: ", web3.fromWei(balance.valueOf(), "ether"), " CLUSTER");
		//console.log(web3.eth.getBalance(wallet));
		const walletBalance = web3.eth.getBalance(depl);
		//const deplBalance = web3.eth.getBalance(owner);
		console.log("TOKEN CONTRACT balance", web3.fromWei(walletBalance, "ether").toString(), " ETHER");
        

		var count = 10000000000000000;
        assert.equal(balance.valueOf(), count, "10000 wasn't in the first account.");
     });
  });

  
  
  
  function rpc(method, arg) {
    var req = {
      jsonrpc: "2.0",
      method: method,
      id: new Date().getTime()
    };

    if (arg) req.params = arg;

    return new Promise((resolve, reject) => {
      web3.currentProvider.sendAsync(req, (err, result) => {
        if (err) return reject(err)
        if (result && result.error) {
          return reject(new Error("RPC Error: " + (result.error.message || result.error)))
        }
        resolve(result)
      });
    })
  }

  // Change block time using the rpc call "evm_setTimestamp" available in the testrpc fork https://github.com/Georgi87/testrpc
  web3.evm = web3.evm || {}
  web3.evm.increaseTime = function (time) {
    return rpc('evm_increaseTime', [time]);
  }

});