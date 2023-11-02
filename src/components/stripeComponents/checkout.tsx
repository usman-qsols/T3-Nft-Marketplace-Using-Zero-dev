// "use client";
import axios from "axios";
import getStipePromise from "../lib/stripe";
import { Stripe, loadStripe } from "@stripe/stripe-js";
let stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
    "pk_test_51O3IVKIdcf8l1iwJyfBoPIDsYS1uBVV9mYdwCGqurdSxg0deL02H6LUO8GZi9U1z3GLGb1GWw7db6BMidD9BAnQ700V5my261i",
);

const products = [
  {
    product: 1,
    name: "Stripe Product",
    price: 400,
    quantity: 3,
  },
  {
    product: 2,
    name: "Stripe Product2",
    price: 40,
    quantity: 2,
  },
  {
    product: 3,
    name: "Stripe Product23",
    price: 4000,
    quantity: 1,
  },
];

const StripeCheckOutButton = () => {

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
  return (
    <button className="btn" onClick={handleCheckout}>
      Checkout
    </button>
  );
};

export default StripeCheckOutButton;
