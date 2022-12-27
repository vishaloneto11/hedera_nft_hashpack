import axios from "axios";
import { TokenCreateTransaction, PublicKey,TokenType,CustomRoyaltyFee,CustomFixedFee,Hbar,TokenSupplyType,PrivateKey} from "@hashgraph/sdk";
    // PrivateKey,Client,TokenInfoQuery,TokenMintTransaction,
	// TokenBurnTransaction,
	// TransferTransaction,
	// AccountBalanceQuery,
	// AccountUpdateTransaction,
	// TokenAssociateTransaction
async function nfttokenCreateFcn(walletData, accountId) {
	console.log(`\n=======================================`);
	console.log(`- Creating NFT HTS token...`)
	const hashconnect = walletData[0];
	const saveData = walletData[1];
	const provider = hashconnect.getProvider("testnet", saveData.topic, accountId);
	const signer = hashconnect.getSigner(provider);

	const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts?account.id=${accountId}`;
	const mirrorQuery = await axios(url);
	const supplyKey = PublicKey.fromString(mirrorQuery.data.accounts[0].key.key);
	// const adminKey = PublicKey.fromString(mirrorQuery.data.accounts[0].key.key);

    const adminKey = PrivateKey.generate();
    // // const pauseKey = PrivateKey.generate();
    // const freezeKey = PrivateKey.generate();
    // const wipeKey = PrivateKey.generate();

    let nftCustomFee = await new CustomRoyaltyFee()
		.setNumerator(2.5)
		.setDenominator(5)
		.setFeeCollectorAccountId(accountId)
		.setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(1)));

   const CID = [
            // "https://oneto11.mypinata.cloud/ipfs/Qmf4LjUYuBPTtSHanL2rAJahuwksyqYD6NvJTZcsXoZPR4/1.json"
            "Qmf4LjUYuBPTtSHanL2rAJahuwksyqYD6NvJTZcsXoZPR4"
        ];


	const nftCreate = await new TokenCreateTransaction()
		.setTokenName("WAKA Football")
		.setTokenSymbol("footbool")
        .setTokenType(TokenType.NonFungibleUnique)
		.setDecimals(0)
		.setInitialSupply(0)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(CID.length)
        .setCustomFees([nftCustomFee])
		.setSupplyKey(supplyKey)
		.setTreasuryAccountId(accountId)
		.setAutoRenewAccountId(accountId)
		.setAutoRenewPeriod(7776000)
		.freezeWithSigner(signer)
        
		// .setAdminKey(adminKey)
		// .setFreezeKey(freezeKey)
		// .setWipeKey(wipeKey)
		// .freezeWith(accountId)
		// .sign(signer);

        let nftCreateTxSign = await nftCreate.sign(adminKey);
	    let nftCreateSubmit = await nftCreateTxSign.execute(signer);
	    let nftCreateRx = await nftCreateSubmit.getReceipt(signer);
	    let tokenId = nftCreateRx.tokenId;
	    console.log(`Created NFT with Token ID: ${tokenId} \n`);
        // const tokenCreateSubmit = await nftCreate.executeWithSigner(signer);
        // const tokenCreateRx = await provider.getTransactionReceipt(tokenCreateSubmit.transactionId);
        // const ntId = tokenCreateRx.tokenId;
        const nsupply = nftCreate._initialSupply.low;
        // console.log(`- Created NHTS token with ID: ${ntId}`);
    
        // return [ntId, nsupply, tokenCreateSubmit.transactionId];
        return [tokenId, nsupply,nftCreateRx];
}

export default nfttokenCreateFcn;
