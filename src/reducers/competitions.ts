import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ENV } from "../config/env";
import {
  Competition,
  CompetitionPayload,
  CompetitionPrize,
  CompetitionSearchParams,
  CompetitionState,
  CompetitionStatus,
} from "../types/competition";
import handleApiError from "../utils/errorHandler";

const initialState: CompetitionState = {
  competitions: [],
  selectedCompetition: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 0,
};

// Create Competition
export const createCompetition = createAsyncThunk(
  "competitions/create",
  async (competitionData: CompetitionPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ENV.VITE_APP_API_URL}/competitions`,
        competitionData
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create competition"
      );
    }
  }
);

// Update Competition
export const updateCompetition = createAsyncThunk(
  "competitions/update",
  async (
    { id, data }: { id: number; data: CompetitionPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${ENV.VITE_APP_API_URL}/competitions/${id}`,
        {
          id,
          ...data,
          updatedBy: "current_user",
          updatedOn: new Date().toISOString().split("T")[0],
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update competition"
      );
    }
  }
);

// Partial Update Competition
export const partialUpdateCompetition = createAsyncThunk(
  "competitions/partialUpdate",
  async (
    { id, data }: { id: number; data: Partial<CompetitionPayload> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch(
        `${ENV.VITE_APP_API_URL}/competitions/${id}`,
        {
          id,
          ...data
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update competition"
      );
    }
  }
);

// Fetch All Competitions
export const fetchCompetitions = createAsyncThunk(
  "competitions/fetchAll",
  async (
    {
      page = 0,
      size = 20,
      sort = ["id,desc"],
    }: { page?: number; size?: number; sort?: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${ENV.VITE_APP_API_URL}/competitions`, {
        params: { page, size, sort },
      });
      return {
        competitions: response.data,
        totalItems: parseInt(response.headers["x-total-count"] || "0"),
        currentPage: page,
      };
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch competitions"
      );
    }
  }
);

// Fetch Competition by ID
export const fetchCompetitionById = createAsyncThunk(
  "competitions/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${ENV.VITE_APP_API_URL}/competitions/${id}`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch competition"
      );
    }
  }
);

// Delete Competition
export const deleteCompetition = createAsyncThunk(
  "competitions/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${ENV.VITE_APP_API_URL}/competitions/${id}`);
      return id;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete competition"
      );
    }
  }
);

// Search Competitions
export const searchCompetitions = createAsyncThunk(
  "competitions/search",
  async (searchParams: CompetitionSearchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${ENV.VITE_APP_API_URL}/competitions/search`,
        { params: searchParams }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to search competitions"
      );
    }
  }
);

// Assign Sponsor
export const assignSponsor = createAsyncThunk(
  "competitions/assignSponsor",
  async (
    { competitionId, sponsor }: { competitionId: number; sponsor: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${ENV.VITE_APP_API_URL}/competitions/${competitionId}/sponsor`,
        { sponsor }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign sponsor"
      );
    }
  }
);

// Update Competition Status
export const updateCompetitionStatus = createAsyncThunk(
  "competitions/updateStatus",
  async (
    {
      competitionId,
      status,
    }: { competitionId: number; status: CompetitionStatus },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch(
        `${ENV.VITE_APP_API_URL}/competitions/${competitionId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// Add Prize
export const addPrize = createAsyncThunk(
  "competitions/addPrize",
  async (
    {
      competitionId,
      prizeData,
    }: { competitionId: number; prizeData: CompetitionPrize },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${ENV.VITE_APP_API_URL}/competitions/${competitionId}/prizes`,
        prizeData
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add prize"
      );
    }
  }
);

