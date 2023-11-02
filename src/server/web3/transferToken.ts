import Web3 from "web3";
import erc20Artifact from "./erc20abi.json";

const erc20Abi = erc20Artifact.abi;

// eslint-disable-next-line
export async function transferTokens(payload: any) {
  if (!payload || !payload?.toAddress || !payload?.amount) {
    return { success: false, message: "Invalid payload data" };
  }

  try {
    const privateKey: string | undefined = process.env.NEXT_PUBLIC_Private_KEY;
    const rpcUrl: string | undefined = process.env.NEXT_PUBLIC_Mumbai_RPC_URL;
    const erc20TokenAddress: any =
      process.env.NEXT_PUBLIC_ERC20_Contract_Address;
    const toAddress: string = payload?.toAddress;
    const amount: any = payload?.amount;

    if (!privateKey || !rpcUrl || !erc20TokenAddress) {
      return { success: false, message: "Missing environment variables" };
    }

    const web3 = new Web3(rpcUrl);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    // eslint-disable-next-line
    const erc20TokenContract = new web3.eth.Contract(
      erc20Abi,
      erc20TokenAddress,
    );
    if (!erc20TokenContract.methods || !erc20TokenContract.methods.transfer) {
      throw new Error("safeMint is not defined");
    }
    let transaction = erc20TokenContract.methods.transfer(toAddress, amount);
    //need changes
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 200000; // You can adjust this based on your contract's complexity

    const options = {
      to: erc20TokenAddress,
      data: transaction.encodeABI(),
      gas: gasLimit,
      gasPrice: gasPrice,
      nonce: await web3.eth.getTransactionCount(account.address),
    };
    // eslint-disable-next-line
    const signedTransaction = await web3.eth.accounts.signTransaction(
      options,
      privateKey,
    );

    const receipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction || "",
    );

    return {
      success: true,
      receipt,
    };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: error.message };
  }
}
