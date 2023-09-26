// imports from packages
import { createSlice } from "@reduxjs/toolkit";

// initialize variables
const initialState = {
  loading: false,
  venueBookingsGivenMonth: [],
};

// creating a new slice of information
const newBookingSlice = createSlice({
  name: "newBooking",
  initialState,
  reducers: {
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setVenueBookingsGivenMonth(state, value) {
      state.venueBookingsGivenMonth.push(value.payload);
    },
  },
});

export const { setLoading, setVenueBookingsGivenMonth } =
  newBookingSlice.actions;
export default newBookingSlice.reducer;
