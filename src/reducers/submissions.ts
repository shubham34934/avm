import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ENV } from "../config/env";

// Types
export interface Submission {
  id: number;
  title: string;
  thumbnail: string;
  username: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  isDisliked: boolean;
  isShortlisted: boolean;
  videoUrl: string;
}

interface SubmissionsState {
  submissions: Submission[];
  shortlistedSubmissions: Submission[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
}

const initialState: SubmissionsState = {
  submissions: [],
  shortlistedSubmissions: [],
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 0,
};

// Async thunks
export const fetchSubmissions = createAsyncThunk(
  "submissions/fetchSubmissions",
  async ({ campaignId, page = 0, size = 20 }: { campaignId: number; page?: number; size?: number }) => {
    try {
      const response = await axios.get(
        `${ENV.VITE_APP_API_URL}/competitions/${campaignId}/submissions?page=${page}&size=${size}`
      );
      return {
        submissions: response.data,
        totalItems: parseInt(response.headers["x-total-count"] || "0"),
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }
);

export const fetchShortlistedSubmissions = createAsyncThunk(
  "submissions/fetchShortlistedSubmissions",
  async ({ campaignId, page = 0, size = 20 }: { campaignId: number; page?: number; size?: number }) => {
    try {
      const response = await axios.get(
        `${ENV.VITE_APP_API_URL}/competitions/${campaignId}/submissions/shortlisted?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const toggleLike = createAsyncThunk(
  "submissions/toggleLike",
  async ({ submissionId, isLike }: { submissionId: number; isLike: boolean }) => {
    try {
      const response = await axios.post(
        `${ENV.VITE_APP_API_URL}/submissions/${submissionId}/${isLike ? 'like' : 'dislike'}`
      );
      return { submissionId, ...response.data };
    } catch (error) {
      throw error;
    }
  }
);

export const toggleShortlist = createAsyncThunk(
  "submissions/toggleShortlist",
  async (submissionId: number) => {
    try {
      const response = await axios.post(
        `${ENV.VITE_APP_API_URL}/submissions/${submissionId}/shortlist`
      );
      return { submissionId, ...response.data };
    } catch (error) {
      throw error;
    }
  }
);

const submissionsSlice = createSlice({
  name: "submissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Submissions
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.submissions;
        state.totalItems = action.payload.totalItems;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch submissions";
      })
      // Fetch Shortlisted Submissions
      .addCase(fetchShortlistedSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShortlistedSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.shortlistedSubmissions = action.payload;
      })
      .addCase(fetchShortlistedSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch shortlisted submissions";
      })
      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { submissionId, isLiked, likes } = action.payload;
        const submission = state.submissions.find(s => s.id === submissionId);
        if (submission) {
          submission.isLiked = isLiked;
          submission.likes = likes;
        }
      })
      // Toggle Shortlist
      .addCase(toggleShortlist.fulfilled, (state, action) => {
        const { submissionId, isShortlisted } = action.payload;
        const submission = state.submissions.find(s => s.id === submissionId);
        if (submission) {
          submission.isShortlisted = isShortlisted;
        }
      });
  },
});

export default submissionsSlice.reducer;
