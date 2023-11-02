import { stripZeros } from "ethers/lib/utils";
import { buffer } from "micro";
import { api } from "~/utils/api";
import { transferTokens } from "~/server/web3/transferToken";
import test from "../test";

// Creating Connection with stripe

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endPointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session: any) => {
  console.log("Fulfilling the order", session);
  console.log("metadata", session.metadata);
  // // Transfer function here

  console.log("consoling");

  // let data = {
  //   id: session.metadata.p_id,
  //   ownerAddress: session.metadata.ownerAddress,
  // };

  // const obj = {
  //   id: "6538d153abf1d7ae17cedf80",
  //   ownerAddress: "absbsbsbbsbsasjdalksjdakskdpaskdpoak",
  // };
  // const response = await fetch(
  //   `
  //     ${process.env.NEXT_PUBLIC_BASE_URL}update_nft`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   },
  // );
  // console.log({ response }, "response");
  const BuyToken = async (fromAddress: any, toAddress: any, amount: any) => {
    try {
      let bal = await transferTokens({
        fromAddress: fromAddress,
        toAddress: toAddress,
        amount: amount,
      });
      // You can process the balance here as needed
      console.log(bal);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  await BuyToken(
    "0xaF8e6625Cc7d5177Df30b88c1bcEFC2D0C1F12AD",
    session.metadata.ownerAddress,
    Number(session.metadata.price) * 1000000,
  );
  // return BuyToken(
  //   "0xaF8e6625Cc7d5177Df30b88c1bcEFC2D0C1F12AD",
  //   session.metadata.oldOwnerAddress,
  //   Number(session.metadata.price) * 1000000,
  // );

  // let buyData = {
  //   tokenId: session.metadata.tokenId,
  //   amount: session.metadata.amount,
  // };
  return console.log("Completed");
};

export default async function (req: any, res: any) {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];

    let event;
    // Verify that event posted came from stripe
    try {
      event = await stripe.webhooks.constructEvent(
        payload,
        sig,
        endPointSecret,
      );
    } catch (error: any) {
      console.log(`Webhook Error : ${error?.message}`);
      return res.status(400).send(`Webhook Error : ${error?.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      // console.log("Payment Successfull");
      const session = event.data.object;
      // console.log("This is session", session);

      // Fulfill the order...
      return fulfillOrder(session)
        .then((res: any) => res?.status(200))
        .catch((err: any) =>
          res.status(400).send(`Webhook error : ${err.message}`),
        );
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
