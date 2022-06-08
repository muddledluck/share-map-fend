import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  password: "",
  owner: "",
  users: [],
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoom: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    leaveRoom: (state) => {
      state.room = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRoom, leaveRoom } = roomSlice.actions;

export default roomSlice.reducer;
