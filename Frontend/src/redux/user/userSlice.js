import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  phoneNumber: null,
  subscribedEbook: [], // Add this line
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
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
      state.error = null;
    },
    clearPhoneNumber: (state) => {
      state.phoneNumber = null;
    },
    updateSubscribedEbooks: (state, action) => {
      if (state.currentUser) {
       
        state.subscribedEbook = action.payload
      
      }
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      state.subscribedEbook = action.payload.subscribedEbook || [];
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
  updateSubscribedEbooks
} = userSlice.actions;

export default userSlice.reducer;
