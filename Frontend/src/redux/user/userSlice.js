import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  phoneNumber: null,
  sessionExpiry: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      state.sessionExpiry = Date.now() + 24 * 60 * 60 * 1000;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.phoneNumber = null;
      state.error = null;
      state.loading = false;
      state.sessionExpiry = null;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
      state.error = null;
    },
    clearPhoneNumber: (state) => {
      state.phoneNumber = null;
    },
    handleSessionExpired: (state) => {
      state.currentUser = null;
      state.error = "Session expired. Please login again.";
      state.loading = false;
      state.sessionExpiry = null;
      state.phoneNumber = null;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
  setPhoneNumber,
  clearPhoneNumber,
  handleSessionExpired,
} = userSlice.actions;

export const selectIsSessionValid = (state) => {
  return state.user.sessionExpiry && Date.now() < state.user.sessionExpiry;
};

export default userSlice.reducer;
