import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequests,
  getRequestsFromUrl,
  deleteRequest,
} from "../services/api";
import toast from "react-hot-toast";

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const fetchArchive = createAsyncThunk(
  "archive/fetchArchive",
  async () => {
    let allResults = [];
    let response = await getRequests();
    if (response.data.results) {
      allResults = allResults.concat(response.data.results);
    }
    while (response.data.next) {
      response = await getRequestsFromUrl(response.data.next);
      if (response.data.results) {
        allResults = allResults.concat(response.data.results);
      }
    }
    return allResults;
  }
);

export const deleteArchiveItem = createAsyncThunk(
  "archive/deleteItem",
  async (itemId, { rejectWithValue }) => {
    try {
      await deleteRequest(itemId);
      toast.success("آیتم با موفقیت حذف شد!");
      return itemId;
    } catch (err) {
      toast.error("خطا در حذف آیتم!");
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchFileSize = createAsyncThunk(
  "archive/fetchFileSize",
  async (item) => {
    const response = await fetch(item.url, { method: "HEAD" });
    if (response.ok) {
      const size = response.headers.get("Content-Length");
      if (size) {
        return { id: item.id, size: formatBytes(size) };
      }
    }
    return { id: item.id, size: "N/A" };
  }
);

const initialState = {
  items: [],
  fileSizes: {},
  status: "idle",
  error: null,
};

const archiveSlice = createSlice({
  name: "archive",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchive.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchArchive.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchArchive.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteArchiveItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(fetchFileSize.fulfilled, (state, action) => {
        state.fileSizes[action.payload.id] = action.payload.size;
      });
  },
});

export default archiveSlice.reducer;
