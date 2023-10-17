// import from packages
import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  loading: false,
  myVenue: null,
  myBookings: null,
};

// creating the slice
const authSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setMyVenue(state, value) {
      state.myVenue = value.payload;
    },
    setMyBookings(state, value) {
      state.myBookings = value.payload;
    },
  },
});

// export const { setSignupData, setLoading, setToken } = authSlice.actions;
export const { setMyVenue, setLoading, setMyBookings } = authSlice.actions;
export default authSlice.reducer;
