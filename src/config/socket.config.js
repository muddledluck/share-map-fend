import { io } from "socket.io-client";
import { SERVER_URL } from "../config";

const socket = io(SERVER_URL);

socket.on("connect_error", (err) => {
  console.log("error: ", err);
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context);
});

export const socketManager = () => {
  socket.on("connect", () => {
    console.log(`Connect to backend ${socket.id}`);
  });
  
  socket.on("disconnect", (reason) => {
    console.log(`Connection Failed, Reason: ${reason}`);
  });
};

export default socket;
