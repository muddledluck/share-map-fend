import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "./room/roomSlice";
export const store = configureStore({
  reducer: {
    room: roomReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
