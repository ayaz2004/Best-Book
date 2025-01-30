import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const response = await fetch("/api/cart/getcart", {
        headers: {
          "Authorization": `Bearer ${user.currentUser.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.cartData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    loading: false,
    error: null,
    couponApplied: false,
  },
  reducers: {
    addToCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.error = null;
    },
    addToCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload
      );
      state.subtotal = state.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      state.total = state.subtotal - state.discount;
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.total = 0;
      state.discount = 0;
      state.couponApplied = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.total = action.payload.total;
        state.discount = action.payload.discount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
