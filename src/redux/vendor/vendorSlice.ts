import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VendorState {
  vendors: any[];
  loading: boolean;
  error: string | null;
}

const initialState: VendorState = {
  vendors: [],
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setVendors(state, action: PayloadAction<any[]>) {
      state.vendors = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setVendors, setLoading, setError } = vendorSlice.actions;
export default vendorSlice.reducer;
