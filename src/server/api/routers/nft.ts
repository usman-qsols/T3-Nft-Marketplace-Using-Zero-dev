import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  createNftSchema,
  getNftSchema,
  getUserNftSchema,
  updateNftSchema,
  buyNftSchema,
  ListNFTSchema,
  getSingleNftSchema,
} from "../../../schema/nft";

export const nftRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.nft.findMany({
      orderBy: {
        created_at: "asc",
      },
    });
  }),

  createNft: publicProcedure
    .input(createNftSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("Input : ", input);
        if (
          !input.title &&
          !input.description &&
          !input.ipfsHash &&
          !input.tokenId &&
          !input.ownerAddress &&
          !input.price &&
          !input.active
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Please Add Your All Field",
          });
        } else {
          const paylaod: any = {
            tokenId: input.tokenId?.toString(),
            title: input.title,
            description: input.description,
            ipfsHash: input.ipfsHash,
            price: input.price,
            ownerAddress: input.ownerAddress,
            active: input.active,
          };
          console.log(paylaod, "paylaod");
          const nftCreated = await ctx.db.nft.create({
            data: paylaod,
          });
          console.log(nftCreated, "nftCreated");
          return nftCreated;
        }
      } catch (error: any) {
        console.log("data error", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message,
        });
      }
    }),

  getNftListed: publicProcedure.input(getNftSchema).query(async ({ ctx }) => {
    try {
      const response = await ctx.db.nft.findMany({
        where: {
          active: true,
        },
      });
      return response;
    } catch (error: any) {
      console.log("data error", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error?.message,
      });
    }
  }),

  getSingleNft: publicProcedure
    .input(getSingleNftSchema)
    .query(async ({ ctx, input }) => {
      try {
        const response = await ctx.db.nft.findUnique({
          where: {
            id: input.id,
          },
        });
        return response;
      } catch (error: any) {
        console.log("data error", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message,
        });
      }
    }),
  getOwnersNfts: publicProcedure
    .input(getUserNftSchema)
    .query(async ({ ctx, input }) => {
      try {
        const response = await ctx.db.nft.findMany({
          where: {
            ownerAddress: input.ownerAddress,
          },
        });
        return response;
      } catch (error: any) {
        console.log("data error", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message,
        });
      }
    }),

  buyNft: publicProcedure
    .input(updateNftSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log(input, "input");
        let option: any = {};
        option.where = {
          id: input.id,
        };
        option.data = {
          ownerAddress: input.ownerAddress,
          active: input.active,
        };
        const updateResponse = await ctx.db?.nft?.update(option);
        console.log(updateResponse, "updateResponse");
        return updateResponse;
      } catch (e) {
        console.log(e, "errorworking");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  updateNft: publicProcedure
    .input(updateNftSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log(input, "input");
        let option: any = {};
        option.where = {
          id: input.id,
        };
        option.data = {
          active: input.active,
          price: input.price,
        };
        const updateResponse = await ctx.db?.nft?.update(option);
        console.log(updateResponse, "updateResponse");
        return updateResponse;
      } catch (e) {
        console.log(e, "errorworking");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
