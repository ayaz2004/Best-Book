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
      console.log(data);
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
      const { productId, productType } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(item.product._id === productId && item.productType === productType)
      );
      state.subtotal = state.items.reduce((total, item) => {
        const price = item.product.price || 0;
        const discount =
          item.productType === "ebook"
            ? item.product.ebookDiscount
            : item.product.hardcopyDiscount;
        const discountedPrice = price - (price * discount) / 100;
        return total + discountedPrice * item.quantity;
      }, 0);
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
        state.items = action.payload?.items || [];
        state.subtotal = action.payload?.subtotal || 0;
        state.total = action.payload?.total || 0;
        state.discount = action.payload?.discount || 0;
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
