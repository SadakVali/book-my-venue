const BACKEND_BASE_URL = process.env.REACT_APP_BASE_URL;

// AUTH END POINTS
export const authEndPoints = {
  SIGNUP_API: BACKEND_BASE_URL + "/auth/signup",
  LOGIN_API: BACKEND_BASE_URL + "/auth/login",
};

// CONTACTUS API
export const contactUsEndPoint = {
  CONTACT_US_API: BACKEND_BASE_URL + "/reach/contact",
};

// BOOKINGS END POINTS
export const bookingEndPoints = {
  CREATE_NEW_BOOKING_API: BACKEND_BASE_URL + "/booking/create-booking",
  VENUE_BOOKINGS_GIVEN_MONTH_API:
    BACKEND_BASE_URL + "/booking/bookings-given-month",
};

// VENUE END POINTS
export const venueEndPoints = {
  CREATE_NEW_VENUE_API: BACKEND_BASE_URL + "/venue/create-venue",
  EDIT_VENUE_DETAILS_API: BACKEND_BASE_URL + "/venue/edit-venue",
  // FETCH_SINGLE_VENUE_DETAILS_API:
  //   BACKEND_BASE_URL + "/venue/venue-complete-details",
  FETCH_ALL_VENUES_API: BACKEND_BASE_URL + "/venue/get-details-of-all-venues",
};

// MANAGER DASHBOARD END POINTS
export const dashboardEndPoints = {
  FETCH_CUSTOMER_RECIEPTS_API:
    BACKEND_BASE_URL + "/dashboard/fetch-customer-reciepts",
  FETCH_ALL_CANCELLED_BOOKINGS_API:
    BACKEND_BASE_URL + "/dashboard/get-cencelled-bookings",
  FETCH_ADVANCE_PAID_BOOKINGS_API:
    BACKEND_BASE_URL + "/dashboard/get-advance-only-paid-bookings",
  FETCH_ALL_BOOKED_RECIEPTS_API:
    BACKEND_BASE_URL + "/dashboard/get-completely-booked-reciepts",
  FETCH_COMPLETED_BOOKINGS_API:
    BACKEND_BASE_URL + "/dashboard/get-bookings-past-occation",
  FETCH_PAYMENTS_DUE_TODAY_BOOKINGS_API:
    BACKEND_BASE_URL + "/dashboard/get-payment-due-today-bookings",
  CANCEL_A_SINGLE_BOOKING_API: BACKEND_BASE_URL + "/dashboard/cancel-booking",
  CHANGE_STATUS_TO_BOOKED_API:
    BACKEND_BASE_URL + "/dashboard/complete-a-booking",
  UPDATE_PAYMENT_SUMMARY_API: BACKEND_BASE_URL + "/dashboard/update-summary",
};
