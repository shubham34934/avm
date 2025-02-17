import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ENV } from "../config/env";

// Types
export interface User {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  activated: boolean;
  langKey: string;
  createdBy: string;
  createdDate: string | null;
  lastModifiedBy: string;
  lastModifiedDate: string | null;
  authorities: string[];
}

interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 0,
};

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page = 0, size = 20, sort = "id,asc" }: { page?: number; size?: number; sort?: string }) => {
    try {
      const response = await axios.get(
        `${ENV.VITE_APP_API_URL}/admin/users?page=${page}&size=${size}&sort=${sort}`
      );
      return {
        users: response.data,
        totalItems: parseInt(response.headers["x-total-count"] || "0"),
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for fetching user by username
export const fetchUserByUsername = createAsyncThunk(
  "users/fetchUserByUsername",
  async (username: string) => {
    try {
      const response = await axios.get(
        `${ENV.VITE_APP_API_URL}/admin/users/${username}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalItems = action.payload.totalItems;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(fetchUserByUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserByUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user details";
      });
  },
});

export const { clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
