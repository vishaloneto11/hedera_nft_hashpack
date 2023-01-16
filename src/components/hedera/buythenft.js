import { TransferTransaction ,AccountId,PrivateKey,Client} from "@hashgraph/sdk";

async function tokenTransferfcn(walletData, accountId,Tid,Tkey,Aid) {
	console.log(`\n=======================================`);
	console.log(`- Creating HTS token...`)
	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);
	console.log(Tid)
	console.log(Tkey)
	console.log(Aid)
	console.log("Start********************************************************************************")
//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const tokenId = "0.0.49307494"
	console.log("Start*********************************2***********************************************")
    const treasuryId=AccountId.fromString(Tid);
	console.log("Start*********************************3***********************************************")
    const aliceId =AccountId.fromString(Aid);
    const treasuryKey=PrivateKey.fromStringECDSA(Tkey);
    
    const client = Client.forTestnet().setOperator(treasuryId, treasuryKey);




// ######################################################################################
// working on buying nft


	console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    let tokenTransferTx = await new TransferTransaction()
	.addNftTransfer(tokenId, 1, treasuryId, aliceId)
    .freezeWith(client)
    .sign(treasuryKey);
    console.log(tokenTransferTx)

	let tokenTransferSubmit = await tokenTransferTx.execute(client);
	let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

	console.log(`\n- NFT transfer from Treasury to Alice: ${tokenTransferRx.status} \n`);







	// ______________________________________________________________________
    // let tokenTransferSubmit = await tokenTransferTx.executeWithSigner(signer);
    // let tokenTransferRx = await tokenTransferSubmit.getReceiptWithSigner(signer);


    // console.log(`\n- NFT transfer from Treasury to Alice: ${tokenTransferRx.status} \n`);






















	// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%",accountId)
	// const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts?account.id=${accountId}`;
	// console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",url)
	// const mirrorQuery = await axios(url);
	// const supplyKey = PublicKey.fromString(mirrorQuery.data.accounts[0].key.key);
	// console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++$$$$$$$$$",supplyKey)
	// const tokenCreateTx = await new TokenCreateTransaction()
	// 	.setTokenName("SalmanKahan")
	// 	.setTokenSymbol("actor")
	// 	.setTreasuryAccountId(accountId)
	// 	.setAutoRenewAccountId(accountId)
	// 	.setAutoRenewPeriod(7776000)
	// 	.setInitialSupply(100)
	// 	.setDecimals(0)
	// 	.setSupplyKey(supplyKey)
	// 	.freezeWithSigner(signer);
	// const tokenCreateSubmit = await tokenCreateTx.executeWithSigner(signer);
	// const tokenCreateRx = await provider.getTransactionReceipt(tokenCreateSubmit.transactionId);
	// const tId = tokenCreateRx.tokenId;
	// const supply = tokenCreateTx._initialSupply.low;
	// console.log(`- Created HTS token with ID: ${tId}`);
	// console.log(tokenCreateSubmit)
	// console.log(tokenCreateTx)
	// return [tId, supply, tokenCreateSubmit.transactionId];
	// return [1,1,1];
}

export default tokenTransferfcn;
