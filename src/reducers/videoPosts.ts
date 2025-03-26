// src/reducers/videoPosts.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<VideoPost[]>("/video-posts", {
        params: {
          sort: "id,asc",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch video posts");
    }
  }
);

// Video posts slice
export const videoPostsSlice = createSlice({
  name: "videoPosts",
  initialState,
  reducers: {},
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
      });
  },
});

export default videoPostsSlice.reducer;
