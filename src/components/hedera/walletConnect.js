import { HashConnect } from "hashconnect";

async function walletConnectFcn() {
	console.log(`\n=======================================`);
	console.log("- Connecting wallet...");

	let saveData = {
		topic: "",
		pairingString: "",
		privateKey: "",
		pairedWalletData: null,
		pairedAccounts: [],
	};
	let appMetadata = {
		name: "OneTo11_vishal",
		description: "OneTo11 NFT MarketPlace",
		
	};
	let hashconnect = new HashConnect();
	
	
	const initData = await hashconnect.init(appMetadata);
	saveData.privateKey = initData.privKey;
	console.log(`- Private key for pairing: ${saveData.privateKey}`);

	
	const state = await hashconnect.connect();
	saveData.topic = state.topic;
	console.log(`- Pairing topic is: ${saveData.topic}`);

	
	saveData.pairingString = hashconnect.generatePairingString(state, "testnet", false);

	
	hashconnect.findLocalWallets();
	hashconnect.connectToLocalWallet(saveData.pairingString);

	return [hashconnect, saveData];
}

export default walletConnectFcn;
