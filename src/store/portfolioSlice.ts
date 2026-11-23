import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFirstPortfolioWithUserId, getPortfolio } from '../firebase/services/portfolio.service';
import type { PortfolioData } from '../firebase/types/portfolio.types';
import { warmHeroPortrait } from '../utils/warmHeroPortrait';

export type PortfolioState = {
  data: PortfolioData | null;
  portfolioUserId: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: PortfolioState = {
  data: null,
  portfolioUserId: null,
  loading: true,
  error: null,
};

export const fetchPortfolio = createAsyncThunk<
  { data: PortfolioData; userId: string } | null,
  void,
  { rejectValue: { message: string } }
>(
  'portfolio/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const userId = process.env.REACT_APP_PORTFOLIO_USER_ID?.trim();
      let result: { data: PortfolioData; userId: string } | null;
      if (userId) {
        const data = await getPortfolio(userId);
        result = data ? { data, userId } : null;
      } else {
        result = await getFirstPortfolioWithUserId();
      }
      warmHeroPortrait(result?.data.avatarUrl);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load portfolio';
      return rejectWithValue({ message });
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setLoadFailed: (state, action: { payload: { error: string } }) => {
      state.loading = false;
      state.error = action.payload.error;
      state.data = null;
      state.portfolioUserId = null;
    },
    setLoadingComplete: (state) => {
      state.loading = false;
    },
    resetPortfolio: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          state.data = action.payload.data;
          state.portfolioUserId = action.payload.userId;
        } else {
          state.data = null;
          state.portfolioUserId = null;
        }
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? 'Failed to load portfolio';
        state.data = null;
        state.portfolioUserId = null;
      });
  },
});

export const { setLoadFailed, setLoadingComplete, resetPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
