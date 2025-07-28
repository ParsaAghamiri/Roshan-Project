import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { transcribeAudioFile, transcribeUrl } from "../services/api";
import toast from "react-hot-toast";

export const transcribeFile = createAsyncThunk(
  "transcription/transcribeFile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await transcribeAudioFile(formData);
      return response.data[0];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Unknown error");
    }
  }
);

export const transcribeLink = createAsyncThunk(
  "transcription/transcribeLink",
  async (url, { rejectWithValue }) => {
    try {
      const response = await transcribeUrl(url);
      return response.data[0];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Unknown error");
    }
  }
);

const initialState = {
  result: null,
  status: "idle",
  error: null,
};

const transcriptionSlice = createSlice({
  name: "transcription",
  initialState,
  reducers: {
    resetTranscriptionState: (state) => {
      state.status = "idle";
      state.result = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(transcribeFile.pending, (state) => {
        state.status = "processing";
        state.result = null;
        state.error = null;
      })
      .addCase(transcribeLink.pending, (state) => {
        state.status = "processing";
        state.result = null;
        state.error = null;
      })
      .addCase(transcribeFile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.result = action.payload;
        toast.success("فایل با موفقیت پیاده‌سازی شد!");
      })
      .addCase(transcribeLink.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.result = action.payload;
        toast.success("لینک با موفقیت پیاده‌سازی شد!");
      })
      .addCase(transcribeFile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error("بارگذاری فایل با خطا مواجه شد.");
      })
      .addCase(transcribeLink.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        toast.error("ارسال لینک با خطا مواجه شد.");
      });
  },
});

export const { resetTranscriptionState } = transcriptionSlice.actions;

export default transcriptionSlice.reducer;
