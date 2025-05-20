import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import handleApiError from "../utils/errorHandler";
import { ENV } from "../config/env";
import { FilterOptions, generateFilterQuery } from "../utils/filterUtils";

// Define the VideoPost interface
export interface VideoPost {
  id: number;
  title: string;
  description: string;
  url: string;
  urlType: string;
  isAIGenerated: boolean;
  isPremium: boolean;
  isBlocked: boolean;
  isModerated: boolean;
  isActive: boolean;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  reviews: any;
  changesHistories: any;
  competition: any;
  tag: any;
  affinityVectors: any[];
  competitionWinner: any;
  creator: any;
}

interface VideoPostFilters {
  competition?: any;
  title?: string;
  description?: string;
  tag?: any;
  isAIGenerated?: boolean;
  isPremium?: boolean;
  isBlocked?: boolean;
  isModerated?: boolean;
  searchQuery?: string;
  sort?: string;
  page?: number;
  size?: number;
}

interface FetchVideoPostsParams extends FilterOptions {
  // Add any additional params specific to video posts if needed
}

// Initial state interface
interface VideoPostState {
  videoPosts: VideoPost[];
  loading: boolean;
  error: string | null;
  filters: VideoPostFilters;
  selectedVideoPost: VideoPost | null;
}

// Initial state
const initialState: VideoPostState = {
  videoPosts: [],
  loading: false,
  error: null,
  filters: {},
  selectedVideoPost: null,
};

// Async thunks
export const fetchVideoPosts = createAsyncThunk(
  "videoPosts/fetchVideoPosts",
  async (params: FetchVideoPostsParams, { rejectWithValue }) => {
    try {
      const queryString = generateFilterQuery(params);
      const response = await axios.get(
        `${ENV.VITE_APP_API_URL}/video-posts?${queryString}`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to fetch video posts");
    }
  }
);

export const fetchVideoPostById = createAsyncThunk(
  "videoPosts/fetchVideoPostById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ENV.VITE_APP_API_URL}/video-posts/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to fetch video post");
    }
  }
);

export const createVideoPost = createAsyncThunk(
  "videoPosts/createVideoPost",
  async (videoPost: Partial<VideoPost>, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ENV.VITE_APP_API_URL}/video-posts`,
        videoPost
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to create video post");
    }
  }
);

export const updateVideoPost = createAsyncThunk(
  "videoPosts/updateVideoPost",
  async ({ id, videoPost }: { id: string; videoPost: Partial<VideoPost> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${ENV.VITE_APP_API_URL}/video-posts/${id}`,
        videoPost
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to update video post");
    }
  }
);

export const patchVideoPost = createAsyncThunk(
  "videoPosts/patchVideoPost",
  async ({ id, videoPost }: { id: string; videoPost: Partial<VideoPost> }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${ENV.VITE_APP_API_URL}/video-posts/${id}`,
        videoPost
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to update video post");
    }
  }
);

export const deleteVideoPost = createAsyncThunk(
  "videoPosts/deleteVideoPost",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${ENV.VITE_APP_API_URL}/video-posts/${id}`);
      return id;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to delete video post");
    }
  }
);

export const getVideoPostsCount = createAsyncThunk(
  "videoPosts/getVideoPostsCount",
  async (params: FilterOptions, { rejectWithValue }) => {
    try {
      const queryString = generateFilterQuery(params);
      const response = await axios.get(
        `${ENV.VITE_APP_API_URL}/video-posts/count?${queryString}`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to get video posts count");
    }
  }
);

// Updated slice with additional state for filters
export const videoPostsSlice = createSlice({
  name: "videoPosts",
  initialState,
  reducers: {
    // Add a reducer to update filters
    setVideoPostFilters: (state, action: PayloadAction<VideoPostFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Clear all filters
    clearVideoPostFilters: (state) => {
      state.filters = {};
    },
    // Clear selected video post
    clearSelectedVideoPost: (state) => {
      state.selectedVideoPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.videoPosts = action.payload;
      })
      .addCase(fetchVideoPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchVideoPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVideoPost = action.payload;
      })
      .addCase(fetchVideoPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createVideoPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVideoPost.fulfilled, (state, action) => {
        state.loading = false;
        state.videoPosts.push(action.payload);
      })
      .addCase(createVideoPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateVideoPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVideoPost.fulfilled, (state, action) => {
        state.loading = false;
        // Update the video in the state
        const index = state.videoPosts.findIndex(
          (video) => video.id === action.payload.id
        );
        if (index !== -1) {
          state.videoPosts[index] = action.payload;
        }
      })
      .addCase(updateVideoPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(patchVideoPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchVideoPost.fulfilled, (state, action) => {
        state.loading = false;
        // Update the video in the state
        const index = state.videoPosts.findIndex(
          (video) => video.id === action.payload.id
        );
        if (index !== -1) {
          state.videoPosts[index] = action.payload;
        }
      })
      .addCase(patchVideoPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteVideoPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideoPost.fulfilled, (state, action) => {
        state.loading = false;
        state.videoPosts = state.videoPosts.filter((vp) => vp.id !== parseInt(action.payload));
        if (state.selectedVideoPost?.id === parseInt(action.payload)) {
          state.selectedVideoPost = null;
        }
      })
      .addCase(deleteVideoPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getVideoPostsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVideoPostsCount.fulfilled, (state, action) => {
        state.loading = false;
        // Update the video count in the state
        state.videoPosts = action.payload;
      })
      .addCase(getVideoPostsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions for filters
export const {
  setVideoPostFilters,
  clearVideoPostFilters,
  clearSelectedVideoPost,
  clearError,
} = videoPostsSlice.actions;

export default videoPostsSlice.reducer;
