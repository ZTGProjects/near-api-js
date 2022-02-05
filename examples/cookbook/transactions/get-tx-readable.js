const { connect, keyStores } = require("near-api-js");
const path = require("path");
const TXParser = require("../../../src/utils/transaction-parser");
const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";

/**
 * 
 * SET NETWORK FLAG.
 * set to false for testnet, true for mainnet 
 */
const IS_TEST = true;
let network = "";

// return config
function getConfig() {

	// set network for testing
	(IS_TEST) ? network = "test" : network = "main";

	// generate connect config
	// const keyStore = new keyStores.UnencryptedFileSystemKeyStore(path.join(homedir, CREDENTIALS_DIR));
	return config = {
		keyStore: new keyStores.UnencryptedFileSystemKeyStore(path.join(homedir, CREDENTIALS_DIR)),
		networkId: network + "net",
		nodeUrl: "https://archival-rpc." + network + "net.near.org",
	};
}

// account id
const accountId = "YourAccountId." + network + "net";
// tx id
const txHash = "tx hash here........";
/**
 * Use TXParser
 */
(async function () {

	try {
		// 1. connect
		const near = await connect(getConfig());
		// 2. get tx payload from provider
		const txPayload = await near.connection.provider.txStatus(txHash, accountId);
		//console.log(JSON.stringify(txPayload, null, 2));
		// 3. init parser
		const txp = new TXParser();
		// 4. call parser method with payload
		const response = await txp.getReadableTx(txPayload);
		// 5. view log
		console.log(JSON.stringify(response, null, 2));
		}
	catch (error) {
		console.error(error);
	}

	/**
		Response will be an friendly JSON object like below
		[{
			"payload": "CreateAccount",
			"meta": {
				"signer_id": "testnet",
				"receiver_id": "dedefefefefe.testnet"
			},
			"type": "CreateAccount",
			"readable": "New Account created: dedefefefefe.testnet"
		},
		{ ... }
		]
	
		
		Note: that the response is array because TX Action can have more than one Actions on single transaction, hence parser can return more that one readable
		string per Action in a Single TX
		
		From above JSON, you can simply use "readable" string. Or can possibly re-construction your own readable string of needed.
		Meta can be easily extented in future to return more valuable information

		
	 
	 */

})();

