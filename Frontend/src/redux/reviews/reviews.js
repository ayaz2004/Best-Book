import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch reviews for a specific book by its ID
export const fetchBookReviews = createAsyncThunk(
  'reviews/fetchBookReviews',
  async (bookId) => {
    const response = await fetch(`/api/reviews/approvedreviews/${bookId}`); // Pass the bookId to the API
    if (!response.ok) {
      throw new Error('Failed to fetch book reviews');
    }
    const data = await response.json();
    return data.reviews;
  }
);

// Async thunk to fetch approved reviews
export const fetchApprovedReviews = createAsyncThunk(
  'reviews/fetchApprovedReviews',
  async () => {
    const response = await fetch('/api/reviews/approvereview'); // Get approved reviews
    if (!response.ok) {
      throw new Error('Failed to fetch approved reviews');
    }
    const data = await response.json();
    return data.reviews;
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    bookReviews: [],
    approvedReviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch book reviews
      .addCase(fetchBookReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.bookReviews = action.payload;
      })
      .addCase(fetchBookReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch approved reviews
      .addCase(fetchApprovedReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApprovedReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedReviews = action.payload;
      })
      .addCase(fetchApprovedReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default reviewsSlice.reducer;
