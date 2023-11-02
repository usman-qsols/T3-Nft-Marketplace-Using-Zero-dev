import z from "zod";

// title,
// price,
//           description,
//           ipfsHash,
//           ownerAddress,
//           contractAddress,
//           sellerAddress,
//           tokenId,
//           active,

export const createNftSchema = z.object({
  title: z.string(),
  price: z.string(),
  description: z.string(),
  ipfsHash: z.string(),
  ownerAddress: z.string(),
  tokenId: z.string(),
  active: z.boolean(),
});

export type CreateNftInput = z.TypeOf<typeof createNftSchema>;

export const ListNFTSchema = z.object({
  tokenId: z.string(),
  price: z.string(),
  active: z.boolean(),
  ownerAddress: z.string().optional(),
});

export const updateNftSchema = z.object({
  price: z.string().optional(),
  ownerAddress: z.string().optional(),
  active: z.boolean().optional(),
  id: z.string().optional(),
});
export const buyNftSchema = z.object({
  tokenId: z.string(),
  ownerAddress: z.string(),
  active: z.boolean().optional(),
});

export const getNftSchema = z.object({});

export const getSingleNftSchema = z.object({
  id: z.string().optional(),
});

export const getUserNftSchema = z.object({
  ownerAddress: z.string(),
});
