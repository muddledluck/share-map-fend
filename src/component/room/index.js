import { Text } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import CreateRoom from "./createRoom";
import JoinRoom from "./joinRoom";

function Room() {
  const { id, name } = useSelector((state) => state.room);
  return (
    <div>
      {!id ? (
        <>
          <CreateRoom />
          <JoinRoom />
        </>
      ) : (
        <>
          <Text>You are in {name}</Text>
        </>
      )}
    </div>
  );
}

export default Room;
