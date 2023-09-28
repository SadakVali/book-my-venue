// imports from packages
import { createSlice } from "@reduxjs/toolkit";

// initialize variables
const initialState = {
  loading: false,
  venues: JSON.parse(localStorage.getItem("venues")) || [],
};

// creating a new slice of information
const venueSlice = createSlice({
  name: "venue",
  initialState,
  reducers: {
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setVenues(state, value) {
      state.venues = value.payload;
    },
  },
});

export const { setVenues, setLoading } = venueSlice.actions;
export default venueSlice.reducer;
