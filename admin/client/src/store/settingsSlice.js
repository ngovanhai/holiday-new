import { createSlice } from "@reduxjs/toolkit";
const initalState = [];

const settings = createSlice({
  name: "settings",
  initialState: initalState,
  reducers: {
    AddToSettings: (state, action) => {
      state.push(...action.payload);
    },
    OnOff: (state, action) => {
      action.payload
        ? (state[0].turn_onoff = "1")
        : (state[0].turn_onoff = "0");
    },
    publish: (state, action) => {
      action.payload
        ? (state[0].autoPublish = "1")
        : (state[0].autoPublish = "0");
    },
  },
});

const { reducer, actions } = settings;
export const { AddToSettings, OnOff, publish } = actions;
export default reducer;
