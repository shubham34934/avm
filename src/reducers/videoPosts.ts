import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import handleApiError from "../utils/errorHandler";

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
}

// Initial state
const initialState: VideoPostState = {
  videoPosts: [],
  loading: false,
  error: null,
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
      const response = await axios.get<VideoPost[]>("/video-posts", {
        params,
      });
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
    }: {
      title: string;
      description: string;
      videoUrl: string;
      urlType: string;
      topic: string;
      localFile?: File | null;
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

        const response = await axios.post<VideoPost>(
          "/video-posts/upload",
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
      const response = await axios.post<VideoPost>("/video-posts", {
        title,
        description,
        url: videoUrl,
        urlType,
        topic,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to upload video post");
    }
  }
);

// Updated slice with additional state for filters
export const videoPostsSlice = createSlice({
  name: "videoPosts",
  initialState: {
    ...initialState,
    filters: {} as VideoPostFilters,
  },
  reducers: {
    // Add a reducer to update filters
    setVideoPostFilters: (state, action: PayloadAction<VideoPostFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Clear all filters
    clearVideoPostFilters: (state) => {
      state.filters = {};
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
      });
  },
});

// Export actions for filters
export const { setVideoPostFilters, clearVideoPostFilters } =
  videoPostsSlice.actions;

export default videoPostsSlice.reducer;
