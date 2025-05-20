import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENV } from "../config/env";

// Types
export interface BankDetails {
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
}

interface BankDetailsState {
  bankDetails: BankDetails[];
  selectedBankDetails: BankDetails | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
}

const initialState: BankDetailsState = {
  bankDetails: [],
  selectedBankDetails: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
};

interface FetchBankDetailsParams {
  page: number;
  size: number;
}

// Async thunks
export const fetchBankDetails = createAsyncThunk(
  "bankDetails/fetchBankDetails",
  async ({ page = 1, size = 20 }: FetchBankDetailsParams, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${ENV.VITE_APP_API_URL}/api/bank-details?page=${page - 1}&size=${size}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bank details");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch bank details");
    }
  }
);

export const fetchBankDetailsById = createAsyncThunk(
  "bankDetails/fetchBankDetailsById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/bank-details/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch bank details");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch bank details");
    }
  }
);

export const createBankDetails = createAsyncThunk(
  "bankDetails/createBankDetails",
  async (bankDetails: Partial<BankDetails>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/bank-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bankDetails),
      });
      if (!response.ok) {
        throw new Error("Failed to create bank details");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create bank details");
    }
  }
);

export const updateBankDetails = createAsyncThunk(
  "bankDetails/updateBankDetails",
  async ({ id, bankDetails }: { id: string; bankDetails: Partial<BankDetails> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/bank-details/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bankDetails),
      });
      if (!response.ok) {
        throw new Error("Failed to update bank details");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update bank details");
    }
  }
);

export const patchBankDetails = createAsyncThunk(
  "bankDetails/patchBankDetails",
  async ({ id, bankDetails }: { id: string; bankDetails: Partial<BankDetails> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/bank-details/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bankDetails),
      });
      if (!response.ok) {
        throw new Error("Failed to update bank details");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update bank details");
    }
  }
);

export const deleteBankDetails = createAsyncThunk(
  "bankDetails/deleteBankDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/bank-details/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete bank details");
      }
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete bank details");
    }
  }
);

export const getBankDetailsCount = createAsyncThunk(
  "bankDetails/getBankDetailsCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/bank-details/count`);
      if (!response.ok) {
        throw new Error("Failed to get bank details count");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to get bank details count");
    }
  }
);

// Slice
const bankDetailsSlice = createSlice({
  name: "bankDetails",
  initialState,
  reducers: {
    clearSelectedBankDetails: (state) => {
      state.selectedBankDetails = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bank details
      .addCase(fetchBankDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBankDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.bankDetails = action.payload.content;
        state.totalItems = action.payload.totalElements;
        state.currentPage = action.payload.number + 1;
      })
      .addCase(fetchBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch bank details by ID
      .addCase(fetchBankDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBankDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBankDetails = action.payload;
      })
      .addCase(fetchBankDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create bank details
      .addCase(createBankDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBankDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.bankDetails.push(action.payload);
      })
      .addCase(createBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update bank details
      .addCase(updateBankDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBankDetails.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bankDetails.findIndex((bd) => bd.id === action.payload.id);
        if (index !== -1) {
          state.bankDetails[index] = action.payload;
        }
        if (state.selectedBankDetails?.id === action.payload.id) {
          state.selectedBankDetails = action.payload;
        }
      })
      .addCase(updateBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Patch bank details
      .addCase(patchBankDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchBankDetails.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bankDetails.findIndex((bd) => bd.id === action.payload.id);
        if (index !== -1) {
          state.bankDetails[index] = { ...state.bankDetails[index], ...action.payload };
        }
        if (state.selectedBankDetails?.id === action.payload.id) {
          state.selectedBankDetails = { ...state.selectedBankDetails, ...action.payload };
        }
      })
      .addCase(patchBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete bank details
      .addCase(deleteBankDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBankDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.bankDetails = state.bankDetails.filter((bd) => bd.id !== parseInt(action.payload));
        if (state.selectedBankDetails?.id === parseInt(action.payload)) {
          state.selectedBankDetails = null;
        }
      })
      .addCase(deleteBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get bank details count
      .addCase(getBankDetailsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBankDetailsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.totalItems = action.payload;
      })
      .addCase(getBankDetailsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedBankDetails, clearError } = bankDetailsSlice.actions;
export default bankDetailsSlice.reducer; 