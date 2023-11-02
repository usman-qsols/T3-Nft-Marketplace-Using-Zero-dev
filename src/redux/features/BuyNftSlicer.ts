import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { string } from "zod";

interface UpdateNftData {
  ownerAddress: string;
  p_id: string;
}

const initialState: UpdateNftData = {
  ownerAddress: "",
  p_id: "",
};

export const UpdatingNftData = createSlice({
  name: "UpdateNftData",
  initialState,
  reducers: {
    setUpdateNftData: (state, action) => {
      state.ownerAddress = action.payload;
      state.p_id = action.payload;
    },
  },
});
export const { setUpdateNftData } = UpdatingNftData.actions;

export default UpdatingNftData.reducer;
