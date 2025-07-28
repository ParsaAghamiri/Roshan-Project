import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userRole: false,
  selectOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    toggleUserRole: (state) => {
      state.userRole = !state.userRole;
    },
    setSelectOpen: (state, action) => {
      state.selectOpen = action.payload;
    },
    toggleSelectOpen: (state) => {
      state.selectOpen = !state.selectOpen;
    },
  },
});

export const { setUserRole, toggleUserRole, setSelectOpen, toggleSelectOpen } =
  uiSlice.actions;

export default uiSlice.reducer;
