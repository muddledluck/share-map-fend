import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import socket from "../../../config/socket.config";
import { setRoom } from "../../../redux/room/roomSlice";
import CustomModal from "../../model";

function JoinRoom() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [details, setDetails] = useState({
    roomId: "",
    password: "",
  });

  const handleInputChange = (e) =>
    setDetails({ ...details, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("joinRoom", details);
    socket.on("roomNotFound", () =>
      toast({
        title: `Room not found`,
        status: "error",
        isClosable: true,
        // duration: 5000,
      })
    );
    socket.on("joinedRoom", (data) => {
      dispatch(setRoom(data));
      onClose();
      toast({
        title: `Joined Room ${data.name}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    });
  };

  const isErrorRoomId = !details.roomId;
  const isErrorPassword = !details.password;
  return (
    <>
      <Button colorScheme="pink" type="submit" onClick={onOpen}>
        Join Room
      </Button>
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        footer={
          <ButtonGroup colorScheme="blue" mr={3}>
            <Button onClick={handleSubmit}>Submit</Button>
            <Button onClick={onClose}>Cancel</Button>
          </ButtonGroup>
        }
        title="Join Room"
        body={
          <Box>
            <FormControl isRequired>
              <FormLabel htmlFor="roomId">Room Id</FormLabel>
              <Input
                id="roomId"
                type="text"
                name="roomId"
                value={details.roomId}
                onChange={handleInputChange}
              />
              {!isErrorRoomId ? (
                <FormHelperText>
                  Enter the Room Id that you want to join
                </FormHelperText>
              ) : (
                <FormErrorMessage>Room Id is required</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="text"
                name="password"
                value={details.password}
                onChange={handleInputChange}
              />
              {!isErrorPassword ? (
                <FormHelperText>Enter the Password</FormHelperText>
              ) : (
                <FormErrorMessage>Password is required</FormErrorMessage>
              )}
            </FormControl>
          </Box>
        }
      />
    </>
  );
}

export default JoinRoom;
