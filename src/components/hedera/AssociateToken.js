import axios from "axios";
import { TokenCreateTransaction, PublicKey,TokenAssociateTransaction } from "@hashgraph/sdk";
// tokeID likho async function assotoken(walletData, accountId,tokenId)
async function assotoken(walletData, accountId) {
	console.log(`\n=======================================`);
	console.log(`- Creating HTS token...`)
	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts?account.id=${accountId}`;
	const mirrorQuery = await axios(url);
	const supplyKey = PublicKey.fromString(mirrorQuery.data.accounts[0].key.key);
    const tokenId = "0.0.49311284"

    //Associate a token to an account and freeze the unsigned transaction for signing
    const transaction = await new TokenAssociateTransaction()
            .setAccountId(accountId)
            // .setTokenIds("0.0.49209547")
            .setTokenIds([tokenId])
            // .freezeWith(client);
            .freezeWithSigner(signer);

            //Sign with the private key of the account that is being associated to a token 
            const signTx = await transaction.signWithSigner(signer);

            //Submit the transaction to a Hedera network    
            const txResponse = await signTx.executeWithSigner(signer);

            //Request the receipt of the transaction
            const receipt = await txResponse.getReceipt(signer);

            //Get the transaction consensus status
            const transactionStatus = receipt.status;

            console.log("The transaction consensus status " +transactionStatus.toString());

//v2.0.7

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
}

export default assotoken;
