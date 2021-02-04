import { createSlice } from "@reduxjs/toolkit";
const initialState = [];

const framesUpload = createSlice({
  name: "framesUpload",
  initialState: initialState,
  reducers: {
    AddAllFrames: (state, action) => {
      state.push(...action.payload);
    },
    AddFrame: (state, action) => {
      state.push(action.payload);
    },
    removeFrame: (state, action) => {
      console.log(action);
      return state.filter((frame) => +frame.id !== +action.payload);
    },
    RemoveFramesChoose: (state, action) => {
      const deleteChooseFramew = async () => {
        let tempFiles = state.slice(0);
        tempFiles.forEach((event) => {
          if (action.payload.includes(event["id"])) {
            let removeIndex = state
              .map((item) => item["id"])
              .indexOf(event["id"]);
            state.splice(removeIndex, 1);
          }
        });
      }
      deleteChooseFramew();
    },
  },
});

const { reducer, actions } = framesUpload;
export const { AddAllFrames, AddFrame, removeFrame, RemoveFramesChoose } = actions;
export default reducer;
