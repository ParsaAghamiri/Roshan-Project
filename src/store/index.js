import { configureStore } from "@reduxjs/toolkit";
import transcriptReducer from "./slices/transcriptSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    transcript: transcriptReducer,
    ui: uiReducer,
  },
});
