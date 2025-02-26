import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    address: [],
    loading: false,
    error: null,
  },
  reducers: {
    addressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addressSuccess: (state, action) => {
      state.loading = false;
      state.address = action.payload;
      state.error = null;
    },
    addressFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setAddresses: (state, action) => {
      state.address = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  addressStart,
  addressSuccess,
  addressFailure,
  setAddresses,
  setLoading,
  setError,
} = addressSlice.actions;

export default addressSlice.reducer;
