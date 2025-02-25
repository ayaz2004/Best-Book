import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const token = user.currentUser?.accessToken;
      const res = await fetch(`/api/order/getordersbyuser`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch orders");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = [];
      });
  },
});

export default orderSlice.reducer;
