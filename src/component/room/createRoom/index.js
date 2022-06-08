import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import socket from "../../../config/socket.config";
import { setRoom } from "../../../redux/room/roomSlice";
import CustomModal from "../../model";

function CreateRoom() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [details, setDetails] = useState({
    name: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("createRoom", details);
    socket.on("roomCreated", (data) => {
      dispatch(setRoom(data));
      onClose();
    });
  };

  const handleChangeInput = (e) =>
    setDetails({ ...details, [e.target.name]: e.target.value });
  return (
    <>
      <Button colorScheme="pink" type="submit" onClick={onOpen}>
        Create Room
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
        title="Create Room"
        body={
          <Box>
            <FormControl isRequired>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                type="text"
                name="name"
                onChange={handleChangeInput}
              />
              <FormHelperText>Enter the Room Name</FormHelperText>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="text"
                name="password"
                onChange={handleChangeInput}
              />
              <FormHelperText>Enter the Password</FormHelperText>
            </FormControl>
          </Box>
        }
      />
    </>
  );
}

export default CreateRoom;
