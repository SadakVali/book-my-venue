// imports from packages
import { createSlice } from "@reduxjs/toolkit";

// initialize variables
const initialState = {
  user: !!localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
};

// creating a new slice of information
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, value) {
      console.log("Entered the setUser reducer...");
      console.log(value.payload);
      state.user = value.payload;
      console.log("setUser Reducer End...", state.user);
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
