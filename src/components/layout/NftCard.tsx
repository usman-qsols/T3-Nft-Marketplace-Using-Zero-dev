import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAccount } from "wagmi";
import axios from "axios";
import getStipePromise from "../lib/stripe";
import { Stripe, loadStripe } from "@stripe/stripe-js";
let stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
    "pk_test_51O3IVKIdcf8l1iwJyfBoPIDsYS1uBVV9mYdwCGqurdSxg0deL02H6LUO8GZi9U1z3GLGb1GWw7db6BMidD9BAnQ700V5my261i",
);

// const products = [
//   {
//     product: 1,
//     name: "Stripe Product",
//     price: 400,
//     quantity: 3,
//   },
//   {
//     product: 2,
//     name: "Stripe Product2",
//     price: 40,
//     quantity: 2,
//   },
//   {
//     product: 3,
//     name: "Stripe Product23",
//     price: 4000,
//     quantity: 1,
//   },
// ];
const NftCard = (props: any) => {
  const [active, setActive] = useState(true);
  const router = useRouter();
  const { address } = useAccount();
  const products = [
    { product: 1, name: props.title, price: props.price, quantity: 1 },
  ];

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const checkoutSession = await axios.post("/api/create-checkout-session", {
      items: products,
      email: "usamnrahim2000@gmail.com",
    });

    //Redirect user to checkout page
    const result = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result?.error) alert(`Error: ${result?.error.message}`);
  };

  const pushToDetailPage = () => {
    // router.push();
  };
  return (
    <div className="card explore-card">
      <figure className="card-banner">
        <a>
          <img
            src={props.src}
            width="600"
            height="600"
            loading="lazy"
            alt="Walking On Air"
            className="img-cover"
          />
          {/* <Image
            src={props.src}
            className="img-cover h-60 w-60"
            alt="Walking On Air"
            width={60}
            height={60}
          /> */}
        </a>
      </figure>

      <h3 className="h3 card-title">
        <a>{props.title}</a>
      </h3>

      <span className="card-author">
        Owned By{" "}
        <a className="author-link">
          {props.ownerAddress?.slice(0, 8) +
            "..." +
            props.ownerAddress?.slice(35, 45)}
        </a>
      </span>

      <div className="wrapper">
        <data className="wrapper-item" value="1.5">
          $ {props.price}
        </data>

        <span className="wrapper-item">1 of 1</span>
      </div>

      {props.active ? (
        <div className="flex flex-row justify-between">
          {/* {address !== props.ownerAddress ? (
            <button className="btn" onClick={handleCheckout}>
              <span>Buy Nft</span>
            </button>
          ) : (
            ""
          )} */}

          <Link href={`/NftDetail/${props.id}`}>
            <button className="btn" onClick={pushToDetailPage}>
              <span>Details</span>
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-row justify-between">
          <button className="btn disable">
            <span>Not Listed</span>
          </button>

          <Link href={`/NftDetail/${props.id}`}>
            <button className="btn" onClick={pushToDetailPage}>
              <span>Details</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NftCard;
