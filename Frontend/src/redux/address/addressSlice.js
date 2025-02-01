import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address:null,
  error: null,
  loading: false,
 
};

const addressSlice = createSlice({
  name: "address",
  initialState,
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
  },
});

export const {
    addressStart,
    addressSuccess,
    addressFailure,
} = addressSlice.actions;

export default addressSlice.reducer;
