import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { nftRouter } from "./routers/nft";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  nft: nftRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
