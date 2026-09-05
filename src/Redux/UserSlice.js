import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerService } from "../Services/customer";

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue, signal }) => {
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

export const createInvoiceThunk = createAsyncThunk(
  "users/createInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response =
        await customerService.createInvoice(invoiceData);

        console.log("FULL RESPONSE", response)
        console.log("RESPONSE DATA", response.data)

      return {
        ...invoiceData,
        ...response.data,
      };

    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: {
      customers: [],
      quotations: [],
      invoices: []
    },
    loading: false, 
    createLoading: false,
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
      })


      .addCase(createInvoiceThunk.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      
      
      .addCase(createInvoiceThunk.fulfilled, (state, action) => {
        state.createLoading = false;
        state.error = null;

        if (state.list && Array.isArray(state.list.invoices)) {
          state.list.invoices.push(action.payload); 
        } else {
          state.list = {
            ...state.list,
            invoices: [action.payload]
          };
        }
        alert("Invoice successfully saved into db.json server!");
      })
      
      .addCase(createInvoiceThunk.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || "Failed to create invoice";
        console.log("New Invoice Creation Failure Trace:", action.payload);
      });
  }, 
}); 

export default userSlice.reducer;
