import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
  projects: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<any[]>) {
      state.projects = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setProjects, setLoading, setError } = projectSlice.actions;
export default projectSlice.reducer;
