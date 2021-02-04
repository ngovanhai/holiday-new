import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "store/eventSlice";
import framesUploadReducer from "store/framesSlice";
import imagesUploadReducer from "store/imagesSlice";
import eventsSampleReducer from "store/eventsSampletSlice";
import settingsReducer from 'store/settingsSlice';

const rootReducer = {
  events: eventReducer,
  imagesUpload: imagesUploadReducer,
  framesUpload: framesUploadReducer,
  eventsSample: eventsSampleReducer,
  settings: settingsReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
