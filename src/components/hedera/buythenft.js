import { TransferTransaction ,AccountId,PrivateKey,Client, Hbar} from "@hashgraph/sdk";

async function tokenTransferfcn(walletData, accountId,Tid,Tkey,Aid) {

	console.log(`Creating HTS token-------------------------------------------------`)
	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);
    const tokenId = "0.0.49398806"
    const treasuryId=AccountId.fromString(Tid);
    const aliceId =AccountId.fromString(accountId);
    const treasuryKey=PrivateKey.fromStringECDSA(Tkey);
   
    const client = Client.forTestnet().setOperator(treasuryId, treasuryKey);
    









	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	let tokenTransferTx = await new TransferTransaction()
	.addNftTransfer(tokenId, 1, treasuryId, aliceId)
	.addHbarTransfer(AccountId.fromString(accountId), -2)
	.addHbarTransfer(AccountId.fromString(treasuryId), 2)
	.freezeWith(client)
    .sign(treasuryKey)
	
    // ################################################
    console.log(tokenTransferTx)
	// const signTx = await tokenTransferTx.signWithSigner(signer);    
	const txResponse = await tokenTransferTx.executeWithSigner(signer);
	console.log(txResponse)
	





	// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


    // let tokenT = await new TransferTransaction()
	// .addNftTransfer(tokenId, 1, treasuryId, aliceId)
	
    // .freezeWith(client)
    // .sign(treasuryKey)
    
    // console.log(tokenT)
	
	// let tokenTransferSubmit = await tokenT.execute(client);
	// let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

	// console.log(`\n- NFT transfer from Treasury to Alice: ${tokenTransferRx.status} \n`);

    // let tokenTransferTx2 = await new TransferTransaction()
	// 	.addNftTransfer(tokenId, 2, aliceId, bobId)
	// 	.addHbarTransfer(aliceId, 100)
	// 	.addHbarTransfer(bobId, -100)
	// 	.freezeWith(client)
	// 	.sign(aliceKey);
	// tokenTransferTx2Sign = await tokenTransferTx2.sign(bobKey);
	// let tokenTransferSubmit2 = await tokenTransferTx2Sign.execute(client);
	// let tokenTransferRx2 = await tokenTransferSubmit2.getReceipt(client);
	// console.log(`\n NFT transfer Alice->Bob status: ${tokenTransferRx2.status} \n`);


}

export default tokenTransferfcn;
