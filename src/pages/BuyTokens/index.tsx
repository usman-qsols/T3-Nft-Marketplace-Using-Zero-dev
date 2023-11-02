import React, { useState } from "react";
import { transferTokens } from "~/server/web3/transferToken";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import axios from "axios";

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
    "pk_test_51O3IVKIdcf8l1iwJyfBoPIDsYS1uBVV9mYdwCGqurdSxg0deL02H6LUO8GZi9U1z3GLGb1GWw7db6BMidD9BAnQ700V5my261i",
);
const Index = () => {
  const [price, setPrice] = useState("");

  const { address, isConnected } = useAccount();
  const products = [
    {
      product: 1,
      name: "Buying Tokens",
      price: price,
      quantity: 1,
      // productId: data?.id,
      // ownerAddress: data?.ownerAddress,
    },
  ];

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const checkoutSession = await axios.post("/api/create-checkout-session", {
      items: products,
      email: "usamnrahim2000@gmail.com",
      // p_id: data?.id,
      ownerAddress: address,
      // oldOwnerAddress: data?.ownerAddress,
      price: price,
      // tokenId: data?.tokenId,
      // amount: data?.price,
    });

    //Redirect user to checkout page
    const result = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result?.error) alert(`Error: ${result?.error.message}`);
  };
  return (
    <div>
      {/* <input type="email" name="email" placeholder="info@yourmail.com" required className="newsletter-input"> */}

      {isConnected ? (
        <div className="container mb-[20px] mt-[20px]">
          <p className="section-subtitle">Exclusive Tokens</p>

          <div className="title-wrapper">
            <h2 className="h2 section-title">Buy Tokens and Enjoy Shopping</h2>
          </div>
          <input
            // type="text"
            className="newsletter-input mt-5"
            placeholder="Enter the Amount of tokens"
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            required
          />

          <button
            // type="submit"
            className={` btn  mt-5 flex h-20 w-[100%] justify-center
        text-[2rem] `}
            // aria-label="Submit"
            onClick={handleCheckout}
          >
            Submit
          </button>
        </div>
      ) : (
        <h1>Please login first</h1>
      )}
    </div>
  );
};

export default Index;
