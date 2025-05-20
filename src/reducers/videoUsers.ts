import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ENV } from "../config/env";
import handleApiError from "../utils/errorHandler";

// Types
export interface VideoUser {
  id: number;
  userId: string;
  userName: string;
  name: string;
  phone: number;
  email: string;
  description: string;
  imageUrl: string;
  userType: string;
  isBlocked: boolean;
  blockedTill: string;
  isActive: boolean;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  bank?: {
    id: number;
    accountName: string;
    accountNo: string;
    bankName: string;
    ifsc: string;
    proofUrl: string;
    upiHandle: string;
    isActive: boolean;
    createdBy: string;
    createdOn: string;
    updatedBy: string;
    updatedOn: string;
  };
  affinityVectors?: {
    id: number;
    segment: string;
    score: number;
    isActive: boolean;
    createdBy: string;
    createdOn: string;
    updatedBy: string;
    updatedOn: string;
    posts: string[];
    users: string[];
  }[];
  company?: {
    id: number;
    sponsorName: string;
    sponsorDescription: string;
    sponsorBanner1Url: string;
    sponsorBanner2Url: string;
    sponsorBanner3Url: string;
    sponsorExternalUrl: string;
    sponsorLogoUrl: string;
    isActive: boolean;
    createdBy: string;
    createdOn: string;
    updatedBy: string;
    updatedOn: string;
  };
}

interface VideoUsersState {
  videoUsers: VideoUser[];
  selectedVideoUser: VideoUser | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
  uploadingAvatar: boolean;
}

const initialState: VideoUsersState = {
  videoUsers: [],
  selectedVideoUser: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 0,
  uploadingAvatar: false,
};

// Async thunk for uploading video user avatar
export const uploadVideoUserAvatar = createAsyncThunk(
  "videoUsers/uploadVideoUserAvatar",
  async (
    { userId, file }: { userId: string; file: File },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${ENV.VITE_APP_API_URL}/api/video-users/${userId}/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload avatar"
      );
    }
  }
);

// Async thunk for updating video user
export const updateVideoUser = createAsyncThunk(
  "videoUsers/updateVideoUser",
  async (userData: Partial<VideoUser>, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${ENV.VITE_APP_API_URL}/api/video-users/${userData.id}`,
        userData
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update video user"
      );
    }
  }
);

// Async thunk for fetching video users
export const fetchVideoUsers = createAsyncThunk(
  "videoUsers/fetchVideoUsers",
  async ({
    page = 0,
    size = 20,
    sort = "id,asc",
  }: {
    page?: number;
    size?: number;
    sort?: string;
  }) => {
    try {
      const response = await axios.get(
        `${ENV.VITE_APP_API_URL}/video-users?page=${page}&size=${size}&sort=${sort}`
      );
      return {
        videoUsers: response.data,
        totalItems: parseInt(response.headers["x-total-count"] || "0"),
        currentPage: page,
      };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
);

// Async thunk for fetching video user count
export const fetchVideoUserCount = createAsyncThunk(
  "videoUsers/fetchVideoUserCount",
  async () => {
    try {
      const response = await axios.get(
        `${ENV.VITE_APP_API_URL}/api/video-users/count`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
);

// Async thunk for fetching video user by id
export const fetchVideoUserById = createAsyncThunk(
  "videoUsers/fetchVideoUserById",
  async (id: string) => {
    try {
      const response = await axios.get(
        `${ENV.VITE_APP_API_URL}/api/video-users/${id}`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
);

// Async thunk for deleting video user
export const deleteVideoUser = createAsyncThunk(
  "videoUsers/deleteVideoUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${ENV.VITE_APP_API_URL}/api/video-users/${id}`);
      return id;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete video user"
      );
    }
  }
);

// Async thunk for creating video user
export const createVideoUser = createAsyncThunk(
  "videoUsers/createVideoUser",
  async (userData: {
    userId: string;
    userName: string;
    name: string;
    phone: string;
    email: string;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ENV.VITE_APP_API_URL}/video-users`,
        userData
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create video user"
      );
    }
  }
);

const videoUsersSlice = createSlice({
  name: "videoUsers",
  initialState,
  reducers: {
    clearSelectedVideoUser: (state) => {
      state.selectedVideoUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.videoUsers = action.payload.videoUsers;
        state.totalItems = action.payload.totalItems;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchVideoUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch video users";
      })
      .addCase(fetchVideoUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVideoUser = action.payload;
      })
      .addCase(fetchVideoUserById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch video user details";
      })
      .addCase(updateVideoUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVideoUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVideoUser = action.payload;
        // Update video user in the list if present
        const index = state.videoUsers.findIndex(
          (u) => u.id === action.payload.id
        );
        if (index !== -1) {
          state.videoUsers[index] = action.payload;
        }
      })
      .addCase(updateVideoUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteVideoUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideoUser.fulfilled, (state, action) => {
        state.loading = false;
        state.videoUsers = state.videoUsers.filter(
          (user) => user.id.toString() !== action.payload
        );
        if (state.selectedVideoUser?.id.toString() === action.payload) {
          state.selectedVideoUser = null;
        }
      })
      .addCase(deleteVideoUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadVideoUserAvatar.pending, (state) => {
        state.uploadingAvatar = true;
        state.error = null;
      })
      .addCase(uploadVideoUserAvatar.fulfilled, (state, action) => {
        state.uploadingAvatar = false;
        if (state.selectedVideoUser) {
          state.selectedVideoUser.imageUrl = action.payload.imageUrl;
        }
        // Update video user in the list if present
        const index = state.videoUsers.findIndex(
          (u) => u.id === action.payload.id
        );
        if (index !== -1 && action.payload.imageUrl) {
          state.videoUsers[index].imageUrl = action.payload.imageUrl;
        }
      })
      .addCase(uploadVideoUserAvatar.rejected, (state, action) => {
        state.uploadingAvatar = false;
        state.error = action.payload as string;
      })
      .addCase(createVideoUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVideoUser.fulfilled, (state, action) => {
        state.loading = false;
        state.videoUsers.push(action.payload);
      })
      .addCase(createVideoUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedVideoUser } = videoUsersSlice.actions;
export default videoUsersSlice.reducer;
