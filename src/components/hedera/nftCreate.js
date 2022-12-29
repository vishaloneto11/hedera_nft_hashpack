const {
	AccountId,
	PrivateKey,
	Client,
	TokenCreateTransaction,
	TokenType,
	TokenSupplyType,
	TokenMintTransaction,
	TransferTransaction,
	AccountBalanceQuery,
	TokenAssociateTransaction,
} = require("@hashgraph/sdk");

// Configure accounts and client, and generate needed keys
const operatorId = "0.0.49161691"
const operatorKey = "302e020100300506032b657004220420bc74b4ad8c5148ef46d3f13509a8b6d2f37c81284fc2f9c4f8c3f436998bde4b"
const treasuryId = "0.0.49161691"
const treasuryKey = "302e020100300506032b657004220420bc74b4ad8c5148ef46d3f13509a8b6d2f37c81284fc2f9c4f8c3f436998bde4b"
const aliceId = "0.0.49161120"
const aliceKey = "302e020100300506032b657004220420bb9f6b9b3f41f7ffd53ce8f6ab2664541fb3afe88e68c513a1ed40c0ab57c3fa"

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const supplyKey = PrivateKey.generate();
let CID = [""]
async function main() {
	//Create the NFT
	let nftCreate = await new TokenCreateTransaction()
		.setTokenName("football_messi")
		.setTokenSymbol("GRAD")
		.setTokenType(TokenType.NonFungibleUnique)
		.setDecimals(0)
		.setInitialSupply(0)
		.setTreasuryAccountId(treasuryId)
		.setSupplyType(TokenSupplyType.Finite)
		.setMaxSupply(250)
		.setSupplyKey(supplyKey)
		.freezeWith(client);

	//Sign the transaction with the treasury key
	let nftCreateTxSign = await nftCreate.sign(treasuryKey);

	//Submit the transaction to a Hedera network
	let nftCreateSubmit = await nftCreateTxSign.execute(client);

	//Get the transaction receipt
	let nftCreateRx = await nftCreateSubmit.getReceipt(client);

	//Get the token ID
	let tokenId = nftCreateRx.tokenId;

	//Log the token ID
	console.log(`- Created NFT with Token ID: ${tokenId} \n`);

	//IPFS content identifiers for which we will create a NFT
	CID = ["Qmf4LjUYuBPTtSHanL2rAJahuwksyqYD6NvJTZcsXoZPR4"];

	// Mint new NFT
	let mintTx = await new TokenMintTransaction()
		.setTokenId(tokenId)
		.setMetadata([Buffer.from(CID)])
		.freezeWith(client);

	//Sign the transaction with the supply key
	let mintTxSign = await mintTx.sign(supplyKey);

	//Submit the transaction to a Hedera network
	let mintTxSubmit = await mintTxSign.execute(client);

	//Get the transaction receipt
	let mintRx = await mintTxSubmit.getReceipt(client);

	//Log the serial number
	console.log(`- Created NFT ${tokenId} with serial: ${mintRx.serials[0].low} \n`);
	
	//Create the associate transaction and sign with Alice's key 
	let associateAliceTx = await new TokenAssociateTransaction()
		.setAccountId(aliceId)
		.setTokenIds([tokenId])
		.freezeWith(client)
		.sign(aliceKey);

	//Submit the transaction to a Hedera network
	let associateAliceTxSubmit = await associateAliceTx.execute(client);

	//Get the transaction receipt
	let associateAliceRx = await associateAliceTxSubmit.getReceipt(client);

	//Confirm the transaction was successful
	console.log(`- NFT association with Alice's account: ${associateAliceRx.status}\n`);


// 	// Check the balance before the transfer for the treasury account
// 	var balanceCheckTx = await new AccountBalanceQuery().setAccountId(treasuryId).execute(client);
// 	console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

// 	// Check the balance before the transfer for Alice's account
// 	var balanceCheckTx = await new AccountBalanceQuery().setAccountId(aliceId).execute(client);
// 	console.log(`- Alice's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

// 	// Transfer the NFT from treasury to Alice
// 	// Sign with the treasury key to authorize the transfer
// 	let tokenTransferTx = await new TransferTransaction()
// 		.addNftTransfer(tokenId, 1, treasuryId, aliceId)
// 		.freezeWith(client)
// 		.sign(treasuryKey);

// 	let tokenTransferSubmit = await tokenTransferTx.execute(client);
// 	let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

// 	console.log(`\n- NFT transfer from Treasury to Alice: ${tokenTransferRx.status} \n`);

// 	// Check the balance of the treasury account after the transfer
// 	var balanceCheckTx = await new AccountBalanceQuery().setAccountId(treasuryId).execute(client);
// 	console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

// 	// Check the balance of Alice's account after the transfer
// 	var balanceCheckTx = await new AccountBalanceQuery().setAccountId(aliceId).execute(client);
// 	console.log(`- Alice's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);
}
export default main;