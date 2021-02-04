import { createSlice } from "@reduxjs/toolkit";
const initalState = [];

const eventsSample = createSlice({
  name: "eventsSample",
  initialState: initalState,
  reducers: {
    AddToEventsSample: (state, action) => {
      state.push(...action.payload)
    },
  },
});

const { reducer, actions } = eventsSample;
export const { AddToEventsSample } = actions;
export default reducer;
