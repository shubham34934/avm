import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ENV } from "../config/env";

// Configure axios defaults
axios.defaults.baseURL = ENV.VITE_APP_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

const AUTH_TOKEN_KEY = "jhi-authenticationToken";

// Add a request interceptor to add the auth token to every request
axios.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(AUTH_TOKEN_KEY) ||
      sessionStorage.getItem(AUTH_TOKEN_KEY);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface AuthenticationState {
  loading: boolean;
  isAuthenticated: boolean;
  loginSuccess: boolean;
  loginError: boolean;
  showModalLogin: boolean;
  account: any;
  errorMessage: string | null;
  redirectMessage: string | null;
  sessionHasBeenFetched: boolean;
  logoutUrl: string | null;
}

const initialState: AuthenticationState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false,
  showModalLogin: false,
  account: {},
  errorMessage: null,
  redirectMessage: null,
  sessionHasBeenFetched: false,
  logoutUrl: null,
};

// Helper functions
const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
};

// Async Thunks
export const getAccount = createAsyncThunk(
  "authentication/account",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get<any>("/account");
      console.log("Account Details Fetched:", response.data);
      return response.data;
    } catch (error) {
      // Clear authentication state on 401
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        dispatch(clearAuth());
      }
      throw error;
    }
  }
);

interface LoginParams {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export const authenticate = createAsyncThunk(
  "authentication/login",
  async (
    {
      username,
      password,
      rememberMe = false,
    }: {
      username: string;
      password: string;
      rememberMe?: boolean;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axios.post<any>("/authenticate", {
        username,
        password,
      });

      const bearerToken = response.headers.authorization;
      if (bearerToken && bearerToken.slice(0, 7) === "Bearer ") {
        const jwt = bearerToken.slice(7);

        // Store token in localStorage or sessionStorage based on rememberMe
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("jhi-authenticationToken", jwt);

        // Fetch user account details
        const accountResponse: any = await axios.get<any>("/account");
        console.log("Login - Account Details:", accountResponse.data);
        accountResponse.role = accountResponse?.authorities?.[0];
        return {
          account: accountResponse.data,
          token: jwt,
        };
      } else {
        return rejectWithValue("No bearer token found");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.detail || error.message || "Login failed"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const logout = createAsyncThunk(
  "authentication/logout",
  async (_, { dispatch }) => {
    try {
      clearAuthToken();

      // Clear axios default headers
      delete axios.defaults.headers.common["Authorization"];

      dispatch(clearAuth());
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
);

// Slice
export const AuthenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.loginSuccess = false;
      state.loginError = false;
      state.account = {};
      state.errorMessage = null;
      state.sessionHasBeenFetched = false;
    },
    authError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
      state.showModalLogin = true;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(authenticate.pending, (state) => {
        state.loading = true;
        state.loginError = false;
        state.errorMessage = null;
      })
      .addCase(authenticate.fulfilled, (state, action) => {
        state.loading = false;
        state.loginSuccess = true;
        state.loginError = false;
        state.isAuthenticated = true;
        state.account = action.payload.account; // Store full account details
        state.errorMessage = null;
        console.log("Authentication State Updated:", state.account);
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.loading = false;
        state.loginError = true;
        state.errorMessage = action.error.message || "Login failed";
        state.isAuthenticated = false;
        state.account = {};
      })
      // Account fetch cases
      .addCase(getAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.account = action.payload; // Store full account details
        state.account.role = action.payload?.authorities?.[0];
        console.log("Account State Updated:", state.account);
      })
      .addCase(getAccount.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.account = {};
        state.errorMessage = action.error.message || "Failed to fetch account";
      })
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loginSuccess = false;
        state.account = {};
        state.errorMessage = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.errorMessage = action.error.message || "Logout failed";
      });
  },
});

export const { clearAuth, authError } = AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;
