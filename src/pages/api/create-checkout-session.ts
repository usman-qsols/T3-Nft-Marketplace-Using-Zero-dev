import { NextApiRequest, NextApiResponse } from "next";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    items,
    email,
    // p_id,
    ownerAddress,
    // oldOwnerAddress,
    price,
    // tokenId,
    // amount,
  } = req.body;

  const transformedItems = items.map((item: any) => ({
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: item.price * 100,
      product_data: {
        name: item.name,
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: transformedItems,
    mode: "payment",
    success_url: `http://localhost:3000/success`,
    // success_url: `http://192.168.10.134:3000/success`,
    cancel_url: `http://localhost:3000/checkout`,
    metadata: {
      email,
      // p_id,
      ownerAddress,
      // oldOwnerAddress,
      price,
      // tokenId,
      // amount,
    },
  });
  res.status(200).json({ id: session.id });
};
