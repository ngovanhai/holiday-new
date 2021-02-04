import { createSlice } from "@reduxjs/toolkit";
import ImageApi from "api/ImageApi";
import { shop } from "config";
const initalState = [];

const imagesUpload = createSlice({
  name: "imagesUpload",
  initialState: initalState,
  reducers: {
    AddAllImages: (state, action) => {
      state.push(...action.payload);
    },
    AddImage: (state, action) => {
      state.push(action.payload);
    },
    RemoveImage: (state, action) => {
      return state.filter((image) => +image.id !== +action.payload);
    },
    RemoveImagesChoose: (state, action) => {
      const deleteChooseImages = async () => {
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
      deleteChooseImages();
    },

  },
});

const { reducer, actions } = imagesUpload;
export const { AddAllImages, AddImage, RemoveImage, RemoveImagesChoose } = actions;
export default reducer;
