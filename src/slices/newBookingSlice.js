// imports from packages
import { createSlice } from "@reduxjs/toolkit";

// initialize variables
const initialState = {
  loading: false,
  venueBookingsGivenMonth: [],
  checkIn: {
    date: null,
    time: null,
  },
  checkOut: {
    date: null,
    time: null,
  },
  bookingInfo: null,
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
      state.venueBookingsGivenMonth = value.payload;
    },
    setCheckIn(state, value) {
      state.checkIn.date = value.payload.date;
      state.checkIn.time = value.payload.time;
    },
    setCheckOut(state, value) {
      state.checkOut.date = value.payload.date;
      state.checkOut.time = value.payload.time;
    },
    setBookingInfo(state, value) {
      state.bookingInfo = value.payload;
    },
  },
});

export const {
  setLoading,
  setVenueBookingsGivenMonth,
  setCheckIn,
  setCheckOut,
  setBookingInfo,
} = newBookingSlice.actions;
export default newBookingSlice.reducer;
