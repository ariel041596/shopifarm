import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "../src/store.js";
import "./bootstrap.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#343A40",
    },
    secondary: {
      main: "#ffffff",
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
