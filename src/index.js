import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
