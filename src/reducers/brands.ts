import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import handleApiError from "../utils/errorHandler";
import { ENV } from "../config/env";
import { brands as mockBrands } from "../data/mockData";

// Define the Brand interface
export interface Brand {
  id: number;
  name: string;
  username?: string;
  logo?: string;
  status?: string;
  createdBy?: string;
  createdOn?: string;
  updatedBy?: string;
  updatedOn?: string;
}

// Define the create/update brand payload
export interface BrandPayload {
  name: string;
  username?: string;
  logo?: string;
  status?: string;
  createdBy?: string;
  createdOn?: string;
  updatedBy?: string;
  updatedOn?: string;
}

// Initial state interface
interface BrandsState {
  brands: Brand[];
  selectedBrand: Brand | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: BrandsState = {
  brands: [],
  selectedBrand: null,
  loading: false,
  error: null,
};

// API base URL
const API_URL = "http://localhost:9001/api/sponsors";

// Async thunk to fetch brands
export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const timestamp = new Date().getTime();
      const response = await axios.get<Brand[]>(
        `${API_URL}?sort=id,asc&cacheBuster=${timestamp}`
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to fetch sponsors");
    }
  }
);

// Async thunk to fetch a brand by ID
export const fetchBrandById = createAsyncThunk(
  "brands/fetchBrandById",
  async (brandId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get<Brand>(`${API_URL}/${brandId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to fetch sponsor");
    }
  }
);

// Async thunk to create a new brand
export const createBrand = createAsyncThunk(
  "brands/createBrand",
  async (brandData: BrandPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post<Brand>(API_URL, brandData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to create sponsor");
    }
  }
);

// Async thunk to update a brand
export const updateBrand = createAsyncThunk(
  "brands/updateBrand",
  async (
    { id, data }: { id: number; data: BrandPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<Brand>(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to update sponsor");
    }
  }
);

// Async thunk to delete a brand
export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async (brandId: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${brandId}`);
      return brandId;
    } catch (error) {
      handleApiError(error);
      return rejectWithValue("Failed to delete sponsor");
    }
  }
);

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    resetBrands: (state) => {
      state.brands = [];
      state.selectedBrand = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch brands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch brand by ID
      .addCase(fetchBrandById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBrand = action.payload;
      })
      .addCase(fetchBrandById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create brand
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update brand
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.brands.findIndex(
          (brand) => brand.id === action.payload.id
        );
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
        if (state.selectedBrand?.id === action.payload.id) {
          state.selectedBrand = action.payload;
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete brand
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = state.brands.filter(
          (brand) => brand.id !== action.payload
        );
        if (state.selectedBrand?.id === action.payload) {
          state.selectedBrand = null;
        }
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetBrands } = brandsSlice.actions;
export default brandsSlice.reducer;
