import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transcript: null,
  isProcessing: false,
  error: null,
  type: null,
};

const transcriptSlice = createSlice({
  name: "transcript",
  initialState,
  reducers: {
    setTranscript: (state, action) => {
      state.transcript = action.payload;
      state.error = null;
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action) => {
      state.isProcessing = false;
      state.error = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    clearTranscript: (state) => {
      state.transcript = null;
      state.error = null;
      state.type = null;
    },
    resetTranscriptState: () => {
      return initialState;
    },
  },
});

export const {
  setTranscript,
  setProcessing,
  setError,
  setType,
  clearTranscript,
  resetTranscriptState,
} = transcriptSlice.actions;

export default transcriptSlice.reducer;
