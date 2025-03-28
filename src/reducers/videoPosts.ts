import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import handleApiError from "../utils/errorHandler";
import { ENV } from "../config/env";

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
  tags: any[];
  affinityVectors: any[];
  competitionWinner: any;
  creator: any;
}

interface VideoPostFilters {
  competition?: any;
  title?: string;
  description?: string;
  tags?: any[];
  isAIGenerated?: boolean;
  isPremium?: boolean;
  isBlocked?: boolean;
  isModerated?: boolean;
  searchQuery?: string;
  sort?: string;
  page?: number;
  size?: number;
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

// Async thunk to fetch video posts
export const fetchVideoPosts = createAsyncThunk(
  "videoPosts/fetchVideoPosts",
  async (filters: VideoPostFilters = {}, { rejectWithValue }) => {
    try {
      // Construct query parameters
      const params: Record<string, any> = {
        // Default sorting
        sort: filters.sort || "id,asc",

        // Pagination
        page: filters.page || 0,
        size: filters.size || 20,
      };

      // Competition filtering
      if (filters.competition) {
        params["competition.id.equals"] = filters.competition.id;
      }

      // Text-based filters
      if (filters.title) {
        params["title.contains"] = filters.title;
      }

      if (filters.description) {
        params["description.contains"] = filters.description;
      }

      // Boolean filters
      if (filters.isAIGenerated !== undefined) {
        params["isAIGenerated.equals"] = filters.isAIGenerated;
      }

      if (filters.isPremium !== undefined) {
        params["isPremium.equals"] = filters.isPremium;
      }

      if (filters.isBlocked !== undefined) {
        params["isBlocked.equals"] = filters.isBlocked;
      }

      if (filters.isModerated !== undefined) {
        params["isModerated.equals"] = filters.isModerated;
      }

      // Tags filtering
      if (filters.tags && filters.tags.length > 0) {
        params["tags.name.in"] = filters.tags.map((tag) => tag.name).join(",");
      }

      // Global search query (if supported by backend)
      if (filters.searchQuery) {
        params["searchQuery"] = filters.searchQuery;
      }

      // Fetch video posts with applied filters
      const response = await axios.get<VideoPost[]>(
        `${ENV.VITE_APP_API_URL}/video-posts`,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to fetch video posts");
    }
  }
);

// Async thunk to upload a video post
export const uploadVideoPost = createAsyncThunk(
  "videoPosts/uploadVideoPost",
  async (
    {
      title,
      description,
      videoUrl,
      urlType,
      topic,
      localFile,
      creator,
      competition,
      tags = [], // Default to empty array if not provided
      createdOn = new Date().toISOString(), // Default to current timestamp
      createdBy = creator, // Default to creator if not specified
    }: {
      title: string;
      description: string;
      videoUrl: string;
      urlType: string;
      topic: string;
      localFile?: File | null;
      creator: { id: number };
      competition: { id: number };
      tags?: any[];
      createdOn?: string;
      createdBy?: { id: number };
    },
    { rejectWithValue }
  ) => {
    try {
      // If local file, use FormData for file upload
      if (localFile) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("urlType", urlType);
        formData.append("topic", topic);
        formData.append("videoFile", localFile);
        formData.append("creator", JSON.stringify(creator));
        formData.append("competition", JSON.stringify(competition));
        formData.append("tags", JSON.stringify(tags));
        formData.append("createdOn", createdOn);
        formData.append("createdBy", JSON.stringify(createdBy));

        const response = await axios.post<VideoPost>(
          `${ENV.VITE_APP_API_URL}/video-posts/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      }

      // For external URLs
      const response = await axios.post<VideoPost>(
        `${ENV.VITE_APP_API_URL}/video-posts`,
        {
          title,
          description,
          url: videoUrl,
          urlType,
          topic,
          creator,
          competition,
          tags, // Always send tags, even if empty
          createdOn,
          createdBy,
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to upload video post");
    }
  }
);

// Async thunk to delete a video post
export const deleteVideoPost = createAsyncThunk(
  "videoPosts/deleteVideoPost",
  async (videoId: number, { rejectWithValue }) => {
    try {
      // Delete the video post
      await axios.delete(`${ENV.VITE_APP_API_URL}/video-posts/${videoId}`);
      return videoId; // Return the ID of the deleted video
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to delete video post");
    }
  }
);

// Async thunk to update a video post
export const updateVideoPost = createAsyncThunk(
  "videoPosts/updateVideoPost",
  async (
    {
      videoId,
      updateData,
    }: {
      videoId: number;
      updateData: Partial<VideoPost>;
    },
    { rejectWithValue }
  ) => {
    try {
      // Update the video post
      const response = await axios.put<VideoPost>(
        `${ENV.VITE_APP_API_URL}/video-posts/${videoId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to update video post");
    }
  }
);

// Async thunk to fetch a single video post by ID
export const fetchVideoPostById = createAsyncThunk(
  "videoPosts/fetchVideoPostById",
  async (videoId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<VideoPost>(
        `${ENV.VITE_APP_API_URL}/video-posts/${videoId}`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to fetch video post");
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
      .addCase(uploadVideoPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadVideoPost.fulfilled, (state, action) => {
        state.loading = false;
        state.videoPosts.push(action.payload);
      })
      .addCase(uploadVideoPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteVideoPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideoPost.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted video from the state
        state.videoPosts = state.videoPosts.filter(
          (video) => video.id !== action.payload
        );
      })
      .addCase(deleteVideoPost.rejected, (state, action) => {
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
      });
  },
});

// Export actions for filters
export const {
  setVideoPostFilters,
  clearVideoPostFilters,
  clearSelectedVideoPost,
} = videoPostsSlice.actions;

export default videoPostsSlice.reducer;
