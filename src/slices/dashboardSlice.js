// imports from packages
import { createSlice } from "@reduxjs/toolkit";
import { BOOKING_STATUS } from "../utils/constants";

// initialize variables
const initialState = {
  // cancelledBookings: null,
  paymentDueToadyBookings: null,
  index: 0,
  // advancePaidBookings: null,
  // occasionPastBookings: null,
  // bookedBookings: null,
  loading: false,
};

// creating a new slice of information
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // setCancelledBookings(state, value) {
    //   state.cancelledBookings = value.payload;
    // },
    setPaymentDueToadyBookings(state, value) {
      state.paymentDueToadyBookings = value.payload;
    },
    setIndex(state, value) {
      state.index = state.index + value.payload;
    },
    setBookingStatus(state, value) {
      const temp = [...state.paymentDueToadyBookings];
      let index;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i]._id === value.payload.id) {
          index = i;
          break;
        }
      }
      temp[index].bookingStatus = value.payload.status;
      if (value.payload.status === BOOKING_STATUS.BOOKED)
        temp[index].fullyPaidDate = Math.floor(Date.now() / 1000);
      state.paymentDueToadyBookings = temp;
    },
    setBookingSummary(state, value) {
      const temp = [...state.paymentDueToadyBookings];
      let index;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i]._id === value.payload.id) {
          index = i;
          break;
        }
      }
      temp[index].paymentSummary = value.payload.paymentSummary;
      state.paymentDueToadyBookings = temp;
    },
    // setAdvancePaidBookings(state, value) {
    //   state.advancePaidBookings = value.payload;
    // },
    // setBookedBookings(state, value) {
    //   state.bookedBookings = value.payload;
    // },
    // setOccasionPastBookings(state, value) {
    //   state.occasionPastBookings = value.payload;
    // },
    setLoading(state, value) {
      state.loading = value.payload;
    },
  },
});

export const {
  // setCustomerBookings,
  // setBookedBookings,
  // setCancelledBookings,
  setPaymentDueToadyBookings,
  setBookingStatus,
  setBookingSummary,
  // setAdvancePaidBookings,
  // setOccasionPastBookings,
  setLoading,
  setIndex,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
