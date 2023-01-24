import axios from "axios";
import { TokenCreateTransaction, PublicKey,TokenAssociateTransaction } from "@hashgraph/sdk";
async function assotoken(walletData, accountId) {
	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts?account.id=${accountId}`;
	const mirrorQuery = await axios(url);
	const supplyKey = PublicKey.fromString(mirrorQuery.data.accounts[0].key.key);
    const tokenId = "0.0.49398806"

    const transaction = await new TokenAssociateTransaction()
            .setAccountId(accountId)
            .setTokenIds([tokenId])
            .freezeWithSigner(signer);

            const signTx = await transaction.signWithSigner(signer);    
            const txResponse = await signTx.executeWithSigner(signer);
            const receipt = await txResponse.getReceipt(signer);
            
			const transactionStatus = receipt.status;

            console.log("The transaction consensus status " +transactionStatus.toString());


	
}

export default assotoken;
