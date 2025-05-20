import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENV } from "../config/env";

// Types
export interface VideoTag {
  id: number;
  name: string;
  code: string;
  isModerated: boolean;
  isDeleted: boolean;
  deletionReason: string;
  mergedWithTagName: string;
  mergedWithTagCode: string;
  isActive: boolean;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
}

interface VideoTagsState {
  videoTags: VideoTag[];
  selectedVideoTag: VideoTag | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
}

const initialState: VideoTagsState = {
  videoTags: [],
  selectedVideoTag: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
};

interface FetchVideoTagsParams {
  page: number;
  size: number;
}

// Async thunks
export const fetchVideoTags = createAsyncThunk(
  "videoTags/fetchVideoTags",
  async ({ page = 1, size = 20 }: FetchVideoTagsParams, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${ENV.VITE_APP_API_URL}/api/video-tags?page=${page - 1}&size=${size}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch video tags");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch video tags");
    }
  }
);

export const fetchVideoTagById = createAsyncThunk(
  "videoTags/fetchVideoTagById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/video-tags/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch video tag");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch video tag");
    }
  }
);

export const createVideoTag = createAsyncThunk(
  "videoTags/createVideoTag",
  async (videoTag: Partial<VideoTag>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/video-tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoTag),
      });
      if (!response.ok) {
        throw new Error("Failed to create video tag");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create video tag");
    }
  }
);

export const updateVideoTag = createAsyncThunk(
  "videoTags/updateVideoTag",
  async ({ id, videoTag }: { id: string; videoTag: Partial<VideoTag> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/video-tags/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoTag),
      });
      if (!response.ok) {
        throw new Error("Failed to update video tag");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update video tag");
    }
  }
);

export const patchVideoTag = createAsyncThunk(
  "videoTags/patchVideoTag",
  async ({ id, videoTag }: { id: string; videoTag: Partial<VideoTag> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/video-tags/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoTag),
      });
      if (!response.ok) {
        throw new Error("Failed to update video tag");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update video tag");
    }
  }
);

export const deleteVideoTag = createAsyncThunk(
  "videoTags/deleteVideoTag",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/video-tags/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete video tag");
      }
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete video tag");
    }
  }
);

export const getVideoTagsCount = createAsyncThunk(
  "videoTags/getVideoTagsCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/video-tags/count`);
      if (!response.ok) {
        throw new Error("Failed to get video tags count");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to get video tags count");
    }
  }
);

// Slice
const videoTagsSlice = createSlice({
  name: "videoTags",
  initialState,
  reducers: {
    clearSelectedVideoTag: (state) => {
      state.selectedVideoTag = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all video tags
      .addCase(fetchVideoTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoTags.fulfilled, (state, action) => {
        state.loading = false;
        state.videoTags = action.payload.content;
        state.totalItems = action.payload.totalElements;
        state.currentPage = action.payload.number + 1;
      })
      .addCase(fetchVideoTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch video tag by ID
      .addCase(fetchVideoTagById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoTagById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVideoTag = action.payload;
      })
      .addCase(fetchVideoTagById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create video tag
      .addCase(createVideoTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVideoTag.fulfilled, (state, action) => {
        state.loading = false;
        state.videoTags.push(action.payload);
      })
      .addCase(createVideoTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update video tag
      .addCase(updateVideoTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVideoTag.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.videoTags.findIndex((vt) => vt.id === action.payload.id);
        if (index !== -1) {
          state.videoTags[index] = action.payload;
        }
        if (state.selectedVideoTag?.id === action.payload.id) {
          state.selectedVideoTag = action.payload;
        }
      })
      .addCase(updateVideoTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Patch video tag
      .addCase(patchVideoTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchVideoTag.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.videoTags.findIndex((vt) => vt.id === action.payload.id);
        if (index !== -1) {
          state.videoTags[index] = { ...state.videoTags[index], ...action.payload };
        }
        if (state.selectedVideoTag?.id === action.payload.id) {
          state.selectedVideoTag = { ...state.selectedVideoTag, ...action.payload };
        }
      })
      .addCase(patchVideoTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete video tag
      .addCase(deleteVideoTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideoTag.fulfilled, (state, action) => {
        state.loading = false;
        state.videoTags = state.videoTags.filter((vt) => vt.id !== parseInt(action.payload));
        if (state.selectedVideoTag?.id === parseInt(action.payload)) {
          state.selectedVideoTag = null;
        }
      })
      .addCase(deleteVideoTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get video tags count
      .addCase(getVideoTagsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVideoTagsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.totalItems = action.payload;
      })
      .addCase(getVideoTagsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedVideoTag, clearError } = videoTagsSlice.actions;
export default videoTagsSlice.reducer; 