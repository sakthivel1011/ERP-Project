import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerService } from "../Services/customer";


export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue ,signal}) => {
    try {
      const response = await customerService.getUsers(signal);

      return response.data.users || response.data;
    } catch (error) {
      if (error.name === 'AbortError' || error.message === 'canceled') {
        throw error; 
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false, 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; 
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
         if (action.meta.aborted) {
          return; 
        }
        state.error = action.payload || "Something went wrong";
      });
      
  },
});

export default userSlice.reducer;
