// imports from packages
import { createSlice } from "@reduxjs/toolkit";

// initialize variables
const initialState = {
  loading: false,
  venues: JSON.parse(localStorage.getItem("venues")) || [],
  // venue: JSON.parse(localStorage.getItem("venue")) || null,
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
      state.venues.push(value.payload);
    },
    // setVenue(state, value) {
    //   state.venue.push(value.payload);
    // },
  },
});

export const { setVenues, setLoading } = venueSlice.actions;
export default venueSlice.reducer;
