import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENV } from "../config/env";

// Types
interface Sponsor {
  id: number;
  // Add other sponsor fields as needed
}

interface Competition {
  id: number;
  title: string;
  description: string;
  status: string;
  paymentStatus: string;
  isBlocked: boolean;
  blockReason: string;
  blockedBy: string;
  isPaused: boolean;
  pauseReason: string;
  pausedBy: string;
  banner1Url: string;
  banner2Url: string;
  banner3Url: string;
  startDate: string;
  endDate: string;
  landingUrl: string;
  totalPrizeValue: number;
  invoiceToSponsorUrl: string;
  tncUrl: string;
  tnc: string;
  isActive: boolean;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  sponsor: Sponsor;
}

export interface ShortListedVideo {
  id: number;
  reason: string;
  isActive: boolean;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  competition: Competition;
}

interface ShortListedVideosState {
  shortListedVideos: ShortListedVideo[];
  selectedShortListedVideo: ShortListedVideo | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
}

const initialState: ShortListedVideosState = {
  shortListedVideos: [],
  selectedShortListedVideo: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
};

interface FetchShortListedVideosParams {
  page: number;
  size: number;
}

// Async thunks
export const fetchShortListedVideos = createAsyncThunk(
  "shortListedVideos/fetchShortListedVideos",
  async ({ page = 1, size = 20 }: FetchShortListedVideosParams, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${ENV.VITE_APP_API_URL}/api/short-listed-videos?page=${page - 1}&size=${size}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch short-listed videos");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch short-listed videos");
    }
  }
);

export const fetchShortListedVideoById = createAsyncThunk(
  "shortListedVideos/fetchShortListedVideoById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/short-listed-videos/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch short-listed video");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch short-listed video");
    }
  }
);

export const createShortListedVideo = createAsyncThunk(
  "shortListedVideos/createShortListedVideo",
  async (shortListedVideo: Partial<ShortListedVideo>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/short-listed-videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shortListedVideo),
      });
      if (!response.ok) {
        throw new Error("Failed to create short-listed video");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create short-listed video");
    }
  }
);

export const updateShortListedVideo = createAsyncThunk(
  "shortListedVideos/updateShortListedVideo",
  async ({ id, shortListedVideo }: { id: string; shortListedVideo: Partial<ShortListedVideo> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/short-listed-videos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shortListedVideo),
      });
      if (!response.ok) {
        throw new Error("Failed to update short-listed video");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update short-listed video");
    }
  }
);

export const patchShortListedVideo = createAsyncThunk(
  "shortListedVideos/patchShortListedVideo",
  async ({ id, shortListedVideo }: { id: string; shortListedVideo: Partial<ShortListedVideo> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/short-listed-videos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shortListedVideo),
      });
      if (!response.ok) {
        throw new Error("Failed to update short-listed video");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update short-listed video");
    }
  }
);

export const deleteShortListedVideo = createAsyncThunk(
  "shortListedVideos/deleteShortListedVideo",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/short-listed-videos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete short-listed video");
      }
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete short-listed video");
    }
  }
);

export const getShortListedVideosCount = createAsyncThunk(
  "shortListedVideos/getShortListedVideosCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/short-listed-videos/count`);
      if (!response.ok) {
        throw new Error("Failed to get short-listed videos count");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to get short-listed videos count");
    }
  }
);

// Slice
const shortListedVideosSlice = createSlice({
  name: "shortListedVideos",
  initialState,
  reducers: {
    clearSelectedShortListedVideo: (state) => {
      state.selectedShortListedVideo = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all short-listed videos
      .addCase(fetchShortListedVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShortListedVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.shortListedVideos = action.payload.content;
        state.totalItems = action.payload.totalElements;
        state.currentPage = action.payload.number + 1;
      })
      .addCase(fetchShortListedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch short-listed video by ID
      .addCase(fetchShortListedVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShortListedVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedShortListedVideo = action.payload;
      })
      .addCase(fetchShortListedVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create short-listed video
      .addCase(createShortListedVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShortListedVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.shortListedVideos.push(action.payload);
      })
      .addCase(createShortListedVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update short-listed video
      .addCase(updateShortListedVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShortListedVideo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.shortListedVideos.findIndex((slv) => slv.id === action.payload.id);
        if (index !== -1) {
          state.shortListedVideos[index] = action.payload;
        }
        if (state.selectedShortListedVideo?.id === action.payload.id) {
          state.selectedShortListedVideo = action.payload;
        }
      })
      .addCase(updateShortListedVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Patch short-listed video
      .addCase(patchShortListedVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchShortListedVideo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.shortListedVideos.findIndex((slv) => slv.id === action.payload.id);
        if (index !== -1) {
          state.shortListedVideos[index] = { ...state.shortListedVideos[index], ...action.payload };
        }
        if (state.selectedShortListedVideo?.id === action.payload.id) {
          state.selectedShortListedVideo = { ...state.selectedShortListedVideo, ...action.payload };
        }
      })
      .addCase(patchShortListedVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete short-listed video
      .addCase(deleteShortListedVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShortListedVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.shortListedVideos = state.shortListedVideos.filter((slv) => slv.id !== parseInt(action.payload));
        if (state.selectedShortListedVideo?.id === parseInt(action.payload)) {
          state.selectedShortListedVideo = null;
        }
      })
      .addCase(deleteShortListedVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get short-listed videos count
      .addCase(getShortListedVideosCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShortListedVideosCount.fulfilled, (state, action) => {
        state.loading = false;
        state.totalItems = action.payload;
      })
      .addCase(getShortListedVideosCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedShortListedVideo, clearError } = shortListedVideosSlice.actions;
export default shortListedVideosSlice.reducer; 