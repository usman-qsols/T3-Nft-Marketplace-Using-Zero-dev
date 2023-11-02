import { configureStore } from "@reduxjs/toolkit";
import web3SmartAccount from "./features/SmartAccountSlicer";
import UpdateNftData from "./features/BuyNftSlicer";

export const store = configureStore({
  reducer: {
    web3SmartAccount: web3SmartAccount,
    UpdateNftData: UpdateNftData,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
