import { configureStore } from "@reduxjs/toolkit";
import archiveReducer from "../features/archiveSlice";

export const store = configureStore({
  reducer: {
    archive: archiveReducer,
  },
});
