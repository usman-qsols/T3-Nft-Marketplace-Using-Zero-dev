import dynamic from "next/dynamic";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { useSelector, useDispatch } from "react-redux";
import { Stripe } from "@stripe/stripe-js";
import { setUpdateNftData } from "~/redux/features/BuyNftSlicer";
import T3MarketJson from "../components/contractAddressAndJson/T3MarketplaceContract.json";
import MyTokenJson from "../components/contractAddressAndJson/MyToken.json";
import T3MarketAddress from "../components/contractAddressAndJson/T3MarketplaceContract-address.json";
import MyTokenAddress from "../components/contractAddressAndJson/MyToken-address.json";
import { PrismaClient } from "@prisma/client";
import { transferTokens } from "~/server/web3/transferToken";

const prisma = new PrismaClient();
const test = (payload: any) => {
  const [showModal, setShowModal] = useState(false);
  const stripePromise: any = loadStripe(
    process.env.NEXT_PUBLIC_PUBLISHABLE_KEY as any,
  );

  const { config: buyConfig } = usePrepareContractWrite({
    address: "0xB35610f89D0d8EC1aC3F2F3887475eB16A78BC35",
    abi: T3MarketJson.abi,
    functionName: "buy",
    args: [payload?.tokenId, payload?._amount],
  });
  const {
    data: buyData,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
    write: listMyNft,
  } = useContractWrite(buyConfig);

  const {
    data: buyWaitData,
    isError: buyWaitError,
    isSuccess: buyTxIsSuccess,
  } = useWaitForTransaction({
    hash: buyData?.hash,
  });

  const listingSuccess = buyTxIsSuccess;

  useEffect(() => {
    // async function listingNft(e: any) {
    // e.preventDefault();
    try {
      if (listMyNft) {
        listMyNft();
        console.log("hash", buyData?.hash);
      }
      if (buyWaitError) {
        alert(buyWaitError);
      }
    } catch (error) {
      alert(error);
    }
    // }
  }, [payload]);

  // const BuyToken = async (fromAddress: any, toAddress: any, amount: any) => {
  //   try {
  //     let bal = await transferTokens({
  //       fromAddress: fromAddress,
  //       toAddress: toAddress,
  //       amount: amount,
  //     });
  //     // You can process the balance here as needed
  //     console.log(bal);
  //     return true;
  //   } catch (err) {
  //     console.error(err);
  //     return false;
  //   }
  // };

  // const TokenResponse = async () =>
  //   await BuyToken(
  //     "0xaF8e6625Cc7d5177Df30b88c1bcEFC2D0C1F12AD",
  //     "0x16a7Bb7f38F83b34E1eD142995198b499413698d",
  //     10 * 1000000,
  //   );

  return <div>{/* <button onClick={TokenResponse}>Button</button> */}</div>;
};

export default test;
