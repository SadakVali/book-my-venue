// imports from packages
import { createSlice } from "@reduxjs/toolkit";

// initialize variables
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
};

// creating a new slice of information
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, value) {
      state.user = value.payload;
    },
  },
});

export const { setUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
