import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  totalVendors: number;
  totalProjects: number;
  totalProducts: number;
  recentVendors: any[];
  recentProducts: any[];
}

const initialState: DashboardState = {
  totalVendors: 0,
  totalProjects: 0,
  totalProducts: 0,
  recentVendors: [],
  recentProducts: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardStats(state, action: PayloadAction<Partial<DashboardState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setDashboardStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
