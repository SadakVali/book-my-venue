// imports from packages
import { createSlice } from "@reduxjs/toolkit";

// initialize variables
const initialState = {
  loading: false,
  venue: JSON.parse(localStorage.getItem("venue") || null),
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
    setVenue(state, value) {
      state.venue = value.payload;
    },
    setVenues(state, value) {
      state.venues = value.payload;
    },
  },
});

export const { setVenues, setVenue, setLoading } = venueSlice.actions;
export default venueSlice.reducer;
