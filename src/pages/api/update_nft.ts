// import { NextApiRequest, NextApiResponse } from "next";
// import { db } from "~/server/db";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   console.log({ req }, "REQUEST FROM API");
//   const { id, ownerAddress } = req.body;
//   console.log("hit api", id, ownerAddress);

//   if (req.method === "POST") {
//     updateNFT(id, ownerAddress, res);
//     // res.status(200).json({ message: "POST request received" });
//   } else {
//     console.log("else");
//   }
//   // return mainRoutes(req, res);
// }

// async function updateNFT(id: any, ownerAddress: any, res: any) {
//   try {
//     console.log("Hit APi", ownerAddress);
//     const data = await db.nft.update({
//       where: {
//         id: id,
//       },
//       data: {
//         ownerAddress: ownerAddress,
//         active: false,
//         price: "0",
//       },
//     });
//     console.log("APIDATA", data);
//     // step 3: create token log.

//     return res.status(200).send({ data: data, success: true });
//   } catch (error: any) {
//     console.log(error);
//     return res.status(500).send({ data: error.message, success: false });
//   }
// }
