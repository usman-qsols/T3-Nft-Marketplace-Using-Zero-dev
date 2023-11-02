import { string, z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  createUserSchema,
  loginUserSchema,
  udpateUserSchema,
  getUserSchema,
} from "../../../schema/user";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(getUserSchema)
    .query(async ({ ctx, input }) => {
      try {
        console.log("Input", input);
        const user = await ctx.db.adminUser.findFirst({
          where: { wallet_address: input?.wallet_address },
        });
        return { user };
      } catch (error: any) {
        console.log("Error : ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    }),

  // getSingleUser:publicProcedure.input(z.object{wallet_address:string}).query()

  createUser: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log({ input }, "input");
        console.log("INOUT : ", input.wallet_address);
        if (input.wallet_address === undefined) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Enter Email",
          });
        }
        const user: any = await ctx.db?.adminUser?.findFirst({
          where: { wallet_address: input?.wallet_address },
        });

        if (!user) {
          const paylaod: any = {
            wallet_address: input.wallet_address,
            full_name: input.full_name,
            email_address: input.email_address,
          };
          console.log(paylaod, "paylaod");
          const user: any = await ctx.db.adminUser.create({
            data: paylaod,
          });
          console.log(user, "user");
          // ctx.res?.setHeader("Set-Cookie", user);
          return { user };
        }
        console.log({ user });

        // ctx.res?.setHeader("Set-Cookie", user);

        return { user };
      } catch (error: any) {
        console.log({ error });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    }),

  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //       },
  //     });
  //   }),

  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //   });
  // }),
});
