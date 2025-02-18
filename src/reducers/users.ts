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

// Async thunk for updating user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${ENV.VITE_APP_API_URL}/admin/users/${userData.login}`,
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user");
    }
  }
);

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

// Async thunk for deleting user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (username: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${ENV.VITE_APP_API_URL}/admin/users/${username}`);
      return username;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete user");
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
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
        // Update user in the list if present
        const index = state.users.findIndex(u => u.login === action.payload.login);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.login !== action.payload);
        if (state.selectedUser?.login === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
