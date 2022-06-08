import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import Room from "./component/room";
import { googleMapsApiKey } from "./config";
import socket, { socketManager } from "./config/socket.config";

function App() {
  const { id: roomId } = useSelector((state) => state.room);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey,
    libraries: ["places"],
  });
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const [origin, setOrigin] = useState();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const [destination, setDestination] = useState();

  useEffect(() => {
    socketManager();
  }, []);

  async function calculateRoute() {
    if (origin === "" || destination === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: origin,
      destination: destination,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setOrigin("");
    setDestination("");
  }

  useEffect(() => {
    navigator.geolocation.watchPosition(function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      if (roomId) socket.emit("locationUpdate", { lat, lng, roomId });
      setCurrentPosition({ lat, lng });
      setCenter({ lat, lng });
    });
  }, [roomId]);

  useEffect(() => {
    socket.on("locationUpdate", (data) => {
      console.log({ updatedLocation: data });
    });
  });

  const getAddress = useCallback(async (lat, lng) => {
    try {
      // eslint-disable-next-line no-undef
      const geocoder = new google.maps.Geocoder();
      // eslint-disable-next-line no-undef
      const latLng = new google.maps.LatLng(lat, lng);
      const response = await geocoder.geocode({ location: latLng });
      setOrigin(response.results[0].formatted_address);
    } catch (error) {
      console.log("errorGetAddress: ", error);
    }
  }, []);
  useEffect(() => {
    if (map) {
      getAddress(currentPosition.lat, currentPosition.lng);
    }
  }, [map, currentPosition, getAddress]);

  if (!isLoaded) {
    return <SkeletonText />;
  }
  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={currentPosition} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius="lg"
        mt={4}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="modal"
      >
        <HStack spacing={4}>
          <Autocomplete>
            <Input
              type="text"
              placeholder="Origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </Autocomplete>
          <Autocomplete>
            <Input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </Autocomplete>
          <ButtonGroup>
            <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance}</Text>
          <Text>Duration: {duration}</Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(currentPosition)}
          />
        </HStack>
      </Box>
      <Box
        p={2}
        borderRadius="lg"
        mt={2}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="modal"
      >
        <HStack spacing={4}>
          <Room />
        </HStack>
      </Box>
    </Flex>
  );
}

export default App;
