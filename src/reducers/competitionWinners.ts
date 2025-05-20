import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ENV } from "../config/env";

// Types
interface WinningPost {
  id: number;
  // Add other winning post fields as needed
}

interface PaymentToWinner {
  id: number;
  // Add other payment fields as needed
}

interface CompetitionPrize {
  id: number;
  // Add other prize fields as needed
}

export interface CompetitionWinner {
  id: number;
  prizeTitle: string;
  citation: string;
  certificateUrl: string;
  selectedBy: string;
  selectionReason: string;
  isActive: boolean;
  createdBy: string;
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
  winningPost: WinningPost;
  paymentToWinner: PaymentToWinner;
  competitionPrize: CompetitionPrize;
}

interface CompetitionWinnersState {
  competitionWinners: CompetitionWinner[];
  selectedCompetitionWinner: CompetitionWinner | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
}

const initialState: CompetitionWinnersState = {
  competitionWinners: [],
  selectedCompetitionWinner: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
};

interface FetchCompetitionWinnersParams {
  page: number;
  size: number;
}

// Async thunks
export const fetchCompetitionWinners = createAsyncThunk(
  "competitionWinners/fetchCompetitionWinners",
  async ({ page = 1, size = 20 }: FetchCompetitionWinnersParams, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${ENV.VITE_APP_API_URL}/api/competition-winners?page=${page - 1}&size=${size}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch competition winners");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch competition winners");
    }
  }
);

export const fetchCompetitionWinnerById = createAsyncThunk(
  "competitionWinners/fetchCompetitionWinnerById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/competition-winners/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch competition winner");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch competition winner");
    }
  }
);

export const createCompetitionWinner = createAsyncThunk(
  "competitionWinners/createCompetitionWinner",
  async (competitionWinner: Partial<CompetitionWinner>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/competition-winners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(competitionWinner),
      });
      if (!response.ok) {
        throw new Error("Failed to create competition winner");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create competition winner");
    }
  }
);

export const updateCompetitionWinner = createAsyncThunk(
  "competitionWinners/updateCompetitionWinner",
  async ({ id, competitionWinner }: { id: string; competitionWinner: Partial<CompetitionWinner> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/competition-winners/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(competitionWinner),
      });
      if (!response.ok) {
        throw new Error("Failed to update competition winner");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update competition winner");
    }
  }
);

export const patchCompetitionWinner = createAsyncThunk(
  "competitionWinners/patchCompetitionWinner",
  async ({ id, competitionWinner }: { id: string; competitionWinner: Partial<CompetitionWinner> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/competition-winners/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(competitionWinner),
      });
      if (!response.ok) {
        throw new Error("Failed to update competition winner");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update competition winner");
    }
  }
);

export const deleteCompetitionWinner = createAsyncThunk(
  "competitionWinners/deleteCompetitionWinner",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/competition-winners/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete competition winner");
      }
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete competition winner");
    }
  }
);

export const getCompetitionWinnersCount = createAsyncThunk(
  "competitionWinners/getCompetitionWinnersCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENV.VITE_APP_API_URL}/api/competition-winners/count`);
      if (!response.ok) {
        throw new Error("Failed to get competition winners count");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to get competition winners count");
    }
  }
);

// Slice
const competitionWinnersSlice = createSlice({
  name: "competitionWinners",
  initialState,
  reducers: {
    clearSelectedCompetitionWinner: (state) => {
      state.selectedCompetitionWinner = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all competition winners
      .addCase(fetchCompetitionWinners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetitionWinners.fulfilled, (state, action) => {
        state.loading = false;
        state.competitionWinners = action.payload.content;
        state.totalItems = action.payload.totalElements;
        state.currentPage = action.payload.number + 1;
      })
      .addCase(fetchCompetitionWinners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch competition winner by ID
      .addCase(fetchCompetitionWinnerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetitionWinnerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCompetitionWinner = action.payload;
      })
      .addCase(fetchCompetitionWinnerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create competition winner
      .addCase(createCompetitionWinner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompetitionWinner.fulfilled, (state, action) => {
        state.loading = false;
        state.competitionWinners.push(action.payload);
      })
      .addCase(createCompetitionWinner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update competition winner
      .addCase(updateCompetitionWinner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompetitionWinner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.competitionWinners.findIndex((cw) => cw.id === action.payload.id);
        if (index !== -1) {
          state.competitionWinners[index] = action.payload;
        }
        if (state.selectedCompetitionWinner?.id === action.payload.id) {
          state.selectedCompetitionWinner = action.payload;
        }
      })
      .addCase(updateCompetitionWinner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Patch competition winner
      .addCase(patchCompetitionWinner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchCompetitionWinner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.competitionWinners.findIndex((cw) => cw.id === action.payload.id);
        if (index !== -1) {
          state.competitionWinners[index] = { ...state.competitionWinners[index], ...action.payload };
        }
        if (state.selectedCompetitionWinner?.id === action.payload.id) {
          state.selectedCompetitionWinner = { ...state.selectedCompetitionWinner, ...action.payload };
        }
      })
      .addCase(patchCompetitionWinner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete competition winner
      .addCase(deleteCompetitionWinner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompetitionWinner.fulfilled, (state, action) => {
        state.loading = false;
        state.competitionWinners = state.competitionWinners.filter((cw) => cw.id !== parseInt(action.payload));
        if (state.selectedCompetitionWinner?.id === parseInt(action.payload)) {
          state.selectedCompetitionWinner = null;
        }
      })
      .addCase(deleteCompetitionWinner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get competition winners count
      .addCase(getCompetitionWinnersCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompetitionWinnersCount.fulfilled, (state, action) => {
        state.loading = false;
        state.totalItems = action.payload;
      })
      .addCase(getCompetitionWinnersCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedCompetitionWinner, clearError } = competitionWinnersSlice.actions;
export default competitionWinnersSlice.reducer; 