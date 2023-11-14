import React, { useEffect, useReducer } from "react";
import Link from "next/link";
import { useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { useSelector, useDispatch } from "react-redux";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { setUpdateNftData } from "~/redux/features/BuyNftSlicer";
import T3MarketJson from "../components/contractAddressAndJson/T3MarketplaceContract.json";
import MyTokenJson from "../components/contractAddressAndJson/MyToken.json";
import T3MarketAddress from "../components/contractAddressAndJson/T3MarketplaceContract-address.json";
import MyTokenAddress from "../components/contractAddressAndJson/MyToken-address.json";
import LoadingModal from "../components/layout/loader";
import { useRouter } from "next/router";

const success = () => {
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const { config: buyConfig } = usePrepareContractWrite({
    address: "0x51c144F49e4a8C0523AF67F5698Bd970C1DB6db6",
    abi: MyTokenJson.abi,
    functionName: "approve",
    args: ["0xB35610f89D0d8EC1aC3F2F3887475eB16A78BC35", amount],
  });
  const {
    data: approveData,
    isLoading: approveIsLoading,
    isSuccess: approveIsSuccess,
    write: approveTokens,
  } = useContractWrite(buyConfig);

  const {
    data: approveWaitData,
    isError: approveWaitError,
    isSuccess: approveTxIsSuccess,
  } = useWaitForTransaction({
    hash: approveData?.hash,
  });

  // const listingSuccess = buyTxIsSuccess;

  async function approveNft(e: any) {
    e.preventDefault();
    try {
      if (approveTokens) {
        console.log("approve");
        approveTokens();
        console.log("hash", approveData?.hash);
      }
      if (approveWaitError) {
        alert(approveWaitError);
      }
    } catch (error) {
      alert(error);
    }
  }
  useEffect(() => {
    if (approveTxIsSuccess) {
      alert(`${amount} tokens have been approved!`);
      router.push("/");
    }
  }, [approveTxIsSuccess]);

  return (
    <div className="container">
      <p className="section-subtitle">PaymentStorm</p>
      <h2 className="h1 hero-title">Payment Successfully done!</h2>
      <p className="hero-text">
        You can approve Marketplace to spend tokens own your behalf so you can
        easily do your shopping without any issue.
      </p>
      <input
        // type="text"
        className="newsletter-input mt-5"
        placeholder="Enter amount of tokens"
        onChange={(e) => {
          setAmount(e.target.value);
        }}
        required
      />

      <Link href={"/exploreNfts"}>
        <button
          className="btn mb-[10px] flex h-[50px] w-[200px] justify-center"
          onClick={approveNft}
          // disabled={approveTxIsSuccess ? true : false}
        >
          <span>
            {approveIsLoading
              ? "Approving, please wait for a while"
              : "Approve Tokens"}
          </span>
        </button>
      </Link>
    </div>
  );
};

export default success;