// Update Campaign Status
export const updateCampaignStatus = createAsyncThunk(
  "competitions/updateCampaignStatus",
  async (
    { 
      id, 
      status, 
      remark = "",
      username = "current_user",
      startDate,
      endDate,
      sponsor
    }: { 
      id: number; 
      status: CompetitionStatus; 
      remark?: string;
      username?: string;
      startDate?: string;
      endDate?: string;
      sponsor?: any;
    },
    { dispatch }
  ) => {
    try {
      const data: Partial<CompetitionPayload> = {
        status,
        remark,
        updatedBy: username,
        updatedOn: new Date().toISOString().split("T")[0],
      };

      // Add dates if provided
      if (startDate) {
        data.startDate = startDate;
      }

      if (endDate) {
        data.endDate = endDate;
      }

      // Add sponsor if provided
      if (sponsor) {
        data.sponsor = sponsor;
      }

      const response = await axios.patch(
        `${ENV.VITE_APP_API_URL}/competitions/${id}/status`,
        data
      );

      // Refresh the competition data after status update
      dispatch(fetchCompetitionById(id));

      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
);

const competitionsSlice = createSlice({
  name: "competitions",
  initialState,
  reducers: {
    clearSelectedCompetition: (state) => {
      state.selectedCompetition = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Competition
      .addCase(createCompetition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompetition.fulfilled, (state, action) => {
        state.loading = false;
        state.competitions.unshift(action.payload);
        state.totalItems += 1;
      })
      .addCase(createCompetition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Competition
      .addCase(updateCompetition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompetition.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.competitions.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.competitions[index] = action.payload;
        }
        if (state.selectedCompetition?.id === action.payload.id) {
          state.selectedCompetition = action.payload;
        }
      })
      .addCase(updateCompetition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Partial Update Competition
      .addCase(partialUpdateCompetition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(partialUpdateCompetition.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.competitions.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.competitions[index] = {
            ...state.competitions[index],
            ...action.payload,
          };
        }
        if (state.selectedCompetition?.id === action.payload.id) {
          state.selectedCompetition = {
            ...state.selectedCompetition,
            ...action.payload,
          };
        }
      })
      .addCase(partialUpdateCompetition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Competitions
      .addCase(fetchCompetitions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetitions.fulfilled, (state, action) => {
        state.loading = false;
        state.competitions = action.payload.competitions;
        state.totalItems = action.payload.totalItems;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchCompetitions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Competition by ID
      .addCase(fetchCompetitionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetitionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCompetition = action.payload;
      })
      .addCase(fetchCompetitionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Competition
      .addCase(deleteCompetition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompetition.fulfilled, (state, action) => {
        state.loading = false;
        state.competitions = state.competitions.filter(
          (c) => c.id !== action.payload
        );
        state.totalItems -= 1;
        if (state.selectedCompetition?.id === action.payload) {
          state.selectedCompetition = null;
        }
      })
      .addCase(deleteCompetition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Search Competitions
      .addCase(searchCompetitions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCompetitions.fulfilled, (state, action) => {
        state.loading = false;
        state.competitions = action.payload;
      })
      .addCase(searchCompetitions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Assign Sponsor
      .addCase(assignSponsor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignSponsor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.competitions.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.competitions[index] = action.payload;
        }
        if (state.selectedCompetition?.id === action.payload.id) {
          state.selectedCompetition = action.payload;
        }
      })
      .addCase(assignSponsor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Status
      .addCase(updateCompetitionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompetitionStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.competitions.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.competitions[index] = action.payload;
        }
        if (state.selectedCompetition?.id === action.payload.id) {
          state.selectedCompetition = action.payload;
        }
      })
      .addCase(updateCompetitionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add Prize
      .addCase(addPrize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPrize.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.competitions.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.competitions[index] = action.payload;
        }
        if (state.selectedCompetition?.id === action.payload.id) {
          state.selectedCompetition = action.payload;
        }
      })
      .addCase(addPrize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Campaign Status
      .addCase(updateCampaignStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCampaignStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.competitions.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.competitions[index] = action.payload;
        }
        if (state.selectedCompetition?.id === action.payload.id) {
          state.selectedCompetition = action.payload;
        }
      })
      .addCase(updateCampaignStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedCompetition, clearError } =
  competitionsSlice.actions;
export default competitionsSlice.reducer;
